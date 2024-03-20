import { useState, useEffect } from "react";
import Select from "react-select";
import "./App.css";
import { CSVLink } from "react-csv";
import MainContents from "./components/MainContents";

const App = () => {
  const [rows, setRows] = useState([["", "", "", ""]]);
  const [total, setTotal] = useState(0);
  const [clientShareTotal, setClientShareTotal] = useState(0);
  const [clientData, setClientData] = useState({
    ClientName: "",
    area: "",
    year: "2024",
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

  // console.log();

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
                            value={ yearOptions.find(
                              (option) => option.value === clientData.year
                            )}
                            onChange={handleYearChange}
                            placeholder={`Select ${inputName}`}
                            // isDisabled={!isEditMode}
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

          <MainContents
          selectedYear={clientData.year}
            rows={rows}
            total={total}
            clientShareTotal={clientShareTotal}
            clientData={clientData}
            setRows={setRows}
            setTotal={setTotal}
            setClientShareTotal={setClientShareTotal}
            handleInputChange={handleInputChange}
            updateCell={updateCell}
            addRow={addRow}
            deleteRow={deleteRow}
            submitData={submitData}
            newLink={newLink}
            setNewLink={setNewLink}
            links={links}
            handleAddLink={handleAddLink}
            handleSaveLink={handleSaveLink}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
