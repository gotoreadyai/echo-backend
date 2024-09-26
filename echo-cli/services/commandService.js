const { spawnSync } = require("child_process");
const { drawFrame } = require("./../utils/messages");

const commandService = {
  runCmd: (command) => {
    drawFrame("Running command:", "EXE");

    console.log("\x1b[34m", "\x1b[40m", command, "\x1b[0m");

    const [cmd, ...args] = command.split(" ");
    const result = spawnSync(cmd, args, { stdio: "inherit" });

    if (result.error) {
      console.error(`Error executing command: ${result.error.message}`);
    } else if (result.status !== 0) {
      console.error(`Process exited with code ${result.status}`);
    }

    return result.status;
  },
};

module.exports = commandService;
