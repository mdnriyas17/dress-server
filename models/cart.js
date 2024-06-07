const mongoose = require("mongoose");

var carts = new mongoose.Schema(
  {
    // company_code:{
    //   type:mongoose.Schema.Types.ObjectId,
    //   required:true,
    // },
    buyer_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'buyers',
      required:true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'products',
      required: true,
    },
    qty: {
      type: Number,
      required: true,
      default:1,
    },
    status: {
      type:Boolean,
      default:true,
    },
    created_date_time: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  }
);

module.exports = carts;

