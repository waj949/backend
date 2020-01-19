
const express               = require("express"),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      app                   = express(),
      port                  = process.env.PORT || 7000,
      jwt                   = require('jsonwebtoken'),
      JwtStrategy           = require('passport-jwt').Strategy,
      ExtractJWT            = require('passport-jwt').ExtractJwt,
      passport              = require('passport'),
      User                  = require("./models/user.js"),
      Friendship            = require("./models/friendship.js"),
      Message               = require("./models/message.js"),
      Request               = require("./models/request.js"),
      Group                 = require("./models/group.js"),
      users                 = require("./routes/users.js"),
      requests              = require("./routes/requests.js"),
      messages              = require("./routes/messages.js"),
      friends               = require("./routes/friends.js"),
      config                = require("./config.js"),
      cors                  = require("cors"),
      groups                = require('./routes/groups')


      mongoose.connect('mongodb://localhost:27017/myapp', {useUnifiedTopology: true, useNewUrlParser: true},(err)=>{
          if(err) throw err
      }); 
      mongoose.connection.on('error', err => {
        logError(err);
      });
      

app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new JwtStrategy({

        jwtFromRequest : ExtractJWT.fromAuthHeaderWithScheme("jwt"),
        secretOrKey : config.secret}, function(jwt_payload, done) {
        User.findById(jwt_payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

    app.get("/api/chatroom" , (req,res) => {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    })
    
    app.use("/api/users" , users)
    app.use("/api/requests" , requests)
    app.use("/api/friends" , friends)
    app.use('/api/groups', groups)
    app.use('/api/messages', messages)
    



app.get("/api/messages/latest" , (req,res) => {
    console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
})


app.listen(port, () => console.log(`listening on http://localhost:${port}`));
      
