import React from 'react';

const ConsultationModal = ({ showModal, closeModal }) => {
    if (!showModal) return null; // Don't render modal if showModal is false

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-btn" onClick={closeModal}>X</button>
                <h2>Consultation Registration</h2>
                <form>
                    {/* Add form fields here */}
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email" required />
                    <textarea placeholder="Message" required></textarea>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ConsultationModal;
