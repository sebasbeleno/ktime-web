// pages/profile.js
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import dynamic from "next/dynamic";
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

const Dashboard = (props) => {
  const getTimeSpend = () => {
    let timespend = 0;

    props.filesLogs[0].files_logs.map((file) => {
      timespend += file.timeSpend;
    });

    return msToTime(timespend);
  };

  const RenderTimeByDateChart = () => {
    if (props.timeSpendByLanguages.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsiveBar
          data={props.timeSpentOnLanguagesByDay}
          keyschar={["python", "javascript", "css", "typescript"]}
          index="date"
        />
      );
    }
  };

  const RenderTimeByLanguageChart = () => {
    if (props.timeSpendByLanguages.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsivePie data={props.timeSpendByLanguages} valueLabel="timeSpend" />
      );
    }
  };

  const RenderCalendar = () => {
    if (props.effortByDay.length < 1) {
      return (
        <div className="h-64 flex justify-center items-center align-middle content-center m-auto">
          <h1 className="text-gray-400">Nothing to see here, yet</h1>
        </div>
      );
    } else {
      return (
        <MyResponsiveCalendar data={props.effortByDay} />
      );
    }
  };

  return (
    <Layout user={props.user}>
      <div className="container grid grid-cols-4 gap-4 grid-rows-6">
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Time coded all time</h2>
          <p className="text-2xl text-gray-500">{getTimeSpend()}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most coded language</h2>
          <p className="text-2xl text-gray-500">{props.mostCodedLanguages[0].label}</p>
        </div>
        <div className="shadow-lg bg-white pl-5 pr-20 py-5 rounded-lg flex flex-col justify-center align-middle items-start">
          <h2 className="font-bold text-gray-600">Most Code project</h2>
          <p className="text-2xl text-gray-500">{props.mostCodedProjects[0].label}</p>
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

export const getServerSideProps = withPageAuthRequired({
  returnTo: "/",
  async getServerSideProps(ctx) {
    // access the user session
    const session = getSession(ctx.req, ctx.res);

    const { error, data } = await supabaseClient
      .from("user_logs")
      .select("*")
      .eq("sub", session.user.sub);

    const effort = await getEffortByDay(data[0].files_logs);
    const codedLanguages = await getMostCodedLanguages(data[0].files_logs);
    const codedProjects = await getMostCodedProjects(data[0].files_logs);
    const timeSpend = await getTimeSpendByLanguages(data[0].files_logs);
    const timeSpendByDay = await getTimeSpentOnLanguagesByDay(
      data[0].files_logs
    );

    return {
      props: {
        user: session.user,
        effortByDay: effort,
        mostCodedLanguages: codedLanguages,
        mostCodedProjects: codedProjects,
        timeSpendByLanguages: timeSpend,
        timeSpentOnLanguagesByDay: timeSpendByDay,
        filesLogs: data,
      },
    };
  },
});

export default Dashboard;