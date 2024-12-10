import React from 'react'
import { useParams } from 'react-router-dom';

const PredictionDetails :React.FC= () => {
  const { crop } = useParams();
  return (
    <div>PredictionDetails</div>
  )
}

export default PredictionDetails