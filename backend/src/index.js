const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",") : "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.get("/", (req, res) => {
    res.json("App listening");
})

app.use("/auth", require("./routes/auth"))
app.use("/chat", require("./routes/chats"))

app.listen(PORT, () => {
    console.log("App running on " + PORT)
})