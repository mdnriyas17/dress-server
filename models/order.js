const mongoose = require("mongoose");
const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
  product_name: String,
  product_image:[{
    image_path:String,
    status:String,
    created_date_time:String,
    _id:String,
  }],
  sku:String,
  mrp: { type: Number, required: true },
  sp: { type: Number },
  qty: { type: Number, required: true, min: 1 },
  total: { type: Number },
});
var order = new mongoose.Schema(
  {
    // company_code: {type: mongoose.Schema.Types.ObjectId},
    buyers: { type: mongoose.Schema.Types.ObjectId, ref: "buyers" },
    order_no: { type: Number, required: true },
    financial_year: { type: String, required: true },
    date: { type: Date, default: Date.now },
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
    products: [orderProductSchema],
    total: Number,
    no_of_items: Number,
    cancel: { type: Boolean, default: false },
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Packing",
        "Billed",
        "Dispatched",
        "Delivered",
        "Cancel",
      ],
    },
  }
);

module.exports = order;
