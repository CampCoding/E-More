import React, { useEffect, useState } from 'react'
import './cart.css'
import { coursesData } from '../Home/Courses/data';
import CartCourse from './CartCourse';
import { MetaTags, pageMetaTags } from '../../utils/metaTags';
// import {course}
const Cart = () => {
  const [courses, setCourses] = useState([]);
  const getCartPRoducts = () => {
    setCourses(coursesData);
  }
  useEffect(() => {
    getCartPRoducts()
  }, [])
  return (
    <>
      <MetaTags {...pageMetaTags.cart} />
      <div className='cart_page'>
        <div className="cart_content">
          <div className="left">
            {courses.map((item, index) => {
              return (
                <CartCourse key={index} course={item} />
              )
            })}
          </div>
          <div className="right">
            <div>
              <h4>Total</h4>
              <p>0 LE</p>
            </div>
            <div>
              <h4>Discount</h4>
              <p>0 LE</p>
            </div>
            <div>
              <h4>Final</h4>
              <p>0 LE</p>
            </div>
            <h4>DisCount Code</h4>
            <div>
              <input type="text" />
              <img src={require("../../assets/true.png")} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
