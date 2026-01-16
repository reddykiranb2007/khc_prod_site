import os
import json
import time
import glob
from PIL import Image

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PATHS = {
    "logos": (os.path.join(BASE_DIR, "assets", "logo"), "*"),
    "conference": (os.path.join(BASE_DIR, "assets", "conference"), "*"),
    "hospital": (os.path.join(BASE_DIR, "assets", "hospital"), "*")
}
OUT_FILE = os.path.join(BASE_DIR, "assets", "js", "gallery-data.js")

# Image Processing Settings
target_size = (1200, 1200)  # Max dimensions
target_format = "JPEG"
target_ext = ".jpg"

def process_image(file_path):
    """
    Checks if an image needs processing (resize or format conversion).
    Processes it if needed, saves as JPG, and removes the original if different.
    Returns the final file path if successful, or None if not an image/error.
    """
    try:
        # Check legitimate image extensions
        valid_exts = ['.jpg', '.jpeg', '.png', '.bmp', '.webp', '.tiff']
        _, ext = os.path.splitext(file_path)
        if ext.lower() not in valid_exts:
            return None

        img_changed = False
        
        try:
            with Image.open(file_path) as img:
                # convert to RGB if needed (e.g. for PNG alpha to JPG)
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                    img_changed = True # Format change implies processing needed if we save as jpg

                # Check dimensions
                if img.width > target_size[0] or img.height > target_size[1]:
                    img.thumbnail(target_size, Image.Resampling.LANCZOS)
                    img_changed = True
                
                # Check format by extension
                if ext.lower() != target_ext:
                    img_changed = True

                if img_changed:
                    # Construct new filename
                    base_name = os.path.splitext(os.path.basename(file_path))[0]
                    new_filename = base_name + target_ext
                    new_file_path = os.path.join(os.path.dirname(file_path), new_filename)
                    
                    # Save optimized version
                    img.save(new_file_path, target_format, quality=85, optimize=True)
                    print(f"Processed: {os.path.basename(file_path)} -> {new_filename}")
                    
                    # If the file path changed (different extension), delete the old one
                    if new_file_path != file_path:
                        try:
                            os.remove(file_path)
                            print(f"Deleted original: {os.path.basename(file_path)}")
                        except OSError as e:
                            print(f"Error deleting original file {file_path}: {e}")
                            
                    return new_file_path
                else:
                    # File is already optimized and complies with rules
                    return file_path
                    
        except IOError:
            # Not an image or corrupted
            return None

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return None

def get_files():
    data = {}
    for key, (folder, pattern) in PATHS.items():
        if not os.path.exists(folder):
            print(f"Warning: Folder not found: {folder}")
            data[key] = []
            continue
            
        # Search for files
        search_path = os.path.join(folder, pattern)
        files = glob.glob(search_path)
        
        # Determine if we should enforce processing for this folder
        should_process = (key in ["hospital", "conference"])
        
        clean_files = []
        processed_files = set() # Track to avoid duplicates if glob catches both old and new momentarily

        for f in files:
            if not os.path.isfile(f):
                continue
                
            # Skip hidden files
            if os.path.basename(f).startswith('.'):
                continue

            final_path = f
            
            if should_process:
                # Attempt to process/standardize the image
                # This might rename/delete the file f
                res = process_image(f)
                if res:
                    final_path = res
                else:
                    # Not a valid image or failed, maybe skip adding to list?
                    # If it's not an image (e.g. .txt), process_image returns None.
                    # We only want images in the gallery list.
                    # However, if process_image returned None because it didn't strictly need processing
                    # but was valid... wait, process_image returns file_path if valid and no change.
                    # It returns None if extension is invalid or open failed.
                    continue
            else:
                # For logos folder, just simple extension check
                valid_exts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
                if not any(f.lower().endswith(ext) for ext in valid_exts):
                    continue

            # Add to list if not already handled
            fname = os.path.basename(final_path)
            if fname not in processed_files:
                clean_files.append(fname)
                processed_files.add(fname)
                
        clean_files.sort()
        data[key] = clean_files
    return data

def write_js(data):
    js_content = f"window.galleryData = {json.dumps(data, indent=4)};"
    try:
        with open(OUT_FILE, 'w') as f:
            f.write(js_content)
        print(f"[{time.strftime('%H:%M:%S')}] Updated gallery-data.js")
    except Exception as e:
        print(f"Error writing file: {e}")

print("--- Gallery Watcher Started ---")
print("Monitoring folders for changes (Auto-resize & Format active)...")

last_hash = None

while True:
    try:
        current_data = get_files()
        # Create a hashable representation to check for changes
        current_hash = json.dumps(current_data, sort_keys=True)
        
        if current_hash != last_hash:
            write_js(current_data)
            last_hash = current_hash
            
        time.sleep(2)
    except KeyboardInterrupt:
        break
    except Exception as e:
        print(f"Error in monitor loop: {e}")
        time.sleep(5)
