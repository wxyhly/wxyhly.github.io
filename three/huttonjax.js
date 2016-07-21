function copy_code(txt,event){    
var div3 = document.getElementById('copydiv');  
div3.style.display="block"; 
div3.style.position="absolute"; 
div3.style.left = event.pageX+10+"px"; 
div3.style.top = event.pageY+5+"px";
document.getElementById('copydivinner').innerHTML=txt;
}
function closeTip(){
var div3 = document.getElementById('copydiv');    
div3.style.display="none";    
}
/***** by wxy   - wxy_hly ******/
document.write("<style>.btn{padding:5px 6px 6px 6px; -moz-border-radius: 10px; -webkit-border-radius: 10px; border-radius:10px; background:#FFEFD0;color:#390}</style><div id='copydiv' style='padding:10px;word-wrap:break-word;width:50%;background-Color:#CFD; border:1px;position:absolute;z-index:99;display:none'><button class='btn' onclick=\"scaleplus()\">放大</button><button class='btn' onclick=\"scalemoin()\">缩小</button> | <button class='btn' style='background:#F00;color:#FFF' onclick=\"closeTip()\" class='btn'>关闭</button><b>　复制rle代码，可直接粘入Golly中:</b><p><textarea onmouseover=\"this.select();\" id='copydivinner' style='width:90%;height:80px'></textarea></div>")
RLES=[];
function scaleplus(){
	var i = _RLES_i;
	if(RLES[i]["scale"]>9)return 0;
	RLES[i]["scale"]*=2;
	var trle=new RLE(RLES[i]["content"]);
	RLES[i]["canvas"].width = trle.x*RLES[i]["scale"];
	RLES[i]["canvas"].height = trle.y*RLES[i]["scale"];
	trle.print(new Painter(RLES[i]["canvas"],5),RLES[i]["scale"]);
}
function scalemoin(){
	var i = _RLES_i;
	if(RLES[i]["scale"]<0.4)return 0;
	RLES[i]["scale"]/=2;
	var trle=new RLE(RLES[i]["content"]);
	RLES[i]["canvas"].width = trle.x*RLES[i]["scale"];
	RLES[i]["canvas"].height = trle.y*RLES[i]["scale"];
	trle.print(new Painter(RLES[i]["canvas"],5),RLES[i]["scale"]);
}
function onloadeddata(){
	setTimeout(function (){
		var a = document.getElementsByTagName("canvas");
		for(var i=0; i<a.length;i++){
			a[i].onload();
		}
		
		for(var i=0; i<RLES.length;i++){
			var trle=new RLE(RLES[i]["content"]);
			RLES[i]["canvas"].width = trle.x*RLES[i]["scale"];
			RLES[i]["canvas"].height = trle.y*RLES[i]["scale"];
			RLES[i]["canvas"].style.backgroundColor="#303030";
			RLES[i]["canvas"].style.cursor="pointer";
			eval('RLES[i]["canvas"].onclick = function(e){_RLES_i = '+i+';copy_code(RLES['+i+']["content"],e);}');
			trle.print(new Painter(RLES[i]["canvas"],5),RLES[i]["scale"]);
		}
	} ,500);
}
function showRLE (_canvas,scale,content){
RLES.push({"canvas":_canvas,"scale":scale,"content":content});
}
//Rle operatings
/***** by wxy   - wxy_hly ******/
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
RLE = function (text){
	this.set(text);
}
RLE.prototype.set = function (text){
	if(typeof text != "string"){
		this.x = arguments[0];
		this.y = arguments[1];
		this.rule = arguments[2];
		this.date = arguments[3];
	}
	var eqr = text.split("=");
	this.x = Number(eqr[1].split(",")[0]);
	this.y = Number(eqr[2].split(",")[0]);
	this.rule = eqr[3].split("\n")[0].trim();
	this.data = RLE.Expand(this.x, this.y, eqr[3].slice(eqr[3].indexOf("\n")).replace(/\s/g,""));
}

