import React, { Component } from "react";
import Node from "./Node";

import "./PathFindingVisualizer.css";
import "./Modal.css";
import { dijkstra } from "../algorithms/dijkstra";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";
import { getNodesInShortestPathOrder } from "../algorithms/commonMethods";

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      clear: true,
      buttonClicked: false,
      mouseIsPressedOnStart: false,
      mouseIsPressedOnFinish: false,
      startRow: 10,
      startCol: 10,
      finishCol: 35,
      finishRow: 10,
    };
  }
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    var welcome = document.querySelector(".welcome");
    var closeButton = document.querySelector(".close-button2");
    function toggleModal() {
      welcome.classList.toggle("show-modal");
      closeButton.removeEventListener("click", toggleModal);
    }
    toggleModal();
    closeButton.addEventListener("click", toggleModal);
  }

  handleMouseDown(row, col) {
    document.getElementById(`node=${row}-${col}`).className = "node node-reset";

    if (row === this.state.startRow && col === this.state.startCol) {
      const { grid } = this.state;
      let newGrid = grid.slice();
      const node = newGrid[this.state.startRow][this.state.startCol];
      const newNode = {
        ...node,
        isStart: false,
      };
      newGrid[this.state.startRow][this.state.startCol] = newNode;

      this.setState({
        grid: newGrid,
      });

      newGrid = this.getNewGridWithStartNode(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedOnStart: true });
    } else if (row === this.state.finishRow && col === this.state.finishCol) {
      const { grid } = this.state;
      let newGrid = grid.slice();
      const node = newGrid[this.state.finishRow][this.state.finishCol];
      const newNode = {
        ...node,
        isFinish: false,
      };
      newGrid[this.state.finishRow][this.state.finishCol] = newNode;

      this.setState({
        grid: newGrid,
      });

      newGrid = this.getNewGridWithFinishNode(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressedOnFinish: true });
    } else {
      const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseMove(row, col) {
    if (this.state.mouseIsPressedOnStart) {
      const { grid } = this.state;
      let newGrid = grid.slice();
      const node = newGrid[this.state.startRow][this.state.startCol];

      let newNode = {
        ...node,
        isStart: false,
      };
      newGrid[this.state.startRow][this.state.startCol] = newNode;

      newGrid = this.getNewGridWithStartMouseUp(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else if (this.state.mouseIsPressedOnFinish) {
      const { grid } = this.state;
      let newGrid = grid.slice();
      const node = newGrid[this.state.finishRow][this.state.finishCol];

      let newNode = {
        ...node,
        isFinish: false,
      };
      newGrid[this.state.finishRow][this.state.finishCol] = newNode;

      newGrid = this.getNewGridWithFinishMouseUp(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    } else if (this.state.mouseIsPressed) {
      const newGrid = this.getNewGridWithWallToggledMouseUp(
        this.state.grid,
        row,
        col
      );
      this.setState({ grid: newGrid });
    } else return;
  }

  handleMouseUp() {
    document.getElementById(
      `node=${this.state.startRow}-${this.state.startCol}`
    ).className = "node node-start";

    document.getElementById(
      `node=${this.state.finishRow}-${this.state.finishCol}`
    ).className = "node node-finish";

    const { grid } = this.state;
    const newGrid = grid.slice();
    const nodeStart = newGrid[this.state.startRow][this.state.startCol];
    const nodeFinish = newGrid[this.state.finishRow][this.state.finishCol];
    const newNodeStart = {
      ...nodeStart,
      isStart: true,
    };
    const newNodeFinish = {
      ...nodeFinish,
      isFinish: true,
    };
    newGrid[this.state.startRow][this.state.startCol] = newNodeStart;
    newGrid[this.state.finishRow][this.state.finishCol] = newNodeFinish;

    this.setState({
      grid: newGrid,
      mouseIsPressed: false,
      mouseIsPressedOnStart: false,
      mouseIsPressedOnFinish: false,
    });
  }
  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };
  getNewGridWithStartNode = (grid, row, col) => {
    const newGrid = grid.slice();

    const node = newGrid[row][col];
    const newNode = {
      ...node,
      startRow: row,
      startCol: col,
      isStart: true,
    };
    this.setState({ startRow: row, startCol: col });
    newGrid[row][col] = newNode;
    return newGrid;
  };
  getNewGridWithFinishNode = (grid, row, col) => {
    const newGrid = grid.slice();

    const node = newGrid[row][col];
    const newNode = {
      ...node,
      finishRow: row,
      finishCol: col,
      isFinish: true,
    };
    this.setState({ finishRow: row, finishCol: col });
    newGrid[row][col] = newNode;
    return newGrid;
  };

  getNewGridWithStartMouseUp = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      startRow: row,
      startCol: col,
      isStart: true,
    };
    this.setState({ startRow: row, startCol: col });
    newGrid[row][col] = newNode;
    return newGrid;
  };
  getNewGridWithFinishMouseUp = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      finishRow: row,
      finishCol: col,
      isFinish: true,
    };
    this.setState({ finishRow: row, finishCol: col });
    newGrid[row][col] = newNode;
    return newGrid;
  };

  getNewGridWithWallToggledMouseUp = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: true,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };

  clear() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
    const { clear } = this.state;

    if (!clear) {
      this.setState({ clear: true });
    }

    grid.map((row, rowIdx) => {
      return (
        <div key={rowIdx}>
          {row.map((node, nodeIdx) => {
            const { row, col, isStart, isFinish, isVisited, isWall } = node;
            document.getElementById(`node=${node.row}-${node.col}`).className =
              "node node-reset";

            document.getElementById(
              `node=${this.state.startRow}-${this.state.startCol}`
            ).className = "node node-start";

            document.getElementById(
              `node=${this.state.finishRow}-${this.state.finishCol}`
            ).className = "node node-finish";

            return (
              <Node
                key={nodeIdx}
                isVisited={isVisited}
                isStart={isStart}
                isFinish={isFinish}
                row={row}
                col={col}
                isWall={isWall}
              ></Node>
            );
          })}
        </div>
      );
    });
  }

  createNode = (col, row) => {
    return {
      col,
      row,
      startRow: 10,
      startCol: 10,
      isStart: row === 10 && col === 10,
      isFinish: row === 10 && col === 35,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          if (i === visitedNodesInOrder.length) {
            this.setState({ buttonClicked: false });
            this.buttonsEnable();
          }
        }, 9 * i);

        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node=${node.row}-${node.col}`).className =
            "node node-visited";
        }
      }, 8 * i);
    }
  }
  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node=${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }
      }, i);
    }
  }

  buttonsDisable() {
    document.getElementById("bfsButton").className = "button button-disable";
    document.getElementById("dfsButton").className = "button button-disable";
    document.getElementById("clearButton").className = "button button-disable";
    document.getElementById("dijButton").className = "button button-disable";
  }
  buttonsEnable() {
    document.getElementById("bfsButton").className = "button";
    document.getElementById("dfsButton").className = "button ";
    document.getElementById("clearButton").className = "button";
    document.getElementById("dijButton").className = "button";
  }
  visualize(dijkstra, dfs, bfs) {
    const { clear } = this.state;
    if (this.state.buttonClicked) {
      return;
    }
    function toggleModal() {
      modal.classList.toggle("show-modal");

      closeButton.removeEventListener("click", toggleModal);
    }
    if (!clear) {
      var modal = document.querySelector(".modal");
      var closeButton = document.querySelector(".close-button");
      toggleModal();
      closeButton.addEventListener("click", toggleModal);
      // window.alert("YOU NEED TO FIRST CLEAR THE BOARD");
      this.clear();
    }

    const { grid, startCol, startRow, finishRow, finishCol } = this.state;
    const startNode = grid[startRow][startCol];
    const finishNode = grid[finishRow][finishCol];
    let visitedNodesInOrder = null;

    if (clear) {
      if (dijkstra) {
        visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
      } else if (dfs) {
        visitedNodesInOrder = dfs(grid, startNode, finishNode);
      } else {
        visitedNodesInOrder = bfs(grid, startNode, finishNode);
      }
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
      this.setState({ clear: false });
      this.setState({ buttonClicked: true });
      this.buttonsDisable();
    }
  }
  closeModal() {
    document.getElementById("modal").className = "modal";
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <ul className="Toolbar">
          <h4>PATHFINDING VISUALIZER</h4>
          <button
            id="dijButton"
            className="button"
            onClick={() => this.visualize(dijkstra)}
            buttonClicked={this.state.buttonClicked}
          >
            Visualize Dijkstra's Algorithm
          </button>
          <button
            id="dfsButton"
            className="button"
            onClick={() => this.visualize(dfs)}
            buttonClicked={this.state.buttonClicked}
          >
            Visualize DFS Algorithm
          </button>
          <button
            id="bfsButton"
            className="button"
            onClick={() => this.visualize(bfs)}
            buttonClicked={this.state.buttonClicked}
          >
            Visualize BFS Algorithm
          </button>
          <button
            id="clearButton"
            className="button"
            onClick={() => this.clear()}
          >
            clear board
          </button>
        </ul>
        <div className="modal">
          <div className="modal-content">
            <h1>This is going to clear the grid!!</h1>
            <span className="close-button">Okay</span>
          </div>
        </div>
        <div className="welcome">
          <div className="modal-content welcome-content">
            <h2 className="title">Welcome to Pathfinding Visualizer!!</h2>
            <ul>
              <li>Click on the grid to add walls</li>
              <li>Click and drag on start and target nodes to move them</li>
            </ul>
            <span className="close-button2">Start</span>
          </div>
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {
                    row,
                    col,
                    isStart,
                    isFinish,
                    isWall,
                    isVisited,
                    startCol,
                    startRow,
                    finishRow,
                    finishCol,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      isVisited={isVisited}
                      isStart={isStart}
                      isFinish={isFinish}
                      mouseIsPressed={mouseIsPressed}
                      row={row}
                      col={col}
                      isWall={isWall}
                      onMouseUp={() => this.handleMouseUp()}
                      onMouseDown={(row, col) =>
                        this.handleMouseDown(
                          row,
                          col,
                          startRow,
                          startCol,
                          finishRow,
                          finishCol
                        )
                      }
                      onMouseMove={(row, col) => this.handleMouseMove(row, col)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
