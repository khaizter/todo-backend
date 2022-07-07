const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: { type: String, required: true },
  items: [
    {
      task: { type: String, required: true },
      status: { type: String, default: "in-progress" },
      _id: { type: Schema.Types.ObjectId, required: true },
    },
  ],
  owner: { type: String, required: true },
});

module.exports = mongoose.model("Todo", todoSchema);
