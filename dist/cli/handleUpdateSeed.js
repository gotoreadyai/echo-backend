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
exports.handleUpdateSeed = handleUpdateSeed;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const GREEN_COLOR = '\x1b[32m';
const RED_COLOR = '\x1b[31m';
const RESET_COLOR = '\x1b[0m';
function handleUpdateSeed() {
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
                message: 'Select a plugin to update:',
                choices: choices,
            },
        ]);
        if (selectedPlugin === 'Return to Main Menu') {
            console.log('Returning to main menu...');
            return;
        }
        const pluginDir = path_1.default.join(pluginsDir, selectedPlugin);
        // **New Code Ends Here**
    });
}
