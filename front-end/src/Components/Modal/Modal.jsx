import React, { useEffect, useContext } from "react";
import { ReferenceDataContext } from "../../Components/Context/referenceDataContext";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../Modal/Modal.css';

// Browsers have no built-in renderer for Office document formats (unlike
// PDF, which Chrome/Firefox/Edge all render natively) -- route those
// through Microsoft's free, no-signup Office Online Viewer, which can
// render any publicly reachable .ppt/.pptx/.doc/.docx/.xls/.xlsx inline.
const OFFICE_EXTENSIONS = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'];

const getViewerSrc = (fileUrl) => {
    if (!fileUrl) return fileUrl;
    const ext = fileUrl.split('?')[0].split('.').pop().toLowerCase();
    if (OFFICE_EXTENSIONS.includes(ext)) {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    }
    return fileUrl;
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
