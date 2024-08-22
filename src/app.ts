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
