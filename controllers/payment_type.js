import  PaymentType  from '../models/database/payment_type.js'


const paymenttypeController = {
  getAllPaymentTypes: async (req, res) => {
    try {
      const payment_types = await PaymentType.find();
      res.status(200).json(payment_types);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los tipos de pagos' });
    }
  },

  getPaymentTypeById: async (req, res) => {
    try {
      const payment_type = await PaymentType.findById(req.params.id);
      res.status(200).json (payment_type);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el tipo de pago' });
    }
  },

  createPaymentType: async (req, res) => {
    try {
      const { payment_id, type } = req.body;
      const newPaymentType = new PaymentType({ payment_id, type });
      const savedPaymentType = await newPaymentType.save();
      res.status(201).json(savedPaymentType);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el tipo de pago' });
    }
  },

  updatePaymentTypeById: async (req, res) => {
    try {
      const updatedPaymentType = await PaymentType.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedPaymentType);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el tipo de pago' });
    }
  },

  deletePaymentTypeById: async (req, res) => {
    try {
      await PaymentType.findByIdAndDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el tipo de pago' });
    }
  },
};

export default paymenttypeController;