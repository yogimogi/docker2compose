import React, { useState } from "react";

const Page3 = () => {
  const [apiResponse, setApiResponse] = useState("");
  const [statusCode, setStatusCode] = useState("");

  const invokeApi = () => {
    fetch("/appserver1/cache/limit", {
      method: "GET",
    })
      .then((response) => {
        setStatusCode(response.status);
        response.json().then((x) => {
          console.log(x);
          setApiResponse(JSON.stringify(x));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var statusStyle = { padding: 10, margin: 10, color: "green" };
  if (statusCode !== 200)
    statusStyle = { padding: 10, margin: 10, color: "red" };

  return (
    <div id="home-div" className="h-100 p-3 bg-light border rounded-3">
      <p>Only 10 API calls per minute are allowed from an IP address.</p>
      <h5>
        <span>API Throttling</span>
        <button
          style={{ margin: 10 }}
          className="btn btn-primary btn-sm"
          onClick={invokeApi}
        >
          Invoke
        </button>
      </h5>
      {statusCode !== "" && (
        <table className="table">
          <tbody>
            <tr>
              <td>HTTP Response Status Code</td>
              <td className="text-start" style={statusStyle}>
                {statusCode}
              </td>
            </tr>
            <tr>
              <td>HTTP Response</td>
              <td className="text-start">{apiResponse}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Page3;
