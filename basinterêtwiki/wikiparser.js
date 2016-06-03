var wikiParser = (function(){
    'use strict';
    var a = {};
    a.version = '1.0.0';
    var b = {};
    b.Token = function(id,image){
        this.id = id;
        this.image = image;
    }
    b.wikiScanner = function(file){
        this.s = file;
        this.cursor = 0;
        this.line = this.column = 1;
        this.lexiquestate = b.wikiScanner.STDEFAULT;
        this.sstack = [];
    }
    b.wikiScanner.prototype.eof = function(){
        return this.cursor >= this.s.length;
    }
    b.wikiScanner.prototype.mkError = function(msg){
        return msg + ' at line ' + this.line + ',column ' + this.column;
    }
    b.wikiScanner.prototype.pushState = function(s){
        this.sstack.push(this.lexiquestate);
        this.lexiquestate = s;
    }
    b.wikiScanner.prototype.popState = function(){
        this.lexiquestate = this.sstack.pop();
    }
    b.wikiScanner.prototype.getchar = function(){
        if(this.eof()){
            return '';
        }
        var ret = this.s[this.cursor++];
        if(ret == '\n'){
            this.line++;
            this.column = 1;
        }
        else
            this.column++;
        return ret;
    }
    b.wikiScanner.prototype.char = function(){
        if(this.eof()){
            return '';
        }
        return this.s[this.cursor];
    }
    //tokens
    b.wikiScanner.STRING = 0;
    b.wikiScanner.H = 1;
    b.wikiScanner.LINKSTART = 2;
    b.wikiScanner.LINKEND = 3;
    b.wikiScanner.SEPERATOR = 4;
    b.wikiScanner.NEWLINE = 5;
    b.wikiScanner.NEWP = 6;
    b.wikiScanner.BIQUOTE = 7;
    b.wikiScanner.TRIQUOTE = 8;
    b.wikiScanner.COLON = 9;
    b.wikiScanner.STAR = 10;
    b.wikiScanner.EOF = 255;
    //states
    b.wikiScanner.STDEFAULT = 0;
    b.wikiScanner.STINLINK = 1;
    b.wikiScanner.prototype.ignoreSpace = function(){
        while(this.char() == ' '){
            this.getchar();
        }
    }
    
    b.wikiScanner.prototype.next = function(){
        var char = this.char();
        var image = '';
        var space = '';

        if(char == ''){
            return new b.Token(b.wikiScanner.EOF,'EOF');
        }
        
        if(char == '\n'){
            image += this.getchar();
            if(this.char() == '\n'){
                this.getchar();
                return new b.Token(b.wikiScanner.NEWLINE,'\\n\\n');
            }
            image = '';
            char = this.char();
        }
        
        if(char == '['){
            image += this.getchar();
            if(this.char() == '['){
                this.getchar();
                this.pushState(b.wikiScanner.STINLINK);
                return new b.Token(b.wikiScanner.LINKSTART,'[[');
            }
        }
        
        else if(char == '\''){
            image += this.getchar();
            if(this.char() == '\''){
                image += this.getchar();
                if(this.char() == '\''){
                    image += this.getchar();
                    return new b.Token(b.wikiScanner.TRIQUOTE,image);
                }
                else{
                    return new b.Token(b.wikiScanner.BIQUOTE,image);
                }
            }
        }
        else if(char == ']'){
            image += this.getchar();
            if(this.char() == ']'){
                image += this.getchar();
                this.popState();
                return new b.Token(b.wikiScanner.LINKEND,']]');
            }
        }
        else if(this.lexiquestate == b.wikiScanner.STDEFAULT && char == '='){
            image += this.getchar();
            if(this.char() == '='){
                var hcount = 1;
                image += this.getchar();
                while(this.char() == '='){
                    image += this.getchar();
                    hcount++;
                }
                var ret = new b.Token(b.wikiScanner.H,image);
                ret.hcount = hcount;
                return ret;
            }
        }
        else if(this.lexiquestate == b.wikiScanner.STDEFAULT && char == '*'){
            image += this.getchar();
            return new b.Token(b.wikiScanner.STAR);
        }
        else if(this.lexiquestate == b.wikiScanner.STINLINK && char == '|'){
            image += this.getchar();
            return new b.Token(b.wikiScanner.SEPERATOR,image);
        }
        else if(this.lexiquestate == b.wikiScanner.STINLINK && char == ':'){
            image += this.getchar();
            return new b.Token(b.wikiScanner.COLON,image);
        }
        //none has matched
        if(this.lexiquestate == b.wikiScanner.STDEFAULT){
            char = this.char();
            while(char != '[' && char != ']' && char != '=' && char != '' && char != '\n' && char != '\''){
                image += this.getchar();
                char = this.char();
            }
            return new b.Token(b.wikiScanner.STRING,image);
        }
        else if(this.lexiquestate == b.wikiScanner.STINLINK){
            char = this.char();
            while(char != '[' && char != ']' && char != '' && char != '\n' && char != '\'' && char != '|' && char != ':'){
                image += this.getchar();
                char = this.char();
            }
            return new b.Token(b.wikiScanner.STRING,image);
        }
    }
    
    a.Parser = function(){
        this.pstack = [];
        this.options = {
            queryUrl : '',
            queryObj : 'search',
            useRouter : false,
            titleClass : 'wk-title',
            paragraphClass : 'wk-p',
            linkClass : 'wk-link',
            imgClass : 'wk-img'
        };
        this.namespaces = {
            'File' : a.Parser.Filenamespace
        };
    }
    a.Parser.prototype = new b.wikiScanner('');
    a.Parser.prototype.constructor = a.Parser;
    
    
    a.Parser.prototype.init = function(file){
        b.wikiScanner.call(this,file);
        this.result = '';
        this.currentToken = this.next();
    }
    a.Parser.prototype.getToken = function(expect){
        if(expect != undefined && expect != this.currentToken.id)
            throw this.mkError('SyntaxError in wiki text');
        var ret = this.currentToken;
        this.currentToken = this.next();
        return ret;
    }
    a.Parser.prototype.parse = function(file){
        if(file != undefined)
            this.init(file);
        this.file();
        return this.result;
    }
    a.Parser.prototype.getTagClass = function(tag){
        switch(tag){
            case 'a':
                if(this.options.linkClass != ''){
                    return 'class="' + this.options.linkClass + '"';
                }
                return '';
            case 'h':
                if(this.options.titleClass != ''){
                    return 'class="' + this.options.titleClass + '"';
                }
                return '';
            case 'p':
                if(this.options.paragraphClass != ''){
                    return 'class="' + this.options.paragraphClass + '"';
                }
                return '';
            case 'img':
                if(this.options.imgClass != ''){
                    return 'class="' + this.options.imgClass + '"';
                }
                return '';
        }
    }
    
    //rules=================================================
    
    /**
     * file() ->
     * ( paragraph() | title() )* EOF
     */
    a.Parser.prototype.file = function(){
        while(this.currentToken.id != b.wikiScanner.EOF){
            switch(this.currentToken.id){
                case b.wikiScanner.H:
                    this.title();
                    this.result += this.pstack.pop();
                    break;
                default:
                    this.paragraph();
                    this.result += this.pstack.pop();
            }
        }
    }
    
    /**
     * link() ->
     * '[[' [ linkitem() ':' ] linkitem() ( '|' linkitem() )* ']]'
     * | 
     */
    a.Parser.prototype.link = function(){
        var s;
        this.getToken();
        this.linkitem();
        var t1 = this.pstack.pop();
        var t2 = '';
        if(this.currentToken.id == b.wikiScanner.COLON){
            this.getToken();
            var nsname = t1;
            this.linkitem();
            var src = this.pstack.pop();
            var args = [src];
            while(this.currentToken.id != b.wikiScanner.LINKEND){
                this.getToken(b.wikiScanner.SEPERATOR);
                this.linkitem();
                args.push(this.pstack.pop());
            }
            this.getToken();
            var ns = this.namespaces[nsname];
            if(ns == undefined){
                throw this.mkError('ReferenceError: no such namespace:' + nsname);
            }
            this.pstack.push(ns.run(args));
            return;
        }
        else if(this.currentToken.id == b.wikiScanner.SEPERATOR){
            this.getToken();
            this.linkitem();
            t2 = t1;
            t1 = this.pstack.pop();
            this.getToken(b.wikiScanner.LINKEND);
        }
        else{
            this.getToken(b.wikiScanner.LINKEND);
        }

        if(!this.options.useRouter){
            s = '<a title="' + t2 + '"' + this.getTagClass('a') + 
            ' href="' + this.options.queryUrl + '?' + this.options.queryObj + '=' + escape(t1) + '">' + t1 + '</a>';
        }
        else{
             s = '<a title="' + t2 + '"' + this.getTagClass('a') + 
            ' href="' + this.options.queryUrl + '#/' + t1 + '">' + t1 + '</a>';
        }
        this.pstack.push(s);
    }
    /**
     * linkitem() ->
     * ( atom() | link() )*
     */
    a.Parser.prototype.linkitem = function(){
        while(true){
            switch(this.currentToken.id){
                case b.wikiScanner.BIQUOTE:
                case b.wikiScanner.TRIQUOTE:
                case b.wikiScanner.STRING:
                    this.atom();
                    break;
                case b.wikiScanner.LINKSTART:
                    this.link();
                    break;
                default:return;
            }
        }
    }
    /**
     * title ->
     * H ( atom() | link() ) H
     */
    a.Parser.prototype.title = function(){
        var count = this.currentToken.hcount;
        var s = '<h' + (count+1) + ' '+ this.getTagClass('h') + '>';
        this.getToken();
        switch(this.currentToken.id){
            case b.wikiScanner.BIQUOTE:
            case b.wikiScanner.TRIQUOTE:
            case b.wikiScanner.STRING:
                this.atom();
                s += this.pstack.pop();
                break;
            case b.wikiScanner.LINKSTART:
                this.link();
                s += this.pstack.pop();
                break;
            default:throw this.mkError('SyntaxError: expect STRING or "[["');
        }
        var endt = this.getToken(b.wikiScanner.H);
        if(endt.hcount != count)
            throw this.mkError('SyntaxError: imbalance title bracket');
        s += '</h' + count + '>';
        this.pstack.push(s);
    }
    /**
     * sentence() ->
     * ( atom() | link() | points() )+
     */
    a.Parser.prototype.sentence = function(){
        var s = '';
        switch(this.currentToken.id){
            case b.wikiScanner.LINKSTART:
                this.link();
                s += this.pstack.pop();
                break;
            case b.wikiScanner.STRING:
            case b.wikiScanner.BIQUOTE:
            case b.wikiScanner.TRIQUOTE:
                this.atom();
                s += this.pstack.pop();
                break;
            default:throw this.mkError('SyntaxError: expect "[[",STRING,"\'\'"or"\'\'\'"');
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case b.wikiScanner.LINKSTART:
                    this.link();
                    s += this.pstack.pop();
                    break;
                case b.wikiScanner.STRING:
                case b.wikiScanner.BIQUOTE:
                case b.wikiScanner.TRIQUOTE:
                    this.atom();
                    s += this.pstack.pop();
                    break;
                default:break out;
            }
        }
        this.pstack.push(s);
    }
    /**
     * paragraph() ->
     * ( sentence() | points() )+ [NEWLINE]
     */
    a.Parser.prototype.paragraph = function(){
        var s = '<p class="' + this.options.paragraphClass + '">';
        switch(this.currentToken.id){
            case b.wikiScanner.STRING:
            case b.wikiScanner.BIQUOTE:
            case b.wikiScanner.TRIQUOTE:
            case b.wikiScanner.LINKSTART:
                this.sentence();
                s += this.pstack.pop();
                break;
            case b.wikiScanner.STAR:
                this.points();
                s += this.pstack.pop();
                break;
            default:throw this.mkError('SyntaxError: invalid syntax');
        }
        out:
        while(true){
            switch(this.currentToken.id){
                case b.wikiScanner.STRING:
                case b.wikiScanner.BIQUOTE:
                case b.wikiScanner.TRIQUOTE:
                case b.wikiScanner.LINKSTART:
                    this.sentence();
                    s += this.pstack.pop();
                    break;
                case b.wikiScanner.STAR:
                    this.points();
                    s += this.pstack.pop();
                    break;
                default:break out;
            }
        }
        s += '</p>';
        if(this.currentToken.id == b.wikiScanner.NEWLINE)
            this.getToken();
        this.pstack.push(s);
    }
    /**
     * points() ->
     * ( '*' sentence() )+ [NEWLINE]
     */
    a.Parser.prototype.points = function(){
        var s = '<ul><li>';
        this.getToken();
        this.sentence();
        s += this.pstack.pop() + '</li>';
        while(this.currentToken.id == b.wikiScanner.STAR){
            this.getToken();
            this.sentence();
            s += '<li>' + this.pstack.pop() + '</li>';
        }
        if(this.currentToken.id == b.wikiScanner.NEWLINE)
            this.getToken();
        s += '</ul>';
        this.pstack.push(s);
    }
    /**
     * atom() ->
     * STRING
     * | '' atom() ''
     * | ''' atom() '''
     */
    a.Parser.prototype.atom = function(){
        var s;
        switch(this.currentToken.id){
            case b.wikiScanner.STRING:
                s = this.currentToken.image;
                this.getToken();
                break;
            case b.wikiScanner.BIQUOTE:
                this.getToken();
                this.atom();
                s = '<i>' + this.pstack.pop() + '</i>';
                this.getToken(b.wikiScanner.BIQUOTE);
                break;
            case b.wikiScanner.TRIQUOTE:
                this.getToken();
                this.atom();
                s = '<b>' + this.pstack.pop() + '</b>';
                this.getToken(b.wikiScanner.TRIQUOTE);
                break;
            default:throw this.mkError('SyntaxError: expected STRING,"\'\'" or "\'\'\'"');
        }
        this.pstack.push(s);
    }
    
    //parser end===============================================
    
    a.Parser.Filenamespace = {
        run: function(args){
            var src = args[0];
            var caption = '';
            var type;
            var size;
            var caption = '';
            for(var i = 1;i < args.length;i++){
                if(args[i] == 'thumb'){
                    type = 'thumb';
                }
                else if(/[0-9]+px/.test(args[i])){
                    size = args[i].substr(0,args[i].length - 2);
                }
                else{
                    caption = args[i];
                }
            }
            switch(type){
                case 'thumb':
                    var s = '';
                    s += '<div class="' + this.options.outterDivClass + '"><div class="' + this.options.innerDivClass + '">';
                    s += '<a href="' + this.options.queryUrl + "?img="  + src + '">';
                    s += '<img src="' + this.options.srcPrefix + src + '" class="' + this.options.imgClass + '"';
                    s += size ? ' width="' + size + '"/>' : '/>';
                    s += '</a>';
                    s += '<div class="' + this.options.captionClass + '">' + caption + '</div>';
                    s += '</div></div>';
                    break;
                default:;
            }
            return s;
        },
        options: {
			queryUrl : 'index.html',
            srcPrefix : 'img/',
            outterDivClass : 'tright',
            innerDivClass : 'thumbinner',
            captionClass : 'thumbcaption',
            imgClass : 'wk-thumbimg'
        }
    };
    return a;
})();
