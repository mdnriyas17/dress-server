const express = require("express");
const router = express.Router();
const { cart, buyers, order, buyeraddress, orderlog } = require('../../utils/schemaMaster');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const { helperCart } = require("../../utils/helperCart");
const { authBuyer } = require('../../middlewares/authMiddlewares');
const crud_service = require('../../utils/crud_service');
const crud = new crud_service();
const validateId = require('../../utils/validateId');
router
//create
.post('/', authBuyer, asyncHandler(async (req,res)=>{
  try {
    let cart_list = await helperCart(req);
    let get_buyer = await crud.getOneDocumentById(buyers,req.body.buyer_id,{},{});
    let get_buyer_address = await crud.getOneDocument(buyeraddress,{buyer_id:req.body.buyer_id,is_default_address:true},{},{});
    let product = [];
    if (cart_list?.cart_item?.length == 0) {
      throw new Error("No item(s) in cart");
    } 
    if (!get_buyer) {
      throw new Error("Please login and try again!");
    }
    if(!get_buyer_address) {
      throw new Error('Please choose delivery address');
    }
    for (let e of cart_list?.cart_item) {
      product.push({
        product: e?.product_id?._id,
        product_name: e?.product_id?.product_name,
        product_image:e?.product_id?.image,
        sku:e?.product_id?.sku,
        mrp: e?.product_id?.mrp,
        sp: e?.product_id?.sp,
        qty: e?.qty,
        total: e?.amount,
      });
    };
    const delivery_address = {
      firstname: get_buyer_address?.firstname,
      lastname: get_buyer_address?.lastname,
      city: get_buyer_address?.city,
      state: get_buyer_address?.state,
      landmark: get_buyer_address?.landmark,
      address_line1: get_buyer_address?.address_line1,
      address_line2: get_buyer_address?.address_line2,
      pincode: get_buyer_address?.pincode,
      buyer_number: get_buyer_address?.buyer_number,
      buyer_email: get_buyer_address?.buyer_email,
      alternate_no: get_buyer_address?.alternate_no
    };
    const total_amount_pay = Math.round(product.reduce((c, e) => (c += e.total), 0));
    const create_payment_info = {
      buyer_id: get_buyer?._id,
      item: product,
      amount: Number(total_amount_pay),
      name: get_buyer?.name,
      delivery_address:delivery_address,
      phone_number: get_buyer?.phone_number,
      email_id: get_buyer?.email_id,
    };
    await placeorder(create_payment_info,res);
  } catch(err) {
    throw new Error(err);
  }
}))
.get('/:id', authBuyer, asyncHandler(async (req,res) => {
  const { id } = req.params;
  validateId(id);
  let options = {};
  options.populate = 'buyers products.product'
  try {
    const result = await crud.getOneDocument(order,{_id:id},{},options);
    let obj = [];
    obj.push({
      order:result,
      orderstatus:await crud.getDocument(orderlog,{order_id:result?._id},{},{}),
    })
    success(res,200,true,"Get Successfully",obj);
  } catch(err) {
    throw new Error(err);
  }
}))
.get('/', authBuyer, asyncHandler(async (req,res) => {
  let options = {};
  options.populate = 'buyers products.product'
  try {
    const result = await crud.getDocument(order,{buyers:String(req.body.buyer_id)},{},options);
    let obj = [];
    for(i=0; i<result.length; i++) {
      obj.push({
        order:result[i],
        orderstatus:await crud.getDocument(orderlog,{order_id:result[i]?._id},{},{}),
      })
    }
    success(res,200,true,"Get Successfully",obj);
  } catch(err) {
    throw new Error(err);
  }
}))

const placeorder = async (data,res) => {
  try {
    let date = new Date();
  for (let e of data?.item) {
    let ord_info = await getOrderNo(date);
    let product = [
      {
        product: e?.product,
        product_name: e?.product_name,
        product_image: e?.product_image,
        sku:e?.sku,
        mrp: e?.mrp,
        sp: e?.sp,
        qty: e?.qty,
        total: e?.total,
      },
    ];
    let create_order = await order.create({
      buyers: data.buyer_id,
      order_no: ord_info.order_no,
      financial_year: ord_info.financial_year,
      date: date,
      delivery_address: data?.delivery_address,
      products: product,
      total: e.total,
      no_of_items: 1,
    });
    await orderlog.create({
      order_id:create_order?._id,
      order_status:create_order?.status
    });
  }
  await cart.deleteMany({buyer_id:String(data?.buyer_id)});
  success(res,200,true,"Order Placed Successfully");
  } catch(err) {
    throw new Error(err);
  }
}

const getOrderNo = async (date) => {
  try {
    let order_no = 1;
    let financial_year = financialYear(date);
    let check = await order
      .findOne({
        financial_year: financial_year,
      })
      .sort({ order_no: -1 });
    if (check) order_no += check.order_no;
    return {
      order_no: order_no,
      financial_year: financial_year,
    };
  } catch (error) {
    throw error;
  }
};

const financialYear = (date) => {
  let fy;
  let d = new Date(date);
  let year = d.getFullYear().toString();
  let month = d.getMonth();
  let ys = Number(year.substring(2, 4));
  if (month > 2) fy = ys + "-" + (ys + 1);
  else fy = ys - 1 + "-" + ys;
  return fy;
};

module.exports = router;