// componentDetails.js

const vscode = require("vscode");
const path = require("path");

const { installComponent } = require("./componentInstaller");

const { getComponentDependencies } = require("./dependencyManager");

const { resolveComponentFile } = require("./componentPathResolver");

const { addImportIfNeeded } = require("./importManager");

const { getDependencyHealth } = require("./dependencyHealth");

const { getDependencyStatus } = require("./dependencyStatus");

async function showComponentDetails(component, rootPath) {
  const dependencies = await getComponentDependencies(component.id, rootPath);

  const dependencyStatus = getDependencyStatus(rootPath, dependencies);

  const dependencyHealth = getDependencyHealth(rootPath, dependencies);

  // Remember the editor that was active
  // before opening the Webview.
  const targetEditor = vscode.window.activeTextEditor;

  const targetDocument = targetEditor ? targetEditor.document.uri : null;

  const targetSelection = targetEditor ? targetEditor.selection : null;

  const panel = vscode.window.createWebviewPanel(
    "shadcnComponentDetails",
    `${component.name} - Shadcn Component`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    },
  );

  const componentFile = resolveComponentFile(rootPath, component.id);

  const relativePath = componentFile
    ? path.relative(rootPath, componentFile)
    : "Not installed";

  const isInstalled = Boolean(componentFile);

  panel.webview.html = getWebviewContent(
    component,
    relativePath,
    isInstalled,
    dependencies,
    dependencyStatus,
    dependencyHealth,
  );

  // --------------------------------
  // Webview Messages
  // --------------------------------

  panel.webview.onDidReceiveMessage(async (message) => {
    // --------------------------------
    // Open Source
    // --------------------------------

    if (message.command === "openSource") {
      if (!componentFile) {
        vscode.window.showWarningMessage(`${component.name} is not installed.`);

        return;
      }

      const document = await vscode.workspace.openTextDocument(componentFile);

      await vscode.window.showTextDocument(document);

      return;
    }

    // --------------------------------
    // Install Component
    // --------------------------------

    if (message.command === "installComponent") {
      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,

            title: `Installing Shadcn ${component.name}...`,
          },

          async () => {
            await installComponent(rootPath, component.id);
          },
        );

        vscode.window.showInformationMessage(
          `✓ ${component.name} installed successfully.`,
        );

        panel.dispose();
      } catch (error) {
        console.error("Component installation failed:", error);

        vscode.window.showErrorMessage(
          `Failed to install ${component.name}: ${error.message}`,
        );
      }

      return;
    }

    // --------------------------------
    // Copy Import
    // --------------------------------

    if (message.command === "copyImport") {
      await vscode.env.clipboard.writeText(component.importCode || "");

      vscode.window.showInformationMessage(`${component.name} import copied.`);

      return;
    }

    // --------------------------------
    // Copy Example
    // --------------------------------

    if (message.command === "copyExample") {
      await vscode.env.clipboard.writeText(component.exampleCode || "");

      vscode.window.showInformationMessage(`${component.name} example copied.`);

      return;
    }

    // --------------------------------
    // Insert Example
    // --------------------------------

    if (message.command === "insertExample") {
      if (!component.exampleCode) {
        vscode.window.showWarningMessage(
          `No example available for ${component.name}.`,
        );

        return;
      }

      if (!targetDocument) {
        vscode.window.showWarningMessage(
          "No text editor was active before opening component details.",
        );

        return;
      }

      try {
        const document =
          await vscode.workspace.openTextDocument(targetDocument);

        const editor = await vscode.window.showTextDocument(
          document,
          vscode.ViewColumn.One,
        );

        // Add import if needed
        if (component.importCode) {
          await addImportIfNeeded(editor, component.importCode);
        }

        // Insert example
        const selection = targetSelection || editor.selection;

        await editor.edit((editBuilder) => {
          editBuilder.insert(selection.active, component.exampleCode);
        });

        vscode.window.showInformationMessage(
          `${component.name} example inserted.`,
        );
      } catch (error) {
        console.error("Failed to insert component example:", error);

        vscode.window.showErrorMessage(
          `Failed to insert ${component.name} example.`,
        );
      }

      return;
    }
  });
}

