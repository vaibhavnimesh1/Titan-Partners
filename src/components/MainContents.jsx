import { useEffect, useState } from "react";
// import Select from "react-select";
// import { CSVLink } from "react-csv";
import RTI from "./RTI";

const MainContents = ({
  rows,
  total,
  clientShareTotal,
  clientData,

  updateCell,
  addRow,
  deleteRow,
  submitData,
  newLink,
  setNewLink,
  links,
  handleAddLink,
  handleSaveLink,
  selectedYear,
}) => {
  const [showRTIData, setShowRTIData] = useState(false);
  const [showInterviewNotes, setShowInterviewNotes] = useState(true);

  const toggleRTIData = () => {
    setShowRTIData(true);
    setShowInterviewNotes(false);
  };

  const toggleInterviewNotes = () => {
    setShowRTIData(false);
    setShowInterviewNotes(true);
  };

  useEffect(() => {
    console.log("Selected year changed:", selectedYear);
  }, [selectedYear]);

  return (
    <div className="row col-12 mt-5 lower bg-light py-4 px-2 ">
      <div
        className="offcanvas offcanvas-start "
        data-bs-backdrop="static"
        tabIndex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-center" id="staticBackdropLabel">
            {showRTIData ? "RTI Data" : "Interview Notes"}
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {showRTIData ? (
            <div>
              <RTI selectedYear={selectedYear} submitData={submitData} />
            </div>
          ) : (
            <div className="container">
              <div className="row">
                <div className="col p-0">
                  <table className="table upper col-12">
                    <thead className="col-3">
                      <tr>
                        <th scope="col">Client :</th>
                        <td scope="col">{clientData.ClientName}</td>
                        <th scope="col">Schedule Ref</th>
                        <td scope="col">B</td>
                      </tr>
                    </thead>
                    <tbody className="col-9">
                      <tr className="col-3">
                        <th scope="row">Area :</th>
                        <td>{clientData.area}</td>
                        <th>Staff Member</th>
                        <td>No</td>
                      </tr>
                      <tr className="col-3">
                        <th scope="row">Year :</th>
                        <td>{clientData.year}</td>
                        <th>Manager Review</th>
                        <td>No</td>
                      </tr>
                      <tr className="col-3">
                        <th scope="row">Date :</th>
                        <td>{clientData.date}</td>
                        <th>Partner Review</th>
                        <td colSpan="2">No</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* inner-table-data */}

                  <table className="col-12 add-section">
                    <thead className="col-12">
                      <tr>
                        <th colSpan="1">Description</th>
                        <th>Ref</th>
                        <th>Total</th>
                        <th>Client share</th>
                      </tr>
                    </thead>
                    <tbody className="col-12 data-body">
                      {rows.length === 0 ? (
                        <tr>
                          <td>
                            <textarea
                              value=""
                              onChange={(e) => updateCell(0, 0, e.target.value)}
                              placeholder="Enter data"
                            />
                          </td>
                          <td>
                            <textarea
                              value=""
                              onChange={(e) => updateCell(0, 1, e.target.value)}
                              placeholder="Enter data"
                            />
                          </td>
                          <td>
                            <textarea
                              value=""
                              onChange={(e) => updateCell(0, 2, e.target.value)}
                              placeholder="Enter data"
                            />
                          </td>
                          <td>
                            <textarea
                              value=""
                              onChange={(e) => updateCell(0, 3, e.target.value)}
                              placeholder="Enter data"
                            />
                          </td>
                        </tr>
                      ) : (
                        rows?.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((data, colIndex) => (
                              <td key={colIndex} className="p-0">
                                <textarea
                                  value={data}
                                  onChange={(e) =>
                                    updateCell(
                                      rowIndex,
                                      colIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter data"
                                />
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2">Total</td>
                        <td>{total}</td>
                        <td>{clientShareTotal}</td>
                      </tr>
                    </tfoot>
                  </table>

                  {/* inner-table-data */}

                  <div className="d-flex gap-2 mt-5">
                    <button className="btn bg-primary" onClick={addRow}>
                      Add Row
                    </button>
                    <button className="btn bg-danger py-0" onClick={deleteRow}>
                      Delete Row
                    </button>
                    <button
                      className="btn bg-warning py-0"
                      onClick={submitData}
                    >
                      Submit Data
                    </button>

                    <div className="d-flex gap-2  link-add ">
                      <input
                        type="text"
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        placeholder="Enter link"
                      />
                      <button
                        className="btn bg-success"
                        onClick={handleAddLink}
                      >
                        Save Link
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  {links.map((link, index) => (
                    <button
                      key={index}
                      className="btn btn-primary me-2 mb-2"
                      onClick={() => handleSaveLink(link)}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="col btn  gx-4  lower-btn">
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#staticBackdrop"
          aria-controls="staticBackdrop"
          className=" m-2 "
          onClick={toggleInterviewNotes}
        >
          Create Interview
        </button>
        <button
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#staticBackdrop"
          aria-controls="staticBackdrop"
          className=" m-2 "
          onClick={toggleRTIData}
        >
          RTI
        </button>
      </div>
    </div>
  );
};

export default MainContents;
