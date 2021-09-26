import React, { useState } from "react";
import ReactFlow, {
  removeElements,
  addEdge,
  Background,
} from "react-flow-renderer";
import initialElements from "./flow-elements";

const Flow = () => {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  const onLoad = (reactFlowInstance) => {
    console.log("flow loaded:", reactFlowInstance);
    reactFlowInstance.fitView();
  };

  return (
    <div className="flow-container">
      <h4>Container Deployment Architecture</h4>
      <hr />
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
      >
        <Background color="red" gap={10} />
      </ReactFlow>
      <hr />
    </div>
  );
};

export default Flow;
