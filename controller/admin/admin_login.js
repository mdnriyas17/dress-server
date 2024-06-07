const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { admin,company } = require('../../utils/schemaMaster');
const { generateToken } = require("../../config/jwtToken");
const { success, successToken } = require("../../utils/response");
const mongoose = require('mongoose');
const crud_service = require('../../utils/crud_service');
const { authAdmin } = require('../../middlewares/authMiddlewares');
const validateId = require('../../utils/validateId');
const crud = new crud_service();
const upload = require('../../utils/upload');
//create admin
router.post('/register', asyncHandler(async (req, res) => {
  const check_phone = await crud.getOneDocument(admin,{ phone_number: req?.body?.phone_number },{},{});
  const check_email = await crud.getOneDocument(admin,{ email_id: req?.body?.email_id },{},{});
  if (check_phone) throw new Error('Phone Number Already Taken!');
  if (check_email) throw new Error("Email Address Already Taken!");
  // const salt = bcrypt.genSaltSync(10);
  // if(req.body.password) req.body.password = await bcrypt.hash(req?.body?.password, salt);
  req.body.company_code = new mongoose.mongo.ObjectId();
  try {
    const create = await crud.insertOne(admin, req.body);
    if (create) {
      successToken(res, 201, true, "Register Successfully",create,generateToken(create?._id));
    } else {
      throw new Error("Register Failed!");
    }
  } catch (error) {
    throw new Error(error);
  }
}))
//admin login
.post('/login', asyncHandler(async (req, res) => {
  const { phone_number, password } = req.body;
  try {
    const find_admin = await crud.getOneDocument(admin, { phone_number },{},{});
    if(!find_admin) throw new Error("Invalid Username")
    if(find_admin?.is_blocked == true) throw new Error("Your Account is Blocked!")
    const result_data = {...find_admin?._doc};
    let exclude_file = ["password", "is_blocked", "created_at", "status","createdAt","updatedAt"];
    exclude_file.forEach((el)=> delete result_data[el])
    if (find_admin && await find_admin?.password==password) {
      successToken(res, 200, true, "Login Successfully",result_data,generateToken(find_admin?._id));
    } else {
      throw new Error("Invalid Password!")
    } 
  } catch (error) {
    throw new Error(error);
  }
}))
.put('/changepassword',authAdmin,asyncHandler(async (req,res)=>{
  const {password} = req.body;
  if(!password) throw new Error('Password is required!')
  try {
    success(res,200,true,"Update Successfully",await crud.updateOne(admin,{_id:req.body.admin_id},{password:password},{upsert: true}))
  } catch (err) {
    throw new Error(err);
  }
}))
.put('/company/:id', authAdmin, upload.array('logo'), authAdmin, asyncHandler(async (req,res)=> {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(company,id,{},{});
  if (req?.files) req.body.logo = req.files[0]?.path?req.files[0]?.path:check?.logo;
  if (!check) throw new Error('Data not Found!')
  try {
    await crud.updateOne(company,{_id:id},req.body,{})
    success(res,200,true,'Updated Successfully',await crud.getOneDocument(company,{_id:id},{},{}));
  } catch(err) {
    throw new Error(err);
  }
}))
.get('/company', authAdmin, asyncHandler(async (req,res)=>{
  let options = {};
  options.populate = 'country state district city';
  try {
    success(res,200,true,"Get Successfully",await crud.getOneDocument(company,{},{},options));
  } catch(err) {
    throw new Error(err);
  }
}))

.delete('/user/:id', authAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(admin, id, {}, {});
  if(!check) throw new Error('Data not Found!')
  try {
    success(res, 200, true, "Delete Successfully", await crud.deleteById(admin, id));
  } catch (err) {
    throw new Error(err);
  } 
}))

.get('/user', authAdmin, asyncHandler(async (req, res) => {
  try {
    success(res, 200, true, "Get Successfully", await crud.getDocument(admin, {type:"user"},{},{}));
  } catch (err) {
    throw new Error(err);
  } 
}))

.put('/user/:id', authAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(admin, id, {}, {});
  if(!check) throw new Error('Data not Found!')
  const check2 = await crud.getOneDocument(admin, {phone_number: req?.body?.phone_number}, {}, {});
  if(check2 && check2?._id != id) throw new Error('Phone Number Already Taken!')
  const check3 = await crud.getOneDocument(admin, {email_id: req?.body?.email_id}, {}, {});
  if(check3 && check3?._id != id) throw new Error('Email Address Already Taken!')
  try {
    if(req?.body?.status == false){
      req.body.is_blocked = true;
      success(res, 200, true, 'Update Successfully', await crud.updateById(admin, id, req.body, { new: true }));
    }
    if(req?.body?.status == true) {
      req.body.is_blocked = false;
      success(res, 200, true, 'Update Successfully', await crud.updateById(admin, id, req.body, { new: true }));
    }
  } catch (err) {
    throw new Error(err);
  } 
}))

.get('/user/:id', authAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(admin, id, {}, {});
  if(!check) throw new Error('Data not Found!')
  try {
    success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(admin, id,{},{}));
  } catch (err) {
    throw new Error(err);
  } 
}))


module.exports = router;