import { ResponsiveCalendar } from "@nivo/calendar";

const CaldendarChart = ({ data, keys, index }) => {
  return (
    <ResponsiveCalendar
      data={data}
      from="2022-01-02"
      to="2022-12-31"
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
    />
  );
};

export default CaldendarChart;
