const { spawnSync } = require("child_process");

const commandService = {
  runCmd: (command) => {
    console.log("\n");
    console.log("\x1b[31m", "\x1b[45m", "░░▓", "\x1b[0m"); // zmiana tła na ciemny fioletowy (kod 45)
    console.log(
      "\x1b[31m",
      "\x1b[45m",
      "▓▓▓",
      "\x1b[0m",
      "Running command:",
      "\x1b[0m"
    );
    console.log("\x1b[31m", "░░░", "\x1b[0m", command, "\x1b[0m");
    

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

// export function executeCommand(command: string, cwd: string): void {
//   try {
//     execSync(command, { stdio: "inherit", cwd });
//   } catch (error: any) {
//     logError(`Error executing command "${command}": ${error.message}`);
//     throw error;
//   }
// }
