const path = require("path");
const Document = require(path.resolve(
  __dirname,
  "src/models/document"
)).default;
const documentAttributes = Document.getAttributes();
Object.entries(documentAttributes).forEach(([key, value]) => {
  console.log(`Kolumna: ${key}`);
  console.log(`Wartość: `, value);
});


const config = require(path.resolve(
  __dirname,
  "config/generatorsconfig.json"
));
console.log(config);

/*
npx ts-node tests.js
*/
