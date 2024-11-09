import express from 'express';
import mongoose from 'mongoose'; 
import MongoStore from 'connect-mongo';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import AllRoutes from './routes/route.mjs'; 

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL or '*' for all origins
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

mongoose.connect(process.env.dbURL)
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error found while connecting to database', err);
  });

app.use(express.json());
app.use(cookieParser('void'));
app.use(
  session({
    secret: 'void',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 30,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(AllRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
