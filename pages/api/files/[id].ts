import client from "../../../mongo";
import { MongoEnums } from "../../../utils/enums";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      query: { id },
    } = req;

    try {
      // Connect to the MongoDB cluster
      await client.connect();

      // Make the appropriate DB calls
      const database = client.db(MongoEnums.DATABASE);
      const collection = database.collection(MongoEnums.FILES_COLLECTION);

      const files = await collection.find({ sub: id }).toArray();

      res.status(200).json({
        data: files,
        message: "Files retrieved successfully",
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
