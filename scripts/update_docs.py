#!/usr/bin/env python3

import os
import re
from datetime import datetime

def get_version():
    """Get version from package.json"""
    try:
        with open('frontend/package.json', 'r') as f:
            content = f.read()
            version_match = re.search(r'"version":\s*"([^"]+)"', content)
            return version_match.group(1) if version_match else 'Unknown'
    except Exception as e:
        print(f"Error reading version: {e}")
        return 'Unknown'

def get_component_docs(file_path):
    """Extract documentation from a React component file"""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
            
        # Extract component name
        component_match = re.search(r'export\s+(?:default\s+)?function\s+(\w+)', content)
        component_name = component_match.group(1) if component_match else 'Unknown'
        
        # Extract props
        props = re.findall(r'{\s*([^}]+)\s*}[^=]*=', content)
        props = [prop.strip() for prop in props if prop.strip()]
        
        # Extract hooks
        hooks = re.findall(r'use\w+\(', content)
        hooks = [hook[:-1] for hook in hooks]
        
        return {
            'name': component_name,
            'props': props,
            'hooks': hooks,
            'file': os.path.basename(file_path)
        }
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def generate_markdown(components):
    """Generate markdown documentation"""
    version = get_version()
    today = datetime.now().strftime('%Y-%m-%d')
    
    md = f"""# Hardware Monitor Documentation
Version: {version}
Last Updated: {today}

## Components

"""
    
    for comp in components:
        if not comp:
            continue
            
        md += f"### {comp['name']}\n"
        md += f"File: `{comp['file']}`\n\n"
        
        if comp['props']:
            md += "#### Props\n"
            for prop in comp['props']:
                md += f"- `{prop}`\n"
            md += "\n"
            
        if comp['hooks']:
            md += "#### Hooks Used\n"
            for hook in comp['hooks']:
                md += f"- `{hook}`\n"
            md += "\n"
        
        md += "---\n\n"
    
    return md

def update_docs():
    """Main function to update documentation"""
    components_dir = 'frontend/src/MyComponents'
    output_file = 'docs/COMPONENTS.md'
    
    try:
        # Create docs directory if it doesn't exist
        os.makedirs('docs', exist_ok=True)
        
        # Get all component files
        component_files = []
        for root, _, files in os.walk(components_dir):
            for file in files:
                if file.endswith('.js') and not file.endswith('.test.js'):
                    component_files.append(os.path.join(root, file))
        
        # Process each component
        components = []
        for file_path in component_files:
            doc = get_component_docs(file_path)
            if doc:
                components.append(doc)
        
        # Generate and write markdown
        markdown = generate_markdown(components)
        with open(output_file, 'w') as f:
            f.write(markdown)
            
        print(f"Documentation updated successfully: {output_file}")
        
    except Exception as e:
        print(f"Error updating documentation: {e}")
        return False
        
    return True

if __name__ == "__main__":
    update_docs() 