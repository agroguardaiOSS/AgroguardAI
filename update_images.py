#!/usr/bin/env python3
import os
import re
import glob

# Compile regex at module level for performance
RE_IMG_TAG = re.compile(r'<img\s[^>]*>')

# Mapping of old image files to new WebP files
image_map = {
    'mylogo.png': 'mylogo.webp',
    'african-impact-logo.png': 'african-impact-logo.webp',
    'agroguardllms.png': 'agroguardllms.webp',
    'agromind.png': 'agromind.webp',
    'agrobotics.png': 'agrobotics.webp',
    'agromind-mockup.jpg': 'agromind-mockup.webp',
    'drones.png': 'drones.webp',
    'groundrovers.png': 'groundrovers.webp',
    'hero-bg.jpg': 'hero-bg.webp',
    'agromind-bg.jpg': 'agromind-bg.webp',
    'agrorobotics-bg.jpg': 'agrorobotics-bg.webp',
    'intelligence-ai-core.png': 'intelligence-ai-core.webp',
    'intelligence-bg.png': 'intelligence-bg.webp',
    'AgroguardAIhero.png': 'AgroguardAIhero.webp',
}

def add_lazy_loading(match):
    img_tag = match.group(0)
    if 'loading=' not in img_tag:
        # Insert loading="lazy" before the closing >
        img_tag = img_tag.replace('>', ' loading="lazy">', 1)
    return img_tag

def process_html_content(content):
    """Processes HTML content to update image paths and add lazy loading."""
    # Update img src and href attributes
    for old_img, new_img in image_map.items():
        # Replace src="old.png" with src="new.webp"
        content = content.replace(f'src="{old_img}"', f'src="{new_img}"')
        content = content.replace(f"src='{old_img}'", f"src='{new_img}'")
        # Replace href="old.png" with href="new.webp"
        content = content.replace(f'href="{old_img}"', f'href="{new_img}"')
        content = content.replace(f"href='{old_img}'", f"href='{new_img}'")
    
    # Add lazy loading to img tags using pre-compiled regex
    content = RE_IMG_TAG.sub(add_lazy_loading, content)
    return content

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if script_dir:
        os.chdir(script_dir)

    html_files = glob.glob('*.html')

    print("Updating HTML files with WebP images and lazy loading...\n")

    for html_file in sorted(html_files):
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        content = process_html_content(content)

        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)

            # Count changes
            old_count = len(re.findall(r'\.(png|jpg|jpeg)(?=["\'])', original_content))
            new_count = len(re.findall(r'\.webp(?=["\'])', content))
            lazy_count = len(re.findall(r'loading=["\']lazy["\']', content))

            print(f"✓ {html_file:20} - Updated {old_count} images to WebP, {lazy_count} lazy loading attributes")
        else:
            print(f"- {html_file:20} - No changes needed")

    print("\n✓ All HTML files updated!")

if __name__ == '__main__':
    main()
