function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
var test2;

//load images
var rootPath = "";
var imagePath = "images/";
var bpImage = new Image(); 
bpImage.src = rootPath + imagePath + "bp.png";

var bnImage = new Image(); 
bnImage.src = rootPath + imagePath + "bn.png";

var bbImage = new Image(); 
bbImage.src = rootPath + imagePath + "bb.png";

var brImage = new Image(); 
brImage.src = rootPath + imagePath + "br.png";

var bqImage = new Image(); 
bqImage.src = rootPath + imagePath + "bq.png";

var bkImage = new Image(); 
bkImage.src = rootPath + imagePath + "bk.png";


var wpImage = new Image(); 
wpImage.src = rootPath + imagePath + "wp.png";

var wnImage = new Image(); 
wnImage.src = rootPath + imagePath + "wn.png";

var wbImage = new Image(); 
wbImage.src = rootPath + imagePath + "wb.png";

var wrImage = new Image(); 
wrImage.src = rootPath + imagePath + "wr.png";

var wqImage = new Image(); 
wqImage.src = rootPath + imagePath + "wq.png";

var wkImage = new Image(); 
wkImage.src = rootPath + imagePath + "wk.png";

function numberToPiece(num) {
	switch(num) {
		case 0:
		  return "P";
		  break;
		case 1:
		  return "N";
		  break;
		case 2:
		  return "B";
		  break;  
		case 3:
		  return "R";
		  break;
		case 4:
		  return "Q";
		  break;
		default:
			return false;
	}
}

function getPieceImage(piece) {
	var image = piece.color + piece.type;
	return getImage(image);	
}
function getImage(string) {
	switch(string) {
		case "bP":
		  return bpImage;
		  break;
		case "bN":
		  return bnImage;
		  break;
		case "bB":
		  return bbImage;
		  break;  
		case "bR":
		  return brImage;
		  break;
		case "bQ":
		  return bqImage;
		  break;
		case "bK":
		  return bkImage;
		  break;
		  
		case "wP":
		  return wpImage;
		  break;
		case "wN":
		  return wnImage;
		  break;
		case "wB":
		  return wbImage;
		  break;  
		case "wR":
		  return wrImage;
		  break;
		case "wQ":
		  return wqImage;
		  break;
		case "wK":
		  return wkImage;
		  break;
		default:
		  return null;
	}
}

//Albert's test function
/*
function test1 (asd) {
test2 = false;
	console.time("Array initialize");
	var array= new Array(10000);
	for (var i = array.length - 1; i >= 0; i--) {
		array[i] = asd;
		if(array[i+1] == "king") {
			test2 = true;
		}
	}
	console.timeEnd("Array initialize");	
}
*/



function Board (name, boardCanvas, piecesCanvas, movingCanvas, boardXOffset, boardYOffset, color1, color2, moveColor, dragEnabled, onMoveCallback) {	    
    this.name = name;
	
	this.graveSpaceSize = 40;
	
	this.xOffset = boardXOffset;
	this.yOffset = boardYOffset;
	
	this.graveXPad = 0;
	this.graveYPad = 5;
	
	this.boardXOffset = boardXOffset;
	this.boardYOffset = boardYOffset + this.graveSpaceSize + this.graveYPad;
    
	console.log("test:"+boardYOffset);
	//this.boardYOffset = 0 ;
	this.boardCanvas = boardCanvas;
	this.piecesCanvas = piecesCanvas;
	this.movingCanvas = movingCanvas;
	
	this.boardColor1=color1; //top left square
	this.boardColor2=color2;
	
	this.onMoveCallback = onMoveCallback;
    
    this.boardCtx = this.boardCanvas.getContext("2d");
	this.piecesCtx = this.piecesCanvas.getContext("2d");
	this.movingCtx = this.movingCanvas.getContext("2d");
	
	this.spaceSize = 40;
	this.isMoving = false;
	this.moveColor = moveColor;
	this.dragEnabled = dragEnabled;
	this.canCastleRightWhite = true;
	this.canCastleLeftWhite = true;
	this.canCastleLeftBlack = true;
	this.canCastleRightBlack = true;
	this.setupBoard();
}

Board.prototype.clearBoard = function () {
	this.spaces = new Array();

	for(var x=0; x<8; x++) {
		this.spaces[x] = new Array();
		for(var y=0; y<8; y++) {
			this.spaces[x][y] = new Space(x,y);
		}
	}
	this.whiteGrave = new Array(6);
	this.blackGrave = new Array(6);
	this.whiteGraveNum = new Array(5);
	this.blackGraveNum = new Array(5);
	
	this.whiteDead = new Array(6);
	this.blackDead = new Array(6)
	
	for (var x=0; x<6; x++) {
		this.whiteDead[x] = 0;
		this.blackDead[x] = 0;
	}
}

