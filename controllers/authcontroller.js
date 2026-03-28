const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
exports.getlogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "login",
    currentpage: "login",
    isLoggedIn: false,
    errors: [],
    OldInput: { email: "" },
    user: {},
  });
};

exports.postlogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user =  await User.findOne({email:email});
  if (!user) {
    return res.status(422).render("auth/login", {
      pageTitle: "login",
      currentpage: "login",
      isLoggedIn: false,
      errors: [{ msg: "User does Not Exists" }],
      OldInput: { email },
      user: {},
    });
  }
  const ismatch = await bcrypt.compare(password,user.password);
  if(!ismatch){
   return res.status(422).render("auth/login",{
    pageTitle:"login",
    currentpage: "login",
    isLoggedIn:false,
    errors:[{msg:"password is incorrect"}],
    OldInput: { email },
    user: {},

   })   
  }

  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

exports.postlogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getsignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "signup",
    currentpage: "signup",
    isLoggedIn: false,
    errors: [],
    OldInput: { firstName: "", lastName: "", email: "", userType: "" },
    user: {},
  });
};

exports.postsignup = [
  check("firstName")
    .notEmpty()
    .withMessage("First Name Should not be empty")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First Name should contains atlest 2 Letters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("First Name Should Contains only alphabets"),

  check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage("Last Name Should Contains only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a  valid email")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password should be atlest 8 character long")
    .matches(/[A-Z]/)
    .withMessage("Password should contains atleast one Upper letter ")
    .matches(/[a-z]/)
    .withMessage("Password should contains atleast one Lower letter ")
    .matches(/[0-9]/)
    .withMessage("Password should contains atleast one Number")
    .matches(/[!@#$%^&*()_-]/)
    .withMessage("Password should contains atleast one special Character ")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not Match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid user type"),

  check("termsAccepted")
    .notEmpty()
    .withMessage("please Accept the term And condition")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("Please Accept the term and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render("auth/signup", {
        pageTitle: "signup",
        currentpage: "signup",
        isLoggedIn: false,
        errors: errors.array(),
        OldInput: { firstName, lastName, email, userType },
        user: {},
      });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedpassword) => {
        const user = new User({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedpassword,
          userType: userType,

        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
        return res.status(422).render("auth/signup", {
          pageTitle: "signup",
          currentpage: "signup",
          isLoggedIn: false,
          errors: [{ msg: err.message }],
          OldInput: { firstName, lastName, email, userType },
          user: {},
          
        });
      });
  },
];
