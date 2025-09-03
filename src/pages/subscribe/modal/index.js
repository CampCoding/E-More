import React, { useEffect } from 'react';
import './style.css';

const Modal = ({ visible, onClose, onOk, onCancel, title, children }) => {
  const handleMaskClick = (e) => {
    if (e.target === e.currentTarget) {
      return onClose ? onClose(false) : null;
    }
  };

  const handleOkClick = () => {
    onOk && onOk();
  };

  const handleCancelClick = () => {
    onCancel && onCancel();
  };
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [visible]);
  return (
    <div
      className={`modal ${visible ? 'show' : 'hide'}`}
      onClick={handleMaskClick}
    >
      <div className={`modal-content ${visible ? 'fadeIn' : 'fadeOut'}`}>
        {title ? (
          <span className="close" onClick={() => onClose(false)}>
            &times;
          </span>
        ) : null}
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
        <div className="modal-actions">
          {onOk && <button onClick={handleOkClick}>Ok</button>}
          {onCancel && <button onClick={handleCancelClick}>Cancel</button>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