Board.prototype.drawGrave = function() {
	this.piecesCtx.clearRect(this.BoardXOffset + this.graveXPad, this.boardYOffset + this.spaceSize*8 + this.graveYPad,
								this.graveSpaceSize * 7, this.graveSpaceSize+3);
	

	for(var x=0; x<5; x++) {
		if(this.whiteDead[x] > 0) {
			var piece = numberToPiece(x);
			var img = getPieceImage("w" + piece);
			this.piecesCtx.drawImage(img, this.boardXOffset + this.graveXPad + this.graveSpaceSize*.5 - img.width/2, 
											this.boardYOffset + (this.spaceSize * (7-y)) + .95*this.spaceSize-img.height);
			
			
		}
	}
	
	
	i=0;
	
	
	
}

Board.prototype.removeFromGrave = function (color, piece) {
	if (color == "w") {
		switch(piece) {
			case "P":
			  this.whiteDead[0] = Math.max(0, this.whiteDead[0]-1);
			  break;
			case "N":
			  this.whiteDead[1] = Math.max(0, this.whiteDead[1]-1);
			  break;
			case "B":
			  this.whiteDead[2] = Math.max(0, this.whiteDead[2]-1);
			  break;  
			case "R":
			  this.whiteDead[3] = Math.max(0, this.whiteDead[3]-1);
			  break;
			case "Q":
			  this.whiteDead[4] = Math.max(0, this.whiteDead[4]-1);
			  break;
			default:
				return false;
		}
	} else if (color == "black") {
		switch(piece) {
			case "P":
			  this.blackDead[0] = Math.max(0, this.blackDead[0]-1);
			  break;
			case "N":
			  this.blackDead[1] = Math.max(0, this.blackDead[1]-1);
			  break;
			case "B":
			  this.blackDead[2] = Math.max(0, this.blackDead[2]-1);
			  break;  
			case "R":
			  this.blackDead[3] = Math.max(0, this.blackDead[3]-1);
			  break;
			case "Q":
			  this.blackDead[4] = Math.max(0, this.blackDead[4]-1);
			  break;
			default:
				return false;
		}
	} else {
		return false;
	}
	return true;
}
Board.prototype.sendToGrave = function (color, piece) {

	if (color == "w") {
		switch(piece) {
			case "P":
			  this.whiteGrave[0]++;
			  break;
			case "N":
			  this.whiteGrave[1]++;
			  break;
			case "B":
			  this.whiteGrave[2]++;
			  break;  
			case "R":
			  this.whiteGrave[3]++;
			  break;
			case "Q":
			  this.whiteGrave[4]++;
			  break;
			default:
				return false;
		}
	} else if (color == "black") {
		switch(piece) {
			case "P":
			  this.blackGrave[0]++;
			  break;
			case "N":
			  this.blackGrave[1]++;
			  break;
			case "B":
			  this.blackGrave[2]++;
			  break;  
			case "R":
			  this.blackGrave[3]++;
			  break;
			case "Q":
			  this.blackGrave[4]++;
			  break;
			default:
				return false;
		}
	} else {
		return false;
	}
	return true;
}

Board.prototype.setupBoard = function () {
	this.clearBoard();	
	
	for(var x=0; x<8; x++) {
		this.spaces[x][1].piece = new Piece("w", "P");
		this.spaces[x][6].piece = new Piece("b", "P");
	}
	
	this.spaces[0][0].piece = new Piece("w", "R");
	this.spaces[1][0].piece = new Piece("w", "N");
	this.spaces[2][0].piece = new Piece("w", "B");
	this.spaces[3][0].piece = new Piece("w", "Q");
	this.spaces[4][0].piece = new Piece("w", "K");
	this.spaces[5][0].piece = new Piece("w", "B");
	this.spaces[6][0].piece = new Piece("w", "N");
	this.spaces[7][0].piece = new Piece("w", "R");
	
	this.spaces[0][7].piece = new Piece("b", "R");
	this.spaces[1][7].piece = new Piece("b", "N");
	this.spaces[2][7].piece = new Piece("b", "B");
	this.spaces[3][7].piece = new Piece("b", "Q");
	this.spaces[4][7].piece = new Piece("b", "K");
	this.spaces[5][7].piece = new Piece("b", "B");
	this.spaces[6][7].piece = new Piece("b", "N");
	this.spaces[7][7].piece = new Piece("b", "R");
}

