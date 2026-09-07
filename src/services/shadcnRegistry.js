// shadcnRegistry.js

const {
  getRegistries,
  searchRegistries,
  getRegistryItems,
  resolveRegistryItems,
} = require("shadcn/registry");

// ========================================
// Get available registries
// ========================================

async function getAvailableRegistries() {
  return getRegistries();
}

// ========================================
// Search Shadcn components
// ========================================

async function searchShadcnComponents(
  query,
) {
  const result =
    await searchRegistries(
      ["@shadcn"],
      {
        query,
        types: ["registry:ui"],
        limit: 100,
        offset: 0,
        continueOnError: true,
      },
    );

  return result.items || [];
}

// ========================================
// Get registry item
// ========================================

async function getRegistryItem(
  componentId,
) {
  const items =
    await getRegistryItems([
      `@shadcn/${componentId}`,
    ]);

  return items[0] || null;
}

// ========================================
// Get registry dependencies
// ========================================

async function getRegistryDependencies(
  componentId,
) {
  const item =
    await getRegistryItem(
      componentId,
    );

  if (!item) {
    return {
      components: [],
      packages: [],
      devDependencies: [],
      item: null,
    };
  }

  return {
    components:
      item.registryDependencies || [],

    packages:
      item.dependencies || [],

    devDependencies:
      item.devDependencies || [],

    item,
  };
}

// ========================================
// Resolve recursive registry dependencies
// ========================================

async function resolveComponentDependencies(
  componentId,
) {
  const tree =
    await resolveRegistryItems([
      `@shadcn/${componentId}`,
    ]);

  return tree;
}

module.exports = {
  getAvailableRegistries,
  searchShadcnComponents,
  getRegistryItem,
  getRegistryDependencies,
  resolveComponentDependencies,
};