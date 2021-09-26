import React from "react";
import golang from "../../logos/golang.png";
import redis from "../../logos/redis.png";
import python from "../../logos/python.png";
import nginx from "../../logos/nginx.png";
import postgres from "../../logos/postgres.png";

const nodeStyle = { fontSize: 12, color: "black" };

export default [
  {
    id: "webapp",
    sourcePosition: "right",
    style: { ...nodeStyle, background: "#BFE1BF" },
    data: {
      label: (
        <>
          <div>
            <img
              style={{ paddingLeft: -50 }}
              src={nginx}
              width="25px"
              height="25px"
            ></img>
            <span>&nbsp;&nbsp;</span>
            <span>webapp (react)</span>
          </div>
        </>
      ),
    },
    position: { x: 0, y: 40 },
  },
  {
    id: "appserver1",
    sourcePosition: "right",
    targetPosition: "left",
    style: { ...nodeStyle, background: "#C9E7F5" },
    data: {
      label: (
        <>
          <div>
            <img src={python} width="25px" height="25px"></img>
            <span>&nbsp;&nbsp;</span>
            <span>appserver1</span>
          </div>
        </>
      ),
    },
    position: { x: 200, y: -40 },
  },
  {
    id: "appserver2",
    sourcePosition: "right",
    targetPosition: "left",
    style: { ...nodeStyle, background: "#C9E7F5" },
    data: {
      label: (
        <>
          <div>
            <img src={golang} width="30px" height="20px"></img>
            <span>&nbsp;&nbsp;</span>
            <span>appserver2</span>
          </div>
        </>
      ),
    },
    position: { x: 200, y: 140 },
  },
  {
    id: "redisserver",
    sourcePosition: "right",
    targetPosition: "left",
    style: { ...nodeStyle, background: "#FBDDD4" },
    data: {
      label: (
        <>
          <div>
            <img src={redis} width="25px" height="25px"></img>
            <span>&nbsp;&nbsp;</span>
            <span>redisserver</span>
          </div>
        </>
      ),
    },
    position: { x: 450, y: -60 },
  },
  {
    id: "dbserver",
    style: { ...nodeStyle, background: "#FBDDD4" },
    data: {
      label: (
        <>
          <div>
            <img src={postgres} width="25px" height="25px"></img>
            <span>&nbsp;&nbsp;</span>
            <span>dbserver</span>
          </div>
        </>
      ),
    },
    position: { x: 380, y: 200 },
  },
  {
    id: "edge-1",
    source: "webapp",
    type: "smoothstep",
    target: "appserver1",
    arrowHeadType: "arrowclosed",
    label: "Proxy for appserver1",
  },
  {
    id: "edge-2",
    source: "webapp",
    type: "smoothstep",
    target: "appserver2",
    arrowHeadType: "arrowclosed",
    label: "Proxy for appserver2",
  },
  {
    id: "edge-3",
    source: "appserver1",
    type: "straight",
    target: "redisserver",
    arrowHeadType: "arrowclosed",
  },
  {
    id: "edge-4",
    source: "appserver1",
    target: "dbserver",
    arrowHeadType: "arrowclosed",
  },
  {
    id: "edge-5",
    source: "appserver2",
    target: "dbserver",
    arrowHeadType: "arrowclosed",
  },
];
