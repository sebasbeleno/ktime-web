import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

// retrun the client
export default client;
