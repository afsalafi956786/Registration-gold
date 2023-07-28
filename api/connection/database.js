import mongoose from "mongoose";

async function connectDb(data) {
  try {
    await mongoose.connect(data, { dbName: "Goldsikka" });
    console.log("databse connected successfully");
  } catch (error) {
    console.log(error.message);
  }
}

export default connectDb;
