export const prepareData = (data) => {
 
  let preparedData = data;

  // Recursively flatten objects
  const flattenObject = (obj) => {
    const flattened = {};
  
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        Object.assign(flattened, flattenObject(obj[key]));
      } else {
        flattened[key] = obj[key];
      }
    });
  
    return flattened;
  };

  // Function to strip properties which are not necessary for the visualisation.
  const stripProperties = (obj) => {
    const stripped = {};

    // console.log(Object.keys(obj));
    Object.keys(obj).forEach((key) => {
      // (Hardcoded for now)
      if (typeof obj[key] === "number" && obj[key] !== null && key !== 'spaceId' && key !== 'collectionId' && key !== 'cloneId') {
        stripped[key] = obj[key];
      } else if (key === "CDR3 Nucleotides") {
        stripped[key] = obj[key];
      }
    });
  
    return stripped;
  }

  // -- Parse 'tags' JSON --
  const parseTags = (data) => {
    const parsedData =  data;
    // Iterate through data object
    for (const datum in parsedData) {
      for (const key in data[datum]) {
        // Where we find the 'tags' key, parse the associated JSON
        if (key === "tags") {
          parsedData[datum][key] = JSON.parse(
            parsedData[datum][key]
          );
        }
      }
    }

    return parsedData
  }
  
  // Parse the JSON at the 'tags' property
  preparedData = parseTags(preparedData);

  // Convert to array 
  preparedData = Object.values(preparedData)
    // Flatten objects
    .map((obj) => flattenObject(obj))
    
    // Strip unnecessary data to improve performance
  preparedData = Object.values(preparedData)
    .map((obj)=>stripProperties(obj))

  
  return preparedData

}

