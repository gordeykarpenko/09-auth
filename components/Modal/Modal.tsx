"use client";
import { useEffect, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}
const Modal = ({ children, onClose }: ModalProps) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", fn);
    return () => {
      document.removeEventListener("keydown", fn);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);
  const click = (e: MouseEvent<HTMLDivElement>) =>
    e.target === e.currentTarget && onClose();
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={click}
    >
      <div className={css.modal}>{children}</div>
    </div>,
    document.body,
  );
};
export default Modal;
