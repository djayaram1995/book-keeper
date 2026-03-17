const express = require("express");
const { SalesInvoice } = require("../models/SalesInvoice");
const router = express.Router();

router.get('/sales', (req, res) => {
    // Here you would typically fetch sales data from MongoDB
   SalesInvoice.find().sort({ createdDate: -1 })
    .then(invoices => {
      res.json(invoices);
    })
    .catch(err => {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

router.post('/sales', (req, res) => {
  const salesInvoice = new SalesInvoice(req.body);
  salesInvoice.save()
    .then(invoice => {
      res.json(invoice);
    })
    .catch(err => {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
module.exports = router;