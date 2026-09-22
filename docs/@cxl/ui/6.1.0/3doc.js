var ts=Object.create;var Er=Object.defineProperty;var ns=Object.getOwnPropertyDescriptor;var rs=Object.getOwnPropertyNames;var os=Object.getPrototypeOf,is=Object.prototype.hasOwnProperty;var as=(e,t)=>()=>(e&&(t=e(e=0)),t);var ss=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),cs=(e,t)=>{for(var n in t)Er(e,n,{get:t[n],enumerable:!0})},ls=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of rs(t))!is.call(e,o)&&o!==n&&Er(e,o,{get:()=>t[o],enumerable:!(r=ns(t,o))||r.enumerable});return e};var us=(e,t,n)=>(n=e!=null?ts(os(e)):{},ls(t||!e||!e.__esModule?Er(n,"default",{value:e,enumerable:!0}):n,e));var ui={};cs(ui,{default:()=>Gs,theme:()=>li});var Vs,li,Gs,pi=as(()=>{"use strict";Vs={primary:"#8ECFF2","on-primary":"#003548","primary-container":"#004D67","on-primary-container":"#C1E8FF",secondary:"#B5C9D7","on-secondary":"#1F333D","secondary-container":"#364954","on-secondary-container":"#D1E6F3",tertiary:"#C9C2EA","on-tertiary":"#312C4C","tertiary-container":"#474364","on-tertiary-container":"#E5DEFF",error:"#FFB4AB","on-error":"#690005","error-container":"#93000A","on-error-container":"#FFDAD6",background:"#0F1417","on-background":"#DFE3E7",surface:"#0F1417","on-surface":"#DFE3E7","surface-variant":"#40484D","on-surface-variant":"#C0C7CD",outline:"#8A9297","outline-variant":"#40484D",scrim:"rgb(0 0 0 / 0.5)","inverse-surface":"#DFE3E7","on-inverse-surface":"#2C3134","inverse-primary":"#186584","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#0F1417","surface-bright":"#353A3D","surface-container-lowest":"#0A0F12","surface-container-low":"#171C1F","surface-container":"#1B2023","surface-container-high":"#262B2E","surface-container-highest":"#313539",warning:"#FFC107","on-warning":"#212121","warning-container":"#4E3400","on-warning-container":"#FFF3CF",success:"#81C784","on-success":"#000","success-container":"#2E7D32","on-success-container":"#fff"},li={name:"dark",colors:Vs},Gs=li});var Fa=ss((ab,Pa)=>{"use strict";function Ca(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{let n=e[t],r=typeof n;(r==="object"||r==="function")&&!Object.isFrozen(n)&&Ca(n)}),e}var mr=class{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function Aa(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function et(e,...t){let n=Object.create(null);for(let r in e)n[r]=e[r];return t.forEach(function(r){for(let o in r)n[o]=r[o]}),n}var Ll="</span>",ba=e=>!!e.scope,Pl=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let n=e.split(".");return[`${t}${n.shift()}`,...n.map((r,o)=>`${r}${"_".repeat(o+1)}`)].join(" ")}return`${t}${e}`},Do=class{constructor(t,n){this.buffer="",this.classPrefix=n.classPrefix,t.walk(this)}addText(t){this.buffer+=Aa(t)}openNode(t){if(!ba(t))return;let n=Pl(t.scope,{prefix:this.classPrefix});this.span(n)}closeNode(t){ba(t)&&(this.buffer+=Ll)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}},ya=(e={})=>{let t={children:[]};return Object.assign(t,e),t},Lo=class e{constructor(){this.rootNode=ya(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){let n=ya({scope:t});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,n){return typeof n=="string"?t.addText(n):n.children&&(t.openNode(n),n.children.forEach(r=>this._walk(t,r)),t.closeNode(n)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(n=>typeof n=="string")?t.children=[t.children.join("")]:t.children.forEach(n=>{e._collapse(n)}))}},Po=class extends Lo{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,n){let r=t.root;n&&(r.scope=`language:${n}`),this.add(r)}toHTML(){return new Do(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function Mn(e){return e?typeof e=="string"?e:e.source:null}function ka(e){return vt("(?=",e,")")}function Fl(e){return vt("(?:",e,")*")}function jl(e){return vt("(?:",e,")?")}function vt(...e){return e.map(n=>Mn(n)).join("")}function zl(e){let t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function jo(...e){return"("+(zl(e).capture?"":"?:")+e.map(r=>Mn(r)).join("|")+")"}function Na(e){return new RegExp(e.toString()+"|").exec("").length-1}function Bl(e,t){let n=e&&e.exec(t);return n&&n.index===0}var $l=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function zo(e,{joinWith:t}){let n=0;return e.map(r=>{n+=1;let o=n,c=Mn(r),i="";for(;c.length>0;){let a=$l.exec(c);if(!a){i+=c;break}i+=c.substring(0,a.index),c=c.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?i+="\\"+String(Number(a[1])+o):(i+=a[0],a[0]==="("&&n++)}return i}).map(r=>`(${r})`).join(t)}var Hl=/\b\B/,Ta="[a-zA-Z]\\w*",Bo="[a-zA-Z_]\\w*",Ma="\\b\\d+(\\.\\d+)?",Ra="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",_a="\\b(0b[01]+)",Ul="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Vl=(e={})=>{let t=/^#![ ]*\//;return e.binary&&(e.begin=vt(t,/.*\b/,e.binary,/\b.*/)),et({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(n,r)=>{n.index!==0&&r.ignoreMatch()}},e)},Rn={begin:"\\\\[\\s\\S]",relevance:0},Gl={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Rn]},Yl={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Rn]},Wl={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},hr=function(e,t,n={}){let r=et({scope:"comment",begin:e,end:t,contains:[]},n);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let o=jo("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:vt(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},ql=hr("//","$"),Zl=hr("/\\*","\\*/"),Xl=hr("#","$"),Jl={scope:"number",begin:Ma,relevance:0},Ql={scope:"number",begin:Ra,relevance:0},Kl={scope:"number",begin:_a,relevance:0},eu={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Rn,{begin:/\[/,end:/\]/,relevance:0,contains:[Rn]}]},tu={scope:"title",begin:Ta,relevance:0},nu={scope:"title",begin:Bo,relevance:0},ru={begin:"\\.\\s*"+Bo,relevance:0},ou=function(e){return Object.assign(e,{"on:begin":(t,n)=>{n.data._beginMatch=t[1]},"on:end":(t,n)=>{n.data._beginMatch!==t[1]&&n.ignoreMatch()}})},fr=Object.freeze({__proto__:null,APOS_STRING_MODE:Gl,BACKSLASH_ESCAPE:Rn,BINARY_NUMBER_MODE:Kl,BINARY_NUMBER_RE:_a,COMMENT:hr,C_BLOCK_COMMENT_MODE:Zl,C_LINE_COMMENT_MODE:ql,C_NUMBER_MODE:Ql,C_NUMBER_RE:Ra,END_SAME_AS_BEGIN:ou,HASH_COMMENT_MODE:Xl,IDENT_RE:Ta,MATCH_NOTHING_RE:Hl,METHOD_GUARD:ru,NUMBER_MODE:Jl,NUMBER_RE:Ma,PHRASAL_WORDS_MODE:Wl,QUOTE_STRING_MODE:Yl,REGEXP_MODE:eu,RE_STARTERS_RE:Ul,SHEBANG:Vl,TITLE_MODE:tu,UNDERSCORE_IDENT_RE:Bo,UNDERSCORE_TITLE_MODE:nu});function iu(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function au(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function su(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=iu,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function cu(e,t){Array.isArray(e.illegal)&&(e.illegal=jo(...e.illegal))}function lu(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function uu(e,t){e.relevance===void 0&&(e.relevance=1)}var pu=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let n=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=n.keywords,e.begin=vt(n.beforeMatch,ka(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},du=["of","and","for","in","not","or","if","then","parent","list","value"],fu="keyword";function Ia(e,t,n=fu){let r=Object.create(null);return typeof e=="string"?o(n,e.split(" ")):Array.isArray(e)?o(n,e):Object.keys(e).forEach(function(c){Object.assign(r,Ia(e[c],t,c))}),r;function o(c,i){t&&(i=i.map(a=>a.toLowerCase())),i.forEach(function(a){let s=a.split("|");r[s[0]]=[c,mu(s[0],s[1])]})}}function mu(e,t){return t?Number(t):gu(e)?0:1}function gu(e){return du.includes(e.toLowerCase())}var va={},yt=e=>{console.error(e)},wa=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Ut=(e,t)=>{va[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),va[`${e}/${t}`]=!0)},gr=new Error;function Oa(e,t,{key:n}){let r=0,o=e[n],c={},i={};for(let a=1;a<=t.length;a++)i[a+r]=o[a],c[a+r]=!0,r+=Na(t[a-1]);e[n]=i,e[n]._emit=c,e[n]._multi=!0}function hu(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw yt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),gr;if(typeof e.beginScope!="object"||e.beginScope===null)throw yt("beginScope must be object"),gr;Oa(e,e.begin,{key:"beginScope"}),e.begin=zo(e.begin,{joinWith:""})}}function xu(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw yt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),gr;if(typeof e.endScope!="object"||e.endScope===null)throw yt("endScope must be object"),gr;Oa(e,e.end,{key:"endScope"}),e.end=zo(e.end,{joinWith:""})}}function bu(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function yu(e){bu(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),hu(e),xu(e)}function vu(e){function t(i,a){return new RegExp(Mn(i),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,s){s.position=this.position++,this.matchIndexes[this.matchAt]=s,this.regexes.push([s,a]),this.matchAt+=Na(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let a=this.regexes.map(s=>s[1]);this.matcherRe=t(zo(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;let s=this.matcherRe.exec(a);if(!s)return null;let l=s.findIndex((k,_)=>_>0&&k!==void 0),b=this.matchIndexes[l];return s.splice(0,l),Object.assign(s,b)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];let s=new n;return this.rules.slice(a).forEach(([l,b])=>s.addRule(l,b)),s.compile(),this.multiRegexes[a]=s,s}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,s){this.rules.push([a,s]),s.type==="begin"&&this.count++}exec(a){let s=this.getMatcher(this.regexIndex);s.lastIndex=this.lastIndex;let l=s.exec(a);if(this.resumingScanAtSamePosition()&&!(l&&l.index===this.lastIndex)){let b=this.getMatcher(0);b.lastIndex=this.lastIndex+1,l=b.exec(a)}return l&&(this.regexIndex+=l.position+1,this.regexIndex===this.count&&this.considerAll()),l}}function o(i){let a=new r;return i.contains.forEach(s=>a.addRule(s.begin,{rule:s,type:"begin"})),i.terminatorEnd&&a.addRule(i.terminatorEnd,{type:"end"}),i.illegal&&a.addRule(i.illegal,{type:"illegal"}),a}function c(i,a){let s=i;if(i.isCompiled)return s;[au,lu,yu,pu].forEach(b=>b(i,a)),e.compilerExtensions.forEach(b=>b(i,a)),i.__beforeBegin=null,[su,cu,uu].forEach(b=>b(i,a)),i.isCompiled=!0;let l=null;return typeof i.keywords=="object"&&i.keywords.$pattern&&(i.keywords=Object.assign({},i.keywords),l=i.keywords.$pattern,delete i.keywords.$pattern),l=l||/\w+/,i.keywords&&(i.keywords=Ia(i.keywords,e.case_insensitive)),s.keywordPatternRe=t(l,!0),a&&(i.begin||(i.begin=/\B|\b/),s.beginRe=t(s.begin),!i.end&&!i.endsWithParent&&(i.end=/\B|\b/),i.end&&(s.endRe=t(s.end)),s.terminatorEnd=Mn(s.end)||"",i.endsWithParent&&a.terminatorEnd&&(s.terminatorEnd+=(i.end?"|":"")+a.terminatorEnd)),i.illegal&&(s.illegalRe=t(i.illegal)),i.contains||(i.contains=[]),i.contains=[].concat(...i.contains.map(function(b){return wu(b==="self"?i:b)})),i.contains.forEach(function(b){c(b,s)}),i.starts&&c(i.starts,a),s.matcher=o(s),s}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=et(e.classNameAliases||{}),c(e)}function Da(e){return e?e.endsWithParent||Da(e.starts):!1}function wu(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return et(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Da(e)?et(e,{starts:e.starts?et(e.starts):null}):Object.isFrozen(e)?et(e):e}var Eu="11.11.1",Fo=class extends Error{constructor(t,n){super(t),this.name="HTMLInjectionError",this.html=n}},Oo=Aa,Ea=et,Sa=Symbol("nomatch"),Su=7,La=function(e){let t=Object.create(null),n=Object.create(null),r=[],o=!0,c="Could not find the language '{}', did you forget to load/include a language module?",i={disableAutodetect:!0,name:"Plain text",contains:[]},a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Po};function s(p){return a.noHighlightRe.test(p)}function l(p){let y=p.className+" ";y+=p.parentNode?p.parentNode.className:"";let v=a.languageDetectRe.exec(y);if(v){let I=me(v[1]);return I||(wa(c.replace("{}",v[1])),wa("Falling back to no-highlight mode for this block.",p)),I?v[1]:"no-highlight"}return y.split(/\s+/).find(I=>s(I)||me(I))}function b(p,y,v){let I="",H="";typeof y=="object"?(I=p,v=y.ignoreIllegals,H=y.language):(Ut("10.7.0","highlight(lang, code, ...args) has been deprecated."),Ut("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),H=p,I=y),v===void 0&&(v=!0);let oe={code:I,language:H};E("before:highlight",oe);let ye=oe.result?oe.result:k(oe.language,oe.code,v);return ye.code=oe.code,E("after:highlight",ye),ye}function k(p,y,v,I){let H=Object.create(null);function oe(S,T){return S.keywords[T]}function ye(){if(!D.keywords){ne.addText(Y);return}let S=0;D.keywordPatternRe.lastIndex=0;let T=D.keywordPatternRe.exec(Y),P="";for(;T;){P+=Y.substring(S,T.index);let U=Ae.case_insensitive?T[0].toLowerCase():T[0],ie=oe(D,U);if(ie){let[Le,Ka]=ie;if(ne.addText(P),P="",H[U]=(H[U]||0)+1,H[U]<=Su&&(In+=Ka),Le.startsWith("_"))P+=T[0];else{let es=Ae.classNameAliases[Le]||Le;Ce(T[0],es)}}else P+=T[0];S=D.keywordPatternRe.lastIndex,T=D.keywordPatternRe.exec(Y)}P+=Y.substring(S),ne.addText(P)}function nt(){if(Y==="")return;let S=null;if(typeof D.subLanguage=="string"){if(!t[D.subLanguage]){ne.addText(Y);return}S=k(D.subLanguage,Y,!0,Go[D.subLanguage]),Go[D.subLanguage]=S._top}else S=R(Y,D.subLanguage.length?D.subLanguage:null);D.relevance>0&&(In+=S.relevance),ne.__addSublanguage(S._emitter,S.language)}function ge(){D.subLanguage!=null?nt():ye(),Y=""}function Ce(S,T){S!==""&&(ne.startScope(T),ne.addText(S),ne.endScope())}function $o(S,T){let P=1,U=T.length-1;for(;P<=U;){if(!S._emit[P]){P++;continue}let ie=Ae.classNameAliases[S[P]]||S[P],Le=T[P];ie?Ce(Le,ie):(Y=Le,ye(),Y=""),P++}}function Ho(S,T){return S.scope&&typeof S.scope=="string"&&ne.openNode(Ae.classNameAliases[S.scope]||S.scope),S.beginScope&&(S.beginScope._wrap?(Ce(Y,Ae.classNameAliases[S.beginScope._wrap]||S.beginScope._wrap),Y=""):S.beginScope._multi&&($o(S.beginScope,T),Y="")),D=Object.create(S,{parent:{value:D}}),D}function Uo(S,T,P){let U=Bl(S.endRe,P);if(U){if(S["on:end"]){let ie=new mr(S);S["on:end"](T,ie),ie.isMatchIgnored&&(U=!1)}if(U){for(;S.endsParent&&S.parent;)S=S.parent;return S}}if(S.endsWithParent)return Uo(S.parent,T,P)}function qa(S){return D.matcher.regexIndex===0?(Y+=S[0],1):(wr=!0,0)}function Za(S){let T=S[0],P=S.rule,U=new mr(P),ie=[P.__beforeBegin,P["on:begin"]];for(let Le of ie)if(Le&&(Le(S,U),U.isMatchIgnored))return qa(T);return P.skip?Y+=T:(P.excludeBegin&&(Y+=T),ge(),!P.returnBegin&&!P.excludeBegin&&(Y=T)),Ho(P,S),P.returnBegin?0:T.length}function Xa(S){let T=S[0],P=y.substring(S.index),U=Uo(D,S,P);if(!U)return Sa;let ie=D;D.endScope&&D.endScope._wrap?(ge(),Ce(T,D.endScope._wrap)):D.endScope&&D.endScope._multi?(ge(),$o(D.endScope,S)):ie.skip?Y+=T:(ie.returnEnd||ie.excludeEnd||(Y+=T),ge(),ie.excludeEnd&&(Y=T));do D.scope&&ne.closeNode(),!D.skip&&!D.subLanguage&&(In+=D.relevance),D=D.parent;while(D!==U.parent);return U.starts&&Ho(U.starts,S),ie.returnEnd?0:T.length}function Ja(){let S=[];for(let T=D;T!==Ae;T=T.parent)T.scope&&S.unshift(T.scope);S.forEach(T=>ne.openNode(T))}let _n={};function Vo(S,T){let P=T&&T[0];if(Y+=S,P==null)return ge(),0;if(_n.type==="begin"&&T.type==="end"&&_n.index===T.index&&P===""){if(Y+=y.slice(T.index,T.index+1),!o){let U=new Error(`0 width match regex (${p})`);throw U.languageName=p,U.badRule=_n.rule,U}return 1}if(_n=T,T.type==="begin")return Za(T);if(T.type==="illegal"&&!v){let U=new Error('Illegal lexeme "'+P+'" for mode "'+(D.scope||"<unnamed>")+'"');throw U.mode=D,U}else if(T.type==="end"){let U=Xa(T);if(U!==Sa)return U}if(T.type==="illegal"&&P==="")return Y+=`
`,1;if(vr>1e5&&vr>T.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Y+=P,P.length}let Ae=me(p);if(!Ae)throw yt(c.replace("{}",p)),new Error('Unknown language: "'+p+'"');let Qa=vu(Ae),yr="",D=I||Qa,Go={},ne=new a.__emitter(a);Ja();let Y="",In=0,rt=0,vr=0,wr=!1;try{if(Ae.__emitTokens)Ae.__emitTokens(y,ne);else{for(D.matcher.considerAll();;){vr++,wr?wr=!1:D.matcher.considerAll(),D.matcher.lastIndex=rt;let S=D.matcher.exec(y);if(!S)break;let T=y.substring(rt,S.index),P=Vo(T,S);rt=S.index+P}Vo(y.substring(rt))}return ne.finalize(),yr=ne.toHTML(),{language:p,value:yr,relevance:In,illegal:!1,_emitter:ne,_top:D}}catch(S){if(S.message&&S.message.includes("Illegal"))return{language:p,value:Oo(y),illegal:!0,relevance:0,_illegalBy:{message:S.message,index:rt,context:y.slice(rt-100,rt+100),mode:S.mode,resultSoFar:yr},_emitter:ne};if(o)return{language:p,value:Oo(y),illegal:!1,relevance:0,errorRaised:S,_emitter:ne,_top:D};throw S}}function _(p){let y={value:Oo(p),illegal:!1,relevance:0,_top:i,_emitter:new a.__emitter(a)};return y._emitter.addText(p),y}function R(p,y){y=y||a.languages||Object.keys(t);let v=_(p),I=y.filter(me).filter(tt).map(ge=>k(ge,p,!1));I.unshift(v);let H=I.sort((ge,Ce)=>{if(ge.relevance!==Ce.relevance)return Ce.relevance-ge.relevance;if(ge.language&&Ce.language){if(me(ge.language).supersetOf===Ce.language)return 1;if(me(Ce.language).supersetOf===ge.language)return-1}return 0}),[oe,ye]=H,nt=oe;return nt.secondBest=ye,nt}function $(p,y,v){let I=y&&n[y]||v;p.classList.add("hljs"),p.classList.add(`language-${I}`)}function B(p){let y=null,v=l(p);if(s(v))return;if(E("before:highlightElement",{el:p,language:v}),p.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",p);return}if(p.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(p)),a.throwUnescapedHTML))throw new Fo("One of your code blocks includes unescaped HTML.",p.innerHTML);y=p;let I=y.textContent,H=v?b(I,{language:v,ignoreIllegals:!0}):R(I);p.innerHTML=H.value,p.dataset.highlighted="yes",$(p,v,H.language),p.result={language:H.language,re:H.relevance,relevance:H.relevance},H.secondBest&&(p.secondBest={language:H.secondBest.language,relevance:H.secondBest.relevance}),E("after:highlightElement",{el:p,result:H,text:I})}function J(p){a=Ea(a,p)}let Q=()=>{Oe(),Ut("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function xe(){Oe(),Ut("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let be=!1;function Oe(){function p(){Oe()}if(document.readyState==="loading"){be||window.addEventListener("DOMContentLoaded",p,!1),be=!0;return}document.querySelectorAll(a.cssSelector).forEach(B)}function He(p,y){let v=null;try{v=y(e)}catch(I){if(yt("Language definition for '{}' could not be registered.".replace("{}",p)),o)yt(I);else throw I;v=i}v.name||(v.name=p),t[p]=v,v.rawDefinition=y.bind(null,e),v.aliases&&wt(v.aliases,{languageName:p})}function De(p){delete t[p];for(let y of Object.keys(n))n[y]===p&&delete n[y]}function Gt(){return Object.keys(t)}function me(p){return p=(p||"").toLowerCase(),t[p]||t[n[p]]}function wt(p,{languageName:y}){typeof p=="string"&&(p=[p]),p.forEach(v=>{n[v.toLowerCase()]=y})}function tt(p){let y=me(p);return y&&!y.disableAutodetect}function Yt(p){p["before:highlightBlock"]&&!p["before:highlightElement"]&&(p["before:highlightElement"]=y=>{p["before:highlightBlock"](Object.assign({block:y.el},y))}),p["after:highlightBlock"]&&!p["after:highlightElement"]&&(p["after:highlightElement"]=y=>{p["after:highlightBlock"](Object.assign({block:y.el},y))})}function Et(p){Yt(p),r.push(p)}function St(p){let y=r.indexOf(p);y!==-1&&r.splice(y,1)}function E(p,y){let v=p;r.forEach(function(I){I[v]&&I[v](y)})}function A(p){return Ut("10.7.0","highlightBlock will be removed entirely in v12.0"),Ut("10.7.0","Please use highlightElement now."),B(p)}Object.assign(e,{highlight:b,highlightAuto:R,highlightAll:Oe,highlightElement:B,highlightBlock:A,configure:J,initHighlighting:Q,initHighlightingOnLoad:xe,registerLanguage:He,unregisterLanguage:De,listLanguages:Gt,getLanguage:me,registerAliases:wt,autoDetection:tt,inherit:Ea,addPlugin:Et,removePlugin:St}),e.debugMode=function(){o=!1},e.safeMode=function(){o=!0},e.versionString=Eu,e.regex={concat:vt,lookahead:ka,either:jo,optional:jl,anyNumberOfTimes:Fl};for(let p in fr)typeof fr[p]=="object"&&Ca(fr[p]);return Object.assign(e,fr),e},Vt=La({});Vt.newInstance=()=>La({});Pa.exports=Vt;Vt.HighlightJS=Vt;Vt.default=Vt});var Ue={},ku=Symbol("terminator");function ps(e,t){let n=!1,r={error:o,unsubscribe:c,get closed(){return n},signal:new Ne,next(i){if(!n)try{e.next?.(i)}catch(a){o(a)}},complete(){if(!n)try{e.complete?.()}finally{c()}}};e.signal?.subscribe(c);function o(i){if(n)throw i;if(!e.error)throw c(),i;try{e.error(i)}finally{c()}}function c(){n||(n=!0,r.signal.next())}try{t?.(r)}catch(i){o(i)}return r}var L=class{__subscribe;constructor(t){this.__subscribe=t}then(t,n){return fs(this).then(t,n)}pipe(...t){return t.reduce((n,r)=>r(n),this)}subscribe(t){return ps(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},ke=class extends L{closed=!1;signal=new Ne;observers=new Set;constructor(){super(t=>this.onSubscribe(t))}next(t){if(!this.closed)for(let n of Array.from(this.observers))n.closed||n.next(t)}error(t){if(!this.closed){this.closed=!0;let n=!1,r;for(let o of Array.from(this.observers))try{o.error(t)}catch(c){n=!0,r=c}if(n)throw r}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Ne=class extends L{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},On=class extends ke{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)super.next(this.queue.shift());this.emitting=!1}}},Wt=class extends ke{currentValue;constructor(t){super(),this.currentValue=t}get value(){return this.currentValue}next(t){this.currentValue=t,super.next(t)}onSubscribe(t){let n=super.onSubscribe(t);return this.closed||t.next(this.currentValue),n}},Sr=class extends ke{bufferSize;buffer=[];hasError=!1;lastError;constructor(t=1/0){super(),this.bufferSize=t}error(t){this.hasError=!0,this.lastError=t,super.error(t)}next(t){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(t),super.next(t)}onSubscribe(t){this.observers.add(t),this.buffer.forEach(n=>t.next(n)),this.hasError?t.error(this.lastError):this.closed&&t.complete(),t.signal.subscribe(()=>this.observers.delete(t))}},Ct=class extends ke{$value=Ue;get hasValue(){return this.$value!==Ue}get value(){if(this.$value===Ue)throw new Error("Reference not initialized");return this.$value}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==Ue&&t.next(this.$value),super.onSubscribe(t)}},Cr=class extends Error{message="No elements in sequence"};function Pe(...e){return new L(t=>{let n=0,r;function o(){let c=e[n++];c&&!t.closed?(r?.next(),c.subscribe({next:t.next,error:t.error,complete:o,signal:r=new Ne})):t.complete()}t.signal.subscribe(()=>r?.next()),o()})}function te(e){return new L(t=>{e().subscribe(t)})}function Wo(e){return new L(t=>{e.then(n=>{t.closed||t.next(n),t.complete()}).catch(n=>t.error(n))})}function qt(e){return te(()=>Wo(e()))}function qo(e){return new L(t=>{for(let n of e)t.closed||t.next(n);t.complete()})}function Ve(e){return e instanceof L?e:e instanceof Promise?Wo(e):qo(e)}function z(...e){return qo(e)}function ds(e){return new Promise((t,n)=>{let r=Ue;e.subscribe({next:o=>r=o,error:o=>n(o),complete:()=>t(r)})})}function fs(e){return ds(e).then(t=>t===Ue?void 0:t)}function ot(e,t){return Te(n=>({next:e(n),unsubscribe:t}))}function Te(e){return t=>new L(n=>{let r=e(n,t);r.unsubscribe&&n.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=n.error),r.complete||(r.complete=n.complete),r.signal=n.signal,t.subscribe(r)})}function Ar(e){return ot(t=>n=>t.next(e(n)))}function ms(e){let t=Ue;return ot(n=>r=>{let o=e(r);o!==t&&(t=o,n.next(o))})}function gs(e,t){return Te(n=>{let r=t,o=0;return{next(c){r=e(r,c,o++)},complete(){n.next(r),n.complete()}}})}function hs(e){return Te(t=>{let n=!0,r;return{next(o){n&&(n=!1,t.next(o),r=setTimeout(()=>n=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function it(e){return new L(t=>{let n=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(n))})}function xs(e,t=it){return Zo(n=>t(e).map(()=>n))}function Zo(e){return t=>re(n=>{let r=!1,o=!1,c,i=()=>{c?.next(),r=!1,o&&n.complete()},a=new Ne;n.signal.subscribe(()=>{i(),a.next()}),t.subscribe({next(s){i(),c=new Ne,r=!0,Ve(e(s)).subscribe({next:n.next,error:n.error,complete:i,signal:c})},error:n.error,complete(){o=!0,r||n.complete()},signal:a})})}function bs(e){return t=>re(n=>{let r=n.signal,o=0,c=0,i=!1;t.subscribe({next:a=>{o++,Ve(e(a)).subscribe({next:n.next,error:n.error,complete:()=>{c++,i&&c===o&&n.complete()},signal:r})},error:n.error,complete(){i=!0,c===o&&n.complete()},signal:r})})}function ys(e){return Te(t=>{let n=new Ne,r,o,c=[],i=!1,a=!1,s=()=>{r?.next(),r=void 0,o=void 0,a=!1,c.length&&!t.closed?l(c.shift()):i&&t.complete()},l=b=>{a=!0,r=new Ne,o=Ve(e(b)).subscribe({next:t.next,error:t.error,complete:s,signal:r})};return t.signal.subscribe(()=>{r?.next(),n.next()}),{next(b){a?c.push(b):l(b)},error:t.error,complete(){i=!0,!a&&c.length===0&&t.complete()},signal:n,unsubscribe:()=>o?.unsubscribe()}})}function vs(e){return Te(t=>{let n=!0;return{next(r){n&&(n=!1,Ve(e(r)).subscribe({next:t.next,error:t.error,complete:()=>n=!0,signal:t.signal}))}}})}function Dn(e){return ot(t=>n=>{e(n)&&t.next(n)})}function ws(e){return ot(t=>n=>{e-- >0&&!t.closed&&t.next(n),(e<=0||t.closed)&&t.complete()})}function Es(e){return ot(t=>n=>{!t.closed&&e(n)?t.next(n):t.complete()})}function Ss(){let e=!1;return Te(t=>({next(n){e||(e=!0,t.next(n),t.complete())},complete(){t.closed||t.error(new Cr)}}))}function Zt(e){return ot(t=>n=>{e(n),t.next(n)})}function Cs(e){return Te((t,n)=>{let r,o={next:t.next,error(c){try{if(t.closed)return;let i=e(c,n);r?.next(),r=new Ne,i.subscribe({...o,signal:r})}catch(i){t.error(i)}},unsubscribe:()=>r?.next()};return o})}function As(){return ot(e=>{let t=Ue;return n=>{n!==t&&(t=n,e.next(n))}})}function ks(){return e=>{let t=new Sr(1),n=!1;return re(r=>{t.subscribe(r),n||(n=!0,e.subscribe(t))})}}function Ns(){return e=>{let t,n=0;function r(){--n===0&&t.signal.next()}return re(o=>{o.signal.subscribe(r),n++===0?(t=at(),t.subscribe(o),e.subscribe(t)):t.subscribe(o)})}}function Ts(){return e=>{let t=new ke,n,r,o=!1,c=!1;return re(i=>{c?(i.next(r),i.complete()):t.subscribe(i),n??=e.subscribe({next:a=>{o=!0,r=a},error:i.error,complete(){c=!0,o&&t.next(r),t.complete()},signal:i.signal})})}}function h(...e){return e.length===1?e[0]:new L(t=>{let n=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){n--===1&&t.complete()},signal:t.signal})})}function ce(...e){return e.length===0?M:new L(t=>{let n=e.length,r=n,o=0,c=!1,i=new Array(n),a=new Array(n);e.forEach((s,l)=>s.subscribe({next(b){a[l]=b,i[l]||(i[l]=!0,++o>=r&&(c=!0)),c&&t.next(a.slice(0))},error:t.error,complete(){--n<=0&&t.complete()},signal:t.signal}))})}function Ms(e){return Te(t=>({next:t.next,unsubscribe:e}))}function Rs(){return Dn(()=>!1)}var M=new L(e=>e.complete());function le(e){return new Wt(e)}function re(e){return new L(e)}function Xo(){return new ke}function at(){return new Ct}var Yo={catchError:Cs,concatMap:ys,debounceTime:xs,distinctUntilChanged:As,exhaustMap:vs,filter:Dn,finalize:Ms,first:Ss,ignoreElements:Rs,map:Ar,mergeMap:bs,publishLast:Ts,reduce:gs,select:ms,share:Ns,shareLatest:ks,switchMap:Zo,take:ws,takeWhile:Es,tap:Zt,throttleTime:hs};for(let e in Yo)L.prototype[e]=function(...t){return this.pipe(Yo[e](...t))};function C(e,t,n){return new L(r=>{let o=r.next.bind(r);e.addEventListener(t,o,n),r.signal.subscribe(()=>e.removeEventListener(t,o,n))})}function Ln(e){return kr(e,{childList:!0})}function Pn(e,t){return kr(e,{attributes:!0,attributeFilter:t})}function kr(e,t={attributes:!0,childList:!0}){return new L(n=>{let r=new MutationObserver(o=>o.forEach(c=>{for(let i of c.addedNodes)n.next({type:"added",target:e,value:i});for(let i of c.removedNodes)n.next({type:"removed",target:e,value:i});c.type==="characterData"?n.next({type:"characterData",target:e}):c.attributeName&&n.next({type:"attribute",target:e,value:c.attributeName})}));r.observe(e,t),n.signal.subscribe(()=>r.disconnect())})}function Fn(e){return C(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function K(e){return C(e,"click")}function jn(e,t){return new L(n=>{let r=new IntersectionObserver(o=>{for(let c of o)n.next(c)},t);r.observe(e),n.signal.subscribe(()=>r.disconnect())})}function Jo(e){return jn(e).map(t=>t.isIntersecting)}function Ee(e){return jn(e).filter(t=>t.isIntersecting).first()}function _s(e){let t;return function(...n){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,n),t=0})}}function Qo(e){return Te(t=>{let n=_s(o=>{t.closed||(e&&e(o),t.next(o),r&&t.complete())}),r=!1;return{next:n,complete:()=>r=!0}})}function Ko(){return te(()=>document.readyState!=="loading"?z(!0):C(window,"DOMContentLoaded").first().map(()=>!0))}function At(e,t,n){let r=new CustomEvent(t,n);e.dispatchEvent(r)}function zn(e,t){let n;return h(te(()=>(n=e.childNodes,n?z(void 0):M)),st().switchMap(()=>e.childNodes!==n?z(void 0):M),kr(e,{childList:!0,...t}).map(()=>{}))}function st(){return te(()=>document.readyState==="complete"?z(!0):C(window,"load").first().map(()=>!0))}function Bn(...e){return new L(t=>{let n=new ResizeObserver(r=>r.forEach(o=>t.next(o)));for(let r of e)n.observe(r);t.signal.subscribe(()=>n.disconnect())})}function Nr(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function Tr(e,t,n){return r=>Pe(z(e?r.matches(e):!1),C(r,t).switchMap(()=>h(z(!0),C(r,n).map(()=>e?r.matches(e):!1))))}var Mu=Tr("","animationstart","animationend"),Mr=Tr("","mouseenter","mouseleave"),Is=Tr(":focus,:focus-within","focusin","focusout"),Rr=e=>ce(Mr(e),Is(e)).map(([t,n])=>t||n);function ei(e,t,n){return t=t?.toLowerCase(),C(e,"keydown",n).filter(r=>!t||r.key?.toLowerCase()===t)}function Xt(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function _r(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}var Os=Zt(e=>console.trace(e));L.prototype.log=function(){return this.pipe(Os)};L.prototype.raf=function(e){return this.pipe(Qo(e))};var ae=Symbol("bindings"),Ds={},kt=Symbol("augments"),ct=Symbol("parser"),Or=class{bindings;messageHandlers;internals;attributes$=new On;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,n){let r=!1;if(this.messageHandlers)for(let o of this.messageHandlers)o.type===t&&(o.next(n),r||=o.stopPropagation);return r}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let n of this.bindings)t.push(n.subscribe());if(this.prebind)for(let n of this.prebind)t.push(n.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},Hn=Symbol("css"),x=class extends HTMLElement{static observedAttributes;static[kt];static[ct];[ae]=new Or;[Hn];connectedCallback(){this[ae].wasInitialized=!0,this[ae].wasConnected||this.constructor[kt]?.forEach(t=>t(this)),this[ae].connect()}disconnectedCallback(){this[ae].disconnect()}attributeChangedCallback(t,n,r){let o=this.constructor[ct]?.[t]??Ls;n!==r&&(this[t]=o(r,this[t]))}};function Ls(e,t){let n=t===!1||t===!0;return e===""?n?!0:"":e===null?n?!1:void 0:e}function ti(e,t){e.hasOwnProperty(kt)||(e[kt]=e[kt]?.slice(0)??[]),e[kt]?.push(t)}var Ps={mode:"open"};function j(e){return e.shadowRoot??e.attachShadow(Ps)}function ni(e,t){t instanceof Node?j(e).appendChild(t):e[ae].add(t)}function Fs(e,t){t.length&&ti(e,n=>{for(let r of t){let o=r.call(e,n);o&&o!==n&&ni(n,o)}})}function js(e,t){Ds[e]=t,customElements.define(e,t)}function Me(e){return e[ae].internals??=e.attachInternals()}function u(e,{init:t,augment:n,tagName:r}){if(t)for(let o of t)o(e);n&&Fs(e,n),r&&js(r,e)}function Ge(e){return Pe(z(e),e[ae].attributes$.map(()=>e))}function G(e,t){return e[ae].attributes$.pipe(Dn(n=>n.attribute===t),Ar(()=>e[t]))}function m(e,t){return h(G(e,t),te(()=>z(e[t])))}function zs(e){let t=e.observedAttributes;return t&&!e.hasOwnProperty("observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function Jt(e,t,n){return n===!1||n===null||n===void 0?n=null:n===!0&&(n=""),n===null?e.removeAttribute(t):e.setAttribute(t,String(n)),n}function Bs(e,t,n){e.hasOwnProperty(ct)||(e[ct]={...e[ct]}),e[ct]&&(e[ct][t]=n)}function g(e,t){return n=>{t?.observe!==!1&&zs(n).push(e),t?.parse&&Bs(n,e,t.parse);let r=`$$${e}`,o=n.prototype,c=Object.getOwnPropertyDescriptor(o,e);c&&Object.defineProperty(o,r,c);let i=t?.persist,a={enumerable:!0,configurable:!1,get(){return this[r]},set(s){this[r]!==s?(this[r]=s,i?.(this,e,s),this[ae].attributes$.next({target:this,attribute:e,value:s})):c?.set&&(i?.(this,e,s),this[r]=s)}};ti(n,s=>{if(c||(s[r]=s[e]),Object.defineProperty(s,e,a),i?.(s,e,s[e]),t?.render){let l=t.render(s);l&&ni(s,l)}})}}function w(e){return g(e,{persist:Jt,observe:!0})}function Un(e){let t=`on${e}`;return g(t,{render(n){return m(n,t).switchMap(r=>r?new L(o=>{let c=i=>{i.target===n&&n[t]?.call(n,i)};n.addEventListener(e,c),o.signal.subscribe(()=>n.removeEventListener(e,c))}):M)},parse(n){return n?new Function("event",n):void 0}})}function q(e){return g(e,{observe:!1})}function O(){return document.createElement("slot")}function ri(e){return t=>{let[n,r]=e();return t[ae].add(n),r}}function $s(e,t){let n=document.createTextNode("");return e[ae].add(t.tap(r=>n.textContent=r)),n}var Ir=document.createDocumentFragment();function $n(e,t,n=e){if(t!=null)if(Array.isArray(t)){for(let r of t)$n(e,r,Ir);n!==Ir&&n.appendChild(Ir)}else e instanceof x&&t instanceof L?n.appendChild($s(e,t)):t instanceof Node?n.appendChild(t):e instanceof x&&typeof t=="function"?$n(e,t(e),n):n.appendChild(document.createTextNode(t))}function oi(e,t){for(let n in t){let r=t[n];e instanceof x?r instanceof L?e[ae].add(n==="$"?r:r.tap(o=>e[n]=o)):n==="$"&&typeof r=="function"?e[ae].add(r(e)):e[n]=r:e[n]=r}}function Hs(e,t){return e.constructor.observedAttributes?.includes(t)}function ii(e,t){let n=e instanceof x&&Hs(e,t)?G(e,t):Pn(e,[t]).map(()=>e[t]);return h(n,te(()=>z(e[t])))}function Vn(e,t,n){return g(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let o=r===null?void 0:Number(r);return t!==void 0&&(o===void 0||o<t||isNaN(o))&&(o=t),n!==void 0&&o!==void 0&&o>n&&(o=n),o}})}function ue(e,t,n){for(let r=e.parentElement;r;r=r.parentElement)if(r[ae]?.message(t,n))return}function pe(e,t,n=!0){let r,o=0,c=new ke,i={type:t,next(a){o?c.next(a):(r??=[]).push(a)},stopPropagation:n};return e[ae].addMessageHandler(i),new L(a=>{o===0&&r?.length&&(r.forEach(l=>a.next(l)),r.length=0),o++;let s=c.subscribe(a);a.signal.subscribe(()=>{o--,s.unsubscribe()})})}function N(e,t,...n){let r=typeof e=="string"?document.createElement(e):new e;return t&&oi(r,t),n.length&&$n(r,n),r}function f(e,t,...n){if(e!==f&&typeof e=="function"&&!(e.prototype instanceof x))return n.length&&((t??={}).children=n),e(t);let r=e===f?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&oi(r,t),n.length&&$n(r,n),r}function Us(e,t){return n=>new L(()=>{n.hasAttribute(e)||n.setAttribute(e,t)})}function ai(e,t){return Zt(n=>e.setAttribute("aria-"+t,n===!0?"true":n===!1?"false":n.toString()))}function V(e){return Us("role",e)}var si=0;function Fe(e){return e.id||=`cxl__${si++}`}function ci(e){return ii(e,"id").map(t=>(t||(e.id=`cxl__${si++}`),e.id))}var Re=d(":host{display:contents}"),Ys=[-2,-1,0,1,2,3,4,5],hi=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],Nt=at(),Gn=le(""),ve=d(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),xi=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${F("body-medium")}
`,Ws=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),bi={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function yi(e=""){return`
:host ${e} {
	${X("surface-container")}
	overflow-y: auto;
	padding: 8px 0;
	min-width: 112px;
	max-width: 280px;
	width: max-content;
	border-radius: var(--cxl-shape-corner-xsmall);
	cursor: default;
	z-index: 2;
}
:host([static]) ${e} { max-width: none; }
		`}function vi(e=bi){return Object.entries(e).map(([t,n])=>`--cxl-color--${t}:${n};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var W={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:bi,imports:Ws?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
--cxl-font-family: Roboto;
--cxl-font-monospace:"Roboto Mono", monospace;

--cxl-font-display-large: 400 57px/64px var(--cxl-font-family);
--cxl-letter-spacing-display-large: -0.25px;
--cxl-font-display-medium: 400 45px/52px var(--cxl-font-family);
--cxl-letter-spacing-display-medium: 0;
--cxl-font-display-small: 400 36px/44px var(--cxl-font-family);
--cxl-letter-spacing-display-small: 0;
--cxl-font-headline-large: 400 32px/40px var(--cxl-font-family);
--cxl-letter-spacing-headline-large: -0.25px;
--cxl-font-headline-medium: 400 28px/36px var(--cxl-font-family);
--cxl-letter-spacing-headline-medium: 0;
--cxl-font-headline-small: 400 24px/32px var(--cxl-font-family);
--cxl-letter-spacing-headline-small: 0;
--cxl-font-title-large: 400 22px/28px var(--cxl-font-family);
--cxl-letter-spacing-title-large: 0;
--cxl-font-title-medium: 500 16px/24px var(--cxl-font-family);
--cxl-letter-spacing-title-medium: 0.15px;
--cxl-font-title-small: 500 14px/20px var(--cxl-font-family);
--cxl-letter-spacing-title-small: 0.1px;
--cxl-font-body-large: 400 16px/24px var(--cxl-font-family);
--cxl-letter-spacing-body-large: normal;
--cxl-font-body-medium: 400 14px/20px var(--cxl-font-family);
--cxl-letter-spacing-body-medium: 0.25px;
--cxl-font-body-small: 400 12px/16px var(--cxl-font-family);
--cxl-letter-spacing-body-small: 0.4px;
--cxl-font-label-large: 500 14px/18px var(--cxl-font-family);
--cxl-letter-spacing-label-large: 0.1px;
--cxl-font-label-medium: 500 12px/16px var(--cxl-font-family);
--cxl-letter-spacing-label-medium: 0.5px;
--cxl-font-label-small: 500 11px/16px var(--cxl-font-family);
--cxl-letter-spacing-label-small: 0.5px;
--cxl-font-code:400 14px var(--cxl-font-monospace);
--cxl-letter-spacing-code: 0.2px;

--cxl-font-weight-bold: 700;
--cxl-font-weight-label-large-prominent: var(--cxl-font-weight-bold);

--cxl-speed:200ms;

--cxl-elevation-1: rgb(0 0 0 / .2) 0 2px 1px -1px, rgb(0 0 0 / .14) 0 1px 1px 0, rgb(0 0 0 / .12) 0px 1px 3px 0;
--cxl-elevation-2: rgb(0 0 0 / .2) 0 3px 3px -2px, rgb(0 0 0 / .14) 0 3px 4px 0, rgb(0 0 0 / .12) 0px 1px 8px 0;
--cxl-elevation-3: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;;
--cxl-elevation-4: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
--cxl-elevation-5: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;

--cxl-shape-corner-xlarge: 28px;
--cxl-shape-corner-large: 16px;
--cxl-shape-corner-medium: 12px;
--cxl-shape-corner-small: 8px;
--cxl-shape-corner-xsmall: 4px;
--cxl-shape-corner-full: 50vh;
}
	`,css:""};function Qt(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}var Tt=d(Qt()),wi={"./theme-dark.js":()=>Promise.resolve().then(()=>(pi(),ui))},lt=[0,4,8,"12",16,24,32,48,64],Ye,di,qs;function ee(e,t){return e==="xsmall"?`@media(max-width:${W.breakpoints.small}px){${t}}`:`@media(min-width:${W.breakpoints[e]}px){${t}}`}function Mt(e){return h(qt(async()=>e.getBoundingClientRect().width),Bn(e).map(t=>t.contentRect.width)).map(t=>{let n=W.breakpoints,r="xsmall";for(let o in n){if(n[o]>t)return r;r=o}return r}).distinctUntilChanged()}function Zs(e=""){return Object.entries(Ni).map(([t,n])=>`:host([color=${t}]) ${e}{ ${n} }`).join("")}function Rt(e,t,n=""){return Ei(e,`
		${t?`:host ${n} { ${Ni[t]} }`:""}
		:host${t?"":"([color])"} ${n} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${n}{
			color: inherit;
			background-color: transparent;
		}
		${Zs(n)}
	`)}function Ei(e,t){let n=d(t);return g(e,{persist:Jt,render:r=>n(r)})}function de(e,t){return Ei(e,Ys.map(n=>{let r=t(n);return n===0?`:host{--cxl-size:${n}}:host ${r}`:`:host([size="${n}"]){--cxl-size:${n}}:host([size="${n}"]) ${r}`}).join(""))}function Si(){let e=Ye?document.adoptedStyleSheets.indexOf(Ye):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Xs(e){Ye&&Si();let t=e.globalCss??"";e.colors&&(t+=`:root{${vi(e.colors)}}`),t?(Ye=We(t),document.adoptedStyleSheets.push(Ye)):Ye=void 0,Nt.next({theme:e,stylesheet:Ye,css:t}),Gn.next(e.name)}var fi="";function Ci(e){e?e!==fi&&(typeof e=="string"?import(e):e()).then(t=>Xs(t.default),t=>console.error(t)):Ye&&(Si(),Nt.next(void 0),Gn.next("")),fi=e}function Js(e){let t;return Nt.tap(n=>{let r=n?.theme.override?.[e.tagName];r?t?t.replace(r).catch(o=>console.error(o)):e.shadowRoot?.adoptedStyleSheets.push(t??=We(r)):t&&t.replaceSync("")})}function We(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function Ai(e,t=""){let n=We(t);return j(e).adoptedStyleSheets.push(n),n}function d(e){let t;return n=>{let r=j(n);if(r.adoptedStyleSheets.push(t??=We(e)),!n[Hn])return W.css&&r.adoptedStyleSheets.unshift(qs??=We(W.css)),n[Hn]=!0,Js(n)}}var ki=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Bu=[...ki,"inherit"];function Dr(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function X(e){return`${Dr(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}var Ni=ki.reduce((e,t)=>(e[t]=`
${Dr(t)}
${t==="inverse-surface"?Dr("inverse-primary","primary"):""}
`,e),{inherit:"color:inherit;background-color:inherit;"});function _t(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function F(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}var Qs=requestAnimationFrame(()=>oc()),Ks={},mi=document.createElement("template"),gi={};function ec(e){return function(t){let n=e(t),r=gi[n];if(r)return r.cloneNode(!0);let o=document.createElementNS("http://www.w3.org/2000/svg","svg"),c=()=>(o.dispatchEvent(new ErrorEvent("error")),"");return fetch(n).then(i=>i.ok?i.text():c(),c).then(i=>{if(!i)return;mi.innerHTML=i;let a=mi.content.children[0];if(!a)return;let s=a.getAttribute("viewBox");s?o.setAttribute("viewBox",s):a.hasAttribute("width")&&a.hasAttribute("height")&&o.setAttribute("viewBox",`0 0 ${a.getAttribute("width")} ${a.getAttribute("height")}`);for(let l of a.childNodes)o.append(l);gi[t.name]=o}).catch(i=>console.error(i)),o.setAttribute("fill","currentColor"),o}}var tc=ec(({name:e,width:t,fill:n})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${n?"fill1_":""}${t}px.svg`)),nc=tc;function Ti(e,t={}){let{width:n,height:r}=t;n===void 0&&r===void 0&&(n=r=24);let o=Ks[e]?.icon()??nc({name:e,width:n,fill:t.fill});return t.className&&o.setAttribute("class",t.className),n&&(o.setAttribute("width",`${n}`),r===void 0&&o.setAttribute("height",`${n}`)),r&&(o.setAttribute("height",`${r}`),n===void 0&&o.setAttribute("width",`${r}`)),t.alt&&o.setAttribute("alt",t.alt),o}var Lr,rc=new Promise(e=>{Lr=()=>{Nt.next(void 0),e()}});function oc(e){cancelAnimationFrame(Qs),di||(e&&(e.colors&&(W.colors=e.colors),e.globalCss&&(W.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(di=We(`html{${vi(W.colors)}}${W.globalCss}`)),W.imports?Promise.allSettled(W.imports.map(t=>{let n=document.createElement("link");return n.rel="stylesheet",n.href=t,document.head.append(n),new Promise((r,o)=>(n.onload=r,n.onerror=o))})).then(Lr,t=>console.error(t)):Lr())}function Yn(){return qt(async()=>{await rc,await document.fonts.ready})}function qe(e,t,n){return new L(r=>{let o={id:e,controller:n,target:t};ue(t,`registable.${e}`,o),r.signal.subscribe(()=>o.unsubscribe?.())})}function Mi(e,t,n,r){return new L(o=>{function c(a){let s=a.target;a.unsubscribe=()=>{let _=n.indexOf(s);_!==-1&&n.splice(_,1),r?.({type:"disconnect",target:s,elements:n}),o.next()};let l=n.indexOf(s);l!==-1&&n.splice(l,1);let b=0,k=n.length;for(;b<k;){let _=b+k>>1;n[_].compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING?b=_+1:k=_}n.splice(b,0,s),r?.({type:"connect",target:s,elements:n}),o.next()}let i=pe(t,`registable.${e}`).subscribe(c);o.signal.subscribe(i.unsubscribe)})}function Ri(e,t,n=new Set){let r=Xo();return h(pe(t,`registable.${e}`).map(o=>{let c=o.target,i=o.controller||o.target;return o.unsubscribe=()=>{n.delete(i),r.next({type:"disconnect",target:i,element:c,elements:n})},n.add(i),{type:"connect",target:i,element:c,elements:n}}),r)}var we=class extends x{name="";width;height;alt;fill=!1};u(we,{tagName:"c-icon",init:[g("name"),g("width"),g("height"),g("fill"),g("alt")],augment:[V("none"),d(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,n;return e.shadowRoot?.adoptedStyleSheets.push(t),Ee(e).switchMap(()=>Ge(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,o=e.height??e.width;t.replace(`:host{${r===void 0?"":`width:${r}px;`}${o===void 0?"":`height:${o}px`}}`).catch(c=>{}),n?.remove(),n=e.name?Ti(e.name,{className:"icon",width:r,height:o,fill:e.fill,alt:e.alt}):void 0,n&&(n.onerror=()=>{n&&e.alt&&n.replaceWith(e.alt)},j(e).append(n))})}]});function ic(e){return m(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function ac(e,t=e,n=0){let r=t.hasAttribute("tabindex")?t.tabIndex:n;return ic(e).tap(o=>{o?t.removeAttribute("tabindex"):t.tabIndex=r})}function sc(e,t=e){return h(C(t,"focusout").tap(()=>e.touched=!0),h(G(e,"disabled"),G(e,"touched")).tap(()=>ue(e,"focusable.change")))}function _e(e,t=e,n=0){return h(ac(e,t,n),sc(e,t))}function _i(e){return e in W.animation}function je({target:e,animation:t,options:n}){if(W.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in W.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?W.animation[t]:t,o=typeof r.kf=="function"?r.kf(e):r.kf,c={duration:250,easing:W.easing.emphasized,...r.options,...n,...W.prefersReducedMotion?{duration:0}:void 0};return e.animate(o,c)}function Ii(e){let{trigger:t,stagger:n,commit:r,keep:o}=e;function c(a){return new L(s=>{let l=je(a);l.ready.then(()=>s.next({type:"start",animation:l}),b=>{console.error(b)}),l.addEventListener("finish",()=>{s.next({type:"end",animation:l}),r&&l.commitStyles(),!(o||o!==!1&&a.options?.fill&&(a.options.fill==="both"||a.options.fill==="forwards"))&&s.complete()}),s.signal.subscribe(()=>{try{l.cancel()}catch{}})})}let i=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return h(...i.map((a,s)=>{let l={...e.options,delay:n!==void 0?(e.options?.delay??0)+s*n:e.options?.delay};return(t==="visible"?Jo(a).filter(k=>k):t==="hover"?Mr(a):z(!0)).switchMap(k=>k?c({...e,options:l,target:a}):M)}))}function Oi(e,t,n=e.getBoundingClientRect()){let r=n.width>n.height?n.width:n.height,o=new Wn,c=e.shadowRoot||e,{x:i,y:a}=t??{x:1/0,y:1/0},s=!t||Xt(t),l=i>n.right||i<n.left||a>n.bottom||a<n.top;return o.x=s||l?n.width/2:i-n.left,o.y=s||l?n.height/2:a-n.top,o.radius=r,t||(o.duration=0),c.prepend(o),o}function Di(e,t=e){let n,r,o,c=()=>{n=Oi(t,r instanceof Event?r:void 0,o),n.duration=600,r=void 0};return h(C(e,"click").tap(i=>{r=i,o=t.getBoundingClientRect()}),m(e,"selected").raf().switchMap(()=>{if(e.selected){if(!n?.parentNode){if(Nr(e))return r=void 0,Ee(e).tap(c);c()}}else n&&Li(n).catch(i=>console.error(i));return M})).ignoreElements()}function Li(e){return new Promise(t=>{je({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function Ze(e,t=e){let n=!1,r=0;return h(C(t,"pointerdown"),C(t,"click")).tap(o=>o.cxlRipple??=e).raf().mergeMap(o=>{if(o.cxlRipple===e&&!n&&!e.disabled&&e.parentNode){r=Date.now(),n=!0,e.style.setProperty("--cxl-mask-hover","none");let c=Oi(e,o),i=c.duration,a=()=>{e.style.removeProperty("--cxl-mask-hover"),Li(c).catch(()=>{}).finally(()=>{n=!1})};return o.type==="click"?it(i).tap(a):h(C(document,"pointerup"),C(document,"pointercancel")).first().map(()=>{let s=Date.now()-r;setTimeout(()=>a(),s>i?32:i-s)})}return M})}var Wn=class extends x{x=0;y=0;radius=0;duration=500};u(Wn,{tagName:"c-ripple",init:[g("x"),g("y"),g("radius")],augment:[d(`
:host {
	display: block;
	position: absolute;
	overflow: hidden;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
	direction: ltr;
}
.ripple {
	position: relative;
	background-image: inherit;
	border-radius: 100%;
	background-color: var(--cxl-color-ripple, color-mix(in srgb, var(--cxl-color-on-surface) 16%, transparent));
}`),e=>{let t=document.createElement("div");return t.className="ripple",re(()=>{let n=t.style;n.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,n.width=n.height=e.radius*2+"px",t.parentNode||j(e).append(t),je({target:t,animation:"expand",options:{duration:e.duration}}),je({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var Pr=[ve,Tt,d(`
:host {
	box-sizing: border-box;
	position: relative;
	transition: box-shadow var(--cxl-speed);
}
:host(:hover) {
	box-shadow: var(--cxl-elevation-1);
}
:host(:active) { box-shadow: var(--cxl-elevation-0); }
:host(:focus-visible) {
	outline: 3px auto var(--cxl-color-secondary);
}
:host([disabled]) {
	background-color: color-mix(in srgb, var(--cxl-color--on-surface) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
}
:host([variant=elevated]) {
	--cxl-color-surface: var(--cxl-color--surface-container-low);
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=elevated]:hover) {
	box-shadow: var(--cxl-elevation-2);
}
:host([variant=elevated]:active) {
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=elevated][disabled]) { box-shadow: none; }
:host([variant=outlined][disabled]) {
	border-color: color-mix(in srgb, var(--cxl-color-outline) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
}	
:host([variant=outlined][disabled]),:host([variant=text][disabled]) {
	background-color: transparent;
	box-shadow: none;
}`)],cc=d(`
:host {
	${F("label-large")}
	user-select: none;
	cursor: pointer;
	overflow: hidden;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	column-gap: 8px;
	line-height: unset;
	white-space: nowrap;
	border-radius: var(--cxl-shape-corner-full);
	align-self: center;
}
:host([variant=outlined]:hover),:host([variant=text]:hover) {
	box-shadow: none;
}
:host([variant=text]) { margin: -10px -12px; }
:host([variant=text]:not([disabled])) {
	background-color: transparent;
	color: var(--cxl-color-surface);
}
:host([variant=text]:not([color])),:host([variant=outlined]:not([color])) {
	--cxl-color-on-surface: var(--cxl-color--on-primary);
	--cxl-color-surface: var(--cxl-color--primary);
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline);
	background-color: transparent;
	color: var(--cxl-color-surface);
}
:host([variant=elevated]) {
	--cxl-color-on-surface: var(--cxl-color-primary);
}
`);function Fr(e){return m(e,"disabled").switchMap(t=>t?M:Fn(e).tap(n=>{n.stopPropagation(),e.click()}))}function jr(e){return h(Fr(e),_e(e))}var qn=class extends x{disabled=!1;touched=!1};u(qn,{init:[w("disabled"),w("touched")],augment:[V("button"),jr]});var Kt=class extends qn{size;color;variant};u(Kt,{tagName:"c-button",init:[de("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),Rt("color","primary"),w("variant")],augment:[...Pr,cc,Ze,O]});var Xe;function Pi(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function lc(e){return e==="infinite"?1/0:+e}function uc(e){if(_i(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let n={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(a,s,l)=>(s&&(r=+s),l&&(n.composite=l),"")),Xe??=document.createElement("style").style,Xe.animation=e,n.fill=Xe.animationFillMode;let o=n.fill==="forwards"||n.fill==="both",c=t?void 0:Pi(Xe.animationDuration);c!==void 0&&(n.duration=c);let i=Pi(Xe.animationDelay);return i!==void 0&&(n.delay=i),Xe.animationIterationCount&&(n.iterations=lc(Xe.animationIterationCount)),{animation:Xe.animationName,keep:o,stagger:r,options:n}}function pc(e){return typeof e=="string"&&(e=e.split(",").map(t=>uc(t.trim()))),e}function zr(e,t,n,r){let o=r?`motion-${r}-on`:"motion-on",c=pc(n);return e.setAttribute(o,""),h(...c.map(i=>Ii({target:t,...i}))).finalize(()=>e.removeAttribute(o))}var Fi=d(":host(:not([open],[motion-out-on])){display:none}");function Br(e,t=()=>e,n=!1){let r=te(()=>z(t("in"))),o=te(()=>z(t("out"))),c=te(()=>e.duration!==void 0&&e.duration!==1/0?it(e.duration).map(()=>e.open=!1):M).log();return h(pe(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),ce(m(e,"motion-in").map(i=>(i?r.mergeMap(a=>zr(e,a,i,"in")):r).mergeMap(()=>c)),m(e,"motion-out").map(i=>(i?o.switchMap(a=>zr(e,a,i,"out")):o).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([i,a])=>G(e,"open").switchMap(s=>{if(e.popover!=="auto"){let l=s?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:s?"closed":"open",newState:l}))}return s?n?Pe(a,i):i:n?Pe(a,i):a})))}var It=class extends x{open=!1;duration;"motion-in";"motion-out"};u(It,{init:[g("motion-in"),g("motion-out"),Vn("duration"),w("open")]});var en=class extends It{};u(en,{tagName:"c-toggle-target",augment:[d(`
:host{display:contents}
`),e=>{let t=N("slot"),n=N("slot",{name:"off"});return(e.open?n:t).style.display="none",j(e).append(t,n),Br(e,r=>{t.style.display=n.style.display="none";let o=e.open?r==="in"?t:n:r==="in"?n:t;return o.style.display="",o.assignedElements()},!0)}]});var $r={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(n){console.error(n)}}};function ji(e){return(t,n)=>t[e]>n[e]?1:t[e]<n[e]?-1:0}function Ot(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let n,r=e.getRootNode();return r instanceof ShadowRoot&&(n=r.getElementById(t),n)?n:e.ownerDocument.getElementById(t)??void 0}var Hr=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},Je=new Hr;var Bi=(e,t,n=e)=>K(e).tap(()=>ue(n,"toggle.close",t));function zi(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(n=>{let r=Ot(e,n);return r?[r]:[]}):Array.isArray(t)?t:[t]}function dc(e,t,n,r,o=C(e,"click").map(()=>!n())){return h(r,o).switchMap(c=>{let i=t();return i?Ve(i.map(a=>({target:a,open:c}))):M})}function nn(e,t=e){function n(c,i){return[m(e,"open").switchMap(a=>(c.parentNode||Je.popupContainer.append(c),c.open=a,a&&c instanceof x?G(c,"open").map(s=>{e.open&&s===!1&&(e.open=!1)}):M)),ci(c).tap(a=>{let s=c.getAttribute("role");(s==="menu"||s==="listbox"||s==="tree"||s==="grid"||s==="dialog")&&(i.ariaHasPopup=s),i.getRootNode()===c.getRootNode()&&i.setAttribute("aria-controls",a)})]}let r=ce(m(e,"trigger"),m(e,"target")).switchMap(([c])=>{let i=zi(e),a=i?h(...i.flatMap(s=>n(s,e))).ignoreElements():M;return h(c==="hover"?ce(Rr(t),i?h(...i.map(s=>Rr(s))):M).map(s=>!!s.find(l=>!!l)).debounceTime(250):c==="checked"?C(t,"change").map(s=>s.target&&"checked"in s.target?!!s.target.checked:!1):C(t,"click").map(()=>!e.open),a)}),o;return Ko().switchMap(()=>dc(t,()=>zi(e),()=>e.open,m(e,"open"),r).filter(c=>{let{open:i,target:a}=c;if(e.open!==i){if(i)o=_r(e)?.activeElement,a.trigger=e;else if(a.trigger&&a.trigger!==e)return c.open=!0,a.trigger=e,!0;return e.open=i,!1}if(!i&&a.trigger===e){let s=document.activeElement;(s===document.body||s===document.documentElement)&&o?.focus()}return!0}))}var Zn=class extends x{open=!1;target;trigger};u(Zn,{init:[g("target"),g("trigger"),w("open")],augment:[e=>nn(e).raf(({target:t,open:n})=>t.open=n)]});var tn=class extends Zn{};u(tn,{tagName:"c-toggle",augment:[Re,O]});var Ur=[d(`
:host {
	box-sizing: border-box;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	flex-shrink: 0;
	display: flex;
	align-items: center;
	column-gap: 24px;
	min-height: 64px;
	padding: 4px 16px;
	${F("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${F("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${F("headline-medium")}
	flex-wrap: wrap;
}`),O,()=>N("slot",{name:"title"})];function fc(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var rn=class extends x{size;sticky=!1;contextual};u(rn,{tagName:"c-appbar",init:[w("size"),w("sticky"),w("contextual")],augment:[d(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...Ur,()=>N("slot",{name:"contextual"}),e=>m(e,"sticky").switchMap(t=>t?jn(e,{threshold:[1]}).tap(n=>e.toggleAttribute("scroll",n.intersectionRatio<1)):M),e=>{let t;return h(Ln(e),m(e,"contextual")).raf().switchMap(()=>{for(let n of e.children)if(fc(n)&&(n.slot="contextual",n.open=n.name===e.contextual,n.open))return t=n,C(n,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,M})}]});var on=class extends Kt{};u(on,{tagName:"c-button-round",augment:[d(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var he=class extends on{icon="";width;height;fill=!1;variant="text";alt};u(he,{tagName:"c-icon-button",init:[g("icon"),g("width"),g("height"),g("alt"),g("fill")],augment:[e=>N(we,{className:"icon",width:m(e,"width"),height:m(e,"height"),name:m(e,"icon"),fill:m(e,"fill"),alt:m(e,"alt")})]});var Xp=1440*60*1e3;function $i(e,t,n){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(n,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(n,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(n,{dateStyle:t,timeStyle:t})}function Hi(e,t,n){return typeof n=="string"?$i(t,n,e):t.toLocaleString(e,n)}var Vr={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function mc(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var an={content:Vr,name:"default",localeName:mc(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>Hi(an.localeName,e,t)},gc={content:Vr,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>Hi("en-US",e,t)};function hc(){let e=le(an),t={default:an,en:gc},n={},r=e.map(i=>i.content);async function o(i){let a=i.split("-")[0];if(!a)return an;if(!(t[i]??t[a])){let l=n[i]??n[a];l&&await l()}return t[a]||an}async function c(i){e.next(await o(i))}return navigator.language&&c(navigator.language).catch(i=>console.error(i)),{content:r,registeredLocales:t,locale:e,setLocale:c,getLocale(i){return i?qt(()=>o(i)):e},get(i,a){return r.map(s=>s[i])},register(i){t[i.name]=i}}}var Dt=hc();function Ui(e){return Object.assign(Vr,e),Dt.get}var Xn=class e extends x{name;size;open=!1;backIcon=N(he,{icon:"arrow_back",className:"icon",ariaLabel:Dt.get("core.close"),$:t=>K(t).tap(()=>this.open=!1)});static{u(e,{tagName:"c-appbar-contextual",init:[g("name"),w("open"),w("size")],augment:[t=>t.backIcon,...Ur,d(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>G(t,"open").tap(n=>{n||t.dispatchEvent(new Event("close"))})]})}};function Vi(e=document){document.documentElement.lang="en";let t=[N("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),N("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),N("meta",{name:"mobile-web-app-capable",content:"yes"}),N("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${F("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function Gi(e=2e3){return h(it(e),Yn()).first()}function Yi(e){return Gi().raf(()=>e.setAttribute("ready",""))}function Jn(e){return h(re(t=>{let n=Vi(e.ownerDocument);t.signal.subscribe(()=>n.forEach(r=>r.remove()))}),st().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),Gi().switchMap(()=>Mt(e).raf(t=>e.setAttribute("breakpoint",t))),Yi(e),Gn.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var Gr=class extends x{connectedCallback(){requestAnimationFrame(()=>Vi(this.ownerDocument)),super.connectedCallback()}};u(Gr,{tagName:"c-meta",augment:[()=>Yi(document.body)]});function Wi(e,t,n){n==="in"&&(e.style.display="");let r=e.offsetWidth,o=je({target:e,animation:{kf:{[t]:n==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});n==="out"&&(o.onfinish=()=>e.style.display="none")}var ut=class extends x{sheetstart=!1;sheetend=!1};u(ut,{tagName:"c-application",init:[w("sheetstart"),w("sheetend")],augment:[d(`
:host {
	display: flex;
	position: absolute;
	inset: 0;
	${X("surface")}
	overflow: hidden;
}
#body {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow: hidden;
	position: relative;
}
slot[name=end],slot[name=start] { display:block; flex-shrink: 0; }
${_t()}
	`),Jn,e=>pe(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>pe(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=N("slot",{name:"start"}),n=N("slot",{id:"body"}),r=N("slot",{name:"end"}),o=We("html { overflow: hidden }");return j(e).append(t,n,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),Je.popupContainer=e,h(re(c=>{let i=e.ownerDocument.adoptedStyleSheets;i.push(o),c.signal.subscribe(()=>{let a=i.indexOf(o);a!==-1&&i.splice(a,1)})}),G(e,"sheetstart").tap(c=>Wi(t,"marginLeft",c?"in":"out")),G(e,"sheetend").tap(c=>Wi(r,"marginRight",c?"in":"out")))}]});var xc=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,bc=/^\d{5}(?:[-\s]\d{4})?$/,yc={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},qi={required:kc,email:Nc,json:Rc,zipcode:Tc,nonZero:Cc,nonEmpty:Sc},vc={pattern:Ac,equalToElement:Yr(Qi),greaterThan:Xi,lessThan:Ji,greaterThanElement:Yr(Xi),lessThanElement:Yr(Ji),min:Ic,max:Oc,equalTo:Qi,maxlength:Dc,minlength:Lc},wc=Ui(yc);function Yr(e){return(t,n)=>{let r=typeof t=="string"?Ot(n,t):t;if(!r)throw"Invalid element";return e(r)}}function Ie(e,t){return{key:e,valid:t,message:wc(`validation.${e}`,"validation.invalid")}}function Ec(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function Sc(e){return Ie("nonEmpty",!Ec(e))}function Cc(e){return Ie("nonZero",e===""||Number(e)!==0)}function Ac(e){let t=typeof e=="string"?e=new RegExp(e):e;return n=>Ie("pattern",typeof n=="string"&&(n===""||t.test(n)))}function Wr(e){return e!=null&&e!==""}function kc(e,t){let n=t&&"checked"in t?!!t.checked:!0;return Ie("required",n&&Wr(e))}function Nc(e){return Ie("email",typeof e=="string"&&(e===""||xc.test(e)))}function Tc(e){return Ie("zipcode",typeof e=="string"&&(e===""||bc.test(e)))}function Mc(e){try{return JSON.parse(e),!0}catch{return!1}}function Rc(e){return Ie("json",Mc(e))}function _c(e){return e instanceof HTMLElement&&"value"in e}function sn(e,t,n){let r=_c(t)?m(t,"value"):t instanceof L?t:z(t);return o=>r.map(c=>Ie(e,!Wr(o)||!Wr(c)||n(o,c)))}function Zi(e,t){let n=/(\w+)(?:\(([^)]+?)\))?/g,r=[],o;for(;o=n.exec(e);)if(o[2]){let c=vc[o[1]];if(!c)throw`Invalid rule "${o[1]}"`;r.push(c(o[2],t))}else if(o[1]&&o[1]in qi)r.push(qi[o[1]]);else throw`Invalid rule "${o[1]}"`;return r}function Ki(e,t){let n=(typeof e=="string"?Zi(e,t):e).flatMap(r=>typeof r=="string"?Zi(r,t):r);return(r,o)=>n.map(c=>{let i=c(r,o);return i instanceof L?i:i instanceof Promise?Ve(i):z(i)})}function Ic(e){return sn("min",e,(t,n)=>Number(t)>=Number(n))}function Xi(e){return sn("greaterThan",e,(t,n)=>Number(t)>Number(n))}function Oc(e){return sn("max",e,(t,n)=>Number(t)<=Number(n))}function Ji(e){return sn("lessThan",e,(t,n)=>Number(t)<Number(n))}function Qi(e){return sn("equalTo",e,(t,n)=>t==n)}function Dc(e){return t=>Ie("maxlength",!t||t.length<=+e)}function Lc(e){return t=>Ie("minlength",!t||t.length>=+e)}function Pc(e){return ta(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function ea(e){return G(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||At(e,"change",{bubbles:!0})})}function ta(e){return h(m(e,"value"),m(e,"checked")).map(()=>{})}var Lt=class e extends x{static formAssociated=!0;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{u(e,{init:[w("autofocus"),w("invalid"),w("disabled"),w("touched"),g("rules"),w("name"),q("validationResult"),Un("update")],augment:[t=>(t.defaultValue=t.value,h(qe("form",t),G(t,"invalid").tap(()=>At(t,"invalid")),m(t,"invalid").switchMap(n=>{if(n){if(t.setAria("invalid","true"),!t.validationMessage)return Dt.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return M}),re(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),m(t,"rules").switchMap(n=>{if(!n)return M;let r=Ki(n,t);return ta(t).switchMap(()=>h(...r(t.value,t)).tap(o=>t.setValidity(o))).finalize(()=>t.resetValidity())}),m(t,"value").tap(n=>t.setFormValue(n)),m(t,"validationResult").switchMap(n=>!n||n.valid?M:n.message instanceof L?n.message:n.message===void 0?Dt.get("validation.invalid"):z(n.message)).tap(n=>{t.setCustomValidity(n)}))),Pc]})}get labels(){return Me(this).labels}get validity(){return Me(this).validity}get validationMessage(){return Me(this).validationMessage}reportValidity(){return Me(this).reportValidity()}checkValidity(){return Me(this).checkValidity()}setCustomValidity(t){let n=!!t,r=t!==this.validationMessage;this.applyValidity(n,t),this.invalid!==n?this.invalid=n:r&&At(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,n){n?this.setAttribute(`aria-${t}`,n):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let n in this.validMap){let r=this.validMap[n];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,n){Me(this).setValidity({customError:t},n)}formDisabledCallback(t){this.disabled=t}setFormValue(t){Me(this).setFormValue(t)}};function Fc(e,t){let n,r=t.key;if(r==="ArrowDown"&&e.goDown)n=e.goDown();else if(r==="ArrowRight"&&e.goRight)n=e.goRight();else if(r==="ArrowUp"&&e.goUp)n=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)n=e.goLeft();else if(r==="Home")n=t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")n=t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)n=e.other(t);else return null;return t.stopPropagation(),n&&t.preventDefault(),n}function na(e){return C(e.host,"keydown").map(t=>Fc(e,t)).filter(t=>!!t)}function Qn({host:e,input:t,handleOther:n=!1,axis:r}){let o=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function c(k=1){if(e.open===!1){e.open=!0;let _=o();requestAnimationFrame(()=>{_?.focused&&l(_)})}else return i(k)}function i(k=1,_){let R=o(),$=_??(R?e.options.indexOf(R):-1),B;do B=e.options[$+=k];while(B?.hidden);return B}function a(k){let _=k.key;if(/^\w$/.test(_)){let R=o(),$=R?e.options.indexOf(R):-1;if($===-1)return;let B=$;B+1>=e.options.length&&($=0);let J=new RegExp(`^\\s*${_}`,"i"),Q;for(;Q=e.options[++$];)if(!Q.hidden&&Q.textContent.match(J))return Q;if(B===0)return;for($=0;$<B&&(Q=e.options[$++]);)if(!Q.hidden&&Q.textContent.match(J))return Q}}let s=()=>e.options.find(k=>k.focused);function l(k){for(let _ of e.options)_.focused=!1;k?(k.focused=!0,t?.setAria("activedescendant",Fe(k)),k.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let b=k=>ue(k,"selectable.action",k);return h(na({host:t??e,...r==="x"?{goLeft:()=>c(-1),goRight:()=>c(1)}:{goDown:()=>c(1),goUp:()=>c(-1)},goFirst:()=>e.open!==!1?i(1,-1):void 0,goLast:()=>e.open!==!1?i(-1,e.options.length):void 0,other:n?a:void 0}).tap(k=>{e.open===!1?b(k):l(k)}),C(t??e,"focus").tap(()=>l(o())),ei(t??e,"Enter").tap(k=>{let _=s();e.open!==!1&&_?(k.stopPropagation(),b(_)):e.open===!1&&(e.open=!0)}))}function qr(e){return new L(t=>{h(Mi("selectable",e,e.options,n=>{if(n.type==="connect"&&(n.target.view=e.optionView,n.target.selected))return e.defaultValue===void 0&&(e.defaultValue=n.target.value),t.next(n.target);let r;for(let o of e.options)o.hidden||!o.parentNode||o.selected&&(r?o.selected=!1:r=o);t.next(r)}),pe(e,"selectable.action").tap(n=>{if(!e.disabled&&e.options.includes(n)){let r=e.value!==n.value;t.next(n),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var pt={},Pt=class e extends Lt{options=[];_value;_selected=pt;static{u(e,{init:[g("value"),q("selected")],augment:[t=>qr(t).tap(n=>{(!n||n!==t.selected)&&t.setSelected(n)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===pt?this.options[0]?.value:this._value}get selected(){return this._selected===pt&&this.options[0]?this.options[0]:this._selected}set value(t){if(this._selected&&this._selected!==pt&&this._selected.value===t){this._value=t;return}else for(let n of this.options)if(n.value===t){this._value=t,this.setSelected(n);return}this._selected!==pt?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let n of this.options)n.focused=n.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==pt&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=pt)}};function ra(e,t,...n){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let o in t){if(o==="children")continue;let c=t[o];r.setAttribute(o==="className"?"class":o,c??"")}return n.length&&r.append(...n),r}function Kn(e){return ra("svg",e,ra("path",{d:e.d}))}function jc({host:e,target:t,position:n,onToggle:r,whenClosed:o=M}){return c=>(t.popover??="auto",t.togglePopover(c),r?.(c),c?h(Bn(e),C(window,"resize"),C(window,"scroll",{capture:!0,passive:!0})).tap(n):o)}function oa(e){let{host:t,beforeToggle:n,target:r}=e,o=jc({...e,whenClosed:K(t).tap(()=>{t.open=!0})});return h(C(r,"toggle").tap(c=>{let i=c.newState==="open";t.open=i}),m(t,"open").raf().switchMap(c=>(n?.(c),t.ariaExpanded=c?"true":"false",o(c))))}var cn=class extends x{invalid=!1};u(cn,{tagName:"c-field-help",init:[g("invalid")],augment:[d(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${F("body-small")}
}
	`),O,e=>(e.slot||="help",m(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Xr=d(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${F("body-large")}
}
:host([invalid]),:host([invalid]) slot[name=label],:host([invalid]) slot[name=trailing] {
	--cxl-color-primary: var(--cxl-color-error);
	--cxl-field-invalid: var(--cxl-color-error);
	color: var(--cxl-color-error);
}
.content {
	position: relative;
	box-sizing: border-box;
	display: flex;
	column-gap: 12px;
	align-items: center;
	padding: 8px 12px 8px 12px;
}
::slotted([slot=help]) { margin-top: 4px; }
.help {
	${F("body-small")}
	padding: 0 16px;
	display: flex;
	flex-direction: column;
}
.body {
	display:flex;
	flex-direction: column;
	flex-grow: 1;
	justify-content: center;
	margin: 0 4px;
}
slot[name=label] {
	display:block;
}
#bodyslot { display: flex; column-gap: 16px; align-items: center; }
.indicator { position:absolute; }
`),zc=d(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${F("body-small")}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`),Bc=d(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${F("body-large")}
	height: 0;
}
:host([inputdisabled]) {
  filter: saturate(0);
  opacity: 0.6;
  pointer-events: var(--cxl-override-pointer-events, none);
}
.content {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-surface: var(--cxl-color-surface-container-highest);
	color: var(--cxl-color-on-surface);
	background-color: var(--cxl-color-surface);
	min-height: 56px;
	padding: 8px 12px 8px 12px;
}
.indicator {
	background-color: var(--cxl-field-invalid, var(--cxl-color-on-surface-variant));
	bottom: 0; height: 1px; left: 0; right: 0;
	transition: scale var(--cxl-speed);
	transform-origin: bottom;
}
:host(:focus-within) .indicator {
	scale: 1 3;
	background-color: var(--cxl-color-primary);
}

${Qt(".content")}
	`);function $c(e){return h(pe(e,"registable.form",!1).tap(t=>{t.id==="form"&&(e.input=t.target)}),Ri("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var Hc=()=>N("div",{className:"content"},N("slot",{name:"leading"}),N("div",{className:"body"},N("slot",{name:"label"}),N("slot",{id:"bodyslot"})),N("slot",{name:"trailing"}),N("div",{className:"indicator"}));function Uc(e){function t(l){o.next(l.touched&&l.invalid),e.toggleAttribute("invalid",o.value);let b=0,k=[];for(let R of i.assignedNodes())!(R instanceof HTMLElement)||R===s||("invalid"in R&&R.invalid?o.value&&(R.invalid===!0||R.invalid===l.validationResult?.key)?(b++,R.style.display="",k.push(Fe(R))):R.style.display="none":k.push(Fe(R)));let _=!o.value||b>0;s.textContent=_?"":l.validationMessage,_?s.remove():(s.parentElement||e.append(s),k.push(Fe(s))),k.length?l.setAria("describedby",k.join(" ")):l.setAria("describedby",null)}function n(l){let b=e.input;if(b){if(e.toggleAttribute("inputdisabled",b.disabled),t(b),!l)return;l.type==="focus"?c.next(!0):l.type==="blur"&&c.next(!1)}}function r(){let l=e.input?.value,b=!e.input?.hasAttribute("autofilled")&&(!l||l.length===0);a?.classList.toggle("novalue",b),a?.classList.toggle("value",!b)}let o=le(!1),c=le(!1),i=N("slot",{name:"help"}),a=e.contentElement.children[1]?.children[0],s=N(cn,{ariaLive:"polite"});return j(e).append(N("div",{className:"help"},i)),h(m(e,"input").switchMap(l=>l?h(z(void 0).tap(()=>{n(),queueMicrotask(r)}),C(l,"focusable.change").tap(n).tap(r),C(l,"focus").tap(n),C(l,"invalid").tap(n),C(l,"update").tap(r),G(l,"touched").tap(()=>n()),h(C(l,"blur"),C(i,"slotchange")).raf(n),C(e.contentElement,"click").tap(()=>{document.activeElement!==l&&!e.matches(":focus-within")&&!c.value&&l.focus()})):M),$c(e))}var dt=class e extends x{floating=!1;input;size;contentElement=Hc();static{u(e,{init:[w("floating"),q("input"),de("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Uc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},Zr=class extends dt{};u(Zr,{tagName:"c-field",augment:[Xr,zc,Bc]});var Vc=d(`
:host {
	box-sizing: border-box;
	display: block;
	cursor: pointer;
	height: 20px;
	position: relative;
	padding-right: 28px;
	flex-grow: 1;
	text-align: start;
	outline: 0;
	-webkit-tap-highlight-color: transparent;
}
.caret {
	position: absolute;
	right: 0;
	top: 0;
	line-height: 0;
	width: 20px;
	height: 20px;
	fill: currentColor;
}
`),ia=d(`
${yi("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function Gc(e,t){return()=>{let n=e.parentElement instanceof dt?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${n.bottom}px`,t.style.left=`${n.x}px`,t.style.minWidth=`${n.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-n.bottom-16,280)}px`}}function Qr({host:e,target:t,input:n,position:r,beforeToggle:o,onToggle:c,handleOther:i,axis:a}){return h(Qn({host:e,input:n,handleOther:i,axis:a}),C(n??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),oa({host:e,target:t,position:r??Gc(e,t),beforeToggle:o,onToggle:c}))}function Yc(e){let{host:t}=e;return h(Vc(t)??M,ve(t)??M,_e(t),Qr(e))}var Ft=class extends x{};u(Ft,{tagName:"c-select-option",augment:[d(`
:host {
	box-sizing: border-box;
	cursor: pointer;
	display: flex;
	column-gap: 16px;
	align-items: center;
	/*background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);*/
	padding: var(--cxl-select-padding, 16px);
	position: relative;
	user-select: none;
	white-space: nowrap;
	overflow: hidden;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: transparent;
}
:host([focused]) {
	background-image: var(--cxl-select-focused);
}
:host(:hover) { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
		`),O]});var Jr=class extends Pt{open=!1;optionView=Ft;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let n of this.options)n!==t&&(n.slot="");t&&(t.slot="selected")}}};u(Jr,{tagName:"c-select",init:[w("open")],augment:[V("listbox"),d(`
:host([open]) ::slotted([selected]) {
	--cxl-color-surface: var(--cxl-color-primary-container);
}
:host([open]) {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
:host(:not([open])) {
	--cxl-select-padding: 0;
	--cxl-mask-focus: transparent;
	--cxl-mask-hover: transparent;
}
slot[name=selected] {
	pointer-events: none;
	--cxl-color-surface: transparent;
}
.menu {
	position: fixed;
	padding: 8px 0;
	min-width: 112px;
	width: max-content;
	border-radius: var(--cxl-shape-corner-xsmall);
	visibility:hidden;
	margin: 0;
	transition: scale var(--cxl-speed);
	/** popover applies display:none if this is not set */
	display: block;
}
.menu.open {
	${X("surface-container")}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),e=>{let t=N("div",{className:"menu"},N("slot")),n=N("slot",{name:"selected"}),r=t.style,o=Ai(e),c=0,i=0;j(e).append(t,n,Kn({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function a(){if(e.open)i=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let s=e.options.reduce((l,b)=>Math.max(l,b.rendered?.offsetWidth??0),0);o.replaceSync(`:host{width:min(100%,${s}px)}`)}}return h(h(Ee(e),Yn()).raf(a),Yc({host:e,target:t,handleOther:!0,beforeToggle(s){a();let l=e.selected;l&&(l.slot=s?"":"selected"),t.classList.toggle("open",s)},onToggle(s){let l=e.selected;!s&&l&&(c=l.rendered?.offsetHeight??0)},position(){let s=e.parentElement??e,l=Math.round((i-c)/2),b=e.selected?.rendered,k=s.getBoundingClientRect(),_=e.getBoundingClientRect(),R=_.top-14,$,B=b?b.offsetTop:0;B>R&&(B=R),$=t.scrollHeight;let J=window.innerHeight-_.top+8+B,Q=_.top-l-B;$>J?$=J:$<_.height&&($=_.height),r.top=Q+"px",r.left=k.left+"px",r.maxHeight=$+"px",r.minWidth=k.width+"px",r.transformOrigin=`${B}px`}}))}]});function Wc(e){let t=at();return h(qe("field",e,n=>t.next(n)),t)}function aa(e){return Wc(e).switchMap(t=>m(e,"input").switchMap(n=>n?z(n):m(t,"input").switchMap(r=>r?z(r):M)))}function ln(e,t,n){return m(e,n).tap(r=>Jt(t,n,r))}var qc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function tr({host:e,input:t,toText:n,toValue:r,update:o}){t.className="cxl-native-input",t.setAttribute("style",qc),t.setAttribute("form","__cxl_ignore__");function c(s){e.value=r?r(t.value||""):t.value,s.stopPropagation(),e.dispatchEvent(new Event(s.type,{bubbles:!0}))}function i(){let s=e.value,l=n?n(s,t.value):s||"";t.value!==l&&e.setInputValue(l)}function a(){t.ariaLabel=e.ariaLabel;let s=e.getAttribute("aria-labelledby");s?t.setAttribute("aria-labelledby",s):t.removeAttribute("aria-labelledby")}return h(_e(e,t),te(()=>(a(),t.form?C(t.form,"reset").tap(c):M)),m(e,"value").tap(()=>{n&&t.matches(":focus")||i()}),C(t,"blur").tap(i),C(t,"input").tap(c),C(t,"change").tap(c),ln(e,t,"disabled"),ln(e,t,"name"),ln(e,t,"autocomplete"),ln(e,t,"spellcheck"),ln(e,t,"autofocus"),Pn(e,["aria-label","aria-labelledby"]).tap(a),o?o.tap(i):M,C(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),C(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var er=class e extends Lt{inputValue="";static{u(e,{init:[q("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,C(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,n){n?this.inputEl.setAttribute(`aria-${t}`,n):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,n){Me(this).setValidity({customError:t},n,this.inputEl),this.inputEl.setCustomValidity(t?n||"Invalid Field":"")}};var Zc=[d(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),ve],eo=[...Zc,O],un=class e extends er{autofilled=!1;autocomplete;static{u(e,{init:[w("autofilled"),g("autocomplete")],augment:[t=>C(t.inputEl,"animationstart").tap(n=>{(n.animationName==="cxl-onautofillstart"||n.animationName==="cxl-onautofillend")&&(t.autofilled=n.animationName==="cxl-onautofillstart",ue(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,n){this.inputEl.setSelectionRange(t,n)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},Kr=class extends un{value="";inputEl=N("input",{className:"input"})};u(Kr,{tagName:"c-input-text",init:[g("value")],augment:[...eo,e=>e.append(e.inputEl),e=>tr({host:e,input:e.inputEl})]});function Xc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var jt=class e extends un{selected;value;inputEl=N("input",{className:"input"});static{u(e,{tagName:"c-input-option",init:[g("value"),q("selected")],augment:[...eo,t=>t.append(t.inputEl),t=>tr({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:n=>n!==""?t.selected?.value:void 0}),t=>G(t,"selected").tap(n=>{let r=t.selected?.textContent;t.value=n?.value,t.setInputValue(r??""),Xc(t.inputEl)})]})}};function Jc(e){return to(e,"^")}function to(e,t=""){if(e==="")return()=>!0;let n=no(e,t);return r=>r.textContent?n.test(r.textContent):!1}function no(e,t="",n="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n)}var nr=class e extends x{optionView=Ft;open=!1;debounce=100;options=[];matcher=to;static{u(e,{tagName:"c-autocomplete",init:[w("open"),Vn("debounce")],augment:[V("listbox"),ia,Re,t=>{let n=N("slot",{name:"empty"}),r=N("div",{id:"menu",tabIndex:-1},N("slot"),n),o=Kn({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});o.style.cursor="pointer",n.style.display="none";function c(s){t.open=!0,a(s)}function i(s,l){s.setAria("activedescendant",Fe(l)),l.rendered?.scrollIntoView({block:"nearest"})}function a(s){let l=s.inputValue??s.value,b=t.doSearch(l);n.style.display=b?"none":"",b&&i(s,b)}return j(t).append(r,o),h(aa(t).switchMap(s=>(s.setAria("autocomplete","list"),s.role="combobox",s.setAria("controls",Fe(t)),s.setAria("haspopup",t.role),s.setAttribute("autocomplete","off"),h(m(t,"open").tap(l=>{if(l)o.tabIndex=-1,c(s);else{for(let b of t.options)b.focused=!1;o.tabIndex=0,s.setAria("activedescendant",null)}s.setAria("expanded",String(l))}),h(Fn(o),C(o,"mousedown")).tap(l=>{l.preventDefault(),l.stopPropagation(),s.focus()}).debounceTime(100).tap(()=>{t.open=!0}),m(t,"debounce").switchMap(l=>C(s,"input").debounceTime(l).tap(()=>t.open?a(s):c(s))),C(t,"change").tap(l=>{l.target===t&&s.dispatchEvent(new Event("change",{bubbles:!0}))}),Qr({host:t,target:r,input:s}),h(qr(t),G(s,"value").map(l=>{for(let b of t.options)if(b.value===l)return b})).tap(l=>{for(let b of t.options)b.focused=b.selected=!1;l&&(l.selected=!0),s instanceof jt?s.selected=l:s.value=l?.value,l&&(t.open=!1)})))))}]})}doSearch(t){let n=0,r,o=this.matcher==="substring"?to:this.matcher==="prefix"?Jc:this.matcher,c=t?o(String(t)):void 0;for(let i of this.options){let a=!c?.(i);i.hidden=a,i.focused=!(a||n++>0),i.focused&&(r=i)}return r}};var pn=class extends nr{onsearch;doSearch(t){return At(this,"search",{detail:t}),this.options[0]}};u(pn,{tagName:"c-autocomplete-dynamic",init:[Un("search")]});var rr=class extends x{};u(rr,{tagName:"c-body",augment:[d(`
:host {
	position: relative;
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x:hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	background-color: var(--cxl-color-background);
	color: var(--cxl-color-on-background);
	padding: 16px;
}
slot { display: flex; flex-direction: column; max-width: 1200px; flex-grow: 1; }

${ee("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),O]});var or=class extends x{};u(or,{tagName:"c-button-segmented-view",augment:[d(`
:host {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 8px;
	padding: 4px calc(16px + (var(--cxl-size) * 2));
	overflow: hidden;
	position: relative;
	cursor: pointer;
	white-space: nowrap;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-radius: var(--cxl-border-radius);
}
:host([selected]) {
	--cxl-color-surface: var(--cxl-color-secondary-container);
	--cxl-color-on-surface: var(--cxl-color-on-secondary-container);
}
:host([focused]) {
	background-image: var(--cxl-focused);
	outline: var(--cxl-focused-outline);
}
:host(:not([selected])) #check { display: none; }
:host(:not([selected])) { padding: 4px 32px; }
		`),Tt,Ze,()=>N(we,{id:"check",name:"check"}),O]});var dn=class extends Pt{optionView=or;size};u(dn,{tagName:"c-button-segmented",init:[de("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[V("listbox"),d(`
:host {
	display: grid;
	flex-shrink: 0;
	grid-auto-flow: column;
	grid-auto-columns: 1fr;
	box-sizing: border-box;
	outline: 1px solid var(--cxl-color-outline);
	border-radius: 50vh;
	min-height: 40px;
	column-gap: 1px;
	background-color: var(--cxl-color-outline);
	color: var(--cxl-color-on-surface);
	overflow: hidden;
	${F("label-large")}
}
:host(:focus-visible) {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
	--cxl-focused-outline: 3px auto var(--cxl-color-secondary);
}
::slotted(:first-of-type) {
	--cxl-border-radius: 50vh 0 0 50vh;
}
::slotted(:last-of-type) {
	--cxl-border-radius: 0 50vh 50vh 0;
}
		`),ve,O,_e,e=>Qn({host:e,axis:"x"})]});function ro(e="block"){let t=(n=>{for(let r=12;r>0;r--)n.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,n.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,n.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,n.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,n.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return n})({xl:"",lg:"",md:"",sm:"",xs:""});return d(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${ee("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${ee("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${ee("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${ee("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var oo=d(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${_t()}
${lt.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${lt.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),zt=class extends x{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};u(zt,{init:[w("sm"),w("xs"),w("md"),w("lg"),w("xl"),w("vpad"),w("pad"),w("center"),w("fill"),w("grow"),w("elevation"),Rt("color")]});var ze=class extends zt{};u(ze,{tagName:"c-c",augment:[oo,ro(),d(":host([center]) { text-align: center}"),O]});var Qc=d(`
:host {
	${X("surface-container")}
	${F("body-medium")}
	border-radius: var(--cxl-shape-corner-medium);
	overflow: hidden;
}
:host([variant=elevated]:not([color])) {
	--cxl-color-surface: var(--cxl-color-surface-container-low);
	z-index: 1;
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=outlined]:not([color])) {
	${X("surface")}
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline-variant);
}
${_t()}
`),ft=class extends ze{variant};u(ft,{tagName:"c-card",init:[w("variant")],augment:[Qc]});var Kc=d(`
:host { ${xi} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function el(e){return h(qe("list",e),m(e,"selected").tap(t=>e.ariaSelected=String(t)))}function tl(e){return h(Fr(e),_e(e,e,-1),el(e))}var Qe=class extends x{disabled=!1;touched=!1;selected=!1};u(Qe,{init:[w("disabled"),w("touched"),w("selected")],augment:[tl]});var io=class extends Qe{size};u(io,{tagName:"c-item",init:[de("size",e=>`{min-height:${56+e*8}px}`)],augment:[Kc,ve,Tt,V("option"),O,Ze]});var mt=class extends x{color;size=0};u(mt,{tagName:"c-pill",init:[Rt("color","surface-container-low"),de("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[d(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${F("label-large")}
	display: inline-flex;
	align-items: center;
 	position: relative;
	overflow: hidden;
 	column-gap: 8px;
	flex-shrink: 0;
	flex-wrap: nowrap;
	align-self: center;
}
slot[name] { display: inline-block; }
		`),()=>N("slot",{name:"leading"}),O,()=>N("slot",{name:"trailing"})]});var gt=class extends mt{disabled=!1;touched=!1;selected=!1};u(gt,{tagName:"c-chip",init:[w("disabled"),w("touched"),w("selected")],augment:[V("button"),jr,...Pr,d(`
:host { 
	cursor: pointer;
}
:host([disabled]) {
	background-color: color-mix(in srgb, var(--cxl-color--on-surface) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([selected]) {
	border-color: var(--cxl-color-secondary-container);
	${X("secondary-container")}
}
:host(:hover) { box-shadow: none; }
		`),Ze]});var Bt=class extends x{};u(Bt,{tagName:"c-span"});var fn=class extends x{center=!1};u(fn,{tagName:"c-backdrop",init:[w("center")],augment:[d(`
:host {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: var(--cxl-color-scrim);
  overflow: hidden;
}
:host([center]) {
  display: flex;
  justify-content: center;
  align-items: center;
}

	`),e=>C(e,"keydown").tap(t=>t.stopPropagation()),O]});var mn=class extends It{};u(mn,{tagName:"c-toggle-panel",augment:[O,Fi,Br]});var nl=d(`
#drawer {
	box-sizing: border-box;
    background-color: var(--cxl-color-surface);
    color: var(--cxl-color-on-surface);
    position: absolute;
	display: block;
    width: 85%;
	min-width: 256px;

    overflow-y: auto;
    overflow-x: hidden;
    z-index: 5;
}
${ee("small","#drawer { width: 360px }")}

#dialog {
    margin: 0;
    padding: 0;
    border-width: 0;
    max-width: none;
    max-height: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    overflow-x: hidden;
    overflow-y: hidden;
    text-align: initial;
}

#dialog::backdrop {
    background-color: transparent;
}
`),$t=class extends x{open=!1;position;responsive;permanent=!1};u($t,{tagName:"c-drawer",init:[w("open"),w("position"),g("responsive"),g("permanent")],augment:[nl,d(`
/* Position absolute so it doesn't interfere with layout if placed in the DOM */
:host { max-width: 360px; position: absolute; }
#drawer.permanent {
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    width: 100%;
    height: 100%;
	z-index: 0;
	border-radius: 0;
}
#drawer {
    top: 0;
    bottom: 0;
}
#drawer, :host([position=left]) #drawer {
	left: 0;
	border-radius: 0 var(--cxl-shape-corner-large) var(--cxl-shape-corner-large) 0;
}
:host([position=right]) #drawer,:host(:not([position]):dir(rtl)) #drawer {
	right: 0;
	left: auto;
	border-radius: var(--cxl-shape-corner-large) 0 0 var(--cxl-shape-corner-large);
}
:host([responsiveon]) { position: initial }
:host([responsiveon]) #backdrop { display: none; }
:host([responsiveon]) #dialog { display: contents; }
`),e=>{let t=le(!1),n=h(m(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",o=N(mn,{id:"drawer","motion-in":n.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":n.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},O),c=new fn;c.id="backdrop";let i=N("dialog",{id:"dialog"},c,o);return j(e).append(i),h(C(o,"close").tap(()=>i.close()),C(i,"close").tap(()=>e.open=!1),pe(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),G(o,"open").tap(a=>e.open=a),G(e,"open").raf(a=>{a||o.scrollTo(0,0)}),C(c,"click").tap(()=>e.open=!1),C(i,"cancel").tap(a=>{a.preventDefault(),e.open=!1}),m(e,"open").tap(a=>{if(t.value&&e.permanent)return o.open=!0;a?t.value||(Je.openModal({element:i,close:()=>e.open=!1}),i.getBoundingClientRect()):Je.currentModal?.element===i&&Je.modalClosed()}).raf(a=>{o.open=a}),m(e,"responsive").switchMap(a=>a!==void 0?Mt(document.body):z("xsmall")).switchMap(a=>{let s=W.breakpoints[e.responsive||"large"],l=W.breakpoints[a]>=s;return t.next(l),l&&o.className!=="permanent"?i.close():!l&&o.className==="permanent"&&(e.open=!1),l&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",l),o.className=l?"permanent":"drawer",G(e,"open").tap(b=>{e.hasAttribute("responsiveon")||je({target:c,animation:b?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var ir=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,n=this.end){let r=this.end.parentNode;r&&(this.start.parentNode||r.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),r.insertBefore(this.frag,n)):r.insertBefore(t,n))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let n=document.createRange();n.setStartAfter(this.start),n.setEndBefore(this.end),n.deleteContents()}};function ca({source:e,render:t,empty:n,append:r,loading:o}){let c=[],i=document.createDocumentFragment(),a,s;function l(b){if(s?.parentNode?.removeChild(s),!b)return;let k=0;for(let R of b){let $=c[k]?.item;if($)$.value!==R&&$.next(R);else{let B=le(R),J=t(B,k,b),Q=J instanceof DocumentFragment?Array.from(J.childNodes):[J];c.push({elements:Q,item:B}),i.append(J)}k++}i.childNodes.length&&r(i),a?.remove(),k===0&&n&&r(a=n());let _=c.length;for(;_-- >k;)c.pop()?.elements.forEach(R=>R.remove())}return te(()=>(s=o?.(),s&&r(s),e.raf(l)))}function ar(e){return ri(()=>{let t=new ir;return[ca({...e,append:n=>t.insert(n)}),t.end]})}function rl(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function ol(e,t){let n=e.getRootNode();if(n instanceof Document)return rl(n.getElementById(t));throw new Error("Invalid root node")}function sa(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=ol(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function il(e){return m(e,"template").switchMap(t=>t?z(sa(e,t)):st().map(()=>sa(e,e.children[0])))}function al(e,t,n){return il(e).switchMap(r=>{let o=e.target?Ot(e,e.target)??e:e;return r?ca({source:t,render:n?(c,i,a)=>n(r(c,i,a)):r,append:c=>o.append(c)}):M})}var ao=class extends x{source;template};u(ao,{tagName:"c-each",init:[q("source"),q("template")],augment:[Re,O,e=>al(e,m(e,"source"))]});var gn=class extends dt{};u(gn,{tagName:"c-field-bar",augment:[Xr,d(`
:host {
	box-sizing: border-box;
	${X("surface-container-high")}
	${F("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var se=class extends zt{vflex=!1;gap;middle=!1};u(se,{tagName:"c-flex",init:[w("vflex"),w("gap"),w("middle")],augment:[ro("flex"),oo,d(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${lt.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),O]});var Be=class extends x{pad;vertical=!1};u(Be,{tagName:"c-hr",init:[w("pad"),w("vertical")],augment:[V("separator"),d(`
:host {
	display: block;
	height: 1px;
	background-color: var(--cxl-color-outline-variant);
	grid-column: 1 / -1;
}
:host([vertical]) {
	height: auto;
	width: 1px;
	align-self: stretch;
	margin-top: 8px;
	margin-bottom: 8px;
}
${lt.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});function co(e){let t=document.createElement("style");return h(re(n=>{let r=e.persistkey&&$r.get(e.persistkey);r!==void 0?e.open=r===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),n.signal.subscribe(()=>t.remove())}),Ge(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let n=e.open?e.themeon:e.themeoff;e.persistkey&&$r.set(e.persistkey,n),Ci(wi[n]||n)}),K(e).tap(()=>e.open=!e.open))}var so=class extends x{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};u(so,{tagName:"c-toggle-theme",init:[g("persistkey"),g("usepreferred"),g("open"),g("themeon"),g("themeoff")],augment:[V("group"),co]});var hn=class extends he{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};u(hn,{tagName:"c-icon-toggle-theme",init:[g("persistkey"),g("usepreferred"),g("open"),g("themeon"),g("themeoff")],augment:[co,e=>ce(m(e,"iconon"),m(e,"iconoff"),m(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var sl=()=>{let e;function t(){let n=document.adoptedStyleSheets.indexOf(e);n!==-1&&document.adoptedStyleSheets.splice(n,1)}addEventListener("message",n=>{let{theme:r}=n.data;t(),r!==void 0&&(e=new CSSStyleSheet,e.replace(r).catch(o=>console.error(o)),document.adoptedStyleSheets.push(e))})},cl=()=>{let e=()=>{let t=()=>{parent.postMessage({height:document.documentElement.scrollHeight},"*")};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(t).observe(document.documentElement)},n=>console.error(n))})};document.readyState==="complete"?e():addEventListener("load",e)},xn=class extends x{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=f("iframe",{loading:"lazy"})};u(xn,{tagName:"c-iframe",init:[g("src"),g("srcdoc"),g("sandbox"),g("handletheme")],augment:[d(`
:host {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}
iframe {
  width: 100%;
  height: 0;
  opacity: 0;
  transition: opacity var(--cxl-speed);
  display: flex;
  border-style: none;
}
	`),e=>{let t=e.iframe,n=f("slot",{name:"loading"}),r=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(r),n.style.display="none";function o(a){r.replaceSync(":host{height:"+a+"px}"),t.style.height="100%",t.style.opacity="1",n.style.display="none"}function c(a){if(a){let s=`<script type="module">
(${cl.toString()})();
(${sl.toString()})();
<\/script>`;t.srcdoc=`${e.reset}${a}${s}`,n.style.display=""}}async function i(a){let s=new URL(a);return`${s.search||s.hash?`<script>history.replaceState(0,0,'about:srcdoc${s.search}${s.hash}');<\/script>`:""}<base href="${a}" />`+await fetch(a).then(l=>l.text())}return j(e).append(t,n),h(ce(m(e,"srcdoc"),m(e,"src")).raf(([a,s])=>{(async()=>{c(s?await i(s):a)})().catch(()=>{})}),C(window,"message").tap(a=>{let{height:s}=a.data;a.source===t.contentWindow&&s!==void 0&&o(s)}),m(e,"handletheme").switchMap(a=>a?C(t,"load").switchMap(()=>Nt.raf(s=>{let l=s?.css??"";t.contentWindow?.postMessage({theme:l},"*")})):M),m(e,"sandbox").tap(a=>a===void 0?t.removeAttribute("sandbox"):t.sandbox.value=a))}]});var lo=[d(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${F("label-large")}
	box-sizing: border-box;
	position: relative;
	cursor: pointer;
	border-radius: 28px;
	overflow:hidden;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 12px;
	-webkit-tap-highlight-color: transparent;
	z-index: 0;
}
:host(:focus-visible) { z-index: 1; }
:host(:focus-visible) slot {
	outline: 3px auto var(--cxl-color-secondary);
}
:host([selected]) {
	--cxl-color-on-surface: var(--cxl-color-on-secondary-container);
	background-color: var(--cxl-color-secondary-container);
	font-weight: var(--cxl-font-weight-label-large-prominent);
}
/** Avoid accessibility errors with background */
:host([selected]) c-ripple { background-color: var(--cxl-color-surface); }
c-ripple { z-index: -1 }
:host([dense]) { min-height:48px; }
:host slot::after { content: ''; position: absolute; inset: 0; }
${Qt("slot::after")}
	`),ve,Di,O],ht=class extends Qe{size};u(ht,{tagName:"c-nav-item",init:[de("size",e=>`{min-height:${56+e*8}px}`)],augment:[V("option"),...lo]});var sr=class extends Qe{icon="arrow_drop_down";open=!1;target;size};u(sr,{tagName:"c-nav-dropdown",init:[g("icon"),g("target"),w("open"),de("size",e=>`{min-height:${56+e*8}px}`)],augment:[V("treeitem"),...lo,d(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>nn(e).raf(({target:t,open:n})=>t.open=n),e=>{let t=N(we,{className:"icon"});return j(e).append(t),h(m(e,"icon").tap(n=>t.name=n))}]});var cr=class extends en{};u(cr,{tagName:"c-nav-target",augment:[V("group"),d(":host{display:block;padding-inline-start:12px;}")]});var lr=class extends x{};u(lr,{tagName:"c-nav-headline",augment:[d(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),O]});var bn=class extends he{open=!1;target;icon="menu"};u(bn,{tagName:"c-navbar-toggle",init:[g("target"),q("open")],augment:[e=>nn(e).tap(({target:t,open:n})=>t.open=n)]});function la(e){return h(m(e,"selected").pipe(ai(e,"selected")),qe("selectable",e),K(e).tap(()=>ue(e,"selectable.action",e)))}var Ke=class extends x{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};u(Ke,{tagName:"c-option",init:[g("value"),q("view"),w("selected"),w("hidden"),w("focused")],augment:[V("option"),d(":host{display:contents} :host([hidden]){display:none;}"),ea,la,e=>{let t;return h(m(e,"view").switchMap(n=>n?(t?.remove(),e.rendered=t=new n,t.appendChild(N("slot")),j(e).append(t),h(m(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),m(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,M)))}]});var ur=class extends x{};u(ur,{tagName:"c-page",augment:[Jn,d(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${X("background")}
}`),O]});var ll=/([^&=]+)=?([^&]*)/g,ul=/:([\w_$@]+)/g,pl=/\/\((.*?)\)/g,dl=/(\(\?)?:\w+/g,fl=/\*\w+/g,ml=/[-{}[\]+?.,\\^$|#\s]/g,bo="@@cxlRoute",Se={location:window.location,history:window.history};function gl(e){let t=[];return[new RegExp("^/?"+e.replace(ml,"\\$&").replace(pl,"\\/?(?:$1)?").replace(dl,function(r,o){return t.push(r.substr(1)),o?r:"([^/?]*)"}).replace(fl,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function hl(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function uo(e,t){return t?e.replace(ul,(n,r)=>t[r]||""):e}function xl(e){let t={},n;for(;n=ll.exec(e);)n[1]!==void 0&&(t[n[1]]=decodeURIComponent(n[2]??""));return t}var po=class{path;regex;parameters;constructor(t){this.path=t=hl(t),[this.regex,this.parameters]=gl(t)}_extractQuery(t){let n=t.indexOf("?");return n===-1?{}:xl(t.slice(n+1))}getArguments(t){let r=this.regex.exec(t)?.slice(1);if(!r)return;let o=this._extractQuery(t);return r.forEach((c,i)=>{let a=i===r.length-1?c||"":c?decodeURIComponent(c):"",s=this.parameters[i];s&&(o[s]=a)}),o}test(t){return this.regex.test(t)}toString(){return this.path}},fo=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new po(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${Math.random().toString()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let n=this.definition.render();n[bo]=this;for(let r in t)t[r]!==void 0&&(n[r]=t[r]);return n}},mo=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(n=>n.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(n=>n.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function bl(e){return e[bo]}function go(e,t){let n=new URL(e,`http://localhost/${t}`);return{path:n.pathname.slice(1),hash:n.hash.slice(1)}}var yl={getHref(e){return`${Se.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=yn()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let n=this.getHref(e);n!==`${location.pathname}${location.search}${location.hash}`&&Se.history.pushState({url:e},"",n)}},deserialize(){return{path:Se.location.search.slice(1),hash:Se.location.hash.slice(1)}}};function yn(){return Se.history.state}var vl={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=yn()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let n=this.getHref(e);n!==`${location.pathname}${location.search}${location.hash}`&&Se.history.pushState({url:e},"",n||"/")}},deserialize(){return{path:Se.location.pathname,hash:Se.location.hash.slice(1)}}},ua={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=ua.getHref(e);Se.location.hash!==t&&(Se.location.hash=t)},deserialize(){return go(Se.location.hash.slice(1),"")}},pa={hash:ua,path:vl,query:yl},ho=class{callbackFn;state;routes=new mo;instances={};root;lastGo;constructor(t){this.callbackFn=t}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let n=new fo(t);return this.routes.register(n),n}go(t){this.lastGo=t;let n=this.state?.url,r=typeof t=="string"?go(t,n?.path??""):t,o=r.path;if(o!==n?.path){let c=this.routes.findRoute(o);if(!c)throw new Error(`Path: "${o}" not found`);let i=c.path?.getArguments(o);if(c.redirectTo)return this.go(uo(c.redirectTo,i));let a=this.execute(c,i);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${o}" could not be created`);this.updateState({url:r,arguments:i,route:c,current:a,root:this.root})}else this.state&&r.hash!=n.hash&&this.updateState({...this.state,url:r})}getPath(t,n){let o=this.routes.get(t)?.path;return o&&uo(o.toString(),n)}isActiveUrl(t){let n=this.state?.url;if(!n)return!1;let r=go(t,n.path);return!!Object.values(this.instances).find(o=>{let c=o[bo],i=this.state?.arguments;if(c?.path?.test(r.path)&&(!r.hash||r.hash===n.hash)){if(i){let a=c.path.getArguments(r.path);for(let s in a)if(i[s]!=a[s])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,n){let r=this.instances[t],o;if(r)for(o in n){let c=n[o];c!==void 0&&(r[o]=c)}return r}executeRoute(t,n,r){let o=t.parent,c=o&&this.routes.get(o),i=t.id,a=c&&this.executeRoute(c,n,r),s=this.findRoute(i,n)||t.create(n);return a?s.parentNode!==a&&a.appendChild(s):this.root=s,r[i]=s,s}discardOldRoutes(t){let n=this.instances;for(let r in n){let o=n[r];o&&t[r]!==o&&(o.parentNode?.removeChild(o),delete n[r])}}execute(t,n){let r={},o=this.executeRoute(t,n||{},r);return this.discardOldRoutes(r),this.instances=r,o}},Ht=new Ct,da=new Ct,fe=new ho(()=>Ht.next());function wl(e){let t=e;for(;t=t.parentElement;)if(t.scrollTop!==0)return t.scrollTo(0,0)}function fa(e){let t;return Ht.tap(()=>{let{root:n}=fe.getState();n.parentNode!==e?e.appendChild(n):t&&t!==n&&t.parentNode&&e.removeChild(t),t=n}).raf(()=>{let n=fe.getState().url;if(n.hash)e.querySelector(`#${n.hash},a[name="${n.hash}"]`)?.scrollIntoView();else{let r=yn()?.lastAction;e.parentElement&&r&&r!=="pop"&&wl(e)}})}function El(e,t=pa.query){return h(re(()=>da.next(t)),e.tap(()=>fe.go(t.deserialize())),Ht.tap(()=>t.serialize(fe.getState().url))).catchError(n=>{if(n?.name==="SecurityError")return M;throw n})}function Sl(){return Pe(z(location.hash.slice(1)),C(window,"hashchange").map(()=>location.hash.slice(1)))}var pr;function Cl(){if(!pr){pr=new Wt(history.state);let e=history.pushState;history.pushState=function(...t){let n=e.apply(this,t),r=yn();return r&&(r.lastAction="push",pr?.next(r)),n}}return h(C(window,"popstate").map(()=>{let e=yn();return e&&(e.lastAction="pop"),e}),pr)}function Al(){let e;return h(Sl(),Cl()).map(()=>window.location).filter(t=>{let n=t.href!==e;return e=t.href,n})}var Nh=Ht.raf().map(()=>{let e=[],t=fe.getState(),n=t.current;do n.routeTitle&&e.unshift({title:n.routeTitle,first:n===t.current,path:kl(n)});while(n=n.parentNode);return e});function kl(e){let t=bl(e);return t&&uo(t.path?.toString()||"",fe.state?.arguments||{})}function dr(e,t,n=t){return h(ce(da,Ge(e)).tap(([r])=>{e.href!==void 0&&(t.href=e.external?e.href:r.getHref(e.href)),t.target=e.target||""}),K(t).tap(r=>{e.target||r.preventDefault()}),K(n).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):fe.go(e.href))}))}function Nl(e,t){let n=document.createElement("div");return n.style.display="contents",n.routeTitle=t,n.appendChild(e.content.cloneNode(!0)),n}var xo=class extends x{strategy="query";get state(){return fe.state}go(t){return fe.go(t)}};u(xo,{tagName:"c-router",init:[g("strategy")],augment:[e=>{function t(n){let r=n.dataset;if(r.registered)return;r.registered="true";let o=r.title||void 0;fe.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:n.hasAttribute("data-default"),redirectTo:r.redirectto,render:Nl.bind(null,n,o)})}return st().switchMap(()=>{for(let n of Array.from(e.children))n instanceof HTMLTemplateElement&&t(n);return h(Ln(e).tap(n=>{n.type==="added"&&n.value instanceof HTMLTemplateElement&&t(n.value)}),m(e,"strategy").switchMap(n=>{let r=pa[n];return El(Al(),r).catchError((o,c)=>(console.error(o),c))}))})}]});function vo(e,t=e){return h(Tl(e,t).ignoreElements(),Ht.map(()=>e.href!==void 0&&fe.isActiveUrl(e.href)))}function Tl(e,t=e){let n=N("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return n.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,j(e).append(n),h(dr(e,n),C(n,"click").tap(r=>{r.stopPropagation(),Xt(r)||e.dispatchEvent(new PointerEvent(r.type,r)),ue(e,"drawer.close",void 0)}),K(t).tap(r=>{Xt(r)&&n.click()}))}var yo=class extends x{href};u(yo,{tagName:"c-router-selectable",init:[g("href")],augment:[Re,()=>N("slot"),e=>te(()=>{let t=e.parentElement;return vo(e,t).raf(n=>{t.selected=n})})]});var vn=class extends ht{href;external=!1;target};u(vn,{tagName:"c-router-item",init:[g("href"),g("external"),g("target")],augment:[e=>vo(e).tap(t=>{e.selected=t})]});var xt=class extends x{href;focusable=!1;external=!1;dismiss=!1;target};u(xt,{tagName:"c-router-link",init:[g("href"),g("focusable"),g("external"),g("target"),g("dismiss")],augment:[d(`
:host {
  display: contents;
  text-decoration: none;
}
.link {
  display: contents;
  outline: 0;
  text-decoration: inherit;
  color: inherit;
  cursor: pointer;
}
	`),e=>{let t=N("a",{className:"link"},N("slot"));return j(e).append(t),h(m(e,"focusable").tap(n=>t.tabIndex=n?0:-1),Bi(e),dr(e,t))}]});var wn=class extends xt{focusable=!0};u(wn,{tagName:"c-router-a",augment:[d(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var En=class extends x{};u(En,{tagName:"c-router-outlet",init:[],augment:[V("main"),Re,fa,O]});var Z=class extends x{font};u(Z,{tagName:"c-t",init:[w("font")],augment:[d(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${hi.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${F("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${F("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${F("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${F("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${F("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${F("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),O,e=>m(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var wo=class extends wn{};u(wo,{tagName:"doc-a"});var bt=class extends gn{};u(bt,{tagName:"doc-search-input",augment:[e=>{let t=le([]),n=f(pn,{$:r=>C(r,"search").tap(o=>{let c=o.detail,i=[],a=1e3;if(c){let s=no(c);for(let l of CONFIG.symbols)if(s.test(l.name)&&i.push(l),a--<0)break}t.next(i)})},ar({source:t,render:r=>f(Ke,{value:r.map(o=>o.href)},r.map(o=>o.name)),empty:()=>f(ze,{slot:"empty",pad:16},"No Results Found")}));n.style.maxHeight="50%",e.size=-2,e.append(f(we,{name:"search"}),f(jt,{$:r=>m(r,"selected").tap(o=>{let c=o?.value;c&&(CONFIG.spa?fe.go(c):location.href=c,r.value="")})}),n)}]});var Sn=class extends x{};u(Sn,{tagName:"doc-search",augment:[d(`
:host { display: block; }
c-appbar-contextual {
	position: absolute;
	inset: 0;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	z-index: 1;
}
		`),e=>{let t=f(Xn),n=f(tn,{target:t},f(he,{icon:"search"})),r=f(bt);return e.shadowRoot?.append(t,n),Mt(document.body).tap(o=>{o==="xsmall"?(t.style.display="",n.style.display="",t.append(r)):(t.open=!1,t.style.display="none",n.style.display="none",r.parentNode!==e.shadowRoot&&e.shadowRoot?.append(r))})}]});var Cn=class extends rn{sticky=!0};u(Cn,{tagName:"doc-appbar",augment:[d(ee("large",":host{display:none}")),e=>{e.append(f(bn,{target:"navbar"}),f(se,{grow:!0},CONFIG.packageName),f(Sn))}]});var Ml=["Property","Method","Function","Event","Class","Namespace","Interface","Enum","TypeAlias","Attribute","Component","Constant"],ma=Ml.map(e=>`:host([kind=${e}]){--cxl-color-surface:var(--3doc-chip-${e}-bg);--cxl-color-on-surface:var(--3doc-chip-${e}-fg)}`).join(""),$e=class extends mt{kind;size=-1};u($e,{tagName:"doc-pill",init:[w("kind")],augment:[d(`
:host { ${F("code")}; border: 0; }
${ma}`)]});var An=class extends gt{kind;size=-1};u(An,{tagName:"doc-chip",init:[w("kind")],augment:[d(`
:host { ${F("code")} }
${ma}`)]});var Eo=class extends x{name;kind};u(Eo,{tagName:"doc-card",init:[g("kind"),g("name")],augment:[d(`
:host{
	display:block;
	margin: 24px 0;
	scroll-margin-top: 80px;
}
:host(:target) {
	outline: 2px dashed var(--cxl-color-primary);
}
c-accordion-panel{ border: 0; }
#header { 
	padding: 12px 16px;
	display: flex;
	align-items: center;
	gap: 8px;
	border-bottom: 1px solid var(--cxl-color-outline-variant);
	${X("surface-container-high")}	
}
#body { padding: 16px; }
#title { margin-inline-end: auto; }
${ee("medium",":host{}")}
		`),e=>{e.shadowRoot?.append(f(ft,{color:"surface",variant:"outlined"},f("div",{id:"header"},f($e,{kind:m(e,"kind")},m(e,"kind")),f(Z,{id:"title",font:"title-medium"},m(e,"name")),f("slot",{name:"tags"})),f("div",{id:"body"},f("slot"))))}]});var So=class extends x{language="html";formatter=t=>{let n;try{n=hljs.highlight(t,{language:this.language}).value}catch{n=t}return`<code>${n}</code>`}};u(So,{tagName:"doc-hl",init:[g("language")],augment:[d(`
:host { display: block;  }
.hljs {
	white-space: pre-wrap; font: var(--cxl-font-code);
	padding:16px; border-radius: 8px;
	${X("surface-container")}
}
.hljs-comment,
.hljs-quote {
	color: var(--hljs-comment);
	font-style: italic;
}
.hljs-operator,
.hljs-punctuation,
.hljs-subst,
.hljs-name,
.hljs-section,
.hljs-selector-tag,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-selector-id,
.hljs-variable,
.hljs-template-variable {
	color: var(--hljs-structure);
}
.hljs-attribute,
.hljs-attr,
.hljs-meta-string {
	color: var(--hljs-attr);
}
.hljs-keyword,
.hljs-literal,
.hljs-built_in,
.hljs-doctag,
.hljs-formula {
	color: var(--hljs-keyword);
}
.hljs-function .hljs-title,
.hljs-title.function_ {
	color: var(--hljs-fn-title);
}
.hljs-function,
.hljs-params {
	color: var(--hljs-structure);
}
.hljs-type,
.hljs-class .hljs-title,
.hljs-title.class_ {
	color: var(--hljs-type);
}
.hljs-interface .hljs-title {
	color: var(--hljs-interface-title);
}
.hljs-string,
.hljs-regexp {
	color: var(--hljs-string);
	opacity: 0.85;
}
.dark .hljs-string,
.dark .hljs-regexp {
	opacity: 0.88;
}
.hljs-number {
	color: var(--hljs-number);
}
.hljs-meta,
.hljs-tag {
	color: var(--hljs-meta);
}
.hljs-tag .hljs-name {
	color: var(--hljs-attr);
}
.hljs-emphasis {
	font-style: italic;
}
.hljs-strong {
	font-weight: 700;
}
.hljs-link {
	text-decoration: underline;
}

	`),e=>{let t=f("div",{className:"hljs"});return t.style.tabSize="4",j(e).append(t),Ee(e).switchMap(()=>zn(e).raf(()=>{let n=e.childNodes[0]?.textContent?.trim()||"";n&&e.formatter&&(n=e.formatter(n)),t.innerHTML=n}))}]});var Co=class extends x{};u(Co,{tagName:"doc-grd",augment:[d(`:host {
	padding: 8px 16px;
	display: grid;
	gap: 16px 12px;
}
${ee("small",":host{grid-template-columns:repeat(2, minmax(0px,1fr))}")}
${ee("medium",":host{grid-template-columns:repeat(3, minmax(0px,1fr))}")}
${ee("large",":host{grid-template-columns:repeat(4, minmax(0px,1fr))}")}
`),O]});var kn=class extends x{view="mobile";header="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";libraries;formatter;getLibraryUrl(t){return`https://cdn.jsdelivr.net/npm/${t}`}};u(kn,{tagName:"doc-demo-bare",init:[g("view"),g("libraries"),g("header")],augment:[d(`
  :host {
    display: flex;
    flex-direction: column;
	gap: 8px; 
	margin: 32px 0;
  }
  #body {
    position: relative;
    border: 1px solid var(--cxl-color-outline-variant);
    border-radius: 8px;
	overflow: hidden;
	min-height:138px;
  }
  #view { margin-left: auto; }
  
  .parent {
    visibility: hidden; 
    flex-grow: 1;
  }
  .container {
    margin: 0 auto;
    width: 100%;
    min-height: 100%;
    max-height: 740px;
    overflow: hidden;
  }
  @media (max-width: 768px) {
    .cmobile {
      padding-bottom: 0;
    }
  }
  .source {
  	display: none;
    font: var(--cxl-font-code); 
    overflow-y: auto;
    flex-grow: 1;
    min-height: 64px;
	position: absolute;
	inset: 0;
	padding: 16px;
	text-align: initial;
	white-space: pre-wrap;
  }
  
  .visible { display: block; visibility: visible; }
  .hide { display: none; }
  .tabs { flex-grow: 1; }
  
  #toolbar {
	gap: 16px;
	align-items: end;
	display: flex;
  }
	`),e=>{let t=m(e,"view"),n=le("container"),r=f(xn,{className:n}),o=f(Bt,{$:l=>Ee(l).tap(()=>{e.formatter?l.innerHTML=e.formatter(i):l.innerText=i}),className:t.map(l=>l==="source"?"source visible hljs":"source")}),c=f("div",{id:"toolbar"},f("slot",{name:"toolbar"}),f(he,{$:l=>K(l).mergeMap(async()=>{await navigator.clipboard.writeText(i),l.icon="done",setTimeout(()=>l.icon="content_copy",2e3)}),height:20,icon:"content_copy",title:"Copy source to clipboard",className:t.map(l=>l==="source"?"icon":"icon hide")}),f(dn,{$:l=>m(l,"value").tap(b=>{e.view=b}),id:"view",size:-2},f(Ke,{value:"desktop"},"Preview"),f(Ke,{value:"source"},"Code"))),i;function a(l){let b=l==="desktop";n.next(b?"container":"container cmobile")}function s(){let l=e.childNodes[0]?.textContent?.trim()||"";if(!l)return;let b=e.libraries?e.libraries.split(",").map(k=>`<script type="module" src="${e.getLibraryUrl(k)}"><\/script>`).join(""):"";r.srcdoc=`${e.header}${b}${l}`,i=l}return j(e).append(c,f("div",{id:"body"},f(Bt,{className:t.map(l=>l==="source"?"parent":`parent visible ${l}`)},r),o)),h(m(e,"view").tap(a),Ee(e).switchMap(()=>zn(e).raf(s)))}]});var Nn=class extends kn{header=this.getHeader();hljsCss="hljs.css";formatter=t=>`<link rel="stylesheet" href="${this.hljsCss}" />`+hljs.highlight(t,{language:"html"}).value;getHeader(){let t="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";return typeof CONFIG<"u"?t+`${CONFIG.demoStyles?`<style>${CONFIG.demoStyles}</style>`:""}${CONFIG.demoScripts?.map(n=>`<script type="module" src="${n}"><\/script>`).join("")??""}`:t}};u(Nn,{tagName:"doc-demo"});function ga(e){let t=e.index;function n(a){if(!(!a||typeof a=="string")&&typeof a=="number")return t.find(s=>s.id===a)}function r(a){if(!(!a||typeof a=="string")){if(typeof a=="number"){let s=t.find(l=>l.id===a);return s&&(s.kind===4||s.kind===8)?s:s?r(s.resolvedType??s.type):void 0}return a.kind===6?n(a.type):a.resolvedType&&typeof a.resolvedType!="string"?a.resolvedType:a}}function o(a,s){if(a.children){for(let l of a.children)!l.name||l.flags&&l.flags&128||(s[l.name]??=l);return s}}function c(a,s={}){o(a,s);let l=r(a.type);if(l?.children)for(let b of l.children){let k=r(b);if(!k||k.kind!==35||k.name==="Component")break;c(k,s)}return s}function i(a){return a.kind===17||a.kind===16||a.kind===11||a.kind===13}return{getNodeProperties:c,getTypeSummary:r,isFunction:i,getRef:n,json:e}}var Il={31:"Constants",1:"Variables",4:"Interfaces",8:"Classes",10:"Properties",11:"Methods",12:"Getters",13:"Setters",14:"Constructor",16:"Functions",22:"Enums",35:"Components",36:"Attributes",2:"Type Alias",38:"Call Signature",39:"Construct Signature",44:"Events",24:"Index Signature",25:"Exports",37:"Namespaces"};function ha(e){return typeof e=="string"?e:e.map(t=>t.value).join(" ")}function Ol(e){return e.name?`docs/ui-${e.name}`:void 0}function Dl(e){let t=Ol(e),n=e.name??"?";return t?f("a",{href:t},n):n}function xa({summary:e,summaryJson:t,link:n=Dl,uiCdn:r,importmap:o,codeHighlight:c}){let{getTypeSummary:i,getRef:a,isFunction:s}=ga(t),l=t.index;function b(E){if(E)return typeof E=="string"?E:i(E)??(typeof E=="number"?void 0:E.name)}function k(E){return E?"&lt;"+E.map(A=>R(A)+(A.kind!==6&&A.type?` extends ${R(A.type)}`:"")).join(", ")+"&gt;":""}function _(E){return["{ ",...E.children?.map(be).flatMap(xe("; "))??[]," }"]}function R(E){let A=b(E);if(!A||typeof A=="string")return[A||"?"];switch(A.kind){case 5:return A.children?.map(R).flatMap(xe(" | "))??[];case 23:case 32:return[A.name??"?"];case 34:return _(A);case 15:return[...R(A.type),"[]"];case 4:case 8:case 35:{let p=A.typeP?k(A.typeP):void 0;return[n(A),p]}case 17:return be(A);case 33:{let p=a(E);return[p?n(p):A.name??"?"]}case 21:return[...R(A.children?.[0]),"[",...R(A.children?.[1]),"]"];default:console.log(A)}return[]}function $(E){let A=E.flags??0;return[`${`${A&4?"public ":A&8?"private":A&16?"protected ":""}${A&262144?"...":""}${E.name}${A&524288?"?":""}`}: `,...R(E.type)]}function B(E){return["(",...E?.map($).flatMap(xe(", "))??[],")"]}function J(E){let A=E.flags??0,p=E.kind===12?"get ":E.kind===13?"set ":void 0;return[A&32?"static ":"",A&64?"readonly ":"",A&128?"abstract ":"",p]}function Q(E){return["[",...E.parameters?.flatMap(be)??[],"]: ",...E.type?R(E.type):["?"]]}function xe(E){return(A,p)=>p!==0?[...E,...A]:A}function be(E){if(E.kind===24)return Q(E);if(E.kind===45&&E.children?.[0])return["...",...R(E.children[0])];let A=E.flags&&E.flags&524288,p=s(E)?B(E.parameters):[],y=E.kind===17;return[...J(E),E.name,A?"?":"",...p,y?" => ":": ",...R(E.resolvedType??E.type)]}function Oe(E){return[f("h3",{},f(Z,{font:"title-large"},...be(E))),...tt(E)]}function He(E,A){if(!E.children)return[];let p={};for(let y of E.children)y.kind!==14&&y.kind!==0&&(y.flags||0)&4&&!A?.(y)&&(p[y.kind]??={name:Il[y.kind]??"",nodes:[]}).nodes.push(y);return Object.values(p).sort(ji("name")).flatMap(y=>[f("h2",{},y.name),...y.nodes.flatMap(Oe)])}function De(E){let A="";E=E.replace(/<caption>(.+?)<\/caption>/,(I,H)=>(A=H,""));let p=`<style>html{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;overflow-x:hidden;overflow-y:auto;padding:24px;gap:32px;min-height:96px;color:var(--cxl-color-on-background);
background-color:var(--cxl-color-background)}</style>`,y=(o??"")+`<script type="module" src="${r}"><\/script>`,v=f(Nn,{header:p+y,formatter:c},E);return[A?f(Z,{font:"title-medium"},A):void 0,v]}function Gt(E){return l.find(A=>A.name===E)}function me(E){let A=E.flatMap(p=>{let y=p.value,v=ha(y);if(typeof y=="string"){let I=Gt(y);v=I?n(I):y}return[v,", "]});return A.pop(),f("p",{},"Related: ",A)}function wt({src:E}){let A=f("div");return A.textContent=E,A}function tt(E){let A=E.docs;if(!A?.content)return[];let p=[],y=A.content.flatMap(v=>{let I=ha(v.value);return v.tag==="icon"||v.tag==="title"?[]:v.tag==="example"||v.tag==="demo"||v.tag==="demoonly"?De(I):v.tag==="see"?(p.push(v),[]):v.tag==="return"?[f(Z,{font:"headline-small"},"Returns"),f("p",void 0,I)]:v.tag==="param"?[f("p",void 0,I)]:[v.tag?f("p",void 0,`${v.tag}: `,I):wt({src:I})]});return p.length&&y.push(me(p)),y}function Yt(E){let A=[],p=i(E);if(!(!p||p.kind!==33))return p.children?.forEach(y=>{if(typeof y!="object")return;let v=i(y);v&&v.name!=="Component"&&A.push(n(v))}),f(Z,{font:"headline-small"}," ",...A.length?["extends ",A]:[])}function Et(E){let A=i(E.type),p=[];if(!A?.children)return[];for(let y of A.children){let v=i(y);if(!v||v.kind!==35||v.name==="Component")break;let I=He(v,H=>!!((H.flags??0)&128));I.length&&p.push(f("br"),f(Z,{font:"h6"},"Inherited from ",n(v)),...I),p.push(...Et(v))}return p}let St=e.kind===35&&e.docs?.tagName;return f("div",{},f("h1",{},e.name," ",e.type&&Yt(e.type)," ",St?f(Z,{font:"title-medium"},`<${St}>`):""),...tt(e),...He(e),...Et(e))}var Tn=class extends x{name;summary;uicdn;importmap=""};u(Tn,{tagName:"doc-page",init:[q("name"),q("summary"),q("uicdn")],augment:[e=>Ge(e).raf(()=>{if(e.replaceChildren(),!e.name||!e.summary)return;let t=e.name,n=e.summary.index.find(r=>r.name===t);n&&e.append(xa({summary:n,summaryJson:e.summary,uiCdn:e.uicdn??"",importmap:e.importmap}))})]});W.colors["outline-variant"]="rgb(219, 221, 225)";var Ao=class extends ut{summary;sheetstart=!0};u(Ao,{tagName:"doc-root",augment:[e=>{let t=at();fetch("summary.json").then(n=>n.json()).then(n=>t.next(n)).catch(n=>console.error(n)),e.append(f(Tn,{summary:t}))}]});var ko=class extends x{summary;selected};u(ko,{tagName:"doc-nav-list",init:[q("summary"),q("selected")],augment:[e=>ar({source:m(e,"summary").map(t=>t?.index),render:t=>f(ht,{$:n=>K(n).tap(()=>e.selected=t.value.name),size:-2},t.value.name,t.value.docs?.beta?f(gt,{size:-2},"beta"):void 0)})(e)]});var No=class extends vn{};u(No,{tagName:"doc-item"});W.globalCss+=`
doc-ct { gap:8px;margin-bottom:24px;white-space:wrap;font:var(--cxl-font-code);font-size:18px;display:flex;align-items:center; }
doc-card dl { display: flex; flex-direction: column; }
doc-card dt { border-inline-start: 2px solid var(--cxl-color-outline-variant); padding-inline-start: 16px; }
doc-card dd { border-inline-start: 2px solid var(--cxl-color-outline-variant); margin-inline-start: 0; padding-inline-start: 16px; margin-bottom:8px; }
:last-child{margin-bottom:0}
code{border-radius:4px;background-color:var(--cxl-color-surface-container);color:var(--cxl-color-on-surface);padding:2px 4px;${F("code")}}
`;var To=class extends x{};u(To,{tagName:"doc-app",augment:[d(`
:host {
	display:contents;
	--hljs-comment: rgba(51, 65, 85, 0.55);
	--hljs-structure: rgba(15, 23, 42, 0.78);
	--hljs-attr: rgb(18, 152, 186);
	--hljs-keyword: rgb(184, 90, 0);
	--hljs-fn-title: rgb(36, 143, 71);
	--hljs-type: rgb(67, 56, 202);
	--hljs-interface-title: rgb(190, 18, 60);
	--hljs-string: rgb(184, 90, 0);
	--hljs-number: rgba(15, 23, 42, 0.86);
	--hljs-meta: rgba(15, 23, 42, 0.65);
	  --3doc-chip-Property-bg: rgb(227, 247, 252);
  --3doc-chip-Property-fg: rgb(18, 152, 186);

  --3doc-chip-Method-bg: rgb(231, 249, 237);
  --3doc-chip-Method-fg: rgb(36, 143, 71);

  --3doc-chip-Function-bg: rgb(231, 249, 237);
  --3doc-chip-Function-fg: rgb(36, 143, 71);

  --3doc-chip-Event-bg: rgb(247, 242, 255);
  --3doc-chip-Event-fg: rgb(117, 55, 199);

  --3doc-chip-Class-bg: rgb(255, 244, 229);
  --3doc-chip-Class-fg: rgb(184, 90, 0);

  --3doc-chip-Namespace-bg: rgb(238, 242, 255);
  --3doc-chip-Namespace-fg: rgb(67, 56, 202);

  --3doc-chip-Interface-bg: rgb(255, 241, 242);
  --3doc-chip-Interface-fg: rgb(190, 18, 60);

  --3doc-chip-Enum-bg: rgb(240, 253, 250);
  --3doc-chip-Enum-fg: rgb(13, 148, 136);

  --3doc-chip-TypeAlias-bg: rgb(254, 249, 195);
  --3doc-chip-TypeAlias-fg: rgb(161, 98, 7);

  --3doc-chip-Attribute-bg: rgb(240, 249, 255);
  --3doc-chip-Attribute-fg: rgb(3, 105, 161);

  --3doc-chip-Component-bg: rgb(243, 232, 255);
  --3doc-chip-Component-fg: rgb(126, 34, 206);
    --3doc-chip-Constant-bg: rgb(241, 245, 249);
  --3doc-chip-Constant-fg: rgb(51, 65, 85);
}
c-application[theme=dark] {
	--hljs-comment: rgba(148, 163, 184, 0.58);
	--hljs-structure: rgba(226, 232, 240, 0.82);
	--hljs-attr: rgb(56, 189, 248);
	--hljs-keyword: rgb(251, 146, 60);
	--hljs-fn-title: rgb(74, 222, 128);
	--hljs-type: rgb(129, 140, 248);
	--hljs-interface-title: rgb(251, 113, 133);
	--hljs-string: rgb(251, 146, 60);
	--hljs-number: rgba(226, 232, 240, 0.88);
	--hljs-meta: rgba(226, 232, 240, 0.62);
	--3doc-chip-Property-bg: rgb(8, 47, 73);
  --3doc-chip-Property-fg: rgb(103, 232, 249);

  --3doc-chip-Method-bg: rgb(20, 83, 45);
  --3doc-chip-Method-fg: rgb(134, 239, 172);

  --3doc-chip-Function-bg: rgb(20, 83, 45);
  --3doc-chip-Function-fg: rgb(134, 239, 172);

  --3doc-chip-Event-bg: rgb(59, 7, 100);
  --3doc-chip-Event-fg: rgb(216, 180, 254);

  --3doc-chip-Class-bg: rgb(124, 45, 18);
  --3doc-chip-Class-fg: rgb(253, 186, 116);

  --3doc-chip-Namespace-bg: rgb(30, 27, 75);
  --3doc-chip-Namespace-fg: rgb(165, 180, 252);

  --3doc-chip-Interface-bg: rgb(76, 5, 25);
  --3doc-chip-Interface-fg: rgb(253, 164, 175);

  --3doc-chip-Enum-bg: rgb(19, 78, 74);
  --3doc-chip-Enum-fg: rgb(94, 234, 212);

  --3doc-chip-TypeAlias-bg: rgb(120, 53, 15);
  --3doc-chip-TypeAlias-fg: rgb(253, 230, 138);

  --3doc-chip-Attribute-bg: rgb(12, 74, 110);
  --3doc-chip-Attribute-fg: rgb(125, 211, 252);

  --3doc-chip-Component-bg: rgb(76, 29, 149);
  --3doc-chip-Component-fg: rgb(221, 214, 254);
    --3doc-chip-Constant-bg: rgb(30, 41, 59);
  --3doc-chip-Constant-fg: rgb(226, 232, 240);
}
#body{overflow:hidden; flex-grow: 1;}
#page { padding: 16px; flex-grow: 1; ${F("body-large")}; overflow-y: auto; }
#pagebody { margin: 0 auto; max-width:1200px; }
#navbar[responsiveon] {
	overflow:hidden; width:320px;
	padding: 8px; box-sizing: border-box;
	flex-grow: 1;
}
c-application { opacity: 0; }
c-application[ready] { opacity: 1; }
#version{margin-left:auto;}
#navbar-container {
	max-width:320px;
	width: 0;
	visibility: hidden;
	${X("surface-container-low")}}
${ee("large",`
#navbar-container { width: auto; visibility: visible; }
#page { padding: 48px 32px; }
`)}
		`),e=>{e.style.opacity="1";let t=f($t,{id:"navbar",responsive:"large"},f("slot",{name:"navbar"})),n=f(ut,void 0,f(Cn),f(se,{id:"body"},f(se,{vflex:!0,id:"navbar-container"},f(se,{pad:16,vpad:24,middle:!0},f(Z,{font:"title-medium"},CONFIG.packageName),f(Z,{id:"version",font:"title-small"},CONFIG.activeVersion)),f(Be),f(ze,{pad:16},f(bt)),t,f(Be),f(se,{pad:16},f(se,{grow:!0}),f(hn,{persistkey:"3doc.theme"}))),f("div",{id:"page"},f("div",{id:"pagebody"},f("slot")))));e.shadowRoot?.append(n),e.append(new En)}]});var Mo=class extends x{module;kind;tags};u(Mo,{tagName:"doc-page-header",init:[g("kind"),g("tags"),g("module")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
#title { margin-inline-end: auto; }
		`),e=>{e.shadowRoot?.append(f(Z,{font:"title-small"},m(e,"module")),f(se,{gap:16,middle:!0},f($e,{kind:m(e,"kind")},m(e,"kind")),f(Z,{font:"headline-small",id:"title"},f("slot")),f("slot",{name:"tags"})),f(Be))}]});var Ro=class extends ft{};u(Ro,{tagName:"doc-members",augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin: 32px 0; }
		`),e=>{e.variant="outlined",e.color="surface-container-low",e.pad=16,e.shadowRoot?.prepend(f(Z,{font:"title-small"},"Members"))}]});var _o=class extends x{href};u(_o,{tagName:"doc-member",init:[g("href")],augment:[d(`
		`),e=>{e.shadowRoot?.append(f(xt,{href:m(e,"href")},f(An,void 0,f("slot"))))}]});var Io=class extends x{kind};u(Io,{tagName:"doc-group",init:[g("kind")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 8px; }
c-flex { flex-wrap: wrap; }
		`),e=>{e.shadowRoot?.append(f(se,{gap:16,middle:!0},f($e,{kind:m(e,"kind")},m(e,"kind")),f(Z,{font:"title-small"},"")),f(se,{gap:8,middle:!0},f("slot")))}]});var ja=us(Fa(),1);var xr=ja.default;function za(e){let t=e.regex,n=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,o={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},c={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},i=e.inherit(c,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),s=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[o]},{begin:/'/,end:/'/,contains:[o]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[c,s,a,i,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[c,i,s,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},o,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[s]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(n,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}var br="[A-Za-z$_][0-9A-Za-z$_]*",Ba=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],$a=["true","false","null","undefined","NaN","Infinity"],Ha=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Ua=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Va=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Ga=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Ya=[].concat(Va,Ha,Ua);function Cu(e){let t=e.regex,n=(v,{after:I})=>{let H="</"+v[0].slice(1);return v.input.indexOf(H,I)!==-1},r=br,o={begin:"<>",end:"</>"},c=/<[A-Za-z0-9\\._:-]+\s*\/>/,i={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(v,I)=>{let H=v[0].length+v.index,oe=v.input[H];if(oe==="<"||oe===","){I.ignoreMatch();return}oe===">"&&(n(v,{after:H})||I.ignoreMatch());let ye,nt=v.input.substring(H);if(ye=nt.match(/^\s*=/)){I.ignoreMatch();return}if((ye=nt.match(/^\s+extends\s+/))&&ye.index===0){I.ignoreMatch();return}}},a={$pattern:br,keyword:Ba,literal:$a,built_in:Ya,"variable.language":Ga},s="[0-9](_?[0-9])*",l=`\\.(${s})`,b="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",k={className:"number",variants:[{begin:`(\\b(${b})((${l})|\\.)?|(${l}))[eE][+-]?(${s})\\b`},{begin:`\\b(${b})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},_={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},R={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"xml"}},$={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"css"}},B={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,_],subLanguage:"graphql"}},J={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,_]},xe={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},be=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,R,$,B,J,{match:/\$\d+/},k];_.contains=be.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(be)});let Oe=[].concat(xe,_.contains),He=Oe.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(Oe)}]),De={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:He},Gt={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,t.concat(r,"(",t.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},me={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Ha,...Ua]}},wt={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},tt={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[De],illegal:/%/},Yt={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function Et(v){return t.concat("(?!",v.join("|"),")")}let St={match:t.concat(/\b/,Et([...Va,"super","import"].map(v=>`${v}\\s*\\(`)),r,t.lookahead(/\s*\(/)),className:"title.function",relevance:0},E={begin:t.concat(/\./,t.lookahead(t.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},A={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},De]},p="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",y={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(p)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[De]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:He,CLASS_REFERENCE:me},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),wt,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,R,$,B,J,xe,{match:/\$\d+/},k,me,{scope:"attr",match:r+t.lookahead(":"),relevance:0},y,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[xe,e.REGEXP_MODE,{className:"function",begin:p,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:He}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:c},{begin:i.begin,"on:begin":i.isTrulyOpeningTag,end:i.end}],subLanguage:"xml",contains:[{begin:i.begin,end:i.end,skip:!0,contains:["self"]}]}]},tt,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[De,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},E,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[De]},St,Yt,Gt,A,{match:/\$[(.]/}]}}function Wa(e){let t=e.regex,n=Cu(e),r=br,o=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],c={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},i={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:o},contains:[n.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},s=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:br,keyword:Ba.concat(s),literal:$a,built_in:Ya.concat(o),"variable.language":Ga},b={className:"meta",begin:"@"+r},k=(B,J,Q)=>{let xe=B.contains.findIndex(be=>be.label===J);if(xe===-1)throw new Error("can not find mode to replace");B.contains.splice(xe,1,Q)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(b);let _=n.contains.find(B=>B.scope==="attr"),R=Object.assign({},_,{match:t.concat(r,t.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,_,R]),n.contains=n.contains.concat([b,c,i,R]),k(n,"shebang",e.SHEBANG()),k(n,"use_strict",a);let $=n.contains.find(B=>B.label==="func.def");return $.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}xr.registerLanguage("html",za);xr.registerLanguage("typescript",Wa);window.hljs=xr;export{So as BlogCode,rr as Body,Ao as ComponentList,wo as DocA,To as DocApp,Cn as DocAppbar,Eo as DocCard,Nn as DocDemo,Co as DocGrid,Io as DocGroup,No as DocItem,_o as DocMember,Ro as DocMembers,$t as Drawer,Be as Hr,we as Icon,sr as NavDropdown,lr as NavHeadline,ko as NavList,cr as NavTarget,Tn as Page,Mo as PageHeader,ur as UiPage};
