import mongoose from 'mongoose';

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

const normalizeMongoUri = (value) => {
  if (!value) return '';
  // Vercel env values may accidentally include quotes or leading/trailing spaces.
  return String(value).trim().replace(/^['\"]|['\"]$/g, '');
};

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const mongoUri = normalizeMongoUri(process.env.MONGODB_URI);

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing or empty in environment variables');
    }

    cached.promise = mongoose.connect(mongoUri);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};