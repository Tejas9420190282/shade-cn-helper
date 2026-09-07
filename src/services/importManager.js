
// importManager.js

// importManager.js

const vscode = require("vscode");

/**
 * Adds a component import to the current editor
 * if it does not already exist.
 *
 * Example:
 *
 * import { Button } from "@/components/ui/button";
 */
async function addImportIfNeeded(
  editor,
  importCode,
) {
  if (!importCode) {
    return;
  }

  const document = editor.document;
  const text = document.getText();

  const parsedImport =
    parseImport(importCode);

  if (!parsedImport) {
    return;
  }

  const {
    modulePath,
    importType,
    importedNames,
  } = parsedImport;

  // --------------------------------
  // Find existing import
  // --------------------------------

  const existingImport =
    findExistingImport(
      text,
      modulePath,
    );

  // --------------------------------
  // No existing import
  // --------------------------------

  if (!existingImport) {
    await insertNewImport(
      editor,
      importCode,
    );

    return;
  }

  // --------------------------------
  // Existing import found
  // --------------------------------

  if (
    importType !== "named" ||
    existingImport.importType !==
      "named"
  ) {
    return;
  }

  const missingNames =
    importedNames.filter(
      (name) =>
        !existingImport.importedNames.includes(
          name,
        ),
    );

  if (missingNames.length === 0) {
    return;
  }

  await mergeNamedImports(
    editor,
    existingImport,
    missingNames,
  );
}

/**
 * Parse:
 *
 * import { Button } from "@/components/ui/button"
 *
 * into structured information.
 */
function parseImport(importCode) {
  const namedImportMatch =
    importCode.match(
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*["']([^"']+)["']/,
    );

  if (namedImportMatch) {
    const importedNames =
      namedImportMatch[1]
        .split(",")
        .map((name) =>
          name.trim(),
        )
        .filter(Boolean);

    return {
      modulePath:
        namedImportMatch[2],

      importType: "named",

      importedNames,
    };
  }

  const defaultImportMatch =
    importCode.match(
      /import\s+([A-Za-z_$][\w$]*)\s+from\s*["']([^"']+)["']/,
    );

  if (defaultImportMatch) {
    return {
      modulePath:
        defaultImportMatch[2],

      importType: "default",

      importedNames: [
        defaultImportMatch[1],
      ],
    };
  }

  return null;
}

/**
 * Find an import from the same module.
 */
function findExistingImport(
  text,
  modulePath,
) {
  const escapedPath =
    escapeRegExp(modulePath);

  const importRegex =
    new RegExp(
      `import\\s+(.*?)\\s+from\\s+["']${escapedPath}["']\\s*;?`,
      "m",
    );

  const match =
    text.match(importRegex);

  if (!match) {
    return null;
  }

  const importStatement =
    match[0];

  const namedMatch =
    importStatement.match(
      /import\s*\{\s*([^}]+)\s*\}/,
    );

  const importedNames =
    namedMatch
      ? namedMatch[1]
          .split(",")
          .map((name) =>
            name.trim(),
          )
          .filter(Boolean)
      : [];

  return {
    importStatement,

    importType:
      namedMatch
        ? "named"
        : "default",

    importedNames,
  };
}

/**
 * Insert a completely new import.
 */
async function insertNewImport(
  editor,
  importCode,
) {
  const document =
    editor.document;

  const text =
    document.getText();

  const lines =
    text.split("\n");

  let lastImportLine =
    -1;

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const line =
      lines[i].trim();

    if (
      line.startsWith("import ")
    ) {
      lastImportLine = i;
    }
  }

  const importText =
    `${importCode};`;

  if (
    lastImportLine >= 0
  ) {
    const position =
      document.lineAt(
        lastImportLine,
      ).range.end;

    await editor.edit(
      (editBuilder) => {
        editBuilder.insert(
          position,
          `\n${importText}`,
        );
      },
    );

    return;
  }

  await editor.edit(
    (editBuilder) => {
      editBuilder.insert(
        new vscode.Position(
          0,
          0,
        ),
        `${importText}\n\n`,
      );
    },
  );
}

/**
 * Merge missing named imports.
 *
 * Existing:
 *
 * import { Button } from "@/components/ui/button";
 *
 * Missing:
 *
 * Card
 *
 * Result:
 *
 * import { Button, Card } from "@/components/ui/button";
 */
async function mergeNamedImports(
  editor,
  existingImport,
  missingNames,
) {
  const document =
    editor.document;

  const newNames =
    [
      ...existingImport.importedNames,
      ...missingNames,
    ];

  const newImport =
    `import { ${newNames.join(
      ", ",
    )} } from ${getModulePathFromImport(
      existingImport.importStatement,
    )};`;

  const startIndex =
    document
      .getText()
      .indexOf(
        existingImport.importStatement,
      );

  if (startIndex < 0) {
    return;
  }

  const startPosition =
    document.positionAt(
      startIndex,
    );

  const endPosition =
    document.positionAt(
      startIndex +
        existingImport
          .importStatement
          .length,
    );

  const range =
    new vscode.Range(
      startPosition,
      endPosition,
    );

  await editor.edit(
    (editBuilder) => {
      editBuilder.replace(
        range,
        newImport,
      );
    },
  );
}

/**
 * Extract module path from an
 * existing import statement.
 */
function getModulePathFromImport(
  importStatement,
) {
  const match =
    importStatement.match(
      /from\s+["']([^"']+)["']/,
    );

  if (!match) {
    return '""';
  }

  return `"${match[1]}"`;
}

function escapeRegExp(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

module.exports = {
  addImportIfNeeded,
};