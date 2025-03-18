# GitHub Glossary Hover

A Firefox extension that shows GitHub glossary definitions in a floating panel when hovering over glossary links, making it easier to learn GitHub terminology without leaving the page.

## Features

- Shows definitions in a floating panel on hover
- Works on both github.com and docs.github.com
- Caches definitions for better performance
- Modern, GitHub-style design
- Prevents unwanted navigation when clicking glossary links

## Installation

### Temporary Installation (For Development)
1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to this repository's folder and select `manifest.json`

### Manual Installation
1. Download this repository as a ZIP file
2. Rename the downloaded ZIP file to `github-glossary-hover.xpi`
3. Open Firefox
4. Drag and drop the `.xpi` file into Firefox
   - Or go to Firefox Menu > Add-ons and Themes > Settings (gear icon) > Install Add-on From File
5. Click "Add" when prompted

Note: You might need to enable unsigned extensions in Firefox:
1. Go to `about:config`
2. Search for `xpinstall.signatures.required`
3. Set it to `false`

## Usage

After installation, the extension will automatically work on GitHub pages:
- Hover over any glossary link to see its definition
- Click a glossary link to view the definition without navigating away
- The tooltip will follow your cursor and stay within the viewport

## Contributing

Feel free to open issues or submit pull requests if you find bugs or have suggestions for improvements.

## License

MIT License - See LICENSE file for details 