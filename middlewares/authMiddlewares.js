const {admin,buyers} = require('../utils/schemaMaster');
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authAdmin = asyncHandler(async (req, res, next)=>{
  let token;
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin_check = await admin.findById(decoded?.id);
        req.admin = admin_check;
        // req.body.company_code = admin_check?.company_code;
        // req.query.company_code = admin_check?.company_code;
        req.body.admin_id = admin_check?._id;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

const authBuyer = asyncHandler(async (req, res, next)=>{
  let token;
  let company;
  console.log("req.headers",req.headers.cookie.split("jwt=")[1])
  if (req.headers.cookie) {
    token = req.headers.cookie.split("jwt=")[1]
    // company = req?.headers?.company_code;
    // console.log("company",company)
    // const check_company = await admin.findOne({company_code:company});
    // if(!check_company) throw new Error('Invalid Company Code');
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const buyers_check = await buyers.findById(decoded?.id);
        // console.log(buyers_check)
        req.buyers = buyers_check;
        // req.body.company_code = buyers_check?.company_code||company;
        req.body.buyer_id = buyers_check?._id;
        req.query.buyer_id = buyers_check?._id;
        // req.query.company_code = buyers_check?.company_code||company;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login again");
    }
  } else {
    throw new Error("There is no token attached to header");
  }
});

module.exports = { authAdmin, authBuyer };