type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onRequestClose: () => void;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
};
export function Modal({
  children,
  isOpen,
  onRequestClose,
  onAfterClose,
  onAfterOpen,
}: Props) {
  if (!isOpen) return null;
  if (isOpen && onAfterOpen) onAfterOpen();
  return (
    <div className="modal fixed top-0 left-0 w-full h-full z-40 grid place-items-center">
      <div className="modal-content w-full">
        {isOpen && (
          <div
            className="modal-overlay absolute top-0 left-0 w-full h-full bg-black opacity-50"
            onClick={() => {
              onRequestClose();
              if (onAfterClose) {
                onAfterClose();
              }
            }}
          ></div>
        )}
        {isOpen && (
          <div className="modal-container relative z-50 top-0">
            <button className="absolute top-0 right-0">x</button>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
