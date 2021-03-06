const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: { type: String, required: true },
  items: [
    {
      task: { type: String, required: true },
      status: { type: String, default: "in-progress" },
      _id: { type: String, required: true },
    },
  ],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Todo", todoSchema);
