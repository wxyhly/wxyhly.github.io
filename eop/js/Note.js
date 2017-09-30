/**
	from canvas_util.js
**/
{
	$ = function (obj){
		return document.getElementById(obj);
	}
	ctxt$ = function (obj){
		return $(obj).getContext("2d");
	}
	vec2 = function(x,y){
		this.x = x;
		this.y = y ? y :0;
	}
	p = function(x,y){
		return new vec2(x,y);
	}
}

/**
	MIDI   // need library Base64Binary for decoding json.
		load(soundfont: string[]);
		onsuccess();
		noteOn(channel, note: int, volume: number);
**/

MIDI = {
	load: function(sf) {
		var context = new AudioContext();
		MIDI.audioBuffers = [];
		MIDI.loadProgress = [];
		MIDI.keyToNote = {}; // C8  == 108
		MIDI.noteToKey = {}; // 108 ==  C8
		MIDI.Soundfont = {};
		MIDI.channelNum = sf.length;
		MIDI.context = context;
		var A0 = 0x15; // first note
		var C8 = 0x6C; // last note
		var number2key = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
		for (var n = A0; n <= C8; n++) {
			var octave = (n - 12) / 12 >> 0;
			var name = number2key[n % 12] + octave;
			MIDI.keyToNote[name] = n;
			MIDI.noteToKey[n] = name;
		}
		for(var i=0; i<sf.length; i++){
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onload = function (i,sf_i,xmlhttp){
				eval(xmlhttp.responseText);
				MIDI.loadProgress[i] = 0;
				MIDI.audioBuffers[i] = [];
				for(var e in MIDI.Soundfont[sf_i]){
					var url = MIDI.Soundfont[sf_i][e];
					var buff = Base64Binary.decodeArrayBuffer(url.split(',')[1]);
					context.decodeAudioData(buff, function(n,b){
						MIDI.audioBuffers[i][n] = b;
						MIDI.loadProgress[i]++;
						testsuccess();
					}.bind(undefined, MIDI.keyToNote[e]));
				}
			}.bind(undefined, i, sf[i], xmlhttp);
			xmlhttp.open("GET","soundfont/"+sf[i]+"-ogg.js",true);
			xmlhttp.send();
		}
		var passed = false;
		var testsuccess = function (){
			for(var i=0; i<MIDI.channelNum; i++){
				if(!(MIDI.loadProgress[i] >= C8 - A0)) return 0;
			}
			if(!passed) MIDI.onsuccess();
			passed = true;
		}
	},
	noteOn : function(channel, note, volume) {
		var buf = MIDI.audioBuffers[channel][note];
		var context = MIDI.context;
		buf.source = context.createBufferSource();
		buf.source.buffer = buf;
		var gainNode = context.createGain();
		buf.source.connect(gainNode);
		gainNode.connect(context.destination);
		gainNode.gain.value = volume/20;
		buf.source.start(0);
	},
	noteOff : function(channel, note) {
		var buf = MIDI.audioBuffers[channel][note];
		if(buf) buf.source.stop(0);
	}
}

/**
	PLAYER
		volume: number;
		play(channel, note: int, [volume: number, delay: int, recorder: Recorder]);
		autoVolume(note: int): number;
**/

PLAYER = {
	volume : 1,
	autoVolume : function (note){
		var x1 = 20; var y1 = 100;
		var x2 = 110; var y2 = 110;
		if(note < x1) return y1;
		if(note > x2) return y2;
		return Math.round((y1 - y2)/(x1 - x2)*(note - x1)) + y1;
	},
	play : function (channel,note,volume,delay){
		channel = channel || 0;
		if(!volume > 0) volume = PLAYER.autoVolume(note);
		if(!delay) delay = 0;
		setTimeout(function (){MIDI.noteOn(channel, note, volume * PLAYER.volume, 0)},delay);
	}
};

/**
	IN
		mode: string;
		keysig, tempsig: int;
		enable: bool;
		strSharp, strFlat, presstr, pressnote: string;
		Eop, Ki: hashTable;
		ki(note: int, nonrecord: bool);
**/

