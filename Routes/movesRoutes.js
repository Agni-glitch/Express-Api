const express = require("express");
const moviesController = require("./../Controllers/moviesController");
const authController = require("./../Controllers/authController");

const moviesRouter = express.Router();

moviesRouter
  .route("/highest-rated")
  .get(moviesController.getHighestRated, moviesController.getAllMovies);

moviesRouter.route("/movie-stats").get(moviesController.getMovieStats);
moviesRouter
  .route("/movie-by-genre/:genre")
  .get(moviesController.getMovieByGenre);

moviesRouter
  .route("/")
  .get(authController.protect,moviesController.getAllMovies)
  .post(authController.protect,authController.restrict('admin'),moviesController.addMovie);
moviesRouter
  .route("/:id")
  .get(authController.protect,moviesController.getOneMovie)
  .patch(authController.protect,authController.restrict('admin'),moviesController.updateMovie)
  .delete(authController.protect,authController.restrict('admin'),moviesController.deleteMovie);

module.exports = moviesRouter;