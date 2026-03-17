import mongoose from "mongoose";

const BuyingInvoiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  pdf: {
    type: String,
    required: true
  },
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now }
});

const BuyingInvoice = mongoose.model("buying-invoice", BuyingInvoiceSchema);
export { BuyingInvoice };