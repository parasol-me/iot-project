import React, { useState } from "react";
import { gql, useQuery } from "urql";
import styled from "styled-components";
import { format, formatISO, parseISO } from "date-fns";
import { Datum, LineSvgProps, ResponsiveLine } from "@nivo/line";
import { parse } from "path";
import { addMinutes, subHours } from "date-fns/esm";
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker";
import Charts from "./components/charts";

const AppWrapper = styled.div`
  overflow: hidden;
`;

const ControlRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background-color: white;
`;


function App() {
  const [startTime, setStartTime] = useState(subHours(new Date(), 12));
  const [endTime, setEndTime] = useState(addMinutes(new Date(), 1));

  return (
    <AppWrapper>
      <ControlRow>
        <DateTimeRangePicker 
          value={[startTime, endTime]} 
          onChange={(dateArray) => {
            setStartTime(dateArray?.[0] || new Date())
            setEndTime(dateArray?.[1] || new Date())
          }} />
          <button>
            Fetch
          </button>
      </ControlRow>
      <Charts startTime={startTime} endTime={endTime}></Charts>
    </AppWrapper>
  );
}

export default App;
