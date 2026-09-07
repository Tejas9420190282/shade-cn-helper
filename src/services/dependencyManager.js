// dependencyManager.js

const {
  getDependencies,
} = require("./componentCatalog");

const {
  analyzeRecursiveDependencies,
} = require("./recursiveDependencyAnalyzer");

const {
  resolveComponentFile,
} = require("./componentPathResolver");

const {
  getRegistryDependencies,
} = require("./shadcnRegistry");

// ========================================
// Get dependencies
// ========================================

async function getComponentDependencies(
  componentId,
  rootPath,
) {
  // ======================================
  // 1. Installed component
  // ======================================

  if (rootPath) {
    const componentFile =
      resolveComponentFile(
        rootPath,
        componentId,
      );

    if (componentFile) {
      return analyzeRecursiveDependencies(
        rootPath,
        componentId,
      );
    }
  }

  // ======================================
  // 2. Official Shadcn Registry
  // ======================================

  try {
    const registryDependencies =
      await getRegistryDependencies(
        componentId,
      );

    if (
      registryDependencies.item
    ) {
      return {
        components:
          registryDependencies.components.map(
            normalizeRegistryDependency,
          ),

        packages:
          registryDependencies.packages ||
          [],

        internal: [],

        framework: [],

        devDependencies:
          registryDependencies.devDependencies ||
          [],
      };
    }
  } catch (error) {
    console.error(
      `Failed to get registry dependencies for ${componentId}:`,
      error,
    );
  }

  // ======================================
  // 3. Local catalog fallback
  // ======================================

  const dependencies =
    getDependencies(componentId);

  return {
    components:
      dependencies.components || [],

    packages:
      dependencies.packages || [],

    internal: [],

    framework: [],

    devDependencies: [],
  };
}

// ========================================
// Normalize registry dependency
// ========================================

function normalizeRegistryDependency(
  dependency,
) {
  if (
    typeof dependency !== "string"
  ) {
    return dependency;
  }

  // Example:
  // @shadcn/button
  // becomes:
  // button

  if (
    dependency.startsWith("@shadcn/")
  ) {
    return dependency.substring(
      "@shadcn/".length,
    );
  }

  return dependency;
}

// ========================================
// Check dependencies
// ========================================

async function hasDependencies(
  componentId,
  rootPath,
) {
  const dependencies =
    await getComponentDependencies(
      componentId,
      rootPath,
    );

  return (
    dependencies.components.length > 0 ||
    dependencies.packages.length > 0 ||
    dependencies.internal.length > 0 ||
    dependencies.framework.length > 0 ||
    dependencies.devDependencies.length > 0
  );
}

module.exports = {
  getComponentDependencies,
  hasDependencies,
};