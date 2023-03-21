const mongoose = require("mongoose");

const lightFlowUpdate = new mongoose.Schema(
    {
        device_name: {type: String, required: true},
        counting: {type: Number, require: true},
        timestamp: {type: String}
    }
)

const lightFlowUpdateModel = mongoose.model("lightFlowUpdate", lightFlowUpdate);
export {lightFlowUpdateModel}
