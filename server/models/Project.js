const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String },
  user: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Project", ProjectSchema);
