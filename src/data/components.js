// components.js

const components = [
  // Forms
  {
    name: "Button",
    id: "button",
    category: "Forms",

    description:
      "A button component for triggering actions and user interactions.",

    importCode: 'import { Button } from "@/components/ui/button"',

    exampleCode: "<Button>Click me</Button>",

    dependencies: {
      components: [],
      packages: [],
    },
  },
  {
    name: "Button Group",
    id: "button-group",
    category: "Forms",
  },
  {
    name: "Checkbox",
    id: "checkbox",
    category: "Forms",
  },
  {
    name: "Combobox",
    id: "combobox",
    category: "Forms",
  },
  {
    name: "Field",
    id: "field",
    category: "Forms",
  },
  {
    name: "Input",
    id: "input",
    category: "Forms",
    description: "An input field for collecting user information.",
    importCode: 'import { Input } from "@/components/ui/input"',
    exampleCode: '<Input placeholder="Enter your name" />',
    dependencies: {
      components: [],
      packages: [],
    },
  },
  {
    name: "Input Group",
    id: "input-group",
    category: "Forms",
  },
  {
    name: "Input OTP",
    id: "input-otp",
    category: "Forms",
  },
  {
    name: "Label",
    id: "label",
    category: "Forms",
  },
  {
    name: "Radio Group",
    id: "radio-group",
    category: "Forms",
  },
  {
    name: "Select",
    id: "select",
    category: "Forms",
  },
  {
    name: "Slider",
    id: "slider",
    category: "Forms",
  },
  {
    name: "Switch",
    id: "switch",
    category: "Forms",
  },
  {
    name: "Textarea",
    id: "textarea",
    category: "Forms",
  },
  {
    name: "Toggle",
    id: "toggle",
    category: "Forms",
  },
  {
    name: "Toggle Group",
    id: "toggle-group",
    category: "Forms",
  },

  // Layout
  {
    name: "Accordion",
    id: "accordion",
    category: "Layout",
  },
  {
    name: "Aspect Ratio",
    id: "aspect-ratio",
    category: "Layout",
  },
  {
    name: "Card",
    id: "card",
    category: "Layout",
    description: "A container component for grouping related content.",
    importCode:
      'import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"',
    exampleCode: `<Card>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here.
  </CardContent>
</Card>`,
    dependencies: {
      components: [],
      packages: [],
    },
  },
  {
    name: "Collapsible",
    id: "collapsible",
    category: "Layout",
  },
  {
    name: "Resizable",
    id: "resizable",
    category: "Layout",
  },
  {
    name: "Scroll Area",
    id: "scroll-area",
    category: "Layout",
  },
  {
    name: "Separator",
    id: "separator",
    category: "Layout",
  },
  {
    name: "Sidebar",
    id: "sidebar",
    category: "Layout",
  },

  // Navigation
  {
    name: "Breadcrumb",
    id: "breadcrumb",
    category: "Navigation",
  },
  {
    name: "Command",
    id: "command",
    category: "Navigation",
  },
  {
    name: "Context Menu",
    id: "context-menu",
    category: "Navigation",
  },
  {
    name: "Dropdown Menu",
    id: "dropdown-menu",
    category: "Navigation",
  },
  {
    name: "Menubar",
    id: "menubar",
    category: "Navigation",
  },
  {
    name: "Navigation Menu",
    id: "navigation-menu",
    category: "Navigation",
  },
  {
    name: "Pagination",
    id: "pagination",
    category: "Navigation",
  },
  {
    name: "Tabs",
    id: "tabs",
    category: "Navigation",
  },

  // Feedback
  {
    name: "Alert",
    id: "alert",
    category: "Feedback",
  },
  {
    name: "Alert Dialog",
    id: "alert-dialog",
    category: "Feedback",
  },
  {
    name: "Dialog",
    id: "dialog",
    category: "Feedback",
    description:
      "A modal dialog for displaying content or requesting user interaction.",
    importCode:
      'import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"',
    exampleCode: `<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Hello</DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>`,
    dependencies: {
      components: [],
      packages: [],
    },
  },
  {
    name: "Drawer",
    id: "drawer",
    category: "Feedback",
  },
  {
    name: "Popover",
    id: "popover",
    category: "Feedback",
  },
  {
    name: "Progress",
    id: "progress",
    category: "Feedback",
  },
  {
    name: "Sheet",
    id: "sheet",
    category: "Feedback",
  },
  {
    name: "Skeleton",
    id: "skeleton",
    category: "Feedback",
  },
  {
    name: "Spinner",
    id: "spinner",
    category: "Feedback",
  },
  {
    name: "Toast",
    id: "toast",
    category: "Feedback",
  },
  {
    name: "Tooltip",
    id: "tooltip",
    category: "Feedback",
    description:
      "A small popup that provides additional information when hovering over an element.",
    importCode:
      'import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"',
    exampleCode: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Helpful information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>`,
    dependencies: {
      components: [],
      packages: [],
    },
  },

  // Data Display
  {
    name: "Badge",
    id: "badge",
    category: "Data Display",
    description:
      "A small label used to display status or category information.",
    importCode: 'import { Badge } from "@/components/ui/badge"',
    exampleCode: "<Badge>New</Badge>",
    dependencies: {
      components: [],
      packages: [],
    },
  },
  {
    name: "Avatar",
    id: "avatar",
    category: "Data Display",
  },
  {
    name: "Calendar",
    id: "calendar",
    category: "Data Display",
  },
  {
    name: "Carousel",
    id: "carousel",
    category: "Data Display",
  },
  {
    name: "Chart",
    id: "chart",
    category: "Data Display",
  },
  {
    name: "Data Table",
    id: "data-table",
    category: "Data Display",
  },
  {
    name: "Empty",
    id: "empty",
    category: "Data Display",
  },
  {
    name: "Kbd",
    id: "kbd",
    category: "Data Display",
  },
  {
    name: "Table",
    id: "table",
    category: "Data Display",
  },
  {
    name: "Typography",
    id: "typography",
    category: "Data Display",
  },
];

module.exports = {
  components,
};
