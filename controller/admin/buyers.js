const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { buyers } = require('../../utils/schemaMaster');
const { success } = require("../../utils/response");
const {authAdmin} = require('../../middlewares/authMiddlewares');
const upload = require('../../utils/upload');
const crud_service = require('../../utils/crud_service');
const crud = new crud_service();
const validateId = require('../../utils/validateId');
//create buyers
router
router.post('/', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
  if(req?.files) req.body.image = req.files[0]?.path;
  const check_phone = await crud.getOneDocument(buyers,{phone_number:req?.body?.phone_number},{},{});
  const check_email = await crud.getOneDocument(buyers,{email_id:req?.body?.email_id},{},{});
  if(check_phone) throw new Error('Phone Number Already Taken!');
  if(check_email) throw new Error('Email Address Already Taken!');
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(buyers, req.body));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(buyers,id,{},{});
    req.body.phone_number = check?.phone_number;
    if(req?.files) req.body.image = req.files[0]?.path?req.files[0]?.path:check?.image;
    req.body.email_id = check?.email_id;
    if(req?.body?.status == "false") req.body.is_blocked = true;
    if(req?.body?.status == "true") req.body.is_blocked = false;
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(buyers, id, req.body, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//delete
  .delete('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(buyers, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(buyers, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//get single buyers
.get('/:id',authAdmin,asyncHandler(async (req,res)=>{
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(buyers,id,{},{});
  if (!check) throw new Error('Data not Found!')
  try {
    success(res,200,true,"Get Successfully",await crud.getOneDocument(buyers,{_id:id},{},{}));
  } catch(err) {
    throw new Error(err);
  }
}))
//get buyers
.get('/',authAdmin,asyncHandler(async (req,res)=>{
  try {
    success(res,200,true,"Get Successfully",await crud.getDocument(buyers,{},{},{}));
  } catch(err) {
    throw new Error(err);
  }
}))


module.exports = router;