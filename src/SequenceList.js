import React from "react";
import styles from "./css/SequenceList.module.css";

// List whose items correspond to the user-selected datapoints 
function SequenceList({ selectedData, selectedDataCount }) {

  return (

    <div className={styles['container']}>
      {/* If the number of items is greater than 10, show how many items selected. */}
      {selectedDataCount > 10 ? 
        <div className={styles['listTitleContainer']}>
          <span className={styles['listTitle']}>Nucleotide Sequences</span>
          <span className={styles['numOfSequences']}>{`Showing 10 of ${selectedDataCount} sequences`}</span>
        </div>
        :
        <div className={styles['listTitleContainer']}>
          <span className={styles['listTitle']}>Nucleotide Sequences</span>
        </div>
      } 
      <ul>
       <li key={0} className={styles['columnHeaderContainer']}>
         <span className={styles['columnLabelId']}>ID</span>
         <span className={styles['columnLabelSequence']}>CDR3 Nucleotide Sequence</span>
       </li>
       {selectedData.map((datumObject)=>
       <div className={`${styles["listItemContainer"]}`}>
        <span className={`${styles["listItemAccent"]}`}>&nbsp;</span>
        <li key={datumObject['id']} className={`${styles["listItem"]}`}>
          {/* Display ID */}

          <span className={styles['dataId']} >{datumObject['id']}</span>
          {/* Display CD3 Nucleotides (if available) */}
      
          {datumObject['CDR3 Nucleotides'] ? <span className={styles['sequence']} >{datumObject['CDR3 Nucleotides']}</span> : <span className={styles['unavailable']}>( No sequence collected )</span>}
        </li>
       </div>)
       }
       {selectedData.length === 0 ? <li className={styles['noneSelected']}>( No sequences selected )</li> : null}
      </ul>
    </div>

  );
}

export default SequenceList;
