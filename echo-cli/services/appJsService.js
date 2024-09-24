const fs = require("fs");
const path = require("path");

const appJsService = {
  updateAppJs: (pluginName, active) => {
    const appJsPath = path.join(__dirname, "..", "..", "src", "app.ts");
    let appJsContent = fs.readFileSync(appJsPath, "utf-8");

    const importStatement = `import ${pluginName} from "./plugins/${pluginName}/Routes";\n`;
    const useStatement = `app.use(${pluginName});\n`;

    // Markers
    const importStartMarker = "/* #PLUGINS IMPORTS */";
    const importEndMarker = "/* !#PLUGINS IMPORTS */";
    const useStartMarker = "/* #PLUGINS */";
    const useEndMarker = "/* !#PLUGINS */";

    // Insert or remove import statement
    appJsContent = modifyContent(
      appJsContent,
      importStartMarker,
      importEndMarker,
      importStatement,
      active
    );

    // Insert or remove use statement
    appJsContent = modifyContent(
      appJsContent,
      useStartMarker,
      useEndMarker,
      useStatement,
      active
    );

    // Write updated content back to app.js
    fs.writeFileSync(appJsPath, appJsContent, "utf-8");
  },
};

function modifyContent(content, startMarker, endMarker, statement, active) {
  const startMarkerIndex = content.indexOf(startMarker);
  const endMarkerIndex = content.indexOf(endMarker, startMarkerIndex);

  if (startMarkerIndex === -1 || endMarkerIndex === -1) {
    throw new Error("Markers not found in the file.");
  }

  const existingContent = content
    .slice(startMarkerIndex + startMarker.length, endMarkerIndex)
    .trim();

  if (active) {
    if (!existingContent.includes(statement.trim())) {
      return (
        content.slice(0, startMarkerIndex + startMarker.length) +
        `\n${existingContent}\n${statement}` +
        content.slice(endMarkerIndex)
      );
    }
  } else {
    const updatedContent = existingContent
      .split("\n")
      .filter((line) => line.trim() !== statement.trim())
      .join("\n");

    return (
      content.slice(0, startMarkerIndex + startMarker.length) +
      updatedContent +
      content.slice(endMarkerIndex)
    );
  }

  return content;
}

module.exports = appJsService;
