const fs = require('fs');

const DATA_SCHEMA = JSON.parse(fs.readFileSync('test.json', 'utf8'));

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

const requiredFields = [];
const optionalFields = [];

const walk = (schema, path, isParentRequired) => {
    schema = resolveDef(schema);

    if (schema.type === 'array' && schema.items) {
        walk(schema.items, path, isParentRequired);
        return;
    }

    if (schema.properties) {
        const reqList = schema.required || [];
        
        Object.keys(schema.properties).forEach(key => {
            const childSchema = resolveDef(schema.properties[key]);
            const isChildRequiredLocally = reqList.includes(key);
            const isGloballyRequired = isParentRequired && isChildRequiredLocally;
            
            const newPath = path ? `${path}.${key}` : key;
            
            if (isGloballyRequired) {
                requiredFields.push(newPath);
            } else {
                if (isChildRequiredLocally) {
                    optionalFields.push(`${newPath} (Required if parent '${path}' is provided)`);
                } else {
                    optionalFields.push(newPath);
                }
            }
            
            walk(childSchema, newPath, isGloballyRequired);
        });
    }
};

walk(DATA_SCHEMA, "", true);

let md = `# Required Data\n\n`;
requiredFields.forEach(f => md += `- ${f}\n`);
md += `\n# Optional Data\n\n`;
optionalFields.forEach(f => md += `- ${f}\n`);

fs.writeFileSync('required2.md', md);
console.log('Successfully generated required2.md');
