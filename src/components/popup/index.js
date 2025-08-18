import React, { useEffect } from 'react';
import './style.css';

const PopUp = ({ title, open, setOpen, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [open]);
  if (!open) return null;

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div>
      <div
        className={`modalOverlay ${open ? 'open' : ''}`}
        onClick={closeModal}
      ></div>
      <div className={`modalContainer ${open ? 'open' : ''}`}>
        <div className="modalHeader">
          <span className="modalTitle">{title}</span>
          <span className="exitModal" onClick={closeModal}>
          <i class="fa-solid text-dark bg-secondary-subtle p-2 rounded-5 fa-xmark"></i>
          </span>
        </div>
        <div className="modalChildren">{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
