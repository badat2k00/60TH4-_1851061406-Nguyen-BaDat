const categoryModel = require("../../models/categoryModel");
async function getAllCategory(req, res) {
  try {
    const allCategory = await categoryModel.find().sort({createdAt:-1})
    res.json({
      data: allCategory,
      error: false,
      success: true,
    });
  } catch (e) {
    res.json({
      message: e?.message || e,
      error: true,
      success: false,
    });
  }
}
module.exports = getAllCategory;
