const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { company } = require('../../utils/schemaMaster');
const { success } = require("../../utils/response");
const crud_service = require('../../utils/crud_service');
const crud = new crud_service();
//get data
router
.get('/', asyncHandler(async (req,res)=>{
  let options = {};
  options.populate = 'country state district city';
  try {
    success(res,200,true,"Get Successfully",await crud.getOneDocument(company,{},{},options));
  } catch(err) {
    throw new Error(err);
  }
}))




module.exports = router;