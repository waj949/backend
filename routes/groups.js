const Router = (module.exports = require("express").Router());
const AUTH = require("passport").authenticate("jwt", { session: false });
const groupControllers = require("../controllers/groupsController");

Router.route("/")
  .get(AUTH, groupControllers.getGroups)
  .post(AUTH, groupControllers.createGroup);

Router.route("/:id/add").post(AUTH, groupControllers.addMember);
Router.route("/:id/leave").get(AUTH, groupControllers.leaveGroup);
