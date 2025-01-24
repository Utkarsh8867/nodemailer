import Category from '../model/Category.js';

export const getCategoryIdByName = async (req, res, next) => {
  const { name } = req.body; // Assuming the name is sent in the request body
  try {
    const category = await Category.findOne({ name: name.trim() });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    req.categoryId = category._id; // Add the category ID to the request object
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

