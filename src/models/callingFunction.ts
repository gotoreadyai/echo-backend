import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db"; // Upewnij się, że ścieżka do instancji Sequelize jest poprawna
import User from "./user";

interface CallingFunctionAttributes {
  id: string;
  title: string;
  slug: string;
  description: string;
  response: Record<string, any>;
  parameters: Record<string, any>;
  systemMessage: string;
  userMessage: string;
  plugin: string;
  ownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CallingFunctionCreationAttributes
  extends Optional<
    CallingFunctionAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class CallingFunction
  extends Model<CallingFunctionAttributes, CallingFunctionCreationAttributes>
  implements CallingFunctionAttributes
{
  public id!: string;
  public title!: string;
  public description!: string;
  public slug!: string;
  public response!: Record<string, any>;
  public parameters!: Record<string, any>;
  public systemMessage!: string;
  public userMessage!: string;
  public plugin!:string;
  public ownerId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CallingFunction.init(
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
    slug: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
      
    },
    response: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    parameters: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    systemMessage: {
      type: DataTypes.STRING,
    },
    userMessage: {
      type: DataTypes.STRING,
    },
    plugin: {
      type: DataTypes.STRING,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CallingFunction",
    timestamps: true, // Automatycznie dodaje createdAt i updatedAt
  }
);

// Relacja z modelem User
CallingFunction.belongsTo(User, { foreignKey: "ownerId", as: "owner" });


export default CallingFunction;
