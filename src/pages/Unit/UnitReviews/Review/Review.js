import React, { useState } from 'react'
import './review.css'
import { Axios } from '../../../../components/axios'
import { toast } from 'react-toastify'
const Review = ({reviewData}) => {
  const {review,user_data}=reviewData
  const [reviews,setReviews]=useState([]);
  const [pageLoading,setPageLoading]=useState(false)
  const getCourseReviews=()=>{
    Axios({
      method: 'POST',
      // url: BASE_URL + BASES_ROUTES?.admin + API_ROUTES?.pdf?.BASE_ROUTE + API_ROUTES?.pdf?.ROUTES?.select,
  })
      .then((res) => {
          if (res.status == 'success') {
            setReviews(res.message);
          } else {
              toast.error(res.message);
          }
      })
      .finally(() => {
          setPageLoading(false);
      });
  }
  return (
    <div className='review'>
      <div className="left">
        <img src={user_data.image} alt="" />
      </div>
      <div className="right">
        <h4>{user_data.user_name}</h4>
        <p>{review}</p>
      </div>
    </div>
  )
}

export default Review
