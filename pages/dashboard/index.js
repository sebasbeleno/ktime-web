// pages/profile.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { msToTime } from "../../utils";

const MyResponsiveBar = dynamic(() => import("../../components//charts/bar"), {
  ssr: false,
});

const Dashboard = ({ user }) => {
  const [filesLogs, setFilesLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeSpendByLanguages, setTimeSpendByLanguages] = useState([]);

  useEffect(() => {
    getUserFileLogs();
  }, []);

  const getUserFileLogs = async () => {
    const { error, data } = await supabaseClient
      .from("files_logs")
      .select("*")
      .eq("sub", user.sub);

    console.log("data: ", data);
    console.log(getTimeSpendOnLanguageByDate(data));
    setFilesLogs(data);
    setLoading(false);
  };

  const getTimeSpendOnLanguageByDate = () => {
    // return array with objects of date and time spend on language
    const timeSpendByLanguage = filesLogs.reduce((acc, fileLog) => {
      const { language, time_spend, created_at } = fileLog;
      if (acc[language]) {
        acc[language] += time_spend;
        acc["date"] = created_at;
      } else {
        acc[language] = time_spend;
        acc["date"] = created_at;
      }
      return acc;
    }, {});

    console.log(timeSpendByLanguage);

    return Object.entries(timeSpendByLanguage).map(([language, time]) => {
      return {
        language,
        time: msToTime(time),
      };
    });
  };
  if (loading) {
    <Layout user={user}>
      <h1>loading...</h1>
    </Layout>;
  }

  const getTimeSpend = () => {
    const timespend = 0;

    filesLogs.map((file) => {
      timespend += file.time_spend;
    });

    return msToTime(timespend);
  };

  return (
    <Layout user={user}>
      <div className="container mx-auto">
        <div className="flex space-x-10">
          <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
            <h2 className="font-bold text-gray-600">Time coded all time</h2>
            <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
          </div>
        </div>
        <div className="h-96 my-10">
          <h1 className="text-xl font-bold text-gray-600">By languages</h1>
          <MyResponsiveBar />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
