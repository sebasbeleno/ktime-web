// pages/profile.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import {
  getEffortByDay, getMostCodedLanguages, getMostCodedProjects, getTimeSpendByLanguages,
  getTimeSpentOnLanguagesByDay,
  msToTime
} from "../../utils";

const MyResponsiveBar = dynamic(() => import("../../components/charts/bar"), {
  ssr: false,
});

const MyResponsivePie = dynamic(() => import("../../components/charts/pie"), {
  ssr: false,
});

const MyResponsiveCalendar = dynamic(
  () => import("../../components/charts/calendar"),
  {
    ssr: false,
  }
);

const Dashboard = ({ user }) => {
  const [filesLogs, setFilesLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeSpendByLanguages, setTimeSpendByLanguages] = useState([]);
  const [timeSpentOnLanguagesByDate, setTimeSpentOnLanguagesByDate] = useState(
    []
  );
  const [effortBydate, setEffortBydate] = useState([]);
  const [mostCodedlanguages, setMostCodedlanguages] = useState([]);
  const [mostCodedProjects, setMostCodedProjects] = useState([]);

  useEffect(() => {
    const getUserFileLogs = async () => {
      const { error, data } = await supabaseClient
        .from("user_logs")
        .select("*")
        .eq("sub", user.sub);

      setFilesLogs(data);

      if (data.length > 0) {
        const timeSpendByLanguages = await getTimeSpendByLanguages(
          data[0].files_logs
        );

        const timeSpentOnLanguagesByDay = await getTimeSpentOnLanguagesByDay(
          data[0].files_logs
        );

        const effortByDay = await getEffortByDay(data[0].files_logs);

        const mostCodedlanguages = await getMostCodedLanguages(
          data[0].files_logs
        );

        const mostCodedProjects = await getMostCodedProjects(
          data[0].files_logs
        );

        setEffortBydate(effortByDay);
        setTimeSpendByLanguages(timeSpendByLanguages);
        setTimeSpentOnLanguagesByDate(timeSpentOnLanguagesByDay);
        setMostCodedlanguages(mostCodedlanguages);
        setMostCodedProjects(mostCodedProjects);

        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    getUserFileLogs();
  }, [user]);

  if (loading) {
    return (
      <Layout user={user}>
        <h1>loading...</h1>
      </Layout>
    );
  }

  const getTimeSpend = () => {
    const timespend = 0;

    filesLogs[0].files_logs.map((file) => {
      timespend += file.timeSpend;
    });

    return msToTime(timespend);
  };

  const RenderTimeByDateChart = () => {
    console.log(timeSpendByLanguages.length);
    if (timeSpendByLanguages.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsiveBar
          data={timeSpentOnLanguagesByDate}
          keyschar={["python", "javascript", "css", "typescript"]}
          index="date"
        />
      );
    }
  };

  const RenderTimeByLanguageChart = () => {
    if (timeSpendByLanguages.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsivePie data={timeSpendByLanguages} valueLabel="timeSpend" />
      );
    }
  };

  const RenderCalendar = () => {
    if (effortBydate.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsiveCalendar data={effortBydate} />
      );
    }
  };

  return (
    <Layout user={user}>
      <div className="container grid grid-cols-4 gap-4 grid-rows-6">
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Time coded all time</h2>
          <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most coded language</h2>
          <p className="text-2xl text-gray-500">{mostCodedlanguages[0].label}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most Code project</h2>
          <p className="text-2xl text-gray-500">{mostCodedProjects[0].label}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Streck</h2>
          <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
        </div>
        <div className="col-span-4 row-span-3 shadow-lg bg-white rounded-lg justify-center align-middle items-start">
          {RenderCalendar()}
        </div>
        <div className="col-span-2 row-span-3 shadow-lg bg-white rounded-lg flex flex-col justify-center align-middle items-start">
          {RenderTimeByDateChart()}
        </div>
        <div className="col-span-1 row-span-3 shadow-lg bg-white rounded-lg flex flex-col justify-center align-middle items-start">
          {RenderTimeByLanguageChart()}
        </div>
        <div className="col-span-1 row-span-3 shadow-lg bg-white rounded-lg flex flex-col justify-center align-middle items-start">
          {RenderTimeByLanguageChart()}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
