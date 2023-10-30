const piecesPos={};
  
function setPiecePosition(piece,id) {
    const[col,row]=idToGrid(id);
    piecesPos[((row-1)*8+col)] = piece;
}
function setupStartingPosition() {
    setPiecePosition("wrook", "a1");
    setPiecePosition("wknight", "b1");
    setPiecePosition("wbishop", "c1");
    setPiecePosition("wqueen", "d1");
    setPiecePosition("wking", "e1");
    setPiecePosition("wbishop", "f1");
    setPiecePosition("wknight", "g1");
    setPiecePosition("wrook", "h1");
    setPiecePosition("brook", "a8");
    setPiecePosition("brook", "h8");
    setPiecePosition("bknight", "b8");
    setPiecePosition("bknight", "g8");
    setPiecePosition("bbishop", "c8");
    setPiecePosition("bbishop", "f8");
    setPiecePosition("bqueen", "d8");
    setPiecePosition("bking", "e8");
    
    const alphabet="abcdefgh";
    for (let col = 1; col <= 8; col++) {
        setPiecePosition("wpawn"+`${col}`, `${alphabet[col - 1]}2`);
    }
    for (let col = 1; col <= 8; col++) {
        setPiecePosition("bpawn"+`${col}`, `${alphabet[col - 1]}7`);
    }
    for (let row = 3; row <= 6; row++) {
        for (let col = 1; col <= 8; col++) {
            setPiecePosition(null, `${alphabet[col - 1]}${row}`);
        }
    }

    
    
    
}
function idToGrid(id){
    const col = id[0].toLowerCase().charCodeAt(0) - 96; 
    const row = parseInt(id[1]);
    return [col, row];
}
function idToDict(id){
  const[col,row]=idToGrid(id);
  return ((row-1)*8+col)
}
function dictToId(number){
  const row = Math.floor((number - 1) / 8) + 1;
  const col = (number - 1) % 8 + 1;
  return `${String.fromCharCode(96+col)}${row}`;
}
function pawn(b,position,white){
  legal=[];
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
function rook(b,position,white){
  legal=[];
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
    for(pos in array){
      pos=array[pos];
      if(!b[pos]){legal.push(pos);continue;}
      const takeable=(white)?b[pos][0]==='b':b[pos]==='w';
      if(takeable){legal.push(pos);break;}
      const stop=(white)?b[pos][0]==='w':b[pos]==='b';
      if(stop)break;
    }
  }
  return legal
}
function bishop(b, position, white) {
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
function queen(b, position, white) {
  const legal = [];
  const pseudoLegal = [];
  const rookMoves = rook(b, position, white);
  const bishopMoves = bishop(b, position, white);
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
function king(b, position, white) {
  const legal = [];
  const moves = [-9, -8, -7, -1, 1, 7, 8, 9]; 
  for (const move of moves) {
    const destination = position + move;

    if (destination >= 1 && destination <= 64) {
      if (!b[destination]) {
        legal.push(destination);
      } else {
        const takeable = white ? b[destination][0] === 'b' : b[destination][0] === 'w';
        if (takeable) {
          legal.push(destination);
        }
      }
    }
  }

  return legal;
}
function knight(b, position, white) {
  const legal = [];
  const moves = [-17, -15, -10, -6, 6, 10, 15, 17];
  for (const move of moves) {
    const destination = position + move;
    if (destination >= 1 && destination <= 64) {
      const legalRow = Math.floor((destination - 1) / 8);
      const currentRow = Math.floor((position - 1) / 8);
      const rowDiff = Math.abs(legalRow - currentRow);
      if (rowDiff === 1 || rowDiff === 2) {
        if (!b[destination] || (white ? b[destination][0] === 'b' : b[destination][0] === 'w')) {
          legal.push(destination);
        }
      }
    }
  }

  return legal;
}








setupStartingPosition();
const p=knight(piecesPos,18,true);
for (const o in p) {
  console.log(p[o])
}








