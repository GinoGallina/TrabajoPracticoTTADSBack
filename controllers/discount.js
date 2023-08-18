import { Discount } from '../models/local-file-syste/discounts.js'


const discountController = {
  getAllDiscounts: async (req, res) => {
    try {
      const discounts = await Discount.find();
      console.log(discounts)
      res.status(200).json(discounts);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los descuentos' });
    }
  },
        
  getDiscountById: async (req, res) => {
    try {
      const discount = await Discount.findById(req.params.id);
          res.status(200).json (discount);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el descuento' });
    }
  },
  
  
  createDiscount: async (req, res) => {
    try {
      const { discount_id, created_date, update_date  } = req.body;
      const newDiscount = new Discount({ discount_id, created_date, update_date});
      const savedDiscount = await newDiscount.save();
      res.status(201).json(savedDiscount);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el descuento' });
    }
  },
        
  updateDiscountById: async (req, res) => {
    try {
      const updatedDiscount = await Discount.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
      );
      res.status(200).json(updatedDiscount);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el descuento' });
    }
  },
        
  deleteDiscountById: async (req, res) => {
    try {
      await Discount.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el descuento' });
    }
  },
};
        
 export default discountController;