import mongoose from "mongoose";

let gridfsBucket = null;

const connectGridFS = () => {
  if (!gridfsBucket) {
    gridfsBucket = new mongoose.mongo.GridFSBucket(
      mongoose.connection.db,
      { bucketName: "pdfs" }
    );
    console.log("✅ GridFS Bucket Ready");
  }
  return gridfsBucket;
};

export default connectGridFS;