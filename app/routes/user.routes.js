const authJwt  = require("../middleware/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
 //   req.cookie('x-access-token');
   res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/", controller.allAccess,);

  app.get(
    "/home",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/mngr",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );


  app.get(
    "/adminpage",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.get(
    "/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUser
  );

  app.put(
    "/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.changeUser
  );

  app.put(
    "/setpassuser/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.setUserPassword
  );

  app.put(
    "/deluser/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delUser
  );

  app.post(
    "/price/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.savePrice
  );

  app.get(
    "/price/",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getPrice
  );
  
  app.get(
    "/tasks",
    [authJwt.verifyToken],
    controller.getTasks
  );

  app.put(
    "/tasks/:id",
    [authJwt.verifyToken],
    controller.changeTask
  );

  app.post(
    "/tasks",
    [authJwt.verifyToken],
    controller.saveNewTask
  );

  app.get(
    "/print/kvit/:id",
    [authJwt.verifyToken],
    controller.getKvit
  );

  app.post(
    "/orders/new/:id",
    [authJwt.verifyToken],
    controller.newOrderWarr
  );
  
  app.get(
    "/orders/task/:id",
    [authJwt.verifyToken],
    controller.getDataPartFromTask
  );

  app.get(
    "/orders/info/:id",
    [authJwt.verifyToken],
    controller.getInfoParts
  );

  app.get(
    "/orders/typeofwork/:id",
    [authJwt.verifyToken],
    controller.getTypeOfWork
  );

  app.post(
    "/orders/typeofwork",
    [authJwt.verifyToken],
    controller.setTypeOfWork
  );

  app.get(
    "/print/avr/:id",
    [authJwt.verifyToken],
    controller.getAvr
  );

  app.get(
    "/availablity/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.getAvailablity
  );

  app.get(
    "/arrival/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.getArrival
  );

  app.get(
    "/availablity/info/:id",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.getInfoFromArrival
  );

  app.get(
    "/writeoff/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.getWriteOff
  );

  app.post(
    "/availablity/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.newAvailablity
  );

  app.post(
    "/arrival/new/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.newArrival
  );

  app.post(
    "/writeoff/new/",
    [authJwt.verifyToken, authJwt.isWerehouseOrAdmin],
    controller.newWriteOff
  );

};
