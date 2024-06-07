const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { products } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require('../../utils/validateId');
const { authAdmin } = require('../../middlewares/authMiddlewares');
const upload = require('../../utils/upload');
const crud = new crud_service();

//create
router.post('/', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
  const image_file = [];
  if(req?.files) {
    for(let i=0;i<req.files.length;i++) {
      image_file.push({
        image_path:req.files[i].path,
      });
    }
  }
  req.body.image = image_file;
  req.body.done_by = req?.admin?._id;
  const check_name = await crud.getOneDocument(products,{product_name:req?.body?.name},{},{});
  const check_sku = await crud.getOneDocument(products,{product_name:req?.body?.sku},{},{});
  if(check_name) throw new Error('Product Name Already Exsist');
  if(check_sku) throw new Error('SKU Already Exsist');
  try {
    success(res, 201, true, "Create Successfully", await crud.insertOne(products, req.body));
  } catch (err) {
    throw new Error(err);
  }
}))
//update
  .put('/:id', authAdmin, upload.array('image'),authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(products,id,{},{});
    const image_file = check?.image.filter((e)=>e.image_path);
    if(req?.files) {
    for(let i=0;i<req.files.length;i++) {
      image_file.push({
        image_path:req.files[i].path,
      });
    }
    }
    req.body.image = image_file;
    if (!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, 'Update Successfully', await crud.updateById(products, id, req.body, { new: true }));
    } catch (err) {
      throw new Error(err);
    } 
}))
//delete image
.put('/delete/:id',authAdmin,asyncHandler(async (req,res)=>{
  const { id } = req.params;
  validateId(id);
  try {
    success(res,200,true,"Deleted Successfully",await crud.updateOne(products,{_id:id},{$pull:{image:{_id:req?.body.id}}},{}));
  } catch(err) {
    throw new Error(err);
  }
}))
//delete
  .delete('/:id', authAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(products, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Delete Successfully", await crud.deleteById(products, id));
    } catch (err) {
      throw new Error(err);
    } 
}))
//getone
.get('/:id', authAdmin, asyncHandler(async (req, res) => {
    let options = {};
    options.populate = 'brand_id category_id specification.specification_id';
    const { id } = req.params;
    validateId(id);
    const check = await crud.getOneDocumentById(products, id, {}, {});
    if(!check) throw new Error('Data not Found!')
    try {
      success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(products, id,{},options));
    } catch (err) {
      throw new Error(err);
    } 
}))
.get('/single/:id', authAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateId(id);
  const check = await crud.getOneDocumentById(products, id, {}, {});
  if(!check) throw new Error('Data not Found!')
  try {
    success(res, 200, true, "Get Successfully", await crud.getOneDocumentById(products, id,{},{}));
  } catch (err) {
    throw new Error(err);
  } 
}))
//getall
.get('/', authAdmin, asyncHandler(async (req, res) => {
    let options = {};
    options.populate = 'brand_id category_id specification.specification_id';
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(products, {...req.query},{},options));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;