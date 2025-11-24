const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// Middleware for webhooks (must come before express.json())
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// Regular middleware for other routes
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/users", require("./routes/users"));
app.use("/api/payments", require("./routes/payments"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get('/', (req, res) => {
   res.send('Welcome to my ecommerce platform backend.....')
})

// Serve frontend static files if available (built dist in ../frontened/dist)
const frontendDist = path.join(__dirname, "..", "frontened", "dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
