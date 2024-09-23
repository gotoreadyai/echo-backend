// src/services/slugService.ts
import { Model, ModelStatic } from "sequelize";

export const findOneBySlug = async <T extends Model>(
  model: ModelStatic<T>,
  slug: string
): Promise<T | null> => {
  return (await model.findOne({
    where: { slug } as any,
  })) as T | null;
};

export const updateBySlug = async <T extends Model>(
  model: ModelStatic<T>,
  slug: string,
  data: Partial<T["_creationAttributes"]>
): Promise<[number, T[] | null]> => {
  const options = {
    where: { slug } as any,
    returning: true,
  };
  const [affectedCount, affectedRows = null] = await model.update(
    data,
    options
  );
  return [affectedCount, affectedRows as T[] | null];
};
