const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const TaskSchema = new Schema({
  name: { type: String },
  description: { type: String },
  dueDate: { type: Date },
  repeat: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  lastCompleted: { typeDate },
  project: { type: Schema.Types.ObjectId, required: true },
});

TaskSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.dueDate).toLocaleString();
});

module.exports = mongoose.model("Task", TaskSchema);
