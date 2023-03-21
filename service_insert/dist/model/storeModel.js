"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeLogModel = void 0;
const mongoose = require("mongoose");
const storeLog = new mongoose.Schema({
    device_name: { type: String, required: true },
    timestamp: { type: String }
});
const storeLogModel = mongoose.model("storeLog", storeLog);
exports.storeLogModel = storeLogModel;
