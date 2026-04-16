const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Admin"],
      default: "Student",
    },
    phone: {
      type: String,
      default: "",
    },
    faculty: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: "",
    },
    trustMetrics: {
      disputedTransactions: { type: Number, default: 0 },
      falseLostReports: { type: Number, default: 0 },
      respondedCount: { type: Number, default: 0 },
      totalMessagesReceived: { type: Number, default: 0 },
      lastAuditDate: { type: Date, default: Date.now },
    },
    trustScore: {
      type: Number,
      default: 0,
      index: true
    },
    trustLevel: {
      type: String,
      default: "Improving",
      enum: ["Improving", "Standard", "Trusted", "Elite"]
    },
    reputationHistory: [
      {
        event: { type: String, required: true },
        points: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.models.User || mongoose.model("User", userSchema);