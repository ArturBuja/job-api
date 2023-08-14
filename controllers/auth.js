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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User = require("../models/User");
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.create(Object.assign({}, req.body));
    const token = user.createJWT();
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ user: { name: user.name }, token });
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.BadRequestError('Proszę wprowadzić nazwę i hasło');
    }
    const user = yield User.findOne({ email });
    if (!user) {
        throw new errors_1.UnauthenticatedError('Nieprawidłowe dane');
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new errors_1.UnauthenticatedError('Nieprawidłowe dane');
    }
    //compare pwd
    const token = user.createJWT();
    res.status(http_status_codes_1.StatusCodes.OK).json({ token, user: { name: user.name } });
});
exports.login = login;
