// componentProvider.js

const vscode = require("vscode");
const { detectProject } = require("../services/projectDetector");
const { detectInstalledComponents } = require("../services/componentDetector");
const { getAll } = require("../services/componentCatalog");

class ComponentProvider {
  constructor() {
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren(element) {
    const project = detectProject();

    // No workspace or non-shadcn project
    if (!project || !project.hasShadcn) {
      if (!element) {
        return [
          this.createItem(
            "Shadcn project not detected",
            vscode.TreeItemCollapsibleState.None,
            "status",
          ),
        ];
      }

      return [];
    }

    const components = getAll();

    // Root level
    if (!element) {
      return [
        this.createItem(
          "Installed",
          vscode.TreeItemCollapsibleState.Expanded,
          "installed",
        ),
        this.createItem(
          "Available",
          vscode.TreeItemCollapsibleState.Expanded,
          "available",
        ),
      ];
    }

    const installedComponents = detectInstalledComponents(project.rootPath);

    // Installed components
    if (element.contextValue === "installed") {
      return components
        .filter((component) => installedComponents.includes(component.id))
        .map((component) =>
          this.createItem(
            `${component.name} ✓`,
            vscode.TreeItemCollapsibleState.None,
            "component",
            component,
            project.rootPath,
          ),
        );
    }

    // Available components
    if (element.contextValue === "available") {
      return components
        .filter((component) => !installedComponents.includes(component.id))
        .map((component) =>
          this.createItem(
            component.name,
            vscode.TreeItemCollapsibleState.None,
            "availableComponent",
            component,
            project.rootPath,
          ),
        );
    }

    return [];
  }

  createItem(label, collapsibleState, contextValue, component, rootPath) {
    const item = new vscode.TreeItem(label, collapsibleState);

    item.contextValue = contextValue;

    if (component) {
      item.componentId = component.id;
      item.component = component;
      item.rootPath = rootPath;

      if (contextValue === "component") {
        item.tooltip = new vscode.MarkdownString(
          `**${component.name}**\n\n` +
            `Category: ${component.category}\n\n` +
            `Status: Installed ✓\n\n` +
            `Click to open source file.`,
        );
      }

      if (contextValue === "availableComponent") {
        item.tooltip = new vscode.MarkdownString(
          `**${component.name}**\n\n` +
            `Category: ${component.category}\n\n` +
            `Status: Available\n\n` +
            `Right-click to install.`,
        );
      }

      if (rootPath && contextValue === "component") {
        item.command = {
          command: "shade-cn-helper.openComponent",
          title: "Open Component",
          arguments: [component, rootPath],
        };
      }
    }

    return item;
  }
}

module.exports = {
  ComponentProvider,
};
