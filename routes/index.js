var admin_baseurl = "/api/v1/admin/";
var website_baseurl = "/api/v1/website/";

module.exports = (app) => {
  //Admin Panel
  app.use(admin_baseurl, require("../controller/admin/admin_login"));
  app.use(
    admin_baseurl + "mastersettings",
    require("../controller/admin/master_settings")
  );
  app.use(admin_baseurl + "products", require("../controller/admin/products"));
  app.use(admin_baseurl + "menus", require("../controller/admin/menus"));
  app.use(admin_baseurl + "banner", require("../controller/admin/banners"));
  app.use(
    admin_baseurl + "orderprocess",
    require("../controller/admin/order_process")
  );
  app.use(admin_baseurl + "buyers", require("../controller/admin/buyers"));
  //Website
  app.use(website_baseurl, require("../controller/website/buyers"));
  app.use(
    website_baseurl + "products",
    require("../controller/website/products")
  );
  app.use(
    website_baseurl + "mastersettings",
    require("../controller/website/master_settings")
  );
  app.use(
    website_baseurl + "buyeraddress",
    require("../controller/website/buyer_address")
  );
  app.use(website_baseurl + "banner", require("../controller/website/banners"));
  app.use(website_baseurl + "cart", require("../controller/website/cart"));
  app.use(
    website_baseurl + "placeorder",
    require("../controller/website/place_order")
  );
  app.use(
    website_baseurl + "company",
    require("../controller/website/company")
  );
};