// ========================================
// Webview HTML
// ========================================

function getWebviewContent(
  component,
  relativePath,
  isInstalled,
  dependencies,
  dependencyStatus,
  dependencyHealth,
) {
  const componentDependencies =
    dependencyHealth.components.length > 0
      ? dependencyHealth.components
          .map((dependency) => {
            const icon = dependency.installed ? "✓" : "⚠";

            const text = dependency.installed
              ? escapeHtml(dependency.name)
              : `${escapeHtml(dependency.name)} — Not installed`;

            return `<li>${icon} ${text}</li>`;
          })
          .join("")
      : "<li>None</li>";

  const packageDependencies =
    dependencyHealth.packages.length > 0
      ? dependencyHealth.packages
          .map((dependency) => {
            let icon = "⚠";
            let text = `${escapeHtml(dependency.name)} — Not installed`;

            if (dependency.declared && dependency.installed) {
              icon = "✓";
              text = escapeHtml(dependency.name);
            } else if (dependency.declared && !dependency.installed) {
              icon = "⚠";
              text = `${escapeHtml(
                dependency.name,
              )} — Missing from node_modules`;
            } else if (!dependency.declared && dependency.installed) {
              icon = "⚠";
              text = `${escapeHtml(dependency.name)} — Not declared`;
            }

            return `<li>${icon} ${text}</li>`;
          })
          .join("")
      : "<li>None</li>";

  const frameworkDependencies =
    dependencies.framework && dependencies.framework.length > 0
      ? dependencies.framework
          .map((dependency) => `<li>${escapeHtml(dependency)}</li>`)
          .join("")
      : "<li>None</li>";

  const status = isInstalled ? "✓ Installed" : "Available";

  const actionButton = isInstalled
    ? `
        <button id="openSource">
          Open Source File
        </button>
      `
    : `
        <button id="installComponent">
          Install Component
        </button>
      `;

  const importCode =
    component.importCode ||
    `import { ${component.name} } from "@/components/ui/${component.id}"`;

  const exampleCode =
    component.exampleCode || `<${component.name}>Example</${component.name}>`;

  return `
<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="UTF-8">

  <style>

    body {
      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      padding: 30px;

      color:
        var(--vscode-foreground);

      background:
        var(--vscode-editor-background);
    }

    .container {
      max-width: 900px;
    }

    h1 {
      margin-bottom: 8px;
    }

    .description {
      color:
        var(--vscode-descriptionForeground);

      margin-bottom: 30px;

      font-size: 15px;

      line-height: 1.6;
    }

    .section {
      margin-top: 28px;
    }

    .label {
      text-transform: uppercase;

      letter-spacing: 1px;

      font-size: 12px;

      color:
        var(--vscode-descriptionForeground);

      margin-bottom: 8px;
    }

    .value {
      font-size: 15px;
    }

        .dependency-group {
      margin-top: 10px;
    }

    .dependency-group strong {
      display: block;
      margin-bottom: 6px;
    }

    .dependency-group ul {
      margin: 0;
      padding-left: 20px;
    }

    .status {
      font-size: 16px;
    }

    .code {
      background:
        var(--vscode-textCodeBlock-background);

      border-radius: 6px;

      padding: 16px;

      overflow-x: auto;

      white-space: pre;

      font-family:
        Consolas,
        monospace;

      font-size: 13px;

      line-height: 1.5;
    }

    .buttons {
      display: flex;

      gap: 10px;

      flex-wrap: wrap;
    }

    button {
      margin-top: 12px;

      padding: 8px 16px;

      border: none;

      border-radius: 5px;

      cursor: pointer;

      color:
        var(--vscode-button-foreground);

      background:
        var(--vscode-button-background);
    }

    button:hover {
      background:
        var(--vscode-button-hoverBackground);
    }

  </style>

</head>

<body>

  <div class="container">

    <h1>
      ${escapeHtml(component.name)}
    </h1>

    <div class="description">
      ${escapeHtml(component.description || "Shadcn UI component.")}
    </div>

    <div class="section">

      <div class="label">
        Category
      </div>

      <div class="value">
        ${escapeHtml(component.category)}
      </div>

    </div>

    <div class="section">

      <div class="label">
        Status
      </div>

      <div class="status">
        ${status}
      </div>

    </div>

        <div class="section">

      <div class="label">
        Component ID
      </div>

      <div class="value">
        ${escapeHtml(component.id)}
      </div>

    </div>

    <!-- Dependencies -->

    <div class="section">

      <div class="label">
        Dependencies
      </div>

      <div class="dependency-group">

        <strong>
          Shadcn Components
        </strong>

        <ul>
          ${componentDependencies}
        </ul>

      </div>

      <div class="dependency-group">

        <strong>
          NPM Packages
        </strong>

        <ul>
          ${packageDependencies}
        </ul>

      </div>

      <div class="dependency-group">

  <strong>
    Framework / Runtime
  </strong>

  <ul>
    ${frameworkDependencies}
  </ul>

</div>

    </div>

    <div class="section">

      <div class="label">
        Source
      </div>

      <div class="code">
        ${escapeHtml(relativePath)}
      </div>

    </div>

    <div class="section">

      <div class="label">
        Installation
      </div>

      <div class="code">
        npx shadcn@latest add ${escapeHtml(component.id)}
      </div>

    </div>

    <div class="section">

      <div class="label">
        Import
      </div>

      <div class="code">
        ${escapeHtml(importCode)}
      </div>

      <div class="buttons">

        <button id="copyImport">
          Copy Import
        </button>

      </div>

    </div>

    <div class="section">

      <div class="label">
        Example
      </div>

      <div class="code">
        ${escapeHtml(exampleCode)}
      </div>

      <div class="buttons">

        <button id="copyExample">
          Copy Example
        </button>

        <button id="insertExample">
          Insert Example
        </button>

      </div>

    </div>

    ${actionButton}

  </div>

  <script>

    const vscode =
      acquireVsCodeApi();

    // --------------------------------
    // Open Source
    // --------------------------------

    const openSource =
      document.getElementById(
        "openSource",
      );

    if (openSource) {
      openSource.addEventListener(
        "click",
        () => {
          vscode.postMessage({
            command:
              "openSource",
          });
        },
      );
    }

    // --------------------------------
    // Install Component
    // --------------------------------

    const installComponent =
      document.getElementById(
        "installComponent",
      );

    if (installComponent) {
      installComponent.addEventListener(
        "click",
        () => {
          vscode.postMessage({
            command:
              "installComponent",
          });
        },
      );
    }

    // --------------------------------
    // Copy Import
    // --------------------------------

    const copyImport =
      document.getElementById(
        "copyImport",
      );

    if (copyImport) {
      copyImport.addEventListener(
        "click",
        () => {
          vscode.postMessage({
            command:
              "copyImport",
          });
        },
      );
    }

    // --------------------------------
    // Copy Example
    // --------------------------------

    const copyExample =
      document.getElementById(
        "copyExample",
      );

    if (copyExample) {
      copyExample.addEventListener(
        "click",
        () => {
          vscode.postMessage({
            command:
              "copyExample",
          });
        },
      );
    }

    // --------------------------------
    // Insert Example
    // --------------------------------

    const insertExample =
      document.getElementById(
        "insertExample",
      );

    if (insertExample) {
      insertExample.addEventListener(
        "click",
        () => {
          vscode.postMessage({
            command:
              "insertExample",
          });
        },
      );
    }

  </script>

</body>

</html>
  `;
}

// ========================================
// Escape HTML
// ========================================

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

module.exports = {
  showComponentDetails,
};
