import React, { useEffect, useState } from "react";

const Page1 = () => {
  const [mathematicians, setMathematicians] = useState([]);
  const [numbers, setNumbers] = useState([]);

  const getMathematicians = () => {
    fetch("/appserver1/mathematicians/", {
      method: "GET",
    })
      .then((response) => {
        response
          .json()
          .then((mathematicians) => setMathematicians(mathematicians));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCache = () => {
    fetch("/appserver1/cache/", {
      method: "GET",
    })
      .then((response) => {
        response.json().then((numbersMap) => {
          var numbers = [];
          for (const k in numbersMap) {
            numbers.push({ number: k, significance: numbersMap[k] });
          }
          setNumbers(numbers);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getMathematicians();
    getCache();
  }, []);

  return (
    <div id="home-div" className="h-100 p-3 bg-light border rounded-3">
      <h4>Mathematicians</h4>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Year of Birth</th>
            <th>Known For</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {mathematicians.map((m) => {
            return (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.birth_year}</td>
                <td>{m.known_for}</td>
                <td>
                  <a
                    className="btn btn-outline-primary btn-sm"
                    href={m.details}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Details
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h4>Special Numbers</h4>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Number</th>
            <th>Significance</th>
          </tr>
        </thead>
        <tbody>
          {numbers.map((n) => {
            return (
              <tr key={n.number}>
                <td>{n.number}</td>
                <td>{n.significance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <br />
      <br />
    </div>
  );
};

export default Page1;
