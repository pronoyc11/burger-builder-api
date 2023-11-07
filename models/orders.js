const { Schema, model } = require("mongoose");

const orderSchema = Schema({
  userId: Schema.Types.ObjectId,
  ingredients: [{ type: { type: String }, amount: Number }],
  customer: {
    deliveryAdress: String,
    phone: String,
    paymentType: String,
  },
  price: Number,
  orderStatus: {
    type: String,
    enum: ["Cash on delivery", "Paid according to users"],
    default: "Cash on delivery",
  },
  payment: {
    type:String
  },
  orderTime: { type: Date, default: Date.now },
  transanction_id : {
    type:String,
    unique:true
},
sessionKey:String
});

module.exports.Order = model("Order", orderSchema);
