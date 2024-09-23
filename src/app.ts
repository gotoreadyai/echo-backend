import express from "express";
import sequelize from "./db";
import createCrudRoutes from "./routes/crudRoutes";
import { Document, Category, Workspace, User, File } from "./models";
import { errorHandler } from "./middleware/errorHandler";

import filterByCategoryRoutes from "./plugins/filterByCategory/Routes";
import schoolBooksCascade from "./plugins/schoolBooksCascade/Routes";
import JWTauth from "./plugins/JWTauth/Routes";
import openAICall from "./plugins/openAI/Routes";
import contentUpdateBySlug from "./plugins/contentUpdateBySlug/Routes";

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(createCrudRoutes(Workspace, "workspace", undefined, undefined, true));
app.use(
  createCrudRoutes(Document, "document", "workspaceId", "workspace", true)
);
app.use(createCrudRoutes(Category, "category"));
app.use(createCrudRoutes(User, "user"));
app.use(createCrudRoutes(File, "file"));

app.use(filterByCategoryRoutes);
app.use(schoolBooksCascade);
app.use(JWTauth);
app.use(openAICall);
// app.use("/api", contentUpdateBySlug);
app.use(contentUpdateBySlug);

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
