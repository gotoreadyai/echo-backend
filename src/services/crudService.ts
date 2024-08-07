import {
  Model,
  FindOptions,
  ModelStatic,
  UpdateOptions,
  DestroyOptions,
} from "sequelize";

export const findAll = async <T extends Model>(
  model: ModelStatic<T>,
  options?: FindOptions
): Promise<T[]> => {
  return (await model.findAll(options)) as T[];
};

export const findOne = async <T extends Model>(
  model: ModelStatic<T>,
  id: string
): Promise<T | null> => {
  return (await model.findByPk(id)) as T | null;
};

export const create = async <T extends Model>(
  model: ModelStatic<T>,
  data: T["_creationAttributes"]
): Promise<T> => {
  return (await model.create(data)) as T;
};

export const update = async <T extends Model>(
  model: ModelStatic<T>,
  id: string,
  data: Partial<T["_creationAttributes"]>
): Promise<[number, T[] | null]> => {
  const options: UpdateOptions = {
    where: { id },
    returning: true,
  };
  const res = await model.update(data, options);
  /* jakaś miazga tutaj jest z typami */
  return [0, {}] as [number, T[]];
};

export const remove = async <T extends Model>(
  model: ModelStatic<T>,
  id: string
): Promise<number> => {
  const options: DestroyOptions = {
    where: { id },
  };
  return await model.destroy(options);
};
