import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build as viteBuild } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));

function assertSingleFileHtml(html) {
  assert.match(html, /<script\b[^>]*>[\s\S]*?<\/script>/i);
  assert.match(html, /<style\b[^>]*>[\s\S]*?<\/style>/i);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link\b[^>]*\brel=["']stylesheet["'][^>]*>/i);
}

test("production build inlines JavaScript and CSS in index.html", () => {
  const result = spawnSync("npm run build", {
    cwd: projectRoot,
    encoding: "utf8",
    shell: true,
  });

  assert.equal(
    result.status,
    0,
    `npm run build failed:\n${result.stdout}\n${result.stderr}`,
  );

  const html = readFileSync(
    path.join(projectRoot, "dist", "index.html"),
    "utf8",
  );
  assertSingleFileHtml(html);
});

test("Less and SCSS compile and inline into a single HTML file", async () => {
  const fixtureRoot = mkdtempSync(path.join(projectRoot, ".vite-style-test-"));

  try {
    const sourceRoot = path.join(fixtureRoot, "src");
    mkdirSync(sourceRoot);
    writeFileSync(
      path.join(fixtureRoot, "index.html"),
      '<!doctype html><html><head></head><body><script type="module" src="/src/main.js"></script></body></html>',
    );
    writeFileSync(
      path.join(sourceRoot, "main.js"),
      'import "./styles.less";\nimport "./styles.scss";\n',
    );
    writeFileSync(
      path.join(sourceRoot, "styles.less"),
      "@less-color: #125c45;\n.less-probe { color: @less-color; }\n",
    );
    writeFileSync(
      path.join(sourceRoot, "styles.scss"),
      "$scss-color: #a34a10;\n.scss-probe { color: $scss-color; }\n",
    );

    await viteBuild({
      configFile: false,
      root: fixtureRoot,
      base: "./",
      plugins: [viteSingleFile()],
      build: {
        outDir: "dist",
        cssCodeSplit: false,
        assetsInlineLimit: 100000000,
        rollupOptions: {
          output: {
            inlineDynamicImports: true,
          },
        },
      },
    });

    const html = readFileSync(
      path.join(fixtureRoot, "dist", "index.html"),
      "utf8",
    );
    assertSingleFileHtml(html);
    assert.match(html, /\.less-probe\s*\{/);
    assert.match(html, /#125c45/i);
    assert.match(html, /\.scss-probe\s*\{/);
    assert.match(html, /#a34a10/i);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
