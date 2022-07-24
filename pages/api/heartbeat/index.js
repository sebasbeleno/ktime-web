import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import fetch from "node-fetch";
import { getFileBodyRequest } from "../../../utils";
import { runMiddleware } from "../../../utils/runMiddleware";

async function middleware(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`, {
      headers: {
        Authorization: `${token}`,
      },
    });

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

    const log = getFileBodyRequest(req);

    if (log) {
      try {
        const query = await supabaseClient.from("files_logs").insert(log);

        res.status(200).send("Logged");
      } catch (err) {
        res.status(500).send(err);
      }
    } else {
      res.status(400).send("No log provided");
    }
  } else {
    res.end();
  }
}
