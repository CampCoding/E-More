import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  arrowChat,
  arrowDown,
  secondWhatsApp,
} from "../../pages/subscribe/svg";
import {
  hideToogleTooltib,
  toogleTooltib,
} from "../../store/reducers/tooltibReducer";
import "./FloatingActionButton.css"; // تأكد من إنشاء ملف CSS مطابق

const FloatingActionButton = () => {
  const [WhatsAppCntact, setWhatsAppContact] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef();
  const isTooltipVisible = useSelector((state) => state?.tooltib?.visible);
  useEffect(() => {
    if (isTooltipVisible && ref.current) {
      ref.current.play();
    }
  }, [isTooltipVisible]);

  return (
    <a href="https://api.whatsapp.com/send/?phone=201102300955&text&type=phone_number&app_absent=0" target="_blank" className="floating-action-button-container">
      <div
        className="action-button"
      
      >
        {WhatsAppCntact ? arrowDown : secondWhatsApp}
      </div>
    </a>
  );
};

export default FloatingActionButton;
