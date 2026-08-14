#!/usr/bin/env node

/**
 * RADARCharts Visual Layer Applicator
 *
 * Applies the existing RADAR visual layer to the generated Framer mirror.
 * It does not rebuild or modify the original Framer export.
 *
 * Usage:
 *   node scripts/apply-visual-layer.js
 */

import {
  copyFileSync,
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

import {
  dirname,
  join,
} from "path";

import {
  fileURLToPath,
} from "url";


const ROOT =
  join(
    dirname(
      fileURLToPath(import.meta.url)
    ),
    ".."
  );

const DIST =
  join(ROOT, "dist");

const SOURCE =
  join(
    ROOT,
    "custom",
    "radar-visual-layer.js"
  );

const TARGET_DIR =
  join(
    DIST,
    "custom"
  );

const TARGET =
  join(
    TARGET_DIR,
    "radar-visual-layer.js"
  );

const SCRIPT_TAG =
  '<script src="/custom/radar-visual-layer.js" defer></script>';


function collectHtmlFiles(directory) {

  if (!existsSync(directory)) {
    return [];
  }

  const files = [];

  for (
    const entry of readdirSync(
      directory,
      { withFileTypes: true }
    )
  ) {

    const path =
      join(
        directory,
        entry.name
      );

    if (entry.isDirectory()) {

      files.push(
        ...collectHtmlFiles(path)
      );

      continue;
    }

    if (
      entry.isFile() &&
      entry.name
        .toLowerCase()
        .endsWith(".html")
    ) {

      files.push(path);
    }
  }

  return files;
}


function applyToHtml(file) {

  const html =
    readFileSync(
      file,
      "utf8"
    );

  if (
    html.includes(
      SCRIPT_TAG
    )
  ) {

    return false;
  }

  const closingBody =
    /<\/body\s*>/i;

  if (
    !closingBody.test(html)
  ) {

    throw new Error(
      `No </body> tag found in ${file}`
    );
  }

  const updated =
    html.replace(
      closingBody,
      `  ${SCRIPT_TAG}\n</body>`
    );

  writeFileSync(
    file,
    updated,
    "utf8"
  );

  return true;
}


function main() {

  console.log(
    "\nRADARCharts — Apply Visual Layer\n"
  );

  if (
    !existsSync(SOURCE)
  ) {

    throw new Error(
      `Visual layer not found: ${SOURCE}`
    );
  }

  if (
    !existsSync(DIST)
  ) {

    throw new Error(
      "dist/ does not exist. Run the Framer extraction first."
    );
  }

  copyFileSync(
    SOURCE,
    TARGET
  );

  console.log(
    `✓ Copied visual layer to ${TARGET}`
  );

  const htmlFiles =
    collectHtmlFiles(DIST);

  let changed = 0;

  for (
    const file of htmlFiles
  ) {

    if (
      applyToHtml(file)
    ) {

      changed += 1;

      console.log(
        `✓ Injected visual layer into ${file}`
      );

    } else {

      console.log(
        `• Already injected: ${file}`
      );
    }
  }

  console.log(
    `\nApplied to ${changed} HTML page(s).`
  );

  console.log(
    "No Framer page structure was rebuilt."
  );

  console.log(
    "No original Framer export was modified."
  );
}


try {

  main();

} catch (error) {

  console.error(
    `\n✗ ${error.message}`
  );

  process.exit(1);
}