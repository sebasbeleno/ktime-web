import { ResponsiveCalendar } from "@nivo/calendar";
import moment from "moment";

const firstDayOfCurrentYear = new Date(new Date().getFullYear(), 0, 1);
const lastDayOfCurrentYear = new Date(new Date().getFullYear(), 11, 31);

const roundHours = (hours) => {
  return Math.round(hours * 10) / 10;
};

// use moment
const forMatDay = (day) => {
  return moment(day).format("MMM DD");
};

const CaldendarChart = ({ data }) => {
  return (
    <ResponsiveCalendar
      data={data}
      from={firstDayOfCurrentYear}
      to={lastDayOfCurrentYear}
      emptyColor="#eeeeee"
      colors={["#d4ffe3", "#80ffab", "#2aff73", "#00d448"]}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={60}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
      legends={[
        {
          anchor: "bottom-right",
          direction: "row",
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: "right-to-left",
        },
      ]}
      tooltip={({ day, value }) => (
        <div className="bg-white">
          <strong className="p-5 rounded-sm shadow-sm">
            {forMatDay(day)} - {roundHours(value)}h
          </strong>
        </div>
      )}
    />
  );
};

export default CaldendarChart;
