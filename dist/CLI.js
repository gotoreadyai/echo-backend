#!/usr/bin/env node
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
const inquirer_1 = __importDefault(require("inquirer"));
const handleConfig_1 = require("./cli/handleConfig");
const handleLoadPlugin_1 = require("./cli/handleLoadPlugin");
const handleActivatePlugin_1 = require("./cli/handleActivatePlugin");
const handleDeactivatePlugin_1 = require("./cli/handleDeactivatePlugin");
const handleUpdateSeed_1 = require("./cli/handleUpdateSeed");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let continueLoop = true;
    while (continueLoop) {
        try {
            const { action } = yield inquirer_1.default.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Choose an action:",
                    choices: [
                        "config",
                        "loadPlugin",
                        "activatePlugin",
                        "updateSeed",
                        "deactivatePlugin",
                        new inquirer_1.default.Separator(),
                        "Exit",
                    ],
                },
            ]);
            if (action === "Exit") {
                continueLoop = false;
                console.log("Goodbye!");
                break;
            }
            switch (action) {
                case "config":
                    yield (0, handleConfig_1.handleConfig)();
                    break;
                case "loadPlugin":
                    yield (0, handleLoadPlugin_1.handleLoadPlugin)();
                    break;
                case "activatePlugin":
                    yield (0, handleActivatePlugin_1.handleActivatePlugin)();
                    break;
                case "deactivatePlugin":
                    yield (0, handleDeactivatePlugin_1.handleDeactivatePlugin)();
                    break;
                case "updateSeed":
                    yield (0, handleUpdateSeed_1.handleUpdateSeed)();
                    break;
                default:
                    console.log("Invalid action selected.");
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
            continueLoop = false;
        }
    }
}))();
