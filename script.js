class ChessGame {
    constructor(boardState) {
        
        this.boardState=boardState;
        this.board = [];
        this.piecesPos={};
        this.initBoard();
        this.renderBoard();
        this.updateBoard();
        this.clicks=0;
        this.clickedPiece;
        this.clickedSqr;
        this.secondClickSqr;
        this.turn='w';
        this.draggingInfo={
            isDragging: true,
            offsetX: 0,
            offsetY: 0,
            initialPosition: { x: 0, y: 0 }
        };
        console.log(this.draggingInfo.offsetX);
    }
    initBoard() {
        for (let row = 0; row < 8; row++) {
            this.board[row] = [];
            for (let col = 0; col < 8; col++) {
                this.board[row][col] = null;

            }
        }
        this.setupStartingPosition();
        
    }
    renderBoard() {
        const chessboard = document.getElementById('chessboard');
        for (let row = 1; row < 9; row++) {
            for (let col = 1; col < 9; col++) {
                const square = document.createElement('div');
                square.dataset.row = row;
                square.dataset.col = col;
                square.style.border=0;
                square.id=`${String.fromCharCode(96+col)}${9-row}`;
                if (this.isOdd(row+col))square.className= 'black';
                else square.className='white';
                square.style.userSelect="none";
                square.textContent = this.board[row-1][col-1] || '';
                square.addEventListener('click', () => this.onSquareClick(square));
                chessboard.appendChild(square);
            }
        }
        this.addPieces();
    }
    addPieces(){
        const chessboard = document.getElementById('chessboard');
        const squares = Array.from(chessboard.children);

        squares.forEach((sqr) => {
            const newSqr = document.createElement("div");
            const rect = sqr.getBoundingClientRect();
            newSqr.className="images";
            newSqr.style.position = "absolute";
            newSqr.style.top = rect.top + "px";
            newSqr.style.left = rect.left + "px";
            newSqr.style.width = rect.width + "px";
            newSqr.style.height = rect.height + "px";
            newSqr.style.backgroundColor = "";
            this.draggingEnable(newSqr);
            const pieceImages = {
                'wrook': 'pieces/white-rook.png',
                'wknight': 'pieces/white-knight.png',
                'wbishop': 'pieces/white-bishop.png',
                'wqueen': 'pieces/white-queen.png',
                'wking': 'pieces/white-king.png',
                'wpawn': 'pieces/white-pawn.png',
                'brook': 'pieces/black-rook.png',
                'bknight': 'pieces/black-knight.png',
                'bbishop': 'pieces/black-bishop.png',
                'bqueen': 'pieces/black-queen.png',
                'bking': 'pieces/black-king.png',
                'bpawn': 'pieces/black-pawn.png',
            };
            console.log(this.getPieceAtPosition(sqr.id));
            if(this.getPieceAtPosition(sqr.id)){
                newSqr.style.backgroundImage=`url(${pieceImages[this.getPieceAtPosition(sqr.id)]})`;
                if(this.getPieceAtPosition(sqr.id).includes("wpawn"))newSqr.style.backgroundImage=`url(${pieceImages["wpawn"]})`;
                if(this.getPieceAtPosition(sqr.id).includes("bpawn"))newSqr.style.backgroundImage=`url(${pieceImages["bpawn"]})`;
            }else{
                newSqr.style.backgroundImage="";
            }
            newSqr.style.backgroundSize="cover";
            chessboard.appendChild(newSqr);
        });
    }
    draggingEnable(sqr){
        sqr.addEventListener('mousedown', (e) => {
            this.draggingInfo.isDragging = true;
        
            // Calculate the offset relative to the middle of the div
            const boundingBox = sqr.getBoundingClientRect();
            const divWidth = boundingBox.width;
            const divHeight = boundingBox.height;
            this.draggingInfo.initialPosition = { x: boundingBox.left + divWidth / 2, y: boundingBox.top + divHeight / 2 };
        
            this.draggingInfo.offsetX = divWidth / 2;
            this.draggingInfo.offsetY = divHeight / 2;
            sqr.style.position = 'absolute';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            const offsetX = divWidth / 2;
            const offsetY = divHeight / 2;
            sqr.style.left = (e.clientX - offsetX) + 'px';
            sqr.style.top = (e.clientY - offsetY) + 'px';
        
            e.preventDefault();
        });

        const onMouseMove = (e) => {
            if (this.draggingInfo.isDragging) {
                sqr.style.left = e.clientX - this.draggingInfo.offsetX + 'px';
                sqr.style.top = e.clientY - this.draggingInfo.offsetY + 'px';
            }
        };
        const onMouseUp = (e) => {
            if (this.draggingInfo.isDragging) {
                this.draggingInfo.isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                console.log(2);
                if (!isValidDrop(e.clientX, e.clientY)) {
                    sqr.style.left = this.draggingInfo.initialPosition.x-30 + 'px';
                    sqr.style.top = this.draggingInfo.initialPosition.y-30 + 'px';
                }
        
                
            }
        };
        const isValidDrop = (x, y) => {
            return false;
        };
    }
    setupStartingPosition() {
        this.setPiecePosition("wrook", "a1");
        this.setPiecePosition("wknight", "b1");
        this.setPiecePosition("wbishop", "c1");
        this.setPiecePosition("wqueen", "d1");
        this.setPiecePosition("wking", "e1");
        this.setPiecePosition("wbishop", "f1");
        this.setPiecePosition("wknight", "g1");
        this.setPiecePosition("wrook", "h1");
        this.setPiecePosition("brook", "a8");
        this.setPiecePosition("brook", "h8");
        this.setPiecePosition("bknight", "b8");
        this.setPiecePosition("bknight", "g8");
        this.setPiecePosition("bbishop", "c8");
        this.setPiecePosition("bbishop", "f8");
        this.setPiecePosition("bqueen", "d8");
        this.setPiecePosition("bking", "e8");
        const alphabet="abcdefgh";
        for (let col = 1; col <= 8; col++) {
            this.setPiecePosition("wpawn"+`${col}`, `${alphabet[col - 1]}2`);
        }
        for (let col = 1; col <= 8; col++) {
            this.setPiecePosition("bpawn"+`${col}`, `${alphabet[col - 1]}7`);
        }
        for (let row = 3; row <= 6; row++) {
            for (let col = 1; col <= 8; col++) {
                this.setPiecePosition(null, `${alphabet[col - 1]}${row}`);
            }
        }
        
    }
    isOdd(n){
        if(n%2===0)return false
        return true
    }
    setPiecePosition(piece,id) {
        const[col,row]=this.idToGrid(id);
        this.piecesPos[((row-1)*8+col)] = piece;
      }
    getPieceAtPosition(id) {
        const[col,row]=this.idToGrid(id);
        return this.piecesPos[((row-1)*8+col)];
    }
    idToGrid(id){
        const col = id[0].toLowerCase().charCodeAt(0) - 96; 
        const row = parseInt(id[1]);
        return [col, row];
    }
    outSquareInfo(square){
        console.clear();
        console.log(`Clicked on square at row ${square.id} `);
        console.log(this.getPieceAtPosition(square.id))
        console.log(this.clickedPiece)
    }
    outPiecesPos(){
        for (let i = 0; i < 8; i++) {
            for (let x = 1; x < 9; x++) {
                console.log(this.piecesPos[i*8+x])
            }
        }
    }
    idToDict(id){
        const[col,row]=this.idToGrid(id);
        return ((row-1)*8+col)
    }
    dictToId(number){
        const row = Math.floor((number - 1) / 8) + 1;
        const col = (number - 1) % 8 + 1;
        return `${String.fromCharCode(96+col)}${row}`;
    } 
    valueToCNotation(notation) {
        const pieceMap = {
            'bking': 'K',
            'wking': 'k',
            'bqueen': 'Q',
            'wqueen': 'q',
            'brook': 'R',
            'wrook': 'r',
            'bknight': 'N',
            'wknight': 'n',
            'bbishop': 'B',
            'wbishop': 'b',
        };
        if(!notation)return "" ;
        if(notation.includes('wpawn'))return "p";
        if(notation.includes('bpawn'))return "P";
    
        return pieceMap[notation] ;
    }
    updateBoard(){
        for(const key in this.piecesPos){
            const sqr=document.getElementById(this.dictToId(key));
            sqr.style.textAlign="center";
            sqr.style.color="black"; 
            const piece=this.piecesPos[key]
            switch(this.boardState){
                case 0:
                    sqr.innerText="";
                    break;
                case 1:
                    sqr.innerText=this.valueToCNotation(piece);
                    break;
                case 2:
                    sqr.innerText=key;
                    break
                default:
                    sqr.innerText=this.valueToCNotation(piece);
                    break;
                    
            }
            console.log(23);

        }
        
    }
    showLegalMoves(){
        let moves=[];
        const position=this.idToDict(this.clickedSqr);
        if(this.clickedPiece.includes("pawn")){
            const white=(this.clickedPiece[0]==='w')?true:false;
             moves=this.pawn(this.piecesPos,position,white);
        }
        if(this.clickedPiece.includes("knight")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            moves=this.knight(this.piecesPos,position,white);
        }
        if(this.clickedPiece.includes("bishop")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            moves=this.bishop(this.piecesPos,position,white);
        }
        if(this.clickedPiece.includes("rook")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            moves=this.rook(this.piecesPos,position,white);
        }
        if(this.clickedPiece.includes("queen")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            moves=this.queen(this.piecesPos,position,white);
    
        }
        if(this.clickedPiece.includes("king")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            moves=this.king(this.piecesPos,position,white);
        }
        moves.forEach(move => {
            const sqr = document.getElementById(this.dictToId(move));
            console.log(sqr.id);
            this.addTintToDiv(sqr,0.3,);
        
        });
    }
    addTintToDiv(divToTint, tintOpacity) {
    
        const tintColor="rgba(0,0,0,.4)";
        const tintDiv = document.createElement("div");
        tintDiv.className = "tint-overlay"; 
        tintDiv.style.backgroundColor = tintColor//"rgba(0, 0, 0, 0.5)";
        tintDiv.style.opacity = tintOpacity; 
        tintDiv.style.borderRadius = "100%";
        tintDiv.style.position = "relative";
        tintDiv.style.textAlign="center";
        tintDiv.style.left="20px";
        tintDiv.style.top="20px";
        tintDiv.style.width="20px";
        tintDiv.style.height="20px";
        tintDiv.style.pointerEvents = "none"; 
        divToTint.appendChild(tintDiv);
    }
    onSquareClick(square) {
        this.testerFunc();
        
        if(this.clicks===1){
            this.secondClickSqr=square.id;
            if(!this.checkMove()){
                this.clicks=0;
                if(this.secondClickSqr===this.clickedSqr){
                    this.updateBoard();
                }
                else if(!this.getPieceAtPosition(this.secondClickSqr)){
                    this.updateBoard();
                }
                else if(this.getPieceAtPosition(this.secondClickSqr)){
                    this.updateBoard();
                    if(!(this.turn===this.getPieceAtPosition(this.secondClickSqr)[0])){
                        return;
                    }
                    this.updateBoard();
                    this.clicks=1;
                    this.clickedPiece=this.getPieceAtPosition(this.secondClickSqr)
                    this.clickedSqr=this.secondClickSqr;
                    const sqr=document.getElementById(this.secondClickSqr);
                    sqr.style.color="blue";
                    this.showLegalMoves();
                    return;
                }
                this.clickedPiece=null;
                this.clickedSqr=null;
                
                return;
            }
            this.setPiecePosition(this.clickedPiece,this.secondClickSqr)
            this.setPiecePosition(null,this.clickedSqr)
            this.updateBoard();
            this.turn=(this.turn==='w')?'b':'w';
            this.clicks=0
        }
        else if(this.clicks===0){
            if(!this.getPieceAtPosition(square.id)) return;
            this.clickedPiece=this.getPieceAtPosition(square.id);
            this.clickedSqr=square.id;
            if(!(this.turn===this.getPieceAtPosition(this.clickedSqr)[0])){
                return;
            }
            square.style.color="blue";
            this.showLegalMoves();
            this.clicks=1;
            return
        }
        
    }
    checkMove(){
        const secondSqr=this.idToDict(this.secondClickSqr);
        const position=this.idToDict(this.clickedSqr);
        if(this.clickedPiece.includes("pawn")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.pawn(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
        if(this.clickedPiece.includes("knight")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.knight(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
        if(this.clickedPiece.includes("bishop")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.bishop(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
        if(this.clickedPiece.includes("rook")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.rook(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
        if(this.clickedPiece.includes("queen")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.queen(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
        if(this.clickedPiece.includes("king")){
            const white=(this.clickedPiece[0]==='w')?true:false;
            const moves=this.king(this.piecesPos,position,white);
            if(moves.includes(secondSqr))return true;
        }
            
        
        return false;
        
    }
    pawn(b,position,white){
        let legal=[];
        const up=(white)?8:-8;
        const left=up-1;
        const right=up+1;
        let takeleft=false;
        let takeright=false;
        if(b[position+left])takeleft=(white)?b[position+left][0]==='b':b[position+left][0]==='w';
        if(b[position+right])takeright=(white)?b[position+right][0]==='b':b[position+right][0]==='w';
        if(takeleft)legal.push(position+left);
        if(takeright)legal.push(position+right);
        if(b[position+up]===null)legal.push(position+up);
        else return legal;
        if(b[position+2*up]===null){
          const double=(white)?Math.floor((position-1)/8)===1:Math.floor((position-1)/8)===6;
          if(double)legal.push(position+2*up);
        }
          return legal;
    }
    rook(b,position,white){
        let legal=[];
        let up=[];
        let down=[];
        let left=[];
        let right=[];
        let pseudoLegal=[up,down,left,right];
        
        let move=position;
        while(move<64){up.push(move);move+=8;}
        move=position;
        while(move>0){down.push(move) ;move-=8;}
        let leftend=Math.floor((position-1)/8)*8+1;
        let rightend=(1+Math.floor((position-1)/8))*8;
        move=position;
        while(move>=leftend){left.push(move) ;move-=1;}
        move=position;
        while(move<=rightend){right.push(move) ;move+=1;}
        
        up.splice(up.indexOf(position),1);
        down.splice(down.indexOf(position),1);
        left.splice(left.indexOf(position),1);
        right.splice(right.indexOf(position),1);
      
      
      
        for(let array in pseudoLegal){
          array=pseudoLegal[array];
          for(let pos in array){
            pos=array[pos];
            if(!b[pos]){legal.push(pos);continue;}
            const takeable=(white)?b[pos][0]==='b':b[pos][0]==='w';
            if(takeable){legal.push(pos);break;}
            const stop=(white)?b[pos][0]==='w':b[pos][0]==='b';
            if(stop)break;
          }
        }
        return legal
    }
    bishop(b, position, white) {
        const legal = [];
        const nw = [];
        const ne = [];
        const sw = [];
        const se = [];
        const pseudoLegal = [nw, ne, sw, se];
        let move = position;
      
        while (move % 8 !== 1 && move > 0) {
          nw.push(move);
          move -= 7;
        }
        move = position;
      
        while (move % 8 !== 0 && move > 0) {
          ne.push(move);
          move -= 9;
        }
        move = position;
        while (move % 8 !== 1 && move < 65) {
          sw.push(move);
          move += 9;
        }
        move = position;
        while (move % 8 !== 0 && move < 65) {
          se.push(move);
          move += 7;
        }
        nw.splice(nw.indexOf(position), 1);
        ne.splice(ne.indexOf(position), 1);
        sw.splice(sw.indexOf(position), 1);
        se.splice(se.indexOf(position), 1);
        for (const array of pseudoLegal) {
          for (const pos of array) {
            if (!b[pos]) {
              legal.push(pos);
            } else {
              const takeable = white ? b[pos][0] === 'b' : b[pos][0] === 'w';
              if (takeable) {
                legal.push(pos);
                break;
              }
              const stop = white ? b[pos][0] === 'w' : b[pos][0] === 'b';
              if (stop) break;
            }
          }
        }
      
        return legal;
    }
    knight(b, position, white) {
        const legal = [];
        const moves = [-17, -15, -10, -6, 6, 10, 15, 17];
        for (const move of moves) {
          const destination = position + move;
          if (
            destination >= 1 &&
            destination <= 64 &&
            Math.abs((destination - 1) % 8 - (position - 1) % 8) <= 2
          ) {
            if (!b[destination] || (white ? b[destination][0] === 'b' : b[destination][0] === 'w')) {
              legal.push(destination);
            }
          }
        }
      
        return legal;
    }
    queen(b, position, white) {
        const legal = [];
        const pseudoLegal = [];
        const rookMoves = this.rook(b, position, white);
        const bishopMoves = this.bishop(b, position, white);
        pseudoLegal.push(...rookMoves, ...bishopMoves);
        for (const move of pseudoLegal) {
          if (!b[move]) {
            legal.push(move);
          } else {
            const takeable = white ? b[move][0] === 'b' : b[move][0] === 'w';
            if (takeable) {
              legal.push(move);
            }
          }
        }
      
        return legal;
    }
    king(b, position, white) {
        const legal = [];
        const moves = [-9, -8, -7, -1, 1, 7, 8, 9]; 
        for (const move of moves) {
          const destination = position + move;
          if (
            destination >= 1 &&
            destination <= 64 &&
            Math.abs((destination - 1) % 8 - (position - 1) % 8) <= 1
          ) {
            if (!b[destination] || (white ? b[destination][0] === 'b' : b[destination][0] === 'w')) {
              legal.push(destination);
            }
          }
        }
      
        return legal;
    }
    testerFunc(){
        
    }
}

const game = new ChessGame(0);