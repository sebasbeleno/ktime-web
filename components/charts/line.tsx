import React from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";

const MyResponsiveLine = ({ data }) => {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      axisTop={{
        format: (value) => moment(value).format("MMM DD"),
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Date",
        legendOffset: -36,
        legendPosition: "middle",
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Last 7 days",
        legendOffset: 36,
        legendPosition: "middle",
        format: (value) => moment(value).format("MMM DD"),
        tickValues: "every 2 days",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Hours",
        legendOffset: -40,
        legendPosition: "middle",
        format: (value) => `${value}h`,
        tickValues: 5,
      }}
      pointSize={10}
      colors={{ scheme: "paired" }}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      enableSlices="x"
    />
  );
};

export default MyResponsiveLine;
