import React from "react";
import "./toolbar.css";
import {visualize} from "../Node/PathFindingVisualizer"

const toolbar = (props) => {
 
return(
<ul className="Toolbar">
    <li>PATH FINDER</li>
    <button className ="button" onClick = {visualize(bfs)}>BFS</button>
    <button className = "button">DFS</button>
    <button className = "button">Dijkstra's algorithm</button>

</ul>
);

};
export default toolbar;
