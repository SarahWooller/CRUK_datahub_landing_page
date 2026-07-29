import json


def resolve_ref(ref_str, defs):
    ref_name = ref_str.split('/')[-1]
    return defs.get(ref_name, {})


def get_properties(schema_node, defs):
    if not isinstance(schema_node, dict):
        return {}

    props = {}

    # Process direct properties
    if "properties" in schema_node:
        props.update(schema_node["properties"])

    # Process anyOf / allOf for nested references or array items
    for key in ["anyOf", "allOf"]:
        if key in schema_node:
            for item in schema_node[key]:
                if isinstance(item, dict):
                    if "$ref" in item:
                        resolved = resolve_ref(item["$ref"], defs)
                        props.update(get_properties(resolved, defs))
                    elif item.get("type") == "array" and "items" in item:
                        if isinstance(item["items"], dict) and "$ref" in item["items"]:
                            resolved = resolve_ref(item["items"]["$ref"], defs)
                            props.update(get_properties(resolved, defs))

    # Process direct references
    if "$ref" in schema_node:
        resolved = resolve_ref(schema_node["$ref"], defs)
        props.update(get_properties(resolved, defs))

    # Process array items
    if schema_node.get("type") == "array" and "items" in schema_node:
        items = schema_node["items"]
        if isinstance(items, dict) and "$ref" in items:
            resolved = resolve_ref(items["$ref"], defs)
            props.update(get_properties(resolved, defs))

    return props


def build_tree(data):
    visible = data.get("visibleSections", [])
    included = data.get("included", {})
    defs = data.get("$defs", {})
    root_props = data.get("properties", {})

    # Create case-insensitive map to handle casing discrepancies between visibleSections and $defs
    defs_ci = {k.lower(): k for k in defs.keys()}

    output = []

    def traverse(name, prop_node, depth):
        indent = "  " * depth
        output.append(f"{indent}- {name}")

        children_props = get_properties(prop_node, defs)
        keys_to_visit = list(children_props.keys())

        # Apply filtering if the node is at the root level and present in the included list
        if depth == 0 and name in included:
            keys_to_visit = [k for k in keys_to_visit if k in included[name]]
            # Ensure keys explicitly listed in 'included' but missing from base properties are still added
            for k in included[name]:
                if k not in keys_to_visit:
                    output.append(f"{indent}  - {k}")

        for child_name in keys_to_visit:
            if child_name in children_props:
                traverse(child_name, children_props[child_name], depth + 1)

    for section in visible:
        if section in root_props:
            traverse(section, root_props[section], 0)
        elif section.lower() in defs_ci:
            actual_def_key = defs_ci[section.lower()]
            traverse(section, defs[actual_def_key], 0)
        else:
            output.append(f"- {section}")

    return "\n".join(output)