RLE.prototype.toText = function (){
	var d = this.data;
	d += "!"
	var prev = "";
	var num = 1;
	var s = "";
	for(var i = 0; i < d.length; i++){
		var c = d.charAt(i);
		if(prev == c)
			num++;
		else{
			if(c != "$" || prev != "."){
				if(num == 1) s += prev;
				else s += num+prev;
			}
			prev = c;
			num = 1;
		}
	}
	return "x = "+this.x+", y = "+this.y+", rule = "+this.rule+"\n"+s.replace(/a/g,"pA").replace(/b/g,"pB").replace(/c/g,"pC").replace(/d/g,"pD").replace(/e/g,"pE").replace(/f/g,"pF").replace(/g/g,"pG")+"!";
	
}
RLE.Expand = function (this_x, this_y, this_content){
	var t = this_content.replace(/pA/g, "a").replace(/pB/g, "b").replace(/pC/g, "c").replace(/pD/g, "d").replace(/pE/g, "e").replace(/pF/g, "f").replace(/pG/g, "g").replace(/!/g, "");
	var prevIsNum = false;
	var format = [];
	for (var i = 0; i < t.length; i++){
		var c = t.charAt(i);
		var isNum = c >= '0' && c <= '9';
		if (isNum){
			if (!prevIsNum) start = i;
			prevIsNum = true;
		}else{
			if (prevIsNum) format.push(t.slice(start,i));
			format.push(c);
			prevIsNum = false;
		}
	}
	//return format;
	prevNum = 1;
	result = "";
	for (var i = 0; i < format.length; i++){
		if(!isNaN(Number(format[i])))
			prevNum = Number(format[i]);
		else{
			result += String(new Array(prevNum + 1).join(format[i]));
			prevNum = 1;
		}
	}
	Result = "";
	var SpArr = result.split('$');
	for (var i = 0;i < SpArr.length; i++){
		if(SpArr[i].length-this_x < 0){
			SpArr[i] += String(new Array(this_x-SpArr[i].length + 1).join('.'));
		}
		Result += '$'+SpArr[i];
	}
	Result = Result.slice(1)
	var xxx = String(new Array(this_x + 1).join('.'))
	if(this_y - SpArr.length>=0)
		Result += String(new Array(this_y - SpArr.length + 1).join('$'+xxx))
	return Result;
	
}
RLE.Colortable = {
	"A":0xFF0000,
	"B":0xFF7D00,
	"C":0xFF9619,
	"D":0xFAAF32,
	"E":0xFA144B,
	"F":0xFAE164,
	"G":0xFAFA7D,
	"H":0xFBFF00,
	".":0x303030,
	"I":0x5959FF,
	"J":0x6A6AFF,
	"K":0x7A7AFF,
	"L":0x8B8BFF,
	"M":0x1BB01B,
	"N":0x24C824,
	"O":0x49FF49,
	"P":0x6AFF6A,
	"Q":0xEB2424,
	"R":0xFF3838,
	"S":0xFF4949,
	"T":0xFF5959,
	"U":0xB938FF,
	"V":0xBF49FF,
	"W":0xC559FF,
	"X":0xCBCEFF,
	"a":0x00FF80,
	"b":0xFF8040,
	"c":0xFFFF80,
	"d":0x21D7D7,
	"e":0x1BB0B0,
	"f":0x189C9C,
	"g":0x158989
};
RLE.prototype.print = function (canva,scale){
	var xx = 0; yy = 0;
	canva.clear();
	canva.createImageData(2000,2000);
	for (var i = 0; i < this.data.length; i++){
		var C, c = this.data.charAt(i);
		if (c == "$"){
			yy++;
			xx = 0;
		}
		else{
			C = c;
			if(typeof RLE.Colortable[C]=='undefined')
				canva.writeData(xx,yy,0xFFFFFF);
			else if(C!="."){
				if(scale == 1) canva.writeData(xx,yy,RLE.Colortable[C]);
				else if(scale == 0.5 && xx%2 && yy%2 ) canva.writeData(Math.floor(xx/2),Math.floor(yy/2),RLE.Colortable[C]);
				else if(scale == 0.25 && xx%4 && yy%4 ) canva.writeData(Math.floor(xx/4),Math.floor(yy/4),RLE.Colortable[C]);
				else if(scale == 2) {
					canva.writeData(xx*2,yy*2,RLE.Colortable[C]);
					canva.writeData(xx*2+1,yy*2,RLE.Colortable[C]);
					canva.writeData(xx*2,yy*2+1,RLE.Colortable[C]);
					canva.writeData(xx*2+1,yy*2+1,RLE.Colortable[C]);
				}
				else if(scale == 4) {
					canva.writeData(xx*4,yy*4,RLE.Colortable[C]);
					canva.writeData(xx*4+1,yy*4,RLE.Colortable[C]);
					canva.writeData(xx*4+2,yy*4,RLE.Colortable[C]);
					canva.writeData(xx*4+3,yy*4,0);
					canva.writeData(xx*4,yy*4+1,RLE.Colortable[C]);
					canva.writeData(xx*4+1,yy*4+1,RLE.Colortable[C]);
					canva.writeData(xx*4+2,yy*4+1,RLE.Colortable[C]);
					canva.writeData(xx*4+3,yy*4+1,0);
					canva.writeData(xx*4,yy*4+2,RLE.Colortable[C]);
					canva.writeData(xx*4+1,yy*4+2,RLE.Colortable[C]);
					canva.writeData(xx*4+2,yy*4+2,RLE.Colortable[C]);
					canva.writeData(xx*4+3,yy*4+2,0);
					canva.writeData(xx*4,yy*4+3,0);
					canva.writeData(xx*4+1,yy*4+3,0);
					canva.writeData(xx*4+2,yy*4+3,0);
					canva.writeData(xx*4+3,yy*4+3,0);
				}
				else if(scale == 8) {
					var CN = (C==".")?0:(C<"a")?(C.charCodeAt(0)-65):(C.charCodeAt(0)-41);
					for(var x=0;x<8;x++){
						for(var y=0;y<8;y++){
							canva.writeData(x+xx*8,y+yy*8,Painter.loadedIMG.readData(x+CN*15-1,y+14));
						}
					}
				}
				else if(scale == 16) {
					var CN = (C==".")?0:(C<"a")?(C.charCodeAt(0)-65):(C.charCodeAt(0)-41);
					for(var x=0;x<15;x++){
						for(var y=0;y<14;y++){
							canva.writeData(x+xx*16,y+yy*16,Painter.loadedIMG.readData(x+CN*15-1,y));
						}
					}
				}
			}
			xx++;
		}
	}
	canva.putImageData();
}
Painter.loadIMG('/three/wxy1.bmp',onloadeddata)


