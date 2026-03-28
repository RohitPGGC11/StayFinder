const express = require("express");
const hostRouter = express.Router();

const hostcontroller = require("../controllers/hostcontroller");
const isAuth = require("../utils/isAuth");

hostRouter.get("/add-home",isAuth ,hostcontroller.getaddhome);
hostRouter.post("/add-home", hostcontroller.postaddhome);
hostRouter.get("/host-home-list",isAuth, hostcontroller.gethosthomelist);

hostRouter.get("/edit-home/:homeid",isAuth, hostcontroller.getedithome);
hostRouter.post("/edit-home", hostcontroller.postedithome);

hostRouter.post("/delete-home/:homeid", hostcontroller.postdeletehome);
module.exports = hostRouter;
