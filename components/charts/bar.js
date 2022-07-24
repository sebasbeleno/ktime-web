import { ResponsiveBar } from "@nivo/bar";

export const data = [
  {
    created_at: "2022-07-23",
    python: 5,
    javascript: 6,
  },
  {
    created_at: "2022-07-24",
    python: 2,
    javascript: 8,
    css: 1,
  },
  {
    created_at: "2022-07-2",
    python: 3,
    javascript: 8,
    css: 1.3,
  },
];
const BarChar = () => {
  return (
    <ResponsiveBar
      data={data}
      keys={["python", "javascript", "css"]}
      indexBy="created_at"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "blue_green" }}
      borderColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      axisTop={null}
      axisRight={null}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "time spent",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.4]],
      }}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      label={(value) => `${value.value} ${value.value > 1 ? "hours" : "hour"}`}
      role="application"
      ariaLabel="Nivo bar chart demo"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
};

export default BarChar;
