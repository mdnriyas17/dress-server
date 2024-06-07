const express = require("express");
const router = express.Router();
const { order, orderlog } = require('../../utils/schemaMaster');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const { authAdmin } = require('../../middlewares/authMiddlewares');
const crud_service = require('../../utils/crud_service');
const crud = new crud_service();
const validateId = require('../../utils/validateId');
router
//Order Process
.put('/:id',authAdmin,asyncHandler(async (req,res)=>{
  const { id } = req.params;
  validateId(id);
  const { status } = req.body;
  checkStatus(status);
  try {
    const update = await crud.updateOne(order,{_id:id},{status:status},{});
    if(update) {
      const ress = await crud.getOneDocumentById(order,id,{},{});
      await crud.insertOne(orderlog,{
        order_id:ress?._id,
        order_status:ress?.status
      });
      success(res,200,true,"Update Successfully",ress);
    } else {
      throw new Error('Please try Again!')
    }
  } catch(err) {
    throw new Error(err);
  }
}))
.put('/', authAdmin, asyncHandler(async (req,res)=>{
  const id = req?.body?.id;
  if(id.length<1) throw new Error('Please select Order!');
  const { status } = req.body;
  checkStatus(status);
  try {
    for(i=0; i<id.length; i++) {
      const update = await crud.updateOne(order,{_id:id[i]},{status:status},{});
      if(update) {
      const ress = await crud.getOneDocumentById(order,id[i],{},{});
      await crud.insertOne(orderlog,{
        order_id:ress?._id,
        order_status:ress?.status
      });
    }
  }
    success(res,200,true,"Updated Successfully");
  } catch(err) {
    throw new Error(err);
  }
}))
.get('/:id', authAdmin, asyncHandler(async (req,res) => {
  let options = {};
  options.populate = 'buyers products.product'
  const { id } = req.params;
  validateId(id);
  try {
    const result = await crud.getDocument(order,{_id:id},{},options);
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
.get('/', authAdmin, asyncHandler(async (req,res) => {
  
  let options = {};
  let createdAt;
  let products;
  let total;
  let filter;
  options.populate = 'buyers products.product'
  const queryObj = { ...req.query };
  const excludeFields = ["company_code","startdate","enddate","min","max","products","user"];
  excludeFields.forEach((el) => delete queryObj[el]);
  if(req?.query?.startdate && req?.query?.enddate && req?.query?.startdate!="" && req?.query?.enddate!="") {
  createdAt =  {
    $gte: new Date(req?.query?.startdate).getDate() -1,
    $lte: new Date(req?.query?.enddate)
  };
  filter = {...queryObj,createdAt}
  } else {
    createdAt =  {}
    filter = {...queryObj}  
  } 
  if(req?.query?.min && req?.query?.max && req?.query?.min!="" && req?.query?.max!="") {
    total = {
      $gte: req?.query?.min,
      $lte: req?.query?.max
    }
    filter = {...filter,total}
  }
  if(req?.query?.products && req?.query?.products!='') {
    filter = {...filter,"products.product":req?.query?.products}
  }
  if(req?.query?.user && req?.query?.user!="") {
    filter = {...filter,buyers:req?.query?.user}
  }
  try {
    options.sort = '-createdAt';
    const result = await crud.getDocument(order,filter,{},options);
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



const checkStatus = (data) => {
  switch(data) {
    case "Pending":
      return "Pending"
    case "Packing":
      return "Packing"
    case "Billed":
      return "Billed"
    case "Dispatched":
      return "Dispatched"
    case "Delivered":
      return "Delivered"
    case "Cancel":
      return "Cancel"
    default :
      throw new Error("Invalid Order Status");  
  }
}





module.exports = router;