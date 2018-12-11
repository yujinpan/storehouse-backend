"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const pageViewsSchema = new mongoose_1.default.Schema({
    date: String,
    ip: String
});
const PageViews = mongoose_1.default.model("PageViews", pageViewsSchema);
exports.default = PageViews;
