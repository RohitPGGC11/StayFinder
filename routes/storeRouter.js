// external module
const express = require("express");
const storeRouter = express.Router();

// local module

const storecontroller = require("../controllers/storecontroller");
const isAuth = require("../utils/isAuth");
// route: /
storeRouter.get("/", storecontroller.gethomes);
storeRouter.get("/bookings",isAuth, storecontroller.getbookings);
storeRouter.get("/index",isAuth, storecontroller.getindex);
storeRouter.get("/home-list",isAuth, storecontroller.gethomelist);

storeRouter.get("/home/:homeid",isAuth,storecontroller.gethomesdetails);

storeRouter.get("/favourite-list",isAuth, storecontroller.getfavouritelist);
storeRouter.post("/favourite-list", storecontroller.postaddtofavourite);

storeRouter.post("/delete/:homeid", storecontroller.removefromfavourite);

module.exports = storeRouter;
