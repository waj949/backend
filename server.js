const express               = require("express"),
      bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      app                   = express();
      port                  = process.env.PORT || 7000,
      User                  = require("./models/user.js"),
      Friendship            = require("./models/friendship.js"),
      Message               = require("./models/message.js"),
      Request               = require("./models/request.js"),
      Group                 = require("./models/group.js")

mongoose.connect("mongodb://waar:waarwaar7@ds263368.mlab.com:63368/nodes" , 
{ useUnifiedTopology: true ,  useNewUrlParser: true })      
mongoose.connection.once("open" , ()=> console.log("workin properly"))

app.use(bodyParser.json())


// app.get('*', (req, res) => {
//           res.sendFile(`index.html`, { root: www });
// });

app.get("/" , (req,res) => {
    res.json({team : "Waar" ,project : "Nodes", version : "1.0.0"})
})
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
      
