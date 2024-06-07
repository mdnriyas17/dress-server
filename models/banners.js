const mongoose = require('mongoose');
const banner = {
  // company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true,unique:true},
  discription:{type: String},
  link:{type: String},
  image: { type: String, default: null },
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now() },
};

module.exports = banner;