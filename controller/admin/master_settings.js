const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { mastersettings } = require("../../utils/schemaMaster");
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
  let form_data = { ...req.body };
  let exclude_fields = ['parent_id', 'brand_id', 'country', 'state'];
  exclude_fields.forEach((el) => delete form_data[el]);
  if(req.body.parent_id!="undefined") form_data.parent_id = req.body.parent_id;
  if(req.body.brand_id!="undefined") form_data.brand_id = req.body.brand_id;
  if(req.body.country!="undefined") form_data.country = req.body.country;
  if(req.body.state!="undefined") form_data.state = req.body.state;
  const check = await crud.getOneDocument(mastersettings,{name:req?.body?.name,mode:req?.body?.mode},{},{});
  if(check?.name.toLowerCase()===req?.body?.name.toLowerCase() && check?.mode.toLowerCase()===req?.body?.mode.toLowerCase()) throw new Error('Already Exsist');
  if(check) throw new Error('Already Exsist');
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(mastersettings, form_data));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(mastersettings,id,{},{});
    if (req?.files) req.body.image = req.files[0]?.path?req.files[0]?.path:check?.image;
    if (!check) throw new Error('Data not Found!')
    let form_data = { ...req.body };
    let exclude_fields = ['parent_id', 'brand_id', 'country', 'state'];
    exclude_fields.forEach((el) => delete form_data[el]);
    if(req.body.parent_id!="undefined") form_data.parent_id = req.body.parent_id;
    if(req.body.brand_id!="undefined") form_data.brand_id = req.body.brand_id;
    if(req.body.country!="undefined") form_data.country = req.body.country;
    if(req.body.state!="undefined") form_data.state = req.body.state;
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(mastersettings, id, form_data, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//delete
  .delete('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(mastersettings, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(mastersettings, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getone
.get('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(mastersettings, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    let options = {};
    options.populate = 'parent_id brand_id country state';
    try {
      success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(mastersettings, id,{},options));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getall
.get('/', authAdmin, asyncHandler(async (req, res) => {
    let options = {};
    options.populate = 'parent_id brand_id country state';
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(mastersettings, {...req.query},{},options));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;