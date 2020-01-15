const Router = module.exports = require("express").Router()
const Friendship = require("../models/friendship.js");
const AUTH = require("passport").authenticate("jwt", {session : false})

Router.route("/")
      .get(AUTH, (req,res)=>{
        Friendship.find({$or : [{first : req.user._id} , {second : req.user._id}]})
                  .populate(["first", "second"])
                  .exec((err,found)=>{
            if (err) return res.json({success : false, err})
            res.json(found.map(one =>{
                return one.first._id == req.user._id? one.second : one.first
            }))
        })
      })