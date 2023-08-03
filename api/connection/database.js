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



// import mongoose from "mongoose";

// async function connectDb(data) {
//   try {
//     await mongoose.connect(data,{
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("databse connected successfully");
//   } catch (error) {
//     console.log(error.message);
//   }
// }

// export default connectDb;