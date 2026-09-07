// projectDetector.js

const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function detectProject() {
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (!workspaceFolders) {
    return null;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  const packageJsonPath = path.join(
    rootPath,
    "package.json"
  );

  const componentsJsonPath = path.join(
    rootPath,
    "components.json"
  );

  return {
    rootPath,

    hasPackageJson: fs.existsSync(
      packageJsonPath
    ),

    hasShadcn: fs.existsSync(
      componentsJsonPath
    ),
  };
}

module.exports = {
  detectProject,
};