/**
* @author david
*/
//pieces
//balck
 
var bRook="images/br.png";
var bKnight="images/bn.png";
var bBishop="images/bb.png";
var bKing="images/bk.png";
var bQueen="images/bq.png";
var bPawn="images/bp.png";
//white
var wRook="images/wr.png";
var wKnight="images/wn.png";
var wBishop="images/wb.png";
var wKing="images/wk.png";
var wQueen="images/wq.png";
var wPawn="images/wp.png";
//other stuff
var turn;
var temp;
var gameID="";
var taken=new Array();
var moveKing=false;
var moveRook1=false;
var moveRook2=false;
var check=false;
var pColor="";
var pUser="";
var answer=false;
var session_id;
var timer=300;
var endgame=false;


function end(user,game,color)
{
	endgame=true;
	//alert("Game Over");
	//clearInterval(timeout_clock);
	//clearInterval(timeout_recieve);
	//throw new Error('Game Over');
}

function randomString(string_length) {
	
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function en_passant(user,game,color,space)
{

$.ajax({
    type: 'POST',
    url: 'en_passant.php',
    data: {user:user,game:game,color:color},
    async : false,
    success : function(result){

answer= false;

var moves= result.split(";");
var counter=0;
//alert(moves);

if(moves[moves.length-1].substring(0,1)=="W")
{
	if(moves[moves.length-1].substring(4,6)==space)
	{
		if(moves[moves.length-1].substring(1,3)==moves[moves.length-1].substring(4,5)+(parseInt(moves[moves.length-1].substring(5,6))-2))
		{
		answer= true;
		}
	}
}
else if(moves[moves.length-1].substring(0,1)=="B")
{
	
	if(moves[moves.length-1].substring(4,6)==space)
	{
		if(moves[moves.length-1].substring(1,3)==moves[moves.length-1].substring(4,5)+(parseInt(moves[moves.length-1].substring(5,6))+2))
		{
		
		answer= true;
		
		}
	}
}





}});

return answer;
}
function getTime(user,game,color,clock_color)
{
$.post("clock.php",{user:user,game:game,color:color,clock_color:clock_color},function(result){

if(clock_color=="white")
{
document.getElementById("white_clock").value=Math.ceil(result);
}
else if(clock_color=="black")
{
document.getElementById("black_clock").value=Math.ceil(result);
}
});
}
function updateClock(user,game,color)
{
$.post("setup_clock.php",{user:user,game:game,color:color},function(result){
if(result=="white time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
	else 
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	
	}
}
else if(result=="black time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	}
	else
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
}
else
{
var clock= result.split(";");
document.getElementById("white_clock").value=Math.ceil(clock[0]);
document.getElementById("black_clock").value=Math.ceil(clock[1]);
}
});
}
function setupClock(user,game,color)
{
$.post("setup_clock.php",{user:user,game:game,color:color},function(result){

if(result=="white time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
	else 
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	
	}
}
else if(result=="black time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	}
	else
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
}
else
{
var clock= result.split(";");
document.getElementById("white_clock").value=Math.ceil(clock[0]);

document.getElementById("black_clock").value=Math.ceil(clock[1]);
call_clock();
}
});
}
function clear(user,game,color,time)
{
$.post("clear.php",{user:user,game:game,color:color,time:time},function(result){
if(result!="success")
{
alert(result);
}
});
}
function clear_default()
{
$.post("clear.php",{user:"white",game:"1",color:"white",time:"300"},function(result){
if(result!="success")
{
alert(result);
}
});
}
function movePiece(input){
color=pColor;
var grid_x = 45;
var grid_y = 45;
var start=input.substring(0,2);
var end=input.substring(3,5);
if(input=="WO-O")
{
start="e1";
end="g1";
movePiece("h1-f1");
if(pColor=="white")
moveKing=true;
}
else if(input=="WO-O-O")
{
start="e1";
end="c1";
movePiece("a1-d1");
if(pColor=="white")
moveKing=true;

}
else if(input=="BO-O")
{
start="e8";
end="g8";
movePiece("h8-f8");
if(pColor=="black")
moveKing=true;
}
else if(input=="BO-O-O")
{
start="e8";
end="c8";
movePiece("a8-d8");
if(pColor=="black")
moveKing=true;

}

var start_x=start.charCodeAt(0)-96;
var start_y=start[1];
var end_x=end.charCodeAt(0)-96;
var end_y=end[1];
var elem = $("[space='"+start+"']");
var left = parseInt(elem.css('left'));
if (isNaN(left))
left=0;
//alert(start);
//alert(end);
var top = parseInt(elem.css('top'));
if (isNaN(top))
top=0;

if($("[space='"+start+"']").attr("piece").substring(1)=="p"&&$("[space='"+end+"']").attr("piece")==null&&(start_x==(end_x-1)||start_x==(end_x+1)))
{
$("[space='"+end.substring(0,1)+start_y+"']").remove();
}



if(pColor=="white")
{
var new_left=left-(start_x-end_x)*45;
var new_top=top+(start_y-end_y)*45;
}
else if (pColor=="black")
{
var new_left=left+(start_x-end_x)*45;
var new_top=top-(start_y-end_y)*45;
}

$("[space='"+end+"']").remove();
$("[space='"+start+"']").attr("space",end);



elem.animate({
left: new_left,
top: new_top,
opacity: 1,
}, 100);
//alert(start);
if(color=="white")
{
	if(start=="a1"||end=="a1")
	{
	moveRook1=true;
	}
	else if(start=="h1"||end=="h1")
	{
	moveRook2=true;
	}
	else if(start=="e1"||end=="e1")
	{
	moveKing=true;
	}
}
else if(color=="black")
{
	if(start=="a8"||end=="a8")
	{
	moveRook1=true;
	}
	else if(start=="h8"||end=="h8")
	{
	moveRook2=true;
	}
	else if(start=="e8"||end=="e8")
	{
	moveKing=true;
	}
}
}
function resume(user,game,color)
{

session_id=randomString(7);
$.post("resume.php",{user:user,game:game,color:color,session:session_id},function(result){
//alert(result);

var moves= result.split(";");
var counter=0;
//alert(moves);

while(counter<moves.length)
{
	//var time=d.getTime();
	//while(d.getTime()-time<1000)
	//{
	//}
	
	if(moves[counter].substring(1).length>2)
	{//alert(moves[counter].substring(1));
	if(moves[counter]=="WO-O"||moves[counter]=="WO-O-O"||moves[counter]=="BO-O"||moves[counter]=="BO-O-O")
	{
	setTimeout("movePiece('"+moves[counter]+"')",counter*300);
	}
	else{
	setTimeout("movePiece('"+moves[counter].substring(1)+"')",counter*300);
	
	//alert("movePiece('"+moves[counter].substring(1)+"')");
	}
	}
	counter++;
}
setTimeout("call_recieve()",counter*300);
setupClock(pUser,gameID,pColor); 
});

}
function send(user,game,color,move)
{


$.post("send.php",{user:user,game:game,color:color,move:move},function(result){
if(result=="success")
{
document.getElementById("turn").value=color;
getTime(user,game,color,color);
}
else if(result=="mismatch")
{
alert("mismatch");
}
else if(result=="white time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
	else 
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	
	}
}
else if(result=="black time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	}
	else
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
}
else
{
	alert(result);
}
});
}
function recieve(user,game,color){

$.post("recieve.php",{user:user,game:game,color:color,session:session_id},function(result){
document.getElementById("recieve").value=result;
if(result=="opponent")
{
$( ".ui-draggable" ).draggable( "option", "disabled", true );
if(color=="white")
{
document.getElementById("turn").value="black";
}
else if(color=="black")
{
document.getElementById("turn").value="white";
}
}
else if(result=="your turn")
{
$( ".ui-draggable" ).draggable( "option", "disabled", false );
document.getElementById("turn").value=color;
}
else if(result=="session ended")
{

window.location = redirect;

}
else if(result=="mismatch")
{
alert("mismatch");
}
else if(result=="white time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
	else 
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	
	}
}
else if(result=="black time")
{
	if(color=="white")
	{
		if(endgame==false)
		alert("Your opponent lost on time");
		end(user,game,color);
	}
	else
	{
		if(endgame==false)
		alert("You lost on time");
		end(user,game,color);
	}
}
else if(result.substring(0,1)!="W"&&result.substring(0,1)!="B")
{

}
else
{
if(color=="white")
{
getTime(user,game,color,"black");
}
else if(color=="black")
{
getTime(user,game,color,"white");
}

$( ".ui-draggable" ).draggable( "option", "disabled", false );
if(result=="WO-O"||result=="WO-O-O"||result=="BO-O"||result=="BO-O-O")
{
movePiece(result);
}
else{
movePiece(result.substring(1));
document.getElementById("turn").value=color;
}
}
});
}
function clock(color)
{
//alert(color);
if(color=="white")
{
if(document.getElementById("white_clock").value<=10)
{
updateClock(pUser,gameID,pColor);
}
else
{
document.getElementById("white_clock").value=document.getElementById("white_clock").value-1;
}

}
else if(color=="black")
{
if(document.getElementById("black_clock").value<=10)
{
updateClock(pUser,gameID,pColor);
}
else
{
document.getElementById("black_clock").value=document.getElementById("black_clock").value-1;
}
}
}
function call_clock() {
//alert("hi");
turn=document.getElementById("turn").value;
clock(turn);
var timeout_clock=setTimeout("call_clock()",1000);
}

