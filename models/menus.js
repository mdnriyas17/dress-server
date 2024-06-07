const mongoose = require('mongoose');
const menus = {
  // company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, default: null,ref:"menus"},
  image: { type: String, default: null },
  url:{type: String, default: null},
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now() },
};

module.exports = menus;