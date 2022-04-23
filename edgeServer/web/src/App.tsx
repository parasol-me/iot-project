import { useState } from "react";
import styled from "styled-components";
import { addMinutes, subHours } from "date-fns/esm";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import { Charts } from "./components/charts";
import { gql, useMutation, useQuery } from "urql";

const AppWrapper = styled.div`
  overflow: hidden;
`;

const ControlRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background-color: white;
  align-items: center;
`;

const ControlItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;
`;

const SENSOR_TRIGGERS_QUERY = gql`
  query sensorTriggers {
    sensorTriggers {
      ldrMinThreshold
      tempMaxThreshold
    }
  }
`;

const SENSOR_TRIGGERS_MUTATION = gql`
  mutation editSensorTriggers($ldrMinThreshold: Int!, $tempMaxThreshold: Int!) {
    editSensorTriggers(
      ldrMinThreshold: $ldrMinThreshold
      tempMaxThreshold: $tempMaxThreshold
    ) {
      ldrMinThreshold
      tempMaxThreshold
    }
  }
`;

function App() {
  const [result] = useQuery({
    query: SENSOR_TRIGGERS_QUERY,
  });

  const [updateResult, updateSensorTriggers] = useMutation(SENSOR_TRIGGERS_MUTATION);

  const { data, fetching, error } = result;

  const [ldrMinThreshold, setLdrMinThreshold] = useState<number | undefined>(
    undefined
  );
  const [tempMaxThreshold, setTempMaxThreshold] = useState<number | undefined>(
    undefined
  );
  const [startTime, setStartTime] = useState(subHours(new Date(), 12));
  const [endTime, setEndTime] = useState(addMinutes(new Date(), 1));

  const [startTimeInput, setStartTimeInput] = useState(startTime);
  const [endTimeInput, setEndTimeInput] = useState(endTime);

  const ldrMinThresholdInput =
    ldrMinThreshold !== undefined
      ? ldrMinThreshold
      : (data?.sensorTriggers?.ldrMinThreshold as number | undefined);
  const tempMaxThresholdInput =
    tempMaxThreshold !== undefined
      ? tempMaxThreshold
      : (data?.sensorTriggers?.tempMaxThreshold as number | undefined);

  if (error) return <div>Error</div>;

  return (
    <AppWrapper>
      <ControlRow>
        <ControlItem>
          <DateTimeRangePicker
            value={[startTime, endTime]}
            onChange={(dateArray) => {
              setStartTime(dateArray?.[0] || new Date());
              setEndTime(dateArray?.[1] || new Date());
            }}
          />
        </ControlItem>
        <ControlItem>
          <label htmlFor="ldrMinThreshold" style={{ marginBottom: "0.25rem" }}>
            LDR min threshold
          </label>
          <input
            id="ldrMinThreshold"
            style={{ width: "50px" }}
            type="number"
            value={ldrMinThresholdInput || 0}
            onChange={(ev) =>
              setLdrMinThreshold(parseInt(ev.currentTarget.value))
            }
            disabled={fetching}
          />
        </ControlItem>
        <ControlItem>
          <label htmlFor="tempMaxThreshold" style={{ marginBottom: "0.25rem" }}>
            Tempurature max threshold
          </label>
          <input
            id="tempMaxThreshold"
            style={{ width: "50px" }}
            type="number"
            value={tempMaxThresholdInput || 0}
            onChange={(ev) =>
              setTempMaxThreshold(parseInt(ev.currentTarget.value))
            }
            disabled={fetching}
          />
        </ControlItem>
        <ControlItem>
          <button disabled={fetching || updateResult.fetching || ldrMinThresholdInput === undefined || tempMaxThresholdInput === undefined}
          onClick={() => {
            setStartTimeInput(startTime)
            setEndTimeInput(endTime)
            updateSensorTriggers({
              ldrMinThreshold: ldrMinThresholdInput,
              tempMaxThreshold: tempMaxThresholdInput
            })
          }}
          >Save</button>
        </ControlItem>
      </ControlRow>
      <Charts startTime={startTimeInput} endTime={endTimeInput}></Charts>
    </AppWrapper>
  );
}

export default App;
