const mongoose = require("mongoose")

module.exports = mongoose.model("user" , mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    password : String
}))