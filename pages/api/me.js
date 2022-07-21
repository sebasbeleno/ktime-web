// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader) {
    res.status(401).send({ user: null });

    return;
  }

  const token = authHeader.split(" ")[1];

  console.log(token);
  if (!token) {
    res.status(401).send({ user: null });

    return;
  }

  let userId = "";

  try {
    const payload = jwt.verify(token, process.env.SUPABASE_SIGNING_SECRET);
    userId = payload.userId;
  } catch (err) {
    res.status(401).send({ user: null });
    return;
  }

  if (!userId) {
    res.status(401).send({ user: null });
    return;
  }

  // TODO: Send user data to client
  res.send({ user: { id: userId } });
}
