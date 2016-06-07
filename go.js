var topLeftX = 40, topLeftY = 40, interval = 30, numLines = 19,
  currentColorMode, currentPieceMode, currentPieceColor, boardData, moveData;
var colorModes = {SAME_COLOR: "same color", CHANGE_COLOR: "change color"},
  pieceModes = {PLACE: "place", REMOVE: "remove"},
  pieceColors = {BLACK: "black", WHITE: "white"};

var canvas = document.getElementById("go_board");
var context = canvas.getContext("2d");

function drawBoardLines(ctx) {
  var i, drawPointX, drawPointY, drawLength;
  drawLength = (numLines - 1) * interval + topLeftX;

  for (i = 0; i < numLines; i++) {
    drawPointX = topLeftX + i * interval;
    ctx.beginPath();
    ctx.moveTo(drawPointX, topLeftY);
    ctx.lineTo(drawPointX, drawLength);
    ctx.closePath();
    ctx.stroke();

    drawPointY = topLeftY + i * interval;
    ctx.beginPath();
    ctx.moveTo(topLeftX, drawPointY);
    ctx.lineTo(drawLength, drawPointY);
    ctx.closePath();
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
  drawColorMode(c, ctx);
  drawColor(c, ctx);
  drawPieceMode(c, ctx);
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
        drawPiece(i, j, ctx, boardData[i][j]);
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

function drawColorMode(c, ctx) {
  var x = 40, y = c.height - 20;
  ctx.clearRect(x, y - 20, 170, 30);
  ctx.font = "15px Arial";
  ctx.fillText("Color mode: " + currentColorMode, x, y);
}

function drawColor(c, ctx) {
  var x = 260, y = c.height - 20;
  ctx.clearRect(x, y - 20, 130, 30);
  ctx.font = "15px Arial";
  ctx.fillText("Current color: " + currentPieceColor, x, y);
}

function drawPieceMode(c, ctx) {
  var x = 440, y = c.height - 20;
  ctx.clearRect(x, y - 20, 150, 30);
  ctx.font = "15px Arial";
  ctx.fillText("Pieces Mode: " + currentPieceMode, x, y);
}

function existPiece(x, y) {
  if (boardData[x][y] != null && boardData[x][y] != undefined) {
    return true;
  }
}

function changeNextColor(){
  if (currentColorMode != colorModes.SAME_COLOR) {
    if (currentPieceColor == pieceColors.BLACK) {
      currentPieceColor = pieceColors.WHITE;
    } else {
      currentPieceColor = pieceColors.BLACK;
    }
  }
}

function addPiece(x, y, color) {
  boardData[x][y] = color;
}

function removePiece(x, y) {
  var color = boardData[x][y];
  boardData[x][y] = null;
  return color;
}

function addMove(boardX, boardY, type, color) {
  moveData.push({x: boardX, y: boardY, type: type, color: color});
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

    var exist = existPiece(x, y);

    if (currentPieceMode == pieceModes.PLACE && !exist) {
      addPiece(x, y, currentPieceColor);
      addMove(x, y, currentPieceMode, currentPieceColor);
      changeNextColor();
      redrawBoard(c, ctx);
    } else if (currentPieceMode == pieceModes.REMOVE && exist) {
      var pieceColor = removePiece(x, y);
      addMove(x, y, currentPieceMode, pieceColor);
      redrawBoard(c, ctx);
    }
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
    case 50:
      if (currentPieceMode == pieceModes.PLACE) {
        currentPieceMode = pieceModes.REMOVE;
      } else {
        currentPieceMode = pieceModes.PLACE;
      }
      drawPieceMode(c, ctx);
      break;
    case 32:
      if (currentColorMode == colorModes.CHANGE_COLOR) {
        currentColorMode = colorModes.SAME_COLOR;
      } else {
        currentColorMode = colorModes.CHANGE_COLOR;
      }
      drawColorMode(c, ctx);
      break;
    case 106:
      mData = moveData.pop();
      if (mData != undefined) {
        if (mData.type == pieceModes.PLACE) {
          boardData[mData.x][mData.y] = null;
        } else {
          boardData[mData.x][mData.y] = mData.color;
        }
        redrawBoard(c, ctx);
      }
      break;
    case 51:
      clearBoard(c, ctx);
      break;
  }
}

function init(c, ctx) {
  currentColorMode = colorModes.CHANGE_COLOR;
  currentPieceColor = pieceColors.BLACK;
  currentPieceMode = pieceModes.PLACE;
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
canvas.focus();
