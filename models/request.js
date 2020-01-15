const mongoose = require("mongoose")

module.exports = mongoose.model("request" , mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
}))