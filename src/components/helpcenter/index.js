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
    <div
      className="floating-action-button-container"
      onClick={() => {
        setWhatsAppContact(!WhatsAppCntact);
        dispatch(hideToogleTooltib());
      }}
    >
      <div
        onClick={() => {
          setWhatsAppContact((prev) => !WhatsAppCntact);
          dispatch(hideToogleTooltib());
        }}
        className={
          isTooltipVisible
            ? "tooltip tootlTibvisible tooltip-visible"
            : " tooltip"
        }
      >
        need help ?
      </div>
      <audio
        src={require("../../assets/mixkit-correct-answer-tone-2870.wav")}
        ref={ref}
      ></audio>
      <div
        onClick={() => {
          window.open("https://wa.me/+201558899508", "_blanck");
          setWhatsAppContact(false);
        }}
        className={
          WhatsAppCntact
            ? "tooltip whtsContact tooltip-visible"
            : "tooltip whtsContact"
        }
      >
        <img
          class="wa-chat-box-brand"
          onerror="https://cdn.clare.ai/wati/images/WATI_logo_square_2.png"
          src="https://cdn.clare.ai/wati/images/WATI_logo_square_2.png"
          width={52}
          height={52}
          alt=""
        ></img>
        <div class="wa-chat-box-content-chat-welcome">
          Hi there!
          <br />
          How can I help you?
        </div>
        <div
          className="wh_chat"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <div className="intrnalButton">
            <div className="">{secondWhatsApp}</div>
            <span style={{ color: "white" }}>Chat With Us</span>{" "}
          </div>
          {arrowChat}
        </div>
      </div>
      <div
        className="action-button"
        onClick={() => {
          setWhatsAppContact((prev) => !WhatsAppCntact);
        }}
      >
        {WhatsAppCntact ? arrowDown : secondWhatsApp}
      </div>
    </div>
  );
};

export default FloatingActionButton;
