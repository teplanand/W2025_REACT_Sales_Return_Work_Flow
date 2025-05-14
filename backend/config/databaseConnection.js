// import mongoose from "mongoose";

// const connectDB= async()=>{

// mongoose.connection.on('connected',()=>{
//     console.log('db connected');
// })
//     await mongoose.connect(`${process.env.MONGODB_URI}/fashion-store`)
// }

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('DB connected');
    });

    // Connect to MongoDB (using the connection string from .env)
    await mongoose.connect(process.env.MONGODB_URI + "/fashion-store", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

export default connectDB;
