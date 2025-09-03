import React from 'react'
import './loadingcomponent.css'
const LoadingComponent = () => {
  return (
    <div className="loadingcom">
      {
        [1,2,3,4,5].map((item,index)=>{
          return(
            <div className="loading_div"></div>
          )
        })
      }
    </div>
  )
}

export default LoadingComponent
