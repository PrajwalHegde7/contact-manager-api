const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

// Define Routes
//POST user registration
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
//GET POST UPDATE DELETE contact, authentication required
app.use("/api/contacts", require("./routes/contacts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
