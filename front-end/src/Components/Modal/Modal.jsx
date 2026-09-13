import React, { useEffect, useContext } from "react";
import { ReferenceDataContext } from "../../Components/Context/referenceDataContext";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../Modal/Modal.css';

// A raw PDF/PPT/DOC URL embedded directly in an <iframe> relies on the
// browser's own viewer plugin, which iOS Safari renders inconsistently
// (often blank, and always without a toolbar or download button) -- the
// same reason the Google Drive-hosted MCA slides read fine while
// teacher-uploaded ones don't: Drive's /preview is Google's own viewer app,
// not the OS PDF plugin. Route every non-Drive file through that same
// Google viewer so PDFs, PPT/PPTX and DOC/DOCX/XLS/XLSX all get the
// identical toolbar, zoom and download behavior on every device.
const getViewerSrc = (fileUrl) => {
    if (!fileUrl) return fileUrl;
    if (fileUrl.includes('drive.google.com')) return fileUrl;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
};

const Modal = () => {
    const { url, modalTitle, showModal, setShowModal } = useContext(ReferenceDataContext);

    const clearModalData = () => {
        setShowModal(false);  // Close modal
    };

    useEffect(() => {
        // Prevent body scrolling when modal is open
        if (showModal) {
            document.body.style.position = 'fixed'; // Prevent background scroll
            document.body.style.top = `-${window.scrollY}px`; // Adjust top position
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1); // Restore scroll position
        }

        // Clean up on unmount
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
        };
    }, [showModal]);

    return (
        <div
            className={`modal fade ${showModal ? 'show d-block' : ''}`}
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden={!showModal}
            style={{ display: showModal ? 'block' : 'none' }}  // Show/Hide based on state
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {modalTitle}
                        </h5>
                        <button
                            type="button"
                            className="close-button"
                            aria-label="Close"
                            onClick={clearModalData}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <iframe
                            id="pdfSection"
                            width="100%"
                            height="100%"
                            title="pdfViewerFrame"
                            src={getViewerSrc(url)}
                        >
                            <p>Your browser does not support iframes.</p>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
