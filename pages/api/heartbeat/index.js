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
        const query = await supabaseClient
          .from("user_logs")
          .select("*")
          .eq("sub", req.user.sub);

        if (query.data.length > 0) {
          // Update the files_logs and projects_logs json  array with the new data
          const filesLogs = query.data[0].files_logs;
          const projectsLogs = query.data[0].projects_logs;

          filesLogs.push(files);
          projectsLogs.push(projects);

          await supabaseClient
            .from("user_logs")
            .update({
              files_logs: filesLogs,
              projects_logs: projectsLogs,
            })
            .eq("sub", req.user.sub);

          res.status(200).send("updated");
        } else {
          const { data } = await supabaseClient.from("user_logs").insert({
            sub: req.user.sub,
            files_logs: [files],
            projects_logs: [projects],
          });

          res.status(200).send("inserted");
        }
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
