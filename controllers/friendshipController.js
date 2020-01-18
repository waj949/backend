const Friendship = require("../models/friendship.js");

/**
 * @function getFriends this function well recive both of the ids of the users, it well checks the freindship table, of the first user and the second 
 * //to check of they are friends or not, if they are freinds, it well fetch all the freinds that specific user
 * @param {Object} req the http req object  EXPECTED to the id of the user in the body of request that you want to fetch all his freinds 
 * @param {Object} res the responst object, EXPECTED to have all the freinds of that spicific user in the response 
 */
exports.getFriends = (req, res) => {
    Friendship.find({ $or: [{ first: req.user._id }, { second: req.user._id }] })
        .populate(["first", "second"])
        .exec((err, found) => {
            if (err) return res.json({ success: false, err });
            res.json(
                found.map(one => {
                    if (!(one.first && one.second)) {
                        return null;
                    }
                    return one.first._id.toString() == req.user._id.toString() ?
                        one.second :
                        one.first;
                })
            );
        });
};

exports.removeFriend = (req, res) => {
    const friend = req.params.id;
    Friendship.findOneAndDelete({
        $or: [
            { first: friend, second: req.user._id },
            { first: req.user._id, second: friend }
        ]
    }).then(data => {
        res.json({ success: true });
    });
};