Board.prototype.drawAutoMovingPiece = function (x, y) {
	const clearMargin = 5;
	this.movingCtx.clearRect(this.boardXOffset + this.moveLastX - clearMargin, this.boardYOffset + this.moveLastY - clearMargin, this.spaceSize + clearMargin * 2, this.spaceSize + clearMargin * 2);
	
	this.movingCtx.drawImage(this.moveImage, this.boardXOffset + this.moveInitialX + x - this.moveStartX, this.boardYOffset + this.moveInitialY + y - this.moveStartY);
	
	this.moveLastX = this.moveInitialX + x - this.moveStartX;
	this.moveLastY = this.moveInitialY + y - this.moveStartY;
}

/**
 *	x1: x of piece to move
 *	y1: y of piece to move
 *	x2: Board position to move the piece to
 *	y2: Board square to move the piece to
 *	time: how long for the move to take
 */
Board.prototype.movePiece = function (x1, y1, x2, y2, time) {
	this.dragEnabled = false;
	this.moveInitialX = this.spaceSize *  x1;
	this.moveInitialY =  (this.spaceSize * (7-y1));
	
	this.moveImage = getPieceImage(this.spaces[x1][y1].piece);
	this.spaces[x2][y2].piece = this.spaces[x1][y1].piece;
	this.spaces[x1][y1].piece = null;
    if(time>0) {
        this.disablePiece(x1,y1);
        
        
        
        
        this.moveInitialX = this.boardXOffset + this.spaceSize *  x1;
        this.moveInitialY = this.boardXOffset + (this.spaceSize * (7-y1));
        
        this.moveFinalX = this.boardXOffset + this.spaceSize *  x2;
        this.moveFinalY = this.boardXOffset + (this.spaceSize * (7-y2));

        this.moveEndX = x2;
        this.moveEndY = y2;
        
        this.moveLastX = 0;
        this.moveLastY = 0;
        
        this.time = time;
        
        this.start = (new Date()).getTime();
        var that = this;
        requestAnimationFrame(function() {that.animate();});
    } else {
        this.enablePiece(x1, y1);
		this.drawPieces();
		this.dragEnabled = true;
    }
}

Board.prototype.animate = function() {
	var now = (new Date()).getTime();
	var percent = ((now - this.start)/this.time);
	
	console.log(percent);
	if (percent < 1) {
		const clearMargin = 5;
		this.movingCtx.clearRect(this.moveLastX, this.moveLastY, this.spaceSize + clearMargin * 2, this.spaceSize + clearMargin * 2);
		this.moveLastX = (this.moveFinalX-this.moveInitialX) * percent + this.moveInitialX;
		this.moveLastY = (this.moveFinalY-this.moveInitialY) * percent + this.moveInitialY;
		this.movingCtx.drawImage(this.moveImage, this.moveLastX, this.moveLastY);
		
		var that = this;
		requestAnimationFrame(function() {that.animate();});
	} else {
		this.movingCtx.clearRect(0, 0, this.movingCanvas.width, this.movingCanvas.height);
		this.enablePiece(this.moveEndX, this.moveEndY);
		this.drawPieces();
		this.dragEnabled = true;
	}
}

Board.prototype.getPiece = function (x, y) {
	x -= this.boardXOffset;
	y -= this.boardYOffset;
	
	x = Math.floor(x/this.spaceSize);
	y = Math.floor(y/this.spaceSize);
	if(x>7||x<0||y>7||y<0) {
		return null;
	}
	return this.spaces[x][7-y];
}
Board.prototype.drawBoard = function () {
	//board border
	this.boardCtx.strokeStyle = '#000000';
	this.boardCtx.rect(this.boardXOffset-1, this.boardYOffset-1, this.spaceSize*8+2, this.spaceSize*8+2);
	this.boardCtx.lineWidth = 1;
	
	//draw checkered squares
	for(var a=0;a<8;a++) {
		for(var i=0; i<8;i+=1) {
		  startX = i * this.spaceSize;
		  if((i%2)-(a%2)==0) this.boardCtx.fillStyle=this.boardColor1;
		  else this.boardCtx.fillStyle=this.boardColor2;
		this.boardCtx.fillRect(startX + this.boardXOffset, this.boardYOffset+(a*this.spaceSize) ,this.spaceSize,this.spaceSize);
		}
	}
	this.boardCtx.stroke();
}
Board.prototype.startMove = function (x, y) {
	if(this.dragEnabled & this.isMoving == false) {
		this.moveStartX = x;
		this.moveStartY = y;
		this.moveLastX = x;
		this.moveLastY = y;
		this.moveStartSpace = this.getPiece(x, y);
		
		if(this.moveStartSpace == null || this.moveStartSpace.piece == null || this.moveStartSpace.piece.color != this.moveColor) {
			return false;
		}
		
		//console.log(this.moveStartSpace);
		this.moveInitialX = this.spaceSize *  this.moveStartSpace.x;
		this.moveInitialY =  (this.spaceSize * (7-this.moveStartSpace.y));
		this.isMoving = true;

		var img = getPieceImage(this.moveStartSpace.piece);	
		this.moveImage = img;
		
		this.disablePiece(this.moveStartSpace.x, this.moveStartSpace.y);
		this.drawMovingPiece(x,y);
	}
}

