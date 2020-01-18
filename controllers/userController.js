const User = require("../models/user.js"),
    bcrypt = require("bcrypt"),
    config = require("../config.js"),
    Request = require("../models/request.js"),
    Friendship = require("../models/friendship.js");


const functions = {

    /**
     * @function getUsers return all the users in the database 
     * @param {Object} req 
     * @param {Object} res EXPECTED to have all the user in the repsonse 
     */
    getUsers: (req, res) => {
        User.find({}, (err, users) => {
            if (err) throw err;
            else res.json(users);
        });
    },

    /**
     * @function getUser gets a user from the database based on his Id, also decidecs of the user a friend with the current User, and set a boolean Are Freinds of they are frieds 
     * also of the current user and the fetched user sent each-other a freinds request or not and sets a boolean respectively 
     * @param {Object} req EXPECTED to have the username of the user that we want to fetch in the param
     * @param {Object} res EXPECTED the found user  
     */
    getUser: (req, res) => {
        if (req.params.username == req.user.username)
            return res.json({ success: true, user: req.user });
        User.findOne({ username: req.params.username })
            .lean()
            .exec((err, found) => {
                if (!found)
                    return res.json({ success: false, msg: "there's no such user" });
                Friendship.findOne({
                        $or: [
                            { first: req.user._id, second: found._id },
                            { first: found._id, second: req.user._id }
                        ]
                    },
                    (err, friends) => {
                        if (err) res.json({ success: false, err });
                        else {
                            if (friends) {
                                found.areFriends = true;
                                res.json({ success: true, user: found });
                            } else {
                                found.areFriends = false;
                                Request.findOne({ sender: req.user._id, receiver: found._id },
                                    (err, request) => {
                                        if (err) return res.json({ success: false, err });
                                        if (request) {
                                            found.sentRequest = true;
                                            res.json({ success: true, user: found });
                                        } else {
                                            found.sentRequest = false;
                                            Request.findOne({ sender: found._id, receiver: req.user._id },
                                                (err, gotrequest) => {
                                                    if (gotrequest) {
                                                        found.gotrequest = true;
                                                        res.json({ success: true, user: found });
                                                    } else {
                                                        found.gotrequest = false;
                                                        res.json({ success: true, user: found });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            });
    },

    /**
     * @function signUp adds a user in the database, if he does not exist already
     * @param {Object} req EXPECTED to have the user info in thee bpdy of the request
     * @param {Object} res EXPECTED to have a jsend respnse with the success set true
     */
    signUp: (req, res) => {
        if (!req.body.username)
            return res.json({ success: false, msg: "username is required" });
        if (!req.body.password)
            return res.json({ success: false, msg: "password is required" });
        if (req.body.password.length < 8)
            return res.json({
                success: false,
                msg: "password should be 8 characters or more"
            });
        if (!req.body.firstname)
            return res.json({ success: false, msg: "firstname is required" });
        if (!req.body.lastname)
            return res.json({ success: false, msg: "lastname is required" });
        if (!req.body.email)
            return res.json({ success: false, msg: "email is required" });
        User.findOne({ username: req.body.username }, (err, found) => {
            if (err) res.json({ success: false, err });
            else {
                if (found) return res.json({ success: false, msg: "username exists" });
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) res.json({ err });
                    else {
                        req.body.password = hash;
                        User.create(req.body, (err, created) => {
                            if (err) return res.json({ err });
                            created.password = undefined;
                            res.json({ success: true });
                        });
                    }
                });
            }
        });
    },

    /**
     * @function signIn sgin a user in the page, assign a token, and send that token along with the user in the respnse
     * @param {Object} req EXPECTED to have the username and password in the body of request 
     * @param {Object} res EXPECTED to have the token along with the user in the respose  
     */
    signIn: (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ username }, (err, user) => {
            if (err) throw err;
            if (!user) {
                return res.json({ success: false, msg: "User not found" });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.json({ success: false, err });
                if (isMatch) {
                    user.password = undefined;
                    const token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 604800 // 1 week
                    });
                    res.json({
                        success: true,
                        token: "jwt " + token,
                        user
                    });
                } else {
                    return res.json({ success: false, msg: "Wrong password" });
                }
            });
        });
    },

    /**
     * @function sendFriendRequest send a friends request grom the current sgined in user to the user which with the id sent in the param 
     * @param {Object} req EXPECTED the current user (sent automatically by the middleware), the reciver of the request ID in the param
     * @param {Object} res EXPECTED to have a jsend respnse with the success set true
     */
    sendFriendRequest: (req, res) => {
        Friendship.findOne({
                $or: [
                    { first: req.user._id, second: req.params.id },
                    { first: req.params.id, second: req.user._id }
                ]
            },
            (err, friends) => {
                if (friends)
                    return res.json({ success: false, msg: "you're already friends" });
                Request.findOne({
                        $or: [
                            { sender: req.user._id, receiver: req.params.id },
                            { sender: req.params.id, receiver: req.user._id }
                        ]
                    },
                    (err, found) => {
                        if (err) return res.json({ success: false, err });
                        if (found)
                            return res.json({
                                success: false,
                                msg: "request already exists"
                            });
                        Request.create({ sender: req.user._id, receiver: req.params.id },
                            (err, created) => {
                                if (err) return res.json({ success: false, err });
                                res.json({ success: true });
                            }
                        );
                    }
                );
            }
        );
    },

    /**
     * @function removeFriendRequest removies a freind request, it checks of the friend request exists, from each the sender side or the reciver side 
     * IF FOUND it well be deleted
     * @param {Object} req EXPECTED the current user (sent automatically by the middleware), the reciver of the request ID in the param
     * @param {Object} res EXPECTED to have a jsend respnse with the success set true
     */
    removeFriendRequest: (req, res) => {
        Request.findOne({
                $or: [
                    { sender: req.user._id, receiver: req.params.id },
                    { sender: req.params.id, receiver: req.user._id }
                ]
            },
            (err, found) => {
                if (err) return res.json({ success: false, err });
                if (!found)
                    return res.json({ success: false, msg: "there's no request" });
                Request.findByIdAndDelete(found._id, (err, removed) => {
                    if (err) return res.json({ success: false, err });
                    res.json({ success: true });
                });
            }
        );
    }
};

module.exports = functions;