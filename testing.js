function onSquareClick(square) {
    // Call a tester function (you can provide a description here)
    this.testerFunc();
  
    // Extract the first two characters from the square's ID
    const id = square.id.substring(0, 2);
  
    // If it's the first click
    if (this.clicks === 0) {
      // Check if there's a piece on the clicked square
      if (!this.getPieceAtPosition(id)) return;
  
      // Set the selected piece and square for the first click
      this.clickedPiece = this.getPieceAtPosition(id);
      this.clickedSqr = id;
  
      // Check if it's the current player's piece
      if (!(this.turn === this.getPieceAtPosition(this.clickedSqr)[0])) {
        return;
      }
  
      // Log the ID of the clicked square (you can provide more context here)
      console.log(id);
  
      // Show the legal moves for the selected piece
      this.showLegalMoves();
  
      // Set the state for the second click
      this.clicks = 1;
    }
    // If it's the second click
    else if (this.clicks === 1) {
      // Store the second clicked square's ID
      this.secondClickSqr = id;
  
      // Check if the move is valid
      if (!this.checkMove()) {
        // Reset the state and update the board if the move is invalid
        this.clicks = 0;
  
        // If the second click is the same as the first, just update the board
        if (this.secondClickSqr === this.clickedSqr) {
          this.updateBoard();
        }
        // If the second click is an empty square, update the board
        else if (!this.getPieceAtPosition(this.secondClickSqr)) {
          this.updateBoard();
        }
        // If the second click has an opponent's piece
        else if (this.getPieceAtPosition(this.secondClickSqr)) {
          this.updateBoard();
  
          // Check if it's the opponent's turn
          if (!(this.turn === this.getPieceAtPosition(this.secondClickSqr)[0])) {
            return;
          }
  
          this.updateBoard();
          this.clicks = 0;
          this.clickedPiece = this.getPieceAtPosition(this.secondClickSqr);
          this.clickedSqr = this.secondClickSqr;
  
          // Highlight the selected square
          const sqr = document.getElementById(this.secondClickSqr);
          sqr.style.color = "blue";
  
          // Show the legal moves for the selected piece
          this.showLegalMoves();
          return;
        }
  
        // Reset the state
        this.clickedPiece = null;
        this.clickedSqr = null;
        return;
      }
  
      // If the move is valid, update the piece's position and switch turns
      this.setPiecePosition(this.clickedPiece, this.secondClickSqr);
      this.setPiecePosition(null, this.clickedSqr);
      this.updateBoard();
  
      // Switch the turn to the opposite player
      this.turn = (this.turn === 'w') ? 'b' : 'w';
      this.clicks = 0;
    }
  }