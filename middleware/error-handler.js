"use strict";
// import { CustomAPIError } from '../errors';
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Coś poszło nie tak, spróbuj ponownie później',
    };
    // if (err instanceof CustomAPIError) {
    //   return res.status(err.statusCode).json({ msg: err.message });
    // }
    if (err.name === 'ValidationError') {
        console.log('object');
        customError.msg = Object.values(err.errors)
            .map(item => item.message)
            .join(' ,');
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    if (err.name === 'CastError') {
        customError.msg = `brak wartości o id: ${err.value}`;
        customError.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Zdublikowana wartość dla wartości: ${Object.keys(err.keyValue)}, prosze spróbować z inną wartoscią`;
        customError.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
module.exports = errorHandlerMiddleware;
