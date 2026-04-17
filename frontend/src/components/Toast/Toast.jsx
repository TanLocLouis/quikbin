import React, { useEffect } from "react";
import { createPortal } from "react-dom";

import "./Toast.css";

const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleCloseToast = () => {
    onClose();
  };

  return (
    <div onClick={handleCloseToast} className={`toast toast-${type}`}>
      <span className="toast-message">{message}</span>
    </div>
  )
};

export default Toast;
