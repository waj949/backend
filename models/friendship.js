const mongoose = require("mongoose")

module.exports = mongoose.model("friendship" , mongoose.Schema({
    first : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    second : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
}))