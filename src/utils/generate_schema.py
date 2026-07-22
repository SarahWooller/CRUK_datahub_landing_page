import json
import copy
import os

def js_deep_merge(target, source):
    """
    Replicates the deepMerge logic from SchemaPage.jsx:
    Arrays are overwritten, objects are deeply merged, primitives are overwritten.
    """
    if not isinstance(target, dict) or target is None:
        return source if source is not None else target
    if not isinstance(source, dict) or source is None:
        return target

    output = copy.deepcopy(target)

    for key, source_val in source.items():
        target_val = output.get(key)

        if isinstance(target_val, list) and isinstance(source_val, list):
            output[key] = source_val
        elif isinstance(target_val, dict) and isinstance(source_val, dict):
            output[key] = js_deep_merge(target_val, source_val)
        else:
            output[key] = source_val

    return output

def load_schema(filepath):
    """
    Replicates the schema loading logic:
    schema.properties ? schema : (schema.fullContent || schema)
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if isinstance(data, dict):
        if 'properties' in data:
            return data
        if 'fullContent' in data:
            return data['fullContent']
    return data

if __name__ == "__main__":
    # Ensure we are operating in the utils directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    try:
        print("Loading schemas...")
        hdruk = load_schema("HDRUK4.0.0.json")
        cruk = load_schema("CRUK1.0.0.json")
        overlay = load_schema("semanticSchema.json")

        print("Merging HDRUK and CRUK schemas...")
        mid = js_deep_merge(hdruk, cruk)
        
        print("Applying semantic overlay...")
        final = js_deep_merge(mid, overlay)

        output_path = "data_schema.json"
        with open(output_path, "w", encoding='utf-8') as f:
            json.dump(final, f, indent=2)
            
        print(f"Successfully generated {output_path}")
    except Exception as e:
        print(f"Error: {e}")
