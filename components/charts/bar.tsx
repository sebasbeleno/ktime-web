import { ResponsiveBar } from "@nivo/bar";

const BarChar = ({ data, keyschar, index }) => {
  console.log(data);
  return (
    <ResponsiveBar
      data={data}
      keys={keyschar}
      indexBy={index}
      margin={{ top: 10, right: 50, bottom: 80, left: 70 }}
      padding={0.5}
      valueScale={{ type: "band" }}
      indexScale={{ type: "band", round: true}}
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
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 120,
          translateY: 60,
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
