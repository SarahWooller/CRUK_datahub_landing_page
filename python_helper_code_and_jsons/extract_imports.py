import os
import re


def extract_imports(target_directory):
    # Regex to capture standard imports, destructuring imports, and side-effect imports
    # Handles multi-line imports by using re.DOTALL
    import_regex = re.compile(r'^import\s+.*?(?:from\s+[\'"].*?[\'"]|[\'"].*?[\'"]);?', re.MULTILINE | re.DOTALL)

    output_lines = []

    for root, dirs, files in os.walk(target_directory):
        # Exclude node_modules and build directories to save time
        if 'node_modules' in root or '.git' in root or 'dist' in root or 'build' in root:
            continue

        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = os.path.join(root, file)

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    imports = import_regex.findall(content)

                    if imports:
                        # Normalize path for better readability
                        display_path = os.path.relpath(file_path, target_directory)
                        output_lines.append(f"### File: {display_path}")

                        for imp in imports:
                            # Collapse multi-line imports into a single line for a denser summary
                            clean_imp = re.sub(r'\s+', ' ', imp).strip()
                            output_lines.append(clean_imp)

                        output_lines.append("")  # Empty line between files

                except Exception as e:
                    output_lines.append(f"Error reading {file_path}: {e}")

    return "\n".join(output_lines)


if __name__ == "__main__":
    # Point this to your src directory, or use "." for the current directory
    directory_to_scan = "./src"

    print(f"Scanning {directory_to_scan} for import statements...")
    summary = extract_imports(directory_to_scan)

    output_file = "../imports_summary.txt"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(summary)

    print(f"Done! The imports have been saved to {output_file}.")