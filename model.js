/**
 * Authors:  William Holloway, Jackson Calloway
 *
 * 2-D Rubik's Cube
 * 
 * A two dimensional interpretation of the classical puzzle game.  This 
 * particular program can serve as a learning tool for novices, or as a 
 * challenge for veterans who want fast turns and a complete view of the
 * cube.
 *
 * The layout is similar the layout of a cardboard box.  In order to 
 * understand the rotations, it is highly suggested to try a few movements
 * to get used to stretch in visualization.
 * 
 * To play, click on a particular "node", and then use the arrorw keys to
 * select a direction.
 *
 *
 *
 */

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i] ; 
  } return newObj;
};

function side(color, name) {
	this.face = new Array(3);
	for(i = 0; i < 3; i++){
		this.face[i] = new Array(3);
		for(j = 0; j < 3; j++){
			this.face[i][j] = color;
		}
	}
	this.name = name;
	this.north = null;
	this.east = null;
	this.south = null;
	this.west = null;
	this.back = null;
	this.shadow = this.face.clone();

	
	
	function linkSide(otherSide, direction){
		switch(direction){
		case 'north':
			this.north = otherSide;
			//otherSide.south = this;
			break;
		case 'east':
			this.east = otherSide;
			//otherSide.west = this;
			break;
		case 'south':
			this.south = otherSide;
			//otherSide.north = this;
			break;
		case 'west':
			this.west = otherSide;
			//otherSide.east = this;
			break;
		case 'back':
			this.back = otherSide;
			//otherSide.back = this;
			break;
		}
	}

	this.linkSide = linkSide;

	function update() {
		this.face = this.shadow.clone();
		this.updateFlag = true;
	}


	this.update = update;
	this.updateFlag = false;
	
	function clockwise(){
		var newFace = new Array(3);
		for(i = 0; i < 3; i++){
			newFace[i] = new Array(3);
		}
		newFace[0][0] = this.face[2][0];
		newFace[0][1] = this.face[1][0];
		newFace[0][2] = this.face[0][0];
		newFace[1][0] = this.face[2][1];
		newFace[1][1] = this.face[1][1];
		newFace[1][2] = this.face[0][1];
		newFace[2][0] = this.face[2][2];
		newFace[2][1] = this.face[1][2];
		newFace[2][2] = this.face[0][2];
		this.shadow = newFace;
	}
	this.clockwise = clockwise;
	
	function counterClockwise(){
		var newFace = new Array(3);
		for(i = 0; i < 3; i++){
			newFace[i] = new Array(3);
		}
		newFace[0][0] = this.face[0][2];
		newFace[0][1] = this.face[1][2];
		newFace[0][2] = this.face[2][2];
		newFace[1][0] = this.face[0][1];
		newFace[1][1] = this.face[1][1];
		newFace[1][2] = this.face[2][1];
		newFace[2][0] = this.face[0][0];
		newFace[2][1] = this.face[1][0];
		newFace[2][2] = this.face[2][0];
		this.shadow = newFace;
	}

	this.counterClockwise = counterClockwise;

}

var front = new side('#ff0000', 'front');
var back = new side('#ff9900', 'back');
var roof = new side('cccccc', 'roof');
var floor = new side('#ffff00', 'floor');
var eastWall = new side('#000099', 'eastWall');
var westWall = new side('#009900', 'westWall');


front.linkSide(roof, 'north');
front.linkSide(floor, 'south');
front.linkSide(eastWall, 'east');
front.linkSide(westWall, 'west');
front.linkSide(back, 'back');

back.linkSide(roof, 'north');
back.linkSide(floor, 'south');
back.linkSide(eastWall, 'west');
back.linkSide(westWall, 'east');
back.linkSide(front, 'back');

eastWall.linkSide(roof,'north');
eastWall.linkSide(floor, 'south');
eastWall.linkSide(westWall, 'back');
eastWall.linkSide(front, 'west');
eastWall.linkSide(back, 'east');

westWall.linkSide(roof, 'north');
westWall.linkSide(floor, 'south');
westWall.linkSide(front, 'east');
westWall.linkSide(back, 'west');
westWall.linkSide(eastWall, 'back');

roof.linkSide(back, 'north');
roof.linkSide(front, 'south');
roof.linkSide(eastWall, 'east');
roof.linkSide(westWall, 'west');
roof.linkSide(floor, 'back');

floor.linkSide(front, 'north');
floor.linkSide(back, 'south');
floor.linkSide(eastWall, 'east');
floor.linkSide(westWall, 'west');
floor.linkSide(roof, 'back');

