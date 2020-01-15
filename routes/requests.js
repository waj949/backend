const Router = module.exports = require("express").Router()
const requestController = require("../controllers/requestController.js")
const Request = require("../models/request.js");
const Friendship = require("../models/friendship.js");
const AUTH = require("passport").authenticate("jwt", {session : false})

Router.route("/")
      .get(AUTH, requestController.getRequests)

Router.route("/:id/accept").get(AUTH, requestController.acceptRequest)
      