
// componentDetector.js

const fs = require("fs");
const path = require("path");

const {
  resolveComponentPath,
} = require("./componentPathResolver");

function detectInstalledComponents(rootPath) {
  const componentPath =
    resolveComponentPath(rootPath);

  if (!componentPath) {
    return [];
  }

  if (!fs.existsSync(componentPath)) {
    return [];
  }

  try {
    const files = fs.readdirSync(
      componentPath,
    );

    return files
      .filter(
        (file) =>
          file.endsWith(".jsx") ||
          file.endsWith(".tsx"),
      )
      .map((file) =>
        path.basename(
          file,
          path.extname(file),
        ),
      );
  } catch (error) {
    console.error(
      "Error detecting installed components:",
      error,
    );

    return [];
  }
}

module.exports = {
  detectInstalledComponents,
};