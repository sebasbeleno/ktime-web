import fetch from "node-fetch";
import { getFileBodyRequest } from "../../../utils";
import { runMiddleware } from "../../../utils/runMiddleware";
import client from "../../../mongo";
import { MongoEnums } from "../../../utils/enums";

async function middleware(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const response = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      req.user = data;
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).send("No token provided");
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    await runMiddleware(req, res, middleware);

    const { files, projects } = getFileBodyRequest(req);

    if (files && projects) {
      try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        const database = client.db(MongoEnums.DATABASE);

        const projectsCollection = database.collection(
          MongoEnums.PROJECTS_COLLECTION
        );

        const filesCollection = database.collection(
          MongoEnums.FILES_COLLECTION
        );

        // insert in the projects collection with the user id
        const projectsInsert = await projectsCollection.insertOne(projects);

        // insert in the files collection with the user id
        const filesInsert = await filesCollection.insertOne(files);

        res.status(200).json({
          projects: projectsInsert,
          files: filesInsert,
        });
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
      }
    } else {
      res.status(400).send("No log provided");
    }
  } else {
    res.end();
  }
}