IN = {
	mode: "eop",  //input mode, choix disponible: [eop, ki, si]
	keysig: 0, tempsig: 0,
	keepfirsttemp: false,
	enable: true,
	sustain: true,  //sustain
	strSharp: "", strFlat: "",
	presstr: "",  //store which keys are being pressed
	pressnote: [], //store which notes are being pressed(use to record duration of note)
	ki : function (note, time){//if grid on, record time is not now
		var sig = IN.keysig + IN.tempsig;
		var N = [1,0,2,0,3,4,0,5,0,6,0,7][note % 12];
		if(N>0 && IN.strSharp.indexOf(N)!=-1) sig++;
		if(N>0 && IN.strFlat.indexOf(N)!=-1) sig--;
		note += sig;
		PLAYER.play(0, note);
		return note;
	},
	Eop: {
		90: 36, 88: 38, 67: 40, 86: 41, 66: 43, 78: 45, 77: 47, 188: 48, 190: 50, 
		65: 48, 83: 50, 68: 52, 70: 53, 71: 55, 72: 57, 74: 59, 75: 60, 76: 62, 186: 64, 222: 65, 13: 67, 
		81: 60, 87: 62, 69: 64, 82: 65, 84: 67, 89: 69, 85: 71, 73: 72, 79: 74, 80: 76, 219: 77, 221: 79, 220: 81, 
		49: 72, 50: 74, 51: 76, 52: 77, 53: 79, 54: 81, 55: 83, 56: 84, 57: 86, 48: 88, 189: 89, 187: 91, 8: 93
	},
	Ki: {
		192: 58, 49: 59, 81: 60, 50: 61, 87: 62, 51: 63, 69: 64, 82: 65, 53: 66, 84: 67, 54: 68, 89: 69, 
		55: 70, 85: 71, 73: 72, 57: 73, 79: 74, 48: 75, 80: 76, 219: 77, 187: 78, 221: 79, 8: 80, 220: 81, 
		90: 48, 83: 49, 88: 50, 68: 51, 67: 52, 86: 53, 71: 54, 66: 55, 72: 56, 78: 57, 74: 58, 77: 59, 
		188: 60, 76: 61, 190: 62, 186: 63, 191: 64, 16: 65
	}
}

/**
	Recorder
		ctxt: NoteJSON[];
		isRecord, isWait: bool;
		offset: int;
		record(channel, note: int, volume: number, time: int): noteObj;
		play();
		stop();
		sort();
**/

