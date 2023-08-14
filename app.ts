require('dotenv').config();
require('express-async-errors');
import express = require('express');
//routers
import authRouter = require('./routes/auth');
import jobsRouter = require('./routes/jobs');
//DB
import connectDB = require('./db/connect.js');
//middleware
import authUser = require('./middleware/authentication');
//
import helmet = require('helmet');
import cors = require('cors');
import xss = require('xss-clean');
import rateLimiter from 'express-rate-limit';

const app = express();

//connectDB

// error handler
import notFoundMiddleware = require('./middleware/not-found');
import errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

app.get('/', (req, res) => {
  res.send('Job API');
});
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authUser, jobsRouter);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
