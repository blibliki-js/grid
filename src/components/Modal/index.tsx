import { ReactNode } from "react";
import PropTypes from "prop-types";
import { Box, Modal as MuiModal } from "@mui/material";

import { close as _close } from "./modalSlice";
import { useAppDispatch, useAppSelector } from "hooks";

export { open, close } from "./modalSlice";
export { default as TriggerModal } from "./TriggerModal";

interface ModalProps {
  children: ReactNode;
  modalName: string;
  className?: string;
  onClose?: Function;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Modal(props: ModalProps) {
  const { children, modalName, className, onClose } = props;

  const dispatch = useAppDispatch();
  const { isOpen, modalName: currentModalName } = useAppSelector(
    (state) => state.modal
  );

  if (currentModalName !== modalName) return null;

  const close = () => {
    dispatch(_close(modalName));
    onClose && onClose();
  };

  return (
    <MuiModal
      className={className}
      open={isOpen}
      onClose={close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </MuiModal>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  modalName: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
};