Board.prototype.endMove = function (x, y) {
	if(this.isMoving) {
		this.isMoving = false;
		console.log("x:" + x + " y:" + y);
		var tempX = this.boardXOffset + this.moveInitialX + (x - this.moveStartX) + this.spaceSize/2;
		var tempY = this.boardYOffset + this.moveInitialY + (y - this.moveStartY) + this.spaceSize/2;
		console.log("x:" + tempX +
						" y:" + tempY);
		this.movingCtx.clearRect(0, 0, this.movingCanvas.width, this.movingCanvas.height);
		// var endSpace = this.getPiece(this.boardXOffset + this.moveInitialX + (x - this.moveStartX) + this.moveImage.x/2, 
										// this.boardYOffset + this.moveInitialY + (y - this.moveStartY)) + this.moveImage.y/2;
		
        
        
        var endSpace = this.getPiece(tempX, tempY); 				
		if(endSpace != null && endSpace != this.moveStartSpace && 
				this.isLegal(this.moveStartSpace.x, this.moveStartSpace.y, endSpace.x, endSpace.y)) {
			
			console.log(this.moveStartSpace);
			this.spaces[endSpace.x][endSpace.y].piece = this.moveStartSpace.piece;
			this.spaces[this.moveStartSpace.x][this.moveStartSpace.y].piece = null;
            
            if (this.onMoveCallback!=null) {
                this.onMoveCallback(this.moveStartSpace, endSpace)
            }
            
			this.drawPieces();
		} else {
			this.spaces[this.moveStartSpace.x][this.moveStartSpace.y].piece.type.visible = true;
			this.drawPieces();
			return false;
		}
	}
}

Board.prototype.drawMovingPiece = function (x, y) {
	const clearMargin = 5;
	this.movingCtx.clearRect(this.boardXOffset + this.moveLastX - clearMargin, this.boardYOffset + this.moveLastY - clearMargin, this.spaceSize + clearMargin * 2, this.spaceSize + clearMargin * 2);
	
	this.movingCtx.drawImage(this.moveImage, this.boardXOffset + this.moveInitialX + x - this.moveStartX, this.boardYOffset + this.moveInitialY + y - this.moveStartY);
	
	this.moveLastX = this.moveInitialX + x - this.moveStartX;
	this.moveLastY = this.moveInitialY + y - this.moveStartY;
}
Board.prototype.disablePiece = function (x, y) {
	this.clearPiece(x, y);
	this.spaces[x][y].visible = false;
}

Board.prototype.enablePiece = function (x, y) {
	this.spaces[x][y].visible = true;
}

Board.prototype.clearPiece = function (x, y) {
	this.piecesCtx.clearRect(this.boardXOffset + this.spaceSize * x, this.boardYOffset + (this.spaceSize * (7-y)), this.spaceSize, this.spaceSize);
}
Board.prototype.drawPieces  = function () {
	this.piecesCtx.clearRect(this.boardXOffset, this.boardYOffset, this.spaceSize*10, this.spaceSize*10);
	for(var x=0; x<8; x++) {
		for(var y=0; y<8; y++) {
			if(this.spaces[x][y].piece != null) {
				if(this.spaces[x][y].piece.visible) { 
					var img = getPieceImage(this.spaces[x][y].piece);
					
					//console.log(img);
					this.piecesCtx.drawImage(img, this.boardXOffset + this.spaceSize*x+ this.spaceSize*.5 - img.width/2, this.boardYOffset + (this.spaceSize * (7-y)) + .95*this.spaceSize-img.height);
				} else {
					this.piecesCtx.clearRect(this.boardXOffset + this.spaceSize * x, this.boardYOffset + (this.spaceSize * (7-y)), this.spaceSize, this.spaceSize);
				}
			}
		}
	}
}



