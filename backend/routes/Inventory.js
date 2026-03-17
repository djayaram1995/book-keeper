const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const { BuyingInvoice } = require("../models/BuyingInvoice");
const path = require("path");
const { Inventory } = require("../models/Inventory");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = "./uploads/invoices";

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"));
    }
  }
});
router.get('/invoice', (req, res) => {
   BuyingInvoice.find().sort({ createdDate: -1 })
    .then(invoices => {
      res.json(invoices);
    })
    .catch(err => {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
router.get('/invoice/:id', (req, res) => {
    BuyingInvoice.findById(req.params.id)
    .then(invoice => {
        const filePath = path.resolve(invoice.pdf);
        res.sendFile(filePath);
    })
    .catch(err => {
      console.error('Error fetching sales data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const { name, date } = req.body;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    const invoice = new BuyingInvoice({name, date, pdf: req.file.path});

    await invoice.save();

    res.json({
      message: "Invoice uploaded",
      data: invoice
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CREATE ITEM
router.post("/", async (req, res) => {
  try {

    const item = new Inventory(req.body);

    item.stockValue =
      item.availableQuantity * item.procurementPrice;

    const saved = await item.save();

    res.json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ALL ITEMS
router.get("/", async (req, res) => {
  try {

    const items = await Inventory.find().sort({ createdAt: -1 });

    res.json(items);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET SINGLE ITEM
router.get("/:id", async (req, res) => {
  try {

    const item = await Inventory.findById(req.params.id);

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE ITEM
router.put("/:id", async (req, res) => {
  try {

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE ITEM
router.delete("/:id", async (req, res) => {
  try {

    await Inventory.findByIdAndDelete(req.params.id);

    res.json({ message: "Item deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ADD STOCK
router.post("/:id/add-stock", async (req, res) => {
  try {

    const { quantity } = req.body;

    const item = await Inventory.findById(req.params.id);

    item.availableQuantity += quantity;

    item.stockValue =
      item.availableQuantity * item.procurementPrice;

    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// REDUCE STOCK
router.post("/:id/remove-stock", async (req, res) => {
  try {

    const { quantity } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (item.availableQuantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    item.availableQuantity -= quantity;

    item.stockValue =
      item.availableQuantity * item.procurementPrice;

    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;