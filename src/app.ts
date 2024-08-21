import express from "express";
import sequelize from "./db";
import createCrudRoutes from "./routes/crudRoutes";
import { Document, Category, Workspace } from "./models";
import { errorHandler } from "./middleware/errorHandler";


import filterByCategoryRoutes from "./plugins/filterByCategory/Routes";
import schoolBooksCascade from "./plugins/schoolBooksCascade/Routes";

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(createCrudRoutes(Workspace, "workspace"));
app.use(createCrudRoutes(Document, "document", "workspaceId", "workspace"));
app.use(createCrudRoutes(Category, "category"));

app.use(filterByCategoryRoutes);
app.use(schoolBooksCascade);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

let originalString =
  "We and our partners store and/or access information on a device, such as cookies and process personal data, such as unique identifiers and standard information sent by a device for personalised advertising and content, advertising and content measurement, audience research and services development. With your permission we and our partners may use precise geolocation data and identification through device scanning. You may click to consent to our and our 1438 partners’ processing as described above. Alternatively you may access more detailed information and change your preferences before consenting or to refuse consenting. Please note that some processing of your personal data may not require your consent, but you have a right to object to such processing. Your preferences will apply to this website only. You can change your preferences or withdraw your consent at any time by returning to this site and clicking the  button at the bottom of the webpage.";

const { compressString, decompressString } = require("./middleware/huffman");
const { LZ_compressString } = require("./middleware/LZ");
const { RLE_compressString } = require("./middleware/RLE");
let { compressed, huffmanTree } = compressString(originalString);
const dicto_avers = [
  ")(",
  "!1",
  "!2",
  "!3",
  "!4",
  "!5",
  "!6",
  "!7",
  "!8",
  "!9",
  "!0",
  ",1",
  ",2",
  ",3",
  ",4",
  ",5",
  ",6",
  ",7",
  ",8",
  ",9",
];
const dicto_revers = [
  "!",
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
];
let LZ_C_out = LZ_compressString(compressed);
dicto_avers.forEach((el, i) => {
  LZ_C_out = LZ_C_out.replaceAll(el, dicto_revers[i]);
});
console.log("Compressed:", LZ_C_out);

// let decompressed = decompressString(compressed, huffmanTree);
// console.log("Decompressed:", decompressed);

// compressString

// const { encodeBase64, decodeBase64 } = require('./middleware/base64');
// Example usage
// let encodedString = encodeBase64(originalString);
// console.log("Encoded:", encodedString);
// let decodedString = decodeBase64(encodedString);
// console.log("Decoded:", decodedString);

console.log(`-------------------------`);
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
