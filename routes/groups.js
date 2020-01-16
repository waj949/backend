const Router = (module.exports = require('express').Router())
const Group = require("../models/group");
const Friendship = require("../models/friendship.js");
const ObjectId = require("mongodb").ObjectID
const AUTH = require("passport").authenticate("jwt", { session: false });
Router.route('/').get(AUTH, (req, res) => {
    Group.find({ users :  {$in : req.user._id}}).then( data => res.json(data))
}).post(AUTH, (req, res) => {
    req.body.admin = req.user._id
    Group.create(req.body).then(data => {
        Group.findByIdAndUpdate(data._id, { $push: { users: ObjectId(req.user._id)}}).then(data => {
            
            res.json(data)
        });

    })
})
Router.route("/:id/add").post(AUTH, (req, res) => {
    const group = req.params.id
    const friend = req.user
    const newMember = req.body.user
    Friendship.exists({ $or : [{first: friend, second: newMember}, {first: newMember, second: friend}]}).then(data => {
   if(!data) return res.json({success: false, msg:"you're not friends"})
    Group.findByIdAndUpdate(group, {$push: {users: newMember}}).then(data => {
        res.json({success: true})
    })
    })
  
  
  })