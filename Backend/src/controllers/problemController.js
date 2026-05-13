
import { db } from "../database/db.js"

const patternWise = (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT 
          t.id,
          t.name as tag,
          COALESCE(
              json_group_array(
                  CASE 
                      WHEN p.id IS NOT NULL THEN
                          json_object(
                              'id', p.id,
                              'title', p.name
                          )
                  END
              ),
              '[]'
          ) as problems
      FROM tags t
      LEFT JOIN problemTagsRelation pt ON t.id = pt.tid
      LEFT JOIN problems p ON p.id = pt.pid
      GROUP BY t.id, t.name
      ORDER BY t.id
    `).all();

    // SQLite returns JSON as string → convert it
    const formatted = rows.map(row => ({
      ...row,
      problems: JSON.parse(row.problems)
    }));

    return res.json({
      success: true,
      data: formatted
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export {patternWise}