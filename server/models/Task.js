const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const TaskSchema = new Schema({
  name: { type: String },
  description: { type: String },
  dueDate: { type: Date },
  repeat: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  lastCompleted: { type: Date, default: null },
  project: { type: Schema.Types.ObjectId, default: null },
  user: { type: Schema.Types.ObjectId, required: true },
});

TaskSchema.virtual("date_formatted").get(function () {
  if (this.dueDate) {
    return DateTime.fromJSDate(this.dueDate).toLocaleString();
  } else {
    return "";
  }
});

module.exports = mongoose.model("Task", TaskSchema);
