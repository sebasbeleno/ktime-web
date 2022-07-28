import { ResponsivePie } from "@nivo/pie";

const BarChar = ({ data, valueLabel }) => {
  return (
    <ResponsivePie
        data={data}
        value={valueLabel}
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        innerRadius={0.55}
        cornerRadius={2}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'blue_green' }}
        borderWidth={1}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '3'
                ]
            ]
        }}
        arcLinkLabelsSkipAngle={20}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    2
                ]
            ]
        }}
    />
  );
};

export default BarChar;
