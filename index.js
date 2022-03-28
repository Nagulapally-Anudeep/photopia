const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const indexRouter = require("./routes");

const app = express();

app.use(cors());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

const callbackURL = `http://${process.env.NODE_ENV === "development" ? "localhost" : "cryptodosth.com"}/auth/google/callback`;
console.log(callbackURL);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: "shinzou sasageyo", key: "eren yeager"}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + "/public"));

app.use("/", indexRouter);

app.get("/", (req, res) => {
	res.send(req.user);
})

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