function call_recieve() {
var user=pUser;
var game=gameID;
var color=pColor;
recieve(user,game,color);
var timeout_recieve=setTimeout("call_recieve()",1000);
}
function setUpBoard(color){
	var table="";
	var bDrag="";
	var wDrag="";
	$("#container").append('<table width="362" height="362" border="0" cellpadding="0" cellspacing="0" align="center" style="border:1px solid black; background-image:url(\'images/45.gif\');" id="board"></table>');
	$("#container").append('<br />');
	$("#container").append('<table width="362" height="90" border="0" cellpadding="0" cellspacing="0" class="taken"></table>');
	if(color=="black"){
		bDrag=" id='draggable' ";
		table+='<tbody style="color:black;">';
		table+='<tr><td width="45" height="45" align="center" class="h1"></td><td width="45" height="45" align="center" class="g1"></td><td width="45" height="45" align="center" class="f1"></td><td width="45" height="45" align="center" class="e1"></td><td width="45" height="45" align="center" class="d1"></td><td width="45" height="45" align="center" class="c1"></td><td width="45" height="45" align="center" class="b1"></td><td width="45" height="45" align="center" class="a1"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h2"></td><td width="45" height="45" align="center" class="g2"></td><td width="45" height="45" align="center" class="f2"></td><td width="45" height="45" align="center" class="e2"></td><td width="45" height="45" align="center" class="d2"></td><td width="45" height="45" align="center" class="c2"></td><td width="45" height="45" align="center" class="b2"></td><td width="45" height="45" align="center" class="a2"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h3"></td><td width="45" height="45" align="center" class="g3"></td><td width="45" height="45" align="center" class="f3"></td><td width="45" height="45" align="center" class="e3"></td><td width="45" height="45" align="center" class="d3"></td><td width="45" height="45" align="center" class="c3"></td><td width="45" height="45" align="center" class="b3"></td><td width="45" height="45" align="center" class="a3"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h4"></td><td width="45" height="45" align="center" class="g4"></td><td width="45" height="45" align="center" class="f4"></td><td width="45" height="45" align="center" class="e4"></td><td width="45" height="45" align="center" class="d4"></td><td width="45" height="45" align="center" class="c4"></td><td width="45" height="45" align="center" class="b4"></td><td width="45" height="45" align="center" class="a4"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h5"></td><td width="45" height="45" align="center" class="g5"></td><td width="45" height="45" align="center" class="f5"></td><td width="45" height="45" align="center" class="e5"></td><td width="45" height="45" align="center" class="d5"></td><td width="45" height="45" align="center" class="c5"></td><td width="45" height="45" align="center" class="b5"></td><td width="45" height="45" align="center" class="a5"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h6"></td><td width="45" height="45" align="center" class="g6"></td><td width="45" height="45" align="center" class="f6"></td><td width="45" height="45" align="center" class="e6"></td><td width="45" height="45" align="center" class="d6"></td><td width="45" height="45" align="center" class="c6"></td><td width="45" height="45" align="center" class="b6"></td><td width="45" height="45" align="center" class="a6"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h7"></td><td width="45" height="45" align="center" class="g7"></td><td width="45" height="45" align="center" class="f7"></td><td width="45" height="45" align="center" class="e7"></td><td width="45" height="45" align="center" class="d7"></td><td width="45" height="45" align="center" class="c7"></td><td width="45" height="45" align="center" class="b7"></td><td width="45" height="45" align="center" class="a7"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="h8"></td><td width="45" height="45" align="center" class="g8"></td><td width="45" height="45" align="center" class="f8"></td><td width="45" height="45" align="center" class="e8"></td><td width="45" height="45" align="center" class="d8"></td><td width="45" height="45" align="center" class="c8"></td><td width="45" height="45" align="center" class="b8"></td><td width="45" height="45" align="center" class="a8"></td></tr>';
		table+='</tbody>';
	}
	else if(color=="white"){
		wDrag=" id='draggable' ";
		table+='<tbody style="color:black;">';
		table+='<tr><td width="45" height="45" align="center" class="a8"></td><td width="45" height="45" align="center" class="b8"></td><td width="45" height="45" align="center" class="c8"></td><td width="45" height="45" align="center" class="d8"></td><td width="45" height="45" align="center" class="e8"></td><td width="45" height="45" align="center" class="f8"></td><td width="45" height="45" align="center" class="g8"></td><td width="45" height="45" align="center" class="h8"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a7"></td><td width="45" height="45" align="center" class="b7"></td><td width="45" height="45" align="center" class="c7"></td><td width="45" height="45" align="center" class="d7"></td><td width="45" height="45" align="center" class="e7"></td><td width="45" height="45" align="center" class="f7"></td><td width="45" height="45" align="center" class="g7"></td><td width="45" height="45" align="center" class="h7"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a6"></td><td width="45" height="45" align="center" class="b6"></td><td width="45" height="45" align="center" class="c6"></td><td width="45" height="45" align="center" class="d6"></td><td width="45" height="45" align="center" class="e6"></td><td width="45" height="45" align="center" class="f6"></td><td width="45" height="45" align="center" class="g6"></td><td width="45" height="45" align="center" class="h6"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a5"></td><td width="45" height="45" align="center" class="b5"></td><td width="45" height="45" align="center" class="c5"></td><td width="45" height="45" align="center" class="d5"></td><td width="45" height="45" align="center" class="e5"></td><td width="45" height="45" align="center" class="f5"></td><td width="45" height="45" align="center" class="g5"></td><td width="45" height="45" align="center" class="h5"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a4"></td><td width="45" height="45" align="center" class="b4"></td><td width="45" height="45" align="center" class="c4"></td><td width="45" height="45" align="center" class="d4"></td><td width="45" height="45" align="center" class="e4"></td><td width="45" height="45" align="center" class="f4"></td><td width="45" height="45" align="center" class="g4"></td><td width="45" height="45" align="center" class="h4"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a3"></td><td width="45" height="45" align="center" class="b3"></td><td width="45" height="45" align="center" class="c3"></td><td width="45" height="45" align="center" class="d3"></td><td width="45" height="45" align="center" class="e3"></td><td width="45" height="45" align="center" class="f3"></td><td width="45" height="45" align="center" class="g3"></td><td width="45" height="45" align="center" class="h3"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a2"></td><td width="45" height="45" align="center" class="b2"></td><td width="45" height="45" align="center" class="c2"></td><td width="45" height="45" align="center" class="d2"></td><td width="45" height="45" align="center" class="e2"></td><td width="45" height="45" align="center" class="f2"></td><td width="45" height="45" align="center" class="g2"></td><td width="45" height="45" align="center" class="h2"></td></tr>';
		table+='<tr><td width="45" height="45" align="center" class="a1"></td><td width="45" height="45" align="center" class="b1"></td><td width="45" height="45" align="center" class="c1"></td><td width="45" height="45" align="center" class="d1"></td><td width="45" height="45" align="center" class="e1"></td><td width="45" height="45" align="center" class="f1"></td><td width="45" height="45" align="center" class="g1"></td><td width="45" height="45" align="center" class="h1"></td></tr>';
		table+='</tbody>';
	}
	$("#board").append(table);
	//row 8
	$(".a8").append('<img border="0" '+bDrag+'src="' + bRook + '" space="a8" piece="br" style="position: relative; "/>');
	$(".b8").append('<img border="0" '+bDrag+'src="' + bKnight + '" space="b8" piece="bn" style="position: relative; "/>');
	$(".c8").append('<img border="0" '+bDrag+'src="' + bBishop + '" space="c8" piece="bb" style="position: relative; "/>');
	$(".d8").append('<img border="0" '+bDrag+'src="' + bQueen + '" space="d8" piece="bq" style="position: relative; "/>');
	$(".e8").append('<img border="0" '+bDrag+'src="' + bKing + '" space="e8" piece="bk" style="position: relative; "/>');
	$(".f8").append('<img border="0" '+bDrag+'src="' + bBishop + '" space="f8" piece="bb" style="position: relative; "/>');
	$(".g8").append('<img border="0" '+bDrag+'src="' + bKnight + '" space="g8" piece="bn" style="position: relative; "/>');
	$(".h8").append('<img border="0" '+bDrag+'src="' + bRook + '" space="h8" piece="br" style="position: relative; "/>');
	//row 7
	$(".a7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="a7" piece="bp" style="position: relative; "/>');
	$(".b7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="b7" piece="bp" style="position: relative; "/>');
	$(".c7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="c7" piece="bp" style="position: relative; "/>');
	$(".d7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="d7" piece="bp" style="position: relative; "/>');
	$(".e7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="e7" piece="bp" style="position: relative; "/>');
	$(".f7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="f7" piece="bp" style="position: relative; "/>');
	$(".g7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="g7" piece="bp" style="position: relative; "/>');
	$(".h7").append('<img border="0" '+bDrag+'src="' + bPawn + '" space="h7" piece="bp" style="position: relative; "/>');
	//row 1
	$(".a1").append('<img border="0" '+wDrag+'src="' + wRook + '" space="a1" piece="wr" style="position: relative; 	"/>');
	$(".b1").append('<img border="0" '+wDrag+'src="' + wKnight + '" space="b1" piece="wn" style="position: relative; "/>');
	$(".c1").append('<img border="0" '+wDrag+'src="' + wBishop + '" space="c1" piece="wb" style="position: relative; "/>');
	$(".d1").append('<img border="0" '+wDrag+'src="' + wQueen + '" space="d1" piece="wq" style="position: relative; "/>');
	$(".e1").append('<img border="0" '+wDrag+'src="' + wKing + '" space="e1" piece="wk" style="position: relative; "/>');
	$(".f1").append('<img border="0" '+wDrag+'src="' + wBishop + '" space="f1" piece="wb" style="position: relative; "/>');
	$(".g1").append('<img border="0" '+wDrag+'src="' + wKnight + '" space="g1" piece="wn" style="position: relative; "/>');
	$(".h1").append('<img border="0" '+wDrag+'src="' + wRook + '" space="h1" piece="wr" style="position: relative; "/>');
	//row 2
	$(".a2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="a2" piece="wp" style="position: relative; "/>');
	$(".b2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="b2" piece="wp" style="position: relative; "/>');
	$(".c2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="c2" piece="wp" style="position: relative; "/>');
	$(".d2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="d2" piece="wp" style="position: relative; "/>');
	$(".e2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="e2" piece="wp" style="position: relative; "/>');
	$(".f2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="f2" piece="wp" style="position: relative; "/>');
	$(".g2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="g2" piece="wp" style="position: relative; "/>');
	$(".h2").append('<img border="0" '+wDrag+'src="' + wPawn + '" space="h2" piece="wp" style="position: relative; "/>');
	makeDraggable();
}
function chooseColor(){
var playerColor=$("#color").val();
return playerColor;
}
function makeDraggable(){
var temp1="temp";
var x1;
var y1;
$("#board tbody tr td #draggable").draggable({
start: function(e,ui){
$(this).css("z-index", "2");
x1=$(this).css("left");
y1=$(this).css("top");
if(x1=="auto"){
x1=0;
}
if(y1=="auto"){
y1=0;
}
playerColor=$(this).attr('piece').substring(0,1);
},
revert: 'invaled',
stop: function(e, ui) {
$( ".ui-draggable" ).draggable( "option", "disabled", true );
var user=pUser;
var game=gameID;
var color=pColor;
var grid_x = 45;
var grid_y = 45;
var elem = $( this );
var left = parseInt(elem.css('left'));
var top = parseInt(elem.css('top'));
var cx = (left % grid_x);
var cy = (top % grid_y);
var start=$(this).attr("space");
var end=temp1.substring(1,3);
var new_left = (Math.abs(cx)+0.5*grid_x >= grid_x) ? (left - cx + (left/Math.abs(left))*grid_x) : (left - cx);
var new_top = (Math.abs(cy)+0.5*grid_y >= grid_y) ? (top - cy + (top/Math.abs(top))*grid_y) : (top - cy);
var piece=$(this).attr("piece").substring(1,2);

if($("[space='"+temp1.substring(1,3)+"']").attr("piece")!=null){
if($("[space='"+temp1.substring(1,3)+"']").attr("piece").substring(0,1)==playerColor){



new_left=x1;
new_top=y1;
}
else{
if(isLegal($(this).attr("piece").substring(1,2),$(this).attr("piece").substring(0,1),$(this).attr("space"),temp1.substring(1,3),true)){
taken.push($("[space='"+temp1.substring(1,3)+"']").attr("piece"));
addTaken(taken);
$("[space='"+temp1.substring(1,3)+"']").remove();
$(this).attr("space","temp");
$(this).attr("space",temp1.substring(1,3));

send(user,game,color,color.substring(0,1).toUpperCase()+start+"-"+temp1.substring(1,3));
}
else{

new_left=x1;
new_top=y1;
$( ".ui-draggable" ).draggable( "option", "disabled", false );
}
}
}
else{

if(isLegal($(this).attr("piece").substring(1,2),$(this).attr("piece").substring(0,1),$(this).attr("space"),temp1.substring(1,3),false))
{

$("[space='"+temp1.substring(1,3)+"']").remove();
$(this).attr("space","temp");
$(this).attr("space",temp1.substring(1,3));

send(user,game,color,color.substring(0,1).toUpperCase()+start+"-"+temp1.substring(1,3));
}
else if(piece!="k"||check==true||moveKing==true)
{

new_left=x1;
new_top=y1;
$( ".ui-draggable" ).draggable( "option", "disabled", false );
}
else{
//alert("hi");
if(color=="white")
{
	if(moveRook1==false&&end=="g1"&&$("[space='g1']").attr("piece")==null&&$("[space='f1']").attr("piece")==null)
	{
		
		var user=pUser;
		var game=gameID;
		send(user,game,color,"WO-O");
		movePiece("h1-f1");
		$(this).attr("space",temp1.substring(1,3));
		moveKing=true;

		
		
	}
	else if(moveRook2==false&&end=="c1"&&$("[space='c1']").attr("piece")==null&&$("[space='d1']").attr("piece")==null&&$("[space='b1']").attr("piece")==null)
	{

		var user=pUser;
		var game=gameID;
		send(user,game,color,"WO-O-O");
		movePiece("a1-d1");
		$(this).attr("space",temp1.substring(1,3));
		moveKing=true;
	}
	else
	{
		new_left=x1;
		new_top=y1;
		$( ".ui-draggable" ).draggable( "option", "disabled", false );
	}
}
else if(color=="black")
{
	if(moveRook1==false&&end=="g8"&&$("[space='g8']").attr("piece")==null&&$("[space='f8']").attr("piece")==null)
	{
		var user=pUser;
		var game=gameID;
		send(user,game,color,"BO-O");
		movePiece("h8-f8");
		$(this).attr("space",temp1.substring(1,3));
		moveKing=true;
	}
	else if(moveRook2==false&&end=="c8"&&$("[space='c8']").attr("piece")==null&&$("[space='d8']").attr("piece")==null&&$("[space='b8']").attr("piece")==null)
	{
		var user=pUser;
		var game=gameID;
		send(user,game,color,"BO-O-O");
		movePiece("a8-d8");
		$(this).attr("space",temp1.substring(1,3));
		moveKing=true;
	}
	else
	{
		new_left=x1;
		new_top=y1;
		$( ".ui-draggable" ).draggable( "option", "disabled", false );
	}
}




}









}

ui.helper.stop(true).animate({
left: new_left,
top: new_top,
opacity: 1,
}, 100);

$(this).css("z-index", "1");
}
});
$("#board tbody tr td").droppable({
drop: function() { //alert($(this).attr('class').substring(0,2));
temp1="."+$(this).attr('class').substring(0,2);
}
});
}
function isLegal(piece,color,start,end,occupied){
//seperate location into rows and columns
var sr=parseInt(start.substring(1,2));
var sc=start.substring(0,1).charCodeAt(0)-96;
var er=parseInt(end.substring(1,2));
var ec=end.substring(0,1).charCodeAt(0)-96;
//alert(ec);
//rules for each piece

if(piece=="p"){
if(color=="w"){
if((sr+1)==er){
if(!occupied&&sc==ec){
return true;
}
else if(occupied&&(sc==(ec-1)||sc==(ec+1))){
return true;
}
else if(sc==(ec-1)||sc==(ec+1))
{
	if($("[space='"+end.substring(0,1)+sr+"']").attr("piece")=="bp")
	{

		if(en_passant(pUser,gameID,pColor,end.substring(0,1)+sr)==true)
		{

		$("[space='"+end.substring(0,1)+sr+"']").remove();
		return true;
		}
	}
	return false;
}
else{
return false;
}
}
else{
if(!occupied&&sr==2&&(sr+2)==er&&ec==sc&&$("[space='"+start.substring(0,1)+(sr+1)+"']").attr("piece")==null){

return true;
}
return false;
}
}
else if(color=="b"){
if(sr-1==er){
if(!occupied&&sc==ec){
return true;
}
else if(occupied&&(sc==(ec-1)||sc==(ec+1))){
return true;
}
else if(sc==(ec-1)||sc==(ec+1))
{

	if($("[space='"+end.substring(0,1)+sr+"']").attr("piece")=="wp")
	{

		if(en_passant(pUser,gameID,pColor,end.substring(0,1)+sr)==true)
		{

		$("[space='"+end.substring(0,1)+sr+"']").remove();
		return true;
		}
	}
	return false;
}
else{
return false;
}
}
else{

if(!occupied&&sr==7&&(sr-2)==er&&ec==sc&&$("[space='"+start.substring(0,1)+(sr-1)+"']").attr("piece")==null){
return true;
}

return false;
}
}
}
else if(piece=="r"){

if(sr!=er&&sc!=ec){
return false;
}
else{
if(sr==er)
{
	if(sc>ec)
	{ec++;
		while(sc>ec)
		{
			if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
			{
				return false;
			}
			ec++;
		}
	}
	else
	{sc++;
		while(sc<ec)
		{
			if($("[space='"+String.fromCharCode(sc+96)+(sr)+"']").attr("piece")!=null)
			{
				return false;
			}
			sc++;
		}
	}

}
else
{ 
	if(sr>er)
	{er++;
		while(sr>er)
		{//alert(String.fromCharCode(er+96)+(ec));
			if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
			{
				return false;
			}
			er++;
		}
	}
	else if(sr<er)
	{sr++;
		while(sr<er)
		{
			if($("[space='"+String.fromCharCode(sc+96)+(sr)+"']").attr("piece")!=null)
			{
				return false;
			}
			sr++;
		}
	}

}

if(color=="white")
{
	if(start=="a1")
	{
	moveRook1=true;
	}
	else if(start=="h1")
	{
	moveRook2=true;
	}
}
else if(color=="black")
{
	if(start=="a8")
	{
	moveRook1=true;
	}
	else if(start=="h8")
	{
	moveRook2=true;
	}
}

return true;
}

}
else if(piece=="b"){
if(Math.abs(er-sr)!=Math.abs(ec-sc)){
return false;
}
else{
	
	if(sr>er)
	{
		if(sc>ec)
		{
		er++;
		ec++;
			while(sc>ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er++;
			ec++;
			}
		}
		else
		{
		er++;
		ec--;
			while(sc<ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er++;
			ec--;
			}
		}
	}
	else
	{
		if(sc>ec)
		{
		er--;
		ec++;
			while(sc>ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er--;
			ec++;
			}
		}
		else
		{
		er--;
		ec--;
			while(sc<ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er--;
			ec--;
			}
		}
	}



return true;
}
}
else if(piece=="q"){
if(sr==er||sc==ec){



if(sr==er)
{
	if(sc>ec)
	{ec++;
		while(sc>ec)
		{
			if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
			{
				return false;
			}
			ec++;
		}
	}
	else
	{sc++;
		while(sc<ec)
		{
			if($("[space='"+String.fromCharCode(sc+96)+(sr)+"']").attr("piece")!=null)
			{
				return false;
			}
			sc++;
		}
	}

}
else
{ 
	if(sr>er)
	{er++;
		while(sr>er)
		{//alert(String.fromCharCode(er+96)+(ec));
			if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
			{
				return false;
			}
			er++;
		}
	}
	else if(sr<er)
	{sr++;
		while(sr<er)
		{
			if($("[space='"+String.fromCharCode(sc+96)+(sr)+"']").attr("piece")!=null)
			{
				return false;
			}
			sr++;
		}
	}

}




return true;
}
else if(Math.abs(er-sr)==Math.abs(ec-sc))
{




	
	if(sr>er)
	{
		if(sc>ec)
		{
		er++;
		ec++;
			while(sc>ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er++;
			ec++;
			}
		}
		else
		{
		er++;
		ec--;
			while(sc<ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er++;
			ec--;
			}
		}
	}
	else
	{
		if(sc>ec)
		{
		er--;
		ec++;
			while(sc>ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er--;
			ec++;
			}
		}
		else
		{
		er--;
		ec--;
			while(sc<ec)
			{
				if($("[space='"+String.fromCharCode(ec+96)+(er)+"']").attr("piece")!=null)
				{
					return false;
				}
			er--;
			ec--;
			}
		}
	}



return true;
}
else{
return false;
}
}
else if(piece=="k"){
if(Math.abs(er-sr)<=1&&Math.abs(ec-sc)<=1){
moveKing=true;
return true;
}

else{
return false;
}
}
else if(piece=="n"){
if(Math.abs(er-sr)==1&&Math.abs(ec-sc)==2||Math.abs(er-sr)==2&&Math.abs(ec-sc)==1){
return true;
}
else{
return false;
}
}
else{
return true;
}
}
function addTaken(taken){
$(".taken").replaceWith('<table width="362" height="90" border="0" cellpadding="0" cellspacing="0" align="center" class="taken"></table>');
var content="";
for (var i=0;i<taken.length;i++) {
if(i%8==0){
content+='<tr>';
}
content+='<td width="45" height="45" align="center">'+'<img border="0" id="draggable" src="images/' + taken[i] + '.png"/></td>';
//if((taken.length>0&&i%8==0)||i==taken.length-1){
// content+='</tr>';
//}
}
if(taken.length%8!=0){
for(var x=taken.length;x<8;x++){
content+='<td width="45" height="45" align="center"></td>';
}
}
if(i<=8){
content+='<tr><td width="45" height="45" align="center"></td>';
}
$(".taken").append(content);
}



$(document).ready(function() {
	var init="";
	/*
	init+='<br />';
	init+='<input type="text" id="user" value="albert"></input>';
	init+='<input type="text" id="game" value="1"></input>';
	init+='<input type="text" id="color" value="white"></input>';
	init+='<br /><br />';
	init+='whose turn: <input type="text" id="turn" value=""></input><br /><br />';
	*/
	init+='<h2 align="center" style="padding-bottom:0px;margin-bottom:0px;">Bug House Chess</h2><br /><h3 align="center" style="padding-top:0px;margin-top:0px;">By: David Mayo and Albert Shaw</h3>';
	init+='<table width="190" border="0" cellpadding="0" cellspacing="0" align="center" id="top"><tr><td style="padding-bottom:8px;">';
	//init+='Name: <input type="text" id="user" value="" /></td></tr>'
	init+='<tr><td><button id="white">White</button><button id="black">Black</button></td><tr></table>';
	$("#container").append(init);
$("#white").click(function() {
pColor="white";
pUser=$("#user").val();
pUser="white";
gameID=1;
init="";
init+='<br />';
init+='<table width="362" border="0" cellpadding="0" cellspacing="0" align="center" id="top">';
init+='<tr><td align="left">';
init+='Player: '+pUser;
//init+='<input type="text" id="user" value="albert" />';
init+='<br />Id: <input type="text" id="game" readonly="readonly" value="1" width="20" />';
init+='<br />Color: white';
init+='</td></tr><tr><td align="left">';
init+='whose turn: <input type="text" id="turn" value="" /></td></tr>';
init+='<tr><td align="left">';
init+='recieve: <input type="text" id="recieve" value="" /></td></tr>';
init+='<tr><td>white clock:<input type="text" id="white_clock" /></td><td align="left">black clock:<input type="text" id="black_clock" /></td></tr>';

$("#container").replaceWith('<div id="container"></div>');
$("#container").append(init);
setUpBoard("white");
$( ".ui-draggable" ).draggable({ disabled: false });


		resume(pUser,gameID,pColor);

});
	$("#black").click(function() {
	gameID=1;
pColor="black";
pUser=$("#user").val();
pUser="black";
init="";
init+='<br />';
		init+='<table width="362" border="0" cellpadding="0" cellspacing="0" align="center" id="top">';
		init+='<tr><td align="left">';
		init+='Player: '+pUser;
		//init+='<input type="text" id="user" value="albert" />';
		init+='<br />Id: <input type="text" id="game" value="1" readonly="readonly" width="20" />';
		init+='<br />Color: black';
		init+='</td></tr><tr><td align="left">';
		init+='whose turn: <input type="text" id="turn" value="" /></td></tr>';
		init+='<tr><td align="left">';
init+='recieve: <input type="text" id="recieve" value="" /></td></tr>';
init+='<tr><td>white clock:<input type="text" id="white_clock" /></td><td align="left">black clock:<input type="text" id="black_clock" /></td></tr>';


		$("#container").replaceWith('<div id="container"></div>');
		$("#container").append(init);
		setUpBoard("black");
		
		$( ".ui-draggable" ).draggable({ disabled: false });



		resume(pUser,gameID,pColor);
		

});

}); 