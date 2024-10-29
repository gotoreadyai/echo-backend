import {
  Model,
  FindOptions,
  ModelStatic,
  UpdateOptions,
  DestroyOptions,
} from "sequelize";

export const findAll = async <T extends Model>(
  model: ModelStatic<T>,
  options?: FindOptions,
  page?: number,
  pageSize?: number
): Promise<{
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}> => {
  const limit = pageSize || 10; // Domyślny rozmiar strony
  const offset = page ? (page - 1) * limit : 0;

  const findOptions: FindOptions = {
    include: options?.include || [],
    where: options?.where || {},
    limit,
    offset,
  };

  const { rows, count } = await model.findAndCountAll(findOptions);
  return {
    items: rows,
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page || 1,
  };
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

export const createBulk = async <T extends Model>(
  model: ModelStatic<T>,
  data: T["_creationAttributes"][]
): Promise<T[]> => {
  const itemsWithOwnerId = data.map(item => ({
    ...item,
    ownerId: item.ownerId, // Assuming ownerId is included in the data
  }));

  return await model.bulkCreate(itemsWithOwnerId) as T[];
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
  const [affectedCount, affectedRows = null] = await model.update(
    data,
    options
  );
  return [affectedCount, affectedRows as T[] | null];
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
