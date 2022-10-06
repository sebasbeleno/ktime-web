import React from "react";
import { ResponsiveLine } from "@nivo/line";
import moment from "moment";
const isOddDay = (value) => moment(value).dayOfYear() % 2 == 0;

const MyResponsiveLine = ({ data }) => (
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
    axisTop={null}
    axisRight={null}
    axisLeft={{
      orient: "left",
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Hours",
      legendOffset: -40,
      legendPosition: "middle",
    }}
    axisBottom={{
      format: function (value) {
        return isOddDay(value) ? moment(value).format("MMM Do") : "";
      },
      tickSize: function (value) {
        return isOddDay(value) ? 5 : 0;
      },
    }}
    pointSize={10}
    colors={{ scheme: "paired" }}
    pointColor={{ theme: "background" }}
    pointBorderWidth={2}
    pointBorderColor={{ from: "serieColor" }}
    pointLabelYOffset={-12}
    useMesh={true}
  />
);

export default MyResponsiveLine;
