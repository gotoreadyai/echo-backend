const readline = require("readline");

function showTopBar(message) {
  console.clear();
  const line = "─".repeat(66); // Długość ramki
  const framedMessage = `
\x1b[35m\x1b[40m╭${line}╮\x1b[0m
\x1b[35m\x1b[40m│ ${message.padEnd(64)} │\x1b[0m
\x1b[35m\x1b[40m╰${line}╯\x1b[0m
  `;
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearLine(process.stdout, 0);
  process.stdout.write(framedMessage);
}

function clearTopBar() {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearLine(process.stdout, 0);
  console.clear();
}

module.exports = {
  showTopBar,
  clearTopBar,
};
