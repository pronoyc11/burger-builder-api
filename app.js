const express = require("express");
const cors = require("cors");
const compression = require("compression");
const userRouter = require("./routers/userRouter");
const orderRouter = require("./routers/orderRouter");
const paymentRouter = require("./routers/paymentRouter");
const app = express();
const morgan = require("morgan");

//USING MIDDLEWARES STARTS
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(morgan("dev"));
//USING MIDDLEWARES ENDS

//ROUTES DEFINED START
app.use("/user",userRouter);
app.use("/order",orderRouter);
app.use("/payment",paymentRouter)
//ROUTES DEFINED START

module.exports = app ;