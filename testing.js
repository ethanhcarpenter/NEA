const allBishopMoves = {};

// Loop through each square on the chessboard
for (let file = 'a'.charCodeAt(0); file <= 'h'.charCodeAt(0); file++) {
  for (let rank = 1; rank <= 8; rank++) {
    const square = String.fromCharCode(file) + rank;
    allBishopMoves[square] = {
      ne: [],
      se: [],
      sw: [],
      nw: []
    };

    // Calculate bishop moves for each direction
    for (let i = 1; i <= 7; i++) {
      // Northeast direction
      if (file + i <= 'h'.charCodeAt(0) && rank + i <= 8) {
        allBishopMoves[square].ne.push(String.fromCharCode(file + i) + (rank + i));
      }
      // Southeast direction
      if (file + i <= 'h'.charCodeAt(0) && rank - i >= 1) {
        allBishopMoves[square].se.push(String.fromCharCode(file + i) + (rank - i));
      }
      // Southwest direction
      if (file - i >= 'a'.charCodeAt(0) && rank - i >= 1) {
        allBishopMoves[square].sw.push(String.fromCharCode(file - i) + (rank - i));
      }
      // Northwest direction
      if (file - i >= 'a'.charCodeAt(0) && rank + i <= 8) {
        allBishopMoves[square].nw.push(String.fromCharCode(file - i) + (rank + i));
      }
    }
  }
}
console.log(allBishopMoves["b5"].ne);
console.log(allBishopMoves["b5"].se);
console.log(allBishopMoves["b5"].sw);
console.log(allBishopMoves[23].nw);
