//const { default: Payment } = require("../../my-burger/src/component/burgerBuilder/orders/checkout/Payment");

const path = require("path");
const { Order } = require("../models/orders");
const { Payment } = require("../models/payment");

const PaymentSession = require("ssl-commerz-node").PaymentSession;


module.exports.ipn = async (req,res) =>{
  const payment = new Payment(req.body);

  //validation starts
  //let val_id = payment["val_id"] ;         //"2311011857491SQ84DQcpjmxoXg";
 let tran_id = payment["tran_id"];
//let response = await axios.get(`https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=abc653cf3571418c&store_passwd=abc653cf3571418c@ssl`)
      
//let sslStatus = response.data["status"]; 
//validation ends
  if (payment["status"] === "VALID") {
     await Order.findOneAndUpdate(
      { transanction_id: tran_id },
      { payment: "Successfull" }
      
    
    );
  }else {
    await Order.deleteOne({ transanction_id: tran_id });
  }
  await payment.save();
  return res.status(200).send("IPN");
}


module.exports.initPayment = async (req, res) => {
  const userId = req.user._id;

  const tran_id =
    "_" + Math.random().toString(36).substring(2, 9) + new Date().getTime();
console.log(process.env.STORE_ID);
  const payment = new PaymentSession(
    true,
    process.env.STORE_ID,
    process.env.STORE_PASSWORD
  );

  // Set the urls
  payment.setUrls({
    success: "https://burgerbuilderbackend-api.onrender.com/payment/success", // If payment Succeed
    fail: "https://burgerbuilderbackend-api.onrender.com/payment/failed", // If payment failed
    cancel: "https://burgerbuilderbackend-api.onrender.com/payment/cancled", // If user cancel payment
    ipn: "https://burgerbuilderbackend-api.onrender.com/payment/ipn", // SSLCommerz will send http post request in this link
  });

  // Set order details
  payment.setOrderInfo({
    total_amount: 1570, // Number field
    currency: "BDT", // Must be three character string
    tran_id: tran_id, // Unique Transaction id
    emi_option: 0, // 1 or 0
  });

  // Set customer info
  payment.setCusInfo({
    name: userId,
    email: req.user.email,
    add1: "66/A Midtown",
    add2: "Andarkilla",
    city: "Chittagong",
    state: "Optional",
    postcode: 4000,
    country: "Bangladesh",
    phone: "010000000000",
    fax: "Customer_fax_id",
  });

  // Set shipping info
  payment.setShippingInfo({
    method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
    num_item: 2,
    name: "Simanta Paul",
    add1: "66/A Midtown",
    add2: "Andarkilla",
    city: "Chittagong",
    state: "Optional",
    postcode: 4000,
    country: "Bangladesh",
  });

  // Set Product Profile
  payment.setProductInfo({
    product_name: "Computer",
    product_category: "Electronics",
    product_profile: "general",
  });
  const response = await payment.paymentInit();
  response.tran_id = tran_id
  return res.status(200).send(response);
};

module.exports.paymentSuccess = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/success.html"));
};
module.exports.paymentFailed = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/failed.html"));
};
module.exports.paymentCancled = async (req, res) => {
  res.sendFile(path.join(__basedir + "/public/cancled.html"));
};
