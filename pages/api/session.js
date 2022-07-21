import { getAccessToken } from '@auth0/nextjs-auth0';
export default async function handler(req, res) {
  const session = await getAccessToken(req, res)

  console.log(session)
  res.end();
}
