import React, { Component } from "react";
import Node from "./Node";

import "./PathFindingVisualizer.css";
import "./Modal.css";
import { dijkstra } from "../algorithms/dijkstra";
import { dfs } from "../algorithms/dfs";
import { bfs } from "../algorithms/bfs";
import { getNodesInShortestPathOrder } from "../algorithms/commonMethods";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathFindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      clear: true,
      buttonClicked: false,
  
    };
  }
  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggledMouseUp(
      this.state.grid,
      row,
      col
    );
    this.setState({ grid: newGrid });
  }
  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
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
            if (row === START_NODE_ROW && col === START_NODE_COL) {
              document.getElementById(
                `node=${node.row}-${node.col}`
              ).className = "node node-start";
            }
            if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
              document.getElementById(
                `node=${node.row}-${node.col}`
              ).className = "node node-finish";
            }
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
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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
          if (i == visitedNodesInOrder.length) {
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
    if (this.state.buttonClicked) {
      return;
    }

    const { clear, isModal } = this.state;
    if (!clear) {
    
    document.getElementById("modal").className = "modal-content";
    
      // window.alert("YOU NEED TO FIRST CLEAR THE BOARD");

      this.clear();
    }
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
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
          <h4>PATHFINDNIG VISUALIZER</h4>
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
      
        <div 
        id="modal"
        className = "modal">
          <span 
          class="close"
          onClick={()=>this.closeModal()}
          >&times;</span>
          <p>BLABLABLABALA</p>
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
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      // onClick={(row,col) => this.handleMouseClick(row,col)}
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
