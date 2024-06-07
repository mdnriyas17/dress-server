const mongoose = require('mongoose');
const orderlog = {
  // company_code: { type: mongoose.Schema.Types.ObjectId },
  order_id: { type: mongoose.Schema.Types.ObjectId,ref:"orders" },
  order_status: { type: String},
  status_date:{type:Date,default:Date.now()},
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId },
  created_at: { type: Date, default: Date.now() },
};

module.exports = orderlog;