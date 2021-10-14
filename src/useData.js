import { useState, useEffect } from "react";

export const useData = (url) => {
  const [data, setData] = useState(null);

  // On hook init, collect data & hold in state.
  useEffect(() => {
    fetch(
      url
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, [url]);
 
  return data && data
};
