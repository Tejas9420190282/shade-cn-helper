# Shadcn Assistant

A VS Code extension that helps you discover, install, explore, and use [shadcn/ui](https://ui.shadcn.com/) components directly inside Visual Studio Code.

Instead of switching between your browser, terminal, and editor, Shadcn Assistant provides a convenient way to work with shadcn/ui components from your VS Code workspace.

## ✨ Features

### 🔍 Component Discovery

Browse shadcn/ui components directly from the VS Code Activity Bar.

- View available components
- View installed components
- Search components
- Organize components by category
- Refresh component status

### 📦 Install Components

Install shadcn/ui components directly from VS Code.

The extension uses the official shadcn CLI, so components are installed using the standard shadcn workflow.

Example:

```text
Shadcn Assistant
    ↓
Components
    ↓
Button
    ↓
Install Component
```

### 📋 Component Details

View useful information about a component including:

- Component name
- Category
- Installation status
- Import example
- Usage example
- Dependencies
- Framework/runtime dependencies

### 🔗 Dependency Analysis

Shadcn Assistant analyzes component dependencies and can show:

- Shadcn component dependencies
- NPM package dependencies
- Framework/runtime dependencies
- Missing dependencies
- Recursive component dependencies

### 📄 Open Component Source

Open the installed component source directly from VS Code.

### 📋 Copy Import

Copy the required component import directly to your clipboard.

Example:

```jsx
import { Button } from "@/components/ui/button";
```

### 🧩 Insert Example

Insert a component usage example directly into your current editor.

The extension also helps prevent duplicate imports when inserting examples.

### 🌐 Official Shadcn Registry

Shadcn Assistant integrates with the official shadcn registry to retrieve component information and dependency metadata.

This allows the extension to work with the official shadcn component ecosystem instead of maintaining component source code inside the extension.

## 🚀 Getting Started

### Requirements

Before using Shadcn Assistant, make sure your project has:

- Visual Studio Code
- A React/web project
- shadcn/ui initialized in the project
- Node.js and npm installed

### Initialize shadcn/ui

If shadcn/ui is not initialized in your project, run:

```bash
npx shadcn@latest init
```

After initialization, open the project in VS Code.

### Open Shadcn Assistant

1. Open your shadcn/ui project in VS Code.
2. Open the **Shadcn Assistant** icon from the Activity Bar.
3. Open **Components**.
4. Search or browse for a component.
5. View component details or install a component.

## 🛠️ How It Works

Shadcn Assistant does not copy the entire shadcn/ui component library into the extension.

Instead, it works with your project and the official shadcn ecosystem.

```text
VS Code
   │
   ▼
Shadcn Assistant
   │
   ├── Detect Shadcn Project
   │
   ├── Discover Components
   │
   ├── Search Components
   │
   ├── View Component Details
   │
   ├── Analyze Dependencies
   │
   └── Install Components
           │
           ▼
      Official shadcn CLI
           │
           ▼
      Your Project
```

## 📁 Component Detection

The extension detects installed components from your project's configured shadcn component directory.

For example:

```text
src/
└── components/
    └── ui/
        ├── button.jsx
        ├── card.jsx
        ├── dialog.jsx
        └── input.jsx
```

The extension can then identify these components as installed.

## 💡 Example

Suppose your project does not have the Button component.

You can:

```text
Open Shadcn Assistant
        ↓
Search "button"
        ↓
View Button
        ↓
Install Component
```

The extension invokes the shadcn CLI to install the component into your project.

After refreshing the component list, Button appears as an installed component.

## 🔧 Commands

Shadcn Assistant currently provides commands including:

- **Shadcn Assistant: Detect Shadcn Project**
- **Shadcn Assistant: Refresh Shadcn Components**
- **Shadcn Assistant: Search Shadcn Components**
- **Shadcn Assistant: Install Component**
- **Shadcn Assistant: Open Component**
- **Shadcn Assistant: View Component Details**

## 🧑‍💻 Development

Clone or download the project and install dependencies:

```bash
npm install
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

To run the extension during development:

1. Open the project in VS Code.
2. Press `F5`.
3. VS Code opens an Extension Development Host.
4. Open a shadcn/ui project.
5. Test the extension.

## 🗺️ Roadmap

Planned improvements include:

- Rich component previews
- Interactive component playground
- Improved registry-based component catalog
- More advanced component dependency visualization
- Improved component insertion
- Additional shadcn/ui component support
- Better project configuration support
- Additional developer productivity features

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

If you find an issue or have an idea for improving Shadcn Assistant, please open an issue in the project's source repository.

## 📄 License

This project is licensed under the MIT License.