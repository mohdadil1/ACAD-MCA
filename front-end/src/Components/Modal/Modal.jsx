import React, { useContext } from "react";
import { ReferenceDataContext } from "../../Components/Context/referenceDataContext";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../Modal/Modal.css';

const Modal = () => {
    const { url, modalTitle, showModal, setShowModal } = useContext(ReferenceDataContext);

    const clearModalData = () => {
        setShowModal(false);  // Close modal
    };

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
                            height="500"
                            title="pdfViewerFrame"
                            src={url}
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
