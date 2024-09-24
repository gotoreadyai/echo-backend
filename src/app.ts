import express from "express";
import sequelize from "./db";
import createCrudRoutes from "./routes/crudRoutes";
import createSlugRoutes from "./routes/slugRoutes";
import { Document, Workspace, User } from "./models";
import { errorHandler } from "./middleware/errorHandler";
import { listRoutes } from "./utils/listRotues";
/* #PLUGINS IMPORTS */import openAI from "./plugins/openAI/Routes";
import contentUpdateBySlug from "./plugins/contentUpdateBySlug/Routes";
import JWTauth from "./plugins/JWTauth/Routes";
import schoolBooksCascade from "./plugins/schoolBooksCascade/Routes";/* !#PLUGINS IMPORTS */
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(createCrudRoutes(Workspace, "workspace"));
app.use(createCrudRoutes(Document, "document"));
app.use(createCrudRoutes(User, "user"));
app.use(createSlugRoutes(Workspace, 'workspace'));
app.use(createSlugRoutes(Document, 'document'));
/* #PLUGINS */app.use(openAI);
app.use(contentUpdateBySlug);
app.use(JWTauth);
app.use(schoolBooksCascade);/* !#PLUGINS */
app.use(errorHandler);
const PORT = process.env.PORT || 3000;

// Wyświetlenie kolorowych tras
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
