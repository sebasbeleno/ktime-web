// pages/profile.js
import {
  getServerSidePropsWrapper,
  getSession,
  useUser
} from "@auth0/nextjs-auth0";
import Layout from "../../components/layout";

const Dashboard = (props) => {
  const { user, isLoading, error } = useUser();

  return (
    <Layout user={user}>
      <h1>Your access token is: {props.user.accessToken}</h1>
    </Layout>
  );
};

export const getServerSideProps = getServerSidePropsWrapper(async (ctx) => {
  const session = getSession(ctx.req, ctx.res);
  if (session) {
    return {
      props: {
        user: {
          id: session.user.sub,
          name: session.user.name,
          accessToken: session.accessToken,
        },
      },
    };
  } else {
    ctx.res.writeHead(302, {
      Location: "/",
    });
    ctx.res.end();
  }
});

export default Dashboard;
