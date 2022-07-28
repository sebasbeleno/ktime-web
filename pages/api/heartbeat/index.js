import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import fetch from "node-fetch";
import { getFileBodyRequest } from "../../../utils";
import { runMiddleware } from "../../../utils/runMiddleware";

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
        const { data, error } = await supabaseClient
          .from("files_logs")
          .insert(files);
        const { data: data2, error: error2 } = await supabaseClient
          .from("projects_logs")
          .insert(projects);

        if (error || error2) {
          res.status(500).send(error || error2);
        } else {
          res.status(200).send("Success");
        }
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
