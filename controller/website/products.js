const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { products } = require("../../utils/schemaMaster");
const { success } = require("../../utils/response");
const crud_service = require("../../utils/crud_service");
const validateId = require("../../utils/validateId");

const crud = new crud_service();

router
  //getone
  .get(
    "/:id",
    asyncHandler(async (req, res) => {
      let options = {};
      options.populate = "brand_id category_id specification.specification_id";
      const { id } = req.params;
      validateId(id);
      const check = await crud.getOneDocumentById(products, id, {}, {});
      if (!check) throw new Error("Data not Found!");
      try {
        success(
          res,
          200,
          true,
          "Get Successfully",
          await crud.getOneDocumentById(products, id, {}, options)
        );
      } catch (err) {
        throw new Error(err);
      }
    })
  )
  //getall
  .get(
    "/",
    asyncHandler(async (req, res) => {
      // console.log("qqqqqqqqqqqqqqqqq", req.query);
      // Filtering
      const queryObj = { ...req.query };
      const excludeFields = [
        "page",
        "sort",
        "limit",
        "fields",
        "q",
        "category",
        "categoryname",
        "min",
        "max",
      ];
      excludeFields.forEach((el) => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      // if(req?.query?.mrp[gte]&&req?.query?.mrp[lte]) {
      //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // }

      let query = products
        .find(JSON.parse(queryStr))
        .populate("brand_id category_id");

      // Sorting
      if (req.query.sort && req.query.sort != "") {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }
      // limiting the fields
      if (req.query.fields && req.query.fields != "") {
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields);
      } else {
        query = query.select("-__v");
      }
      if (req.query.categoryname && req.query.categoryname != "") {
        query = query.find({
          category_id: {
            $in: req.query.categoryname,
          },
        });
        query = query;
      }
      // pagination
      if (
        req.query.page &&
        req.query.page != "" &&
        req.query.limit &&
        req.query.limit != ""
      ) {
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
          const productCount = await products.countDocuments();
          if (skip >= productCount)
            throw new Error("This Page does not exists");
        }
      }
      if (req?.query?.min && req?.query?.min != "") {
        query = query.find({
          mrp: {
            $gte: req?.query?.min,
          },
        });
        query = query;
      }
      if (req?.query?.max && req?.query?.max != "") {
        query = query.find({
          mrp: {
            $lte: req?.query?.max,
          },
        });
        query = query;
      }

      var product = await query;
      // console.log("req.query.q", req.query);
      if (req.query.q && req.query.q != "") {
        function filterData(searchQuery) {
          const query = searchQuery
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
          const filteredData = product.filter((item) => {
            return item?.product_name
              .toLowerCase()
              .replace(/ /g, "-")
              .replace(/[^\w-]+/g, "")
              .includes(query);
          });
          return filteredData;
        }
        product = filterData(req.query.q.toLowerCase());
      }
      if (req.query.category && req.query.category != "") {
        function filterById(data) {
          for (i = 0; i < data.length; i++) {
            if (
              data[i]?.name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "") ==
                req.query.category
                  .toLowerCase()
                  .replace(/ /g, "-")
                  .replace(/[^\w-]+/g, "") ||
              data[i]?.name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "")
                .includes(
                  req.query.category
                    .toLowerCase()
                    .replace(/ /g, "-")
                    .replace(/[^\w-]+/g, "")
                )
            ) {
              return true;
            }
          }
        }
        const cat_filter = product.filter((e) => {
          return filterById(e.category_id);
        });
        product = cat_filter;
      }

      if (product) success(res, 200, true, "Get data successfully", product);
    })
  );

module.exports = router;
