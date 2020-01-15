const Router = module.exports = require("express").Router()
const Friendship = require("../models/friendship.js");
const friendController = require("../controllers/friendshipController.js")
const AUTH = require("passport").authenticate("jwt", {session : false})

Router.route("/")
      .get(AUTH, friendController.getFriends)