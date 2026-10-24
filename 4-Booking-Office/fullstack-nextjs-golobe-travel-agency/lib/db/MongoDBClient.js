import { MongoClient, ServerApiVersion } from "mongodb";

let clientPromise;

if (!process.env.MONGODB_URI) {
  clientPromise = Promise.resolve({});
} else {
  const uri = process.env.MONGODB_URI;
  const options = {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };

  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global;
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    clientPromise = globalWithMongo._mongoClient.connect().catch(() => ({}));
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client.connect().catch(() => ({}));
  }
}

export default clientPromise;
