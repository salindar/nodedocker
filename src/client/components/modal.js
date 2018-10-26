import React, { Component } from 'react';
import '../styles/app.css';

const Modal = ({ handleClose, show, children }) => {
    return (
        //   <div className={show ? "modal display-block" : "modal display-none"}>
        //     <section className="modal-main">
        //       {children}
        //       <button onClick={handleClose}>close</button>
        //     </section>
        //   </div>
        <div className="modal-wrapper">
            <div className="modal">
                <button className="close" >&times;</button>
                <div className="text">{'text'}</div>
            </div>
        </div>

        //<div class="w3-container">

        //     <div id="id01" className={show ? "w3-modal display-block" : "w3-modal display-none"}>
        //         <div class="w3-modal-content">
        //             <div class="w3-container">
        //                 <p>Some text. Some text. Some text.</p>
        //                 <p>Some text. Some text. Some text.</p>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};
export default Modal;