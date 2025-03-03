const Movie = require("../Models/movieModel");
const ApiFeatures = require("./../Utils/ApiFeatures");
const asyncErrorHAndler = require("../Utils/asyncErrorHandler");
const customError = require("./../Utils/customError");

exports.getHighestRated = (req, res, next) => {
  (req.query.limit = "5"), (req.query.sort = "-ratings");
  next();
};

exports.getAllMovies = asyncErrorHAndler(async (req, res, next) => {
  const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  let movies = await features.query;
  res.status(200).json({
    status: "success",
    length: movies.length,
    data: {
      movies,
    },
  });
});

exports.getOneMovie = asyncErrorHAndler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    const error = new customError("Movie with that ID is not found!", 404);
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.addMovie = asyncErrorHAndler(async (req, res, next) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
});

exports.updateMovie = asyncErrorHAndler(async (req, res, next) => {
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new customError("Movie with that ID is not found!", 404);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
});

exports.deleteMovie = asyncErrorHAndler(async (req, res, next) => {
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  if (!deletedMovie) {
    const error = new customError("Movie with that ID is not found!", 404);
    return next(error);
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getMovieStats = asyncErrorHAndler(async (req, res, next) => {
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 4.5 } } },
    {
      $group: {
        _id: "releaseYear",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        priceTotal: { $sum: "&price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: 1 } },
    { $match: { maxPrice: { $gte: 60 } } },
  ]);
  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats,
    },
  });
});
exports.getMovieByGenre = asyncErrorHAndler(async (req, res, next) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        movieCount: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { movieCount: -1 } },
    { $match: { genre: genre } },
  ]);
  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies,
    },
  });
});
