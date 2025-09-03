import React, { useEffect, useState } from 'react'
import './unitereviews.css'
import { ReviewsData } from './data';
import Review from './Review/Review';
const UniteReviews = () => {
  const [reviews,setReviews]=useState([]);
  const getReviews=()=>{
    setReviews(ReviewsData)
  }
  useEffect(()=>{
    getReviews()
  },[])
  return (
    <div className='Unite_reviews_page'>
      {
        reviews&&reviews.length>0?(
          <div className="reviews">
            <div className="add_new_review">
              <input type="text" placeholder='Add New Comment' />
              <div className='pub_div_button'>
                <img src={require("../../../assets/send.png")} alt="" />
              </div>
            </div>
            {
                reviews?.map((item,index)=>{
                return <Review key={index} reviewData={item}/>
              })
            }
          </div>
        ):(
          <div className='empty_reviews'>
            <img src={require("../../../assets/empty.jpg")} alt="" />
            <h4>There Are not Any Reviews Until Now</h4>
          </div>
        )
      }
    </div>
  )
}

export default UniteReviews
