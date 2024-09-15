import React, { Fragment, useContext } from "react";
import '../Cards/Card.css';
import'../../../../UI/Card/Card'

import { ReferenceDataContext } from '../../../../Context/referenceDataContext';

const Cards = (props) => {
    const { setUrl, setModalTitle, setShowModal } = useContext(ReferenceDataContext);

    return (
        <Fragment>
            <div className="card">
                <div className="card-body p-5 d-flex flex-column">
                <h2 className="text-[2rem] font-medium leading-tight mb-3 font-sans">{props.heading}</h2>
                <p className="text-[#212529] text-base font-sans mb-4">{props.title}</p>

                    <button
                        type="button"
                        className="bg-blue-500 border border-blue-500 text-white font-medium text-base leading-6 py-2 px-4 rounded-md transition-colors duration-150 ease-in-out select-none mt-auto"
                        onClick={() => {
                            setUrl(props.url);
                            setModalTitle(props.title);
                            setShowModal(true);  // Show modal
                        }}
                    >
                        Read
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default Cards;
