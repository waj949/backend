const mongoose = require("mongoose")

module.exports = mongoose.model("user" , mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    birthdate :Date,
    photo_url : String,
    email : {
        type : String,
        required : true
    },
    password : {type:String,required : true}
}))