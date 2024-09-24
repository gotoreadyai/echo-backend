# CLI Tools

Ten katalog zawiera narzędzia CLI do zarządzania migracjami, seederami oraz pluginami w projekcie.

## Dostępne Skrypty

- `generateMigrations.ts`: Generuje pliki migracji na podstawie modeli Sequelize.
- `generateSeeders.ts`: Generuje pliki seedera na podstawie szablonów i danych JSON.
- `handleActivatePlugin.ts`: Aktywuje wybrany plugin, generuje i stosuje migracje.
- `handleDeactivatePlugin.ts`: Dezaktywuje wybrany plugin, cofa i usuwa powiązane migracje.
- `handleConfig.ts`: Zarządza migracjami i seederami projektu.
- `handleUpdateSeed.ts`: Aktualizuje seedery dla wybranego pluginu.

## Użycie

Każdy skrypt można uruchomić za pomocą `ts-node` lub po skompilowaniu TypeScript do JavaScript.

Przykład:

```bash
ts-node cli/generateMigrations.ts [pluginName]
