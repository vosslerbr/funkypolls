import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("NEW CONNECTION");
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI!, opts).then((mongoose) => {
      return mongoose;
    });

    console.log("Connected to MongoDB");
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
