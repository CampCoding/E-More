import React, { useEffect } from "react";
import "./style.css";
function Modal({ open, children, toggle, headerTitle, onClose }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (onClose) {
        onClose(false);
      }
    }
  }, [open]);

  return (
    <>
      {open ? (
        <div className="model_container" style={{ overflow: "auto" }}>
          <div className="modal_overlay" onClick={() => toggle(false)}></div>
          <div className="C_modal">
            <div className="modal_header">
              <div className="header_text">
                <span> {headerTitle ? headerTitle : null}</span>
                <div
                  className="close_btn"
                  onClick={() => toggle(false)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="https://res.cloudinary.com/duovxefh6/image/upload/v1693603266/close_bphmao.png"
                    alt=""
                    width={"24px"}
                  />
                </div>
              </div>
            </div>
            <div className="modal_body">{children ? children : null}</div>
          </div>
        </div>
      ) : null}{" "}
    </>
  );
}

export default Modal;
