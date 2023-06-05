import mongoose from "mongoose";

// Connect to the database

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI);
    con
      ? console.log("MongoDB Connected ")
      : console.log("DB not Connected. Try Again!");
  } catch (error) {
    console.log("Something went wrong");
  }
};

export default connectDb;
