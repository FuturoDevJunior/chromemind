# ChromeMind Assets

## Extension Icons

Icons need to be in the following sizes:
- `icon16.png` - 16x16px (toolbar)
- `icon48.png` - 48x48px (extensions page)
- `icon128.png` - 128x128px (Chrome Web Store)

### Generating Icons

Use the `icon.svg` file as base and convert to PNG:

**Method 1: Online (Quick)**
1. Open https://convertio.co/svg-png/
2. Upload `icon.svg`
3. Download and resize to 16px, 48px, 128px

**Method 2: ImageMagick (Local)**
```bash
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png  
convert icon.svg -resize 128x128 icon128.png
```

**Method 3: Figma/Design Tool**
1. Import the SVG
2. Export as PNG in required sizes

### Design

- **Primary color**: #1a73e8 (Google Blue)
- **Icon**: 🧠 (representing AI)
- **Style**: Modern, rounded, clean
- **Background**: Blue gradient

### Temporary Workaround

For development, you can use placeholder icons online:
1. Download icons from https://via.placeholder.com/
2. Rename to correct sizes
3. Replace when you have final icons

Example:
```bash
curl -o icon16.png "https://via.placeholder.com/16x16/1a73e8/ffffff?text=AI"
curl -o icon48.png "https://via.placeholder.com/48x48/1a73e8/ffffff?text=AI"  
curl -o icon128.png "https://via.placeholder.com/128x128/1a73e8/ffffff?text=AI"
```