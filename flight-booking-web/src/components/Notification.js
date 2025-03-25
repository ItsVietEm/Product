import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const Notification = ({
  show,
  onClose,
  title,
  message,
  variant = "primary",
  delay = 3000,
}) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast show={show} onClose={onClose} delay={delay} autohide bg={variant}>
        <Toast.Header closeButton>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification;
