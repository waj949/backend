const Router = module.exports = require("express").Router()
const userController = require("../controllers/userController.js")
const Request = require("../models/request.js");
const Message = require("../models/message.js");
const AUTH = require("passport").authenticate("jwt", {session : false})

Router.route("/")
      .get(userController.getUsers)
      .post(userController.signUp)

Router.route("/authenticate").post(userController.signIn)
Router.get("/:id").get((req,res)=>{

})
Router.route("/:id/sendrequest").get(AUTH , userController.sendFriendRequest)
Router.route("/:id/removerequest").get(AUTH , userController.removeFriendRequest)
Router.route("/:id/messages").get(AUTH , (req,res)=>{
    Message.find({ $or: [
        { sender: req.user._id, receiver: req.params.id },
        { sender: req.params.id, receiver: req.user._id }
      ]}, (err,messages)=>{
          if (err) res.json({success: false,err})
          else res.json(messages)
      })
})


      