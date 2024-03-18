import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import { CSVLink } from "react-csv";

const App = () => {
  const [rows, setRows] = useState([["", "", "", ""]]);
  const [total, setTotal] = useState(0);
  const [clientShareTotal, setClientShareTotal] = useState(0);
  const [clientData, setClientData] = useState({
    ClientName: "",
    area: "",
    year: "",
    date: "",
  });

  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const inputNames = ["ClientName", "area", "date", "year"];

  const handleInputChange = (e, inputName) => {
    const { value } = e.target;
    setClientData((prevData) => ({
      ...prevData,
      [inputName]: value,
    }));
  };

  useEffect(() => {
    const data = localStorage.getItem("tableData");
    if (data) {
      setRows(JSON.parse(data));
    }

    const savedLinks = localStorage.getItem("links");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const handleAddLink = () => {
    let formattedLink = newLink.trim();
    if (!formattedLink.startsWith("http://")) {
      formattedLink = "http://" + formattedLink;
    }

    if (formattedLink === "http://") {
      alert("Please enter a valid link.");
    } else {
      setLinks([...links, formattedLink]);
      setNewLink("");
    }
  };

  const handleSaveLink = (link) => {
    window.open(link, "_blank");
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;

    if (colIndex === 2 || colIndex === 3) {
      const columnTotal = newRows.reduce((total, row) => {
        const cellValue = parseFloat(row[colIndex]);
        return isNaN(cellValue) ? total : total + cellValue;
      }, 0);

      if (colIndex === 2) {
        setTotal(columnTotal.toFixed(2));
      } else if (colIndex === 3) {
        setClientShareTotal(columnTotal.toFixed(2));
      }
    }

    setRows(newRows);
  };

  const addRow = () => {
    const newRow = ["", "", "", ""];
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = () => {
    if (rows.length > 0) {
      setRows((prevRows) => prevRows.slice(0, -1));
    }
  };

  const yearOptions = [
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
  ];

  const handleYearChange = (selectedOption) => {
    setClientData((prevData) => ({
      ...prevData,
      year: selectedOption.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditMode(false);
  };

  const submitData = () => {
    console.log("Submitting data:", rows);

    localStorage.setItem("tableData", JSON.stringify(rows));
    alert("Data is submit");
  };

  const csvData = [
    ["", "INTERVIEW", "NOTES", ""],
    [" ", "", "", " "],
    ["Description", "Ref", "Total", "Client share"],
    ...rows,
    ["Total", " ", total, clientShareTotal],
  ];

  return (
    <div className="container position-relative">
      <div className="row mt-5">
        <h1>Client Profile</h1>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis,
          sint!
        </p>
        <div className="col-12 mt-5">
          <div className="row col-12 gap-2 d-flex bg-light p-3 rounded justify-content-between">
            <div className="col-4 left d-flex flex-column justify-content-between p-0">
              <div className="name">
                <h1>{clientData.ClientName}</h1>
                <p>Developer</p>
                <p>Jnx@mail.com</p>
              </div>

              <button>
                {" "}
                <CSVLink
                  data={csvData}
                  className=" text-light "
                  onClick={() => {}}
                >
                  {" "}
                  Export Data{" "}
                </CSVLink>
              </button>
            </div>

            {/* Input section */}
            <div className="col-7 right   position-relative ">
              <span className="edit-btn fs-3">
                <button
                  className="btn   btn-warning edit"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </button>
                <button className="btn  btn-success" onClick={handleSubmit}>
                  Submit
                </button>
              </span>
              <form>
                <ul className="list-group">
                  {inputNames.map((inputName) => (
                    <li
                      key={inputName}
                      className="list-group-item d-flex justify-content-between align-items-center p-3"
                    >
                      {inputName.charAt(0).toUpperCase() + inputName.slice(1)}
                      <span className="">
                        {inputName === "year" ? (
                          <Select
                            options={yearOptions}
                            value={yearOptions.find(
                              (option) => option.value === clientData.year
                            )}
                            onChange={handleYearChange}
                            placeholder={`Select ${inputName}`}
                            isDisabled={!isEditMode}
                          />
                        ) : (
                          <input
                            type={inputName === "date" ? "date" : "text"}
                            value={clientData[inputName]}
                            onChange={(e) => handleInputChange(e, inputName)}
                            placeholder={`Enter ${inputName}`}
                            disabled={!isEditMode}
                          />
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </form>
            </div>
          </div>
          {/* Input section */}

          <div className="row col-12 mt-5 lower bg-light py-4 px-2">
            <div
              className="offcanvas offcanvas-start "
              data-bs-backdrop="static"
              tabIndex="-1"
              id="staticBackdrop"
              aria-labelledby="staticBackdropLabel"
            >
              <div className="offcanvas-header">
                <h5
                  className="offcanvas-title text-center"
                  id="staticBackdropLabel"
                >
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
                                  onChange={(e) =>
                                    updateCell(0, 0, e.target.value)
                                  }
                                  placeholder="Enter data"
                                />
                              </td>
                              <td>
                                <textarea
                                  value=""
                                  onChange={(e) =>
                                    updateCell(0, 1, e.target.value)
                                  }
                                  placeholder="Enter data"
                                />
                              </td>
                              <td>
                                <textarea
                                  value=""
                                  onChange={(e) =>
                                    updateCell(0, 2, e.target.value)
                                  }
                                  placeholder="Enter data"
                                />
                              </td>
                              <td>
                                <textarea
                                  value=""
                                  onChange={(e) =>
                                    updateCell(0, 3, e.target.value)
                                  }
                                  placeholder="Enter data"
                                />
                              </td>
                            </tr>
                          ) : (
                            rows.map((row, rowIndex) => (
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

                      <div className="d-flex gap-2 mt-5">
                        <button className="btn bg-primary" onClick={addRow}>
                          Add Row
                        </button>
                        <button
                          className="btn bg-danger py-0"
                          onClick={deleteRow}
                        >
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
              </div>
            </div>

            <div className="col btn gap-2 lower-btn">
              <button
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#staticBackdrop"
                aria-controls="staticBackdrop"
              >
                Create Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
