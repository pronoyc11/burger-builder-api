const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.MONGODB_SERVER.replace("<PASSWORD>",process.env.DB_PASSWORD)
global.__basedir = __dirname 
mongoose.connect(DB)
        .then(res=>console.log("connected to MONGODB."))
        .catch(err => console.log(err))

const port = process.env.PORT || 3001 ;

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

