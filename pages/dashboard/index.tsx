// pages/profile.js
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import dynamic from "next/dynamic";
import Layout from "../../components/layout";
import {
  getEffortByDay,
  getMostCodedLanguages,
  getMostCodedProjects,
  getTimeSpendByLanguages,
  msToTime,
  getTimeSpendByDay,
} from "../../utils";
import { useEffect, useState } from "react";
import PieChart from "../../components/charts/pie";
import CalendarChart from "../../components/charts/calendar";
import LineChart from "../../components/charts/line";


const Dashboard = (props) => {
  const [filesLogs, setFilesLogs] = useState([]);
  const [effortByDay, setEffortByDay] = useState([]);
  const [mostCodedLanguages, setMostCodedLanguages] = useState([]);
  const [mostCodedProjects, setMostCodedProjects] = useState([]);
  const [timeSpentOnLanguagesByDay, setTimeSpentOnLanguagesByDay] = useState(
    []
  );
  const [timeSpendByLanguages, setTimeSpendByLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/files/${props.user.sub}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { data } = await response.json();

      setFilesLogs(data);

      const effort = await getEffortByDay(data);
      const codedLanguages = await getMostCodedLanguages(data);
      const codedProjects = await getMostCodedProjects(data);
      const timeSpend = await getTimeSpendByLanguages(data);
      const timeSpendByDay = getTimeSpendByDay(data);

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

      return <LineChart data={timeSpentOnLanguagesByDay} />;
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
      return <PieChart data={timeSpendByLanguages} valueLabel="timeSpend" />;
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
      return <CalendarChart data={effortByDay} />;
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
        <div className="col-span-2 row-span-3 shadow-lg bg-white rounded-lg flex flex-col justify-center align-middle items-start">
          {RenderTimeByLanguageChart()}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withPageAuthRequired();

export default Dashboard;
