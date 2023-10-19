const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const userSchema = Schema({
    email:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255,
        unique:true
    },
    password:{
        type:String,
        minlength:5,
        maxlength:1024,
        required:true
    }
})

userSchema.methods.generateJWT = function (){
    const token = jwt.sign({_id:this.id,email:this.email},process.env.JSON_KEY,{expiresIn:"3h"});
    return token ;
}

const validateUser = (user)=>{

    const schema = joi.object({
        email:joi.string().required().min(5).max(255).email(),
        password:joi.string().min(5).max(255).required()
    })
   return schema.validate(user);
}

const User = model("User",userSchema);

module.exports.User = User ;

module.exports.validateUser = validateUser;