function isValid(x, y) {
	if (isNaN(x) || isNaN(y) || x<0 || x>7 || y<0 || y>7) {
		return false;
	} else {
		return true;
	}
}
Board.prototype.isInCheck = function(x1, y1, x2, y2){
	//TODO
	return false;
}
Board.prototype.isLegal = function(x1, y1, x2, y2){
	console.log("x1:" + x1 + " y1:" + y1 + " x2:" + x2 + " y2:" + y2);
	if (!isValid(x1, y1) || !isValid(x2, y2)) {
		return false;
	}
	
	if (x1==x2 && y1 == y2) {
		return false;
	}
	
	var piece = this.spaces[x1][y1].piece;
	
	if (piece == null) {
		return false;
	}
	var color = piece.color;
	var type = piece.type;
	if (color == null || type == null) {
		return false;
	}
	
	
	var taking = (this.spaces[x2][y2].piece != null);
	if (taking) {
		if (this.spaces[x2][y2].piece.color == color) {
			return false;
		}
	}
	
	if (this.isInCheck(x1, y1, x2, y2)) {
		return false;
	}
	
	switch (type) {
		case "K":
			if (Math.abs(x2-x1)<=1 && Math.abs(y2-y1)<=1) {
				return true;
			} else {
				if (color == "w") {
					if (x2 == 6 && y2 == 0 && this.canCastleRightWhite == true 
						&& this.spaces[5][0].piece == null && this.spaces[6][0].piece == null) {
						return true;
					} else if (x2 == 2 && y2 ==0 && this.canCastleLeftWhite == true 
						&& this.spaces[3][0].piece == null && this.spaces[2][0].piece == null 
						&& this.spaces[1][0].piece == null) {
						return true;
					} else {
						return false;
					}
				}
				else {
					if (x2 == 6 && y2 == 7 && this.canCastleLeftBlack == true 
						&& this.spaces[5][7].piece == null && this.spaces[6][7].piece == null) {
						return true;
					} else if (x2 == 2 && y2 ==7 && this.canCastleRightBlack == true 
						&& this.spaces[3][7].piece == null && this.spaces[2][7].piece == null 
						&& this.spaces[1][7].piece == null) {
						return true;
					} else {
						return false;
					}
				}
			}
		break;
		
		case "N":
			if (Math.abs(x2-x1) == 1) {
				if (Math.abs(y2-y1) == 2) {
					return true;
				}
			} else if (Math.abs(x2-x1) == 2) {
				if (Math.abs(y2-y1) == 1) {
					return true;
				}
			}	
			return false;
		break;
		
		case "Q":
		case "B":
			if (Math.abs(x1-x2) == Math.abs(y1-y2)) {
				if (x2<x1) {
					var temp = x1;
					x1 = x2;
					x2 = temp;
					temp = y1;
					y1 = y2;
					y2 = temp;
				}
				var dy = (y2>y1) ?  1: -1;
				for (var x = 1; x<x2-x1; x++) {
					if (this.spaces[x1 + x][y1 + dy*x].piece != null) {
						return false;
					}
				}
				return true;
			} else if ( type == "B") {
				return false;
			}
		case "R":
			if (x1 == x2) {
				var min = Math.min(y1, y2);
				var max = Math.max(y1, y2);
				for (var y = min+1; y < max; y++) {
					if(this.spaces[x1][y].piece != null) {
						return false;
					}
				}
				return true;
			} else if (y1 == y2) {
				var min = Math.min(x1, x2);
				var max = Math.max(x1, x2);
				for (var x = min+1; x < max; x++) {
					if(this.spaces[x][y1].piece != null) {
						return false;
					}
				}
				return true;
			} else {
				return false;
			}
		break;
		case "P":
			//TODO enpasant
			
			if (x1 == x2) {
				if (taking) {
					return false;
				} else {
					if (color == "w") {
						if (y2-y1 == 1) {
							return true;
						} else if (y1==1 && y2==3 && this.spaces[x1][2].piece==null) {
							return true;
						} else {
							return false;
						}
					} else {
						if (y1-y2 == 1) {
							return true;
						} else if (y1==6 && y2==4 && this.spaces[x1][5].piece==null) {
							return true;
						} else {
							return false;
						}
					}
				}
			} else if (Math.abs(x2-x1) == 1) {
				if (!taking) {
					return false;
				} else {
					if (color == "w") {
						if (y2-y1 == 1) {
							return true;
						} else {
							return false;
						}
					} else {
						if (y1-y2 == 1) {
							return true;
						} else {
							return false;
						}
					}
				}
			} 
			return false;
		break;
		default:
			return false;
		break;
	}
	return true;
}

function Space(x, y) {
	this.x = x;
	this.y = y;
	this.piece = null;
}

function Piece(color, piece) {
	this.color = color;
	this.type = piece;
	this.visible = true;
}
