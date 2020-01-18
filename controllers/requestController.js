const User = require("../models/user.js"),
    Request = require("../models/request.js");

/**
 * @function getRequests return all the requests that is send to a spcific receiver (user)
 * @param {Object} req EXPECTED to have the user in the body (Added automatically bu the middleware) 
 * @param {Object} res EXPECTED tohave the all the reguests 
 */
const getRequests = (req, res) => {
    Request.find({ receiver: req.user._id }).populate("sender").exec((err, found) => {
        res.json(found)
    })
};

/**
 * @function acceptRequest accept a friend request, it first finds the requests table, when it finds the request it removes it from the collation,
 * and then adds a freindship records between the sender of the request and the reciver 
 * @param {Object} req EXPECTED to have object id of the request in the params 
 * @param {Object} res EXPECTED to have the JSEND response with success equil to true of everything works out fine
 */
const acceptRequest = (req, res) => {
    Request.findById(req.params.id).exec((err, found) => {
        if (err) return res.json({ success: false, err })
        if (found) {
            Request.findByIdAndDelete(req.params.id, (err, deleted) => {
                if (err) return res.json({ success: false, err })
                Friendship.create({ first: found.sender, second: found.receiver }, (err, created) => {
                    if (err) res.json({ success: false, err })
                    else res.json({ success: true })
                })
            })
        } else res.json({ success: false, msg: "there's no request" })
    })
}

module.exports = {
    getRequests,
    acceptRequest
};