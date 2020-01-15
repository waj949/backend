const User = require("../models/user.js"),
      Request = require("../models/request.js");

const getRequests = (req,res)=>{
          
  Request.find({receiver : req.user._id}).populate("sender").exec((err,found)=>{
      res.json(found)
  })
};

const acceptRequest = (req,res)=>{
          
  Request.findById(req.params.id).exec((err,found)=>{
      if (err) return res.json({success: false, err})
      if(found){
          Request.findByIdAndDelete(req.params.id, (err,deleted)=>{
              if (err) return res.json({success: false, err})
              Friendship.create({first:found.sender, second: found.receiver}, (err,created)=>{
                  if (err) res.json({success : false, err})
                  else res.json({success: true})
              }) 
          })
      }else res.json({success : false, msg: "there's no request"})
  })
}



module.exports = {
  getRequests,acceptRequest
  
};
