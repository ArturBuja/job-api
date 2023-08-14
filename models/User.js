"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserScheme = new mongoose_1.default.Schema({
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
UserScheme.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt();
        this.password = yield bcrypt.hash(this.password, salt);
    });
});
UserScheme.methods.createJWT = function () {
    return jsonwebtoken_1.default.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
};
UserScheme.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatch = yield bcrypt.compare(password, this.password);
        return isMatch;
    });
};
module.exports = mongoose_1.default.model('User', UserScheme);
