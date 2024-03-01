import mongoose from "mongoose";

// MongoDB Schema
const userSchema = new mongoose.Schema({
    name: String,
    number: Number,
    password: String,
    latitude: Number,
    longitude: Number,
    language: String,
});

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    latitude: Number,
    longitude: Number,
    worker: [{
        profession: String,
        quantity: Number,
    }],
    password: String,
    language: String,
    available: Boolean,
    EmergencyCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emergency" }],
});

const districtSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: Number,
    latitude: Number,
    longitude: Number,
    password: String,
    EmergencyCases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Emergency" }],
});

const emergencySchema = new mongoose.Schema({
    name: String,
    number: Number,
    latitude: Number,
    longitude: Number,
    cause: String,
    date: String,
    campId: String,
    solved: Boolean
});

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number,
    description: String,
    userId: Number
});

// MongoDB Models
export const User = mongoose.model("User", userSchema);
export const Admin = mongoose.model("Admin", adminSchema);
export const District = mongoose.model("District", districtSchema);
export const Emergency = mongoose.model("Emergency", emergencySchema);
export const Contact = mongoose.model("Contact", contactSchema);