recorder = {
	ctxt: [],
	isRecord: true,
	isWait: true,  // wait for pressing first key, and time start to run
	offset: new Date().getTime(),
	speed: 1,
	record: function (channel, note, volume){
		var time = new Date().getTime();
		if(recorder.isWait) recorder.offset = Math.round(time - view.p);
		recorder.isWait = false;
		var noteObj = {c: channel, n: note, v: volume, t: time - recorder.offset};
		recorder.ctxt.push(noteObj);
		view.findP(time - recorder.offset);
		return noteObj;
	},
	play: function (){
		recorder.stop();
		var stor = recorder.ctxt;
		for(var i = 0; i < stor.length; i++){
			var dt = Math.floor((stor[i].t - view.p)/recorder.speed);
			if (dt < 0) continue;
			PLAYER.play(stor[i].c, stor[i].n, stor[i].v, dt);
			setTimeout(
				function (i){
					view.moveP(stor[i].t);
				}.bind(undefined, i),
				dt
			);
			if(stor[i].d) setTimeout(
				function (i){
					MIDI.noteOff(stor[i].c, stor[i].n);
				}.bind(undefined, i),
				dt+stor[i].d
			);
		}
	},
	stop: function (){
		for(var i = 0; i < 100000; i++){
			clearTimeout(i);
		}
	},
	sort: function (){
		recorder.ctxt.sort(function (a,b){
			return a.t - b.t;
		});
	},
	setSpeed: function(s){
		$("playSpeed").value = s;
		$("playSpeedBar").value = s*100;
		recorder.speed = s;
	},
	scale: function(){
		var ss = 1/recorder.speed;
		recorder.ctxt.forEach(function(e){
			e.t *= ss;
		});
		grid.gap *= ss;
		$("bpm").value = 60/grid.gap*1000;
		recorder.setSpeed(1);
	},
	toJSON: function(g,v,c){
		recorder.sort();
		var json = "";
		recorder.ctxt.forEach(function(e){
			var T = Math.round(e.t);
			if(g){
				T = Math.round(T/grid.gap*12);// 12 is for detail gcd 2 3 4
			}
			var E;
			if(T>=32){
				E = T>>12 + 32; // 0000001 xxxxx | xxxxxxxxxx
				json += WXYcode.dtob(e.n>>3) + WXYcode.dtob(T & 4095);
			}
			var E = String.fromCharCode(e.n) + dtob(T,64);
			//if(v&&e.v) E+="v"+e.v;
			//if(c&&e.c) E+="c"+e.c;
			//json.push(E);
		});
		
		var header = "";
		if(g){
			header = Math.round(60/grid.gap*1000)+"|";
		}
		return header+JSON.stringify(json).replace(/\"\,\"/g,",");
	},
	fromJSON: function(str){
		var gap = str.split("||");
		if(gap.length>1){
			grid.enable = true;
			$(LAN.grid).className = "yellowOn";
			grid.gap = Number(gap[0]);
			$("bpm").value = 60/grid.gap*1000;
			str = gap[1];
		}
		var dat = eval(str.replace(/,,/g,"==").replace(/,/g,'","').replace(/==/g,'",",'));
		recorder.ctxt = [];
		var btod = function (str, base) {
			var n = 0, digit = "ABCDEFGHIJKLMNOPQRSTUVWXYZab-defghijklmnopqrstu?wxyz0123456789+/=";
			for(var i=0; i<str.length; i++){
				n += digit.indexOf(str.charAt(i))*Math.pow(base,str.length-i-1);
			}
			return n;
		}
		dat.forEach(function(e){
			var obj = {n: e.charCodeAt(0)};
			e = e.slice(1);
			var T =btod(e.split("v")[0].split("c")[0],64);
			if(gap.length>1){
				T *= grid.gap/12;
			}
			obj.t = T;
			if(e.indexOf("v")!=-1) {obj.v = e.split("v")[1].split("c")[0];}else
			obj.v = PLAYER.autoVolume(obj.n);
			if(e.indexOf("c")!=-1) {obj.c = e.split("c")[1].split("v")[0];}else
			obj.c = 0;
			recorder.ctxt.push(obj);
		});
	}
}

/**
	view
		ctxt: NoteJSON[];
**/

view = {
	ctxt: {},
	p: 0, oldP: 0,
	min: -1000, max: 9000,//horizontal range(ms)
	nmin: 20, nmax: 110,//vertical range
	dx: 10,   //the length of the note
	ismove: false,
	k: 0, nk: 0, delZoom: 0.005,// k is scale factor of x, nk is scale factor of y
	margin: 40, margout: 320,//result of finding pos automatically  , and margin of finding pos automatically
	findP: function (view_p){ // to find view_p in the view
		if((view_p-view.min)*view.k > view.width - view.margin){
			var i = view_p + view.margout/view.k;
			view.min = i - (view.max - view.min);
			view.max = i;
		}else if((view_p-view.min)*view.k <  view.margin){
			var i = view_p - view.margout/view.k;
			view.max = i + (view.max - view.min);
			view.min = i;
		}
		view.draw();
	},
	moveP: function (view_p){ // to move pos to view_p and find it in the view
		view.p = view_p;
		view.findP(view_p);
	},
	draw: function (){
		var storage = recorder.ctxt;
		var keysig = IN.keysig;
		var ctxt = view.ctxt;
		ctxt.clearRect(0, 0, view.width, view.height);
		select.drawRect(ctxt);
		grid.draw(ctxt);
		//Notes
		ctxt.font="20px Arial";
		for(var i = 0; i < storage.length; i++){
			if (storage[i].t < view.min || storage[i].t > view.max) continue;
			var selected = select.test(storage[i]);
			ctxt.fillStyle = velocity.getBoxColor(selected,storage[i].v);
			var X = (storage[i].t-view.min)*view.k;
			var Y = (storage[i].n-view.nmax)*view.nk;
			var dx = (storage[i].d) ? storage[i].d*view.k : undefined;
			ctxt.fillRect(X, Y, dx || view.dx, view.nk);
			if(view.max-view.min<100000){
				ctxt.fillStyle = velocity.getTextColor(selected,storage[i].v);
				ctxt.fillText(["1","#1","2","#2","3","4","#4","5","#5","6","#6","7"][(storage[i].n - keysig) % 12],X-view.dx, Y);
			}
		}
		//Keyboard lines
		ctxt.strokeStyle = "#BBB";
		ctxt.lineWidth = 0.5;
		ctxt.beginPath();
		for(var i = view.nmin; i <= view.nmax; i++){
			var Y = (i-view.nmax)*view.nk;
			ctxt.moveTo(0, Y);
			ctxt.lineTo(view.width, Y);
		}
		ctxt.stroke();
		ctxt.beginPath();
		ctxt.strokeStyle = "#AAA";
		ctxt.lineWidth = 2;
		for(var i = view.nmin; i <= view.nmax; i++){
			if(i%12 == 1 || i%12 == 3 || i%12 == 6 || i%12 == 8 || i%12 == 10)
			var Y = (i-view.nmax+0.5)*view.nk;
			ctxt.moveTo(0, Y);
			ctxt.lineTo(view.width, Y);
		}
		ctxt.stroke();
		//Start and Pos lines
		ctxt.lineWidth = 1;
		var xp = (view.p - view.min) * view.k;
		ctxt.beginPath();
		ctxt.strokeStyle = "#0E0";
		ctxt.moveTo(xp, 0);
		ctxt.lineTo(xp, view.height);
		ctxt.stroke();
		ctxt.beginPath();
		ctxt.strokeStyle = "#F00";
		ctxt.moveTo(-view.min * view.k, 0);
		ctxt.lineTo(-view.min * view.k, view.height);
		ctxt.stroke();
	},
	runAt$: function (obj){
		panel.$();// initiate panel
		recorder.offset = new Date().getTime();
		view.width = $(obj).width = window.innerWidth-20;
		view.height = $(obj).height = window.innerHeight-20;
		view.ctxt = ctxt$(obj);
		view.k = view.width / (view.max - view.min);
		view.nk = view.height / (view.nmin - view.nmax);
		//registre evenements
		addEvent.viewMouse(obj);
		addEvent.INKey();
		view.draw();
	}
}
velocity = {
	getBoxColor: function (s,v){
		var rgb = velocity._HSB_to_RGB(270-v*2, s?0.5:1, s?1:0.7);
		return "rgb("+rgb.R+","+rgb.G+","+rgb.B+")";
	},
	getTextColor: function (s,v){
		var rgb = velocity._HSB_to_RGB(270-v*2, 1, s?0.6:0.2);
		return "rgb("+rgb.R+","+rgb.G+","+rgb.B+")";
	},
	_HSB_to_RGB: function(H, S, B) {
		var rgb = {R:0, G:0, B:0};
		H = (H >= 360) ? H%360 : H;
		if(S == 0) {
			rgb.R = B * 255;
			rgb.G = B * 255;
			rgb.B = B * 255;
		} else {
			var i = Math.floor(H / 60) % 6;
			var f = H / 60 - i;
			var p = B * (1 - S);
			var q = B * (1 - S * f);
			var t = B * (1 - S * (1 - f));
			switch(i) {
				case 0: rgb.R = B, rgb.G = t, rgb.B = p; break;
				case 1: rgb.R = q; rgb.G = B; rgb.B = p; break;
				case 2: rgb.R = p; rgb.G = B; rgb.B = t; break;
				case 3: rgb.R = p; rgb.G = q; rgb.B = B; break;
				case 4: rgb.R = t; rgb.G = p; rgb.B = B; break;
				case 5: rgb.R = B; rgb.G = p; rgb.B = q; break;
			}
			rgb.R = Math.floor(rgb.R * 255);
			rgb.G = Math.floor(rgb.G * 255);
			rgb.B = Math.floor(rgb.B * 255);
		}
		return rgb;
	}
}

/**
	Select
		draw(ctxt: Ctxt);
		fini();
**/

select = {
	rect: null, //selected range{xa:0,xb:0,ya:0,yb:0}
	selectedArr: [],
	clipboard: [],
	drawRect: function (ctxt){
		if(select.rect){
			ctxt.fillStyle = "#BFB";
			ctxt.fillRect((select.rect.xa-view.min)*view.k,
				(select.rect.ya-view.nmax)*view.nk,
				(select.rect.xb-select.rect.xa)*view.k,
				(select.rect.yb-select.rect.ya)*view.nk);
		}
	},
	testRect: function (n){
		if(!select.rect) return false;
		var temp = (n.t < select.rect.xa) ^ (n.t < select.rect.xb);
		return temp && (n.n < select.rect.ya) ^ (n.n < select.rect.yb);
	},
	test : function (n){
		return select.testRect(n) ^ (select.selectedArr.indexOf(n) != -1);
	},
	fini: function (){
		var s = recorder.ctxt;
		var newselectedArr = [];
		for(var i = 0; i < s.length; i++){
			if(select.test(s[i])) newselectedArr.push(s[i]);
		}
		$(LAN.edit).className = (!newselectedArr.length)?"blueOn":"blueOff";
		select.selectedArr = newselectedArr;
		select.rect = null;
		view.draw();
	},
	all: function (){
		select.selectedArr = recorder.ctxt.slice(0);
		$(LAN.edit).className = (!recorder.ctxt.length)?"blueOn":"blueOff";
		view.draw();
	},
	del: function (){
		var s = recorder.ctxt;
		for(var i = 0; i < s.length; i++){
			if(select.test(s[i])) {
				s.splice(i,1);
				i--;
			}
		}
		$(LAN.edit).className = "blueOn";
		select.selectedArr = [];
		view.draw();
	},
	up: function (){
		var s = recorder.ctxt;
		for(var i = 0; i < s.length; i++){
			if(select.test(s[i])) s[i].n++;
		}
		view.draw();
	},
	down: function (){
		var s = recorder.ctxt;
		for(var i = 0; i < s.length; i++){
			if(select.test(s[i])) s[i].n--;
		}
		view.draw();
	},
	copy: function (){
		recorder.sort();
		var s = recorder.ctxt;
		select.clipboard = [];
		for(var i = 0; i < s.length; i++){
			if(select.test(s[i])) select.clipboard.push({c:s[i].c,n:s[i].n,v:s[i].v,t:s[i].t,d:s[i].d});
		}
	},
	cut: function (){
		select.copy();
		select.del();
	},
	paste: function (){
		var s = select.clipboard;
		select.selectedArr = [];
		for(var i=0; i<s.length;i++){
			var newNote = {c:s[i].c,n:s[i].n,v:s[i].v,t:Math.round(s[i].t-s[0].t+view.p)};
			recorder.ctxt.push(newNote);
			select.selectedArr.push(newNote);
		}
		recorder.sort();
		$(LAN.edit).className = (!select.selectedArr.length)?"blueOn":"blueOff";
		view.draw();
	},
	undo: function (){
		var n = recorder.ctxt.pop();
		view.moveP(n.t);
		view.draw();
	}
}

/**
	Grid
		draw(ctxt: Ctxt);
		IN(note: int);
		nearest(vp: number);
		next();
**/

grid = {
	enable: false,
	gap: 500,//gap = 60/x*1000, x is bpm
	detail: 1, //can be 1\2\3
	INdelay: 100,//threshod for "the sametime", for input chord
	draw: function (ctxt){
		if(!grid.enable) return 0;
		if(view.max-view.min>100000) return 0;
		ctxt.lineWidth = 0.5;
		ctxt.strokeStyle = "#AA6";
		ctxt.beginPath();
		for(var i=Math.floor(view.min/grid.gap)*grid.gap; i<=view.max; i+=grid.gap/grid.detail){
			var xp = (i - view.min) * view.k;
			ctxt.moveTo(xp, 0);
			ctxt.lineTo(xp, view.height);
		}
		ctxt.stroke();
		ctxt.lineWidth = 1;
		ctxt.strokeStyle = "#6AA";
		ctxt.beginPath();
		for(var i=Math.floor(view.min/grid.gap)*grid.gap; i<=view.max; i+=grid.gap){
			var xp = (i - view.min) * view.k;
			ctxt.moveTo(xp, 0);
			ctxt.lineTo(xp, view.height);
		}
		ctxt.stroke();
		
	},
	nearest: function (vp){
		return Math.round(vp/grid.gap*grid.detail)*grid.gap/grid.detail;
	},
	IN: function(note){
		if(recorder.isWait){
			recorder.isWait = false;
			setTimeout(function(){view.moveP(grid.next());recorder.isWait = true;view.draw();}, grid.INdelay);
		}
		if(note) recorder.ctxt.push({c: 0, n: note, v: PLAYER.autoVolume(note), t: view.p});
	},
	next: function (){
		return view.p + grid.gap/grid.detail;
	},
	prev: function (){
		return view.p - grid.gap/grid.detail;
	}
}

/**
	AddEvent
		viewMouse(obj: Obj);
		INKey();
**/

addEvent = {
	viewMouse: function (obj){
		var p2p = function (obj,evt){
			var rect = $(obj).getBoundingClientRect(); 
			return p(
				evt.clientX - rect.left * ($(obj).width / rect.width),
				evt.clientY - rect.top * ($(obj).height / rect.height)
			);
		}
		$(obj).addEventListener("contextmenu", function (evt) {evt.preventDefault(); }, false);
		var mousefini = function (evt) {
			view.ismove = false;
			if(evt.button == 0) select.fini();
			if(IN.presstr.indexOf(String.fromCharCode(18))!=-1 && grid.enable){
				select.selectedArr.forEach(function (e){e.d = grid.nearest(e.d);});
				view.draw();
			}
		}
		$(obj).addEventListener("mouseup", mousefini);
		$(obj).addEventListener("mouseout", mousefini);
		$(obj).addEventListener("mousedown", function (evt) {
			panel.set(null);//close all the windows
			var Pos = p2p(obj,evt);
			if(evt.button == 2){
				view.p = Pos.x/view.k+view.min;
				if(grid.enable) view.p = grid.nearest(view.p);
				view.draw();
				recorder.isWait = true;
			}else if(evt.button == 0){
				view.ismove = true;
				if(IN.presstr.indexOf(String.fromCharCode(18))!=-1 || IN.presstr.indexOf(String.fromCharCode(16))!=-1){
				//hold alt: scale duration || hold shift: edit velocity
					view.oldP = Pos.x/view.k+view.min;
					return 0;
				}
				select.rect = {};
				if(IN.presstr.indexOf(String.fromCharCode(17))==-1){//not hold ctrl -> new select area 
					select.selectedArr = [];
				}
				select.rect.xa = select.rect.xb = Pos.x/view.k+view.min;
				select.rect.ya = select.rect.yb = Pos.y/view.nk+view.nmax;
				view.draw();
			}else {
				view.ismove = true;
				view.oldP = Pos.x/view.k+view.min;
			}
		});
		$(obj).addEventListener("mousemove", function (evt) { 
			var Pos = p2p(obj,evt);
			if(view.ismove){
				if(evt.button == 0&&(evt.buttons!==4)){
					if(IN.presstr.indexOf(String.fromCharCode(18))!=-1){
						var gap = Pos.x/view.k+view.min - view.oldP;
						select.selectedArr.forEach(function (e){
							e.d = e.d || 0;
							e.d += gap;
							if(e.d<=0)e.d = undefined;
						});
						view.oldP = Pos.x/view.k+view.min;
					}else if(IN.presstr.indexOf(String.fromCharCode(16))!=-1){
						var gap = Pos.x/view.k+view.min;
						select.selectedArr.forEach(function (e){
							if(e.t<view.oldP ^ e.t<gap) e.v = Math.round(Pos.y/view.nk+view.nmax);
						});
						view.oldP = Pos.x/view.k+view.min;
					}else{
						select.rect.xb = Pos.x/view.k+view.min;
						select.rect.yb = Pos.y/view.nk+view.nmax;
					}
					view.draw();
				}else if(evt.button == 1|| (evt.buttons===4)){
					var gap = Pos.x/view.k+view.min - view.oldP;
					view.min -= gap;
					view.max -= gap;
					view.oldP = Pos.x/view.k+view.min;
					view.draw();
				}
			}
		});
		if(!Math.sign) Math.sign = function (x) { return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;}
		$(obj).addEventListener("mousewheel", function (evt) { 
			var Pos = p2p(obj,evt);
			var dx = Math.sign(event.wheelDelta) * (view.max - view.min)*0.1;
			if((view.max-view.min<50 && dx>0) || (view.max-view.min>5000000&& dx<0))return 0;
			var ddx = Pos.x/view.width;
			view.max -= dx*(1-ddx);
			view.min += dx*ddx;
			view.k = view.width / (view.max - view.min);
			view.nk = view.height / (view.nmin - view.nmax);
			view.draw();
		});
		window.addEventListener("resize", function () {
			view.width = $(obj).width = window.innerWidth-20;
			view.height = $(obj).height = window.innerHeight-20;
			view.k = view.width / (view.max - view.min);
			view.nk = view.height / (view.nmin - view.nmax);
			view.draw();
		}, false);
		/*window.onbeforeunload = function(event){    
			return 'SUI PU ANJ'; 
		};*/
	},
	INKey: function (){
		document.addEventListener('keydown', function( ev ) {
			if(IN.presstr.indexOf(String.fromCharCode(ev.keyCode))!=-1||(!IN.enable))return 0 ;
			var note;
			IN.presstr += String.fromCharCode(ev.keyCode);
			var pressnote = null;//"\t";//0x08 initial empty note
			if(IN.presstr.indexOf(String.fromCharCode(17))!=-1&&IN.presstr.indexOf(String.fromCharCode(191))!=-1&&grid.enable){
				// press Ctrl+? for prev grid
				view.moveP(grid.prev());recorder.isWait = true;view.draw();
			}else if(IN.presstr.indexOf(String.fromCharCode(191))!=-1&&grid.enable){// press ? for next grid
				grid.IN(null);
			}else if(IN.presstr.indexOf(String.fromCharCode(17))!=-1){// Ctrl + 
				switch(ev.keyCode){
					case 65:
						select.all();
					break;
					case 90:
						select.undo();
					break;
					case 88:
						select.cut();
					break;
					case 67:
						select.copy();
					break;
					case 86:
						select.paste();
					break;
					default:
						note = {37: 1, 38: 4, 39: 3, 40: 2}[ev.keyCode];
						if(note){
							grid.detail = note;
							view.draw();
							note = null;
						}
					
				}
			}else if (select.selectedArr.length){// modify mode
				switch(ev.keyCode){
					case 8: //del
						select.del();
					break;
					case 38://up
						select.up();
					break;
					case 40://down
						select.down();
					break;
				}
				note = null;
			}else if(IN.presstr.indexOf(String.fromCharCode(16))!=-1 && ev.keyCode == 192){// shift + ~
				IN.keysig++; panel.refresh(); view.draw();
			}else if(IN.presstr.indexOf(String.fromCharCode(18))!=-1 && ev.keyCode == 192){// alt + ~
				IN.keysig--; panel.refresh(); view.draw();
			}else if(IN.mode == "eop"){
				var temparr = IN.presstr.indexOf(String.fromCharCode(192))!=-1 ? 
					{37: "2", 38: "3", 39: "7", 40: "6"} : 
					{37: "1", 38: "4", 39: "6", 40: "5"}; // hold key "~"(code:192)
				note = temparr[ev.keyCode];
				if(note){
					if(IN.presstr.indexOf(String.fromCharCode(192))!=-1) IN.strFlat += note;
					else IN.strSharp += note;
				}
				note = IN.Eop[ev.keyCode];
				if(!note){
					if(ev.keyCode == 16){ //shift 
						IN.strSharp = "";
						IN.strFlat = "";
						IN.keepfirsttemp = false;
						if(IN.presstr.indexOf(String.fromCharCode(32))==-1)IN.tempsig = 0;
						//remove effect of space tempdig
					}else if(ev.keyCode == 32) {
						IN.tempsig = 1;
						IN.keepfirsttemp = true;
					};
					panel.refresh();
					view.draw();
				}
			}else if(IN.mode == "ki"){
				note = IN.Ki[ev.keyCode];
			}
			if(note) {
				note = IN.ki(note);
				IN.keepfirsttemp = false;
				if(IN.presstr.indexOf(String.fromCharCode(32))==-1)IN.tempsig = 0;
				//remove effect of space tempdig
				//pressnote = String.fromCharCode(note);
				if(grid.enable){
					grid.IN(note);
				}else if(!(recorder.isRecord === false)) pressnote = recorder.record(0, note, PLAYER.autoVolume(note));
			}
			IN.pressnote.push(pressnote);//garant the same length between pressnote and presstr
		});
		document.addEventListener('keyup', function( ev ) {
			var key = String.fromCharCode(ev.keyCode);
			if(ev.keyCode == 32){
				if(!IN.keepfirsttemp){
					IN.tempsig = 0;
				}
			}
			if(!IN.sustain){
				var n = IN.pressnote[IN.presstr.indexOf(key)];
				if(n){
					MIDI.noteOff(0,n.n);
					n.d = new Date().getTime() - n.t - recorder.offset;
					view.draw();
				}
			}
			IN.pressnote.splice(IN.presstr.indexOf(key),1);
			IN.presstr = IN.presstr.replace(key,"");
		});
	}
}

/**
	Panel
		buttons: btnJSON[];
		$();
		refresh();
**/

langue = {
	wne: function(){
		this.play = "ZEU";
		this.stop = "TNE";
		this.save = "ANJ";
		this.edit = "RIE";
		this.open = "GAN";
		this.close = "GESE";
		this.scale = "Scale";
		this.grid = "GRD";
		this.tempo = "TEM";
		this.sus = "sus";
	},
	zh: function(){
		this.play = "&#x25b6;";
		this.stop = "&#x2586;";
		this.save = "保存";
		this.edit = "编辑";
		this.open = "加载";
		this.close = "OK";
		this.scale = "缩放";
		this.grid = "网格";
		this.tempo = "速度";
		this.sus = "延音";
	},
}
LAN = new langue.zh();

panel = {
	buttons: [
		{name:LAN.play, className:"blue", action: recorder.play},
		{name:LAN.stop, className:"blue", action: recorder.stop},
		{name:LAN.edit, className:"blueOn", action: "disabled"},
		{name:"|<", className:"blue", action: function (){
			if(!recorder.ctxt.length) {
				view.moveP(0);
				return 0;
			}
			recorder.sort();
			view.moveP(recorder.ctxt[0].t);
		}},
		{name:"<<", className:"blue", action: function (){
			recorder.sort();
			for(var i = recorder.ctxt.length-1; i >= 0; i--){
				if(recorder.ctxt[i].t < view.p){
					view.moveP(recorder.ctxt[i].t);
					break;
				}
			}
		}},
		{name:">>", className:"blue", action: function (){
			recorder.sort();
			for(var i = 0; i < recorder.ctxt.length; i++){
				if(recorder.ctxt[i].t > view.p){
					view.moveP(recorder.ctxt[i].t);
					break;
				}
			}
		}},
		{name:">|", className:"blue", action: function (){view.moveP(recorder.ctxt[recorder.ctxt.length-1].t)}},
		{name:"Keysig", className:"dis", action: "disabled"},
		{name:"strSharp", className:"dis", action: "disabled"},
		{name:"strFlat", className:"dis", action: "disabled"},
		{name:"EOP", className:"green", action: function (){
			IN.mode = (IN.mode=="eop")?"ki":"eop";
			$("EOP").innerHTML = IN.mode.toUpperCase();
		}},
		{name:LAN.sus, className:"greenOn", action: function (){
			IN.sustain = !IN.sustain;
			$(LAN.sus).className = (IN.sustain)?"greenOn":"green";
		}},
		{name:"volume", className:"green", action: "disabled"},
		{name:LAN.save, className:"red", action: function (){
			var str = xcode.en(recorder.ctxt, grid.enable?grid.gap:0)//recorder.toJSON(grid.enable);
			panel.set(LAN.save);
			$("output").value = str;
			
		}},
		{name:LAN.open, className:"red", action: function (){
			panel.set(LAN.open);
			$("output").value = "";
		}},
		{name:LAN.grid, className:"yellow", action: function (){
			grid.enable = !grid.enable;
			if(grid.enable){
				recorder.isWait = true;
				view.p = grid.nearest(view.p);
			}
			view.draw();
			$(LAN.grid).className = (grid.enable)?"yellowOn":"yellow";
		}},
		{name:LAN.tempo, className:"yellow", action: function (){
			panel.set(LAN.tempo);
		}},
		{name:"？", className:"white", action: function (){
			panel.set("？");
		}}
	],
	set: function (str){
		$("dialog").style.display = "none";
		$("tempo").style.display = "none";
		$("help").style.display = "none";
		switch(str){
			case LAN.save: case LAN.open:
				$("dialog").style.display = "block";
			break;
			case LAN.tempo:
				$("tempo").style.display = "block";
			break;
			case "？":
				$("help").style.display = "block";
			break;
		}
		panel.dialog = str;
	},
	$: function (){// initiate
		var Panel = document.createElement("DIV");
		var Dialog = document.createElement("DIV");
		var Tempo = document.createElement("DIV");
		var Help = document.createElement("DIV");
		var TA = document.createElement("TEXTAREA");
		var BTN = document.createElement("BUTTON");
		BTN.innerHTML = LAN.close;
		BTN.onclick = function (){
			Dialog.style.display = "none";
			if(panel.dialog == LAN.open){
				recorder.ctxt = xcode.de($("output").value);//recorder.fromJSON($("output").value);
				view.draw();
			}
			panel.dialog = null;
		}
		Panel.className = "panel";
		Tempo.className = "tempo";
		Help.className = "help";
		Dialog.className = "dialog";
		BTN.className = "dialog";
		TA.className = "dialog";
		Tempo.id = "tempo";
		Help.id = "help";
		Dialog.id = "dialog";
		TA.id = "output";
		TA.onfocus = function(){IN.enable = false};
		TA.onblur = function(){IN.enable = true};
		Dialog.appendChild(TA);
		Dialog.appendChild(BTN);
		panel.dialog = null;
		panel.buttons.forEach(function (e){
			var btn = document.createElement("BUTTON");
			btn.innerHTML = e.name;
			btn.id = e.name;
			btn.className = e.className;
			if(e.action == "disabled"){
				btn.disabled = "disabled";
			}
			btn.onclick = e.action;
			btn.onfocus = function (){this.blur();return false;};
			Panel.appendChild(btn);
			e.btn = btn;
		});
		document.body.appendChild(Panel);
		document.body.appendChild(Dialog);
		document.body.appendChild(Tempo);
		document.body.appendChild(Help);
		var tempoHTML = 'x<input id="playSpeed" value="1" style="width:30px" onfocus="IN.enable = false" onblur="IN.enable = true" onchange="recorder.setSpeed(Number(this.value));"> <input onfocus="this.blur();return false;" style="width:70px; height:10px;" id="playSpeedBar" type="range" min="0" max="200" value="100" onchange="recorder.setSpeed(this.value/100);"> <button onclick="recorder.scale();view.draw();">'+LAN.scale+'</button><hr>&#9833; = <input id="bpm" value="120" style="width:30px" onfocus="IN.enable = false" onblur="IN.enable = true"> <button onclick="grid.gap=60/$(\'bpm\').value*1000;view.draw();">Set</button> <button onclick="recorder.setSpeed($(\'bpm\').value*grid.gap/60000);recorder.scale();view.draw();">'+LAN.scale+'</button>';
		var helpHTML = $('txthelp').innerHTML;
		Tempo.innerHTML = tempoHTML;
		Help.innerHTML = helpHTML;
		$("volume").innerHTML = '<input onfocus="this.blur();return false;" style="width:70px; height:10px;" type="range" min="0" max="200" value="100" onchange="PLAYER.volume = (this.value / 100);">';
		$("volume").style.width = "74px";
		panel.refresh();
	},
	
	refresh: function (){
		var i = Math.floor(IN.keysig/12);
		$("Keysig").innerHTML = ['C','<i>#</i>C','D','<i>#</i>D/<i>b</i>E','E','F','<i>#</i>F/<i>b</i>G','G','<i>#</i>G/<i>b</i>A','A','<i>#</i>A/<i>b</i>B','B/<i>b</i>C'][(IN.keysig+120) % 12] + "<span class='small'>" + (i==0?"":i==1?"+":i==-1?"-":i) + "</span>";
		$("strSharp").innerHTML = "<i>#</i>"+IN.strSharp;
		$("strFlat").innerHTML = "<i>b</i>"+IN.strFlat;
	}
}
