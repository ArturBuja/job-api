import mongoose = require('mongoose');

const connectDB = (url: string | undefined) => {
  if (url) {
    return mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  }
};

export = connectDB;
