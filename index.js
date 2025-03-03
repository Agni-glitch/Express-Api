const express = require("express");
let app = express();

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const moviesRouter = require("./Routes/movesRoutes");
const customError = require("./Utils/customError");
const globalErrorHandler = require("./Controllers/errorController");
const authRouter = require('./Routes/authRouter')
const userRoute = require('./Routes/userRoutes')

app.use(helmet()) // adding security headers

let limiter = rateLimit({  //Brute Force attack
  max:1000,
  windowMs: 60*60*1000,
  message:'We have received too many request from this IP. Please try after 1 hour'
})

app.use('/api',limiter)

app.use(express.json({limit:'10kb'})); //denial of service attack

app.use(sanitize()) //prevent no sql query injection
app.use(xss()) //mal html req
app.use(hpp({whitelist:[
  'duration','ratings','releaseYear','releaseDate','genres','directors'
]})) //preventing parameter pollution

app.use(express.static("./public"));

app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRoute);

app.all("*", (req, res, next) => {
  const err = new customError(
    `can't find ${req.originalUrl} on the server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
