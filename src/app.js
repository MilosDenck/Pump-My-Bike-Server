import express from 'express';
import json from 'body-parser';
import pumpRoutes from './routes/pumpRoutes.js';
import cors from "cors";
import supertokens from "supertokens-node";
import { errorHandler } from "supertokens-node/framework/express";
import { middleware } from "supertokens-node/framework/express";
import { initSuperToken } from './config/auth.js'
import loginRoutes from "./routes/loginRoutes.js"
import EmailVerificationRecipe from "supertokens-node/recipe/emailverification";
import EmailPasswordRecipe from "supertokens-node/recipe/emailpassword";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import pkg from 'supertokens-node';
const { RecipeUserId } = pkg;
import cookieParser from 'cookie-parser';


initSuperToken()

let app = express();
app.use(cookieParser());
app.use(express.json()); 



app.use(
	cors({
		origin: process.env.FRONTEND_BASE,
		allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
		credentials: true,
	}),
);

app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`new connection: ${res.statusCode} | ${req.method} ${req.path} | ${req.ip}`);
  });
  next();
});

app.use(middleware())

app.use(json());
app.use('/images', express.static('Images'));
app.use(loginRoutes);
app.use(pumpRoutes);

app.use(errorHandler());


export default app;