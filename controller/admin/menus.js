const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { menus } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require('../../utils/validateId');
const { authAdmin } = require('../../middlewares/authMiddlewares');
const crud = new crud_service();

//create
router.post('/', authAdmin, asyncHandler(async (req, res) => {
  req.body.done_by = req?.admin?._id;
  const check = await crud.getOneDocument(menus,{name:req?.body?.name,company_code:req?.body?.company_code},{},{});
  if(check) throw new Error('Already Exsist');
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(menus, req.body));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id',authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(menus,id,{},{});
    if (!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(menus, id, req.body, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//delete
  .delete('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(menus, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(menus, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getone
.get('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(menus, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(menus, id,{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getall
.get('/', authAdmin, asyncHandler(async (req, res) => {
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(menus, {...req.query},{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;