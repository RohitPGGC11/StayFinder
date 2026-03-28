//external module
const express = require("express");
const session = require("express-session");
const mongoDBstore = require("connect-mongodb-session")(session);
const multer = require("multer");
const db_path =
  "mongodb+srv://root:9115436309@cluster0.dc1zkju.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";


const path = require("path");

//local module;
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authrouter");
const rootdir = require("./utils/pathUtils");
const errorcontroller = require("./controllers/error");
const { default: mongoose } = require("mongoose");
const app = express();

//view engine
app.set("view engine", "ejs");
app.set("views", "views");

const store = new mongoDBstore({
  uri: db_path,
  collection: "session",
});

const randomString = (length) => {
  let result = "";
  const characters =
    "abcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {  
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + "-" + file.originalname);
  },
});

const fileFilter = (req,file,cb)=>{
  if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
    cb(null,true);
  }else{
    cb(null,false);
  }
}

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter
}

app.use(express.static(path.join(rootdir, "public")));
app.use("/uploads", express.static(path.join(rootdir, "uploads")));
app.use("/home/uploads", express.static(path.join(rootdir, "uploads")));
app.use(express.urlencoded());
app.use(multer(multerOptions).single("photo"));
app.use(
  session({
    secret: "knowlwdgegate Ai coding",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRouter);
app.use("/store", (req, res, next) => {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});


app.use(storeRouter);
app.use(hostRouter);

// local module
app.use(errorcontroller.error404);

const PORT = 3000;

mongoose
  .connect(db_path)
  .then(() => {
    console.log("connected to mongodb");
    app.listen(PORT, () => {
      console.log(`Server runing on the Adresss http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while connecting with databaes", err);
  });
