import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import React, { useEffect } from 'react';

type AddBookModalProps = {
  show: boolean;
  setShowAddBook: React.Dispatch<React.SetStateAction<boolean>>;
  setScannedBook: React.Dispatch<React.SetStateAction<string | undefined>>;
};
const AddBookModal = ({
  show,
  setShowAddBook,
  setScannedBook,
}: AddBookModalProps) => {
  function onScanSuccess(book: string) {
    setScannedBook(book);
    setShowAddBook(false);
  }
  function onScanFailure() {}
  useEffect(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13],
      },
      /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    return () => {
      html5QrcodeScanner.clear();
    };
  }, []);
  return (
    <>
      <div className="w-screen h-screen bg-[#000] absolute top-0 opacity-50"></div>
      <div className="absolute top-0 flex items-center justify-center w-screen h-screen">
        <div id="reader" className="bg-[#fff] w-[20rem]"></div>
      </div>
    </>
  );
};

export default AddBookModal;
