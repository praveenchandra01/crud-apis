const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5050;

// Mongodb specific stuff
mongoose.connect("mongodb://localhost/crud-apis");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB connected...");
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salary: Number,
    department: String,
});

const User = mongoose.model("user", UserSchema);

// Express specific stuff
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Hello from express");
});

//Gell all users
app.get("/api/user", async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        data: users,
    });
});

//Get single user
app.get("/api/user/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            throw "User not found";
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

// Create user
app.post("/api/user", (req, res) => {
    const user = req.body;
    try {
        if (!user.name || !user.salary || !user.department) {
            throw "All fields are required";
        }
        const newUser = new User(user);
        newUser.save();
        res.status(200).json({
            success: true,
            data: newUser,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

//Update user
app.put("/api/user/:id", async (req, res) => {
    const user = req.body;
    const id = req.params.id;
    try {
        const userData = await User.findById({ _id: id });
        if (!userData) {
            throw "User not found";
        }
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json({
            success: true,
            data: updatedUser,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

//Delete User
app.delete("/api/user/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const userData = await User.findById({ _id: id });
        if (!userData) {
            throw "User not found";
        }
        await User.findByIdAndDelete({ _id: id });
        const user = await User.find();
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err,
        });
    }
});

app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
