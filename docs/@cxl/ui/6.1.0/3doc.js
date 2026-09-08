var ts=Object.create;var Sr=Object.defineProperty;var ns=Object.getOwnPropertyDescriptor;var rs=Object.getOwnPropertyNames;var os=Object.getPrototypeOf,is=Object.prototype.hasOwnProperty;var as=(e,t)=>()=>(e&&(t=e(e=0)),t);var ss=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),cs=(e,t)=>{for(var n in t)Sr(e,n,{get:t[n],enumerable:!0})},ls=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of rs(t))!is.call(e,o)&&o!==n&&Sr(e,o,{get:()=>t[o],enumerable:!(r=ns(t,o))||r.enumerable});return e};var us=(e,t,n)=>(n=e!=null?ts(os(e)):{},ls(t||!e||!e.__esModule?Sr(n,"default",{value:e,enumerable:!0}):n,e));var ui={};cs(ui,{default:()=>Gs,theme:()=>li});var Vs,li,Gs,pi=as(()=>{"use strict";Vs={primary:"#8ECFF2","on-primary":"#003548","primary-container":"#004D67","on-primary-container":"#C1E8FF",secondary:"#B5C9D7","on-secondary":"#1F333D","secondary-container":"#364954","on-secondary-container":"#D1E6F3",tertiary:"#C9C2EA","on-tertiary":"#312C4C","tertiary-container":"#474364","on-tertiary-container":"#E5DEFF",error:"#FFB4AB","on-error":"#690005","error-container":"#93000A","on-error-container":"#FFDAD6",background:"#0F1417","on-background":"#DFE3E7",surface:"#0F1417","on-surface":"#DFE3E7","surface-variant":"#40484D","on-surface-variant":"#C0C7CD",outline:"#8A9297","outline-variant":"#40484D",scrim:"rgb(0 0 0 / 0.5)","inverse-surface":"#DFE3E7","on-inverse-surface":"#2C3134","inverse-primary":"#186584","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#0F1417","surface-bright":"#353A3D","surface-container-lowest":"#0A0F12","surface-container-low":"#171C1F","surface-container":"#1B2023","surface-container-high":"#262B2E","surface-container-highest":"#313539",warning:"#FFC107","on-warning":"#212121","warning-container":"#4E3400","on-warning-container":"#FFF3CF",success:"#81C784","on-success":"#000","success-container":"#2E7D32","on-success-container":"#fff"},li={name:"dark",colors:Vs},Gs=li});var Fa=ss((cb,Pa)=>{"use strict";function Ca(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{let n=e[t],r=typeof n;(r==="object"||r==="function")&&!Object.isFrozen(n)&&Ca(n)}),e}var gr=class{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function Aa(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function tt(e,...t){let n=Object.create(null);for(let r in e)n[r]=e[r];return t.forEach(function(r){for(let o in r)n[o]=r[o]}),n}var Ll="</span>",ba=e=>!!e.scope,Pl=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let n=e.split(".");return[`${t}${n.shift()}`,...n.map((r,o)=>`${r}${"_".repeat(o+1)}`)].join(" ")}return`${t}${e}`},Do=class{constructor(t,n){this.buffer="",this.classPrefix=n.classPrefix,t.walk(this)}addText(t){this.buffer+=Aa(t)}openNode(t){if(!ba(t))return;let n=Pl(t.scope,{prefix:this.classPrefix});this.span(n)}closeNode(t){ba(t)&&(this.buffer+=Ll)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}},ya=(e={})=>{let t={children:[]};return Object.assign(t,e),t},Lo=class e{constructor(){this.rootNode=ya(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){let n=ya({scope:t});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,n){return typeof n=="string"?t.addText(n):n.children&&(t.openNode(n),n.children.forEach(r=>this._walk(t,r)),t.closeNode(n)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(n=>typeof n=="string")?t.children=[t.children.join("")]:t.children.forEach(n=>{e._collapse(n)}))}},Po=class extends Lo{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,n){let r=t.root;n&&(r.scope=`language:${n}`),this.add(r)}toHTML(){return new Do(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function Rn(e){return e?typeof e=="string"?e:e.source:null}function ka(e){return wt("(?=",e,")")}function Fl(e){return wt("(?:",e,")*")}function zl(e){return wt("(?:",e,")?")}function wt(...e){return e.map(n=>Rn(n)).join("")}function jl(e){let t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function zo(...e){return"("+(jl(e).capture?"":"?:")+e.map(r=>Rn(r)).join("|")+")"}function Na(e){return new RegExp(e.toString()+"|").exec("").length-1}function Bl(e,t){let n=e&&e.exec(t);return n&&n.index===0}var $l=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function jo(e,{joinWith:t}){let n=0;return e.map(r=>{n+=1;let o=n,c=Rn(r),i="";for(;c.length>0;){let a=$l.exec(c);if(!a){i+=c;break}i+=c.substring(0,a.index),c=c.substring(a.index+a[0].length),a[0][0]==="\\"&&a[1]?i+="\\"+String(Number(a[1])+o):(i+=a[0],a[0]==="("&&n++)}return i}).map(r=>`(${r})`).join(t)}var Hl=/\b\B/,Ta="[a-zA-Z]\\w*",Bo="[a-zA-Z_]\\w*",Ma="\\b\\d+(\\.\\d+)?",Ra="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",_a="\\b(0b[01]+)",Ul="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",Vl=(e={})=>{let t=/^#![ ]*\//;return e.binary&&(e.begin=wt(t,/.*\b/,e.binary,/\b.*/)),tt({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(n,r)=>{n.index!==0&&r.ignoreMatch()}},e)},_n={begin:"\\\\[\\s\\S]",relevance:0},Gl={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[_n]},Yl={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[_n]},Wl={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},xr=function(e,t,n={}){let r=tt({scope:"comment",begin:e,end:t,contains:[]},n);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let o=zo("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:wt(/[ ]+/,"(",o,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},ql=xr("//","$"),Zl=xr("/\\*","\\*/"),Xl=xr("#","$"),Jl={scope:"number",begin:Ma,relevance:0},Ql={scope:"number",begin:Ra,relevance:0},Kl={scope:"number",begin:_a,relevance:0},eu={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[_n,{begin:/\[/,end:/\]/,relevance:0,contains:[_n]}]},tu={scope:"title",begin:Ta,relevance:0},nu={scope:"title",begin:Bo,relevance:0},ru={begin:"\\.\\s*"+Bo,relevance:0},ou=function(e){return Object.assign(e,{"on:begin":(t,n)=>{n.data._beginMatch=t[1]},"on:end":(t,n)=>{n.data._beginMatch!==t[1]&&n.ignoreMatch()}})},mr=Object.freeze({__proto__:null,APOS_STRING_MODE:Gl,BACKSLASH_ESCAPE:_n,BINARY_NUMBER_MODE:Kl,BINARY_NUMBER_RE:_a,COMMENT:xr,C_BLOCK_COMMENT_MODE:Zl,C_LINE_COMMENT_MODE:ql,C_NUMBER_MODE:Ql,C_NUMBER_RE:Ra,END_SAME_AS_BEGIN:ou,HASH_COMMENT_MODE:Xl,IDENT_RE:Ta,MATCH_NOTHING_RE:Hl,METHOD_GUARD:ru,NUMBER_MODE:Jl,NUMBER_RE:Ma,PHRASAL_WORDS_MODE:Wl,QUOTE_STRING_MODE:Yl,REGEXP_MODE:eu,RE_STARTERS_RE:Ul,SHEBANG:Vl,TITLE_MODE:tu,UNDERSCORE_IDENT_RE:Bo,UNDERSCORE_TITLE_MODE:nu});function iu(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function au(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function su(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=iu,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function cu(e,t){Array.isArray(e.illegal)&&(e.illegal=zo(...e.illegal))}function lu(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function uu(e,t){e.relevance===void 0&&(e.relevance=1)}var pu=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let n=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=n.keywords,e.begin=wt(n.beforeMatch,ka(n.begin)),e.starts={relevance:0,contains:[Object.assign(n,{endsParent:!0})]},e.relevance=0,delete n.beforeMatch},du=["of","and","for","in","not","or","if","then","parent","list","value"],fu="keyword";function Ia(e,t,n=fu){let r=Object.create(null);return typeof e=="string"?o(n,e.split(" ")):Array.isArray(e)?o(n,e):Object.keys(e).forEach(function(c){Object.assign(r,Ia(e[c],t,c))}),r;function o(c,i){t&&(i=i.map(a=>a.toLowerCase())),i.forEach(function(a){let s=a.split("|");r[s[0]]=[c,mu(s[0],s[1])]})}}function mu(e,t){return t?Number(t):gu(e)?0:1}function gu(e){return du.includes(e.toLowerCase())}var va={},vt=e=>{console.error(e)},wa=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Ut=(e,t)=>{va[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),va[`${e}/${t}`]=!0)},hr=new Error;function Oa(e,t,{key:n}){let r=0,o=e[n],c={},i={};for(let a=1;a<=t.length;a++)i[a+r]=o[a],c[a+r]=!0,r+=Na(t[a-1]);e[n]=i,e[n]._emit=c,e[n]._multi=!0}function hu(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw vt("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),hr;if(typeof e.beginScope!="object"||e.beginScope===null)throw vt("beginScope must be object"),hr;Oa(e,e.begin,{key:"beginScope"}),e.begin=jo(e.begin,{joinWith:""})}}function xu(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw vt("skip, excludeEnd, returnEnd not compatible with endScope: {}"),hr;if(typeof e.endScope!="object"||e.endScope===null)throw vt("endScope must be object"),hr;Oa(e,e.end,{key:"endScope"}),e.end=jo(e.end,{joinWith:""})}}function bu(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function yu(e){bu(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),hu(e),xu(e)}function vu(e){function t(i,a){return new RegExp(Rn(i),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(a?"g":""))}class n{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(a,s){s.position=this.position++,this.matchIndexes[this.matchAt]=s,this.regexes.push([s,a]),this.matchAt+=Na(a)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let a=this.regexes.map(s=>s[1]);this.matcherRe=t(jo(a,{joinWith:"|"}),!0),this.lastIndex=0}exec(a){this.matcherRe.lastIndex=this.lastIndex;let s=this.matcherRe.exec(a);if(!s)return null;let l=s.findIndex((A,M)=>M>0&&A!==void 0),b=this.matchIndexes[l];return s.splice(0,l),Object.assign(s,b)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(a){if(this.multiRegexes[a])return this.multiRegexes[a];let s=new n;return this.rules.slice(a).forEach(([l,b])=>s.addRule(l,b)),s.compile(),this.multiRegexes[a]=s,s}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(a,s){this.rules.push([a,s]),s.type==="begin"&&this.count++}exec(a){let s=this.getMatcher(this.regexIndex);s.lastIndex=this.lastIndex;let l=s.exec(a);if(this.resumingScanAtSamePosition()&&!(l&&l.index===this.lastIndex)){let b=this.getMatcher(0);b.lastIndex=this.lastIndex+1,l=b.exec(a)}return l&&(this.regexIndex+=l.position+1,this.regexIndex===this.count&&this.considerAll()),l}}function o(i){let a=new r;return i.contains.forEach(s=>a.addRule(s.begin,{rule:s,type:"begin"})),i.terminatorEnd&&a.addRule(i.terminatorEnd,{type:"end"}),i.illegal&&a.addRule(i.illegal,{type:"illegal"}),a}function c(i,a){let s=i;if(i.isCompiled)return s;[au,lu,yu,pu].forEach(b=>b(i,a)),e.compilerExtensions.forEach(b=>b(i,a)),i.__beforeBegin=null,[su,cu,uu].forEach(b=>b(i,a)),i.isCompiled=!0;let l=null;return typeof i.keywords=="object"&&i.keywords.$pattern&&(i.keywords=Object.assign({},i.keywords),l=i.keywords.$pattern,delete i.keywords.$pattern),l=l||/\w+/,i.keywords&&(i.keywords=Ia(i.keywords,e.case_insensitive)),s.keywordPatternRe=t(l,!0),a&&(i.begin||(i.begin=/\B|\b/),s.beginRe=t(s.begin),!i.end&&!i.endsWithParent&&(i.end=/\B|\b/),i.end&&(s.endRe=t(s.end)),s.terminatorEnd=Rn(s.end)||"",i.endsWithParent&&a.terminatorEnd&&(s.terminatorEnd+=(i.end?"|":"")+a.terminatorEnd)),i.illegal&&(s.illegalRe=t(i.illegal)),i.contains||(i.contains=[]),i.contains=[].concat(...i.contains.map(function(b){return wu(b==="self"?i:b)})),i.contains.forEach(function(b){c(b,s)}),i.starts&&c(i.starts,a),s.matcher=o(s),s}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=tt(e.classNameAliases||{}),c(e)}function Da(e){return e?e.endsWithParent||Da(e.starts):!1}function wu(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return tt(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Da(e)?tt(e,{starts:e.starts?tt(e.starts):null}):Object.isFrozen(e)?tt(e):e}var Eu="11.11.1",Fo=class extends Error{constructor(t,n){super(t),this.name="HTMLInjectionError",this.html=n}},Oo=Aa,Ea=tt,Sa=Symbol("nomatch"),Su=7,La=function(e){let t=Object.create(null),n=Object.create(null),r=[],o=!0,c="Could not find the language '{}', did you forget to load/include a language module?",i={disableAutodetect:!0,name:"Plain text",contains:[]},a={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Po};function s(p){return a.noHighlightRe.test(p)}function l(p){let y=p.className+" ";y+=p.parentNode?p.parentNode.className:"";let k=a.languageDetectRe.exec(y);if(k){let F=he(k[1]);return F||(wa(c.replace("{}",k[1])),wa("Falling back to no-highlight mode for this block.",p)),F?k[1]:"no-highlight"}return y.split(/\s+/).find(F=>s(F)||he(F))}function b(p,y,k){let F="",W="";typeof y=="object"?(F=p,k=y.ignoreIllegals,W=y.language):(Ut("10.7.0","highlight(lang, code, ...args) has been deprecated."),Ut("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),W=p,F=y),k===void 0&&(k=!0);let ie={code:F,language:W};C("before:highlight",ie);let ye=ie.result?ie.result:A(ie.language,ie.code,k);return ye.code=ie.code,C("after:highlight",ye),ye}function A(p,y,k,F){let W=Object.create(null);function ie(w,T){return w.keywords[T]}function ye(){if(!I.keywords){re.addText(Y);return}let w=0;I.keywordPatternRe.lastIndex=0;let T=I.keywordPatternRe.exec(Y),D="";for(;T;){D+=Y.substring(w,T.index);let U=Ae.case_insensitive?T[0].toLowerCase():T[0],ae=ie(I,U);if(ae){let[Pe,Ka]=ae;if(re.addText(D),D="",W[U]=(W[U]||0)+1,W[U]<=Su&&(On+=Ka),Pe.startsWith("_"))D+=T[0];else{let es=Ae.classNameAliases[Pe]||Pe;Ce(T[0],es)}}else D+=T[0];w=I.keywordPatternRe.lastIndex,T=I.keywordPatternRe.exec(Y)}D+=Y.substring(w),re.addText(D)}function ot(){if(Y==="")return;let w=null;if(typeof I.subLanguage=="string"){if(!t[I.subLanguage]){re.addText(Y);return}w=A(I.subLanguage,Y,!0,Go[I.subLanguage]),Go[I.subLanguage]=w._top}else w=P(Y,I.subLanguage.length?I.subLanguage:null);I.relevance>0&&(On+=w.relevance),re.__addSublanguage(w._emitter,w.language)}function xe(){I.subLanguage!=null?ot():ye(),Y=""}function Ce(w,T){w!==""&&(re.startScope(T),re.addText(w),re.endScope())}function $o(w,T){let D=1,U=T.length-1;for(;D<=U;){if(!w._emit[D]){D++;continue}let ae=Ae.classNameAliases[w[D]]||w[D],Pe=T[D];ae?Ce(Pe,ae):(Y=Pe,ye(),Y=""),D++}}function Ho(w,T){return w.scope&&typeof w.scope=="string"&&re.openNode(Ae.classNameAliases[w.scope]||w.scope),w.beginScope&&(w.beginScope._wrap?(Ce(Y,Ae.classNameAliases[w.beginScope._wrap]||w.beginScope._wrap),Y=""):w.beginScope._multi&&($o(w.beginScope,T),Y="")),I=Object.create(w,{parent:{value:I}}),I}function Uo(w,T,D){let U=Bl(w.endRe,D);if(U){if(w["on:end"]){let ae=new gr(w);w["on:end"](T,ae),ae.isMatchIgnored&&(U=!1)}if(U){for(;w.endsParent&&w.parent;)w=w.parent;return w}}if(w.endsWithParent)return Uo(w.parent,T,D)}function qa(w){return I.matcher.regexIndex===0?(Y+=w[0],1):(Er=!0,0)}function Za(w){let T=w[0],D=w.rule,U=new gr(D),ae=[D.__beforeBegin,D["on:begin"]];for(let Pe of ae)if(Pe&&(Pe(w,U),U.isMatchIgnored))return qa(T);return D.skip?Y+=T:(D.excludeBegin&&(Y+=T),xe(),!D.returnBegin&&!D.excludeBegin&&(Y=T)),Ho(D,w),D.returnBegin?0:T.length}function Xa(w){let T=w[0],D=y.substring(w.index),U=Uo(I,w,D);if(!U)return Sa;let ae=I;I.endScope&&I.endScope._wrap?(xe(),Ce(T,I.endScope._wrap)):I.endScope&&I.endScope._multi?(xe(),$o(I.endScope,w)):ae.skip?Y+=T:(ae.returnEnd||ae.excludeEnd||(Y+=T),xe(),ae.excludeEnd&&(Y=T));do I.scope&&re.closeNode(),!I.skip&&!I.subLanguage&&(On+=I.relevance),I=I.parent;while(I!==U.parent);return U.starts&&Ho(U.starts,w),ae.returnEnd?0:T.length}function Ja(){let w=[];for(let T=I;T!==Ae;T=T.parent)T.scope&&w.unshift(T.scope);w.forEach(T=>re.openNode(T))}let In={};function Vo(w,T){let D=T&&T[0];if(Y+=w,D==null)return xe(),0;if(In.type==="begin"&&T.type==="end"&&In.index===T.index&&D===""){if(Y+=y.slice(T.index,T.index+1),!o){let U=new Error(`0 width match regex (${p})`);throw U.languageName=p,U.badRule=In.rule,U}return 1}if(In=T,T.type==="begin")return Za(T);if(T.type==="illegal"&&!k){let U=new Error('Illegal lexeme "'+D+'" for mode "'+(I.scope||"<unnamed>")+'"');throw U.mode=I,U}else if(T.type==="end"){let U=Xa(T);if(U!==Sa)return U}if(T.type==="illegal"&&D==="")return Y+=`
`,1;if(wr>1e5&&wr>T.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Y+=D,D.length}let Ae=he(p);if(!Ae)throw vt(c.replace("{}",p)),new Error('Unknown language: "'+p+'"');let Qa=vu(Ae),vr="",I=F||Qa,Go={},re=new a.__emitter(a);Ja();let Y="",On=0,it=0,wr=0,Er=!1;try{if(Ae.__emitTokens)Ae.__emitTokens(y,re);else{for(I.matcher.considerAll();;){wr++,Er?Er=!1:I.matcher.considerAll(),I.matcher.lastIndex=it;let w=I.matcher.exec(y);if(!w)break;let T=y.substring(it,w.index),D=Vo(T,w);it=w.index+D}Vo(y.substring(it))}return re.finalize(),vr=re.toHTML(),{language:p,value:vr,relevance:On,illegal:!1,_emitter:re,_top:I}}catch(w){if(w.message&&w.message.includes("Illegal"))return{language:p,value:Oo(y),illegal:!0,relevance:0,_illegalBy:{message:w.message,index:it,context:y.slice(it-100,it+100),mode:w.mode,resultSoFar:vr},_emitter:re};if(o)return{language:p,value:Oo(y),illegal:!1,relevance:0,errorRaised:w,_emitter:re,_top:I};throw w}}function M(p){let y={value:Oo(p),illegal:!1,relevance:0,_top:i,_emitter:new a.__emitter(a)};return y._emitter.addText(p),y}function P(p,y){y=y||a.languages||Object.keys(t);let k=M(p),F=y.filter(he).filter(Et).map(xe=>A(xe,p,!1));F.unshift(k);let W=F.sort((xe,Ce)=>{if(xe.relevance!==Ce.relevance)return Ce.relevance-xe.relevance;if(xe.language&&Ce.language){if(he(xe.language).supersetOf===Ce.language)return 1;if(he(Ce.language).supersetOf===xe.language)return-1}return 0}),[ie,ye]=W,ot=ie;return ot.secondBest=ye,ot}function H(p,y,k){let F=y&&n[y]||k;p.classList.add("hljs"),p.classList.add(`language-${F}`)}function $(p){let y=null,k=l(p);if(s(k))return;if(C("before:highlightElement",{el:p,language:k}),p.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",p);return}if(p.children.length>0&&(a.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(p)),a.throwUnescapedHTML))throw new Fo("One of your code blocks includes unescaped HTML.",p.innerHTML);y=p;let F=y.textContent,W=k?b(F,{language:k,ignoreIllegals:!0}):P(F);p.innerHTML=W.value,p.dataset.highlighted="yes",H(p,k,W.language),p.result={language:W.language,re:W.relevance,relevance:W.relevance},W.secondBest&&(p.secondBest={language:W.secondBest.language,relevance:W.secondBest.relevance}),C("after:highlightElement",{el:p,result:W,text:F})}function K(p){a=Ea(a,p)}let X=()=>{Se(),Ut("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function ge(){Se(),Ut("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let De=!1;function Se(){function p(){Se()}if(document.readyState==="loading"){De||window.addEventListener("DOMContentLoaded",p,!1),De=!0;return}document.querySelectorAll(a.cssSelector).forEach($)}function nt(p,y){let k=null;try{k=y(e)}catch(F){if(vt("Language definition for '{}' could not be registered.".replace("{}",p)),o)vt(F);else throw F;k=i}k.name||(k.name=p),t[p]=k,k.rawDefinition=y.bind(null,e),k.aliases&&rt(k.aliases,{languageName:p})}function Le(p){delete t[p];for(let y of Object.keys(n))n[y]===p&&delete n[y]}function Gt(){return Object.keys(t)}function he(p){return p=(p||"").toLowerCase(),t[p]||t[n[p]]}function rt(p,{languageName:y}){typeof p=="string"&&(p=[p]),p.forEach(k=>{n[k.toLowerCase()]=y})}function Et(p){let y=he(p);return y&&!y.disableAutodetect}function St(p){p["before:highlightBlock"]&&!p["before:highlightElement"]&&(p["before:highlightElement"]=y=>{p["before:highlightBlock"](Object.assign({block:y.el},y))}),p["after:highlightBlock"]&&!p["after:highlightElement"]&&(p["after:highlightElement"]=y=>{p["after:highlightBlock"](Object.assign({block:y.el},y))})}function Ct(p){St(p),r.push(p)}function E(p){let y=r.indexOf(p);y!==-1&&r.splice(y,1)}function C(p,y){let k=p;r.forEach(function(F){F[k]&&F[k](y)})}function z(p){return Ut("10.7.0","highlightBlock will be removed entirely in v12.0"),Ut("10.7.0","Please use highlightElement now."),$(p)}Object.assign(e,{highlight:b,highlightAuto:P,highlightAll:Se,highlightElement:$,highlightBlock:z,configure:K,initHighlighting:X,initHighlightingOnLoad:ge,registerLanguage:nt,unregisterLanguage:Le,listLanguages:Gt,getLanguage:he,registerAliases:rt,autoDetection:Et,inherit:Ea,addPlugin:Ct,removePlugin:E}),e.debugMode=function(){o=!1},e.safeMode=function(){o=!0},e.versionString=Eu,e.regex={concat:wt,lookahead:ka,either:zo,optional:zl,anyNumberOfTimes:Fl};for(let p in mr)typeof mr[p]=="object"&&Ca(mr[p]);return Object.assign(e,mr),e},Vt=La({});Vt.newInstance=()=>La({});Pa.exports=Vt;Vt.HighlightJS=Vt;Vt.default=Vt});var Ve={},ku=Symbol("terminator");function ps(e,t){let n=!1,r={error:o,unsubscribe:c,get closed(){return n},signal:new Ne,next(i){if(!n)try{e.next?.(i)}catch(a){o(a)}},complete(){if(!n)try{e.complete?.()}finally{c()}}};e.signal?.subscribe(c);function o(i){if(n)throw i;if(!e.error)throw c(),i;try{e.error(i)}finally{c()}}function c(){n||(n=!0,r.signal.next())}try{t?.(r)}catch(i){o(i)}return r}var O=class{__subscribe;constructor(t){this.__subscribe=t}then(t,n){return fs(this).then(t,n)}pipe(...t){return t.reduce((n,r)=>r(n),this)}subscribe(t){return ps(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},ke=class extends O{closed=!1;signal=new Ne;observers=new Set;constructor(){super(t=>this.onSubscribe(t))}next(t){if(!this.closed)for(let n of Array.from(this.observers))n.closed||n.next(t)}error(t){if(!this.closed){this.closed=!0;let n=!1,r;for(let o of Array.from(this.observers))try{o.error(t)}catch(c){n=!0,r=c}if(n)throw r}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Ne=class extends O{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},Dn=class extends ke{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)super.next(this.queue.shift());this.emitting=!1}}},Yt=class extends ke{currentValue;constructor(t){super(),this.currentValue=t}get value(){return this.currentValue}next(t){this.currentValue=t,super.next(t)}onSubscribe(t){let n=super.onSubscribe(t);return this.closed||t.next(this.currentValue),n}},Cr=class extends ke{bufferSize;buffer=[];hasError=!1;lastError;constructor(t=1/0){super(),this.bufferSize=t}error(t){this.hasError=!0,this.lastError=t,super.error(t)}next(t){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(t),super.next(t)}onSubscribe(t){this.observers.add(t),this.buffer.forEach(n=>t.next(n)),this.hasError?t.error(this.lastError):this.closed&&t.complete(),t.signal.subscribe(()=>this.observers.delete(t))}},At=class extends ke{$value=Ve;get hasValue(){return this.$value!==Ve}get value(){if(this.$value===Ve)throw new Error("Reference not initialized");return this.$value}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==Ve&&t.next(this.$value),super.onSubscribe(t)}},Ar=class extends Error{message="No elements in sequence"};function Fe(...e){return new O(t=>{let n=0,r;function o(){let c=e[n++];c&&!t.closed?(r?.next(),c.subscribe({next:t.next,error:t.error,complete:o,signal:r=new Ne})):t.complete()}t.signal.subscribe(()=>r?.next()),o()})}function ne(e){return new O(t=>{e().subscribe(t)})}function Wo(e){return new O(t=>{e.then(n=>{t.closed||t.next(n),t.complete()}).catch(n=>t.error(n))})}function Wt(e){return ne(()=>Wo(e()))}function qo(e){return new O(t=>{for(let n of e)t.closed||t.next(n);t.complete()})}function Ge(e){return e instanceof O?e:e instanceof Promise?Wo(e):qo(e)}function B(...e){return qo(e)}function ds(e){return new Promise((t,n)=>{let r=Ve;e.subscribe({next:o=>r=o,error:o=>n(o),complete:()=>t(r)})})}function fs(e){return ds(e).then(t=>t===Ve?void 0:t)}function at(e,t){return Te(n=>({next:e(n),unsubscribe:t}))}function Te(e){return t=>new O(n=>{let r=e(n,t);r.unsubscribe&&n.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=n.error),r.complete||(r.complete=n.complete),r.signal=n.signal,t.subscribe(r)})}function kr(e){return at(t=>n=>t.next(e(n)))}function ms(e){let t=Ve;return at(n=>r=>{let o=e(r);o!==t&&(t=o,n.next(o))})}function gs(e,t){return Te(n=>{let r=t,o=0;return{next(c){r=e(r,c,o++)},complete(){n.next(r),n.complete()}}})}function hs(e){return Te(t=>{let n=!0,r;return{next(o){n&&(n=!1,t.next(o),r=setTimeout(()=>n=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function st(e){return new O(t=>{let n=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(n))})}function xs(e,t=st){return Zo(n=>t(e).map(()=>n))}function Zo(e){return t=>oe(n=>{let r=!1,o=!1,c,i=()=>{c?.next(),r=!1,o&&n.complete()},a=new Ne;n.signal.subscribe(()=>{i(),a.next()}),t.subscribe({next(s){i(),c=new Ne,r=!0,Ge(e(s)).subscribe({next:n.next,error:n.error,complete:i,signal:c})},error:n.error,complete(){o=!0,r||n.complete()},signal:a})})}function bs(e){return t=>oe(n=>{let r=n.signal,o=0,c=0,i=!1;t.subscribe({next:a=>{o++,Ge(e(a)).subscribe({next:n.next,error:n.error,complete:()=>{c++,i&&c===o&&n.complete()},signal:r})},error:n.error,complete(){i=!0,c===o&&n.complete()},signal:r})})}function ys(e){return Te(t=>{let n=new Ne,r,o,c=[],i=!1,a=!1,s=()=>{r?.next(),r=void 0,o=void 0,a=!1,c.length&&!t.closed?l(c.shift()):i&&t.complete()},l=b=>{a=!0,r=new Ne,o=Ge(e(b)).subscribe({next:t.next,error:t.error,complete:s,signal:r})};return t.signal.subscribe(()=>{r?.next(),n.next()}),{next(b){a?c.push(b):l(b)},error:t.error,complete(){i=!0,!a&&c.length===0&&t.complete()},signal:n,unsubscribe:()=>o?.unsubscribe()}})}function vs(e){return Te(t=>{let n=!0;return{next(r){n&&(n=!1,Ge(e(r)).subscribe({next:t.next,error:t.error,complete:()=>n=!0,signal:t.signal}))}}})}function Ln(e){return at(t=>n=>{e(n)&&t.next(n)})}function ws(e){return at(t=>n=>{e-- >0&&!t.closed&&t.next(n),(e<=0||t.closed)&&t.complete()})}function Es(e){return at(t=>n=>{!t.closed&&e(n)?t.next(n):t.complete()})}function Ss(){let e=!1;return Te(t=>({next(n){e||(e=!0,t.next(n),t.complete())},complete(){t.closed||t.error(new Ar)}}))}function qt(e){return at(t=>n=>{e(n),t.next(n)})}function Cs(e){return Te((t,n)=>{let r,o={next:t.next,error(c){try{if(t.closed)return;let i=e(c,n);r?.next(),r=new Ne,i.subscribe({...o,signal:r})}catch(i){t.error(i)}},unsubscribe:()=>r?.next()};return o})}function As(){return at(e=>{let t=Ve;return n=>{n!==t&&(t=n,e.next(n))}})}function ks(){return e=>{let t=new Cr(1),n=!1;return oe(r=>{t.subscribe(r),n||(n=!0,e.subscribe(t))})}}function Ns(){return e=>{let t,n=0;function r(){--n===0&&t.signal.next()}return oe(o=>{o.signal.subscribe(r),n++===0?(t=ct(),t.subscribe(o),e.subscribe(t)):t.subscribe(o)})}}function Ts(){return e=>{let t=new ke,n,r,o=!1,c=!1;return oe(i=>{c?(i.next(r),i.complete()):t.subscribe(i),n??=e.subscribe({next:a=>{o=!0,r=a},error:i.error,complete(){c=!0,o&&t.next(r),t.complete()},signal:i.signal})})}}function h(...e){return e.length===1?e[0]:new O(t=>{let n=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){n--===1&&t.complete()},signal:t.signal})})}function le(...e){return e.length===0?R:new O(t=>{let n=e.length,r=n,o=0,c=!1,i=new Array(n),a=new Array(n);e.forEach((s,l)=>s.subscribe({next(b){a[l]=b,i[l]||(i[l]=!0,++o>=r&&(c=!0)),c&&t.next(a.slice(0))},error:t.error,complete(){--n<=0&&t.complete()},signal:t.signal}))})}function Ms(e){return Te(t=>({next:t.next,unsubscribe:e}))}function Rs(){return Ln(()=>!1)}var R=new O(e=>e.complete());function ue(e){return new Yt(e)}function oe(e){return new O(e)}function Xo(){return new ke}function ct(){return new At}var Yo={catchError:Cs,concatMap:ys,debounceTime:xs,distinctUntilChanged:As,exhaustMap:vs,filter:Ln,finalize:Ms,first:Ss,ignoreElements:Rs,map:kr,mergeMap:bs,publishLast:Ts,reduce:gs,select:ms,share:Ns,shareLatest:ks,switchMap:Zo,take:ws,takeWhile:Es,tap:qt,throttleTime:hs};for(let e in Yo)O.prototype[e]=function(...t){return this.pipe(Yo[e](...t))};function S(e,t,n){return new O(r=>{let o=r.next.bind(r);e.addEventListener(t,o,n),r.signal.subscribe(()=>e.removeEventListener(t,o,n))})}function Pn(e){return Nr(e,{childList:!0})}function Fn(e,t){return Nr(e,{attributes:!0,attributeFilter:t})}function Nr(e,t={attributes:!0,childList:!0}){return new O(n=>{let r=new MutationObserver(o=>o.forEach(c=>{for(let i of c.addedNodes)n.next({type:"added",target:e,value:i});for(let i of c.removedNodes)n.next({type:"removed",target:e,value:i});c.type==="characterData"?n.next({type:"characterData",target:e}):c.attributeName&&n.next({type:"attribute",target:e,value:c.attributeName})}));r.observe(e,t),n.signal.subscribe(()=>r.disconnect())})}function zn(e){return S(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function ee(e){return S(e,"click")}function jn(e,t){return new O(n=>{let r=new IntersectionObserver(o=>{for(let c of o)n.next(c)},t);r.observe(e),n.signal.subscribe(()=>r.disconnect())})}function Jo(e){return jn(e).map(t=>t.isIntersecting)}function Me(e){return jn(e).filter(t=>t.isIntersecting).first()}function _s(e){let t;return function(...n){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,n),t=0})}}function Qo(e){return Te(t=>{let n=_s(o=>{t.closed||(e&&e(o),t.next(o),r&&t.complete())}),r=!1;return{next:n,complete:()=>r=!0}})}function Ko(){return ne(()=>document.readyState!=="loading"?B(!0):S(window,"DOMContentLoaded").first().map(()=>!0))}function kt(e,t,n){let r=new CustomEvent(t,n);e.dispatchEvent(r)}function Bn(e,t){let n;return h(ne(()=>(n=e.childNodes,n?B(void 0):R)),ze().switchMap(()=>e.childNodes!==n?B(void 0):R),Nr(e,{childList:!0,...t}).map(()=>{}))}function ze(){return ne(()=>document.readyState==="complete"?B(!0):S(window,"load").first().map(()=>!0))}function $n(...e){return new O(t=>{let n=new ResizeObserver(r=>r.forEach(o=>t.next(o)));for(let r of e)n.observe(r);t.signal.subscribe(()=>n.disconnect())})}function Tr(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function Mr(e,t,n){return r=>Fe(B(e?r.matches(e):!1),S(r,t).switchMap(()=>h(B(!0),S(r,n).map(()=>e?r.matches(e):!1))))}var Mu=Mr("","animationstart","animationend"),Rr=Mr("","mouseenter","mouseleave"),Is=Mr(":focus,:focus-within","focusin","focusout"),_r=e=>le(Rr(e),Is(e)).map(([t,n])=>t||n);function ei(e,t,n){return t=t?.toLowerCase(),S(e,"keydown",n).filter(r=>!t||r.key?.toLowerCase()===t)}function Zt(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function Ir(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}var Os=qt(e=>console.trace(e));O.prototype.log=function(){return this.pipe(Os)};O.prototype.raf=function(e){return this.pipe(Qo(e))};var se=Symbol("bindings"),Ds={},Nt=Symbol("augments"),lt=Symbol("parser"),Dr=class{bindings;messageHandlers;internals;attributes$=new Dn;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,n){let r=!1;if(this.messageHandlers)for(let o of this.messageHandlers)o.type===t&&(o.next(n),r||=o.stopPropagation);return r}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let n of this.bindings)t.push(n.subscribe());if(this.prebind)for(let n of this.prebind)t.push(n.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},Un=Symbol("css"),x=class extends HTMLElement{static observedAttributes;static[Nt];static[lt];[se]=new Dr;[Un];connectedCallback(){this[se].wasInitialized=!0,this[se].wasConnected||this.constructor[Nt]?.forEach(t=>t(this)),this[se].connect()}disconnectedCallback(){this[se].disconnect()}attributeChangedCallback(t,n,r){let o=this.constructor[lt]?.[t]??Ls;n!==r&&(this[t]=o(r,this[t]))}};function Ls(e,t){let n=t===!1||t===!0;return e===""?n?!0:"":e===null?n?!1:void 0:e}function ti(e,t){e.hasOwnProperty(Nt)||(e[Nt]=e[Nt]?.slice(0)??[]),e[Nt]?.push(t)}var Ps={mode:"open"};function j(e){return e.shadowRoot??e.attachShadow(Ps)}function ni(e,t){t instanceof Node?j(e).appendChild(t):e[se].add(t)}function Fs(e,t){t.length&&ti(e,n=>{for(let r of t){let o=r.call(e,n);o&&o!==n&&ni(n,o)}})}function zs(e,t){Ds[e]=t,customElements.define(e,t)}function Re(e){return e[se].internals??=e.attachInternals()}function u(e,{init:t,augment:n,tagName:r}){if(t)for(let o of t)o(e);n&&Fs(e,n),r&&zs(r,e)}function Ye(e){return Fe(B(e),e[se].attributes$.map(()=>e))}function G(e,t){return e[se].attributes$.pipe(Ln(n=>n.attribute===t),kr(()=>e[t]))}function m(e,t){return h(G(e,t),ne(()=>B(e[t])))}function js(e){let t=e.observedAttributes;return t&&!e.hasOwnProperty("observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function Xt(e,t,n){return n===!1||n===null||n===void 0?n=null:n===!0&&(n=""),n===null?e.removeAttribute(t):e.setAttribute(t,String(n)),n}function Bs(e,t,n){e.hasOwnProperty(lt)||(e[lt]={...e[lt]}),e[lt]&&(e[lt][t]=n)}function g(e,t){return n=>{t?.observe!==!1&&js(n).push(e),t?.parse&&Bs(n,e,t.parse);let r=`$$${e}`,o=n.prototype,c=Object.getOwnPropertyDescriptor(o,e);c&&Object.defineProperty(o,r,c);let i=t?.persist,a={enumerable:!0,configurable:!1,get(){return this[r]},set(s){this[r]!==s?(this[r]=s,i?.(this,e,s),this[se].attributes$.next({target:this,attribute:e,value:s})):c?.set&&(i?.(this,e,s),this[r]=s)}};ti(n,s=>{if(c||(s[r]=s[e]),Object.defineProperty(s,e,a),i?.(s,e,s[e]),t?.render){let l=t.render(s);l&&ni(s,l)}})}}function v(e){return g(e,{persist:Xt,observe:!0})}function Vn(e){let t=`on${e}`;return g(t,{render(n){return m(n,t).switchMap(r=>r?new O(o=>{let c=i=>{i.target===n&&n[t]?.call(n,i)};n.addEventListener(e,c),o.signal.subscribe(()=>n.removeEventListener(e,c))}):R)},parse(n){return n?new Function("event",n):void 0}})}function Z(e){return g(e,{observe:!1})}function _(){return document.createElement("slot")}function ri(e){return t=>{let[n,r]=e();return t[se].add(n),r}}function $s(e,t){let n=document.createTextNode("");return e[se].add(t.tap(r=>n.textContent=r)),n}var Or=document.createDocumentFragment();function Hn(e,t,n=e){if(t!=null)if(Array.isArray(t)){for(let r of t)Hn(e,r,Or);n!==Or&&n.appendChild(Or)}else e instanceof x&&t instanceof O?n.appendChild($s(e,t)):t instanceof Node?n.appendChild(t):e instanceof x&&typeof t=="function"?Hn(e,t(e),n):n.appendChild(document.createTextNode(t))}function oi(e,t){for(let n in t){let r=t[n];e instanceof x?r instanceof O?e[se].add(n==="$"?r:r.tap(o=>e[n]=o)):n==="$"&&typeof r=="function"?e[se].add(r(e)):e[n]=r:e[n]=r}}function Hs(e,t){return e.constructor.observedAttributes?.includes(t)}function ii(e,t){let n=e instanceof x&&Hs(e,t)?G(e,t):Fn(e,[t]).map(()=>e[t]);return h(n,ne(()=>B(e[t])))}function Gn(e,t,n){return g(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let o=r===null?void 0:Number(r);return t!==void 0&&(o===void 0||o<t||isNaN(o))&&(o=t),n!==void 0&&o!==void 0&&o>n&&(o=n),o}})}function pe(e,t,n){for(let r=e.parentElement;r;r=r.parentElement)if(r[se]?.message(t,n))return}function de(e,t,n=!0){let r,o=0,c=new ke,i={type:t,next(a){o?c.next(a):(r??=[]).push(a)},stopPropagation:n};return e[se].addMessageHandler(i),new O(a=>{o===0&&r?.length&&(r.forEach(l=>a.next(l)),r.length=0),o++;let s=c.subscribe(a);a.signal.subscribe(()=>{o--,s.unsubscribe()})})}function N(e,t,...n){let r=typeof e=="string"?document.createElement(e):new e;return t&&oi(r,t),n.length&&Hn(r,n),r}function f(e,t,...n){if(e!==f&&typeof e=="function"&&!(e.prototype instanceof x))return n.length&&((t??={}).children=n),e(t);let r=e===f?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&oi(r,t),n.length&&Hn(r,n),r}function Us(e,t){return n=>new O(()=>{n.hasAttribute(e)||n.setAttribute(e,t)})}function ai(e,t){return qt(n=>e.setAttribute("aria-"+t,n===!0?"true":n===!1?"false":n.toString()))}function V(e){return Us("role",e)}var si=0;function je(e){return e.id||=`cxl__${si++}`}function ci(e){return ii(e,"id").map(t=>(t||(e.id=`cxl__${si++}`),e.id))}var _e=d(":host{display:contents}"),Ys=[-2,-1,0,1,2,3,4,5],hi=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],Tt=ct(),Yn=ue(""),ve=d(`:host([disabled]) {
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
	${L("body-medium")}
`,Ws=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),bi={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function yi(e=""){return`
:host ${e} {
	${Q("surface-container")}
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
		`}function vi(e=bi){return Object.entries(e).map(([t,n])=>`--cxl-color--${t}:${n};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var q={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:bi,imports:Ws?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
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
	`,css:""};function Jt(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}var Mt=d(Jt()),wi={"./theme-dark.js":()=>Promise.resolve().then(()=>(pi(),ui))},ut=[0,4,8,"12",16,24,32,48,64],We,di,qs;function te(e,t){return e==="xsmall"?`@media(max-width:${q.breakpoints.small}px){${t}}`:`@media(min-width:${q.breakpoints[e]}px){${t}}`}function Rt(e){return h(Wt(async()=>e.getBoundingClientRect().width),$n(e).map(t=>t.contentRect.width)).map(t=>{let n=q.breakpoints,r="xsmall";for(let o in n){if(n[o]>t)return r;r=o}return r}).distinctUntilChanged()}function Zs(e=""){return Object.entries(Ni).map(([t,n])=>`:host([color=${t}]) ${e}{ ${n} }`).join("")}function _t(e,t,n=""){return Ei(e,`
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
	`)}function Ei(e,t){let n=d(t);return g(e,{persist:Xt,render:r=>n(r)})}function fe(e,t){return Ei(e,Ys.map(n=>{let r=t(n);return n===0?`:host{--cxl-size:${n}}:host ${r}`:`:host([size="${n}"]){--cxl-size:${n}}:host([size="${n}"]) ${r}`}).join(""))}function Si(){let e=We?document.adoptedStyleSheets.indexOf(We):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Xs(e){We&&Si();let t=e.globalCss??"";e.colors&&(t+=`:root{${vi(e.colors)}}`),t?(We=qe(t),document.adoptedStyleSheets.push(We)):We=void 0,Tt.next({theme:e,stylesheet:We,css:t}),Yn.next(e.name)}var fi="";function Ci(e){e?e!==fi&&(typeof e=="string"?import(e):e()).then(t=>Xs(t.default),t=>console.error(t)):We&&(Si(),Tt.next(void 0),Yn.next("")),fi=e}function Js(e){let t;return Tt.tap(n=>{let r=n?.theme.override?.[e.tagName];r?t?t.replace(r).catch(o=>console.error(o)):e.shadowRoot?.adoptedStyleSheets.push(t??=qe(r)):t&&t.replaceSync("")})}function qe(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function Ai(e,t=""){let n=qe(t);return j(e).adoptedStyleSheets.push(n),n}function d(e){let t;return n=>{let r=j(n);if(r.adoptedStyleSheets.push(t??=qe(e)),!n[Un])return q.css&&r.adoptedStyleSheets.unshift(qs??=qe(q.css)),n[Un]=!0,Js(n)}}var ki=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Bu=[...ki,"inherit"];function Lr(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function Q(e){return`${Lr(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}var Ni=ki.reduce((e,t)=>(e[t]=`
${Lr(t)}
${t==="inverse-surface"?Lr("inverse-primary","primary"):""}
`,e),{inherit:"color:inherit;background-color:inherit;"});function It(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function L(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}var Qs=requestAnimationFrame(()=>oc()),Ks={},mi=document.createElement("template"),gi={};function ec(e){return function(t){let n=e(t),r=gi[n];if(r)return r.cloneNode(!0);let o=document.createElementNS("http://www.w3.org/2000/svg","svg"),c=()=>(o.dispatchEvent(new ErrorEvent("error")),"");return fetch(n).then(i=>i.ok?i.text():c(),c).then(i=>{if(!i)return;mi.innerHTML=i;let a=mi.content.children[0];if(!a)return;let s=a.getAttribute("viewBox");s?o.setAttribute("viewBox",s):a.hasAttribute("width")&&a.hasAttribute("height")&&o.setAttribute("viewBox",`0 0 ${a.getAttribute("width")} ${a.getAttribute("height")}`);for(let l of a.childNodes)o.append(l);gi[t.name]=o}).catch(i=>console.error(i)),o.setAttribute("fill","currentColor"),o}}var tc=ec(({name:e,width:t,fill:n})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${n?"fill1_":""}${t}px.svg`)),nc=tc;function Ti(e,t={}){let{width:n,height:r}=t;n===void 0&&r===void 0&&(n=r=24);let o=Ks[e]?.icon()??nc({name:e,width:n,fill:t.fill});return t.className&&o.setAttribute("class",t.className),n&&(o.setAttribute("width",`${n}`),r===void 0&&o.setAttribute("height",`${n}`)),r&&(o.setAttribute("height",`${r}`),n===void 0&&o.setAttribute("width",`${r}`)),t.alt&&o.setAttribute("alt",t.alt),o}var Pr,rc=new Promise(e=>{Pr=()=>{Tt.next(void 0),e()}});function oc(e){cancelAnimationFrame(Qs),di||(e&&(e.colors&&(q.colors=e.colors),e.globalCss&&(q.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(di=qe(`html{${vi(q.colors)}}${q.globalCss}`)),q.imports?Promise.allSettled(q.imports.map(t=>{let n=document.createElement("link");return n.rel="stylesheet",n.href=t,document.head.append(n),new Promise((r,o)=>(n.onload=r,n.onerror=o))})).then(Pr,t=>console.error(t)):Pr())}function Wn(){return Wt(async()=>{await rc,await document.fonts.ready})}function Ze(e,t,n){return new O(r=>{let o={id:e,controller:n,target:t};ze().subscribe({next:()=>pe(t,`registable.${e}`,o),signal:r.signal}),r.signal.subscribe(()=>o.unsubscribe?.())})}function Mi(e,t,n,r){return new O(o=>{function c(a){let s=a.target;a.unsubscribe=()=>{let M=n.indexOf(s);M!==-1&&n.splice(M,1),r?.({type:"disconnect",target:s,elements:n}),o.next()};let l=n.indexOf(s);l!==-1&&n.splice(l,1);let b=0,A=n.length;for(;b<A;){let M=b+A>>1;n[M].compareDocumentPosition(s)&Node.DOCUMENT_POSITION_FOLLOWING?b=M+1:A=M}n.splice(b,0,s),r?.({type:"connect",target:s,elements:n}),o.next()}let i=de(t,`registable.${e}`).subscribe(c);o.signal.subscribe(i.unsubscribe)})}function Ri(e,t,n=new Set){let r=Xo();return h(de(t,`registable.${e}`).map(o=>{let c=o.target,i=o.controller||o.target;return o.unsubscribe=()=>{n.delete(i),r.next({type:"disconnect",target:i,element:c,elements:n})},n.add(i),{type:"connect",target:i,element:c,elements:n}}),r)}var we=class extends x{name="";width;height;alt;fill=!1};u(we,{tagName:"c-icon",init:[g("name"),g("width"),g("height"),g("fill"),g("alt")],augment:[V("none"),d(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,n;return e.shadowRoot?.adoptedStyleSheets.push(t),Me(e).switchMap(()=>Ye(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,o=e.height??e.width;t.replace(`:host{${r===void 0?"":`width:${r}px;`}${o===void 0?"":`height:${o}px`}}`).catch(c=>{}),n?.remove(),n=e.name?Ti(e.name,{className:"icon",width:r,height:o,fill:e.fill,alt:e.alt}):void 0,n&&(n.onerror=()=>{n&&e.alt&&n.replaceWith(e.alt)},j(e).append(n))})}]});function ic(e){return m(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function ac(e,t=e,n=0){let r=t.hasAttribute("tabindex")?t.tabIndex:n;return ic(e).tap(o=>{o?t.removeAttribute("tabindex"):t.tabIndex=r})}function sc(e,t=e){return h(S(t,"focusout").tap(()=>e.touched=!0),h(G(e,"disabled"),G(e,"touched")).tap(()=>pe(e,"focusable.change")))}function Ie(e,t=e,n=0){return h(ac(e,t,n),sc(e,t))}function _i(e){return e in q.animation}function Be({target:e,animation:t,options:n}){if(q.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in q.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?q.animation[t]:t,o=typeof r.kf=="function"?r.kf(e):r.kf,c={duration:250,easing:q.easing.emphasized,...r.options,...n,...q.prefersReducedMotion?{duration:0}:void 0};return e.animate(o,c)}function Ii(e){let{trigger:t,stagger:n,commit:r,keep:o}=e;function c(a){return new O(s=>{let l=Be(a);l.ready.then(()=>s.next({type:"start",animation:l}),b=>{console.error(b)}),l.addEventListener("finish",()=>{s.next({type:"end",animation:l}),r&&l.commitStyles(),!(o||o!==!1&&a.options?.fill&&(a.options.fill==="both"||a.options.fill==="forwards"))&&s.complete()}),s.signal.subscribe(()=>{try{l.cancel()}catch{}})})}let i=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return h(...i.map((a,s)=>{let l={...e.options,delay:n!==void 0?(e.options?.delay??0)+s*n:e.options?.delay};return(t==="visible"?Jo(a).filter(A=>A):t==="hover"?Rr(a):B(!0)).switchMap(A=>A?c({...e,options:l,target:a}):R)}))}function Oi(e,t,n=e.getBoundingClientRect()){let r=n.width>n.height?n.width:n.height,o=new qn,c=e.shadowRoot||e,{x:i,y:a}=t??{x:1/0,y:1/0},s=!t||Zt(t),l=i>n.right||i<n.left||a>n.bottom||a<n.top;return o.x=s||l?n.width/2:i-n.left,o.y=s||l?n.height/2:a-n.top,o.radius=r,t||(o.duration=0),c.prepend(o),o}function Di(e,t=e){let n,r,o,c=()=>{n=Oi(t,r instanceof Event?r:void 0,o),n.duration=600,r=void 0};return h(S(e,"click").tap(i=>{r=i,o=t.getBoundingClientRect()}),m(e,"selected").raf().switchMap(()=>{if(e.selected){if(!n?.parentNode){if(Tr(e))return r=void 0,Me(e).tap(c);c()}}else n&&Li(n).catch(i=>console.error(i));return R})).ignoreElements()}function Li(e){return new Promise(t=>{Be({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function Xe(e,t=e){let n=!1,r=0;return h(S(t,"pointerdown"),S(t,"click")).tap(o=>o.cxlRipple??=e).raf().mergeMap(o=>{if(o.cxlRipple===e&&!n&&!e.disabled&&e.parentNode){r=Date.now(),n=!0,e.style.setProperty("--cxl-mask-hover","none");let c=Oi(e,o),i=c.duration,a=()=>{e.style.removeProperty("--cxl-mask-hover"),Li(c).catch(()=>{}).finally(()=>{n=!1})};return o.type==="click"?st(i).tap(a):h(S(document,"pointerup"),S(document,"pointercancel")).first().map(()=>{let s=Date.now()-r;setTimeout(()=>a(),s>i?32:i-s)})}return R})}var qn=class extends x{x=0;y=0;radius=0;duration=500};u(qn,{tagName:"c-ripple",init:[g("x"),g("y"),g("radius")],augment:[d(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",oe(()=>{let n=t.style;n.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,n.width=n.height=e.radius*2+"px",t.parentNode||j(e).append(t),Be({target:t,animation:"expand",options:{duration:e.duration}}),Be({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var Fr=[ve,Mt,d(`
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
	${L("label-large")}
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
`);function zr(e){return m(e,"disabled").switchMap(t=>t?R:zn(e).tap(n=>{n.stopPropagation(),e.click()}))}function jr(e){return h(zr(e),Ie(e))}var Zn=class extends x{disabled=!1;touched=!1};u(Zn,{init:[v("disabled"),v("touched")],augment:[V("button"),jr]});var Qt=class extends Zn{size;color;variant};u(Qt,{tagName:"c-button",init:[fe("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),_t("color","primary"),v("variant")],augment:[...Fr,cc,Xe,_]});var Je;function Pi(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function lc(e){return e==="infinite"?1/0:+e}function uc(e){if(_i(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let n={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(a,s,l)=>(s&&(r=+s),l&&(n.composite=l),"")),Je??=document.createElement("style").style,Je.animation=e,n.fill=Je.animationFillMode;let o=n.fill==="forwards"||n.fill==="both",c=t?void 0:Pi(Je.animationDuration);c!==void 0&&(n.duration=c);let i=Pi(Je.animationDelay);return i!==void 0&&(n.delay=i),Je.animationIterationCount&&(n.iterations=lc(Je.animationIterationCount)),{animation:Je.animationName,keep:o,stagger:r,options:n}}function pc(e){return typeof e=="string"&&(e=e.split(",").map(t=>uc(t.trim()))),e}function Br(e,t,n,r){let o=r?`motion-${r}-on`:"motion-on",c=pc(n);return e.setAttribute(o,""),h(...c.map(i=>Ii({target:t,...i}))).finalize(()=>e.removeAttribute(o))}var Fi=d(":host(:not([open],[motion-out-on])){display:none}");function $r(e,t=()=>e,n=!1){let r=ne(()=>B(t("in"))),o=ne(()=>B(t("out"))),c=ne(()=>e.duration!==void 0&&e.duration!==1/0?st(e.duration).map(()=>e.open=!1):R).log();return h(de(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),le(m(e,"motion-in").map(i=>(i?r.mergeMap(a=>Br(e,a,i,"in")):r).mergeMap(()=>c)),m(e,"motion-out").map(i=>(i?o.switchMap(a=>Br(e,a,i,"out")):o).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([i,a])=>G(e,"open").switchMap(s=>{if(e.popover!=="auto"){let l=s?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:s?"closed":"open",newState:l}))}return s?n?Fe(a,i):i:n?Fe(a,i):a})))}var Ot=class extends x{open=!1;duration;"motion-in";"motion-out"};u(Ot,{init:[g("motion-in"),g("motion-out"),Gn("duration"),v("open")]});var Kt=class extends Ot{};u(Kt,{tagName:"c-toggle-target",augment:[d(`
:host{display:contents}
`),e=>{let t=N("slot"),n=N("slot",{name:"off"});return(e.open?n:t).style.display="none",j(e).append(t,n),$r(e,r=>{t.style.display=n.style.display="none";let o=e.open?r==="in"?t:n:r==="in"?n:t;return o.style.display="",o.assignedElements()},!0)}]});var Hr={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(n){console.error(n)}}};function zi(e){return(t,n)=>t[e]>n[e]?1:t[e]<n[e]?-1:0}function Dt(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let n,r=e.getRootNode();return r instanceof ShadowRoot&&(n=r.getElementById(t),n)?n:e.ownerDocument.getElementById(t)??void 0}var Ur=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},Qe=new Ur;var Bi=(e,t,n=e)=>ee(e).tap(()=>pe(n,"toggle.close",t));function ji(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(n=>{let r=Dt(e,n);return r?[r]:[]}):Array.isArray(t)?t:[t]}function dc(e,t,n,r,o=S(e,"click").map(()=>!n())){return h(r,o).switchMap(c=>{let i=t();return i?Ge(i.map(a=>({target:a,open:c}))):R})}function tn(e,t=e){function n(c,i){return[m(e,"open").switchMap(a=>(c.parentNode||Qe.popupContainer.append(c),c.open=a,a&&c instanceof x?G(c,"open").map(s=>{e.open&&s===!1&&(e.open=!1)}):R)),ci(c).tap(a=>{let s=c.getAttribute("role");(s==="menu"||s==="listbox"||s==="tree"||s==="grid"||s==="dialog")&&(i.ariaHasPopup=s),i.getRootNode()===c.getRootNode()&&i.setAttribute("aria-controls",a)})]}let r=le(m(e,"trigger"),m(e,"target")).switchMap(([c])=>{let i=ji(e),a=i?h(...i.flatMap(s=>n(s,e))).ignoreElements():R;return h(c==="hover"?le(_r(t),i?h(...i.map(s=>_r(s))):R).map(s=>!!s.find(l=>!!l)).debounceTime(250):c==="checked"?S(t,"change").map(s=>s.target&&"checked"in s.target?!!s.target.checked:!1):S(t,"click").map(()=>!e.open),a)}),o;return Ko().switchMap(()=>dc(t,()=>ji(e),()=>e.open,m(e,"open"),r).filter(c=>{let{open:i,target:a}=c;if(e.open!==i){if(i)o=Ir(e)?.activeElement,a.trigger=e;else if(a.trigger&&a.trigger!==e)return c.open=!0,a.trigger=e,!0;return e.open=i,!1}if(!i&&a.trigger===e){let s=document.activeElement;(s===document.body||s===document.documentElement)&&o?.focus()}return!0}))}var Xn=class extends x{open=!1;target;trigger};u(Xn,{init:[g("target"),g("trigger"),v("open")],augment:[e=>tn(e).raf(({target:t,open:n})=>t.open=n)]});var en=class extends Xn{};u(en,{tagName:"c-toggle",augment:[_e,_]});var Vr=[d(`
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
	${L("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${L("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${L("headline-medium")}
	flex-wrap: wrap;
}`),_,()=>N("slot",{name:"title"})];function fc(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var nn=class extends x{size;sticky=!1;contextual};u(nn,{tagName:"c-appbar",init:[v("size"),v("sticky"),v("contextual")],augment:[d(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...Vr,()=>N("slot",{name:"contextual"}),e=>m(e,"sticky").switchMap(t=>t?jn(e,{threshold:[1]}).tap(n=>e.toggleAttribute("scroll",n.intersectionRatio<1)):R),e=>{let t;return h(Pn(e),m(e,"contextual")).raf().switchMap(()=>{for(let n of e.children)if(fc(n)&&(n.slot="contextual",n.open=n.name===e.contextual,n.open))return t=n,S(n,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,R})}]});var rn=class extends Qt{};u(rn,{tagName:"c-button-round",augment:[d(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var be=class extends rn{icon="";width;height;fill=!1;variant="text";alt};u(be,{tagName:"c-icon-button",init:[g("icon"),g("width"),g("height"),g("alt"),g("fill")],augment:[e=>N(we,{className:"icon",width:m(e,"width"),height:m(e,"height"),name:m(e,"icon"),fill:m(e,"fill"),alt:m(e,"alt")})]});var Jp=1440*60*1e3;function $i(e,t,n){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(n,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(n,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(n,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(n,{dateStyle:t,timeStyle:t})}function Hi(e,t,n){return typeof n=="string"?$i(t,n,e):t.toLocaleString(e,n)}var Gr={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function mc(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var on={content:Gr,name:"default",localeName:mc(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>Hi(on.localeName,e,t)},gc={content:Gr,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>Hi("en-US",e,t)};function hc(){let e=ue(on),t={default:on,en:gc},n={},r=e.map(i=>i.content);async function o(i){let a=i.split("-")[0];if(!a)return on;if(!(t[i]??t[a])){let l=n[i]??n[a];l&&await l()}return t[a]||on}async function c(i){e.next(await o(i))}return navigator.language&&c(navigator.language).catch(i=>console.error(i)),{content:r,registeredLocales:t,locale:e,setLocale:c,getLocale(i){return i?Wt(()=>o(i)):e},get(i,a){return r.map(s=>s[i])},register(i){t[i.name]=i}}}var Lt=hc();function Ui(e){return Object.assign(Gr,e),Lt.get}var Jn=class e extends x{name;size;open=!1;backIcon=N(be,{icon:"arrow_back",className:"icon",ariaLabel:Lt.get("core.close"),$:t=>ee(t).tap(()=>this.open=!1)});static{u(e,{tagName:"c-appbar-contextual",init:[g("name"),v("open"),v("size")],augment:[t=>t.backIcon,...Vr,d(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>G(t,"open").tap(n=>{n||t.dispatchEvent(new Event("close"))})]})}};function Vi(e=document){document.documentElement.lang="en";let t=[N("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),N("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),N("meta",{name:"mobile-web-app-capable",content:"yes"}),N("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${L("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function Gi(e=2e3){return h(st(e),Wn()).first()}function Yi(e){return Gi().raf(()=>e.setAttribute("ready",""))}function Qn(e){return h(oe(t=>{let n=Vi(e.ownerDocument);t.signal.subscribe(()=>n.forEach(r=>r.remove()))}),ze().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),Gi().switchMap(()=>Rt(e).raf(t=>e.setAttribute("breakpoint",t))),Yi(e),Yn.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var Yr=class extends x{connectedCallback(){requestAnimationFrame(()=>Vi(this.ownerDocument)),super.connectedCallback()}};u(Yr,{tagName:"c-meta",augment:[()=>Yi(document.body)]});function Wi(e,t,n){n==="in"&&(e.style.display="");let r=e.offsetWidth,o=Be({target:e,animation:{kf:{[t]:n==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});n==="out"&&(o.onfinish=()=>e.style.display="none")}var pt=class extends x{sheetstart=!1;sheetend=!1};u(pt,{tagName:"c-application",init:[v("sheetstart"),v("sheetend")],augment:[d(`
:host {
	display: flex;
	position: absolute;
	inset: 0;
	${Q("surface")}
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
${It()}
	`),Qn,e=>de(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>de(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=N("slot",{name:"start"}),n=N("slot",{id:"body"}),r=N("slot",{name:"end"}),o=qe("html { overflow: hidden }");return j(e).append(t,n,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),Qe.popupContainer=e,h(oe(c=>{let i=e.ownerDocument.adoptedStyleSheets;i.push(o),c.signal.subscribe(()=>{let a=i.indexOf(o);a!==-1&&i.splice(a,1)})}),G(e,"sheetstart").tap(c=>Wi(t,"marginLeft",c?"in":"out")),G(e,"sheetend").tap(c=>Wi(r,"marginRight",c?"in":"out")))}]});var xc=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,bc=/^\d{5}(?:[-\s]\d{4})?$/,yc={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},qi={required:kc,email:Nc,json:Rc,zipcode:Tc,nonZero:Cc,nonEmpty:Sc},vc={pattern:Ac,equalToElement:Wr(Qi),greaterThan:Xi,lessThan:Ji,greaterThanElement:Wr(Xi),lessThanElement:Wr(Ji),min:Ic,max:Oc,equalTo:Qi,maxlength:Dc,minlength:Lc},wc=Ui(yc);function Wr(e){return(t,n)=>{let r=typeof t=="string"?Dt(n,t):t;if(!r)throw"Invalid element";return e(r)}}function Oe(e,t){return{key:e,valid:t,message:wc(`validation.${e}`,"validation.invalid")}}function Ec(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function Sc(e){return Oe("nonEmpty",!Ec(e))}function Cc(e){return Oe("nonZero",e===""||Number(e)!==0)}function Ac(e){let t=typeof e=="string"?e=new RegExp(e):e;return n=>Oe("pattern",typeof n=="string"&&(n===""||t.test(n)))}function qr(e){return e!=null&&e!==""}function kc(e,t){let n=t&&"checked"in t?!!t.checked:!0;return Oe("required",n&&qr(e))}function Nc(e){return Oe("email",typeof e=="string"&&(e===""||xc.test(e)))}function Tc(e){return Oe("zipcode",typeof e=="string"&&(e===""||bc.test(e)))}function Mc(e){try{return JSON.parse(e),!0}catch{return!1}}function Rc(e){return Oe("json",Mc(e))}function _c(e){return e instanceof HTMLElement&&"value"in e}function an(e,t,n){let r=_c(t)?m(t,"value"):t instanceof O?t:B(t);return o=>r.map(c=>Oe(e,!qr(o)||!qr(c)||n(o,c)))}function Zi(e,t){let n=/(\w+)(?:\(([^)]+?)\))?/g,r=[],o;for(;o=n.exec(e);)if(o[2]){let c=vc[o[1]];if(!c)throw`Invalid rule "${o[1]}"`;r.push(c(o[2],t))}else if(o[1]&&o[1]in qi)r.push(qi[o[1]]);else throw`Invalid rule "${o[1]}"`;return r}function Ki(e,t){let n=(typeof e=="string"?Zi(e,t):e).flatMap(r=>typeof r=="string"?Zi(r,t):r);return(r,o)=>n.map(c=>{let i=c(r,o);return i instanceof O?i:i instanceof Promise?Ge(i):B(i)})}function Ic(e){return an("min",e,(t,n)=>Number(t)>=Number(n))}function Xi(e){return an("greaterThan",e,(t,n)=>Number(t)>Number(n))}function Oc(e){return an("max",e,(t,n)=>Number(t)<=Number(n))}function Ji(e){return an("lessThan",e,(t,n)=>Number(t)<Number(n))}function Qi(e){return an("equalTo",e,(t,n)=>t==n)}function Dc(e){return t=>Oe("maxlength",!t||t.length<=+e)}function Lc(e){return t=>Oe("minlength",!t||t.length>=+e)}function Pc(e){return ta(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function ea(e){return G(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||kt(e,"change",{bubbles:!0})})}function ta(e){return h(m(e,"value"),m(e,"checked")).map(()=>{})}var Pt=class e extends x{static formAssociated=!0;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{u(e,{init:[v("autofocus"),v("invalid"),v("disabled"),v("touched"),g("rules"),v("name"),Z("validationResult"),Vn("update")],augment:[t=>(t.defaultValue=t.value,h(Ze("form",t),G(t,"invalid").tap(()=>kt(t,"invalid")),m(t,"invalid").switchMap(n=>{if(n){if(t.setAria("invalid","true"),!t.validationMessage)return Lt.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return R}),oe(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),m(t,"rules").switchMap(n=>{if(!n)return R;let r=Ki(n,t);return ta(t).switchMap(()=>h(...r(t.value,t)).tap(o=>t.setValidity(o))).finalize(()=>t.resetValidity())}),m(t,"value").tap(n=>t.setFormValue(n)),m(t,"validationResult").switchMap(n=>!n||n.valid?R:n.message instanceof O?n.message:n.message===void 0?Lt.get("validation.invalid"):B(n.message)).tap(n=>{t.setCustomValidity(n)}))),Pc]})}get labels(){return Re(this).labels}get validity(){return Re(this).validity}get validationMessage(){return Re(this).validationMessage}reportValidity(){return Re(this).reportValidity()}checkValidity(){return Re(this).checkValidity()}setCustomValidity(t){let n=!!t,r=t!==this.validationMessage;this.applyValidity(n,t),this.invalid!==n?this.invalid=n:r&&kt(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,n){n?this.setAttribute(`aria-${t}`,n):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let n in this.validMap){let r=this.validMap[n];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,n){Re(this).setValidity({customError:t},n)}formDisabledCallback(t){this.disabled=t}setFormValue(t){Re(this).setFormValue(t)}};function Fc(e,t){let n,r=t.key;if(r==="ArrowDown"&&e.goDown)n=e.goDown();else if(r==="ArrowRight"&&e.goRight)n=e.goRight();else if(r==="ArrowUp"&&e.goUp)n=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)n=e.goLeft();else if(r==="Home")n=t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")n=t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)n=e.other(t);else return null;return t.stopPropagation(),n&&t.preventDefault(),n}function na(e){return S(e.host,"keydown").map(t=>Fc(e,t)).filter(t=>!!t)}function Kn({host:e,input:t,handleOther:n=!1,axis:r}){let o=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function c(A=1){if(e.open===!1){e.open=!0;let M=o();requestAnimationFrame(()=>{M?.focused&&l(M)})}else return i(A)}function i(A=1,M){let P=o(),H=M??(P?e.options.indexOf(P):-1),$;do $=e.options[H+=A];while($?.hidden);return $}function a(A){let M=A.key;if(/^\w$/.test(M)){let P=o(),H=P?e.options.indexOf(P):-1;if(H===-1)return;let $=H;$+1>=e.options.length&&(H=0);let K=new RegExp(`^\\s*${M}`,"i"),X;for(;X=e.options[++H];)if(!X.hidden&&X.textContent.match(K))return X;if($===0)return;for(H=0;H<$&&(X=e.options[H++]);)if(!X.hidden&&X.textContent.match(K))return X}}let s=()=>e.options.find(A=>A.focused);function l(A){for(let M of e.options)M.focused=!1;A?(A.focused=!0,t?.setAria("activedescendant",je(A)),A.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let b=A=>pe(A,"selectable.action",A);return h(na({host:t??e,...r==="x"?{goLeft:()=>c(-1),goRight:()=>c(1)}:{goDown:()=>c(1),goUp:()=>c(-1)},goFirst:()=>e.open!==!1?i(1,-1):void 0,goLast:()=>e.open!==!1?i(-1,e.options.length):void 0,other:n?a:void 0}).tap(A=>{e.open===!1?b(A):l(A)}),S(t??e,"focus").tap(()=>l(o())),ei(t??e,"Enter").tap(A=>{let M=s();e.open!==!1&&M?(A.stopPropagation(),b(M)):e.open===!1&&(e.open=!0)}))}function Zr(e){return new O(t=>{h(Mi("selectable",e,e.options,n=>{if(n.type==="connect"&&(n.target.view=e.optionView,n.target.selected))return e.defaultValue===void 0&&(e.defaultValue=n.target.value),t.next(n.target);let r;for(let o of e.options)o.hidden||!o.parentNode||o.selected&&(r?o.selected=!1:r=o);t.next(r)}),de(e,"selectable.action").tap(n=>{if(!e.disabled&&e.options.includes(n)){let r=e.value!==n.value;t.next(n),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var dt={},Ft=class e extends Pt{options=[];_value;_selected=dt;static{u(e,{init:[g("value"),Z("selected")],augment:[t=>Zr(t).tap(n=>{(!n||n!==t.selected)&&t.setSelected(n)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===dt?this.options[0]?.value:this._value}get selected(){return this._selected===dt&&this.options[0]?this.options[0]:this._selected}set value(t){if(this._selected&&this._selected!==dt&&this._selected.value===t){this._value=t;return}else for(let n of this.options)if(n.value===t){this._value=t,this.setSelected(n);return}this._selected!==dt?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let n of this.options)n.focused=n.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==dt&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=dt)}};function ra(e,t,...n){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let o in t){if(o==="children")continue;let c=t[o];r.setAttribute(o==="className"?"class":o,c??"")}return n.length&&r.append(...n),r}function er(e){return ra("svg",e,ra("path",{d:e.d}))}function zc({host:e,target:t,position:n,onToggle:r,whenClosed:o=R}){return c=>(t.popover??="auto",t.togglePopover(c),r?.(c),c?h($n(e),S(window,"resize"),S(window,"scroll",{capture:!0,passive:!0})).tap(n):o)}function oa(e){let{host:t,beforeToggle:n,target:r}=e,o=zc({...e,whenClosed:ee(t).tap(()=>{t.open=!0})});return h(S(r,"toggle").tap(c=>{let i=c.newState==="open";t.open=i}),m(t,"open").raf().switchMap(c=>(n?.(c),t.ariaExpanded=c?"true":"false",o(c))))}var sn=class extends x{invalid=!1};u(sn,{tagName:"c-field-help",init:[g("invalid")],augment:[d(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${L("body-small")}
}
	`),_,e=>(e.slot||="help",m(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Jr=d(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${L("body-large")}
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
	${L("body-small")}
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
`),jc=d(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${L("body-small")}
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
	${L("body-large")}
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

${Jt(".content")}
	`);function $c(e){return h(de(e,"registable.form",!1).tap(t=>{t.id==="form"&&(e.input=t.target)}),Ri("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var Hc=()=>N("div",{className:"content"},N("slot",{name:"leading"}),N("div",{className:"body"},N("slot",{name:"label"}),N("slot",{id:"bodyslot"})),N("slot",{name:"trailing"}),N("div",{className:"indicator"}));function Uc(e){function t(l){o.next(l.touched&&l.invalid),e.toggleAttribute("invalid",o.value);let b=0,A=[];for(let P of i.assignedNodes())!(P instanceof HTMLElement)||P===s||("invalid"in P&&P.invalid?o.value&&(P.invalid===!0||P.invalid===l.validationResult?.key)?(b++,P.style.display="",A.push(je(P))):P.style.display="none":A.push(je(P)));let M=!o.value||b>0;s.textContent=M?"":l.validationMessage,M?s.remove():(s.parentElement||e.append(s),A.push(je(s))),A.length?l.setAria("describedby",A.join(" ")):l.setAria("describedby",null)}function n(l){let b=e.input;if(b){if(e.toggleAttribute("inputdisabled",b.disabled),t(b),!l)return;l.type==="focus"?c.next(!0):l.type==="blur"&&c.next(!1)}}function r(){let l=e.input?.value,b=!e.input?.hasAttribute("autofilled")&&(!l||l.length===0);a?.classList.toggle("novalue",b),a?.classList.toggle("value",!b)}let o=ue(!1),c=ue(!1),i=N("slot",{name:"help"}),a=e.contentElement.children[1]?.children[0],s=N(sn,{ariaLive:"polite"});return j(e).append(N("div",{className:"help"},i)),h(m(e,"input").switchMap(l=>l?h(B(void 0).tap(()=>{n(),queueMicrotask(r)}),S(l,"focusable.change").tap(n).tap(r),S(l,"focus").tap(n),S(l,"invalid").tap(n),S(l,"update").tap(r),G(l,"touched").tap(()=>n()),h(S(l,"blur"),S(i,"slotchange")).raf(n),S(e.contentElement,"click").tap(()=>{document.activeElement!==l&&!e.matches(":focus-within")&&!c.value&&l.focus()})):R),$c(e))}var ft=class e extends x{floating=!1;input;size;contentElement=Hc();static{u(e,{init:[v("floating"),Z("input"),fe("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Uc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},Xr=class extends ft{};u(Xr,{tagName:"c-field",augment:[Jr,jc,Bc]});var Vc=d(`
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
`);function Gc(e,t){return()=>{let n=e.parentElement instanceof ft?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${n.bottom}px`,t.style.left=`${n.x}px`,t.style.minWidth=`${n.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-n.bottom-16,280)}px`}}function Kr({host:e,target:t,input:n,position:r,beforeToggle:o,onToggle:c,handleOther:i,axis:a}){return h(Kn({host:e,input:n,handleOther:i,axis:a}),S(n??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),oa({host:e,target:t,position:r??Gc(e,t),beforeToggle:o,onToggle:c}))}function Yc(e){let{host:t}=e;return h(Vc(t)??R,ve(t)??R,Ie(t),Kr(e))}var zt=class extends x{};u(zt,{tagName:"c-select-option",augment:[d(`
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
		`),_]});var Qr=class extends Ft{open=!1;optionView=zt;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let n of this.options)n!==t&&(n.slot="");t&&(t.slot="selected")}}};u(Qr,{tagName:"c-select",init:[v("open")],augment:[V("listbox"),d(`
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
	${Q("surface-container")}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),e=>{let t=N("div",{className:"menu"},N("slot")),n=N("slot",{name:"selected"}),r=t.style,o=Ai(e),c=0,i=0;j(e).append(t,n,er({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function a(){if(e.open)i=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let s=e.options.reduce((l,b)=>Math.max(l,b.rendered?.offsetWidth??0),0);o.replaceSync(`:host{width:min(100%,${s}px)}`)}}return h(h(Me(e),Wn()).raf(a),Yc({host:e,target:t,handleOther:!0,beforeToggle(s){a();let l=e.selected;l&&(l.slot=s?"":"selected"),t.classList.toggle("open",s)},onToggle(s){let l=e.selected;!s&&l&&(c=l.rendered?.offsetHeight??0)},position(){let s=e.parentElement??e,l=Math.round((i-c)/2),b=e.selected?.rendered,A=s.getBoundingClientRect(),M=e.getBoundingClientRect(),P=M.top-14,H,$=b?b.offsetTop:0;$>P&&($=P),H=t.scrollHeight;let K=window.innerHeight-M.top+8+$,X=M.top-l-$;H>K?H=K:H<M.height&&(H=M.height),r.top=X+"px",r.left=A.left+"px",r.maxHeight=H+"px",r.minWidth=A.width+"px",r.transformOrigin=`${$}px`}}))}]});function Wc(e){let t=ct();return h(Ze("field",e,n=>t.next(n)),t)}function aa(e){return Wc(e).switchMap(t=>m(e,"input").switchMap(n=>n?B(n):m(t,"input").switchMap(r=>r?B(r):R)))}function cn(e,t,n){return m(e,n).tap(r=>Xt(t,n,r))}var qc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function nr({host:e,input:t,toText:n,toValue:r,update:o}){t.className="cxl-native-input",t.setAttribute("style",qc),t.setAttribute("form","__cxl_ignore__");function c(s){e.value=r?r(t.value||""):t.value,s.stopPropagation(),e.dispatchEvent(new Event(s.type,{bubbles:!0}))}function i(){let s=e.value,l=n?n(s,t.value):s||"";t.value!==l&&e.setInputValue(l)}function a(){t.ariaLabel=e.ariaLabel;let s=e.getAttribute("aria-labelledby");s?t.setAttribute("aria-labelledby",s):t.removeAttribute("aria-labelledby")}return h(Ie(e,t),ne(()=>(a(),t.form?S(t.form,"reset").tap(c):R)),m(e,"value").tap(()=>{n&&t.matches(":focus")||i()}),S(t,"blur").tap(i),S(t,"input").tap(c),S(t,"change").tap(c),cn(e,t,"disabled"),cn(e,t,"name"),cn(e,t,"autocomplete"),cn(e,t,"spellcheck"),cn(e,t,"autofocus"),Fn(e,["aria-label","aria-labelledby"]).tap(a),o?o.tap(i):R,S(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),S(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var tr=class e extends Pt{inputValue="";static{u(e,{init:[Z("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,S(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,n){n?this.inputEl.setAttribute(`aria-${t}`,n):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,n){Re(this).setValidity({customError:t},n,this.inputEl),this.inputEl.setCustomValidity(t?n||"Invalid Field":"")}};var Zc=[d(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),ve],to=[...Zc,_],ln=class e extends tr{autofilled=!1;autocomplete;static{u(e,{init:[v("autofilled"),g("autocomplete")],augment:[t=>S(t.inputEl,"animationstart").tap(n=>{(n.animationName==="cxl-onautofillstart"||n.animationName==="cxl-onautofillend")&&(t.autofilled=n.animationName==="cxl-onautofillstart",pe(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,n){this.inputEl.setSelectionRange(t,n)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},eo=class extends ln{value="";inputEl=N("input",{className:"input"})};u(eo,{tagName:"c-input-text",init:[g("value")],augment:[...to,e=>e.append(e.inputEl),e=>nr({host:e,input:e.inputEl})]});function Xc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var jt=class e extends ln{selected;value;inputEl=N("input",{className:"input"});static{u(e,{tagName:"c-input-option",init:[g("value"),Z("selected")],augment:[...to,t=>t.append(t.inputEl),t=>nr({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:n=>n!==""?t.selected?.value:void 0}),t=>G(t,"selected").tap(n=>{let r=t.selected?.textContent;t.value=n?.value,t.setInputValue(r??""),Xc(t.inputEl)})]})}};function Jc(e){return no(e,"^")}function no(e,t=""){if(e==="")return()=>!0;let n=ro(e,t);return r=>r.textContent?n.test(r.textContent):!1}function ro(e,t="",n="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),n)}var rr=class e extends x{optionView=zt;open=!1;debounce=100;options=[];matcher=no;static{u(e,{tagName:"c-autocomplete",init:[v("open"),Gn("debounce")],augment:[V("listbox"),ia,_e,t=>{let n=N("slot",{name:"empty"}),r=N("div",{id:"menu",tabIndex:-1},N("slot"),n),o=er({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});o.style.cursor="pointer",n.style.display="none";function c(s){t.open=!0,a(s)}function i(s,l){s.setAria("activedescendant",je(l)),l.rendered?.scrollIntoView({block:"nearest"})}function a(s){let l=s.inputValue??s.value,b=t.doSearch(l);n.style.display=b?"none":"",b&&i(s,b)}return j(t).append(r,o),h(aa(t).switchMap(s=>(s.setAria("autocomplete","list"),s.role="combobox",s.setAria("controls",je(t)),s.setAria("haspopup",t.role),s.setAttribute("autocomplete","off"),h(m(t,"open").tap(l=>{if(l)o.tabIndex=-1,c(s);else{for(let b of t.options)b.focused=!1;o.tabIndex=0,s.setAria("activedescendant",null)}s.setAria("expanded",String(l))}),h(zn(o),S(o,"mousedown")).tap(l=>{l.preventDefault(),l.stopPropagation(),s.focus()}).debounceTime(100).tap(()=>{t.open=!0}),m(t,"debounce").switchMap(l=>S(s,"input").debounceTime(l).tap(()=>t.open?a(s):c(s))),S(t,"change").tap(l=>{l.target===t&&s.dispatchEvent(new Event("change",{bubbles:!0}))}),Kr({host:t,target:r,input:s}),h(Zr(t),G(s,"value").map(l=>{for(let b of t.options)if(b.value===l)return b})).tap(l=>{for(let b of t.options)b.focused=b.selected=!1;l&&(l.selected=!0),s instanceof jt?s.selected=l:s.value=l?.value,l&&(t.open=!1)})))))}]})}doSearch(t){let n=0,r,o=this.matcher==="substring"?no:this.matcher==="prefix"?Jc:this.matcher,c=t?o(String(t)):void 0;for(let i of this.options){let a=!c?.(i);i.hidden=a,i.focused=!(a||n++>0),i.focused&&(r=i)}return r}};var un=class extends rr{onsearch;doSearch(t){return kt(this,"search",{detail:t}),this.options[0]}};u(un,{tagName:"c-autocomplete-dynamic",init:[Vn("search")]});var or=class extends x{};u(or,{tagName:"c-body",augment:[d(`
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

${te("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),_]});var ir=class extends x{};u(ir,{tagName:"c-button-segmented-view",augment:[d(`
:host {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 8px;
	padding: calc(4px + (var(--cxl-size,0) * 4px)) calc(16px + (var(--cxl-size,0) * 4px));
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
		`),Mt,Xe,()=>N(we,{id:"check",name:"check"}),_]});var pn=class extends Ft{optionView=ir;size};u(pn,{tagName:"c-button-segmented",init:[fe("size",e=>`{
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
	${L("label-large")}
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
		`),ve,_,Ie,e=>Kn({host:e,axis:"x"})]});function oo(e="block"){let t=(n=>{for(let r=12;r>0;r--)n.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,n.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,n.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,n.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,n.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return n})({xl:"",lg:"",md:"",sm:"",xs:""});return d(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${te("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${te("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${te("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${te("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var io=d(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${It()}
${ut.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${ut.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),Bt=class extends x{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};u(Bt,{init:[v("sm"),v("xs"),v("md"),v("lg"),v("xl"),v("vpad"),v("pad"),v("center"),v("fill"),v("grow"),v("elevation"),_t("color")]});var $e=class extends Bt{};u($e,{tagName:"c-c",augment:[io,oo(),d(":host([center]) { text-align: center}"),_]});var Qc=d(`
:host {
	${Q("surface-container")}
	${L("body-medium")}
	border-radius: var(--cxl-shape-corner-medium);
	overflow: hidden;
}
:host([variant=elevated]:not([color])) {
	--cxl-color-surface: var(--cxl-color-surface-container-low);
	z-index: 1;
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=outlined]:not([color])) {
	${Q("surface")}
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline-variant);
}
${It()}
`),mt=class extends $e{variant};u(mt,{tagName:"c-card",init:[v("variant")],augment:[Qc]});var Kc=d(`
:host { ${xi} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function el(e){return h(Ze("list",e),m(e,"selected").tap(t=>e.ariaSelected=String(t)))}function tl(e){return h(zr(e),Ie(e,e,-1),el(e))}var Ke=class extends x{disabled=!1;touched=!1;selected=!1};u(Ke,{init:[v("disabled"),v("touched"),v("selected")],augment:[tl]});var ao=class extends Ke{size};u(ao,{tagName:"c-item",init:[fe("size",e=>`{min-height:${56+e*8}px}`)],augment:[Kc,ve,Mt,V("option"),_,Xe]});var gt=class extends x{color;size=0};u(gt,{tagName:"c-pill",init:[_t("color","surface-container-low"),fe("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[d(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${L("label-large")}
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
		`),()=>N("slot",{name:"leading"}),_,()=>N("slot",{name:"trailing"})]});var ht=class extends gt{disabled=!1;touched=!1;selected=!1};u(ht,{tagName:"c-chip",init:[v("disabled"),v("touched"),v("selected")],augment:[V("button"),jr,...Fr,d(`
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
	${Q("secondary-container")}
}
:host(:hover) { box-shadow: none; }
		`),Xe]});var dn=class extends x{};u(dn,{tagName:"c-span"});var fn=class extends x{center=!1};u(fn,{tagName:"c-backdrop",init:[v("center")],augment:[d(`
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

	`),e=>S(e,"keydown").tap(t=>t.stopPropagation()),_]});var mn=class extends Ot{};u(mn,{tagName:"c-toggle-panel",augment:[_,Fi,$r]});var nl=d(`
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
${te("small","#drawer { width: 360px }")}

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
`),$t=class extends x{open=!1;position;responsive;permanent=!1};u($t,{tagName:"c-drawer",init:[v("open"),v("position"),g("responsive"),g("permanent")],augment:[nl,d(`
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
`),e=>{let t=ue(!1),n=h(m(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",o=N(mn,{id:"drawer","motion-in":n.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":n.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},_),c=new fn;c.id="backdrop";let i=N("dialog",{id:"dialog"},c,o);return j(e).append(i),h(S(o,"close").tap(()=>i.close()),S(i,"close").tap(()=>e.open=!1),de(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),G(o,"open").tap(a=>e.open=a),G(e,"open").raf(a=>{a||o.scrollTo(0,0)}),S(c,"click").tap(()=>e.open=!1),S(i,"cancel").tap(a=>{a.preventDefault(),e.open=!1}),m(e,"open").tap(a=>{if(t.value&&e.permanent)return o.open=!0;a?t.value||(Qe.openModal({element:i,close:()=>e.open=!1}),i.getBoundingClientRect()):Qe.currentModal?.element===i&&Qe.modalClosed()}).raf(a=>{o.open=a}),m(e,"responsive").switchMap(a=>a!==void 0?Rt(document.body):B("xsmall")).switchMap(a=>{let s=q.breakpoints[e.responsive||"large"],l=q.breakpoints[a]>=s;return t.next(l),l&&o.className!=="permanent"?i.close():!l&&o.className==="permanent"&&(e.open=!1),l&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",l),o.className=l?"permanent":"drawer",G(e,"open").tap(b=>{e.hasAttribute("responsiveon")||Be({target:c,animation:b?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var ar=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,n=this.end){let r=this.end.parentNode;r&&(this.start.parentNode||r.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),r.insertBefore(this.frag,n)):r.insertBefore(t,n))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let n=document.createRange();n.setStartAfter(this.start),n.setEndBefore(this.end),n.deleteContents()}};function ca({source:e,render:t,empty:n,append:r,loading:o}){let c=[],i=document.createDocumentFragment(),a,s;function l(b){if(s?.parentNode?.removeChild(s),!b)return;let A=0;for(let P of b){let H=c[A]?.item;if(H)H.value!==P&&H.next(P);else{let $=ue(P),K=t($,A,b),X=K instanceof DocumentFragment?Array.from(K.childNodes):[K];c.push({elements:X,item:$}),i.append(K)}A++}i.childNodes.length&&r(i),a?.remove(),A===0&&n&&r(a=n());let M=c.length;for(;M-- >A;)c.pop()?.elements.forEach(P=>P.remove())}return ne(()=>(s=o?.(),s&&r(s),e.raf(l)))}function sr(e){return ri(()=>{let t=new ar;return[ca({...e,append:n=>t.insert(n)}),t.end]})}function rl(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function ol(e,t){let n=e.getRootNode();if(n instanceof Document)return rl(n.getElementById(t));throw new Error("Invalid root node")}function sa(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=ol(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function il(e){return m(e,"template").switchMap(t=>t?B(sa(e,t)):ze().map(()=>sa(e,e.children[0])))}function al(e,t,n){return il(e).switchMap(r=>{let o=e.target?Dt(e,e.target)??e:e;return r?ca({source:t,render:n?(c,i,a)=>n(r(c,i,a)):r,append:c=>o.append(c)}):R})}var so=class extends x{source;template};u(so,{tagName:"c-each",init:[Z("source"),Z("template")],augment:[_e,_,e=>al(e,m(e,"source"))]});var gn=class extends ft{};u(gn,{tagName:"c-field-bar",augment:[Jr,d(`
:host {
	box-sizing: border-box;
	${Q("surface-container-high")}
	${L("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var ce=class extends Bt{vflex=!1;gap;middle=!1};u(ce,{tagName:"c-flex",init:[v("vflex"),v("gap"),v("middle")],augment:[oo("flex"),io,d(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${ut.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),_]});var He=class extends x{pad;vertical=!1};u(He,{tagName:"c-hr",init:[v("pad"),v("vertical")],augment:[V("separator"),d(`
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
${ut.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});function lo(e){let t=document.createElement("style");return h(oe(n=>{let r=e.persistkey&&Hr.get(e.persistkey);r!==void 0?e.open=r===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),n.signal.subscribe(()=>t.remove())}),Ye(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let n=e.open?e.themeon:e.themeoff;e.persistkey&&Hr.set(e.persistkey,n),Ci(wi[n]||n)}),ee(e).tap(()=>e.open=!e.open))}var co=class extends x{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};u(co,{tagName:"c-toggle-theme",init:[g("persistkey"),g("usepreferred"),g("open"),g("themeon"),g("themeoff")],augment:[V("group"),lo]});var hn=class extends be{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};u(hn,{tagName:"c-icon-toggle-theme",init:[g("persistkey"),g("usepreferred"),g("open"),g("themeon"),g("themeoff")],augment:[lo,e=>le(m(e,"iconon"),m(e,"iconoff"),m(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var sl=()=>{let e;function t(){let n=document.adoptedStyleSheets.indexOf(e);n!==-1&&document.adoptedStyleSheets.splice(n,1)}addEventListener("message",n=>{let{theme:r}=n.data;t(),r!==void 0&&(e=new CSSStyleSheet,e.replace(r).catch(o=>console.error(o)),document.adoptedStyleSheets.push(e))})},cl=()=>{let e=()=>{let t=()=>{parent.postMessage({height:document.documentElement.scrollHeight},"*")};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(t).observe(document.documentElement)},n=>console.error(n))})};document.readyState==="complete"?e():addEventListener("load",e)},xn=class extends x{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=f("iframe",{loading:"lazy"})};u(xn,{tagName:"c-iframe",init:[g("src"),g("srcdoc"),g("sandbox"),g("handletheme")],augment:[d(`
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
<\/script>`;t.srcdoc=`${e.reset}${a}${s}`,n.style.display=""}}async function i(a){let s=new URL(a);return`${s.search||s.hash?`<script>history.replaceState(0,0,'about:srcdoc${s.search}${s.hash}');<\/script>`:""}<base href="${a}" />`+await fetch(a).then(l=>l.text())}return j(e).append(t,n),h(le(m(e,"srcdoc"),m(e,"src")).raf(([a,s])=>{(async()=>{c(s?await i(s):a)})().catch(()=>{})}),S(window,"message").tap(a=>{let{height:s}=a.data;a.source===t.contentWindow&&s!==void 0&&o(s)}),m(e,"handletheme").switchMap(a=>a?S(t,"load").switchMap(()=>Tt.raf(s=>{let l=s?.css??"";t.contentWindow?.postMessage({theme:l},"*")})):R),m(e,"sandbox").tap(a=>a===void 0?t.removeAttribute("sandbox"):t.sandbox.value=a))}]});var uo=[d(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${L("label-large")}
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
${Jt("slot::after")}
	`),ve,Di,_],xt=class extends Ke{size};u(xt,{tagName:"c-nav-item",init:[fe("size",e=>`{min-height:${56+e*8}px}`)],augment:[V("option"),...uo]});var cr=class extends Ke{icon="arrow_drop_down";open=!1;target;size};u(cr,{tagName:"c-nav-dropdown",init:[g("icon"),g("target"),v("open"),fe("size",e=>`{min-height:${56+e*8}px}`)],augment:[V("treeitem"),...uo,d(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>tn(e).raf(({target:t,open:n})=>t.open=n),e=>{let t=N(we,{className:"icon"});return j(e).append(t),h(m(e,"icon").tap(n=>t.name=n))}]});var lr=class extends Kt{};u(lr,{tagName:"c-nav-target",augment:[V("group"),d(":host{display:block;padding-inline-start:12px;}")]});var ur=class extends x{};u(ur,{tagName:"c-nav-headline",augment:[d(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),_]});var bn=class extends be{open=!1;target;icon="menu"};u(bn,{tagName:"c-navbar-toggle",init:[g("target"),Z("open")],augment:[e=>tn(e).tap(({target:t,open:n})=>t.open=n)]});function la(e){return h(m(e,"selected").pipe(ai(e,"selected")),Ze("selectable",e),ee(e).tap(()=>pe(e,"selectable.action",e)))}var et=class extends x{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};u(et,{tagName:"c-option",init:[g("value"),Z("view"),v("selected"),v("hidden"),v("focused")],augment:[V("option"),d(":host{display:contents} :host([hidden]){display:none;}"),ea,la,e=>{let t;return h(m(e,"view").switchMap(n=>n?(t?.remove(),e.rendered=t=new n,t.appendChild(N("slot")),j(e).append(t),h(m(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),m(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,R)))}]});var pr=class extends x{};u(pr,{tagName:"c-page",augment:[Qn,d(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${Q("background")}
}`),_]});var ll=/([^&=]+)=?([^&]*)/g,ul=/:([\w_$@]+)/g,pl=/\/\((.*?)\)/g,dl=/(\(\?)?:\w+/g,fl=/\*\w+/g,ml=/[-{}[\]+?.,\\^$|#\s]/g,yo="@@cxlRoute",Ee={location:window.location,history:window.history};function gl(e){let t=[];return[new RegExp("^/?"+e.replace(ml,"\\$&").replace(pl,"\\/?(?:$1)?").replace(dl,function(r,o){return t.push(r.substr(1)),o?r:"([^/?]*)"}).replace(fl,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function hl(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function po(e,t){return t?e.replace(ul,(n,r)=>t[r]||""):e}function xl(e){let t={},n;for(;n=ll.exec(e);)n[1]!==void 0&&(t[n[1]]=decodeURIComponent(n[2]??""));return t}var fo=class{path;regex;parameters;constructor(t){this.path=t=hl(t),[this.regex,this.parameters]=gl(t)}_extractQuery(t){let n=t.indexOf("?");return n===-1?{}:xl(t.slice(n+1))}getArguments(t){let r=this.regex.exec(t)?.slice(1);if(!r)return;let o=this._extractQuery(t);return r.forEach((c,i)=>{let a=i===r.length-1?c||"":c?decodeURIComponent(c):"",s=this.parameters[i];s&&(o[s]=a)}),o}test(t){return this.regex.test(t)}toString(){return this.path}},mo=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new fo(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${Math.random().toString()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let n=this.definition.render();n[yo]=this;for(let r in t)t[r]!==void 0&&(n[r]=t[r]);return n}},go=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(n=>n.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(n=>n.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function bl(e){return e[yo]}function ho(e,t){let n=new URL(e,`http://localhost/${t}`);return{path:n.pathname.slice(1),hash:n.hash.slice(1)}}var yl={getHref(e){return`${Ee.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=yn()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let n=this.getHref(e);n!==`${location.pathname}${location.search}${location.hash}`&&Ee.history.pushState({url:e},"",n)}},deserialize(){return{path:Ee.location.search.slice(1),hash:Ee.location.hash.slice(1)}}};function yn(){return Ee.history.state}var vl={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=yn()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let n=this.getHref(e);n!==`${location.pathname}${location.search}${location.hash}`&&Ee.history.pushState({url:e},"",n||"/")}},deserialize(){return{path:Ee.location.pathname,hash:Ee.location.hash.slice(1)}}},ua={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=ua.getHref(e);Ee.location.hash!==t&&(Ee.location.hash=t)},deserialize(){return ho(Ee.location.hash.slice(1),"")}},pa={hash:ua,path:vl,query:yl},xo=class{callbackFn;state;routes=new go;instances={};root;lastGo;constructor(t){this.callbackFn=t}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let n=new mo(t);return this.routes.register(n),n}go(t){this.lastGo=t;let n=this.state?.url,r=typeof t=="string"?ho(t,n?.path??""):t,o=r.path;if(o!==n?.path){let c=this.routes.findRoute(o);if(!c)throw new Error(`Path: "${o}" not found`);let i=c.path?.getArguments(o);if(c.redirectTo)return this.go(po(c.redirectTo,i));let a=this.execute(c,i);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${o}" could not be created`);this.updateState({url:r,arguments:i,route:c,current:a,root:this.root})}else this.state&&r.hash!=n.hash&&this.updateState({...this.state,url:r})}getPath(t,n){let o=this.routes.get(t)?.path;return o&&po(o.toString(),n)}isActiveUrl(t){let n=this.state?.url;if(!n)return!1;let r=ho(t,n.path);return!!Object.values(this.instances).find(o=>{let c=o[yo],i=this.state?.arguments;if(c?.path?.test(r.path)&&(!r.hash||r.hash===n.hash)){if(i){let a=c.path.getArguments(r.path);for(let s in a)if(i[s]!=a[s])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,n){let r=this.instances[t],o;if(r)for(o in n){let c=n[o];c!==void 0&&(r[o]=c)}return r}executeRoute(t,n,r){let o=t.parent,c=o&&this.routes.get(o),i=t.id,a=c&&this.executeRoute(c,n,r),s=this.findRoute(i,n)||t.create(n);return a?s.parentNode!==a&&a.appendChild(s):this.root=s,r[i]=s,s}discardOldRoutes(t){let n=this.instances;for(let r in n){let o=n[r];o&&t[r]!==o&&(o.parentNode?.removeChild(o),delete n[r])}}execute(t,n){let r={},o=this.executeRoute(t,n||{},r);return this.discardOldRoutes(r),this.instances=r,o}},Ht=new At,da=new At,me=new xo(()=>Ht.next());function wl(e){let t=e;for(;t=t.parentElement;)if(t.scrollTop!==0)return t.scrollTo(0,0)}function fa(e){let t;return Ht.tap(()=>{let{root:n}=me.getState();n.parentNode!==e?e.appendChild(n):t&&t!==n&&t.parentNode&&e.removeChild(t),t=n}).raf(()=>{let n=me.getState().url;if(n.hash)e.querySelector(`#${n.hash},a[name="${n.hash}"]`)?.scrollIntoView();else{let r=yn()?.lastAction;e.parentElement&&r&&r!=="pop"&&wl(e)}})}function El(e,t=pa.query){return h(oe(()=>da.next(t)),e.tap(()=>me.go(t.deserialize())),Ht.tap(()=>t.serialize(me.getState().url))).catchError(n=>{if(n?.name==="SecurityError")return R;throw n})}function Sl(){return Fe(B(location.hash.slice(1)),S(window,"hashchange").map(()=>location.hash.slice(1)))}var dr;function Cl(){if(!dr){dr=new Yt(history.state);let e=history.pushState;history.pushState=function(...t){let n=e.apply(this,t),r=yn();return r&&(r.lastAction="push",dr?.next(r)),n}}return h(S(window,"popstate").map(()=>{let e=yn();return e&&(e.lastAction="pop"),e}),dr)}function Al(){let e;return h(Sl(),Cl()).map(()=>window.location).filter(t=>{let n=t.href!==e;return e=t.href,n})}var Th=Ht.raf().map(()=>{let e=[],t=me.getState(),n=t.current;do n.routeTitle&&e.unshift({title:n.routeTitle,first:n===t.current,path:kl(n)});while(n=n.parentNode);return e});function kl(e){let t=bl(e);return t&&po(t.path?.toString()||"",me.state?.arguments||{})}function fr(e,t,n=t){return h(le(da,Ye(e)).tap(([r])=>{e.href!==void 0&&(t.href=e.external?e.href:r.getHref(e.href)),t.target=e.target||""}),ee(t).tap(r=>{e.target||r.preventDefault()}),ee(n).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):me.go(e.href))}))}function Nl(e,t){let n=document.createElement("div");return n.style.display="contents",n.routeTitle=t,n.appendChild(e.content.cloneNode(!0)),n}var bo=class extends x{strategy="query";get state(){return me.state}go(t){return me.go(t)}};u(bo,{tagName:"c-router",init:[g("strategy")],augment:[e=>{function t(n){let r=n.dataset;if(r.registered)return;r.registered="true";let o=r.title||void 0;me.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:n.hasAttribute("data-default"),redirectTo:r.redirectto,render:Nl.bind(null,n,o)})}return ze().switchMap(()=>{for(let n of Array.from(e.children))n instanceof HTMLTemplateElement&&t(n);return h(Pn(e).tap(n=>{n.type==="added"&&n.value instanceof HTMLTemplateElement&&t(n.value)}),m(e,"strategy").switchMap(n=>{let r=pa[n];return El(Al(),r).catchError((o,c)=>(console.error(o),c))}))})}]});function wo(e,t=e){return h(Tl(e,t).ignoreElements(),Ht.map(()=>e.href!==void 0&&me.isActiveUrl(e.href)))}function Tl(e,t=e){let n=N("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return n.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,j(e).append(n),h(fr(e,n),S(n,"click").tap(r=>{r.stopPropagation(),Zt(r)||e.dispatchEvent(new PointerEvent(r.type,r)),pe(e,"drawer.close",void 0)}),ee(t).tap(r=>{Zt(r)&&n.click()}))}var vo=class extends x{href};u(vo,{tagName:"c-router-selectable",init:[g("href")],augment:[_e,()=>N("slot"),e=>ne(()=>{let t=e.parentElement;return wo(e,t).raf(n=>{t.selected=n})})]});var vn=class extends xt{href;external=!1;target};u(vn,{tagName:"c-router-item",init:[g("href"),g("external"),g("target")],augment:[e=>wo(e).tap(t=>{e.selected=t})]});var bt=class extends x{href;focusable=!1;external=!1;dismiss=!1;target};u(bt,{tagName:"c-router-link",init:[g("href"),g("focusable"),g("external"),g("target"),g("dismiss")],augment:[d(`
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
	`),e=>{let t=N("a",{className:"link"},N("slot"));return j(e).append(t),h(m(e,"focusable").tap(n=>t.tabIndex=n?0:-1),Bi(e),fr(e,t))}]});var wn=class extends bt{focusable=!0};u(wn,{tagName:"c-router-a",augment:[d(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var En=class extends x{};u(En,{tagName:"c-router-outlet",init:[],augment:[V("main"),_e,fa,_]});var J=class extends x{font};u(J,{tagName:"c-t",init:[v("font")],augment:[d(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${hi.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${L("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${L("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${L("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${L("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${L("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${L("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),_,e=>m(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var Eo=class extends wn{};u(Eo,{tagName:"doc-a"});var yt=class extends gn{};u(yt,{tagName:"doc-search-input",augment:[e=>{let t=ue([]),n=f(un,{$:r=>S(r,"search").tap(o=>{let c=o.detail,i=[],a=1e3;if(c){let s=ro(c);for(let l of CONFIG.symbols)if(s.test(l.name)&&(i.push(l),a--<0))break}t.next(i)})},sr({source:t,render:r=>f(et,{value:r.map(o=>o.href)},r.map(o=>o.name)),empty:()=>f($e,{slot:"empty",pad:16},"No Results Found")}));n.style.maxHeight="50%",e.size=-2,e.append(f(we,{name:"search"}),f(jt,{$:r=>m(r,"selected").tap(o=>{let c=o?.value;c&&(CONFIG.spa?me.go(c):location.href=c,r.value="")})}),n)}]});var Sn=class extends x{};u(Sn,{tagName:"doc-search",augment:[d(`
:host { display: block; }
c-appbar-contextual {
	position: absolute;
	inset: 0;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	z-index: 1;
}
		`),e=>{let t=f(Jn),n=f(en,{target:t},f(be,{icon:"search"})),r=f(yt);return e.shadowRoot?.append(t,n),Rt(document.body).tap(o=>{o==="xsmall"?(t.style.display="",n.style.display="",t.append(r)):(t.open=!1,t.style.display="none",n.style.display="none",r.parentNode!==e.shadowRoot&&e.shadowRoot?.append(r))})}]});var Cn=class extends nn{sticky=!0};u(Cn,{tagName:"doc-appbar",augment:[d(te("large",":host{display:none}")),e=>{e.append(f(bn,{target:"navbar"}),f(ce,{grow:!0},CONFIG.packageName),f(Sn))}]});var Ml=["Property","Method","Function","Event","Class","Namespace","Interface","Enum","TypeAlias","Attribute","Component","Constant"],ma=Ml.map(e=>`:host([kind=${e}]){--cxl-color-surface:var(--3doc-chip-${e}-bg);--cxl-color-on-surface:var(--3doc-chip-${e}-fg)}`).join(""),Ue=class extends gt{kind;size=-1};u(Ue,{tagName:"doc-pill",init:[v("kind")],augment:[d(`
:host { ${L("code")}; border: 0; }
${ma}`)]});var An=class extends ht{kind;size=-1};u(An,{tagName:"doc-chip",init:[v("kind")],augment:[d(`
:host { ${L("code")} }
${ma}`)]});var So=class extends x{name;kind};u(So,{tagName:"doc-card",init:[g("kind"),g("name")],augment:[d(`
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
	${Q("surface-container-high")}	
}
#body { padding: 16px; }
#title { margin-inline-end: auto; }
${te("medium",":host{}")}
		`),e=>{e.shadowRoot?.append(f(mt,{color:"surface",variant:"outlined"},f("div",{id:"header"},f(Ue,{kind:m(e,"kind")},m(e,"kind")),f(J,{id:"title",font:"title-medium"},m(e,"name")),f("slot",{name:"tags"})),f("div",{id:"body"},f("slot"))))}]});var kn=class extends x{language="html";formatter=t=>{let n;try{n=hljs.highlight(t,{language:this.language}).value}catch{n=t}return`<code>${n}</code>`}};u(kn,{tagName:"doc-hl",init:[g("language")],augment:[d(`
:host {
	display: block;
	padding:16px; border-radius: 8px;
	${Q("surface-container")}
}
.hljs {
	white-space: pre-wrap; font: var(--cxl-font-code);
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

	`),e=>{let t=f("div",{className:"hljs"});return t.style.tabSize="4",j(e).append(t),Me(e).switchMap(()=>Bn(e).raf(()=>{let n=Array.from(e.childNodes).map(r=>r.textContent).join("");t.innerHTML=n&&e.formatter?e.formatter(n):n}))}]});var Co=class extends x{};u(Co,{tagName:"doc-grd",augment:[d(`:host {
	padding: 8px 16px;
	display: grid;
	gap: 16px 12px;
}
${te("small",":host{grid-template-columns:repeat(2, minmax(0px,1fr))}")}
${te("medium",":host{grid-template-columns:repeat(3, minmax(0px,1fr))}")}
${te("large",":host{grid-template-columns:repeat(4, minmax(0px,1fr))}")}
`),_]});var Nn=class extends x{view="mobile";header="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";libraries;getLibraryUrl(t){return`https://cdn.jsdelivr.net/npm/${t}`}};u(Nn,{tagName:"doc-demo-bare",init:[g("view"),g("libraries"),g("header")],augment:[d(`
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
	`),e=>{let t=m(e,"view"),n=ue("container"),r=f(xn,{className:n}),o=f(kn,{className:t.map(l=>l==="source"?"source visible":"source")}),c=f("div",{id:"toolbar"},f("slot",{name:"toolbar"}),f(be,{$:l=>ee(l).mergeMap(async()=>{await navigator.clipboard.writeText(i),l.icon="done",setTimeout(()=>l.icon="content_copy",2e3)}),height:20,icon:"content_copy",title:"Copy source to clipboard",className:t.map(l=>l==="source"?"icon":"icon hide")}),f(pn,{$:l=>m(l,"value").tap(b=>{e.view=b}),id:"view",size:-2},f(et,{value:"desktop"},"Preview"),f(et,{value:"source"},"Code"))),i;function a(l){let b=l==="desktop";n.next(b?"container":"container cmobile")}function s(){let l=e.childNodes[0]?.textContent?.trim()||"";if(!l)return;let b=e.libraries?e.libraries.split(",").map(A=>`<script type="module" src="${e.getLibraryUrl(A)}"><\/script>`).join(""):"";r.srcdoc=`${e.header}${b}${l}`,i=l,o.replaceChildren(new Text(l))}return j(e).append(c,f("div",{id:"body"},f(dn,{className:t.map(l=>l==="source"?"parent":`parent visible ${l}`)},r),o)),h(m(e,"view").tap(a),Me(e).switchMap(()=>Bn(e).raf(s)))}]});var Tn=class extends Nn{header=this.getHeader();getHeader(){let t="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";return typeof CONFIG<"u"?t+`${CONFIG.demoStyles?`<style>${CONFIG.demoStyles}</style>`:""}${CONFIG.demoScripts?.map(n=>`<script type="module" src="${n}"><\/script>`).join("")??""}`:t}};u(Tn,{tagName:"doc-demo"});function ga(e){let t=e.index;function n(a){if(!(!a||typeof a=="string")&&typeof a=="number")return t.find(s=>s.id===a)}function r(a){if(!(!a||typeof a=="string")){if(typeof a=="number"){let s=t.find(l=>l.id===a);return s&&(s.kind===4||s.kind===8)?s:s?r(s.resolvedType??s.type):void 0}return a.kind===6?n(a.type):a.resolvedType&&typeof a.resolvedType!="string"?a.resolvedType:a}}function o(a,s){if(a.children){for(let l of a.children)!l.name||l.flags&&l.flags&128||(s[l.name]??=l);return s}}function c(a,s={}){o(a,s);let l=r(a.type);if(l?.children)for(let b of l.children){let A=r(b);if(!A||A.kind!==35||A.name==="Component")break;c(A,s)}return s}function i(a){return a.kind===17||a.kind===16||a.kind===11||a.kind===13}return{getNodeProperties:c,getTypeSummary:r,isFunction:i,getRef:n,json:e}}var Il={31:"Constants",1:"Variables",4:"Interfaces",8:"Classes",10:"Properties",11:"Methods",12:"Getters",13:"Setters",14:"Constructor",16:"Functions",22:"Enums",35:"Components",36:"Attributes",2:"Type Alias",38:"Call Signature",39:"Construct Signature",44:"Events",24:"Index Signature",25:"Exports",37:"Namespaces"};function ha(e){return typeof e=="string"?e:e.map(t=>t.value).join(" ")}function Ol(e){return e.name?`docs/ui-${e.name}`:void 0}function Dl(e){let t=Ol(e),n=e.name??"?";return t?f("a",{href:t},n):n}function xa({summary:e,summaryJson:t,link:n=Dl,uiCdn:r,importmap:o}){let{getTypeSummary:c,getRef:i,isFunction:a}=ga(t),s=t.index;function l(E){if(E)return typeof E=="string"?E:c(E)??(typeof E=="number"?void 0:E.name)}function b(E){return E?"&lt;"+E.map(C=>M(C)+(C.kind!==6&&C.type?` extends ${M(C.type)}`:"")).join(", ")+"&gt;":""}function A(E){return["{ ",...E.children?.map(ge).flatMap(X("; "))??[]," }"]}function M(E){let C=l(E);if(!C||typeof C=="string")return[C||"?"];switch(C.kind){case 5:return C.children?.map(M).flatMap(X(" | "))??[];case 23:case 32:return[C.name??"?"];case 34:return A(C);case 15:return[...M(C.type),"[]"];case 4:case 8:case 35:{let z=C.typeP?b(C.typeP):void 0;return[n(C),z]}case 17:return ge(C);case 33:{let z=i(E);return[z?n(z):C.name??"?"]}case 21:return[...M(C.children?.[0]),"[",...M(C.children?.[1]),"]"];default:console.log(C)}return[]}function P(E){let C=E.flags??0;return[`${`${C&4?"public ":C&8?"private":C&16?"protected ":""}${C&262144?"...":""}${E.name}${C&524288?"?":""}`}: `,...M(E.type)]}function H(E){return["(",...E?.map(P).flatMap(X(", "))??[],")"]}function $(E){let C=E.flags??0,z=E.kind===12?"get ":E.kind===13?"set ":void 0;return[C&32?"static ":"",C&64?"readonly ":"",C&128?"abstract ":"",z]}function K(E){return["[",...E.parameters?.flatMap(ge)??[],"]: ",...E.type?M(E.type):["?"]]}function X(E){return(C,z)=>z!==0?[...E,...C]:C}function ge(E){if(E.kind===24)return K(E);if(E.kind===45&&E.children?.[0])return["...",...M(E.children[0])];let C=E.flags&&E.flags&524288,z=a(E)?H(E.parameters):[],p=E.kind===17;return[...$(E),E.name,C?"?":"",...z,p?" => ":": ",...M(E.resolvedType??E.type)]}function De(E){return[f("h3",{},f(J,{font:"title-large"},...ge(E))),...rt(E)]}function Se(E,C){if(!E.children)return[];let z={};for(let p of E.children)p.kind!==14&&p.kind!==0&&(p.flags||0)&4&&!C?.(p)&&(z[p.kind]??={name:Il[p.kind]??"",nodes:[]}).nodes.push(p);return Object.values(z).sort(zi("name")).flatMap(p=>[f("h2",{},p.name),...p.nodes.flatMap(De)])}function nt(E){let C="";E=E.replace(/<caption>(.+?)<\/caption>/,(k,F)=>(C=F,""));let z=`<style>html{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;overflow-x:hidden;overflow-y:auto;padding:24px;gap:32px;min-height:96px;color:var(--cxl-color-on-background);
background-color:var(--cxl-color-background)}</style>`,p=(o??"")+`<script type="module" src="${r}"><\/script>`,y=f(Tn,{header:z+p},E);return[C?f(J,{font:"title-medium"},C):void 0,y]}function Le(E){return s.find(C=>C.name===E)}function Gt(E){let C=E.flatMap(z=>{let p=z.value,y=ha(p);if(typeof p=="string"){let k=Le(p);y=k?n(k):p}return[y,", "]});return C.pop(),f("p",{},"Related: ",C)}function he({src:E}){let C=f("div");return C.textContent=E,C}function rt(E){let C=E.docs;if(!C?.content)return[];let z=[],p=C.content.flatMap(y=>{let k=ha(y.value);return y.tag==="icon"||y.tag==="title"?[]:y.tag==="example"||y.tag==="demo"||y.tag==="demoonly"?nt(k):y.tag==="see"?(z.push(y),[]):y.tag==="return"?[f(J,{font:"headline-small"},"Returns"),f("p",void 0,k)]:y.tag==="param"?[f("p",void 0,k)]:[y.tag?f("p",void 0,`${y.tag}: `,k):he({src:k})]});return z.length&&p.push(Gt(z)),p}function Et(E){let C=[],z=c(E);if(!(!z||z.kind!==33))return z.children?.forEach(p=>{if(typeof p!="object")return;let y=c(p);y&&y.name!=="Component"&&C.push(n(y))}),f(J,{font:"headline-small"}," ",...C.length?["extends ",C]:[])}function St(E){let C=c(E.type),z=[];if(!C?.children)return[];for(let p of C.children){let y=c(p);if(!y||y.kind!==35||y.name==="Component")break;let k=Se(y,F=>!!((F.flags??0)&128));k.length&&z.push(f("br"),f(J,{font:"h6"},"Inherited from ",n(y)),...k),z.push(...St(y))}return z}let Ct=e.kind===35&&e.docs?.tagName;return f("div",{},f("h1",{},e.name," ",e.type&&Et(e.type)," ",Ct?f(J,{font:"title-medium"},`<${Ct}>`):""),...rt(e),...Se(e),...St(e))}var Mn=class extends x{name;summary;uicdn;importmap=""};u(Mn,{tagName:"doc-page",init:[Z("name"),Z("summary"),Z("uicdn")],augment:[e=>Ye(e).raf(()=>{if(e.replaceChildren(),!e.name||!e.summary)return;let t=e.name,n=e.summary.index.find(r=>r.name===t);n&&e.append(xa({summary:n,summaryJson:e.summary,uiCdn:e.uicdn??"",importmap:e.importmap}))})]});q.colors["outline-variant"]="rgb(219, 221, 225)";var Ao=class extends pt{summary;sheetstart=!0};u(Ao,{tagName:"doc-root",augment:[e=>{let t=ct();fetch("summary.json").then(n=>n.json()).then(n=>t.next(n)).catch(n=>console.error(n)),e.append(f(Mn,{summary:t}))}]});var ko=class extends x{summary;selected};u(ko,{tagName:"doc-nav-list",init:[Z("summary"),Z("selected")],augment:[e=>sr({source:m(e,"summary").map(t=>t?.index),render:t=>f(xt,{$:n=>ee(n).tap(()=>e.selected=t.value.name),size:-2},t.value.name,t.value.docs?.beta?f(ht,{size:-2},"beta"):void 0)})(e)]});var No=class extends vn{};u(No,{tagName:"doc-item"});q.globalCss+=`
doc-ct { gap:8px;margin-bottom:24px;white-space:wrap;font:var(--cxl-font-code);font-size:18px;display:flex;align-items:center; }
doc-card dl { display: flex; flex-direction: column; }
doc-card dt { border-inline-start: 2px solid var(--cxl-color-outline-variant); padding-inline-start: 16px; }
doc-card dd { border-inline-start: 2px solid var(--cxl-color-outline-variant); margin-inline-start: 0; padding-inline-start: 16px; margin-bottom:16px; }
:last-child{margin-bottom:0}
code{border-radius:4px;background-color:var(--cxl-color-surface-container);color:var(--cxl-color-on-surface);padding:2px 4px;${L("code")}}
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
#page { padding: 16px; flex-grow: 1; ${L("body-large")}; overflow-y: auto; }
#pagebody { margin: 0 auto; max-width:1200px; }
#navbar[responsiveon] {
	overflow:hidden; width:320px;
	box-sizing: border-box;
	flex-grow: 1;
}
::slotted([slot=navbar]) { padding: 8px; }
c-application { opacity: 0; }
c-application[ready] { opacity: 1; }
#version{margin-left:auto;}
#navbar-container {
	max-width:320px;
	width: 0;
	visibility: hidden;
	${Q("surface-container-low")}}
${te("large",`
#navbar-container { width: auto; visibility: visible; }
#page { padding: 48px 32px; }
`)}
		`),e=>{e.style.opacity="1";let t=f($t,{id:"navbar",responsive:"large"},f("slot",{name:"navbar"})),n=f(pt,void 0,f(Cn),f(ce,{id:"body"},f(ce,{vflex:!0,id:"navbar-container"},f(ce,{pad:16,vpad:24,middle:!0},f(J,{font:"title-medium"},CONFIG.packageName),f(J,{id:"version",font:"title-small"},CONFIG.activeVersion)),f(He),f($e,{pad:16},f(yt)),t,f(He),f(ce,{pad:16},f(ce,{grow:!0}),f(hn,{persistkey:"3doc.theme"}))),f("div",{id:"page"},f("div",{id:"pagebody"},f("slot")))));e.shadowRoot?.append(n),e.append(new En)}]});var Mo=class extends x{module;kind;tags};u(Mo,{tagName:"doc-page-header",init:[g("kind"),g("tags"),g("module")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
#title { margin-inline-end: auto; }
		`),e=>{e.shadowRoot?.append(f(J,{font:"title-small"},m(e,"module")),f(ce,{gap:16,middle:!0},f(Ue,{kind:m(e,"kind")},m(e,"kind")),f(J,{font:"headline-small",id:"title"},f("slot")),f("slot",{name:"tags"})),f(He))}]});var Ro=class extends mt{};u(Ro,{tagName:"doc-members",augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin: 32px 0; }
		`),e=>{e.variant="outlined",e.color="surface-container-low",e.pad=16,e.shadowRoot?.prepend(f(J,{font:"title-small"},"Members"))}]});var _o=class extends x{href};u(_o,{tagName:"doc-member",init:[g("href")],augment:[d(`
		`),e=>{e.shadowRoot?.append(f(bt,{href:m(e,"href")},f(An,void 0,f("slot"))))}]});var Io=class extends x{kind};u(Io,{tagName:"doc-group",init:[g("kind")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 8px; }
c-flex { flex-wrap: wrap; }
		`),e=>{e.shadowRoot?.append(f(ce,{gap:16,middle:!0},f(Ue,{kind:m(e,"kind")},m(e,"kind")),f(J,{font:"title-small"},"")),f(ce,{gap:8,middle:!0},f("slot")))}]});var za=us(Fa(),1);var br=za.default;function ja(e){let t=e.regex,n=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,o={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},c={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},i=e.inherit(c,{begin:/\(/,end:/\)/}),a=e.inherit(e.APOS_STRING_MODE,{className:"string"}),s=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),l={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[o]},{begin:/'/,end:/'/,contains:[o]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[c,s,a,i,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[c,i,s,a]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},o,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[s]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(n,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:n,relevance:0,starts:l}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(n,/>/))),contains:[{className:"name",begin:n,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}var yr="[A-Za-z$_][0-9A-Za-z$_]*",Ba=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],$a=["true","false","null","undefined","NaN","Infinity"],Ha=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Ua=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Va=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Ga=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Ya=[].concat(Va,Ha,Ua);function Cu(e){let t=e.regex,n=(k,{after:F})=>{let W="</"+k[0].slice(1);return k.input.indexOf(W,F)!==-1},r=yr,o={begin:"<>",end:"</>"},c=/<[A-Za-z0-9\\._:-]+\s*\/>/,i={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(k,F)=>{let W=k[0].length+k.index,ie=k.input[W];if(ie==="<"||ie===","){F.ignoreMatch();return}ie===">"&&(n(k,{after:W})||F.ignoreMatch());let ye,ot=k.input.substring(W);if(ye=ot.match(/^\s*=/)){F.ignoreMatch();return}if((ye=ot.match(/^\s+extends\s+/))&&ye.index===0){F.ignoreMatch();return}}},a={$pattern:yr,keyword:Ba,literal:$a,built_in:Ya,"variable.language":Ga},s="[0-9](_?[0-9])*",l=`\\.(${s})`,b="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",A={className:"number",variants:[{begin:`(\\b(${b})((${l})|\\.)?|(${l}))[eE][+-]?(${s})\\b`},{begin:`\\b(${b})\\b((${l})\\b|\\.)?|(${l})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},M={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},P={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"xml"}},H={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"css"}},$={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"graphql"}},K={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,M]},ge={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},De=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,P,H,$,K,{match:/\$\d+/},A];M.contains=De.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(De)});let Se=[].concat(ge,M.contains),nt=Se.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(Se)}]),Le={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:nt},Gt={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,t.concat(r,"(",t.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},he={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Ha,...Ua]}},rt={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},Et={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[Le],illegal:/%/},St={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function Ct(k){return t.concat("(?!",k.join("|"),")")}let E={match:t.concat(/\b/,Ct([...Va,"super","import"].map(k=>`${k}\\s*\\(`)),r,t.lookahead(/\s*\(/)),className:"title.function",relevance:0},C={begin:t.concat(/\./,t.lookahead(t.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},z={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},Le]},p="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",y={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(p)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[Le]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:nt,CLASS_REFERENCE:he},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),rt,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,P,H,$,K,ge,{match:/\$\d+/},A,he,{scope:"attr",match:r+t.lookahead(":"),relevance:0},y,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[ge,e.REGEXP_MODE,{className:"function",begin:p,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:nt}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:o.begin,end:o.end},{match:c},{begin:i.begin,"on:begin":i.isTrulyOpeningTag,end:i.end}],subLanguage:"xml",contains:[{begin:i.begin,end:i.end,skip:!0,contains:["self"]}]}]},Et,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[Le,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},C,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[Le]},E,St,Gt,z,{match:/\$[(.]/}]}}function Wa(e){let t=e.regex,n=Cu(e),r=yr,o=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],c={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},i={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:o},contains:[n.exports.CLASS_REFERENCE]},a={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},s=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],l={$pattern:yr,keyword:Ba.concat(s),literal:$a,built_in:Ya.concat(o),"variable.language":Ga},b={className:"meta",begin:"@"+r},A=($,K,X)=>{let ge=$.contains.findIndex(De=>De.label===K);if(ge===-1)throw new Error("can not find mode to replace");$.contains.splice(ge,1,X)};Object.assign(n.keywords,l),n.exports.PARAMS_CONTAINS.push(b);let M=n.contains.find($=>$.scope==="attr"),P=Object.assign({},M,{match:t.concat(r,t.lookahead(/\s*\?:/))});n.exports.PARAMS_CONTAINS.push([n.exports.CLASS_REFERENCE,M,P]),n.contains=n.contains.concat([b,c,i,P]),A(n,"shebang",e.SHEBANG()),A(n,"use_strict",a);let H=n.contains.find($=>$.label==="func.def");return H.relevance=0,Object.assign(n,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),n}br.registerLanguage("html",ja);br.registerLanguage("typescript",Wa);window.hljs=br;export{or as Body,Ao as ComponentList,Eo as DocA,To as DocApp,Cn as DocAppbar,So as DocCard,kn as DocCode,Tn as DocDemo,Co as DocGrid,Io as DocGroup,No as DocItem,_o as DocMember,Ro as DocMembers,$t as Drawer,He as Hr,we as Icon,cr as NavDropdown,ur as NavHeadline,ko as NavList,lr as NavTarget,Mn as Page,Mo as PageHeader,pr as UiPage};
