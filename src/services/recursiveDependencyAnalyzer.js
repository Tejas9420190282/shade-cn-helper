// recursiveDependencyAnalyzer.js

const {
  resolveComponentFile,
} = require("./componentPathResolver");

const {
  analyzeDependencies,
} = require("./dependencyAnalyzer");

async function analyzeRecursiveDependencies(
  rootPath,
  componentId,
) {
  const visited = new Set();

  const result = {
    components: [],
    packages: [],
    internal: [],
    framework: [],
  };

  await analyzeComponent(
    rootPath,
    componentId,
    visited,
    result,
  );

  return {
    components: unique(result.components),
    packages: unique(result.packages),
    internal: unique(result.internal),
    framework: unique(result.framework),
  };
}

async function analyzeComponent(
  rootPath,
  componentId,
  visited,
  result,
) {
  if (!componentId) {
    return;
  }

  if (visited.has(componentId)) {
    return;
  }

  visited.add(componentId);

  const componentFile =
    resolveComponentFile(
      rootPath,
      componentId,
    );

  if (!componentFile) {
    return;
  }

  const dependencies =
    analyzeDependencies(
      componentFile,
    );

  // --------------------------------
  // Add direct dependencies
  // --------------------------------

  result.components.push(
    ...dependencies.components,
  );

  result.packages.push(
    ...dependencies.packages,
  );

  result.internal.push(
    ...dependencies.internal,
  );

  result.framework.push(
    ...dependencies.framework,
  );

  // --------------------------------
  // Recursively analyze Shadcn
  // components
  // --------------------------------

  for (
    const dependencyId
    of dependencies.components
  ) {
    await analyzeComponent(
      rootPath,
      dependencyId,
      visited,
      result,
    );
  }
}

function unique(values) {
  return [...new Set(values)];
}

module.exports = {
  analyzeRecursiveDependencies,
};