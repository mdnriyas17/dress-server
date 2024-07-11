const express = require('express');
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { buyers } = require('../../utils/schemaMaster');
const { generateToken } = require("../../config/jwtToken");
const { success, successToken } = require("../../utils/response");
const {authBuyer} = require('../../middlewares/authMiddlewares');
const crud_service = require('../../utils/crud_service');
const upload = require('../../utils/upload');
const crud = new crud_service();
//create buyers
router.post('/register', asyncHandler(async (req, res) => {
  const check_phone = await crud.getOneDocument(buyers,{ phone_number: req?.body?.phone_number },{},{});
  const check_email = await crud.getOneDocument(buyers,{ email_id: req?.body?.email_id },{},{});
  if (check_phone) throw new Error('Phone Number Already Taken!');
  if (check_email) throw new Error("Email Address Already Taken!");
  req.body.is_blocked = false;
  req.body.status = true;
  try {
    const create = await crud.insertOne(buyers, req.body);
    let token = generateToken(create?._id);
    if (create) {
      res.cookie("jwt", token, {
        // httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: true,
        path: "/",
        partitioned: true,
      });
      const result  = {
        user_id: create?._id,
      };
      success(res, 200, true, "Register Successfully", result);
    } else {
      throw new Error("Register Failed!");
    }
  } catch (error) {
    throw new Error(error);
  }
}))
//buyers login
.post('/login', asyncHandler(async (req, res) => {
  const { phone_number, password } = req.body;
  try {
    const find_buyers = await crud.getOneDocument(buyers, { phone_number },{},{});
    if(!find_buyers) throw new Error("Invalid User")
    if(find_buyers?.is_blocked == true) throw new Error("Your Account is Blocked!")
    const result_data = {...find_buyers?._doc};
    let exclude_file = ["password", "is_blocked", "created_at", "status","createdAt","updatedAt"];
    exclude_file.forEach((el)=> delete result_data[el])
    if (find_buyers && await find_buyers?.password==password) {
      const tokens = generateToken(find_buyers?._id);
      if (find_buyers) {
        res.cookie("jwt", tokens, {
          maxAge: 24 * 60 * 60 * 1000,
          // httpOnly: true,
          sameSite: "strict",
          secure: true,
          path: "/",
          partitioned: true,
        });
        const result  = {
          user_id: find_buyers?._id,
        };
        success(res, 200, true, "Login Successfully", result);
      }  else {
        res.cookie("jwt", tokens, {
          maxAge:  1000,
          httpOnly: true,
          sameSite: "strict", 
          secure: true,
          path: "/",
          partitioned: true,  
        })
    } 
    } else {
      throw new Error("Invalid User");
    }
  } catch (error) {
    throw new Error(error);
  }
}))
//logout
.get('/logout',authBuyer, asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      partitioned: true,
    });
    success(res, 200, true, "Logout Successfully");
  } catch (error) {
    throw new Error(error);
  }
}))
//update buyers
.put('/updateprofile',authBuyer,upload.array('image'),authBuyer,asyncHandler(async (req,res) => {
  const check = await crud.getOneDocumentById(buyers,req.body.buyer_id,{},{});
  if (req?.files) req.body.image = req.files[0]?.path?req.files[0]?.path:check?.image;
  if (!check) throw new Error('Data not Found!')
  req.body.phone_number = check?.phone_number;
  req.body.email_id = check?.email_id;
  try {
    success(res, 200, true, 'Update Successfully', await crud.updateById(buyers, req.body.buyer_id, req.body, { new: true }));
  } catch(err) {
    throw new Error(err);
  }
}))
//update buyers
.get('/myprofile',authBuyer,asyncHandler(async (req,res) => {
  const check = await crud.getOneDocumentById(buyers,req.body.buyer_id,{},{});
  if (req?.files) req.body.image = req.files[0]?.path?req.files[0]?.path:check?.image;
  if (!check) throw new Error('Data not Found!')
  req.body.phone_number = check?.phone_number;
  req.body.email_id = check?.email_id;
  try {
    success(res, 200, true, 'Update Successfully', await crud.getOneDocumentById(buyers, req.body.buyer_id, {}, {}));
  } catch(err) {
    throw new Error(err);
  }
}))





module.exports = router;