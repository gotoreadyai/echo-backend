// ------ cli/commands/listPlugins.ts ------
import { getAllPlugins, getActivePlugins, getInactivePlugins, logSuccess } from "../utils";

export function listPluginsCommand(): void {
  const allPlugins = getAllPlugins();
  const activePlugins = getActivePlugins();
  const inactivePlugins = getInactivePlugins();

  console.log("\n=== Wszystkie Pluginy ===");
  allPlugins.forEach((plugin) => {
    const status = activePlugins.includes(plugin) ? "✅ Aktywny" : "❌ Nieaktywny";
    console.log(`- ${plugin} [${status}]`);
  });

  console.log(""); // Pusta linia na końcu
}
