import slugify from "slugify";
import { Model, ModelCtor, WhereOptions } from "sequelize";

export async function generateUniqueSlug<T extends Model>(
  model: ModelCtor<T>,
  title: string,
  id?: string
): Promise<string> {
  let slugBase = slugify(title, { lower: true });
  let slug = slugBase;
  let count = 1;

  const whereClause: WhereOptions = { slug };

  let existingEntry = await model.findOne({ where: whereClause });

  while (existingEntry && existingEntry.get("id") !== id) {
    slug = `${slugBase}-${count}`;
    whereClause.slug = slug;
    existingEntry = await model.findOne({ where: whereClause });
    count++;
  }

  return slug;
}
