const Home = require("../models/home");
const User = require("../models/user");

exports.gethomes = (req, res, next) => {
  Home.find().then((registerhomes) => {
    res.render("store/airbnb", {
      registerhomes: registerhomes,
      pageTitle: "airbnb booking",
      currentpage: "home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getbookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "airbnb bookings",
    currentpage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getfavourite = (req, res, next) => {
  res.render("store/favourite-list", {
    pageTitle: "airbnb favourite-list",
    currentpage: "favourite-list",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getfavouritelist = async (req, res, next) => {
  const userID = req.session.user._id;
  const user = await User.findById(userID).populate("favourites");
  res.render("store/favourite-list", {
    favouritehomes: user.favourites,
    pageTitle: "favourite-homes",
    currentpage: "favourite-list",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postaddtofavourite = async (req, res, next) => {
  const homeid = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeid)) {
    user.favourites.push(homeid);
    await user.save();
  }
  res.redirect("/favourite-list");
};

exports.removefromfavourite = async (req, res, next) => {
  const homeid = req.params.homeid;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeid)) {
    user.favourites = user.favourites.filter(
      (fav) => fav.toString() !== homeid.toString()
    );
    await user.save();
  }
  res.redirect("/favourite-list");
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.getindex = (req, res, next) => {
  res.render("store/index", {
    pageTitle: "airbnb index",
    currentpage: "index",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.gethomelist = (req, res, next) => {
  Home.find().then((registerhomes) => {
    res.render("store/home-list", {
      registerhomes: registerhomes,
      pageTitle: "airbnb booking",
      currentpage: "home-list",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.gethomesdetails = (req, res, next) => {
  const homeid = req.params.homeid;
  Home.findById(homeid).then((home) => {
    if (!home) {
      console.log("home not found");
      return res.redirect("/home-list");
    } else {
      res.render("store/home-details", {
        home: home,
        pageTitle: "home details",
        currentpage: "home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};
