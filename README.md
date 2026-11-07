# Slidex

A PowerPoint-style desktop presentation app for Windows and macOS (Electron).

## Get the installers (GitHub builds them)
1. Put all files from this folder in a GitHub repository (package.json must be at the top level).
2. Create `.github/workflows/build.yml` (see the file in this zip, or ask for the text).
3. Open the Actions tab. The "Build desktop apps" run takes about 5-8 minutes.
4. Download `Slidex-windows-latest` (installer .exe) and `Slidex-macos-latest` (.dmg files) from the run's Artifacts.

## Run it directly (needs Node.js 20+)
    npm install
    npm start

## Files
- `index.html` - the whole editor (slides, ribbon, slide show, print layout)
- `main.js`, `preload.js` - app window, file dialogs, PDF export
- `pptx.js` - PowerPoint (.pptx) export