function rotateH(otherSide, row, direction){
	if (otherSide.name === 'roof') {
		if(direction === 'right'){
			for(i=0;i<3;i++){
				otherSide.shadow[row][i] = otherSide.west.face[2-i][row];
				otherSide.back.shadow[2-row][i] = otherSide.east.face[2-i][2-row];
				otherSide.east.shadow[i][2-row] = otherSide.face[row][i];
				//otherSide.east.shadow[i][2-row] = otherSide.face[row][i];
				otherSide.west.shadow[i][row] = otherSide.back.face[2-row][i];
			}
			if(row === 0) {
				otherSide.north.counterClockwise();
			}
			else if(row === 2) {
				otherSide.south.clockwise();
			}
		}
		else if (direction === 'left'){
			for(i=0;i<3;i++){
			//	otherSide.east.shadow[i][2-row] = otherSide.back.face[row][i];
			//	otherSide.shadow[row][i] = otherSide.east.face[2-i][2-row];
			//	otherSide.west.shadow[i][row] = otherSide.face[row][2-i];
			//	otherSide.back.shadow[2-row][i] = otherSide.west.face[i][row];
				otherSide.shadow[row][i] = otherSide.east.face[i][2-row];
				otherSide.west.shadow[i][row] = otherSide.face[row][2-i];
				otherSide.back.shadow[2-row][i] = otherSide.west.face[i][row];
				otherSide.east.shadow[i][2-row] = otherSide.back.face[2-row][2-i];

			}
			if(row === 0) {
				otherSide.north.clockwise();
			}
			else if(row === 2) {
				otherSide.south.counterClockwise();
			}
		}
	}
	else if (otherSide.name === 'floor') {
		if(direction === 'right'){ //this works at the moment
			for(i=0;i<3;i++){
				otherSide.shadow[row][i] = otherSide.west.face[i][2-row];
				otherSide.east.shadow[i][row] = otherSide.face[row][2-i];
				otherSide.back.shadow[2-row][i] = otherSide.east.face[i][row];
				otherSide.west.shadow[i][2-row] = otherSide.back.face[2-row][2-i];
			}
			if(row === 0) {
				otherSide.north.counterClockwise();
			}
			else if(row === 2) {
				otherSide.south.clockwise();
			}
		}
		else if(direction === 'left'){
			for(i=0;i<3;i++){
				otherSide.shadow[row][i] = otherSide.east.face[2-i][row];
				otherSide.west.shadow[i][2-row] = otherSide.face[row][i];
				otherSide.back.shadow[2-row][i] = otherSide.west.face[2-i][2-row];
				otherSide.east.shadow[i][row] = otherSide.back.face[2-row][i];
			}
			if(row === 0) {
				otherSide.north.clockwise();
			}
			else if(row === 2) {
				otherSide.south.counterClockwise();
			}
		}
	}

	else {
		if(direction === 'right'){
			for(i=0;i<3;i++){
				otherSide.shadow[row][i] = otherSide.west.face[row][i];
				otherSide.east.shadow[row][i] = otherSide.face[row][i];
				otherSide.back.shadow[row][i] = otherSide.east.face[row][i];
				otherSide.west.shadow[row][i] = otherSide.back.face[row][i];
			}
			if(row === 0) {
				otherSide.north.counterClockwise();
			}
			else if(row === 2) {
				otherSide.south.clockwise();
			}
		}
		else if(direction === 'left'){
			for(i=0;i<3;i++){
				otherSide.shadow[row][i] = otherSide.east.face[row][i];
				otherSide.west.shadow[row][i] = otherSide.face[row][i];
				otherSide.back.shadow[row][i] = otherSide.west.face[row][i];
				otherSide.east.shadow[row][i] = otherSide.back.face[row][i];
			}
			if(row === 0) {
				otherSide.north.clockwise();
			}
			else if(row === 2) {
				otherSide.south.counterClockwise();
			}
		}
	}
}


