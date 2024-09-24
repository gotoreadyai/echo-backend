// ------ cli/commands/deactivatePlugin.ts ------
import { getActivePlugins, promptForPluginSelection, deactivatePlugin, logSuccess, logError } from "../utils";

export async function deactivatePluginCommand(): Promise<void> {
  const activePlugins = getActivePlugins();

  if (activePlugins.length === 0) {
    logSuccess("Brak aktywnych pluginów do dezaktywacji.");
    return;
  }

  const selectedPlugin = await promptForPluginSelection(activePlugins, "deactivate");

  if (selectedPlugin) {
    try {
      deactivatePlugin(selectedPlugin);
      logSuccess(`Plugin "${selectedPlugin}" został dezaktywowany.`);
    } catch (error: any) {
      logError(`Nie udało się dezaktywować pluginu "${selectedPlugin}": ${error.message}`);
    }
  } else {
    logSuccess("Powrót do menu głównego.");
  }
}
