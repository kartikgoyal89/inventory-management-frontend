import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onClose,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Please wait..." : confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-sm text-gray-600">{message}</p>
  </Modal>
);

export default ConfirmDialog;
