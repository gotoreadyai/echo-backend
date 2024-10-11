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
import { saveData } from "./controllers/seedController";

/* #PLUGINS IMPORTS */
import SchoolDaze from "./plugins/schoolDaze/Routes";
import JWTauth from "./plugins/JWTauth/Routes";
import schoolDaze from "./plugins/schoolDaze/Routes";
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

app.post("/seed", saveData);

/* #PLUGINS */
app.use(SchoolDaze);
app.use(JWTauth);
app.use(schoolDaze);
app.use(openAI);
/* !#PLUGINS */

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

listRoutes(app);
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
