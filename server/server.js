const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
app.use(bodyParser.urlencoded({ extended: false }));
const isochroneController = require('./isochroneController');
const googleMapsController = require('./googleMapsController');
const centroidController = require('./centroidController');
const yelpController = require('./yelpController');
const cors = require('cors');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const authController = require('./authController')(client, axios);

// const passport = require('passport');
// const GitHubStrategy = require('passport-github').Strategy;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/github/callback"
//   },
//   (accessToken, refreshToken, profile, cb) => {
//     return cb(null, profile);
//   }
// ));

if (process.env.NODE_ENV === 'production') {
  // statically serve everything in the build folder on the route '/build'
  app.use('/build', express.static(path.join(__dirname, '../build')));
  // serve index.html on the route '/'
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
  });
}

console.log(process.env.NODE_ENV);

app.listen(3000); //listens on port 3000 -> http://localhost:3000/
console.log('this works, at least !');
// routes here
app.post(
  '/api/buildroute',
  isochroneController.getCoords,
  isochroneController.generateRoutes,
  isochroneController.generateIsochrones,
  centroidController.getCentroid,
  yelpController.getNearby,
  googleMapsController.genGoogleMapsURL,
  yelpController.getRadius,
  (req, res) => {
    //console.log('res.locals @ end of middleware chain', res.locals);
    console.log('success!');
    res.status(200).json(res.locals);
  }
);

app.post('/api/auth/google', authController.googleSignIn, (req, res) => {
  res.cookie('googleSession', res.locals.googleSession, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  });
  return res.status(200).send('success');
});

// app.get('/auth/github',
//   passport.authenticate('github'));
//
// app.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   (req, res) => {
//     res.redirect('/')
// });

app.get('/api/', (req, res) => {
  //do stuff
});

app.use((err, req, res, next) => {
  res.json(err)
});
