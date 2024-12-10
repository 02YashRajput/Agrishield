import express from 'express';
import mongoose from 'mongoose'; 
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import AllRoutes from './routes/route.mjs'; 
import { connectDb } from './config/connect-db.mjs';
import {configureChatSockets} from "./config/socket.mjs"
import http from 'http'; 

const cookie_secret = process.env.COOKIE_SECRET ;
const session_secret = process.env.SESSION_SECRET;
dotenv.config();

const app = express();
const httpServer = http.createServer(app); 

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,            
    process.env.PRODUCTION_CLIENT_URL  
  ],
  credentials: true, 
};

app.use(cors(corsOptions));

await connectDb();

app.use(express.json());
app.use(cookieParser(cookie_secret));
app.use(
  session({
    secret: session_secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 30,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
    rolling: true
  })

);

app.use(passport.initialize());
app.use(passport.session());

app.use(AllRoutes);


configureChatSockets(httpServer);
httpServer.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});