import React from 'react';
import PapaParse from 'papaparse';

const expansesCsv = require('../assets/expanses.csv');

interface IExpenses {
  department: string;
  projectName: string;
  amount: string;
  date: string;
  name: string;
}

interface IDict {
  [key: string]: {
    name: string;
    amount: number;
  };
}

const headers = ['Departments', 'Project Name', 'Amount', 'Date', 'Name'];

export const Expanses = () => {
  const [expanses, setExpanses] = React.useState<IExpenses[]>([]);
  const [filtered, setFiltered] = React.useState<IDict | null>(null);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    (function () {
      PapaParse.parse(expansesCsv, {
        download: true,
        complete: function (input) {
          // @ts-ignore
          const records: string[][] = input.data;
          const tempRecords: IExpenses[] = [];

          records.map((record, i) => {
            if (i !== 0) {
              tempRecords.push({
                department: record[0],
                projectName: record[1],
                amount: record[2],
                date: record[3],
                name: record[4],
              });
            }
          });

          setExpanses(tempRecords);
        },
      });
    })();
  }, []);

  function handleFilter(type: string) {
    const tempExpanses = [...expanses];
    const dict: IDict = {};
    let totalAmount = total;

    if (type === 'all') {
      setFiltered(null);
      return;
    }

    tempExpanses.forEach((temp: any) => {
      const amount = parseFloat(temp.amount.split('€')[0]);

      if (!dict[temp[type]]) {
        totalAmount += amount;
        dict[temp[type]] = {
          name: temp[type],
          amount: amount,
        };
      } else {
        totalAmount += amount;
        dict[temp[type]].amount += amount;
      }
    });

    setTotal(totalAmount);
    setFiltered(dict);
  }

  function optionsSelect() {
    return (
      <select
        className="combobox"
        onChange={(val) => handleFilter(val.target.value)}
      >
        <option value="all">All</option>
        <option value="department">Departments</option>
        <option value="projectName">Project Name</option>
        <option value="date">Date</option>
        <option value="name">Name</option>
      </select>
    );
  }

  return (
    <div>
      <div className="comboboxContainer">
        <p>Total Expanses by:</p>
        {optionsSelect()}
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <table style={{width: 500, marginBottom: 50}}>
          {!filtered ? (
            <>
              <tr>
                {headers.map((header, i) => (
                  <th key={i}>{header}</th>
                ))}
              </tr>
              {expanses.map((expanse, i) => (
                <tr key={i}>
                  <td>{expanse.department}</td>
                  <td>{expanse.projectName}</td>
                  <td>{expanse.amount}</td>
                  <td>{expanse.date}</td>
                  <td>{expanse.name}</td>
                </tr>
              ))}
            </>
          ) : (
            <>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
              {Object.keys(filtered).map((key) => {
                return (
                  <tr key={key}>
                    <td>{filtered[key].name}</td>
                    <td>{filtered[key].amount}</td>
                  </tr>
                );
              })}
              <div className="totalContainer">
                <p>Total</p>
                <p>{total}</p>
              </div>
            </>
          )}
        </table>
      </div>
    </div>
  );
};
