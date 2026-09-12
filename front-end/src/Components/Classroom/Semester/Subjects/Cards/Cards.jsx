import React, { Fragment, useContext } from "react";
import '../Cards/Card.css';

import { ReferenceDataContext } from '../../../../Context/referenceDataContext';

const Cards = (props) => {
    const { setUrl, setModalTitle, setShowModal } = useContext(ReferenceDataContext);

    return (
        <Fragment>
            <div className="card group flex flex-col min-w-0 relative bg-white border border-gray-100 rounded-xl shadow-md shadow-gray-200/60 hover:shadow-xl hover:shadow-brand-200/40 hover:-translate-y-1 transition-all duration-200 break-words max-w-[300px] w-full sm:flex-1 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 to-cyan-400" />
                <div className="card-body flex flex-col flex-1 min-h-0 p-5">
                <h2 className="text-xl sm:text-2xl font-medium leading-tight mb-3 font-sans text-gray-800">{props.heading}</h2>
                <p className="text-gray-600 text-base font-sans mb-4">{props.title}</p>

                    <button
                        type="button"
                        className="bg-brand-500 border border-brand-500 text-white font-medium text-base leading-6 py-2 px-4 rounded-full transition-colors duration-150 ease-in-out select-none mt-auto self-start hover:bg-brand-600"
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
