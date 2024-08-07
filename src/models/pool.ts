import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db";

// Typowanie atrybutów modelu
interface PoolAttributes {
  id: string;
  title: string;
  content: string;
}

// Typowanie dla tworzenia nowego dokumentu
interface PoolCreationAttributes extends Optional<PoolAttributes, "id"> {}

class Pool
  extends Model<PoolAttributes, PoolCreationAttributes>
  implements PoolAttributes
{
  public id!: string;
  public title!: string;
  public content!: string;
}

Pool.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pool",
  }
);

export default Pool;
