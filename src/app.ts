import express from 'express';
import sequelize from './db';
import createCrudRoutes from './routes/crudRoutes';
import { Document, Category } from './models';
import { errorHandler } from './middleware/errorHandler';

import { Language, LessonObjective, BookTitle, UnitTitle, Subject, LessonStrategy } from './plugins/booksModels';

import filterByCategoryRoutes from './plugins/filterByCategory/filterByCategoryRoutes';

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(createCrudRoutes(Document, 'document'));
app.use(createCrudRoutes(Category, 'category'));


app.use(createCrudRoutes(Language, 'language'));
app.use(createCrudRoutes(LessonObjective, 'lessonObjective'));
app.use(createCrudRoutes(BookTitle, 'bookTitle'));
app.use(createCrudRoutes(UnitTitle, 'unitTitle'));
app.use(createCrudRoutes(Subject, 'subject'));
app.use(createCrudRoutes(LessonStrategy, 'lessonStrategy'));


app.use(filterByCategoryRoutes);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;
console.log(`-------------------------`);
sequelize.sync({force: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});
