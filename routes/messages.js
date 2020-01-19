const Router = (module.exports = require("express").Router());
const Message = require("../models/message");
const AUTH = require("passport").authenticate("jwt", { session: false });

Router.route("/latest").get(AUTH, (req, res) => {

  Message.aggregate([
    { $match: { sender: req.user._id } },
    { $group: { _id: "$receiver", msgId: { $last: "$_id" } } }
  ]).exec((err, firstIds) => {
    Message.aggregate([
      { $match: { receiver: req.user._id } },
      { $group: { _id: "$sender", msgId: { $last: "$_id" } } }
    ]).exec((err, secondIds) => {
        // Message.find()
        Message.find({$or : [...firstIds,...secondIds].map(one =>{
            return {_id : one.msgId}
        })}).sort({_id : -1}).populate(["sender" , "receiver"]).exec((err,wow)=>{
                    var unique = {}
                    var latest = []
                    wow.forEach(one => {
                        if (one.sender.username == req.user.username){
                           if(!unique[one.receiver.username]){
                               unique[one.receiver.username] = true
                               latest.push(one)
                           }
                        }else{
                            if(!unique[one.sender.username]){
                                unique[one.sender.username] = true
                                latest.push(one)
 
                            }                        }   
                         
                    })
                    res.json(latest)
            })

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
