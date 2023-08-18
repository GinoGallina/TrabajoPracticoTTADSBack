import  Category  from '../models/database/category.js'


const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({ deletedAt: null });
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las categorías' });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findOne({
        _id: req.params.id,
        deletedAt: null,
      });
      if (!category) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la categoría' });
    }
  },


  createCategory: async (req, res) => {
    try {

      const existingCategory = await Category.findOne({ category: req.body.category });
      if (existingCategory) {
        if (existingCategory.deletedAt !== null) {
          existingCategory.deletedAt = null;
          await existingCategory.save();
          return res.status(200).json({"message":"Categoria reestablecida","data":existingCategory});
        } else {
          return res.status(400).json({ error: 'La categoría ya existe' });
        }
      }

      const { category } = req.body;
      const newCategory = new Category({ category });
      const savedCategory = await newCategory.save();
      res.status(201).json({"message":"Categoria creada","data":savedCategory});
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la categoría' });
    }
  },

    updateCategoryById: async (req, res) => {
    try {
      const existingCategory = await Category.findOne({
        _id: req.params.id,
        deletedAt: null,
      });

      if (!existingCategory) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      const existsByCatgory = await Category.findOne({ category: req.body.category });
      if (existsByCatgory && existsByCatgory._id.toString()!= existingCategory._id.toString()) {
        return res.status(404).json({ error: 'La categoría ya existe' });
      }

      existingCategory.category = req.body.category;
      const updatedCategory = await existingCategory.save();
      console.log(updatedCategory)

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
  
  logicDeleteCategoryById: async (req, res) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { new: true } // Devuelve el documento actualizado
      );
      console.log(updatedCategory)
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }

      res.status(200).json({ message: 'Categoría eliminada lógicamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la categoría' });
    }
  },
};

export default categoryController;