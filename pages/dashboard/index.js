// pages/profile.js
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Layout from "../../components/layout";

const Dashboard = ({ user }) => {
  return (
    <Layout user={user}>
      <h1>Welcome back!</h1>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired()

export default Dashboard;