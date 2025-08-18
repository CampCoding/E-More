import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "axios";
import { base_url } from "../../constants";
import { toast } from "react-toastify";
import { handleLogOut } from "../../App";
import { Loader } from "rsuite";
import { WhatsApp, subscripeIcon } from "./svg";
import Modal from "./modal";
import { showToogleTooltib } from "../../store/reducers/tooltibReducer";
import { useDispatch } from "react-redux";
import { decryptData } from '../../utils/decrypt';

const Subscribe = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [visible, setVisible] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const localData = localStorage.getItem("elmataryapp");
    const decryptedUserData = decryptData(localData);
    setUserData(decryptedUserData);
  }, []);

  const handleBuy = () => {
    if (userData == null) {
      toast.warn("يرجى التسجيل أولاً");
      return;
    }
    if (code == "") {
      toast.warn("أدخل الكود");
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
        if (res.data.status == "success") {
          toast.success(res.data.message);
          window.location.href = "/studentCourses";
        } else if (res.data.status == "error") {
          dispatch(showToogleTooltib());
          toast.error(res.data.message);
        } else if (res.data.status == "out") {
          localStorage.clear();

          // window.location.reload();
        }
      })
      .catch((e) => {
        console.log(e);
        dispatch(showToogleTooltib());
      })
      .finally(() => {
        setBuyLoading(false);
      });
  };
  const dispatchNotCode = () => {
    dispatch(showToogleTooltib());
    toast.error("أدخل كود مكون من 14 رقمًا");
  };
  return (
    <>
      <div class="wrapper-class">
        <div action="#" class="card-content-class">
          <div class="container-class">
            <div class="image-class">
              <i class="fas fa-envelope"></i>
            </div>
            <h1>الاشتراك</h1>
            <h1>انضم للدورات باستخدام كود الاشتراك</h1>
            {}
          </div>
          <div class="form-input-class">
            <input
              type="text"
              className="input-class !border-4 !border-gray-300 !rounded-md p-2 text-right" 
              placeholder="أدخل كود مكون من 14 رقمًا"
              maxLength={14}
              max={14}
              onKeyPress={(e) => {
                const charCode = e.which ? e.which : e.keyCode;
                if (charCode < 48 || charCode > 57) {
                  e.preventDefault();
                }
              }}
              onWheel={(e) => e?.target?.blur()}
              onChange={(e) => {
                const input = e.target.value;
                if (input.length <= 14) {
                  setCode(input); // إعادة تعيين القيمة فقط إذا لم يتجاوز الإدخال 14 حرفًا
                }
              }}
            />

            <br />

            <button
              class="subscribe-btn-class"
              style={{ margin: "30px 0" }}
              onClick={() =>
                buyLoading
                  ? null
                  : code?.length >= 14
                  ? handleBuy()
                  : dispatchNotCode()
              }
            >
              {buyLoading ? <Loader size="md" /> : "انضم الآن"}
            </button>
          </div>
          <p
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "17px",
              marginTop: "40px",
              justifyContent: "center",
              marginBottom: "0",
              flexWrap: "wrap"
            }}
          >
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 14px",
                border: "0.1px solid green",
                cursor: "pointer",

                justifyContent: "center",
                marginBottom: "0",
                borderRadius: "6px"
              }}
              className="greenHover"
              onClick={() =>
                window.open("https://wa.me/+201558899508", "_blanck")
              }
              role="button"
            >
              <span style={{ color: "green", marginBottom: "0" }}>
                +201558899508
              </span>{" "}
              <a
                style={{ fontSize: "23px" }}
                href="https://wa.me/+201558899508"
              >
                {WhatsApp}
              </a>
            </p>
            <span> إذا لم يكن لديك كود اشتراك،تواصل واتساب مع </span>
          </p>
        </div>
      </div>
      {}
    </>
  );
};

export default Subscribe;
