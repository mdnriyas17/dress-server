const mongoose = require("mongoose");
const master_settings = {
  // company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mastersettings",
    default: null,
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mastersettings",
    default: null,
  },
  image: { type: String, default: null },
  description: { type: String },
  country: {
    type: mongoose.Schema.Types.ObjectId,     
    ref: "mastersettings",
    default: null,
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "mastersettings",
    default: null,
  },
  mode: { type: String, default: null },
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now() },
};

module.exports = master_settings;
