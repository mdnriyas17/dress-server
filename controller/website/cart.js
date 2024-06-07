const express = require("express");
const router = express.Router();
const { cart, products } = require('../../utils/schemaMaster');
const asyncHandler = require("express-async-handler");
const { success } = require("../../utils/response");
const validateId = require("../../utils/validateId");
const mongoose = require("mongoose");
const { helperCart } = require("../../utils/helperCart");
const { authBuyer } = require('../../middlewares/authMiddlewares');
const crud_service = require("../../utils/crud_service");
const crud = new crud_service();
//create
router.post('/', authBuyer, asyncHandler(async (req, res) => {
  try {
    const add_verify = await products.findOne({
      _id: new mongoose.Types.ObjectId(req?.body?.product_id),
    });
    if (add_verify) {
      const alreadyExist = await crud.getOneDocument(cart,{product_id:req?.body?.product_id,buyer_id:req.body.buyer_id},{},{});
      if (alreadyExist) {
        throw "Product Already in Cart!";
      } else {
        success(res, 201, true, "Created Successfully", await crud.insertOne(cart,req.body));
      }
    } else {
      throw "Product Does Not Exsist!";
    }
  } catch (error) {
    throw new Error(error);
  }
}))
//update
.put('/:id', authBuyer, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(cart,id,{},{});
  if (!check) throw new Error('Data not Found!');
  try {
    if(req.body.type=="plus") {
      await crud.updateOne(cart,{_id:id},{qty:check?.qty+1},{});
      success(res, 200, true, "Update Successfully", await crud.getOneDocumentById(cart,check?._id,{},{}));
    } else if(req.body.type=="minus") {
      await crud.updateOne(cart,{_id:id},{qty:check?.qty-1},{});
      success(res, 200, true, "Update Successfully", await crud.getOneDocumentById(cart,check?._id,{},{}));
    } else {
      throw new Error('Invalid Cart Type!');
    }
  } catch (error) {
    throw new Error(error);
  }
}))
//delete
.delete('/:id', authBuyer, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocument(cart,{ _id: id },{},{});
  if (!check) throw new Error("Data not found");
  try {
    success(res, 200, true, "Deleted Successfully",await crud.deleteById(cart,id));
  } catch (error) {
    throw new Error(error);
  }
}))

//getall
.get('/', authBuyer, asyncHandler(async (req, res) => {
    try {
      const result = await helperCart(req);
      if (result) success(res, 200, true, "Get data successfully", result);
      else success(res, 200, true, "Data Not Found", []);
    } catch (err) {
      throw new Error(err);
    }
}))

module.exports = router;
