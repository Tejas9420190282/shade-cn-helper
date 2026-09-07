
// dependencyHealth.js

const fs = require("fs");
const path = require("path");

const {
  resolveComponentFile,
} = require("./componentPathResolver");

function getComponentHealth(
  rootPath,
  componentIds,
) {
  return componentIds.map((componentId) => {
    const componentFile =
      resolveComponentFile(
        rootPath,
        componentId,
      );

    return {
      name: componentId,
      installed: Boolean(componentFile),
    };
  });
}

function getPackageHealth(
  rootPath,
  packageNames,
) {
  const packageJsonPath =
    path.join(
      rootPath,
      "package.json",
    );

  let declaredPackages = {};

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson =
        JSON.parse(
          fs.readFileSync(
            packageJsonPath,
            "utf8",
          ),
        );

      declaredPackages = {
        ...(packageJson.dependencies || {}),
        ...(packageJson.devDependencies || {}),
        ...(packageJson.peerDependencies || {}),
        ...(packageJson.optionalDependencies || {}),
      };
    } catch (error) {
      console.error(
        "Failed to read package.json:",
        error,
      );
    }
  }

  return packageNames.map(
    (packageName) => {
      const packagePath =
        path.join(
          rootPath,
          "node_modules",
          packageName,
        );

      return {
        name: packageName,

        declared:
          Boolean(
            declaredPackages[
              packageName
            ],
          ),

        installed:
          fs.existsSync(
            packagePath,
          ),
      };
    },
  );
}

function getDependencyHealth(
  rootPath,
  dependencies,
) {
  return {
    components:
      getComponentHealth(
        rootPath,
        dependencies.components || [],
      ),

    packages:
      getPackageHealth(
        rootPath,
        dependencies.packages || [],
      ),
  };
}

module.exports = {
  getDependencyHealth,
  getComponentHealth,
  getPackageHealth,
};