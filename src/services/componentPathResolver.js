// componentPathResolver.js

const fs = require("fs");
const path = require("path");

function resolveComponentPath(rootPath) {
  const componentsJsonPath = path.join(
    rootPath,
    "components.json",
  );

  if (!fs.existsSync(componentsJsonPath)) {
    return null;
  }

  try {
    const componentsConfig = JSON.parse(
      fs.readFileSync(componentsJsonPath, "utf8"),
    );

    const uiAlias = componentsConfig.aliases?.ui;

    if (!uiAlias) {
      return null;
    }

    // Example:
    // "@/components/ui"
    if (uiAlias.startsWith("@/")) {
      const jsconfigPath = path.join(
        rootPath,
        "jsconfig.json",
      );

      if (!fs.existsSync(jsconfigPath)) {
        return null;
      }

      const jsconfig = JSON.parse(
        fs.readFileSync(jsconfigPath, "utf8"),
      );

      const paths =
        jsconfig.compilerOptions?.paths;

      const aliasPath = paths?.["@/*"]?.[0];

      if (!aliasPath) {
        return null;
      }

      // "./src/*" → "./src"
      const aliasBasePath =
        aliasPath.replace("/*", "");

      // "@/components/ui" → "components/ui"
      const uiRelativePath =
        uiAlias.replace("@/", "");

      return path.join(
        rootPath,
        aliasBasePath,
        uiRelativePath,
      );
    }

    // If the UI alias is already a relative path
    return path.join(rootPath, uiAlias);
  } catch (error) {
    console.error(
      "Failed to resolve Shadcn component path:",
      error,
    );

    return null;
  }
}

function resolveComponentFile(
  rootPath,
  componentId,
) {
  const componentPath =
    resolveComponentPath(rootPath);

  if (!componentPath) {
    return null;
  }

  const possibleFiles = [
    `${componentId}.jsx`,
    `${componentId}.tsx`,
  ];

  for (const fileName of possibleFiles) {
    const filePath = path.join(
      componentPath,
      fileName,
    );

    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
}

module.exports = {
  resolveComponentPath,
  resolveComponentFile,
};