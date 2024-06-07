const mongoose = require('mongoose');
const products = {
  // company_code: { type: mongoose.Schema.Types.ObjectId, required: true },
  product_name: { type: String, required: true,unique:true },
  sku: { type: String,unique:true},
  brand_id: { type: mongoose.Schema.Types.ObjectId, default: null,ref:"mastersettings"},
  category_id: { type: [mongoose.Schema.Types.ObjectId], default: null,ref:"mastersettings"},
  highlights: [{
    highlight:String,
  }],
  specification: [
    {
      specification_id:{ type: mongoose.Schema.Types.ObjectId, default: null,ref:"mastersettings"},
      text:String,
    }
  ],
  mrp:{type:Number,required:true},
  // sp:{type:Number},
  image: [
      {
        image_path: {
          type:String,
        },
        status: {
          type:String,
          default:true,
        },
        created_date_time: {
          type:Date,
          default:Date.now(),
        },
      }
    ],
  description: { type: String, default: null },
  status: { type: Boolean, default: true },
  done_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now() },
};

module.exports = products;