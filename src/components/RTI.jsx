import React, { useEffect, useState } from "react";
import { dataDeduction, dataIncome, dataLessCredit, dataPlus } from "./constant";

const RTI = ({ selectedYear, submitData }) => {
  const [lastYear, setLastYear] = useState(0);
  const [PrevYearState, setPrevYearState] = useState(false);
  const [customIncomeData, setCustomIncomeData] = useState([]);
  const [perITR, setPerITR] = useState(0);

  const [prevYearData, setPrevYearData] = useState([]);
 

  const [incomeData, setIncomeData] = useState(dataIncome);

  const [deductionData, setDeductionData] = useState(dataDeduction);

  const [plusData, setPlusData] = useState(dataPlus);

  const [lessCreditData, setLessCreditData] = useState(dataLessCredit);

  const handleIncomeChange = (id, value) => {
    setIncomeData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, amount: value } : item
      )
    );
  };

  const handleDeductionChange = (id, value) => {
    setDeductionData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, amount: value } : item
      )
    );
  };

  const handlePlusChange = (id, value) => {
    setPlusData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, amount: value } : item
      )
    );
  };

  const handleLessCreditChange = (id, value) => {
    setLessCreditData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, amount: value } : item
      )
    );
  };

  // console.log(prevYearData?.data?.deductionData?.map((i) => i.amount));

  //  totalIncomeAndDeduction
  const totalIncomeAndDeduction = incomeData.reduce(
    (total, item) => (item.amount ? total + parseFloat(item.amount) : total),
    0
  );

  //  total deduction
  const totalDeduction = deductionData.reduce(
    (total, item) => (item.amount ? total + parseFloat(item.amount) : total),
    0
  );

  //  total plus
  const totalPlus = plusData.reduce(
    (total, item) => (item.amount ? total + parseFloat(item.amount) : total),
    0
  );

  //  total less credits
  const totalLessCredit = lessCreditData.reduce(
    (total, item) => (item.amount ? total + parseFloat(item.amount) : total),
    0
  );

  const handlePerITRChange = (value) => {
    const newValue = parseFloat(value);
    setPerITR(isNaN(newValue) ? "" : newValue);
  };

  const handleSubmission = () => {
    const dataToStore = {
      Year: selectedYear,
      data: {
        incomeData,
        deductionData,
        plusData,
        lessCreditData,
        taxableIncome,
        OverAll,
        perITR,
        difference,
      },
    };

    let existingData = JSON.parse(localStorage.getItem("rtiData")) || [];

    const index = existingData.findIndex((item) => item.Year === selectedYear);

    if (index !== -1) {
      existingData[index] = dataToStore;
    } else {
      existingData.push(dataToStore);
    }

    localStorage.setItem("rtiData", JSON.stringify(existingData));

    setCustomIncomeData(
      customIncomeData.map((item) => ({ ...item, amount: "" }))
    );
    setDeductionData(deductionData.map((item) => ({ ...item, amount: "" })));
    setPlusData(plusData.map((item) => ({ ...item, amount: "" })));
    setLessCreditData(lessCreditData.map((item) => ({ ...item, amount: "" })));
    setPerITR(0);
  };

  const togglePrevYearState = () => {
    setPrevYearState((prevState) => !prevState);
  };

  useEffect(() => {
   
    console.log("Selected year changed:", selectedYear);
  }, [selectedYear]);

  const taxableIncome = totalIncomeAndDeduction + totalDeduction;

  const OverAll = totalPlus + totalLessCredit + taxableIncome;

  const difference = OverAll - perITR;

  const compareData = () => {
    const previousData = JSON.parse(localStorage.getItem("rtiData")) || [];
    const currentYear = parseInt(selectedYear);
    const previousYear = currentYear - 1;

    setLastYear(previousYear);

    if (!isNaN(currentYear)) {
      const previousYearData = previousData.find(
        (item) => parseInt(item.Year) === previousYear
      );

      if (previousYearData) {
        const mergedData = {
          Year: selectedYear,
          data: {
            deductionData: [
              ...deductionData,
              ...previousYearData.data.deductionData,
            ],
            plusData: [...plusData, ...previousYearData.data.plusData],
            lessCreditData: [
              ...lessCreditData,
              ...previousYearData.data.lessCreditData,
            ],
            taxableIncome: totalIncomeAndDeduction + totalDeduction,
            OverAll:
              totalPlus +
              totalLessCredit +
              (totalIncomeAndDeduction + totalDeduction),
            perITR,
            difference: OverAll - perITR,
          },
        };

        // Update localStorage
        localStorage.setItem(
          "rtiData",
          JSON.stringify([
            ...previousData.filter((item) => item.Year !== selectedYear),
            mergedData,
          ])
        );

        // Update state
        setPrevYearData(previousYearData);
      }
    } else {
      console.error("Invalid selectedYear:", selectedYear);
    }
  };

  useEffect(() => {
    compareData();
  }, [selectedYear, submitData]);

  return (
    <div className="container">
      <div className="row">
        <div className="col p-0">
          {/* Income Table */}
          <table className="col-12 mb-5 ">
            <thead className="col-12">
              <tr className=" col-12 ">
                <th
                  className="border-1 border-black  "
                  style={{ width: "50px" }}
                >
                  ID
                </th>
                <th className="border-1 border-black">Income</th>
                <th className="border-1 border-black">{selectedYear}</th>
                {PrevYearState && prevYearData && (
                  <th className="border-1 border-black">{lastYear}</th>
                )}
              </tr>
            </thead>
            <tbody className="col-12 data-body rti-body">
              {incomeData.map((item, i) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="text"
                      value={item.amount}
                      readOnly={PrevYearState}
                      placeholder="Enter data"
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        {
                          handleIncomeChange(item.id, e.target.value);
                        }
                      }}
                    />
                  </td>
                  <td
                    className={PrevYearState ? "prev-td-not" : "prev-td"}
                    key={i}
                  >
                    {(PrevYearState &&
                      prevYearData?.data?.incomeData?.find(
                        (prev) => prev.id === item.id
                      )?.amount) ||
                      ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Deduction Table */}
          <table className="col-12 mb-5 ">
            <thead className="col-12">
              <tr className=" col-12 ">
                <th
                  className="border-1 border-black  "
                  style={{ width: "50px" }}
                >
                  ID
                </th>
                <th className="border-1 border-black">Deduction</th>
                <th className="border-1 border-black">{selectedYear}</th>
                {PrevYearState && prevYearData && (
                  <th className="border-1 border-black">{lastYear}</th>
                )}
              </tr>
            </thead>
            <tbody className="col-12 data-body rti-body">
              {deductionData.map((item, i) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="text"
                      value={item.amount}
                      placeholder="Enter data"
                      readOnly={PrevYearState}
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        {
                          handleDeductionChange(item.id, e.target.value);
                        }
                      }}
                    />
                  </td>
                  <td className={PrevYearState ? "" : "prev-td"} key={i}>
                    {(PrevYearState &&
                      prevYearData?.data?.deductionData?.find(
                        (prev) => prev.id === item.id
                      )?.amount) ||
                      ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Deduction Table */}
          {/* Taxable Income */}
          <table className="col-12 mb-4 ">
            <tfoot>
              <tr>
                <td className=" col-8" colSpan="2">
                  Taxable Income
                </td>
                <td className=" col-4">{taxableIncome.toFixed(2)}</td>
                <td className={PrevYearState ? "" : "prev-td"}>
                  {PrevYearState && prevYearData?.data?.perITR}
                </td>
              </tr>
            </tfoot>
          </table>
          {/* End Taxable Income */}

          <table className="col-12 mb-5 ">
            <thead className="col-12">
              <tr className=" col-12 ">
                <th
                  className="border-1 border-black  "
                  style={{ width: "50px" }}
                >
                  ID
                </th>
                <th className="border-1 border-black">Plus</th>
                <th className="border-1 border-black">{selectedYear}</th>
                {PrevYearState && prevYearData && (
                  <th className="border-1 border-black">{lastYear}</th>
                )}
              </tr>
            </thead>
            <tbody className="col-12 data-body rti-body">
              {plusData.map((item, i) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      readOnly={PrevYearState}
                      type="text"
                      value={item.amount}
                      placeholder="Enter data"
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        {
                          handlePlusChange(item.id, e.target.value);
                        }
                      }}
                    />
                  </td>
                  <td className={PrevYearState ? "" : "prev-td"} key={i}>
                    {(PrevYearState &&
                      prevYearData?.data?.plusData?.find(
                        (prev) => prev.id === item.id
                      )?.amount) ||
                      ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Less Credits Table */}
          <table className="col-12 mb-5 ">
            <thead className="col-12">
              <tr className=" col-12 ">
                <th
                  className="border-1 border-black  "
                  style={{ width: "50px" }}
                >
                  ID
                </th>
                <th className="border-1 border-black">Less Credits</th>
                <th className="border-1 border-black">{selectedYear}</th>
                {PrevYearState && prevYearData && (
                  <th className="border-1 border-black">{lastYear}</th>
                )}
              </tr>
            </thead>
            <tbody className="col-12 data-body rti-body">
              {lessCreditData.map((item, i) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.description}</td>
                  <td>
                    <input
                      type="text"
                      readOnly={PrevYearState}
                      value={item.amount}
                      placeholder="Enter data"
                      onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        {
                          handleLessCreditChange(item.id, e.target.value);
                        }
                      }}
                    />
                  </td>
                  <td className={PrevYearState ? "" : "prev-td"} key={i}>
                    {(PrevYearState &&
                      prevYearData?.data?.lessCreditData?.find(
                        (prev) => prev.id === item.id
                      )?.amount) ||
                      ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="col-12 mb-4">
            <tfoot>
              <tr>
                <td colSpan="4">Estimated Tax Payable/(Refundable)</td>
                <td className="col-4">{OverAll.toFixed(2)}</td>
                <td className={PrevYearState ? "" : "prev-td"}>
                  {PrevYearState && prevYearData?.data?.OverAll}
                </td>
              </tr>
              <tr>
                <td colSpan="4">Per ITR</td>
                <td>
                  <input
                    type="number"
                    value={perITR}
                    readOnly={PrevYearState}
                    onChange={(e) => handlePerITRChange(e.target.value)}
                  />
                </td>
                <td className={PrevYearState ? "" : "prev-td"}>
                  {PrevYearState && prevYearData?.data?.perITR}
                </td>
              </tr>
              <tr>
                <td colSpan="4">Difference</td>
                <td>{difference == "NaN" ? 0 : difference.toFixed(2)}</td>
                <td className={PrevYearState ? "" : "prev-td"}>
                  {PrevYearState && prevYearData?.data?.difference}
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="d-flex gap-2 mt-5">
            <button className="btn bg-success py-0" onClick={handleSubmission}>
              Submit Data
            </button>
            <button
              className="btn bg-warning py-0"
              onClick={togglePrevYearState}
            >
              {PrevYearState
                ? "Hide Previous Year Data"
                : "Show Previous Year Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTI;
