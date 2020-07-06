import { getUnvisitedNeighbours, getAllNodes } from "./commonMethods";
export function bfs(grid, start, finish) {
  const visited = [];
  let q = [];
  getAllNodes(grid, start, finish);
  q.push(start);
  return bfsHelp(grid, finish, visited, q);
}

function bfsHelp(grid, finish, visited, q) {
  q.isVisited = true;
  while (q.length) {
    let t = q.shift();
    if (t.isWall) continue;

    t.isVisited = true;
    visited.push(t);
    if (t === finish) return visited;
    const neighbours = getUnvisitedNeighbours(t, grid);
    for (const neighbour of neighbours) {
      neighbour.isVisited = true;
      neighbour.previousNode = t;
      q.push(neighbour);
    }
  }
  return visited;
}
