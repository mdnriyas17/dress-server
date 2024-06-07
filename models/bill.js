const mongoose = require("mongoose");

const bill = new mongoose.Schema({
  buyers: { type: mongoose.Schema.Types.ObjectId, ref: "buyers" },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "orders",
    required: true,
  },
  financial_year: { type: String, required: true },
  quarterly: { type: String, enum: ["Q1", "Q2", "Q3", "Q4"] },
  half_yearly: { type: String, enum: ["H1", "H2"] },
  month: String,
  bill_no: Number,
  invoice_prifix: String,
  invoice_no: String,
  date: { type: Date, default: Date.now() },
  company_address: {
    country: { type: mongoose.Schema.Types.ObjectId, ref: "country" },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "state" },
    district: { type: mongoose.Schema.Types.ObjectId, ref: "district" },
    area: String,
    pincode: Number,
    address_line1: String,
    address_line2: String,
    logo: String,
  },
  delivery_address: {
    firstname: String,
    lastname: String,
    city: String,
    state: String,
    landmark: String,
    address_line1: String,
    address_line2: String,
    pincode: Number,
    buyer_number: Number,
    buyer_email: String,
    alternate_no: Number,
  },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      product_name: String,
      product_image: [String],
      sku: String,
      mrp: { type: Number },
      sp: { type: Number, required: true },
      qty: { type: Number, required: true, min: 1 },
      total: { type: Number },
    },
  ],
  total_amount: Number,
  no_of_items: Number,
  cancel: { type: Boolean, default: false },
  done_by: { type: mongoose.Schema.Types.ObjectId, ref: "admins" },
});

module.exports = bill;
