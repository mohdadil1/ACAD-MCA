import React, { Fragment, useContext } from "react";
import '../Cards/Card.css';

import { ReferenceDataContext } from '../../../../Context/referenceDataContext';

const Cards = (props) => {
    const { setUrl, setModalTitle, setShowModal } = useContext(ReferenceDataContext);

    return (
        <Fragment>
            <div className="card flex flex-col min-w-0 relative bg-white border border-gray-200 rounded-md break-words max-w-[300px] w-full sm:flex-1">
                <div className="card-body flex flex-col flex-1 min-h-0 p-5">
                <h2 className="text-xl sm:text-2xl font-medium leading-tight mb-3 font-sans">{props.heading}</h2>
                <p className="text-[#212529] text-base font-sans mb-4">{props.title}</p>

                    <button
                        type="button"
                        className="bg-blue-500 border border-blue-500 text-white font-medium text-base leading-6 py-2 px-4 rounded-md transition-colors duration-150 ease-in-out select-none mt-auto self-start"
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
