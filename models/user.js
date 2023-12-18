const mongoose = require("mongoose");

const paymentRecordSchema = new mongoose.Schema({
  monthlyBatch: {
    type: String,
    enum: ["6-7AM", "7-8AM", "8-9AM", "5-6PM"],
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 65,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  paymentRecords: [paymentRecordSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
