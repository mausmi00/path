import {getUnvisitedNeighbours, getAllNodes} from "./commonMethods"
export function dfs(grid, start, finish) {
  const visited = [];
  const stack = [];
  getAllNodes(grid, start, finish);
  stack.push(start);
  return dfsHelp(grid, finish, visited, stack);
}

function dfsHelp(grid, finish, visited, stack) {
  while (stack.length) {
    let current = stack.pop();
    if (current.isWall) continue;
    visited.push(current);
    current.isVisited = true;
    if (current == finish) return visited;
    const neighbours = getUnvisitedNeighbours(current, grid);
    for (const neighbour of neighbours) {
      neighbour.previousNode = current;
      stack.push(neighbour);
    }
  }
  return visited;
}
