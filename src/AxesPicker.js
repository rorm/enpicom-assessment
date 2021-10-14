import React, {useState} from "react";
import styles from "./css/AxesPicker.module.css";

// Axes dropdown menus.
function AxesPicker({ selectedXValue, selectedYValue, setSelectedXValue, setSelectedYValue, setSelectedData }) {
  
  // Hardcoded for the timebeing, later will be derived programmatically.
  const [plottableTags] = useState(["J Score", "V Score", "Read Count", "Sequence Count", "Receptor Average Quality"])

  const handleXChange = (e) => {
    setSelectedXValue(e.target.value);
  };

  const handleYChange = (e) => {
    setSelectedYValue(e.target.value);
  }; 

  const handleInvertAxes = () => {
    setSelectedData([]);
    setSelectedXValue(selectedYValue);
    setSelectedYValue(selectedXValue);
  }

  return (
    <>
      <div className={`${styles['container']} ${styles['x']}`}>
          <select value={selectedXValue} onChange={handleXChange}>
            {/* Don't allow user to plot the same tag against itself. */}
            {plottableTags.map((tag)=>tag !== selectedYValue && <option value={tag}>{tag}</option> )}
          </select>
      </div>
      <div className={`${styles['container']} ${styles['y']}`}>
        <select value={selectedYValue} onChange={handleYChange}>
          {plottableTags.map((tag)=>tag !== selectedXValue && <option value={tag}>{tag}</option> )}
        </select>
      </div>
      <div >
        <button onClick={handleInvertAxes} className={`${styles['button']}`}>Invert Axes</button>
      </div>
    </>
  );
}

export default AxesPicker;
