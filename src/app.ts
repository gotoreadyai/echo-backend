import express from "express";
import sequelize from "./db";
import createCrudRoutes from "./routes/crudRoutes";
import createSlugRoutes from "./routes/slugRoutes";
import {
  Document,
  Workspace,
  User,
  CallingFunction,
  Permission,
} from "./models";
import { errorHandler } from "./middleware/errorHandler";
import { listRoutes } from "./utils/listRotues";
import { saveFiles } from "./controllers/seedFileController";

/* #PLUGINS IMPORTS */
import _GoogleAuth from "./plugins/_GoogleAuth/Routes";
import openAI from "./plugins/openAI/Routes";
/* !#PLUGINS IMPORTS */

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(createCrudRoutes(Workspace, "workspace"));
app.use(createCrudRoutes(Document, "document"));
app.use(createCrudRoutes(User, "user"));
app.use(createCrudRoutes(CallingFunction, "callingFunction"));
app.use(createCrudRoutes(Permission, "permission"));
app.use(createSlugRoutes(Workspace, "workspace"));
app.use(createSlugRoutes(Document, "document"));

/* create content as a seed file inside plugin*/
app.post("/seed", saveFiles);

/* #PLUGINS */
app.use(_GoogleAuth);
app.use(openAI);
/* !#PLUGINS */

listRoutes(app);

// Tutaj dodajesz "catch-all" dla nieistniejących tras
app.use((req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  // Przypisujemy status jako właściwość obiektu
  (error as any).status = 404;
  next(error);
});

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

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
