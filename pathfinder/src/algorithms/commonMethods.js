export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }

  export function getUnvisitedNeighbours(node, grid) {
    const neighbours = [];
    const { col, row } = node;
    if (row > 0) neighbours.unshift(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbours.unshift(grid[row][col + 1]);
    if (row < grid.length - 1) neighbours.unshift(grid[row + 1][col]);
    if (col > 0) neighbours.unshift(grid[row][col - 1]);

    return neighbours.filter((neighbour) => !neighbour.isVisited);
  }
  