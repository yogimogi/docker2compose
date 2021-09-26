import React, { useEffect, useState } from "react";

const Page2 = () => {
  const [languages, setLangugages] = useState([]);

  const getLanguages = () => {
    fetch("/appserver2/languages/", {
      method: "GET",
    })
      .then((response) => {
        if (response.status == 200) {
          response.json().then((x) => setLangugages(x.Languages));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  return (
    <div id="home-div" className="h-100 p-3 bg-light border rounded-3">
      <h4>Languages</h4>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>First Release</th>
            <th>Author</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {languages.map((l) => {
            return (
              <tr key={l.id}>
                <td>{l.name}</td>
                <td>{l.first_release}</td>
                <td>{l.author}</td>
                <td>
                  <a
                    className="btn btn-outline-primary btn-sm"
                    href={l.details}
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
    </div>
  );
};

export default Page2;
