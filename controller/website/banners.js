const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { banners } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const crud = new crud_service();

router
//getall
.get('/', asyncHandler(async (req, res) => {
    try {
      success(res, 200, true, "Get Successfully", await crud.getDocument(banners, {...req.query},{},{}));
    } catch (err) {
      throw new Error(err);
    } 
}));


module.exports = router;