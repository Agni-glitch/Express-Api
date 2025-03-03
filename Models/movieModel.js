const mongoose = require("mongoose");
const fs = require("fs");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
      unique: true,
      maxlength: [100, "Movie name must not have more than 100 characters"],
      minlength: [4, "Movie name must not have atleast 4 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required field"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "duration is required field"],
    },
    ratings: {
      type: Number,
      validate: {
        validator: function (value) {
          value >= 1 && value <= 5;
        },
        message:
          "({VALUE}): Ratings should be equal to 1 or more and also should be 5 or less",
      },
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "release year is required field"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    genres: {
      type: [String],
      required: [true, "genres is a required field"],
      enum: {
        values: [
          "Action",
          "Adventure",
          "Sci-Fi",
          "Thriller",
          "Crime",
          "Drama",
          "Romance",
          "Comedy",
          "Horror",
          "Biography",
        ],
        message: "genre not found",
      },
    },
    directors: {
      type: [String],
      required: [true, "directors is a required field"],
    },
    coverImage: {
      type: String,
      required: [true, "cover image is a required field"],
    },
    actors: {
      type: [String],
      required: [true, "actors is a required field"],
    },
    price: {
      type: Number,
      required: [true, "price is a required field"],
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "AGNI ROYBAR";
  console.log(this);
  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.endTime = Date.now();
  content = `Query took ${
    this.endTime - this.startTime
  } milliseconds to fetch the document\n`;
  fs.writeFileSync("./Log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });
  next();
});

movieSchema.pre("aggregate", function (next) {
  console.log(
    this.pipeline().unshift({
      $match: { releaseDate: { $lte: new Data.now() } },
    })
  );
  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
