// ------ cli/commands/activatePlugin.ts ------
import { getInactivePlugins, promptForPluginSelection } from "../utils/pluginManager";
import { logSuccess, logError, logWarning } from "../utils/logging";
import { activatePlugin } from "../services/pluginService";

export async function activatePluginCommand(): Promise<void> {
  const inactivePlugins = getInactivePlugins();

  if (inactivePlugins.length === 0) {
    logSuccess("All plugins are already active.");
    return;
  }

  const selectedPlugin = await promptForPluginSelection(inactivePlugins, "activate");

  if (!selectedPlugin) {
    logWarning("Returning to main menu...");
    return;
  }

  try {
    await activatePlugin(selectedPlugin);
  } catch (error: any) {
    logError(`Failed to activate plugin '${selectedPlugin}': ${error.message}`);
  }
}
