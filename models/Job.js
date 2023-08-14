"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const JobSchema = new mongoose_1.default.Schema({
    company: {
        type: String,
        required: [true, 'Prosze wprowadzić nazwę firmy'],
        maxlength: 50,
    },
    position: {
        type: String,
        required: [true, 'Prosze wprowadzić pozycję firmy'],
        maxlength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending',
    },
    createdBy: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: [true, 'Prosze wprowadzić nazwę użytkownika'],
    },
}, { timestamps: true });
module.exports = mongoose_1.default.model('Job', JobSchema);
