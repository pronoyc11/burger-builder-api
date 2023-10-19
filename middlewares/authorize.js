const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
    const token = req.header("Authorization");
    if(!token) return res.status(401).send("Access denied.No token provided!");
    try{
        const decoded = jwt.verify(token.split(" ")[1],process.env.JSON_KEY);
        req.user = decoded ;
        next();
    }catch(err){
        return res.status(401).send("Invalid token");
    }

}