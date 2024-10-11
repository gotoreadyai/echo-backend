import slugify from "slugify";
import { Model, ModelCtor, WhereOptions } from "sequelize";

export async function generateUniqueSlug<T extends Model>(
  model: ModelCtor<T>,
  title: string,
  id?: string
): Promise<string> {
  // Generowanie podstawowego sluga
  let slugBase = slugify(title, { lower: true });

  // Ograniczenie długości podstawy sluga do 48 znaków
  if (slugBase.length > 48) {
    slugBase = slugBase.substring(0, 48);
  }

  let slug = slugBase;
  let count = 1;

  const whereClause: WhereOptions = { slug };

  let existingEntry = await model.findOne({ where: whereClause });

  while (existingEntry && existingEntry.get("id") !== id) {
    // Zwiększanie liczby przy końcu sluga dla unikalności
    slug = `${slugBase}-${count}`;
    whereClause.slug = slug;
    existingEntry = await model.findOne({ where: whereClause });
    count++;
  }

  return slug;
}
