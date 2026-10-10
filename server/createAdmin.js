const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const db = mongoose.connection.db;
    const users = db.collection("users");

    const existingAdmin = await users.findOne({
      email: "admin@dumkibasbazar.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@12345",
      12
    );

    await users.insertOne({
      name: "Dumkibas Bazar Admin",
      email: "admin@dumkibasbazar.com",
      phone: "9800000000",
      address: "Dumkibas, Nawalpur",
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Admin created successfully");
    console.log("Email: admin@dumkibasbazar.com");
    console.log("Password: Admin@12345");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();