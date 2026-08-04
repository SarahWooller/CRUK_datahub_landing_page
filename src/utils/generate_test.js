const fs = require('fs');
const hdrukSchema = require('./HDRUK4.0.0.json');
const crukSchema = require('./CRUK1.0.0.json');
const semanticSchema = require('cruk-semantic-schema');

const deepMerge = (target, source) => {
    if (typeof target !== 'object' || target === null) {
        return source !== undefined ? source : target;
    }
    if (typeof source !== 'object' || source === null) {
        return target;
    }

    const output = { ...target };
    Object.keys(source).forEach(key => {
        const sourceValue = source[key];
        const targetValue = output[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            output[key] = sourceValue; 
        } else if (typeof targetValue === 'object' && typeof sourceValue === 'object') {
            output[key] = deepMerge(targetValue, sourceValue);
        } else {
            output[key] = sourceValue;
        }
    });
    return output;
};

const hdruk_SCHEMA = hdrukSchema.properties ? hdrukSchema : (hdrukSchema.fullContent || {});
const cruk_SCHEMA = crukSchema.properties ? crukSchema : (crukSchema.fullContent || crukSchema);
const OVERLAY_SCHEMA = semanticSchema.properties ? semanticSchema : (semanticSchema.fullContent || semanticSchema);

const MID_SCHEMA = deepMerge(hdruk_SCHEMA, cruk_SCHEMA);
const DATA_SCHEMA = deepMerge(MID_SCHEMA, OVERLAY_SCHEMA);

fs.writeFileSync('test.json', JSON.stringify(DATA_SCHEMA, null, 2));

const resolveDef = (schema) => {
    if (!schema) return {};
    let resolved = schema;
    
    let refStr = null;
    if (schema.allOf && schema.allOf[0] && schema.allOf[0].$ref) {
        refStr = schema.allOf[0].$ref;
    } else if (schema.anyOf && schema.anyOf[0] && schema.anyOf[0].$ref) {
        refStr = schema.anyOf[0].$ref;
    } else if (schema.$ref) {
        refStr = schema.$ref;
    }

    if (refStr && refStr.startsWith('#/$defs/')) {
        const defName = refStr.split('#/$defs/')[1];
        if (DATA_SCHEMA.$defs && DATA_SCHEMA.$defs[defName]) {
            resolved = Object.assign({}, DATA_SCHEMA.$defs[defName], schema);
        }
    } else if (schema.items) {
        resolved = resolveDef(schema.items);
    }
    return resolved;
};

const requiredSections = DATA_SCHEMA.required || [];
const optionalSections = [];

if (DATA_SCHEMA.properties) {
    Object.keys(DATA_SCHEMA.properties).forEach(sectionKey => {
        if (!requiredSections.includes(sectionKey)) {
            optionalSections.push(sectionKey);
        }
    });
}

const getFieldDesc = (secSchema, fieldName) => {
    let propSchema = resolveDef(secSchema.properties[fieldName]);
    let desc = propSchema?.description || "No description provided";
    return desc.replace(/\n/g, ' ').trim();
};

let mdContent = `# DataSchema Requirements\n\n`;

mdContent += `## Required Sections\n\n`;
requiredSections.forEach(section => {
    mdContent += `### ${section} (Required Section)\n`;
    const secSchema = resolveDef(DATA_SCHEMA.properties[section]);
    if (secSchema && secSchema.properties) {
        const secReq = secSchema.required || [];
        if (secReq.length > 0) {
            mdContent += `**Required Fields:**\n`;
            secReq.forEach(f => mdContent += `- ${f} (${getFieldDesc(secSchema, f)})\n`);
            mdContent += `\n`;
        } else {
            mdContent += `*No fields are strictly required in this section.*\n\n`;
        }
        
        mdContent += `**Optional Fields:**\n`;
        const optionalFields = Object.keys(secSchema.properties).filter(f => !secReq.includes(f));
        if (optionalFields.length > 0) {
            optionalFields.forEach(f => mdContent += `- ${f} (${getFieldDesc(secSchema, f)})\n`);
        } else {
            mdContent += `*None*\n`;
        }
    } else {
        mdContent += `*Primitive value (No sub-fields)*\n`;
    }
    mdContent += `\n---\n\n`;
});

mdContent += `## Optional Sections\n\n`;
optionalSections.forEach(section => {
    mdContent += `### ${section} (Optional Section)\n`;
    const secSchema = resolveDef(DATA_SCHEMA.properties[section]);
    if (secSchema && secSchema.properties) {
        const secReq = secSchema.required || [];
        if (secReq.length > 0) {
            mdContent += `**Required Fields (if you choose to include this section):**\n`;
            secReq.forEach(f => mdContent += `- ${f} (${getFieldDesc(secSchema, f)})\n`);
            mdContent += `\n`;
        } else {
            mdContent += `*No fields are strictly required in this section.*\n\n`;
        }
        
        mdContent += `**Optional Fields:**\n`;
        const optionalFields = Object.keys(secSchema.properties).filter(f => !secReq.includes(f));
        if (optionalFields.length > 0) {
            optionalFields.forEach(f => mdContent += `- ${f} (${getFieldDesc(secSchema, f)})\n`);
        } else {
            mdContent += `*None*\n`;
        }
    } else {
        mdContent += `*Primitive value (No sub-fields)*\n`;
    }
    mdContent += `\n---\n\n`;
});

fs.writeFileSync('required.md', mdContent);
console.log('Successfully generated test.json and required.md');
