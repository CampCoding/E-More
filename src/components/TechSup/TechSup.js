import React, { useEffect, useState } from "react";
import "./techsup.css";
import {
  FaArrowRight,
  FaFacebook,
  FaPhoneAlt,
  FaWhatsapp
} from "react-icons/fa";
// import { getSups } from '../../pages/Profile/HelpCenter/functions/getSup'
import Skeleton from "react-loading-skeleton";
import { getSupsData } from "./functions/getSupsData";
import axios from "axios";
import { base_url } from "../../constants";
const TechSup = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const [sups, setSups] = useState(null);
  const getContacts = () => {
    axios.get(base_url + "/user/setting/select_call_center.php").then((res) => {
      setSups(res?.data?.message);
    });
  };
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="tech_sup_page">
      {}
      <div className="tecs_sup_socials">
        {pageLoading ? (
          <Skeleton count={7} />
        ) : (
          <>
            <div
              className="help_app"
              onClick={() => window.open(sups && sups[1].value, "_blanck")}
            >
              <a target="_blank" className="right">
                <FaFacebook />
                <h4>FaceBook</h4>
              </a>
              <FaArrowRight />
            </div>
            <div
              className="help_app"
              onClick={() => window.open(sups && sups[2].value, "_blanck")}
            >
              <a className="right">
                <FaWhatsapp />
                <h4>WhatsApp</h4>
              </a>
              <FaArrowRight />
            </div>
            {}
          </>
        )}
      </div>
    </div>
  );
};

export default TechSup;
