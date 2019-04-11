import express, { NextFunction, Request, Response } from "express";
import compression from "compression"; // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import { MONGODB_URI } from "./util/secrets";
import expressJwt from "express-jwt";
import history from "connect-history-api-fallback";

// Controllers (route handlers)
import * as pageViewsController from "./controllers/page-views";
import * as exampleController from "./controllers/example";
import * as aboutController from "./controllers/about";
import * as userController from "./controllers/user";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose
  .connect(mongoUrl, { useMongoClient: true })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// static assets
app.use(express.static(path.join(__dirname, "public")));

// token拦截
app.use(
  expressJwt({ secret: process.env.TOKEN_SECRET }).unless({
    path: ["/api/login", "/api/register"]
  })
);
// token错误信息返回
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === "UnauthorizedError") {
    return res.status(err.status).json({
      state: false,
      message: err.message
    });
  } else {
    next();
  }
});

/**
 * Primary app routes.
 */
app.get("/pv/get", pageViewsController.getPageViews);
app.get("/pv/set", pageViewsController.setPageViews);
app.get("/api/example", exampleController.example);
app.get("/api/about", aboutController.about);
app.post("/api/register", userController.register);
app.post("/api/login", userController.login);

// HTML5 History 模式
app.use(history());

export default app;
