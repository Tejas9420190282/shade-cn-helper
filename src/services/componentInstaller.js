
// componentInstaller.js
const { spawn } = require("child_process");

function installComponent(rootPath, componentId) {
  return new Promise((resolve, reject) => {
    const command =
      process.platform === "win32" ? "npx.cmd" : "npx";

    const args = [
      "shadcn@latest",
      "add",
      componentId,
    ];

    console.log("=================================");
    console.log("Shadcn Component Installer");
    console.log("Project:", rootPath);
    console.log("Component:", componentId);
    console.log("Command:", command);
    console.log("Arguments:", args);
    console.log("=================================");

    const child = spawn(command, args, {
      cwd: rootPath,
      shell: process.platform === "win32",
      windowsHide: true,
      env: {
        ...process.env,
      },
    });

    let output = "";
    let errorOutput = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();

      output += text;

      console.log("[shadcn]", text);
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();

      errorOutput += text;

      console.error("[shadcn error]", text);
    });

    child.on("error", (error) => {
      console.error("Failed to start shadcn process:", error);

      reject(error);
    });

    child.on("close", (code) => {
      console.log("Shadcn process exited with code:", code);

      if (code === 0) {
        resolve(output);
      } else {
        reject(
          new Error(
            `shadcn command failed with exit code ${code}\n${
              errorOutput || output || "No output received."
            }`
          )
        );
      }
    });
  });
}

module.exports = {
  installComponent,
};