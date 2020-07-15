import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      row,
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseUp,
      onMouseMove,
    } = this.props;
    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    return (
      <div
        id={`node=${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp()}
        onMouseMove={() => onMouseMove(row, col)}
      ></div>
    );
  }
}
