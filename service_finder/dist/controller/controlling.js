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
exports.ConvertDataFlow = void 0;
const { lightFlowUpdateModel } = require("../model/lightFlowUpdate");
const { storeLogModel } = require("../model/storeModel");
var ConvertDataFlow;
(function (ConvertDataFlow) {
    class UpdateData {
        constructor(device_name, counting, timestamp) {
            this.device_name = device_name;
            this.counting = counting;
            this.timestamp = timestamp;
        }
        haddleUpdateData() {
            return __awaiter(this, void 0, void 0, function* () {
                const deviceName = this.device_name;
                const timing = this.timestamp;
                const countPeople = this.counting;
                try {
                    console.log("this.device_name => ", this.device_name);
                    console.log("deviceName => ", deviceName);
                    const countingPeople = yield lightFlowUpdateModel.findOne({ device_name: deviceName });
                    console.log("countingPeople => ", countingPeople);
                    if (!countingPeople) {
                        yield lightFlowUpdateModel.create({
                            device_name: deviceName,
                            counting: 1,
                            timestamp: timing
                        });
                        return "OK";
                    }
                    else {
                        yield lightFlowUpdateModel.updateOne({ "device_name": deviceName }, { "counting": countPeople });
                        return "OK";
                    }
                }
                catch (err) {
                    console.log(err);
                    return "Error";
                }
            });
        }
    }
    ConvertDataFlow.UpdateData = UpdateData;
    class InsertData {
        constructor(device_name, timestamp) {
            this.device_name = device_name;
            this.timestamp = timestamp;
        }
        haddleInsertData() {
            return __awaiter(this, void 0, void 0, function* () {
                const deviceName = this.device_name;
                const timing = this.timestamp;
                // console.log("in controller => ", deviceName, timing)
                try {
                    yield storeLogModel.create({
                        device_name: deviceName,
                        timestamp: timing
                    });
                    return "OK";
                }
                catch (err) {
                    console.log(err);
                    return "Error";
                }
            });
        }
    }
    ConvertDataFlow.InsertData = InsertData;
    class FinderData {
        constructor(device_name) {
            this.device_name = device_name;
        }
        haddleFinderData() {
            return __awaiter(this, void 0, void 0, function* () {
                const deviceName = this.device_name;
                const fetchData = yield lightFlowUpdateModel.findOne({ device_name: deviceName });
                if (fetchData.counting === 0) {
                    return 0;
                }
                else {
                    return 1;
                }
            });
        }
    }
    ConvertDataFlow.FinderData = FinderData;
    class TestingClass {
        haddleTesting() {
            return "testing ok";
        }
    }
    ConvertDataFlow.TestingClass = TestingClass;
})(ConvertDataFlow = exports.ConvertDataFlow || (exports.ConvertDataFlow = {}));
