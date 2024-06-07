const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { buyeraddress } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require('../../utils/validateId');
const { authBuyer } = require('../../middlewares/authMiddlewares');
const crud = new crud_service();

//create
router.post('/', authBuyer, asyncHandler(async (req, res) => {
  req.body.is_default_address = false;
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(buyeraddress, req.body));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id',authBuyer, asyncHandler(async (req, res) => {
    req.body.is_default_address = false;
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(buyeraddress,id,{},{});
    if (!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(buyeraddress, id, req.body, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//default
.put('/default/:id',authBuyer, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(buyeraddress,id,{},{});
  if (!check) throw new Error('Data not Found!')
  const setFalse = await crud.updateMany(buyeraddress,{buyer_id:req?.body?.buyer_id},{$set:{is_default_address:false}},{upserted:true});
  if(!setFalse) throw new Error('Please try again later!');
  try {
    success(res, 200, true, 'Update Successfully', await crud.updateOne(buyeraddress, {_id:id},{$set:{is_default_address:true}}, { new: true }));
  } catch (err) {
    throw new Error(err);
  } 
}))
//delete
  .delete('/:id', authBuyer, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(buyeraddress, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(buyeraddress, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getone
.get('/:id', authBuyer, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(buyeraddress, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(buyeraddress, id,{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getall
.get('/', authBuyer, asyncHandler(async (req, res) => {
  console.log("req.query",req.query)
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(buyeraddress, {...req.query},{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;