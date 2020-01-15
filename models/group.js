const mongoose = require("mongoose")

module.exports = mongoose.model("group" , mongoose.Schema({
    name : String,
    admin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    users : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }]
}))