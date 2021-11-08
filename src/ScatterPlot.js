import React, { useRef, useEffect, useState } from "react";
import {
  select,
  scaleLinear,
  extent,
  axisBottom,
  axisLeft,
  brush,
} from "d3";
import useResizeObserver from "./useResizeObserver";
import styles from './css/ScatterPlot.module.css'

function ScatterPlot({ data, setSelectedData, setSelectedDataCount, selectedXValue, selectedYValue }) {
  // Reference to the svg element so that D3 can handle it
  const svgRef = useRef();
  const containerRef = useRef();
  // Hook I found that keeps track of container size using new ResizeObserver browser API
  const dimensions = useResizeObserver(containerRef);
  // Keep track of user selected region as provided by D3's brush() selection event
  const [selection, setSelection] = useState([[null,null],[null,null]]); 

  // On mount, then on any change to data, resize or selection
  useEffect(() => {
    // Keep a ref to svg so that D3 can handle it
    const svg = select(svgRef.current);
    // 
    const { width, height } =
      dimensions || containerRef.current.getBoundingClientRect();

    // Calculate x & y values and scales  
    const xValue = (datumObject) => {
      return datumObject[selectedXValue];
    };

    const xScale = scaleLinear()
      // returns [minValue, maxValue] based on the data
      .domain(extent(data, xValue)) 
      .range([0, width]).nice();
    

    const yValue = (datumObject) => {
      return datumObject[selectedYValue];
    };
      
    const yScale = scaleLinear()
      .domain(extent(data, yValue))
      .range([height, 0]).nice();

    // 3rd visualised dimension hardcoded as 'J Score' for now
    const zValue = (datumObject) => {
      return datumObject['J Score'];
    };

    // Take in a value and return an rgb value between yellow and red.
    const zScale = scaleLinear()
      // Find min and max values from data set
      .domain(extent(data, zValue))
      .range(['rgb(59, 120, 175)', 'rgb(255, 73, 73)'])


    // Check whether a datapoint falls within the user selected area.
    const isSelected = (datumObject) => {
      const datumPixelPositionX = xScale(datumObject[selectedXValue]);
      const datumPixelPositionY = yScale(datumObject[selectedYValue]);
      if (
        datumPixelPositionX >= selection[0][0] 
        && datumPixelPositionX <= selection[1][0]
        && datumPixelPositionY >= selection[0][1]
        && datumPixelPositionY <= selection[1][1]
        ) 
      {
        return true;
      } 
      else {
        return false;
      }
    }

    // Let D3 handle DOM updates for the graph itself.
    // Map the data to svg 'points'
    svg
    // Select all datapoints
      .selectAll(".datapoint")
      // Sync them with the provided data
      .data(data)
      .join("circle")
      // Apply the 'datapoint' class for styling
      .attr("class", "datapoint")
      // Apply a 'selected' class if selected
      .attr("class", (datumObject) => 
        isSelected(datumObject) ? 'datapoint selected' : 'datapoint'
      )
      // Enlarge radius if selected
      .attr("r", (datumObject) =>
      isSelected(datumObject) ? 5 : 2.7
      )
      // J score is plotted on a 3rd 'axis' from red to blue
      // *Note* Some datapoints do not have a J Score. They will appear black by default.
      .attr('fill', (datumObject) => {
        const color = zScale(datumObject['J Score'])
        return color
      })
      // Provide x pixel position
      .attr("cx", (datumObject) => {
        const datumPixelPositionX = xScale(datumObject[selectedXValue]);
        return datumPixelPositionX
      })
      // Provide y pixel position
      .attr("cy", (datumObject) => {
        const datumPixelPositionY = yScale(datumObject[selectedYValue]);
        return datumPixelPositionY
      })
      
      
      // Get selected points and store the first 10 of them in state.
      svg
      // Select all the selected datapoints (as determined by their class)
        .selectAll(".selected")
        // For each associated datum object          
        .each((datumObject, index)=>{
        
          // Keep track of number of points selected (to be able to show
          // user how many sequences are selected)
          setSelectedDataCount((previousState) => previousState + 1)
          
          // If this is one of the first 10 objects in the selection to be
          // iterated over, store it in selectedData (for display in the 
          // SequenceList list)
          // This is to meet requirement 1.1.5. Storing all selected points 
          // comes at a very significant performance cost (about 3000ms+
          // vs. 500ms in a casual benchmark)
          if (index < 10) {
            setSelectedData((previousState)=> [...previousState, datumObject])
            // NOTE: D3 appears to automatically order the collection of objects by
            // their id property, meaning that if you select all the data points,
            // the same 10 pieces of data will always be pushed into selectedData
            // (and will show up in the SequenceList list.)
          } 

        })  

      
    // Configure & mount the axes
    // X axis
    const xAxis = axisBottom(xScale);
    svg
    .select(".x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
    
    // Y axis
    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);


    // Configure & mount the brush
    const selectionBrush = brush()
      // Define brushable region (all of the graph)
      .extent([
        [0, 0],
        [width, height],
      ])
      // Handle the brush event to keep track of the selection. 
      .on("start", (event) => {
        // New selection is being made, so init the selectedDataCount
        // and selectedData state
        setSelectedDataCount(0)
        setSelectedData([])
        // If the selection isn't null...
        if (event.selection) {
          setSelection(event.selection);
        }
      })
      // Only watching start and end events for performance reasons
      // Perhaps if I had used canvas this would not be necessary.
      .on("end", (event) => {
          setSelectedDataCount(0)
        if (event.selection) {
          setSelection(event.selection);
        }
      });

      // Mount the brush
      svg.select(".selectionBrush").call(selectionBrush);
    
  }, [data, setSelectedData, setSelectedDataCount, dimensions, selection, selectedXValue, selectedYValue]);

  return (
      <div ref={containerRef} className={styles['container']} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
          <g className="selectionBrush" />
        </svg>
      </div>
  );
}

export default ScatterPlot;
