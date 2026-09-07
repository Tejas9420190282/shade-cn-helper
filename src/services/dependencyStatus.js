
// dependencyStatus.js

// dependencyStatus.js

const fs = require("fs");
const path = require("path");

function getInstalledPackages(rootPath) {
  const packageJsonPath = path.join(
    rootPath,
    "package.json",
  );

  if (!fs.existsSync(packageJsonPath)) {
    return new Set();
  }

  try {
    const packageJson = JSON.parse(
      fs.readFileSync(
        packageJsonPath,
        "utf8",
      ),
    );

    const dependencies = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
      ...(packageJson.peerDependencies || {}),
      ...(packageJson.optionalDependencies || {}),
    };

    return new Set(
      Object.keys(dependencies),
    );
  } catch (error) {
    console.error(
      "Failed to read package.json:",
      error,
    );

    return new Set();
  }
}

function getDependencyStatus(
  rootPath,
  dependencies,
) {
  const installedPackages =
    getInstalledPackages(rootPath);

  const packages =
    dependencies.packages || [];

  return packages.map((packageName) => ({
    name: packageName,

    installed:
      installedPackages.has(packageName),
  }));
}

module.exports = {
  getInstalledPackages,
  getDependencyStatus,
};