// extension.js

const vscode = require("vscode");

const {
  detectProject,
} = require("./src/services/projectDetector");

const {
  ComponentProvider,
} = require("./src/providers/componentProvider");

const {
  detectInstalledComponents,
} = require("./src/services/componentDetector");

const {
  installComponent,
} = require("./src/services/componentInstaller");

const {
  getComponentDependencies,
} = require("./src/services/dependencyManager");

const {
  search,
} = require("./src/services/componentCatalog");

const {
  resolveComponentFile,
} = require("./src/services/componentPathResolver");

const {
  showComponentDetails,
} = require("./src/services/componentDetails");

function activate(context) {
  console.log(
    "Shadcn Assistant is now active!",
  );

  // ========================================
  // Component Tree Provider
  // ========================================

  const componentProvider =
    new ComponentProvider();

  const treeView =
    vscode.window.registerTreeDataProvider(
      "shadcn-components",
      componentProvider,
    );

  context.subscriptions.push(
    treeView,
  );

  // ========================================
  // Hello World
  // ========================================

  const helloWorldCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.helloWorld",
      function () {
        vscode.window.showInformationMessage(
          "Hello World from Shadcn Assistant!",
        );
      },
    );

  context.subscriptions.push(
    helloWorldCommand,
  );

  // ========================================
  // Detect Shadcn Project
  // ========================================

  const detectProjectCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.detectProject",
      function () {
        const project =
          detectProject();

        if (!project) {
          vscode.window.showWarningMessage(
            "No project/workspace is open.",
          );

          return;
        }

        if (!project.hasShadcn) {
          vscode.window.showInformationMessage(
            "Shadcn project not detected.",
          );

          return;
        }

        const components =
          detectInstalledComponents(
            project.rootPath,
          );

        vscode.window.showInformationMessage(
          `✓ Shadcn project detected! Installed: ${
            components.length > 0
              ? components.join(", ")
              : "None"
          }`,
        );
      },
    );

  context.subscriptions.push(
    detectProjectCommand,
  );

  // ========================================
  // Refresh Components
  // ========================================

  const refreshComponentsCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.refreshComponents",
      function () {
        componentProvider.refresh();

        vscode.window.showInformationMessage(
          "Shadcn components refreshed.",
        );
      },
    );

  context.subscriptions.push(
    refreshComponentsCommand,
  );

  // ========================================
  // Search Components
  // ========================================

  const searchComponentsCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.searchComponents",
      async function () {
        const project =
          detectProject();

        if (
          !project ||
          !project.hasShadcn
        ) {
          vscode.window.showWarningMessage(
            "No Shadcn project detected.",
          );

          return;
        }

        const query =
          await vscode.window.showInputBox({
            prompt:
              "Search Shadcn components",

            placeHolder:
              "Example: button, dialog, form...",
          });

        if (query === undefined) {
          return;
        }

        const results =
          search(query);

        if (results.length === 0) {
          vscode.window.showInformationMessage(
            `No components found for "${query}".`,
          );

          return;
        }

        const installedComponents =
          detectInstalledComponents(
            project.rootPath,
          );

        const items =
          results.map(
            (component) => {
              const isInstalled =
                installedComponents.includes(
                  component.id,
                );

              return {
                label:
                  component.name,

                description:
                  isInstalled
                    ? "✓ Installed"
                    : "Available",

                detail:
                  `${component.category} • ${component.id}`,

                component,
              };
            },
          );

        const selected =
          await vscode.window.showQuickPick(
            items,
            {
              placeHolder:
                "Select a component",

              matchOnDescription: true,

              matchOnDetail: true,
            },
          );

        if (!selected) {
          return;
        }

        await showComponentDetails(
          selected.component,
          project.rootPath,
        );
      },
    );

  context.subscriptions.push(
    searchComponentsCommand,
  );

  // ========================================
  // Install Component
  // ========================================

  const installComponentCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.installComponent",

      async function (item) {
        if (
          !item ||
          !item.componentId
        ) {
          vscode.window.showErrorMessage(
            "Unable to determine the component.",
          );

          return;
        }

        const project =
          detectProject();

        if (
          !project ||
          !project.hasShadcn
        ) {
          vscode.window.showWarningMessage(
            "No Shadcn project detected.",
          );

          return;
        }

        const componentId =
          item.componentId;

        const component =
          item.component || {
            id: componentId,
            name: componentId,
          };

        try {
          // --------------------------------
          // Get dependencies
          // --------------------------------

          const dependencies =
            await getComponentDependencies(
              componentId,
              project.rootPath,
            );

          // --------------------------------
          // Build dependency message
          // --------------------------------

          const dependencyParts = [];

          if (
            dependencies.components &&
            dependencies.components.length > 0
          ) {
            dependencyParts.push(
              `Shadcn components: ${dependencies.components.join(
                ", ",
              )}`,
            );
          }

          if (
            dependencies.packages &&
            dependencies.packages.length > 0
          ) {
            dependencyParts.push(
              `NPM packages: ${dependencies.packages.join(
                ", ",
              )}`,
            );
          }

          if (
            dependencies.framework &&
            dependencies.framework.length > 0
          ) {
            dependencyParts.push(
              `Framework/runtime: ${dependencies.framework.join(
                ", ",
              )}`,
            );
          }

          const dependencyText =
            dependencyParts.length > 0
              ? dependencyParts.join(
                  "\n",
                )
              : "No additional dependencies detected.";

          // --------------------------------
          // Confirmation
          // --------------------------------

          const confirmation =
            await vscode.window.showInformationMessage(
              `Install ${component.name}?`,
              {
                modal: true,

                detail:
                  `The Shadcn CLI will install this component.\n\n${dependencyText}`,
              },

              "Install",
              "Cancel",
            );

          if (
            confirmation !==
            "Install"
          ) {
            return;
          }

          // --------------------------------
          // Install
          // --------------------------------

          await vscode.window.withProgress(
            {
              location:
                vscode.ProgressLocation
                  .Notification,

              title:
                `Installing Shadcn ${component.name}...`,
            },

            async () => {
              await installComponent(
                project.rootPath,
                componentId,
              );
            },
          );

          // --------------------------------
          // Refresh
          // --------------------------------

          componentProvider.refresh();

          vscode.window.showInformationMessage(
            `✓ ${component.name} installed successfully.`,
          );
        } catch (error) {
          console.error(
            "Component installation failed:",
            error,
          );

          vscode.window.showErrorMessage(
            `Failed to install ${component.name}: ${error.message}`,
          );
        }
      },
    );

  context.subscriptions.push(
    installComponentCommand,
  );

  // ========================================
  // Open Component
  // ========================================

  const openComponentCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.openComponent",

      async function (
        component,
        rootPath,
      ) {
        if (
          !component ||
          !component.id ||
          !rootPath
        ) {
          vscode.window.showErrorMessage(
            "Unable to open component.",
          );

          return;
        }

        const filePath =
          resolveComponentFile(
            rootPath,
            component.id,
          );

        if (filePath) {
          const document =
            await vscode.workspace.openTextDocument(
              filePath,
            );

          await vscode.window.showTextDocument(
            document,
          );

          return;
        }

        vscode.window.showWarningMessage(
          `Could not find source file for ${component.name}.`,
        );
      },
    );

  context.subscriptions.push(
    openComponentCommand,
  );

  // ========================================
  // Component Details
  // ========================================

  const componentDetailsCommand =
    vscode.commands.registerCommand(
      "shade-cn-helper.componentDetails",

      async function (item) {
        if (
          !item ||
          !item.componentId ||
          !item.component ||
          !item.rootPath
        ) {
          vscode.window.showErrorMessage(
            "Unable to determine component details.",
          );

          return;
        }

        await showComponentDetails(
          item.component,
          item.rootPath,
        );
      },
    );

  context.subscriptions.push(
    componentDetailsCommand,
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};