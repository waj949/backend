const Router = (module.exports = require("express").Router());
const AUTH = require("passport").authenticate("jwt", { session: false });
const groupControllers = require("../controllers/groupsController");

/**
 * @route /api/groups GET
 * @description return all the groups that a user is in
 * @access private
 *
 * @route /api/groups POST
 * @description create a group in the database
 * @access private
 */
Router.route("/")
  .get(AUTH, groupControllers.getGroups)
  .post(AUTH, groupControllers.createGroup);

/**
 * @route /api/groups/:id/add POST
 * @description add a memeber to a group
 * @access private
 */
Router.route("/:id/add").post(AUTH, groupControllers.addMember);

/**
 * @route /api/groups/:id/leave GET
 * @description removes a user from a group,if the admin is leaving removes the whole group
 * @access private
 */
Router.route("/:id/leave").get(AUTH, groupControllers.leaveGroup);
Router.route("/:id").get(AUTH, groupControllers.getGroup);
