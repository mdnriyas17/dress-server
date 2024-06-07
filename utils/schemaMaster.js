const mongoose = require('mongoose');
const version = { timestamps: true, versionKey: false };
//Import Schema
const import_admin_login_schema = require('../models/admin_login');
const import_user_login_schema = require("../models/user_login")
const import_master_settings_schema = require("../models/master_settings");
const import_product_schema = require("../models/products");
const import_menus_schema = require("../models/menus");
const import_banner_schema = require("../models/banners");
const import_buyers_schema = require("../models/buyers");
const import_buyeraddress_schema = require("../models/buyeraddress");
const import_cart_schema = require("../models/cart");
const import_order_schema = require("../models/order");
const import_orderlog_schema = require("../models/orderlogs");
const import_bill_schema = require("../models/bill");
const import_company_schema = require("../models/company");





//Creating Schema
const create_admin_login_schema = mongoose.Schema(import_admin_login_schema, version);
const create_user_login_schema = mongoose.Schema(import_user_login_schema,version);
const create_master_settings_schema = mongoose.Schema(import_master_settings_schema, version);
const create_product_schema = mongoose.Schema(import_product_schema, version);
const create_menus_schema = mongoose.Schema(import_menus_schema, version);
const create_banner_schema = mongoose.Schema(import_banner_schema, version);
const create_buyers_schema = mongoose.Schema(import_buyers_schema, version);
const create_buyeraddress_schema = mongoose.Schema(import_buyeraddress_schema, version);
const create_cart_schema = mongoose.Schema(import_cart_schema, version);
const create_order_schema = mongoose.Schema(import_order_schema, version);
const create_orderlog_schema = mongoose.Schema(import_orderlog_schema, version);
const create_bill_schema = mongoose.Schema(import_bill_schema, version);
const create_company_schema = mongoose.Schema(import_company_schema, version);



//Creating Model
const create_admin_login_model = mongoose.model('admin', create_admin_login_schema);
const create_user_login_model = mongoose.model("user",create_user_login_schema);
const create_master_settings_model = mongoose.model('mastersettings', create_master_settings_schema);
const create_product_model = mongoose.model('products', create_product_schema);
const create_menus_model = mongoose.model('menus', create_menus_schema);
const create_banner_model = mongoose.model('banners', create_banner_schema);
const create_buyers_model = mongoose.model('buyers', create_buyers_schema);
const create_buyeraddress_model = mongoose.model('buyeraddress', create_buyeraddress_schema);
const create_cart_model = mongoose.model('carts', create_cart_schema);
const create_order_model = mongoose.model('orders', create_order_schema);
const create_orderlog_model = mongoose.model('orderslogs', create_orderlog_schema);
const create_bill_model = mongoose.model('bills', create_bill_schema);
const create_company_model = mongoose.model('company', create_company_schema);





module.exports = {
  admin: create_admin_login_model,
  user:create_user_login_model,
  mastersettings: create_master_settings_model,
  products: create_product_model,
  menus: create_menus_model,
  banners: create_banner_model,
  buyers: create_buyers_model,
  buyeraddress:create_buyeraddress_model,
  cart:create_cart_model,
  order:create_order_model,
  orderlog:create_orderlog_model,
  bill:create_bill_model,
  company:create_company_model,
};