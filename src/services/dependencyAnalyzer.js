// dependencyAnalyzer.js

const fs = require("fs");

// Packages that are normally part of the application
// runtime/framework and should not be treated as
// component-specific dependencies.
const frameworkPackages = new Set([
  "react",
  "react-dom",
  "next",
  "next-auth",
  "vue",
  "vue-router",
  "svelte",
  "angular",
  "@angular/core",
]);

function analyzeDependencies(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return {
      components: [],
      packages: [],
      internal: [],
      framework: [],
    };
  }

  try {
    const source = fs.readFileSync(
      filePath,
      "utf8",
    );

    const imports = extractImports(source);

    const components = [];
    const packages = [];
    const internal = [];
    const framework = [];

    for (const importPath of imports) {
      // --------------------------------
      // Shadcn UI component
      // --------------------------------

      if (
        importPath.includes(
          "/components/ui/",
        )
      ) {
        const componentId =
          importPath.split(
            "/components/ui/",
          )[1];

        if (componentId) {
          components.push(
            componentId.replace(
              /\.(jsx|tsx)$/,
              "",
            ),
          );
        }

        continue;
      }

      // --------------------------------
      // Internal project import
      // --------------------------------

      if (
        importPath.startsWith("@/") ||
        importPath.startsWith("./") ||
        importPath.startsWith("../")
      ) {
        internal.push(importPath);

        continue;
      }

      // --------------------------------
      // External NPM package
      // --------------------------------

      const packageName =
        getPackageName(importPath);

      if (
        frameworkPackages.has(packageName)
      ) {
        framework.push(packageName);
      } else {
        packages.push(packageName);
      }
    }

    return {
      components: unique(components),
      packages: unique(packages),
      internal: unique(internal),
      framework: unique(framework),
    };
  } catch (error) {
    console.error(
      "Failed to analyze component dependencies:",
      error,
    );

    return {
      components: [],
      packages: [],
      internal: [],
      framework: [],
    };
  }
}

// ========================================
// Extract imports
// ========================================

function extractImports(source) {
  const imports = [];

  const importRegex =
    /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;

  let match;

  while (
    (match = importRegex.exec(source)) !== null
  ) {
    imports.push(match[1]);
  }

  return imports;
}

// ========================================
// Get NPM package name
// ========================================

function getPackageName(importPath) {
  // Scoped package:
  // @radix-ui/react-dialog
  // @base-ui/react/button

  if (importPath.startsWith("@")) {
    const parts =
      importPath.split("/");

    return parts.length >= 2
      ? `${parts[0]}/${parts[1]}`
      : importPath;
  }

  // Normal package:
  // lucide-react
  // react
  // class-variance-authority

  return importPath.split("/")[0];
}

// ========================================
// Remove duplicates
// ========================================

function unique(values) {
  return [...new Set(values)];
}

module.exports = {
  analyzeDependencies,
};