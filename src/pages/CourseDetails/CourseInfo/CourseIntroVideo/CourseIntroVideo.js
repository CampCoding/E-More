import React, { useState, useEffect } from 'react';
import './courseintrovideo.css';
import { CiHeart, CiShare2 } from 'react-icons/ci';
import { MdOutlineAddShoppingCart } from 'react-icons/md';
import axios from 'axios';
import { base_url } from '../../../../constants';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { handleLogOut } from '../../../../App';
import { decryptData } from '../../../../utils/decrypt';

const CourseIntroVideo = ({ course, shadow, hide }) => {
  const [userData, setUserData] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, []);

  const handleBuy = () => {
    if (userData == null) {
      toast.warn('Please Register First');
      return;
    }
    if (code == '') {
      toast.warn('Enter Code');
      return;
    }
    setBuyLoading(true);
    const data_send = {
      code,
      student_id: userData?.student_id,
      token_value: userData?.token_value
    };
    axios
      .post(
        base_url + "/user/courses/subscribe_by_code.php",
        JSON.stringify(data_send)
      )
      .then(async (res) => {
        if (res.data.status == 'success') {
          toast.success(res.data.message);
          window.location.reload();
        } else if (res.data.status == 'error') {
          toast.error(res.data.message);
        } else if (res.data.status == 'out') {
          localStorage.clear();

          window.location.reload();
        }
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setBuyLoading(false);
      });
  };

  return (
    <div className="courseintrovideo">
      {}
      <div className={`${shadow} rounded-2 p-3`}>
        <h5
          className={`${hide} text-secondary my-3`}
          style={{
            // textAlign: 'center',
            fontSize: '25px',
            fontWeight: '600'
          }}
        >
          Subscribe to Get Course
        </h5>
        <div className="actions ">
          <button
            className= "btn mt-3 btn-primary w-100"
            onClick={() => {
              window.location.href = "/supscripe";
            }}
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseIntroVideo;
