const Home = require("../models/home");
const fs = require("fs");
exports.getaddhome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "airbnb add-home",
    currentpage: "add-home",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.postaddhome = (req, res, next) => {
  console.log("home registeration successfull", req.body);
  const { houseName, price, location, rating, description } = req.body;

  console.log(req.file);
  if (!req.file) {
    console.log("file not found");
    return res.status(422).send("image file is required");
  }
  const photo = req.file.path;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("home saved successfully");
  });
  res.redirect("/home-list");
};

exports.gethosthomelist = (req, res, next) => {
  Home.find().then((registerhomes) => {
    res.render("host/host-home-list", {
      registerhomes: registerhomes,
      pageTitle: "airbnb booking",
      currentpage: "host-home-list",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getedithome = (req, res, next) => {
  const homeid = req.params.homeid;
  const editing = req.query.editing === "true";
  Home.findById(homeid).then((home) => {
    if (!home) {
      console.log("home not found for editing");
      return res.redirect("/host-home-list");
    } else {
      res.render("host/edit-home", {
        pageTitle: "edit your home ",
        currentpage: "host-home",
        editing: editing,
        home: home,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
      console.log(homeid, editing, home);
    }
  });
};
exports.postedithome = (req, res, next) => {
  console.log("home registeration successfull", req.body);
  const { id, houseName, price, location, rating, description } =
    req.body;
  Home.findById(id)
    .then((home) => {
      (home.houseName = houseName),
        (home.price = price),
        (home.location = location),
        (home.rating = rating),
        (home.description = description);
        
        if(req.file){
          fs.unlink(home.photo,(err)=>{
            if(err){
              console.log("error while file deletion",err);
            }
          });
          home.photo = req.file.path; // Update photo only if a new file is uploaded
        };
        


      home
        .save()
        .then((result) => {
          console.log("home updation successfull", result);
        })
        .catch((err) => {
          console.log("error", err);
        });
      res.redirect("/host-home-list");
    })
    .catch((err) => {
      console.log("error while eddting the code", err);
    });
};

exports.postdeletehome = (req, res, next) => {
  const homeid = req.params.homeid;
  Home.findByIdAndDelete(homeid)
    .then(() => {
      res.redirect("/host-home-list");
    })
    .catch((error) => {
      console.log(error);
    });
};
