const Group = require("../models/group");
const Friendship = require("../models/friendship");
const Messages = require("../models/message");

/**
 * @function addMember adds a freinds to a group by the admin of that group
 * @param {Object} req EXEPCTED to have the id of the group in the params of the req object, the admin of the group well be added by the middleware it self
 * // and the newfreind is expected to be in the body of the req object
 * @param {Object} res EXEPCTED to have the JSON object with the success attr set to true of no problem happend
 */
exports.addMember = (req, res) => {
  const group = req.params.id; // id of the group
  const friend = req.user;
  const newMember = req.body.user;
  Friendship.exists({
    $or: [
      { first: friend, second: newMember }, // if the user have the new user as a freind OR the newfreind have the user as a friand
      { first: newMember, second: friend }
    ]
  }).then(data => {
    if (!data) return res.json({ success: false, msg: "you're not friends" });
    Group.findByIdAndUpdate(group, { $push: { users: newMember } }).then(
      data => {
        res.json({ success: true });
      }
    );
  });
};

/**
 * @function getGroups return all the groups that this spcific user is enrolled in.
 * @param {Object} req EXPECTED to have the user in the req object (Added automatically by the middleware )
 * @param {Object} res EXPECTED to have all the groups that user is In
 */
exports.getGroups = (req, res) => {
  Group.find({ users: { $in: req.user._id } })
    .populate("users")
    .then(data => res.json(data));
};

/**
 * @function createGroup creates a group in the database and adds a admin to that group
 * @param {Object} req @EXPECTED to have the user in the req object (Added automatically by the middleware ), Also to have the info of the group in the req.body
 * @param {Object} res @EXPECTED to have the group that has been created in the res object
 */
exports.createGroup = (req, res) => {
  req.body.admin = req.user._id;
  Group.create(req.body).then(data => {
    Group.findByIdAndUpdate(data._id, {
      $push: { users: ObjectId(req.user._id) }
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => res.json(err));
  });
};

/**
 * @function leaveGroup finds the group first using the (user) admin id AND the group object id, IF the admin is the one who is going to leave than the group well be deleted
 * else off a normal user want to leave than he is the only ione who is going to leave
 * @param {Object} req @EXPECTED admin object (IF the admin is the one who decided to leave), id of the group in the params
 * @param {Object} res @EXPECTED success status of the group has been  deleted or left
 */
exports.leaveGroup = (req, res) => {
  const user = req.user;
  Group.findOne({ admin: user._id, _id: req.params.id }).then(found => {
    if (found) {
      Group.findByIdAndRemove(req.params.id).then(deleted => {
        res.json({ success: true, msg: "Left Successfully, group deleted" });
      });
    } else {
      Group.findByIdAndUpdate(req.params.id, {
        $pull: { users: user._id }
      }).then(data => {
        res.json({ success: true, msg: "Left Successfully" });
      });
    }
  });
};

exports.getGroup = (req, res) => {
  Group.findById(req.params._id).then(group => {
    Messages.findOne({ group: group._id })
      .populate(["group", "sender"])
      .then(messages => {
        res.json(messages);
      });
  });
};
