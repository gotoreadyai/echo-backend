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
exports.handleActivatePlugin = handleActivatePlugin;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const child_process_1 = require("child_process");
const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const RESET_COLOR = "\x1b[0m";
function handleActivatePlugin() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Activating plugin...");
        const pluginsDir = path_1.default.join(__dirname, "..", "src", "plugins");
        if (!fs_1.default.existsSync(pluginsDir)) {
            console.error(`Plugins directory not found at ${pluginsDir}`);
            return;
        }
        const plugins = fs_1.default.readdirSync(pluginsDir).filter((file) => {
            const pluginPath = path_1.default.join(pluginsDir, file);
            return fs_1.default.statSync(pluginPath).isDirectory();
        });
        if (plugins.length === 0) {
            console.log("No plugins found in src/plugins.");
            return;
        }
        const inactivePlugins = plugins.filter((plugin) => {
            const activeFilePath = path_1.default.join(pluginsDir, plugin, "active");
            return !fs_1.default.existsSync(activeFilePath);
        });
        if (inactivePlugins.length === 0) {
            console.log("All plugins are already active.");
            return;
        }
        const returnToMenuOption = `${RED_COLOR}Return to Main Menu${RESET_COLOR}`;
        const choices = [
            { name: returnToMenuOption, value: "Return to Main Menu" },
            ...inactivePlugins.map((plugin) => ({ name: plugin, value: plugin })),
        ];
        const { selectedPlugin } = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "selectedPlugin",
                message: "Select a plugin to activate:",
                choices: choices,
            },
        ]);
        if (selectedPlugin === "Return to Main Menu") {
            console.log("Returning to main menu...");
            return;
        }
        const pluginDir = path_1.default.join(pluginsDir, selectedPlugin);
        const activeFilePath = path_1.default.join(pluginDir, "active");
        // Activate the plugin by creating an 'active' file
        fs_1.default.writeFileSync(activeFilePath, "");
        console.log(`${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`);
        console.log(`${GREEN_COLOR}Plugin '${selectedPlugin}' has been activated.${RESET_COLOR}`);
        // Check if the plugin contains a 'models' subdirectory
        const modelsDir = path_1.default.join(pluginDir, "models");
        const hasModels = fs_1.default.existsSync(modelsDir) && fs_1.default.statSync(modelsDir).isDirectory();
        if (hasModels) {
            console.log(`${GREEN_COLOR}Models found in the plugin directory.${RESET_COLOR}`);
        }
        else {
            console.log(`${RED_COLOR}No models found in the plugin directory. Skipping migrations.${RESET_COLOR}`);
        }
        console.log(`${GREEN_COLOR}------------------------------------------------------------${RESET_COLOR}`);
        // Only run migrations if the plugin contains a 'models' directory
        if (hasModels) {
            // If the 'plugins' directory exists, execute 'npm run generate:migrations' synchronously
            const projectRoot = path_1.default.join(__dirname, "..");
            const migrationsDir = path_1.default.join(projectRoot, "migrations");
            const pluginsRootDir = path_1.default.join(projectRoot, "src", "plugins"); // Adjusted path
            console.log(`${pluginsRootDir}/${selectedPlugin}`);
            if (fs_1.default.existsSync(pluginsRootDir) &&
                fs_1.default.statSync(pluginsRootDir).isDirectory()) {
                try {
                    console.log("Generating migrations...");
                    // Capture the list of migration files before generation
                    const filesBefore = fs_1.default.existsSync(migrationsDir)
                        ? fs_1.default.readdirSync(migrationsDir)
                        : [];
                    (0, child_process_1.execSync)(`npm run generate:migrations -- ${selectedPlugin}`, {
                        stdio: "inherit",
                        cwd: projectRoot,
                    });
                    console.log(`${GREEN_COLOR}Migrations generated successfully.${RESET_COLOR}`);
                    // Capture the list of migration files after generation
                    const filesAfter = fs_1.default.existsSync(migrationsDir)
                        ? fs_1.default.readdirSync(migrationsDir)
                        : [];
                    // Determine the new files by comparing before and after lists
                    const newFiles = filesAfter.filter((file) => !filesBefore.includes(file));
                    // Filter the files related to the selected plugin
                    const pluginFiles = newFiles.filter((file) => file.includes(`create-${selectedPlugin}`));
                    if (pluginFiles.length > 0) {
                        console.log(`${GREEN_COLOR}Created migration files:${RESET_COLOR}`);
                        pluginFiles.forEach((file) => {
                            console.log(`${GREEN_COLOR}- ${file}${RESET_COLOR}`);
                        });
                    }
                    else {
                        console.log(`${RED_COLOR}No new migration files were created for plugin '${selectedPlugin}'.${RESET_COLOR}`);
                    }
                    // Apply all pending migrations
                    console.log(`${GREEN_COLOR}Applying all pending migrations...${RESET_COLOR}`);
                    try {
                        (0, child_process_1.execSync)(`npx sequelize-cli db:migrate`, {
                            stdio: "inherit",
                            cwd: projectRoot,
                        });
                        console.log(`${GREEN_COLOR}All pending migrations applied successfully.${RESET_COLOR}`);
                    }
                    catch (error) {
                        console.error(`${RED_COLOR}Error applying migrations: ${error.message}${RESET_COLOR}`);
                    }
                }
                catch (error) {
                    console.error(`${RED_COLOR}Error generating migrations: ${error.message}${RESET_COLOR}`);
                }
            }
            else {
                console.log(`${RED_COLOR}Plugins directory does not exist at ${pluginsRootDir}.${RESET_COLOR}`);
            }
        }
        // Register the plugin in the app file
        const projectRoot = path_1.default.join(__dirname, "..");
        const appFilePath = path_1.default.join(projectRoot, "src", "app.ts"); // Updated path to include /src
        if (fs_1.default.existsSync(appFilePath)) {
            let appFileContent = fs_1.default.readFileSync(appFilePath, "utf8");
            // Prepare the import statement and app.use line
            const pluginVariableName = `${selectedPlugin}Routes`; // Adjust variable name as needed
            const importStatement = `import ${pluginVariableName} from "./plugins/${selectedPlugin}/Routes";\n`;
            const appUseStatement = `app.use(${pluginVariableName});\n`;
            // Check if the import statement already exists
            const importsSectionRegex = /\/\* #PLUGINS IMPORTS \*\/([\s\S]*?)\/\* !#PLUGINS IMPORTS \*\//;
            const importsMatch = appFileContent.match(importsSectionRegex);
            if (importsMatch) {
                const importsSection = importsMatch[0];
                if (!importsSection.includes(importStatement.trim())) {
                    // Insert the import statement before the closing marker
                    const updatedImportsSection = importsSection.replace("/* !#PLUGINS IMPORTS */", `${importStatement}/* !#PLUGINS IMPORTS */`);
                    appFileContent = appFileContent.replace(importsSection, updatedImportsSection);
                }
                else {
                    console.log(`${GREEN_COLOR}Import statement for plugin '${selectedPlugin}' already exists.${RESET_COLOR}`);
                }
            }
            else {
                console.error(`${RED_COLOR}Could not find plugin imports marker in app file.${RESET_COLOR}`);
            }
            // Check if the app.use statement already exists
            const appUseSectionRegex = /\/\* #PLUGINS REGISTER \*\/([\s\S]*?)\/\* !PLUGINS REGISTER \*\//;
            const appUseMatch = appFileContent.match(appUseSectionRegex);
            if (appUseMatch) {
                const appUseSection = appUseMatch[0];
                if (!appUseSection.includes(appUseStatement.trim())) {
                    // Insert the app.use statement before the closing marker
                    const updatedAppUseSection = appUseSection.replace("/* !PLUGINS REGISTER */", `${appUseStatement}/* !PLUGINS REGISTER */`);
                    appFileContent = appFileContent.replace(appUseSection, updatedAppUseSection);
                }
                else {
                    console.log(`${GREEN_COLOR}app.use statement for plugin '${selectedPlugin}' already exists.${RESET_COLOR}`);
                }
            }
            else {
                console.error(`${RED_COLOR}Could not find plugin registration marker in app file.${RESET_COLOR}`);
            }
            // Write the updated content back to the app file
            fs_1.default.writeFileSync(appFilePath, appFileContent, "utf8");
            console.log(`${GREEN_COLOR}Plugin '${selectedPlugin}' has been registered in app file.${RESET_COLOR}`);
        }
        else {
            console.error(`${RED_COLOR}App file not found at ${appFilePath}${RESET_COLOR}`);
        }
    });
}
