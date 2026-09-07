// test-registry.js
const {
  searchShadcnComponents,
  getRegistryItem,
  getRegistryDependencies,
} = require("./src/services/shadcnRegistry");

async function test() {
  try {
    console.log("=================================");
    console.log("Testing Shadcn Registry");
    console.log("=================================");

    // ========================================
    // Test 1: Search
    // ========================================

    console.log("\n1. Searching for button...");

    const searchResults =
      await searchShadcnComponents(
        "button",
      );

    console.log(
      "Number of results:",
      searchResults.length,
    );

    console.log(
      "First results:",
      JSON.stringify(
        searchResults.slice(0, 5),
        null,
        2,
      ),
    );

    // ========================================
    // Test 2: Get Button
    // ========================================

    console.log(
      "\n2. Getting button registry item...",
    );

    const button =
      await getRegistryItem(
        "button",
      );

    if (!button) {
      throw new Error(
        "Button registry item was not found.",
      );
    }

    console.log(
      "Button found:",
      button.name,
    );

    console.log(
      "Button type:",
      button.type,
    );

    // ========================================
    // Test 3: Dependencies
    // ========================================

    console.log(
      "\n3. Getting button dependencies...",
    );

    const dependencies =
      await getRegistryDependencies(
        "button",
      );

    console.log(
      "Shadcn components:",
      dependencies.components,
    );

    console.log(
      "NPM packages:",
      dependencies.packages,
    );

    console.log(
      "Dev dependencies:",
      dependencies.devDependencies,
    );

    // ========================================
    // Success
    // ========================================

    console.log(
      "\n=================================",
    );

    console.log(
      "Registry test successful!",
    );

    console.log(
      "=================================",
    );
  } catch (error) {
    console.error(
      "\nRegistry test failed:",
      error,
    );
  }
}

test();