function rotateV(otherSide, col, direction){
	if(direction === 'up'){
		for(i=0;i<3;i++){
			if(otherSide.name === "eastWall"){
					otherSide.shadow[i][col] = otherSide.south.face[col][2-i];
					otherSide.north.shadow[2-col][i] = otherSide.face[i][col];
					otherSide.back.shadow[i][2-col] = otherSide.north.face[2-col][2-i];
					otherSide.south.shadow[col][i] = otherSide.back.face[i][2-col];
			}
			else if(otherSide.name === "westWall"){
					otherSide.shadow[i][col] = otherSide.south.face[2-col][i];
					otherSide.north.shadow[col][i] = otherSide.face[2-i][col];
					otherSide.back.shadow[i][2-col] = otherSide.north.face[col][i];
					otherSide.south.shadow[2-col][i] = otherSide.back.face[2-i][2-col];
	
					//otherSide.south.shadow[2-col][i] = otherSide.back.face[2-i][2-col];
			}
			else if(otherSide.name === "roof"){
				otherSide.shadow[i][col] = otherSide.south.face[i][col];
				otherSide.north.shadow[2-i][2-col] = otherSide.face[i][col];
				otherSide.back.shadow[i][col] = otherSide.north.face[2-i][2-col];
				otherSide.south.shadow[i][col] = otherSide.back.face[i][col];
	
			}
			else if(otherSide.name === "floor"){
				otherSide.shadow[i][col] = otherSide.south.face[2-i][2-col];
				otherSide.north.shadow[i][col] = otherSide.face[i][col];
				otherSide.back.shadow[i][col] = otherSide.north.face[i][col];
				otherSide.south.shadow[i][2-col] = otherSide.back.face[2-i][col];
			}
			else if(otherSide.name === "back") {
				otherSide.shadow[i][col] = otherSide.south.face[2-i][2-col];
				otherSide.north.shadow[i][2-col] = otherSide.face[2-i][col];
				otherSide.back.shadow[i][2-col] = otherSide.north.face[i][2-col];
				otherSide.south.shadow[i][2-col] = otherSide.back.face[i][2-col];
			}
			else{
			otherSide.shadow[i][col] = otherSide.south.face[i][col];
			otherSide.north.shadow[i][col] = otherSide.face[i][col];
			otherSide.back.shadow[i][2-col] = otherSide.north.face[2-i][col];
			otherSide.south.shadow[i][col] = otherSide.back.face[2-i][2-col];
			}
		}
		if(col === 0) {
			otherSide.west.counterClockwise();
		}
		else if(col === 2) {
			otherSide.east.clockwise();
		}
	}
	else if(direction === 'down'){
		for(i=0;i<3;i++){
			if(otherSide.name === "eastWall"){

				otherSide.shadow[i][col] = otherSide.north.face[2-col][i];
				otherSide.south.shadow[col][i] = otherSide.face[2-i][col];
				otherSide.back.shadow[i][2-col] = otherSide.south.face[col][i];
				otherSide.north.shadow[2-col][i] = otherSide.back.face[2-i][2-col];
		
			}
			else if (otherSide.name === "westWall") {
				otherSide.shadow[i][col] = otherSide.north.face[col][2-i];
				otherSide.south.shadow[2-col][i] = otherSide.face[i][col];
				otherSide.back.shadow[i][2-col] = otherSide.south.face[2-col][2-i];
				otherSide.north.shadow[col][i] = otherSide.back.face[i][2-col];

			}
			else if(otherSide.name === "roof"){
				otherSide.shadow[2-i][col] = otherSide.north.face[i][2-col];
				otherSide.north.shadow[2-i][2-col] = otherSide.back.face[i][col];
				otherSide.back.shadow[i][col] = otherSide.south.face[i][col];
				otherSide.south.shadow[i][col] = otherSide.face[i][col];
	
			}
			else if (otherSide.name === "floor") {
				otherSide.shadow[i][col] = otherSide.north.face[i][col];
				otherSide.north.shadow[i][col] = otherSide.back.face[i][col];
				otherSide.back.shadow[i][col] = otherSide.south.face[2-i][2-col];
				otherSide.south.shadow[i][2-col] = otherSide.face[2-i][col];
			}
			else if(otherSide.name === "back") {
				otherSide.shadow[i][col] = otherSide.north.face[2-i][2-col];
				otherSide.south.shadow[i][2-col] = otherSide.face[2-i][col];
				otherSide.back.shadow[i][2-col] = otherSide.south.face[2-i][2-col];
				otherSide.north.shadow[i][2-col] = otherSide.back.face[2-i][2-col];
			}

			else{
				otherSide.shadow[i][col] = otherSide.north.face[i][col];
				otherSide.south.shadow[i][col] = otherSide.face[i][col];
				otherSide.back.shadow[i][2-col] = otherSide.south.face[2-i][col];
				otherSide.north.shadow[i][col] = otherSide.back.face[2-i][2-col];
			}
		}
		if(col === 0) {
			otherSide.west.clockwise();
		}
		else if(col === 2) {
			otherSide.east.counterClockwise();
		}
	}
}

function updateAll() {
	roof.update();
	floor.update();
	eastWall.update();
	westWall.update();
	front.update();
	back.update();
}















