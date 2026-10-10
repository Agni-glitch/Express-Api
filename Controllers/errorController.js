const customError = require("../Utils/customError");

const devError = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const prodError = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    // the client gets a generic message, so the details have to reach the server logs
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path} : ${err.value}!`;
  return new customError(msg, 400);
};

const duplicateKeyErrorHandler = (err) => {
  const [field, value] = Object.entries(err.keyValue || {})[0] || [];
  const msg = `There is already a record with ${field} ${value}. Please use another ${field}!`;
  return new customError(msg, 400);
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;
  return new customError(msg, 400);
};

const handleExpiredJwt =(err)=>{
  return new customError('JWT expired. Please login again!',401)
}

const handleJwtError =(err)=>{
  return new customError('Invalid token. Please login again!',401)
}

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (error.name === "CastError") error = castErrorHandler(error);
  if (error.code === 11000) error = duplicateKeyErrorHandler(error);
  if (error.name === "ValidationError") error = validationErrorHandler(error);

  if(error.name === "TokenExpiredError") error = handleExpiredJwt(error)
  if(error.name === "JsonWebTokenError") error = handleJwtError(error)

  if (process.env.NODE_ENV === "production") {
    prodError(res, error);
  } else {
    devError(res, error);
  }
};
