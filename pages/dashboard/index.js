// pages/profile.js
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
import Layout from "../../components/layout";
import {
  getEffortByDay,
  getMostCodedLanguages,
  getMostCodedProjects,
  getTimeSpendByLanguages,
  getTimeSpentOnLanguagesByDay,
  msToTime,
  getTimeSpendByDay
} from "../../utils";
import { useEffect, useState } from "react";

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

const MyResponsiveLineChar = dynamic(
  () => import("../../components/charts/line"),
  {
    ssr: false,
  }
);

const Dashboard = (props) => {
  const [filesLogs, setFilesLogs] = useState([]);
  const [effortByDay, setEffortByDay] = useState([]);
  const [mostCodedLanguages, setMostCodedLanguages] = useState([]);
  const [mostCodedProjects, setMostCodedProjects] = useState([]);
  const [timeSpentOnLanguagesByDay, setTimeSpentOnLanguagesByDay] = useState(
    []
  );
  const [timeSpendByLanguages, setTimeSpendByLanguages] = useState([]);
  const [timeSpendByProjects, setTimeSpendByProjects] = useState([]);
  const [timeSpendByProjectsByDay, setTimeSpendByProjectsByDay] = useState([]);
  const [timeSpendByLanguagesByDay, setTimeSpendByLanguagesByDay] = useState(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(params) {
      const { error, data } = await supabaseClient
        .from("files_logs")
        .select("*")
        .eq("sub", props.user.sub);

      setFilesLogs(data);

      const effort = await getEffortByDay(data);
      const codedLanguages = await getMostCodedLanguages(data);
      const codedProjects = await getMostCodedProjects(data);
      const timeSpend = await getTimeSpendByLanguages(data);
      const timeSpendByDay =  getTimeSpendByDay(data);

      console.log();
      setEffortByDay(effort);
      setMostCodedLanguages(codedLanguages);
      setMostCodedProjects(codedProjects);
      setTimeSpendByLanguages(timeSpend);
      setTimeSpentOnLanguagesByDay(timeSpendByDay);
      setLoading(false);
    }

    fetchData();
  }, []);

  const getTimeSpend = () => {
    let timespend = 0;

    filesLogs.map((file) => {
      timespend += file.timeSpend;
    });

    return msToTime(timespend);
  };

  const RenderTimeByDateChart = () => {
    if (timeSpendByLanguages.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      const labels = [];

      timeSpentOnLanguagesByDay.forEach((date) => {
        const keys = Object.keys(date);

        keys.forEach((key) => {
          if (key == "date") {
            return;
          }

          if (!labels.includes(key)) {
            labels.push(key);
          }
        });
      });

      return (
        <MyResponsiveLineChar
          data={timeSpentOnLanguagesByDay}
          keyschar={labels}
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
    if (effortByDay.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return <MyResponsiveCalendar data={effortByDay} />;
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
        <h1 className="text-gray-400">Loading...</h1>
      </div>
    );
  }

  return (
    <Layout user={props.user}>
      <div className="container grid grid-cols-4 gap-4 grid-rows-6">
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Time coded all time</h2>
          <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most coded language</h2>
          <p className="text-2xl text-gray-500">
            {mostCodedLanguages[0].label}
          </p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most Code project</h2>
          <p className="text-2xl text-gray-500">{mostCodedProjects[0].label}</p>
        </div>
        {/* <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Streck</h2>
          <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
        </div> */}
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
