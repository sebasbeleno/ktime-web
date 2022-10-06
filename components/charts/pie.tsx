import { ResponsivePie } from "@nivo/pie";

const getTime = (hours) => {
  // if hours is less than 1, return the hours in minutes
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  // if hours is greater than 1, return the hours in hours
  if (hours > 1) {
    return `${Math.round(hours)}h`;
  }
};
const BarChar = ({ data, valueLabel }) => {
  console.log(data);
  return (
    <ResponsivePie
      data={data}
      value={valueLabel}
      margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
      innerRadius={0.55}
      cornerRadius={2}
      activeOuterRadiusOffset={8}
      colors={{ scheme: "blue_green" }}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 3]],
      }}
      tooltip={({ datum }) => (
        <div
          style={{
            background: "white",
            padding: "9px 12px",
            border: "1px solid #ccc",
          }}
        >
          <strong>{getTime(datum.value)}</strong>
        </div>
      )}
      arcLinkLabelsSkipAngle={20}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
    />
  );
};

export default BarChar;
