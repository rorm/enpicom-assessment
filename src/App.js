import React, { useEffect, useState } from "react";
import ScatterPlot from "./ScatterPlot";
import AxesPicker from "./AxesPicker";
import SequenceList from "./SequenceList";
import { prepareData } from "./prepareData";
import { useData } from "./useData";
import logo from './images/logo.png';
import logout from './images/logout.svg';
import "./App.css";

function App() {
  // Store data as delivered from endpoint.
  const data = useData("https://raw.githubusercontent.com/rorm/enpicomJSON/main/enpicomdata.json");
  // Store pared-down version of data to work with for marginal performance increase.
  const [preparedData, setPreparedData] = useState(null)
  // Keep track of which sequences have been selected.
  const [selectedData, setSelectedData] = useState(()=>[]);

  const [selectedDataCount, setSelectedDataCount] = useState(0); 

  // Keep track of which tags have been selected for visualisation
  const [selectedXValue, setSelectedXValue] = useState("Receptor Average Quality");
  const [selectedYValue, setSelectedYValue] = useState("V Score");

  // If 'raw' data has arrived, send it off to be pared down.
  useEffect(()=>{
    data && setPreparedData(prepareData(data))
  },[data])

  return (
    <div className={'container'}>
      {/* IGX platform-style visuals */}
      <div className={'headerToolbar'}> 
        <div className={'title'}>CDR3 Amino Acids</div>
      </div>
      <div className={'appToolbar'}>
        <img className={'logoutIcon'} src={logout} alt="Logout"/>
      </div>
      <div className={'logoContainer'}>
        <img className={'logo'} src={logo} alt="IGX Logo"/>
      </div>
      <div className={'workspaceContainer'}>
      {/* Data ready for display? Display. Otherwise, show loading... */}
        {preparedData ? 
          <>
            <ScatterPlot 
              data={preparedData} 
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              selectedDataCount={selectedDataCount}
              setSelectedDataCount={setSelectedDataCount} 
              selectedXValue={selectedXValue} 
              selectedYValue={selectedYValue}
            />
            <AxesPicker 
              selectedXValue={selectedXValue} 
              selectedYValue={selectedYValue}
              setSelectedXValue={setSelectedXValue}
              setSelectedYValue={setSelectedYValue}
              setSelectedData={setSelectedData}
            />
            <SequenceList 
              selectedData={selectedData}
              selectedDataCount={selectedDataCount}
            />
          </>
          : <span className={'loading'}>Loading data...</span>
        }
      </div>
    </div>
  );
}

export default App;
