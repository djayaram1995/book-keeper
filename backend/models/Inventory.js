import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
{
  itemName: {
    type: String,
    required: true,
    index: true
  },

  sku: {
    type: String,
    required: true,
    unique: true
  },

  category: {
    type: String
  },

  brand: {
    type: String
  },

  description: String,

  unit: {
    type: String,
    default: "pcs"
  },

  availableQuantity: {
    type: Number,
    default: 0
  },

  reservedQuantity: {
    type: Number,
    default: 0
  },

  damagedQuantity: {
    type: Number,
    default: 0
  },

  reorderLevel: {
    type: Number,
    default: 5
  },

  procurementPrice: {
    type: Number,
    required: true
  },

  sellingPrice: {
    type: Number,
    required: true
  },

  mrp: Number,

  gstRate: {
    type: Number,
    default: 18
  },

  supplier: {
    supplierName: String,
    supplierPhone: String,
    supplierAddress: String
  },

  warehouseLocation: {
    rack: String,
    shelf: String,
    bin: String
  },

  batchNumber: String,

  serialNumbers: [String],

  manufactureDate: Date,

  expiryDate: Date,

  lastProcurementDate: Date,

  lastSoldDate: Date,

  stockValue: Number,

  isActive: {
    type: Boolean,
    default: true
  }

}
);
const Inventory = mongoose.model("inventory", InventorySchema);
export { Inventory };