require("dotenv").config();
const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
			console.log(profile);
      done(null, profile);
    }
  )
);

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

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "shinzou sasageyo", key: "levi" }));

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running on port " + port));
