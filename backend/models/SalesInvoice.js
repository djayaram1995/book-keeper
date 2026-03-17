import mongoose from "mongoose";

const SalesInvoiceSchema = new mongoose.Schema({
    invoiceId: { type: String, required: true },
    date: { type: Date, required: true },
    gstNeeded: { type: Boolean, required: true },
    items: [
        {
            itemId: { type: String, required: false },
            quantity: { type: Number, required: true },
            rate: { type: Number, required: true },
            itemName: { type: String, required: true },
            description: { type: String, required: true },
            serialNo: { type: String, required: true },
            isService: { type: Boolean, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, required: true },
    tax: { type: Number, required: true },
    preTaxAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    buyerName: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    shipName: { type: String, required: true },
    shipAddress: { type: String, required: true },
    shipPhone: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    modifiedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['cancelled', 'paid'], default: 'paid' }
});
const SalesInvoice = mongoose.model('sales-invoices', SalesInvoiceSchema);

export { SalesInvoice };