const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
router.post("/new-user", async (req, res) => {
  try {
    const { name, age, email, time } = req.body;
    const currentMonth = new Date().getMonth() + 1;

    const user = new User({
      name,
      age,
      email,
      paymentRecords: [
        {
          monthlyBatch: time,
          enrolledDate: new Date().setMonth(currentMonth - 1),
          paymentStatus: true,
        },
      ],
    });

    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/check-user", async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email: email });
    res.status(200).json({ exists: !!existingUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/existing-user", async (req, res) => {
  try {
    const { email, time } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const hasPaidForCurrentMonth = existingUser.paymentRecords.some(
      (record) => {
        const recordMonth = record.enrolledDate.getMonth();
        const recordYear = record.enrolledDate.getFullYear();

        return (
          record.paymentStatus &&
          recordMonth === currentMonth &&
          recordYear === currentYear
        );
      }
    );

    if (hasPaidForCurrentMonth) {
      return res.status(400).json({
        message: "User has already paid for this batch in the current month",
      });
    }
    existingUser.paymentStatus = true;
    existingUser.paymentRecords.push({
      monthlyBatch: time,
      enrolledDate: new Date(),
      paymentStatus: true,
    });

    await existingUser.save();

    res.status(200).json({ message: "Payment successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
