const Router = module.exports = require("express").Router()
const Friendship = require("../models/friendship.js");
const friendController = require("../controllers/friendshipController.js")
const AUTH = require("passport").authenticate("jwt", { session: false })


/**
 * @route /api/friends GET
 * @description fetch all the friend of a specific user
 * @access private
 */
Router.route("")
    .get(AUTH, friendController.getFriends);