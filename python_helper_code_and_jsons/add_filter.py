import argparse
import json

from typing import Dict, Any, List, Optional


class TreeNode:
    """
    Represents a single node in the hierarchical tree structure.
    """

    def __init__(
            self,
            id: str,
            label: str,
            category: str,
            primaryGroup: str,
            description: str,
            children: Optional[List['TreeNode']] = None,
    ):
        """
        Initializes a new tree node with data attributes.

        Args:
            id (str): The unique identifier for the node.
            label (str): The human-readable label or name.
            category (str): The category of the node.
            primaryGroup (str): The primary group classification.
            children (Optional[List['TreeNode']]): A list of child TreeNode objects.
        """
        self.id = id
        self.label = label
        self.category = category
        self.primaryGroup = primaryGroup
        self.description = description
        self.children: List['TreeNode'] = children if children is not None else []

    def __repr__(self):
        """
        Provides a string representation for debugging.
        """
        return f"TreeNode(id='{self.id}', label='{self.label}', children={len(self.children)})"

    def get_child(self, label):
        for child in self.children:
            if child.label == label:
                return child

    def add_child(self, label, description):
        identity = f"{self.id}_{len(self.children)}"
        child = TreeNode(id=identity, label=label, description=description, category=self.label,
                         primaryGroup=self.category)
        self.children.append(child)

    def add_children(self, labels, descriptions):
        for i, label in enumerate(labels):
            description = descriptions[i]
            self.add_child(label, description)

    def print_tree(self, level=0):
        """
        Recursively prints the structure of the tree.
        """
        indent = "  " * level
        print(f"{indent}- {self.label} (ID: {self.id})")
        for child in self.children:
            child.print_tree(level + 1)


def build_dict(tree: TreeNode) -> dict:
    "Recursively builds the new dictionary from the tree"

    dictionary = {}
    for label in ["id", "label", "category", "primaryGroup", "description"]:
        dictionary[label] = getattr(tree, label)
    if tree.children:
        dictionary["children"] = dict([(child.id, build_dict(child)) for child in tree.children])
    return dictionary


def build_tree(data: Dict[str, Any]) -> TreeNode:
    """
    Recursively builds the TreeNode structure from the raw dictionary data.

    Args:
        data (Dict[str, Any]): The raw dictionary data for a single node.

    Returns:
        TreeNode: The resulting object-oriented tree node.
    """
    # Extract core attributes
    node_id = data.get('id', '')
    label = data.get('label', '')
    category = data.get('category', '')
    primaryGroup = data.get('primaryGroup', 'cancer-type')
    description = data.get('description', '')

    # Initialize the current node
    current_node = TreeNode(
        id=node_id,
        label=label,
        category=category,
        primaryGroup=primaryGroup,
        description=description
    )

    # Check for children and recurse
    raw_children = data.get('children', {})
    if raw_children and isinstance(raw_children, dict):
        # Iterate over the values (the child dictionaries)
        for child_dict in raw_children.values():
            # Recursively build the child node
            child_node = build_tree(child_dict)
            current_node.children.append(child_node)

    return current_node


def add_a_filter(filters, place, description, output_path):
    place_list = place.split("/")
    lower = place_list[0].lower()
    cancer = build_tree(filters["0_0"])
    access = build_tree(filters["0_1"])
    data = build_tree(filters["0_2"])
    names = {"cancer": ("0_0", cancer), "access": ("0_1", access), "data": ("0_2", data)}
    node = ""
    for name in names:
        if name in lower:
            key, node = names[name]
            key, parent = names[name]
            break
    for child_name in place_list[1:-1]:
        try:
            node = node.get_child(child_name)
        except:
            node = ""
    if node:
        node.add_child(place_list[-1], description)
        filters[key] = build_dict(parent)
    with open(output_path, "w") as f:
        f.write("const theFilters =\n")
        json.dump(filters, f)
        f.write(";\nexport const filterData = theFilters;")

def main():
    parser = argparse.ArgumentParser(
        prog='add_filter',
        description="""adds a new filter to the filters based on the filter path and description given.""")

    parser.add_argument("path_to_filters", help="""file path to the existing filters. 
    The file of existing filters must be a .js file
    of the following format.
    const theFilters =
    
    json of filters eg;
    {"0_0": {"id": "0_0", "label": "cancerTypes", "category": "filters", "primaryGroup": "cancer-type", "description": "", "children":
    including at least 0_0, 0_1, and 0_2 as keys.
    
    export const filterData = theFilters;""")

    parser.add_argument("filter_path", help="""path within the filters to where the new filter should be added
    For example - data/Patient/clinical_trial will add a new filter to the Patient category with the label clinical_trial.
    The first part of the path should include data, cancer, or access and the last part should be the name of the new filter.""")
    parser.add_argument("description", help="""description of the new filter""")
    parser.add_argument("output_path", help="path to where the new filters should be saved.")
    args = parser.parse_args()

    with open(args.path_to_filters) as f:
        filters = eval("".join(f.read().split("\n")[1:-1])[:-1])

    add_a_filter(filters , args.filter_path, args.description, args.output_path)

if __name__ == "__main__":
    main()

