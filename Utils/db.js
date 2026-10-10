const mongoose = require("mongoose");
const dnsFallback = require("./dnsFallback");

// The connection promise is cached so that warm serverless invocations (Vercel) reuse
// one connection instead of opening a new one per request. A failed attempt is cleared
// so the next call retries.
let connecting = null;

module.exports = () => {
  if (!connecting) {
    connecting = dnsFallback(process.env.CONN_STR)
      .then(() => mongoose.connect(process.env.CONN_STR))
      .catch((err) => {
        connecting = null;
        throw err;
      });
  }
  return connecting;
};
