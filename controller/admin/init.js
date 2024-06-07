const { admin,menus,company } = require('../../utils/schemaMaster');
const {menu,admin_init} = require('../../utils/init');
const asyncHandler = require("express-async-handler");
//admin login
const initAdmin = asyncHandler(async ()=>{
  if(await admin.countDocuments()<1) {
    const create_admin = await admin.create(admin_init);
    await company.create({admin_id:create_admin?._id});
  };
  if(await menus.countDocuments()<1) {
    await menus.insertMany(menu);
  }
});

module.exports = {
  initAdmin
};