const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { banners } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require('../../utils/validateId');
const { authAdmin } = require('../../middlewares/authMiddlewares');
const upload = require('../../utils/upload');
const crud = new crud_service();

//create
router.post('/', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
  if(req?.files) req.body.image = req.files[0]?.path;
  req.body.done_by = req?.admin?._id;
  const check = await crud.getOneDocument(banners,{name:req?.body?.name,company_code:req?.body?.company_code},{},{});
  if(check) throw new Error('Already Exsist');
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(banners, req.body));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id',authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(banners,id,{},{});
    if (req?.files) req.body.image = req.files[0]?.path?req.files[0]?.path:check?.image;
    if (!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(banners, id, req.body, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//delete
  .delete('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(banners, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(banners, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getone
.get('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(banners, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(banners, id,{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getall
.get('/', authAdmin, asyncHandler(async (req, res) => {
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(banners, {...req.query},{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;