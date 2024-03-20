// components/InterviewNotes.js
import React from "react";

const InterviewNotes = ({
  clientData,
  rows,
  updateCell,
  addRow,
  deleteRow,
  submitData,
  total,
  clientShareTotal,
  newLink,
  setNewLink,
  handleAddLink,
  links,
  handleSaveLink,
}) => {
  return (
    <div
      className="offcanvas offcanvas-start "
      data-bs-backdrop="static"
      tabIndex="-1"
      id="staticBackdrop"
      aria-labelledby="staticBackdropLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-center" id="staticBackdropLabel">
          Interview Notes
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="container">
          <div className="row">
            <div className="col p-0">
              {/* Add table and other elements for interview notes */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewNotes;
