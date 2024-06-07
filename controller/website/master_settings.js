const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { mastersettings } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require('../../utils/validateId');
const crud = new crud_service();

router
//getone
.get('/:id', asyncHandler(async (req, res) => {
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
.get('/', asyncHandler(async (req, res) => {
    let options = {};
    options.populate = 'parent_id brand_id country state';
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(mastersettings, {...req.query},{},options));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;