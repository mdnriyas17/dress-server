const mongoose = require("mongoose");

const company = new mongoose.Schema({
  company_name: { type: String },
  admin_id: { type: mongoose.Schema.Types.ObjectId },
  gst_no: String,
  country: String,
    state: String,
    district: String,
    city: String,
    area: String,
    pincode: Number,
    address_line1: String,
    address_line2: String,
  landline_no: String,
  email: String,
  mobile_no: String,
  website: String,
  logo: String,
  map: String,
  status: { type: Boolean, default: true },
  created_date_time: {
    type:Date,
    default:Date.now(),
  }
});

module.exports = company;
