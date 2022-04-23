import { gql, useQuery } from "urql";
import styled from "styled-components";
import { parseISO } from "date-fns";
import { Datum, LineSvgProps, ResponsiveLine } from "@nivo/line";
import React from "react";
import _ from "lodash";

const ChartsWrapper = styled.div`
  overflow: hidden;
`;

const LineChartWrapper = styled.div`
  height: 50vh;
`;

const StatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
  align-items: center;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 1rem;
`;

const AggregateRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  align-items: center;
`;

const AggregateItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 1rem;
`;

const SENSOR_DATA_QUERY = gql`
  query allSensorData($start: DateTime!, $end: DateTime!) {
    allSensorData(filters: { dateTimeLte: $end, dateTimeGte: $start }) {
      edges {
        node {
          id
          dateTime
          ldrAnalogVoltage
          humidityPercentage
          tempuratureCelcius
          heatIndexCelcius
        }
      }
    }
  }
`;

interface SensorDataNode {
  id: string;
  dateTime: string;
  ldrAnalogVoltage: string;
  humidityPercentage: string;
  tempuratureCelcius: string;
  heatIndexCelcius: string;
}

interface SensorDataEdge {
  node: SensorDataNode;
}

const commonProperties: LineSvgProps = {
  data: [],
  margin: { top: 20, right: 85, bottom: 40, left: 80 },
  animate: true,
  xFormat: "time:%H:%M:%S",
  xScale: {
    type: "time",
    format: "native",
    precision: "second",
  },
  yScale: {
    type: "linear",
  },
  axisBottom: {
    format: "%H:%M:%S",
    legend: "time",
    legendOffset: -12,
  },
  enablePoints: false,
  useMesh: true,
  enableSlices: false,
  colors: { scheme: "dark2" },
  theme: { background: "#282c34", textColor: "rgb(141, 156, 171)" },
};

interface Props {
  startTime: Date;
  endTime: Date;
}

function ChartsComponent(props: Props) {
  const { startTime, endTime } = props;

  const [result] = useQuery({
    query: SENSOR_DATA_QUERY,
    variables: {
      start: startTime,
      end: endTime,
    },
  });
  const { data, fetching, error } = result;

  if (fetching) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  const sensorData = data.allSensorData.edges as SensorDataEdge[];

  return (
    <ChartsWrapper>
      <StatusRow>
        <StatusItem>
          <h2 style={{ color: "white" }}>LDR Voltage</h2>
          <h1 style={{ color: "white", margin: 0 }}>{`${
            sensorData[sensorData.length - 1].node.ldrAnalogVoltage
          }/1023`}</h1>
        </StatusItem>
        <StatusItem>
          <h2 style={{ color: "white" }}>Humidity</h2>
          <h1 style={{ color: "white", margin: 0 }}>{`${
            sensorData[sensorData.length - 1].node.humidityPercentage
          }%`}</h1>
        </StatusItem>
        <StatusItem>
          <h2 style={{ color: "white" }}>Tempurature</h2>
          <h1 style={{ color: "white", margin: 0 }}>{`${
            sensorData[sensorData.length - 1].node.tempuratureCelcius
          }°C`}</h1>
        </StatusItem>
        <StatusItem>
          <h2 style={{ color: "white" }}>Heat Index</h2>
          <h1 style={{ color: "white", margin: 0 }}>{`${
            sensorData[sensorData.length - 1].node.heatIndexCelcius
          }°C`}</h1>
        </StatusItem>
      </StatusRow>
      <AggregateRow>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Average</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${_.meanBy(
            sensorData,
            (edge) => parseInt(edge.node.ldrAnalogVoltage)
          ).toFixed(2)}`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Min</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.minBy(sensorData, (edge) => parseInt(edge.node.ldrAnalogVoltage))
              ?.node.ldrAnalogVoltage
          }`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Max</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.maxBy(sensorData, (edge) => parseInt(edge.node.ldrAnalogVoltage))
              ?.node.ldrAnalogVoltage
          }`}</h3>
        </AggregateItem>
      </AggregateRow>
      <LineChartWrapper>
        <ResponsiveLine
          {...commonProperties}
          data={[
            {
              id: "LDR",
              data: sensorData.map((edge) => {
                const node = edge.node;
                return {
                  x: parseISO(node.dateTime),
                  y: node.ldrAnalogVoltage,
                } as Datum;
              }),
            },
          ]}
          axisLeft={{
            legend: "LDR voltage",
            legendOffset: 12,
          }}
        />
      </LineChartWrapper>
      <AggregateRow>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Average</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${_.meanBy(
            sensorData.filter(
              (edge) => edge.node.humidityPercentage !== " NAN"
            ),
            (edge) => parseFloat(edge.node.humidityPercentage)
          ).toFixed(2)}%`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Min</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.minBy(
              sensorData.filter(
                (edge) => edge.node.humidityPercentage !== " NAN"
              ),
              (edge) => parseFloat(edge.node.humidityPercentage)
            )?.node.humidityPercentage
          }%`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Max</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.maxBy(
              sensorData.filter(
                (edge) => edge.node.humidityPercentage !== " NAN"
              ),
              (edge) => parseFloat(edge.node.humidityPercentage)
            )?.node.humidityPercentage
          }%`}</h3>
        </AggregateItem>
      </AggregateRow>
      <LineChartWrapper>
        <ResponsiveLine
          {...commonProperties}
          data={[
            {
              id: "humidity",
              data: sensorData
                .filter((edge) => edge.node.humidityPercentage !== " NAN")
                .map((edge) => {
                  const node = edge.node;
                  return {
                    x: parseISO(node.dateTime),
                    y: node.humidityPercentage,
                  } as Datum;
                }),
            },
          ]}
          axisLeft={{
            legend: "Humidity %",
            legendOffset: 12,
          }}
        />
      </LineChartWrapper>
      <AggregateRow>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Average</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${_.meanBy(
            sensorData.filter(
              (edge) => edge.node.tempuratureCelcius !== " NAN"
            ),
            (edge) => parseFloat(edge.node.tempuratureCelcius)
          ).toFixed(2)}°C`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Min</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.minBy(
              sensorData.filter(
                (edge) => edge.node.tempuratureCelcius !== " NAN"
              ),
              (edge) => parseFloat(edge.node.tempuratureCelcius)
            )?.node.tempuratureCelcius
          }°C`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Max</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.maxBy(
              sensorData.filter(
                (edge) => edge.node.tempuratureCelcius !== " NAN"
              ),
              (edge) => parseFloat(edge.node.tempuratureCelcius)
            )?.node.tempuratureCelcius
          }°C`}</h3>
        </AggregateItem>
      </AggregateRow>
      <AggregateRow>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Average</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${_.meanBy(
            sensorData.filter(
              (edge) => edge.node.heatIndexCelcius !== " NAN"
            ),
            (edge) => parseFloat(edge.node.heatIndexCelcius)
          ).toFixed(2)}°C`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Min</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.minBy(
              sensorData.filter(
                (edge) => edge.node.heatIndexCelcius !== " NAN"
              ),
              (edge) => parseFloat(edge.node.heatIndexCelcius)
            )?.node.heatIndexCelcius
          }°C`}</h3>
        </AggregateItem>
        <AggregateItem>
          <h4 style={{ color: "white" }}>Max</h4>
          <h3 style={{ color: "white", margin: 0 }}>{`${
            _.maxBy(
              sensorData.filter(
                (edge) => edge.node.heatIndexCelcius !== " NAN"
              ),
              (edge) => parseFloat(edge.node.heatIndexCelcius)
            )?.node.heatIndexCelcius
          }°C`}</h3>
        </AggregateItem>
      </AggregateRow>
      <LineChartWrapper>
        <ResponsiveLine
          {...commonProperties}
          data={[
            {
              id: "Tempurature",
              data: sensorData
                .filter((edge) => edge.node.tempuratureCelcius !== " NAN")
                .map((edge) => {
                  const node = edge.node;
                  return {
                    x: parseISO(node.dateTime),
                    y: node.tempuratureCelcius,
                  } as Datum;
                }),
            },
            {
              id: "Heat Index",
              data: sensorData
                .filter((edge) => edge.node.heatIndexCelcius !== " NAN")
                .map((edge) => {
                  const node = edge.node;
                  return {
                    x: parseISO(node.dateTime),
                    y: node.heatIndexCelcius,
                  } as Datum;
                }),
            },
          ]}
          axisLeft={{
            legend: "Tempurature C",
            legendOffset: 12,
          }}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: -40,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </LineChartWrapper>
    </ChartsWrapper>
  );
}

export const Charts = React.memo(ChartsComponent);
