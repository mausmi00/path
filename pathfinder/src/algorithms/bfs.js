export function bfs(grid, start, finish) {
  const visited = [];
  let q = [];
  q.push(start);
  return bfsHelp(grid, finish, visited, q);
}

function bfsHelp(grid, finish, visited, q) {
  q.isVisited = true;
  while (q.length) {
    let t = q.shift();
    if(t.isWall) continue;
    t.isVisited = true;
    visited.push(t);
    if (t === finish) return visited;
    const neighbours = getUnvisitedNeighbours(t, grid);
    for (const neighbour of neighbours) {
        neighbour.isVisited = true;
      q.push(neighbour);
    }
  }

  function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    if (row > 0) neighbours.unshift(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbours.unshift(grid[row][col + 1]);
    if (row < grid.length - 1) neighbours.unshift(grid[row + 1][col]);
    if (col > 0) neighbours.unshift(grid[row][col - 1]);

    return neighbours.filter((neighbour) => !neighbour.isVisited);
  }
}
