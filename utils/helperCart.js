const { cart } = require("../utils/schemaMaster");

const helperCart = async (req) => {
  const verifyCart = await cart.find(req.query);
  for (let c = 0; c < verifyCart?.length; c++) {
    if (verifyCart[c] == null) {
      await cart.deleteOne({ _id: verifyCart[c]?._id });
    }
  }
  let all = [];

  try {
    all = await cart
      .find(req.query)
      .populate({ path: "product_id buyer_id" })
      .exec();
    let data = [];
    for (let i = 0; i < all?.length; i++) {
      const cartObj = {};
      const qty = all[i]?.qty;
      const mrp = all[i]?.product_id ? all[i]?.product_id?.mrp : 0;
      // const sp = all[i]?.product_id ? all[i]?.product_id?.sp : 0;
      const priceCalculation = (qty, mrp) => {
        // const spres = sp != null && sp != "" && sp != 0 ? sp : mrp;
        // const price = spres ? spres : mrp;
        return Number(mrp * qty);
      };
      cartObj._id = all[i]?._id;
      cartObj.buyer = all[i]?.buyer_id;
      cartObj.product_id = all[i]?.product_id;
      cartObj.qty = qty;
      cartObj.mrp = mrp;
      // cartObj.sp = sp;
      cartObj.amount = priceCalculation(qty, mrp);
      data.push(cartObj);
    }
    let total_quantity = 0;
    let total_amount = 0;
    let obj = {};
    for (let j = 0; j < data.length; j++) {
      const qty = data[j]?.qty;
      const mrp = data[j]?.product_id ? data[j]?.product_id?.mrp : 0;
      // const sp = data[j]?.product_id ? data[j]?.product_id?.sp : 0;
      const priceCalculation = (qty, mrp) => {
        // const spres = sp != null && sp != "" && sp != 0 ? sp : mrp;
        // const price = spres ? spres : mrp;
        return Number(mrp * qty);
      };

      total_quantity += qty;
      total_amount += priceCalculation(qty, mrp);
    }
    obj.cart_item = data;
    obj.total_quantity = total_quantity;
    obj.total_amount = total_amount;
    return obj;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { helperCart };
