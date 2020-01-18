exports.getAllMessages = (req, res) => {
    Message.find({
            $or: [
                { sender: req.user._id, receiver: req.params.id },
                { sender: req.params.id, receiver: req.user._id }
            ]
        })
        .populate("sender")
        .exec((err, messages) => {
            if (err) res.json({ success: false, err });
            else res.json(messages);
        });
}

exports.createMessage = (req, res) => {
    Message.create({
            sender: req.user._id,
            receiver: req.params.id,
            content: req.body.content
        },
        (err, created) => {
            if (err) res.json({ success: false, err });
            else res.json(created);
        }
    );
}