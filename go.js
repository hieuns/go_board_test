var topLeftX = 40, topLeftY = 40, interval = 30, numLines = 19,
  currentMode, currentPieceColor, boardData, moveData;
var modes = {SAME_COLOR: "same color", CHANGE_COLOR: "change color"},
  pieceColors = {BLACK: "black", WHITE: "white"};

var canvas = document.getElementById("go_board");
var context = canvas.getContext("2d");

function drawBoardLines(ctx) {
  var i, drawPoint, drawLength;
  drawLength = (numLines - 1) * interval + topLeftX;

  for (i = 0; i < numLines; i++) {
    drawPoint = topLeftX + i * interval;
    ctx.moveTo(drawPoint, topLeftY);
    ctx.lineTo(drawPoint, drawLength);
    ctx.stroke();
  }

  for (i = 0; i < numLines; i++) {
    drawPoint = topLeftY + i * interval;
    ctx.moveTo(topLeftX, drawPoint);
    ctx.lineTo(drawLength, drawPoint);
    ctx.stroke();
  }
}

function drawStarPoints(ctx) {
  var starPos = [3, 9, 15], i, j, posX, posY;
  for (i = 0; i < starPos.length; ++i) {
    for (j = 0; j < starPos.length; ++j) {
      posX = starPos[i] * interval + topLeftX;
      posY = starPos[j] * interval + topLeftY;
      ctx.beginPath();
      ctx.arc(posX, posY, interval / 8, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function drawBoard(c, ctx) {
  drawBoardLines(ctx);
  drawStarPoints(ctx);
  drawMode(c, ctx);
  drawColor(c, ctx);
}

function drawPiece(boardX, boardY, ctx, color) {
  var posX = boardX * interval + topLeftX,
    posY = boardY * interval + topLeftY,
    oldStrokeStyle = context.strokeStyle,
    oldFillStyle = context.fillStyle;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(posX, posY, (interval - 2) / 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  ctx.stroke();

  ctx.fillStyle = oldFillStyle;
  ctx.strokeStyle = oldStrokeStyle;
}

function redrawBoard(c, ctx) {
  var i, j;
  ctx.clearRect(0, 0, c.width, c.height);
  drawBoard(c, ctx);
  for (i = 0; i < numLines; ++i) {
    for (j = 0; j < numLines; ++j) {
      if (existPiece(i, j)) {
        drawPiece(i, j, ctx, boardData[i][j].color);
      }
    }
  }
}

function clearBoard(c, ctx) {
  var i, j;
  for (i = 0; i < numLines; ++i) {
    for (j = 0; j < numLines; ++j) {
      boardData[i][j] = null;
    }
  }
  moveData = [];
  redrawBoard(c, ctx);
}

function drawMode(c, ctx) {
  var x = 20, y = c.height - 20;
  ctx.clearRect(x, y - 20, 130, 30);
  ctx.font = "15px Arial";
  ctx.fillText("Mode: " + currentMode, x, y);
}

function drawColor(c, ctx) {
  var x = c.width - 140, y = c.height - 20;
  ctx.clearRect(x, y - 20, 130, 30);
  ctx.font = "15px Arial";
  ctx.fillText("Current color: " + currentPieceColor, x, y);
}

function existPiece(x, y) {
  if (boardData[x][y] != null && boardData[x][y] != undefined) {
    return true;
  }
}

function changeNextColor(){
  if (currentMode != modes.SAME_COLOR) {
    if (currentPieceColor == pieceColors.BLACK) {
      currentPieceColor = pieceColors.WHITE;
    } else {
      currentPieceColor = pieceColors.BLACK;
    }
  }
}

function addPiece(x, y, color) {
  boardData[x][y] = {color: color};
}

function addMove(boardX, boardY) {
  moveData.push({x: boardX, y: boardY});
}

function mouseClick(e) {
  var c = e.target, ctx = c.getContext("2d"),
    canvasBoundingRect = c.getBoundingClientRect(),
    x = e.pageX - canvasBoundingRect.left - topLeftX,
    y = e.pageY - canvasBoundingRect.top - topLeftY,
    halfInterval = interval / 2,
    boundRight = (numLines - 1) * interval,
    boundBottom = (numLines - 1) * interval;
  if (x >= 0 && y >= 0 && x <= boundRight && y <= boundBottom) {
    x = Math.floor((x + halfInterval) / interval);
    y = Math.floor((y + halfInterval) / interval);

    if (existPiece(x, y)) {
      return;
    }
    addPiece(x, y, currentPieceColor);
    addMove(x, y);
    changeNextColor();
    redrawBoard(c, ctx);
  }
}

function keyPress(e) {
  var c = e.target, ctx = c.getContext("2d");

  switch (e.charCode) {
    case 49:
      if (currentPieceColor == pieceColors.BLACK) {
        currentPieceColor = pieceColors.WHITE;
      } else {
        currentPieceColor = pieceColors.BLACK;
      }
      drawColor(c, ctx);
      break;
    case 32:
      if (currentMode == modes.CHANGE_COLOR) {
        currentMode = modes.SAME_COLOR;
      } else {
        currentMode = modes.CHANGE_COLOR;
      }
      drawMode(c, ctx);
      break;
    case 106:
      mData = moveData.pop();
      if (mData != undefined) {
        boardData[mData.x][mData.y] = null;
        redrawBoard(c, ctx);
      }
      break;
  }

  if (e.keyCode == 8) {
    clearBoard(c, ctx);
  }
}

function init(c, ctx) {
  currentMode = modes.CHANGE_COLOR;
  currentPieceColor = pieceColors.BLACK;
  boardData = new Array(numLines);
  for (var i = 0; i < numLines; ++i) {
    boardData[i] = new Array(numLines);
  }
  moveData = [];
  drawBoard(c, ctx);
}

canvas.addEventListener("click", mouseClick, false);
canvas.addEventListener("keypress", keyPress, false);
init(canvas, context);
