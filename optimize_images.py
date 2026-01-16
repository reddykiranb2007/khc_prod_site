
import os
import sys
from PIL import Image

# Configuration
EXTENSIONS = {'.jpg', '.jpeg', '.png'}
QUALITY = 85
SIZES = [320, 640, 1024, 1920]

def optimize_image(filepath):
    """
    Optimizes a single image:
    1. Generates WebP version.
    2. Generates responsive resized versions (in WebP).
    3. Compresses original if it's JPG.
    """
    try:
        filename = os.path.basename(filepath)
        base, ext = os.path.splitext(filename)
        directory = os.path.dirname(filepath)
        
        if ext.lower() not in EXTENSIONS:
            return

        print(f"Processing: {filename}...")
        
        with Image.open(filepath) as img:
            # 1. Convert to WebP (Main)
            webp_path = os.path.join(directory, f"{base}.webp")
            img.save(webp_path, 'WEBP', quality=QUALITY)
            print(f"  -> Generated {base}.webp")

            # 2. Generate Responsive Sizes
            for width in SIZES:
                if img.width > width:
                    # Calculate height to keep aspect ratio
                    ratio = width / float(img.width)
                    height = int((float(img.height) * float(ratio)))
                    
                    resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                    
                    # Save as WebP
                    resized_name = f"{base}-{width}w.webp"
                    resized_path = os.path.join(directory, resized_name)
                    resized_img.save(resized_path, 'WEBP', quality=QUALITY)
                    print(f"  -> Generated {resized_name}")

            # 3. Optimize Original (if JPG)
            if ext.lower() in ['.jpg', '.jpeg']:
                # Save over original with optimization
                img.save(filepath, 'JPEG', quality=QUALITY, optimize=True)
                print(f"  -> Optimized original {filename}")

    except Exception as e:
        print(f"Error processing {filepath}: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python optimize_images.py <directory_or_file>")
        return

    target = sys.argv[1]

    if os.path.isfile(target):
        optimize_image(target)
    elif os.path.isdir(target):
        print(f"Scanning directory: {target}")
        for root, dirs, files in os.walk(target):
            for file in files:
                if any(file.lower().endswith(ext) for ext in EXTENSIONS):
                    optimize_image(os.path.join(root, file))
    else:
        print("Invalid path.")

if __name__ == "__main__":
    main()
