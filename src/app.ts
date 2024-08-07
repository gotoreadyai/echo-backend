import express from 'express';
import sequelize from './db';
import createCrudRoutes from './routes/crudRoutes';
import { Document, Category } from './models';
import { errorHandler } from './middleware/errorHandler';

import filterByCategoryRoutes from './plugins/filterByCategory/filterByCategoryRoutes';

const app = express();

app.use(express.json());
app.use(createCrudRoutes(Document, 'document'));
app.use(createCrudRoutes(Category, 'category'));

app.use(filterByCategoryRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
sequelize.sync({force: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
