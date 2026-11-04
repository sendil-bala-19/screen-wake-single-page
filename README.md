# Single-File React App Template

This React app uses Vite to produce a standalone HTML file for production. Run `npm run dev` while developing, `npm test` to check the build behavior, and `npm run build` to generate the production file at `dist/index.html`.

## Images and SVGs

Put assets that should be bundled in `src/` (for example, in `src/assets/`) and import them from JavaScript or CSS. Vite processes imported assets and, with the current `assetsInlineLimit` setting, embeds assets smaller than 100,000,000 bytes as data URLs. This includes raster images and SVG files used as image URLs. The single-file plugin can then keep these references inside `dist/index.html` rather than requiring separate asset files.

Use an imported image or SVG in a React component like this:

```jsx
import logoUrl from "./assets/logo.svg";
import photoUrl from "./assets/photo.png";

function Example() {
  return (
    <>
      <img src={logoUrl} alt="Company logo" />
      <img src={photoUrl} alt="A description of the photo" />
    </>
  );
}
```

You can also reference an asset from CSS with a relative URL, such as `background-image: url("./assets/background.png")`; Vite processes that reference as part of the build.

Assets in a `public/` directory are copied as files and referenced by URL; they are not processed as imported assets. To keep the output self-contained, prefer importing assets from `src/`. Assets at or above the inline limit may also be emitted as separate files, so keep assets below that limit when a single HTML file is required. An imported SVG is used as an image URL by default, not automatically converted into a React component.

## Vite Configuration

- `defineConfig(...)` provides configuration editor support and validation for Vite.
- `react()` enables React support, including Fast Refresh during development.
- `viteSingleFile()` combines the production JavaScript and CSS into `dist/index.html`.
- `server.host: true` makes the development server listen on network interfaces as well as localhost. `server.open: true` opens it in a browser when it starts.
- `build.assetsInlineLimit: 100000000` sets the asset inlining threshold to 100,000,000 bytes (about 100 MB). Assets smaller than this limit can be embedded as data URLs.
- `build.cssCodeSplit: false` puts the app's CSS into one CSS bundle instead of splitting it into separate files.
- `build.rollupOptions.output.inlineDynamicImports: true` asks Rollup to combine dynamically imported code into one bundle. This is compatible with the single-file build, with the tradeoff that code-splitting benefits are lost.

The production build is intended to be opened or distributed as `dist/index.html`. Development still uses Vite's local server and does not have to run as a single file.
