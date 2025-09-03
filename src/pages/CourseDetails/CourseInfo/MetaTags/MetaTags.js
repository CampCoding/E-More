import React from 'react'
import './metatags.css'
const MetaTags = ({course}) => {
  return (
    <div className='metatags'>
      <h3>Content Titles</h3>
      <div className="metas">
        {
          course?.meta_tags?.map((item,index)=>{
            return (
              <h4>{item.name}</h4>
            )
          })
        }
      </div>
    </div>
  )
}

export default MetaTags
