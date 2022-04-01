const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');

var corsOptions = {
//  origin: "http://192.168.1.3:3000"
  origin: "http://localhost:3000"
};

app.use(cookieParser());

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');
// simple route
//app.get("/", (req, res) => {
//  res.render('auth');
//});

app.use(express.static(path.join(__dirname, './app/public')));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}*/