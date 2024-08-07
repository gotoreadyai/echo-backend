import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

interface CategoryAttributes {
  id: string;
  name: string;
  parentId: string | null;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id" | "parentId"> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public parentId!: string | null;
}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "Categories", 
  }
);

export default Category;
