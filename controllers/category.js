import  Category  from '../models/database/category.js'


const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      console.log(categories)
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías' });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría' });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { category_id, category } = req.body;
      const newCategory = new Category({ category_id, category });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría' });
    }
  },

  updateCategoryById: async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la categoría' });
    }
  },

  deleteCategoryById: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
  },
};

export default categoryController;