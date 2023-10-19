const express = require("express");
const { validateUser, User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

const newUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(400).send("Email already exist!!");

  user = new User(_.pick(req.body, ["email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    const result = await user.save();
    const token = user.generateJWT();
    return res.status(201).send({
      token: token,
      user: _.pick(result, ["_id", "email"]),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Something went wrong,could'nt register!");
  }
};

const authUser = async (req,res) =>{

    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(404).send("Id not found");

    
    const validUser = await bcrypt.compare(req.body.password,user.password);
    if(!validUser) return res.status(401).send("Invalid password!!");


    const token = user.generateJWT();

    res.send({
        token:token,
        user:_.pick(user,["_id","email"])
    })
    


}


router.route("/").post(newUser);

router.route("/auth").post(authUser);

module.exports = router;
