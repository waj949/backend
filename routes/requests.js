const Router = module.exports = require("express").Router()
const requestController = require("../controllers/requestController.js")
const Request = require("../models/request.js");
const Friendship = require("../models/friendship.js");
const AUTH = require("passport").authenticate("jwt", { session: false })

/**
 * @route /api/groups GET
 * @description returns all the requests
 * @access private
 */
Router.route("/")
    .get(AUTH, requestController.getRequests)

/**
 * @route /api/groups/:id/accept GET
 * @description accept a friend requese
 * @access private
 */
Router.route("/:id/accept").get(AUTH, requestController.acceptRequest)