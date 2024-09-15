import React from 'react';
import { TailSpin } from 'react-loader-spinner';


const Spinner = () => (
  <div className="loading-wrapper">
    <TailSpin
      height="80"
      width="80"
      color="#3498db"
      ariaLabel="loading"
    />
  </div>
);

export default Spinner;