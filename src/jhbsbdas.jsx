import React, { useEffect, useState } from "react";

const jhbsbdas = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("tableData");
    if (data) {
      setRows(JSON.parse(data));
    }
  }, []);

  const updateCell = (rowIndex, colIndex, value) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const addRow = () => {
    const newRow = [" ", " ", " ", " "];
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = () => {
    if (rows.length > 0) {
      setRows((prevRows) => prevRows.slice(0, -1));
    }
  };

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(rows));
  }, [rows]);
  return (
    <div>
      <table className="col-12">
        <thead className="col-12">
          <tr>
            <th colSpan="2">Column 1</th>

            <th>Column 3</th>
            <th>Column 4</th>
          </tr>
        </thead>
        <tbody className="col-12">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((data, colIndex) => (
                <td key={colIndex}>
                  <textarea
                    value={data}
                    onChange={(e) =>
                      updateCell(rowIndex, colIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <button onClick={addRow}>Add Row</button>
        <button onClick={deleteRow}>Delete Last Row</button>
      </table>
    </div>
  );
};

export default jhbsbdas;
