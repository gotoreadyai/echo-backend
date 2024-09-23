import path from "path";

const param = process.argv[2];
const modelsPath = path.resolve(
  path.join(__dirname, "src", "plugins", param, "models")
);
console.log(modelsPath);
