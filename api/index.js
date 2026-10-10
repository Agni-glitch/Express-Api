// Vercel serverless entry point. vercel.json rewrites every /api/* request here;
// server.js is not used on Vercel. Environment variables come from the Vercel project settings.
const app = require("../index");
const connectDB = require("../Utils/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: "Service temporarily unavailable. Please try again later.",
      })
    );
    return;
  }
  return app(req, res);
};
