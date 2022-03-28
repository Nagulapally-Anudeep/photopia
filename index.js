const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes");
const { ensureAuthenticated } = require("./middleware");
const User = require("./models/userModel");
const Post = require("./models/postModel");
const postController = require("./controllers/postController");

const app = express();

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;
db.on("error", () => console.log("MongoDB connection error"));
db.once("open", () => console.log("MongoDB connected"));

// app.use(cors());
passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((_id, done) => {
  // done(null, user);
  User.findById(_id, (err, user) => {
    if (err) {
      done(null, false, {
        error: err,
      });
    } else {
      done(null, user);
    }
  });
});

const callbackURL = `http://${
  process.env.NODE_ENV === "development" ? "localhost:3000" : "cryptodosth.com"
}/auth/google/callback`;
console.log(callbackURL);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      let userProfile = profile;
      console.log(userProfile);
      process.nextTick(async () => {
        const email = userProfile.emails[0].value;
        console.log(email);
        const user = await User.findOne({ email });
        console.log(user);
        if (user) {
          return done(null, user);
        }
        const newUser = new User({
          name: userProfile.displayName,
          email: userProfile.emails[0].value,
          profilePic: userProfile.photos[0].value,
        });
        await newUser.save();
        return done(null, newUser);
      });
    }
  )
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(cookieParser("abcd")); // * abcd
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "shinzou sasageyo",
    key: "eren yeager",
  })
);
app.use(passport.initialize());
app.use(passport.session());
// *
// app.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   next();
// });
// *
app.use(express.static(__dirname + "/public"));

app.use("/", indexRouter);

app.get("/", ensureAuthenticated, async (req, res) => {
  // res.send(req.user);
  console.log(req.user);
  const posts = await Post.find();
  res.render("home", { posts: posts, isLoggedIn: true, user: req.user });
});

app.post("/", ensureAuthenticated, postController.createPost);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = app;
