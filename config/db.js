import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDb() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose
            .connect(`${process.env.MONGODB_URI}/quickcart`, opts)
            .then((mongoose) => mongoose.connection); // Ensure connection is returned
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDb;
