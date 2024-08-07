import { QueryTypes } from 'sequelize';
import sequelize from '../../db';
import Category from '../../models/category';
import Document from '../../models/document';
import { Op } from 'sequelize';

// Funkcja do pobierania wszystkich kategorii podrzędnych za pomocą CTE
const getAllSubcategories = async (categoryId: string): Promise<string[]> => {
  const results = await sequelize.query(`
    WITH RECURSIVE CategoryTree AS (
      SELECT id, parentId
      FROM Categories
      WHERE id = :categoryId
      UNION ALL
      SELECT c.id, c.parentId
      FROM Categories c
      INNER JOIN CategoryTree ct ON ct.id = c.parentId
    )
    SELECT id FROM CategoryTree
  `, {
    replacements: { categoryId },
    type: QueryTypes.SELECT
  });

  return results.map((result: any) => result.id);
};

// Funkcja do filtrowania dokumentów po kategorii i jej podrzędnych kategoriach
export const findDocumentsByCategory = async (categoryId: string) => {
  try {
    const categoryIds = [categoryId, ...await getAllSubcategories(categoryId)];
    return await Document.findAll({
      include: [
        {
          model: Category,
          where: {
            id: {
              [Op.in]: categoryIds
            }
          },
          through: { attributes: [] } // Ignore the DocumentCategory attributes
        }
      ]
    });
  } catch (error) {
    throw new Error(`Error fetching documents for category ${categoryId}: ${error}`);
  }
};
