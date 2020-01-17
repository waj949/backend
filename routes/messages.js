const Router = (module.exports = require("express").Router());
const Message = require("../models/message");
const AUTH = require("passport").authenticate("jwt", { session: false });

Router.route("/latest").get(AUTH, (req, res) => {

  Message.aggregate([
    { $match: { sender: req.user._id } },
    { $group: { _id: "$receiver", msgId: { $first: "$_id" } } }
  ]).exec((err, firstIds) => {
    Message.aggregate([
      { $match: { receiver: req.user._id } },
      { $group: { _id: "$sender", msgId: { $first: "$_id" } } }
    ]).exec((err, secondIds) => {
        // Message.find()
        Message.find({$or : [...firstIds,...secondIds].map(one =>{
            return {_id : one.msgId}
        })}).populate(["sender" , "receiver"]).exec((err,wow)=> res.json(wow))

    });
  });
  // Message.find({sender : req.user._id}).distinct("receiver").exec((err,partOne)=>{
  //     Message.find({receiver : req.user._id}).distinct("sender").exec((err,partTwo)=>{
  //         Message.find({_id: {$in : [...partOne , ...partTwo]}}).exec((err,found)=>{
  //             res.json(found)
  //         })
  //     })

  // })
});
