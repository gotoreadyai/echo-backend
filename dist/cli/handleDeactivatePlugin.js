"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeactivatePlugin = handleDeactivatePlugin;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const child_process_1 = require("child_process");
const GREEN_COLOR = '\x1b[32m';
const RED_COLOR = '\x1b[31m';
const RESET_COLOR = '\x1b[0m';
function handleDeactivatePlugin() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Deactivating plugin...');
        const pluginsDir = path_1.default.join(__dirname, '..', 'src', 'plugins');
        if (!fs_1.default.existsSync(pluginsDir)) {
            console.error(`Plugins directory not found at ${pluginsDir}`);
            return;
        }
        const plugins = fs_1.default.readdirSync(pluginsDir).filter((file) => {
            const pluginPath = path_1.default.join(pluginsDir, file);
            return fs_1.default.statSync(pluginPath).isDirectory();
        });
        if (plugins.length === 0) {
            console.log('No plugins found in src/plugins.');
            return;
        }
        const activePlugins = plugins.filter((plugin) => {
            const activeFilePath = path_1.default.join(pluginsDir, plugin, 'active');
            return fs_1.default.existsSync(activeFilePath);
        });
        if (activePlugins.length === 0) {
            console.log('No active plugins to deactivate.');
            return;
        }
        const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;
        const choices = [
            { name: returnToMenuOption, value: 'Return to Main Menu' },
            ...activePlugins.map((plugin) => ({ name: plugin, value: plugin })),
        ];
        const { selectedPlugin } = yield inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selectedPlugin',
                message: 'Select a plugin to deactivate:',
                choices: choices,
            },
        ]);
        if (selectedPlugin === 'Return to Main Menu') {
            console.log('Returning to main menu...');
            return;
        }
        const pluginDir = path_1.default.join(pluginsDir, selectedPlugin);
        const activeFilePath = path_1.default.join(pluginDir, 'active');
        // **New Code Starts Here**
        // Undo the migrations associated with the plugin
        try {
            const projectRoot = path_1.default.join(__dirname, '..');
            const migrationsDir = path_1.default.join(projectRoot, 'migrations');
            // Get the list of migration files for the plugin
            const allMigrationFiles = fs_1.default.existsSync(migrationsDir)
                ? fs_1.default.readdirSync(migrationsDir)
                : [];
            // Filter migration files related to the selected plugin
            const pluginMigrationFiles = allMigrationFiles.filter((file) => file.includes(`create-${selectedPlugin}`));
            if (pluginMigrationFiles.length > 0) {
                // Sort the migrations in reverse order to undo them properly
                pluginMigrationFiles.sort().reverse();
                console.log(`${GREEN_COLOR}Undoing migrations for plugin '${selectedPlugin}'...${RESET_COLOR}`);
                for (const migrationFile of pluginMigrationFiles) {
                    console.log(`Undoing migration: ${migrationFile}`);
                    // Undo the migration
                    (0, child_process_1.execSync)(`npx sequelize-cli db:migrate:undo --name ${migrationFile}`, { stdio: 'inherit', cwd: projectRoot });
                }
                console.log(`${GREEN_COLOR}Migrations for plugin '${selectedPlugin}' have been undone.${RESET_COLOR}`);
                // **New Code for Deleting Migration Files**
                // Delete the migration files associated with the plugin
                console.log(`${GREEN_COLOR}Deleting migration files for plugin '${selectedPlugin}'...${RESET_COLOR}`);
                for (const migrationFile of pluginMigrationFiles) {
                    const migrationFilePath = path_1.default.join(migrationsDir, migrationFile);
                    if (fs_1.default.existsSync(migrationFilePath)) {
                        fs_1.default.unlinkSync(migrationFilePath);
                        console.log(`Deleted migration file: ${migrationFile}`);
                    }
                    else {
                        console.log(`Migration file not found: ${migrationFile}`);
                    }
                }
                console.log(`${GREEN_COLOR}Migration files for plugin '${selectedPlugin}' have been deleted.${RESET_COLOR}`);
            }
            else {
                console.log(`${RED_COLOR}No migrations found for plugin '${selectedPlugin}'.${RESET_COLOR}`);
            }
        }
        catch (error) {
            console.error(`${RED_COLOR}Error undoing migrations: ${error.message}${RESET_COLOR}`);
            return;
        }
        // **New Code Ends Here**
        // Deactivate the plugin by removing the 'active' file
        fs_1.default.unlinkSync(activeFilePath);
        // **New Code Starts Here**
        // Remove the plugin from the app file
        const projectRoot = path_1.default.join(__dirname, '..');
        const appFilePath = path_1.default.join(projectRoot, 'src', 'app.ts'); // Adjust the path if necessary
        if (fs_1.default.existsSync(appFilePath)) {
            let appFileContent = fs_1.default.readFileSync(appFilePath, 'utf8');
            // Prepare the import statement and app.use line
            const pluginVariableName = `${selectedPlugin}Routes`; // Adjust variable name as needed
            const importStatement = `import ${pluginVariableName} from "./plugins/${selectedPlugin}/Routes";\n`;
            const appUseStatement = `app.use(${pluginVariableName});\n`;
            // Remove the import statement
            const importSectionRegex = /\/\* #PLUGINS IMPORTS \*\/([\s\S]*?)\/\* !#PLUGINS IMPORTS \*\//;
            const importMatch = appFileContent.match(importSectionRegex);
            if (importMatch) {
                let importsSection = importMatch[1];
                if (importsSection.includes(importStatement.trim())) {
                    importsSection = importsSection.replace(importStatement, '');
                    appFileContent = appFileContent.replace(importMatch[1], importsSection);
                    console.log(`${GREEN_COLOR}Removed import statement for plugin '${selectedPlugin}' from app file.${RESET_COLOR}`);
                }
                else {
                    console.log(`${GREEN_COLOR}Import statement for plugin '${selectedPlugin}' not found in app file.${RESET_COLOR}`);
                }
            }
            else {
                console.error(`${RED_COLOR}Could not find plugin imports marker in app file.${RESET_COLOR}`);
            }
            // Remove the app.use statement
            const appUseSectionRegex = /\/\* #PLUGINS REGISTER \*\/([\s\S]*?)\/\* !PLUGINS REGISTER \*\//;
            const appUseMatch = appFileContent.match(appUseSectionRegex);
            if (appUseMatch) {
                let appUseSection = appUseMatch[1];
                if (appUseSection.includes(appUseStatement.trim())) {
                    appUseSection = appUseSection.replace(appUseStatement, '');
                    appFileContent = appFileContent.replace(appUseMatch[1], appUseSection);
                    console.log(`${GREEN_COLOR}Removed app.use statement for plugin '${selectedPlugin}' from app file.${RESET_COLOR}`);
                }
                else {
                    console.log(`${GREEN_COLOR}app.use statement for plugin '${selectedPlugin}' not found in app file.${RESET_COLOR}`);
                }
            }
            else {
                console.error(`${RED_COLOR}Could not find plugin registration marker in app file.${RESET_COLOR}`);
            }
            // Write the updated content back to the app file
            fs_1.default.writeFileSync(appFilePath, appFileContent, 'utf8');
            console.log(`${GREEN_COLOR}Plugin '${selectedPlugin}' has been unregistered from app file.${RESET_COLOR}`);
        }
        else {
            console.error(`${RED_COLOR}App file not found at ${appFilePath}${RESET_COLOR}`);
        }
        // **New Code Ends Here**
        console.log(`${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`);
        console.log(`${GREEN_COLOR}Plugin '${selectedPlugin}' has been deactivated.${RESET_COLOR}`);
        console.log(`${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`);
    });
}
