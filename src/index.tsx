import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "@/routeTree.gen";
import "@/styles/globals.css";

// Import i18n
import "@/i18n";

// Import performance monitoring
import { performanceMonitor } from "@/lib/performance";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Start performance monitoring
performanceMonitor.startMeasure("App Initialization");

const PluginApp: React.FC = () => {
  return React.createElement(RouterProvider, { router });
};

function renderStandalone() {
  const root = document.getElementById("root");
  if (!root) return;

  if (ReactDOM.createRoot) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <PluginApp />
      </React.StrictMode>
    );
  } else {
    ReactDOM.render(
      <React.StrictMode>
        <PluginApp />
      </React.StrictMode>,
      root
    );
  }
}

function registerPlugin(api: any) {
  const { registerTool, registerSidebarButton, openPluginWindow } = api;

  registerTool({
    id: "calendar-diary-plugin",
    name: "日历日记本",
    iconName: "Calendar",
    color: "#2563eb",
    textColor: "#ffffff",
    path: "/tools/calendar-diary-plugin",
    component: PluginApp,
  });

  registerSidebarButton({
    id: "calendar-diary-plugin-btn",
    icon: "Calendar",
    label: "日历日记本",
    onClick: () => {
      openPluginWindow?.("calendar-diary-plugin");
    },
  });
}

const pluginData = (window as any).__PLUGIN_DATA__;

if (pluginData) {
  renderStandalone();
}

// End performance monitoring after render
setTimeout(() => {
  performanceMonitor.endMeasure("App Initialization");
}, 0);
