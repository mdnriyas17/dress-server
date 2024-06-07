const mongoose = require("mongoose");

var buyeraddress = new mongoose.Schema(
  {
    // company_code: {
    //   type:mongoose.Schema.Types.ObjectId,
    //   required:true,
    // },
    buyer_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'buyers',
      required:true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
    },
    buyer_number:{
      type: Number,
      required: true,
    },
    buyer_email:{
      type: String,
    },
    address_line1: {
      type: String,
      required: true,
    },
    address_line2: String,
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    landmark:String,
    pincode:{
      type:String,
      required:true,
    },
    alternate_no:Number,
    is_default_address:{
      type:Boolean,
      default:false,
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


module.exports = buyeraddress;