import mongoose, { Document } from 'mongoose';
import bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword: (pwd: string) => boolean;
  createJWT: () => string;
}

const UserScheme = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Proszę wprowadzić nazwę'],
    minlenght: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Proszę wprowadzić e-mail'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Proszę wprowadzić poprawny e-mail',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Proszę wprowadzić hasło'],
    minlenght: 6,
  },
});

UserScheme.pre<IUser>('save', async function () {
  const salt = await bcrypt.genSalt();

  this.password = await bcrypt.hash(this.password, salt);
});

UserScheme.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserScheme.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export = mongoose.model<IUser>('User', UserScheme);
