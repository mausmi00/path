export function dfs(grid, start, finish) {
  const visited = [];
  const stack = [];
  stack.push(start);
  return dfsHelp(grid, finish, visited, stack);
}

function dfsHelp(grid, finish, visited, stack) {
  while (stack.length) {
    let current = stack.pop();
    if(current.isWall) continue;
    visited.push(current);
    current.isVisited = true;
    if (current == finish) return visited;
    const neighbours = getUnvisitedNeighbours(current, grid);
    for (const neighbour of neighbours) {
      stack.push(neighbour);
    }
  }
  return visited;
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
