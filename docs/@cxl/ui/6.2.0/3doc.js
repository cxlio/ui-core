var Qi=Object.create;var yr=Object.defineProperty;var Ki=Object.getOwnPropertyDescriptor;var el=Object.getOwnPropertyNames;var tl=Object.getPrototypeOf,al=Object.prototype.hasOwnProperty;var rl=(e,t,a)=>()=>{if(a)throw a[0];try{return e&&(t=e(e=0)),t}catch(r){throw a=[r],r}};var nl=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(a){throw t=0,a}},ol=(e,t)=>{for(var a in t)yr(e,a,{get:t[a],enumerable:!0})},sl=(e,t,a,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of el(t))!al.call(e,n)&&n!==a&&yr(e,n,{get:()=>t[n],enumerable:!(r=Ki(t,n))||r.enumerable});return e};var il=(e,t,a)=>(a=e!=null?Qi(tl(e)):{},sl(t||!e||!e.__esModule?yr(a,"default",{value:e,enumerable:!0}):a,e));var Oo={};ol(Oo,{default:()=>yl,theme:()=>Io});var vl,Io,yl,Do=rl(()=>{"use strict";vl={primary:"#8ECFF2","on-primary":"#003548","primary-container":"#004D67","on-primary-container":"#C1E8FF",secondary:"#B5C9D7","on-secondary":"#1F333D","secondary-container":"#364954","on-secondary-container":"#D1E6F3",tertiary:"#C9C2EA","on-tertiary":"#312C4C","tertiary-container":"#474364","on-tertiary-container":"#E5DEFF",error:"#FFB4AB","on-error":"#690005","error-container":"#93000A","on-error-container":"#FFDAD6",background:"#0F1417","on-background":"#DFE3E7",surface:"#0F1417","on-surface":"#DFE3E7","surface-variant":"#40484D","on-surface-variant":"#C0C7CD",outline:"#8A9297","outline-variant":"#40484D",scrim:"rgb(0 0 0 / 0.5)","inverse-surface":"#DFE3E7","on-inverse-surface":"#2C3134","inverse-primary":"#186584","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#0F1417","surface-bright":"#353A3D","surface-container-lowest":"#0A0F12","surface-container-low":"#171C1F","surface-container":"#1B2023","surface-container-high":"#262B2E","surface-container-highest":"#313539",warning:"#FFC107","on-warning":"#212121","warning-container":"#4E3400","on-warning-container":"#FFF3CF",success:"#81C784","on-success":"#000","success-container":"#2E7D32","on-success-container":"#fff"},Io={name:"dark",colors:vl},yl=Io});var Oi=nl((_0,Ii)=>{"use strict";function wi(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(t=>{let a=e[t],r=typeof a;(r==="object"||r==="function")&&!Object.isFrozen(a)&&wi(a)}),e}var dr=class{constructor(t){t.data===void 0&&(t.data={}),this.data=t.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function Ei(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ot(e,...t){let a=Object.create(null);for(let r in e)a[r]=e[r];return t.forEach(function(r){for(let n in r)a[n]=r[n]}),a}var ru="</span>",hi=e=>!!e.scope,nu=(e,{prefix:t})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let a=e.split(".");return[`${t}${a.shift()}`,...a.map((r,n)=>`${r}${"_".repeat(n+1)}`)].join(" ")}return`${t}${e}`},qn=class{constructor(t,a){this.buffer="",this.classPrefix=a.classPrefix,t.walk(this)}addText(t){this.buffer+=Ei(t)}openNode(t){if(!hi(t))return;let a=nu(t.scope,{prefix:this.classPrefix});this.span(a)}closeNode(t){hi(t)&&(this.buffer+=ru)}value(){return this.buffer}span(t){this.buffer+=`<span class="${t}">`}},gi=(e={})=>{let t={children:[]};return Object.assign(t,e),t},Zn=class e{constructor(){this.rootNode=gi(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(t){this.top.children.push(t)}openNode(t){let a=gi({scope:t});this.add(a),this.stack.push(a)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(t){return this.constructor._walk(t,this.rootNode)}static _walk(t,a){return typeof a=="string"?t.addText(a):a.children&&(t.openNode(a),a.children.forEach(r=>this._walk(t,r)),t.closeNode(a)),t}static _collapse(t){typeof t!="string"&&t.children&&(t.children.every(a=>typeof a=="string")?t.children=[t.children.join("")]:t.children.forEach(a=>{e._collapse(a)}))}},Wn=class extends Zn{constructor(t){super(),this.options=t}addText(t){t!==""&&this.add(t)}startScope(t){this.openNode(t)}endScope(){this.closeNode()}__addSublanguage(t,a){let r=t.root;a&&(r.scope=`language:${a}`),this.add(r)}toHTML(){return new qn(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function ka(e){return e?typeof e=="string"?e:e.source:null}function Si(e){return St("(?=",e,")")}function ou(e){return St("(?:",e,")*")}function su(e){return St("(?:",e,")?")}function St(...e){return e.map(a=>ka(a)).join("")}function iu(e){let t=e[e.length-1];return typeof t=="object"&&t.constructor===Object?(e.splice(e.length-1,1),t):{}}function Jn(...e){return"("+(iu(e).capture?"":"?:")+e.map(r=>ka(r)).join("|")+")"}function ki(e){return new RegExp(e.toString()+"|").exec("").length-1}function lu(e,t){let a=e&&e.exec(t);return a&&a.index===0}var cu=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function Xn(e,{joinWith:t}){let a=0;return e.map(r=>{a+=1;let n=a,l=ka(r),o="";for(;l.length>0;){let s=cu.exec(l);if(!s){o+=l;break}o+=l.substring(0,s.index),l=l.substring(s.index+s[0].length),s[0][0]==="\\"&&s[1]?o+="\\"+String(Number(s[1])+n):(o+=s[0],s[0]==="("&&a++)}return o}).map(r=>`(${r})`).join(t)}var uu=/\b\B/,Ni="[a-zA-Z]\\w*",Qn="[a-zA-Z_]\\w*",Ci="\\b\\d+(\\.\\d+)?",Ai="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",Ti="\\b(0b[01]+)",pu="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",du=(e={})=>{let t=/^#![ ]*\//;return e.binary&&(e.begin=St(t,/.*\b/,e.binary,/\b.*/)),ot({scope:"meta",begin:t,end:/$/,relevance:0,"on:begin":(a,r)=>{a.index!==0&&r.ignoreMatch()}},e)},Na={begin:"\\\\[\\s\\S]",relevance:0},mu={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[Na]},fu={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[Na]},hu={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},fr=function(e,t,a={}){let r=ot({scope:"comment",begin:e,end:t,contains:[]},a);r.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let n=Jn("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return r.contains.push({begin:St(/[ ]+/,"(",n,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),r},gu=fr("//","$"),bu=fr("/\\*","\\*/"),xu=fr("#","$"),vu={scope:"number",begin:Ci,relevance:0},yu={scope:"number",begin:Ai,relevance:0},wu={scope:"number",begin:Ti,relevance:0},Eu={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[Na,{begin:/\[/,end:/\]/,relevance:0,contains:[Na]}]},Su={scope:"title",begin:Ni,relevance:0},ku={scope:"title",begin:Qn,relevance:0},Nu={begin:"\\.\\s*"+Qn,relevance:0},Cu=function(e){return Object.assign(e,{"on:begin":(t,a)=>{a.data._beginMatch=t[1]},"on:end":(t,a)=>{a.data._beginMatch!==t[1]&&a.ignoreMatch()}})},pr=Object.freeze({__proto__:null,APOS_STRING_MODE:mu,BACKSLASH_ESCAPE:Na,BINARY_NUMBER_MODE:wu,BINARY_NUMBER_RE:Ti,COMMENT:fr,C_BLOCK_COMMENT_MODE:bu,C_LINE_COMMENT_MODE:gu,C_NUMBER_MODE:yu,C_NUMBER_RE:Ai,END_SAME_AS_BEGIN:Cu,HASH_COMMENT_MODE:xu,IDENT_RE:Ni,MATCH_NOTHING_RE:uu,METHOD_GUARD:Nu,NUMBER_MODE:vu,NUMBER_RE:Ci,PHRASAL_WORDS_MODE:hu,QUOTE_STRING_MODE:fu,REGEXP_MODE:Eu,RE_STARTERS_RE:pu,SHEBANG:du,TITLE_MODE:Su,UNDERSCORE_IDENT_RE:Qn,UNDERSCORE_TITLE_MODE:ku});function Au(e,t){e.input[e.index-1]==="."&&t.ignoreMatch()}function Tu(e,t){e.className!==void 0&&(e.scope=e.className,delete e.className)}function Mu(e,t){t&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Au,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function $u(e,t){Array.isArray(e.illegal)&&(e.illegal=Jn(...e.illegal))}function Ru(e,t){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function _u(e,t){e.relevance===void 0&&(e.relevance=1)}var Iu=(e,t)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let a=Object.assign({},e);Object.keys(e).forEach(r=>{delete e[r]}),e.keywords=a.keywords,e.begin=St(a.beforeMatch,Si(a.begin)),e.starts={relevance:0,contains:[Object.assign(a,{endsParent:!0})]},e.relevance=0,delete a.beforeMatch},Ou=["of","and","for","in","not","or","if","then","parent","list","value"],Du="keyword";function Mi(e,t,a=Du){let r=Object.create(null);return typeof e=="string"?n(a,e.split(" ")):Array.isArray(e)?n(a,e):Object.keys(e).forEach(function(l){Object.assign(r,Mi(e[l],t,l))}),r;function n(l,o){t&&(o=o.map(s=>s.toLowerCase())),o.forEach(function(s){let i=s.split("|");r[i[0]]=[l,Fu(i[0],i[1])]})}}function Fu(e,t){return t?Number(t):Lu(e)?0:1}function Lu(e){return Ou.includes(e.toLowerCase())}var bi={},Et=e=>{console.error(e)},xi=(e,...t)=>{console.log(`WARN: ${e}`,...t)},Ht=(e,t)=>{bi[`${e}/${t}`]||(console.log(`Deprecated as of ${e}. ${t}`),bi[`${e}/${t}`]=!0)},mr=new Error;function $i(e,t,{key:a}){let r=0,n=e[a],l={},o={};for(let s=1;s<=t.length;s++)o[s+r]=n[s],l[s+r]=!0,r+=ki(t[s-1]);e[a]=o,e[a]._emit=l,e[a]._multi=!0}function Bu(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw Et("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),mr;if(typeof e.beginScope!="object"||e.beginScope===null)throw Et("beginScope must be object"),mr;$i(e,e.begin,{key:"beginScope"}),e.begin=Xn(e.begin,{joinWith:""})}}function ju(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw Et("skip, excludeEnd, returnEnd not compatible with endScope: {}"),mr;if(typeof e.endScope!="object"||e.endScope===null)throw Et("endScope must be object"),mr;$i(e,e.end,{key:"endScope"}),e.end=Xn(e.end,{joinWith:""})}}function Pu(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function zu(e){Pu(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),Bu(e),ju(e)}function Hu(e){function t(o,s){return new RegExp(ka(o),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(s?"g":""))}class a{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(s,i){i.position=this.position++,this.matchIndexes[this.matchAt]=i,this.regexes.push([i,s]),this.matchAt+=ki(s)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let s=this.regexes.map(i=>i[1]);this.matcherRe=t(Xn(s,{joinWith:"|"}),!0),this.lastIndex=0}exec(s){this.matcherRe.lastIndex=this.lastIndex;let i=this.matcherRe.exec(s);if(!i)return null;let c=i.findIndex((A,M)=>M>0&&A!==void 0),x=this.matchIndexes[c];return i.splice(0,c),Object.assign(i,x)}}class r{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(s){if(this.multiRegexes[s])return this.multiRegexes[s];let i=new a;return this.rules.slice(s).forEach(([c,x])=>i.addRule(c,x)),i.compile(),this.multiRegexes[s]=i,i}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(s,i){this.rules.push([s,i]),i.type==="begin"&&this.count++}exec(s){let i=this.getMatcher(this.regexIndex);i.lastIndex=this.lastIndex;let c=i.exec(s);if(this.resumingScanAtSamePosition()&&!(c&&c.index===this.lastIndex)){let x=this.getMatcher(0);x.lastIndex=this.lastIndex+1,c=x.exec(s)}return c&&(this.regexIndex+=c.position+1,this.regexIndex===this.count&&this.considerAll()),c}}function n(o){let s=new r;return o.contains.forEach(i=>s.addRule(i.begin,{rule:i,type:"begin"})),o.terminatorEnd&&s.addRule(o.terminatorEnd,{type:"end"}),o.illegal&&s.addRule(o.illegal,{type:"illegal"}),s}function l(o,s){let i=o;if(o.isCompiled)return i;[Tu,Ru,zu,Iu].forEach(x=>x(o,s)),e.compilerExtensions.forEach(x=>x(o,s)),o.__beforeBegin=null,[Mu,$u,_u].forEach(x=>x(o,s)),o.isCompiled=!0;let c=null;return typeof o.keywords=="object"&&o.keywords.$pattern&&(o.keywords=Object.assign({},o.keywords),c=o.keywords.$pattern,delete o.keywords.$pattern),c=c||/\w+/,o.keywords&&(o.keywords=Mi(o.keywords,e.case_insensitive)),i.keywordPatternRe=t(c,!0),s&&(o.begin||(o.begin=/\B|\b/),i.beginRe=t(i.begin),!o.end&&!o.endsWithParent&&(o.end=/\B|\b/),o.end&&(i.endRe=t(i.end)),i.terminatorEnd=ka(i.end)||"",o.endsWithParent&&s.terminatorEnd&&(i.terminatorEnd+=(o.end?"|":"")+s.terminatorEnd)),o.illegal&&(i.illegalRe=t(o.illegal)),o.contains||(o.contains=[]),o.contains=[].concat(...o.contains.map(function(x){return Uu(x==="self"?o:x)})),o.contains.forEach(function(x){l(x,i)}),o.starts&&l(o.starts,s),i.matcher=n(i),i}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=ot(e.classNameAliases||{}),l(e)}function Ri(e){return e?e.endsWithParent||Ri(e.starts):!1}function Uu(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(t){return ot(e,{variants:null},t)})),e.cachedVariants?e.cachedVariants:Ri(e)?ot(e,{starts:e.starts?ot(e.starts):null}):Object.isFrozen(e)?ot(e):e}var Vu="11.11.1",Yn=class extends Error{constructor(t,a){super(t),this.name="HTMLInjectionError",this.html=a}},Gn=Ei,vi=ot,yi=Symbol("nomatch"),Gu=7,_i=function(e){let t=Object.create(null),a=Object.create(null),r=[],n=!0,l="Could not find the language '{}', did you forget to load/include a language module?",o={disableAutodetect:!0,name:"Plain text",contains:[]},s={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Wn};function i(p){return s.noHighlightRe.test(p)}function c(p){let y=p.className+" ";y+=p.parentNode?p.parentNode.className:"";let N=s.languageDetectRe.exec(y);if(N){let L=ge(N[1]);return L||(xi(l.replace("{}",N[1])),xi("Falling back to no-highlight mode for this block.",p)),L?N[1]:"no-highlight"}return y.split(/\s+/).find(L=>i(L)||ge(L))}function x(p,y,N){let L="",W="";typeof y=="object"?(L=p,N=y.ignoreIllegals,W=y.language):(Ht("10.7.0","highlight(lang, code, ...args) has been deprecated."),Ht("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),W=p,L=y),N===void 0&&(N=!0);let se={code:L,language:W};k("before:highlight",se);let ve=se.result?se.result:A(se.language,se.code,N);return ve.code=se.code,k("after:highlight",ve),ve}function A(p,y,N,L){let W=Object.create(null);function se(w,T){return w.keywords[T]}function ve(){if(!I.keywords){ne.addText(q);return}let w=0;I.keywordPatternRe.lastIndex=0;let T=I.keywordPatternRe.exec(q),D="";for(;T;){D+=q.substring(w,T.index);let V=Me.case_insensitive?T[0].toLowerCase():T[0],ie=se(I,V);if(ie){let[Fe,Ji]=ie;if(ne.addText(D),D="",W[V]=(W[V]||0)+1,W[V]<=Gu&&(Aa+=Ji),Fe.startsWith("_"))D+=T[0];else{let Xi=Me.classNameAliases[Fe]||Fe;Te(T[0],Xi)}}else D+=T[0];w=I.keywordPatternRe.lastIndex,T=I.keywordPatternRe.exec(q)}D+=q.substring(w),ne.addText(D)}function lt(){if(q==="")return;let w=null;if(typeof I.subLanguage=="string"){if(!t[I.subLanguage]){ne.addText(q);return}w=A(I.subLanguage,q,!0,ro[I.subLanguage]),ro[I.subLanguage]=w._top}else w=F(q,I.subLanguage.length?I.subLanguage:null);I.relevance>0&&(Aa+=w.relevance),ne.__addSublanguage(w._emitter,w.language)}function be(){I.subLanguage!=null?lt():ve(),q=""}function Te(w,T){w!==""&&(ne.startScope(T),ne.addText(w),ne.endScope())}function Kn(w,T){let D=1,V=T.length-1;for(;D<=V;){if(!w._emit[D]){D++;continue}let ie=Me.classNameAliases[w[D]]||w[D],Fe=T[D];ie?Te(Fe,ie):(q=Fe,ve(),q=""),D++}}function eo(w,T){return w.scope&&typeof w.scope=="string"&&ne.openNode(Me.classNameAliases[w.scope]||w.scope),w.beginScope&&(w.beginScope._wrap?(Te(q,Me.classNameAliases[w.beginScope._wrap]||w.beginScope._wrap),q=""):w.beginScope._multi&&(Kn(w.beginScope,T),q="")),I=Object.create(w,{parent:{value:I}}),I}function to(w,T,D){let V=lu(w.endRe,D);if(V){if(w["on:end"]){let ie=new dr(w);w["on:end"](T,ie),ie.isMatchIgnored&&(V=!1)}if(V){for(;w.endsParent&&w.parent;)w=w.parent;return w}}if(w.endsWithParent)return to(w.parent,T,D)}function Gi(w){return I.matcher.regexIndex===0?(q+=w[0],1):(vr=!0,0)}function qi(w){let T=w[0],D=w.rule,V=new dr(D),ie=[D.__beforeBegin,D["on:begin"]];for(let Fe of ie)if(Fe&&(Fe(w,V),V.isMatchIgnored))return Gi(T);return D.skip?q+=T:(D.excludeBegin&&(q+=T),be(),!D.returnBegin&&!D.excludeBegin&&(q=T)),eo(D,w),D.returnBegin?0:T.length}function Zi(w){let T=w[0],D=y.substring(w.index),V=to(I,w,D);if(!V)return yi;let ie=I;I.endScope&&I.endScope._wrap?(be(),Te(T,I.endScope._wrap)):I.endScope&&I.endScope._multi?(be(),Kn(I.endScope,w)):ie.skip?q+=T:(ie.returnEnd||ie.excludeEnd||(q+=T),be(),ie.excludeEnd&&(q=T));do I.scope&&ne.closeNode(),!I.skip&&!I.subLanguage&&(Aa+=I.relevance),I=I.parent;while(I!==V.parent);return V.starts&&eo(V.starts,w),ie.returnEnd?0:T.length}function Wi(){let w=[];for(let T=I;T!==Me;T=T.parent)T.scope&&w.unshift(T.scope);w.forEach(T=>ne.openNode(T))}let Ca={};function ao(w,T){let D=T&&T[0];if(q+=w,D==null)return be(),0;if(Ca.type==="begin"&&T.type==="end"&&Ca.index===T.index&&D===""){if(q+=y.slice(T.index,T.index+1),!n){let V=new Error(`0 width match regex (${p})`);throw V.languageName=p,V.badRule=Ca.rule,V}return 1}if(Ca=T,T.type==="begin")return qi(T);if(T.type==="illegal"&&!N){let V=new Error('Illegal lexeme "'+D+'" for mode "'+(I.scope||"<unnamed>")+'"');throw V.mode=I,V}else if(T.type==="end"){let V=Zi(T);if(V!==yi)return V}if(T.type==="illegal"&&D==="")return q+=`
`,1;if(xr>1e5&&xr>T.index*3)throw new Error("potential infinite loop, way more iterations than matches");return q+=D,D.length}let Me=ge(p);if(!Me)throw Et(l.replace("{}",p)),new Error('Unknown language: "'+p+'"');let Yi=Hu(Me),br="",I=L||Yi,ro={},ne=new s.__emitter(s);Wi();let q="",Aa=0,ct=0,xr=0,vr=!1;try{if(Me.__emitTokens)Me.__emitTokens(y,ne);else{for(I.matcher.considerAll();;){xr++,vr?vr=!1:I.matcher.considerAll(),I.matcher.lastIndex=ct;let w=I.matcher.exec(y);if(!w)break;let T=y.substring(ct,w.index),D=ao(T,w);ct=w.index+D}ao(y.substring(ct))}return ne.finalize(),br=ne.toHTML(),{language:p,value:br,relevance:Aa,illegal:!1,_emitter:ne,_top:I}}catch(w){if(w.message&&w.message.includes("Illegal"))return{language:p,value:Gn(y),illegal:!0,relevance:0,_illegalBy:{message:w.message,index:ct,context:y.slice(ct-100,ct+100),mode:w.mode,resultSoFar:br},_emitter:ne};if(n)return{language:p,value:Gn(y),illegal:!1,relevance:0,errorRaised:w,_emitter:ne,_top:I};throw w}}function M(p){let y={value:Gn(p),illegal:!1,relevance:0,_top:o,_emitter:new s.__emitter(s)};return y._emitter.addText(p),y}function F(p,y){y=y||s.languages||Object.keys(t);let N=M(p),L=y.filter(ge).filter(kt).map(be=>A(be,p,!1));L.unshift(N);let W=L.sort((be,Te)=>{if(be.relevance!==Te.relevance)return Te.relevance-be.relevance;if(be.language&&Te.language){if(ge(be.language).supersetOf===Te.language)return 1;if(ge(Te.language).supersetOf===be.language)return-1}return 0}),[se,ve]=W,lt=se;return lt.secondBest=ve,lt}function U(p,y,N){let L=y&&a[y]||N;p.classList.add("hljs"),p.classList.add(`language-${L}`)}function z(p){let y=null,N=c(p);if(i(N))return;if(k("before:highlightElement",{el:p,language:N}),p.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",p);return}if(p.children.length>0&&(s.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(p)),s.throwUnescapedHTML))throw new Yn("One of your code blocks includes unescaped HTML.",p.innerHTML);y=p;let L=y.textContent,W=N?x(L,{language:N,ignoreIllegals:!0}):F(L);p.innerHTML=W.value,p.dataset.highlighted="yes",U(p,N,W.language),p.result={language:W.language,re:W.relevance,relevance:W.relevance},W.secondBest&&(p.secondBest={language:W.secondBest.language,relevance:W.secondBest.relevance}),k("after:highlightElement",{el:p,result:W,text:L})}function te(p){s=vi(s,p)}let X=()=>{Ae(),Ht("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function he(){Ae(),Ht("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let Oe=!1;function Ae(){function p(){Ae()}if(document.readyState==="loading"){Oe||window.addEventListener("DOMContentLoaded",p,!1),Oe=!0;return}document.querySelectorAll(s.cssSelector).forEach(z)}function st(p,y){let N=null;try{N=y(e)}catch(L){if(Et("Language definition for '{}' could not be registered.".replace("{}",p)),n)Et(L);else throw L;N=o}N.name||(N.name=p),t[p]=N,N.rawDefinition=y.bind(null,e),N.aliases&&it(N.aliases,{languageName:p})}function De(p){delete t[p];for(let y of Object.keys(a))a[y]===p&&delete a[y]}function Vt(){return Object.keys(t)}function ge(p){return p=(p||"").toLowerCase(),t[p]||t[a[p]]}function it(p,{languageName:y}){typeof p=="string"&&(p=[p]),p.forEach(N=>{a[N.toLowerCase()]=y})}function kt(p){let y=ge(p);return y&&!y.disableAutodetect}function Nt(p){p["before:highlightBlock"]&&!p["before:highlightElement"]&&(p["before:highlightElement"]=y=>{p["before:highlightBlock"](Object.assign({block:y.el},y))}),p["after:highlightBlock"]&&!p["after:highlightElement"]&&(p["after:highlightElement"]=y=>{p["after:highlightBlock"](Object.assign({block:y.el},y))})}function Ct(p){Nt(p),r.push(p)}function S(p){let y=r.indexOf(p);y!==-1&&r.splice(y,1)}function k(p,y){let N=p;r.forEach(function(L){L[N]&&L[N](y)})}function P(p){return Ht("10.7.0","highlightBlock will be removed entirely in v12.0"),Ht("10.7.0","Please use highlightElement now."),z(p)}Object.assign(e,{highlight:x,highlightAuto:F,highlightAll:Ae,highlightElement:z,highlightBlock:P,configure:te,initHighlighting:X,initHighlightingOnLoad:he,registerLanguage:st,unregisterLanguage:De,listLanguages:Vt,getLanguage:ge,registerAliases:it,autoDetection:kt,inherit:vi,addPlugin:Ct,removePlugin:S}),e.debugMode=function(){n=!1},e.safeMode=function(){n=!0},e.versionString=Vu,e.regex={concat:St,lookahead:Si,either:Jn,optional:su,anyNumberOfTimes:ou};for(let p in pr)typeof pr[p]=="object"&&wi(pr[p]);return Object.assign(e,pr),e},Ut=_i({});Ut.newInstance=()=>_i({});Ii.exports=Ut;Ut.HighlightJS=Ut;Ut.default=Ut});var Ge={};function no(e,t){let a=!1,r={error:n,unsubscribe:l,get closed(){return a},signal:new Le,next(o){if(!a)try{e.next?.(o)}catch(s){n(s)}},complete(){if(!a)try{e.complete?.()}finally{l()}}};e.signal?.subscribe(l);function n(o){if(a)throw o;if(!e.error)throw l(),o;try{e.error(o)}finally{l()}}function l(){a||(a=!0,r.signal.next())}try{t?.(r)}catch(o){n(o)}return r}var _=class{__subscribe;constructor(e){this.__subscribe=e}then(e,t){return io(this).then(e,t)}pipe(...e){return e.reduce((t,a)=>a(t),this)}subscribe(e){return no(!e||typeof e=="function"?{next:e}:e,this.__subscribe)}},Be=class extends _{closed=!1;signal=new Le;observers=new Set;constructor(){super(e=>this.onSubscribe(e))}next(e){if(!this.closed)for(let t of Array.from(this.observers))t.closed||t.next(e)}error(e){if(!this.closed){this.closed=!0;let t=!1,a;for(let r of Array.from(this.observers))try{r.error(e)}catch(n){t=!0,a=n}if(t)throw a}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(e=>e.complete()),this.observers.clear())}onSubscribe(e){this.closed?e.complete():(this.observers.add(e),e.signal.subscribe(()=>this.observers.delete(e)))}},Le=class extends _{closed=!1;observers=new Set;constructor(){super(e=>{this.closed?(e.next(),e.complete()):this.observers.add(e)})}next(){if(!this.closed){this.closed=!0;for(let e of Array.from(this.observers))e.closed||(e.next(),e.complete());this.observers.clear()}}},Er=class extends Be{queue=[];emitting=!1;next(e){if(!this.closed)if(this.emitting)this.queue.push(e);else{for(this.emitting=!0,super.next(e);this.queue.length;)super.next(this.queue.shift());this.emitting=!1}}},Ta=class extends Be{currentValue;constructor(e){super(),this.currentValue=e}get value(){return this.currentValue}next(e){this.currentValue=e,super.next(e)}onSubscribe(e){let t=super.onSubscribe(e);return this.closed||e.next(this.currentValue),t}},oo=class extends Be{bufferSize;buffer=[];hasError=!1;lastError;constructor(e=1/0){super(),this.bufferSize=e}error(e){this.hasError=!0,this.lastError=e,super.error(e)}next(e){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(e),super.next(e)}onSubscribe(e){this.observers.add(e),this.buffer.forEach(t=>e.next(t)),this.hasError?e.error(this.lastError):this.closed&&e.complete(),e.signal.subscribe(()=>this.observers.delete(e))}},Gt=class extends Be{$value=Ge;get hasValue(){return this.$value!==Ge}get value(){if(this.$value===Ge)throw new Error("Reference not initialized");return this.$value}next(e){return this.$value=e,super.next(e)}onSubscribe(e){!this.closed&&this.$value!==Ge&&e.next(this.$value),super.onSubscribe(e)}},so=class extends Error{message="No elements in sequence"};function $e(...e){return new _(t=>{let a=0,r;function n(){let l=e[a++];l&&!t.closed?(r?.next(),l.subscribe({next:t.next,error:t.error,complete:n,signal:r=new Le})):t.complete()}t.signal.subscribe(()=>r?.next()),n()})}function ae(e){return new _(t=>{e().subscribe(t)})}function Sr(e){return new _(t=>{e.then(a=>{t.closed||t.next(a),t.complete()}).catch(a=>t.error(a))})}function At(e){return ae(()=>Sr(e()))}function kr(e){return new _(t=>{for(let a of e)t.closed||t.next(a);t.complete()})}function je(e){return e instanceof _?e:e instanceof Promise?Sr(e):kr(e)}function B(...e){return kr(e)}function ll(e){return new Promise((t,a)=>{let r=Ge;e.subscribe({next:n=>r=n,error:n=>a(n),complete:()=>t(r)})})}function io(e){return ll(e).then(t=>t===Ge?void 0:t)}function qe(e,t){return Ee(a=>({next:e(a),unsubscribe:t}))}function Ee(e){return t=>new _(a=>{let r=e(a,t);r.unsubscribe&&a.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=a.error),r.complete||(r.complete=a.complete),r.signal=a.signal,t.subscribe(r)})}function Ma(e){return qe(t=>a=>t.next(e(a)))}function lo(e){let t=Ge;return qe(a=>r=>{let n=e(r);n!==t&&(t=n,a.next(n))})}function co(e,t){return Ee(a=>{let r=t,n=0;return{next(l){r=e(r,l,n++)},complete(){a.next(r),a.complete()}}})}function uo(e){return Ee(t=>{let a=!0,r;return{next(n){a&&(a=!1,t.next(n),r=setTimeout(()=>a=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function Ze(e){return new _(t=>{let a=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(a))})}function po(e,t=Ze){return Nr(a=>t(e).map(()=>a))}function Nr(e){return t=>re(a=>{let r=!1,n=!1,l,o=()=>{l?.next(),r=!1,n&&a.complete()},s=new Le;a.signal.subscribe(()=>{o(),s.next()}),t.subscribe({next(i){o(),l=new Le,r=!0,je(e(i)).subscribe({next:a.next,error:a.error,complete:o,signal:l})},error:a.error,complete(){n=!0,r||a.complete()},signal:s})})}function mo(e){return t=>re(a=>{let r=a.signal,n=0,l=0,o=!1;t.subscribe({next:s=>{n++,je(e(s)).subscribe({next:a.next,error:a.error,complete:()=>{l++,o&&l===n&&a.complete()},signal:r})},error:a.error,complete(){o=!0,l===n&&a.complete()},signal:r})})}function fo(e){return Ee(t=>{let a=new Le,r,n,l=[],o=!1,s=!1,i=()=>{r?.next(),r=void 0,n=void 0,s=!1,l.length&&!t.closed?c(l.shift()):o&&t.complete()},c=x=>{s=!0,r=new Le,n=je(e(x)).subscribe({next:t.next,error:t.error,complete:i,signal:r})};return t.signal.subscribe(()=>{r?.next(),a.next()}),{next(x){s?l.push(x):c(x)},error:t.error,complete(){o=!0,!s&&l.length===0&&t.complete()},signal:a,unsubscribe:()=>n?.unsubscribe()}})}function ho(e){return Ee(t=>{let a=!0;return{next(r){a&&(a=!1,je(e(r)).subscribe({next:t.next,error:t.error,complete:()=>a=!0,signal:t.signal}))}}})}function qt(e){return qe(t=>a=>{e(a)&&t.next(a)})}function go(e){return qe(t=>a=>{e-- >0&&!t.closed&&t.next(a),(e<=0||t.closed)&&t.complete()})}function bo(e){return qe(t=>a=>{!t.closed&&e(a)?t.next(a):t.complete()})}function xo(){let e=!1;return Ee(t=>({next(a){e||(e=!0,t.next(a),t.complete())},complete(){t.closed||t.error(new so)}}))}function Tt(e){return qe(t=>a=>{e(a),t.next(a)})}function vo(e){return Ee((t,a)=>{let r,n={next:t.next,error(l){try{if(t.closed)return;let o=e(l,a);r?.next(),r=new Le,o.subscribe({...n,signal:r})}catch(o){t.error(o)}},unsubscribe:()=>r?.next()};return n})}function yo(){return qe(e=>{let t=Ge;return a=>{a!==t&&(t=a,e.next(a))}})}function wo(){return e=>{let t=new oo(1),a=!1;return re(r=>{t.subscribe(r),a||(a=!0,e.subscribe(t))})}}function Eo(){return e=>{let t,a=0;function r(){--a===0&&t.signal.next()}return re(n=>{n.signal.subscribe(r),a++===0?(t=We(),t.subscribe(n),e.subscribe(t)):t.subscribe(n)})}}function So(){return e=>{let t=new Be,a,r,n=!1,l=!1;return re(o=>{l?(o.next(r),o.complete()):t.subscribe(o),a??=e.subscribe({next:s=>{n=!0,r=s},error:o.error,complete(){l=!0,n&&t.next(r),t.complete()},signal:o.signal})})}}function f(...e){return e.length===1?e[0]:new _(t=>{let a=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){a--===1&&t.complete()},signal:t.signal})})}function le(...e){return e.length===0?$:new _(t=>{let a=e.length,r=a,n=0,l=!1,o=new Array(a),s=new Array(a);e.forEach((i,c)=>i.subscribe({next(x){s[c]=x,o[c]||(o[c]=!0,++n>=r&&(l=!0)),l&&t.next(s.slice(0))},error:t.error,complete(){--a<=0&&t.complete()},signal:t.signal}))})}function ko(e){return Ee(t=>({next:t.next,unsubscribe:e}))}function No(){return qt(()=>!1)}var $=new _(e=>e.complete());function ce(e){return new Ta(e)}function re(e){return new _(e)}function Cr(){return new Be}function We(){return new Gt}var wr={catchError:vo,concatMap:fo,debounceTime:po,distinctUntilChanged:yo,exhaustMap:ho,filter:qt,finalize:ko,first:xo,ignoreElements:No,map:Ma,mergeMap:mo,publishLast:So,reduce:co,select:lo,share:Eo,shareLatest:wo,switchMap:Nr,take:go,takeWhile:bo,tap:Tt,throttleTime:uo};for(let e in wr)_.prototype[e]=function(...t){return this.pipe(wr[e](...t))};function E(e,t,a){return new _(r=>{let n=r.next.bind(r);e.addEventListener(t,n,a),r.signal.subscribe(()=>e.removeEventListener(t,n,a))})}function Zt(e){return $a(e,{childList:!0})}function Wt(e,t){return $a(e,{attributes:!0,attributeFilter:t})}function $a(e,t={attributes:!0,childList:!0}){return new _(a=>{let r=new MutationObserver(n=>n.forEach(l=>{for(let o of l.addedNodes)a.next({type:"added",target:e,value:o});for(let o of l.removedNodes)a.next({type:"removed",target:e,value:o});l.type==="characterData"?a.next({type:"characterData",target:e}):l.attributeName&&a.next({type:"attribute",target:e,value:l.attributeName})}));r.observe(e,t),a.signal.subscribe(()=>r.disconnect())})}function Yt(e){return E(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function K(e){return E(e,"click")}function Jt(e,t){return new _(a=>{let r=new IntersectionObserver(n=>{for(let l of n)a.next(l)},t);r.observe(e),a.signal.subscribe(()=>r.disconnect())})}function Ar(e){return Jt(e).map(t=>t.isIntersecting)}function Se(e){return Jt(e).filter(t=>t.isIntersecting).first()}function Co(e){let t;return function(...a){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,a),t=0})}}function Tr(e){return Ee(t=>{let a=Co(n=>{t.closed||(e&&e(n),t.next(n),r&&t.complete())}),r=!1;return{next:a,complete:()=>r=!0}})}function Mr(){return ae(()=>document.readyState!=="loading"?B(!0):E(window,"DOMContentLoaded").first().map(()=>!0))}function ut(e,t,a){let r=new CustomEvent(t,a);e.dispatchEvent(r)}function Xt(e,t){let a;return f(ae(()=>(a=e.childNodes,a?B(void 0):$)),Ye().switchMap(()=>e.childNodes!==a?B(void 0):$),$a(e,{childList:!0,...t}).map(()=>{}))}function Ye(){return ae(()=>document.readyState==="complete"?B(!0):E(window,"load").first().map(()=>!0))}function Qt(...e){return new _(t=>{let a=new ResizeObserver(r=>r.forEach(n=>t.next(n)));for(let r of e)a.observe(r);t.signal.subscribe(()=>a.disconnect())})}function Mt(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function Ra(e,t,a){return r=>$e(B(e?r.matches(e):!1),E(r,t).switchMap(()=>f(B(!0),E(r,a).map(()=>e?r.matches(e):!1))))}var cl=Ra("","animationstart","animationend"),_a=Ra("","mouseenter","mouseleave"),Ao=Ra(":focus,:focus-within","focusin","focusout"),Ia=e=>le(_a(e),Ao(e)).map(([t,a])=>t||a);function $r(e,t,a){return t=t?.toLowerCase(),E(e,"keydown",a).filter(r=>!t||r.key?.toLowerCase()===t)}function $t(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function Je(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}var ul=Tt(e=>console.trace(e));_.prototype.log=function(){return this.pipe(ul)};_.prototype.raf=function(e){return this.pipe(Tr(e))};var oe=Symbol("bindings"),pl={},Rt=Symbol("augments"),pt=Symbol("parser"),To=class{bindings;messageHandlers;internals;attributes$=new Er;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(e){(this.messageHandlers??=new Set).add(e)}removeMessageHandler(e){this.messageHandlers?.delete(e)}message(e,t){let a=!1;if(this.messageHandlers)for(let r of this.messageHandlers)r.type===e&&(r.next(t),a||=r.stopPropagation);return a}add(e){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(e):(this.prebind??=[]).push(e)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let e=this.subscriptions=[];if(this.bindings)for(let t of this.bindings)e.push(t.subscribe());if(this.prebind)for(let t of this.prebind)e.push(t.subscribe())}}disconnect(){this.subscriptions?.forEach(e=>e.unsubscribe()),this.subscriptions=void 0}},ea=Symbol("css"),g=class extends HTMLElement{static observedAttributes;static[Rt];static[pt];[oe]=new To;[ea];connectedCallback(){this[oe].wasInitialized=!0,this[oe].wasConnected||this.constructor[Rt]?.forEach(e=>e(this)),this[oe].connect()}disconnectedCallback(){this[oe].disconnect()}attributeChangedCallback(e,t,a){let r=this.constructor[pt]?.[e]??dl;t!==a&&(this[e]=r(a,this[e]))}};function dl(e,t){let a=t===!1||t===!0;return e===""?a?!0:"":e===null?a?!1:void 0:e}function Mo(e,t){e.hasOwnProperty(Rt)||(e[Rt]=e[Rt]?.slice(0)??[]),e[Rt]?.push(t)}var ml={mode:"open"};function j(e){return e.shadowRoot??e.attachShadow(ml)}function $o(e,t){t instanceof Node?j(e).appendChild(t):e[oe].add(t)}function fl(e,t){t.length&&Mo(e,a=>{for(let r of t){let n=r.call(e,a);n&&n!==a&&$o(a,n)}})}function hl(e,t){pl[e]=t,customElements.define(e,t)}function ke(e){return e[oe].internals??=e.attachInternals()}function u(e,{init:t,augment:a,tagName:r}){if(t)for(let n of t)n(e);a&&fl(e,a),r&&hl(r,e)}function Pe(e){return $e(B(e),e[oe].attributes$.map(()=>e))}function G(e,t){return e[oe].attributes$.pipe(qt(a=>a.attribute===t),Ma(()=>e[t]))}function h(e,t){return f(G(e,t),ae(()=>B(e[t])))}function gl(e){let t=e.observedAttributes;return t&&!e.hasOwnProperty("observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function _t(e,t,a){return a===!1||a===null||a===void 0?a=null:a===!0&&(a=""),a===null?e.removeAttribute(t):e.setAttribute(t,String(a)),a}function bl(e,t,a){e.hasOwnProperty(pt)||(e[pt]={...e[pt]}),e[pt]&&(e[pt][t]=a)}function b(e,t){return a=>{t?.observe!==!1&&gl(a).push(e),t?.parse&&bl(a,e,t.parse);let r=`$$${e}`,n=a.prototype,l=Object.getOwnPropertyDescriptor(n,e);l&&Object.defineProperty(n,r,l);let o=t?.persist,s={enumerable:!0,configurable:!1,get(){return this[r]},set(i){this[r]!==i?(this[r]=i,o?.(this,e,i),this[oe].attributes$.next({target:this,attribute:e,value:i})):l?.set&&(o?.(this,e,i),this[r]=i)}};Mo(a,i=>{if(l||(i[r]=i[e]),Object.defineProperty(i,e,s),o?.(i,e,i[e]),t?.render){let c=t.render(i);c&&$o(i,c)}})}}function v(e){return b(e,{persist:_t,observe:!0})}function ta(e){let t=`on${e}`;return b(t,{render(a){return h(a,t).switchMap(r=>r?new _(n=>{let l=o=>{o.target===a&&a[t]?.call(a,o)};a.addEventListener(e,l),n.signal.subscribe(()=>a.removeEventListener(e,l))}):$)},parse(a){return a?new Function("event",a):void 0}})}function Y(e){return b(e,{observe:!1})}function R(){return document.createElement("slot")}function _r(e){return t=>{let[a,r]=e();return t[oe].add(a),r}}function Ro(e,t){let a=document.createTextNode("");return e[oe].add(t.tap(r=>a.textContent=r)),a}var Rr=document.createDocumentFragment();function Kt(e,t,a=e){if(t!=null)if(Array.isArray(t)){for(let r of t)Kt(e,r,Rr);a!==Rr&&a.appendChild(Rr)}else e instanceof g&&t instanceof _?a.appendChild(Ro(e,t)):t instanceof Node?a.appendChild(t):e instanceof g&&typeof t=="function"?Kt(e,t(e),a):a.appendChild(document.createTextNode(t))}function _o(e,t){for(let a in t){let r=t[a];e instanceof g?r instanceof _?e[oe].add(a==="$"?r:r.tap(n=>e[a]=n)):a==="$"&&typeof r=="function"?e[oe].add(r(e)):e[a]=r:e[a]=r}}function xl(e,t){return e.constructor.observedAttributes?.includes(t)}function Ir(e,t){let a=e instanceof g&&xl(e,t)?G(e,t):Wt(e,[t]).map(()=>e[t]);return f(a,ae(()=>B(e[t])))}function aa(e,t,a){return b(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let n=r===null?void 0:Number(r);return t!==void 0&&(n===void 0||n<t||isNaN(n))&&(n=t),a!==void 0&&n!==void 0&&n>a&&(n=a),n}})}function ue(e,t,a){for(let r=e.parentElement;r;r=r.parentElement)if(r[oe]?.message(t,a))return}function pe(e,t,a=!0){let r,n=0,l=new Be,o={type:t,next(s){n?l.next(s):(r??=[]).push(s)},stopPropagation:a};return e[oe].addMessageHandler(o),new _(s=>{n===0&&r?.length&&(r.forEach(c=>s.next(c)),r.length=0),n++;let i=l.subscribe(s);s.signal.subscribe(()=>{n--,i.unsubscribe()})})}function C(e,t,...a){let r=typeof e=="string"?document.createElement(e):new e;return t&&_o(r,t),a.length&&Kt(r,a),r}function m(e,t,...a){if(e!==m&&typeof e=="function"&&!(e.prototype instanceof g))return a.length&&((t??={}).children=a),e(t);let r=e===m?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&_o(r,t),a.length&&Kt(r,a),r}var Ne=d(":host{display:contents}"),Po=[-2,-1,0,1,2,3,4,5],Fr=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],dt=We(),ra=ce(""),xe=d(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),Lr=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${O("body-medium")}
`,wl=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),zo={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function Br(e=""){return`
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
		`}function Ho(e=zo){return Object.entries(e).map(([t,a])=>`--cxl-color--${t}:${a};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var Z={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:zo,imports:wl?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
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
	`,css:""};function It(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}var mt=d(It()),jr={"./theme-dark.js":()=>Promise.resolve().then(()=>(Do(),Oo))},Qe=[0,4,8,"12",16,24,32,48,64],Xe,Fo,El;function J(e,t){return e==="xsmall"?`@media(max-width:${Z.breakpoints.small}px){${t}}`:`@media(min-width:${Z.breakpoints[e]}px){${t}}`}function ft(e){return f(At(async()=>e.getBoundingClientRect().width),Qt(e).map(t=>t.contentRect.width)).map(t=>{let a=Z.breakpoints,r="xsmall";for(let n in a){if(a[n]>t)return r;r=n}return r}).distinctUntilChanged()}function Sl(e=""){return Object.entries(Ur).map(([t,a])=>`:host([color=${t}]) ${e}{ ${a} }`).join("")}function ht(e,t,a=""){return Pr(e,`
		${t?`:host ${a} { ${Ur[t]} }`:""}
		:host${t?"":"([color])"} ${a} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${a}{
			color: inherit;
			background-color: transparent;
		}
		${Sl(a)}
	`)}function Pr(e,t){let a=d(t);return b(e,{persist:_t,render:r=>a(r)})}function de(e,t){return Pr(e,Po.map(a=>{let r=t(a);return a===0?`:host{--cxl-size:${a}}:host ${r}`:`:host([size="${a}"]){--cxl-size:${a}}:host([size="${a}"]) ${r}`}).join(""))}function Uo(){let e=Xe?document.adoptedStyleSheets.indexOf(Xe):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Vo(e){Xe&&Uo();let t=e.globalCss??"";e.colors&&(t+=`:root{${Ho(e.colors)}}`),t?(Xe=ze(t),document.adoptedStyleSheets.push(Xe)):Xe=void 0,dt.next({theme:e,stylesheet:Xe,css:t}),ra.next(e.name)}var Lo="";function zr(e){e?e!==Lo&&(typeof e=="string"?import(e):e()).then(t=>Vo(t.default),t=>console.error(t)):Xe&&(Uo(),dt.next(void 0),ra.next("")),Lo=e}function Go(e){let t;return dt.tap(a=>{let r=a?.theme.override?.[e.tagName];r?t?t.replace(r).catch(n=>console.error(n)):e.shadowRoot?.adoptedStyleSheets.push(t??=ze(r)):t&&t.replaceSync("")})}function ze(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function Hr(e,t=""){let a=ze(t);return j(e).adoptedStyleSheets.push(a),a}function d(e){let t;return a=>{let r=j(a);if(r.adoptedStyleSheets.push(t??=ze(e)),!a[ea])return Z.css&&r.adoptedStyleSheets.unshift(El??=ze(Z.css)),a[ea]=!0,Go(a)}}var qo=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],kl=[...qo,"inherit"];function Or(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function Q(e){return`${Or(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}var Ur=qo.reduce((e,t)=>(e[t]=`
${Or(t)}
${t==="inverse-surface"?Or("inverse-primary","primary"):""}
`,e),{inherit:"color:inherit;background-color:inherit;"});function gt(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function O(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}var Nl=requestAnimationFrame(()=>Yo()),Cl={},Bo=document.createElement("template"),jo={};function Zo(e){return function(t){let a=e(t),r=jo[a];if(r)return r.cloneNode(!0);let n=document.createElementNS("http://www.w3.org/2000/svg","svg"),l=()=>(n.dispatchEvent(new ErrorEvent("error")),"");return fetch(a).then(o=>o.ok?o.text():l(),l).then(o=>{if(!o)return;Bo.innerHTML=o;let s=Bo.content.children[0];if(!s)return;let i=s.getAttribute("viewBox");i?n.setAttribute("viewBox",i):s.hasAttribute("width")&&s.hasAttribute("height")&&n.setAttribute("viewBox",`0 0 ${s.getAttribute("width")} ${s.getAttribute("height")}`);for(let c of s.childNodes)n.append(c);jo[t.name]=n}).catch(o=>console.error(o)),n.setAttribute("fill","currentColor"),n}}var Al=Zo(({name:e,width:t,fill:a})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${a?"fill1_":""}${t}px.svg`)),Tl=Al;function Vr(e,t={}){let{width:a,height:r}=t;a===void 0&&r===void 0&&(a=r=24);let n=Cl[e]?.icon()??Tl({name:e,width:a,fill:t.fill});return t.className&&n.setAttribute("class",t.className),a&&(n.setAttribute("width",`${a}`),r===void 0&&n.setAttribute("height",`${a}`)),r&&(n.setAttribute("height",`${r}`),a===void 0&&n.setAttribute("width",`${r}`)),t.alt&&n.setAttribute("alt",t.alt),n}var Dr,Wo=new Promise(e=>{Dr=()=>{dt.next(void 0),e()}});function Yo(e){cancelAnimationFrame(Nl),Fo||(e&&(e.colors&&(Z.colors=e.colors),e.globalCss&&(Z.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(Fo=ze(`html{${Ho(Z.colors)}}${Z.globalCss}`)),Z.imports?Promise.allSettled(Z.imports.map(t=>{let a=document.createElement("link");return a.rel="stylesheet",a.href=t,document.head.append(a),new Promise((r,n)=>(a.onload=r,a.onerror=n))})).then(Dr,t=>console.error(t)):Dr())}function na(){return At(async()=>{await Wo,await document.fonts.ready})}function Oa(e="block"){let t=(a=>{for(let r=12;r>0;r--)a.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,a.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,a.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,a.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,a.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return a})({xl:"",lg:"",md:"",sm:"",xs:""});return d(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${J("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${J("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${J("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${J("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var Da=d(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${gt()}
${Qe.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${Qe.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),oa=class extends g{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};u(oa,{init:[v("sm"),v("xs"),v("md"),v("lg"),v("xl"),v("vpad"),v("pad"),v("center"),v("fill"),v("grow"),v("elevation"),ht("color")]});var Ke=class extends oa{};u(Ke,{tagName:"c-c",augment:[Da,Oa(),d(":host([center]) { text-align: center}"),R]});var me=class extends oa{vflex=!1;gap;middle=!1};u(me,{tagName:"c-flex",init:[v("vflex"),v("gap"),v("middle")],augment:[Oa("flex"),Da,d(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${Qe.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),R]});function Ml(e,t){return a=>new _(()=>{a.hasAttribute(e)||a.setAttribute(e,t)})}function Jo(e,t){return Tt(a=>e.setAttribute("aria-"+t,a===!0?"true":a===!1?"false":a.toString()))}function H(e){return Ml("role",e)}var Xo=0;function He(e){return e.id||=`cxl__${Xo++}`}function Qo(e){return Ir(e,"id").map(t=>(t||(e.id=`cxl__${Xo++}`),e.id))}var $l=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(e){e.element.parentElement!==this.popupContainer?this.popupOpened(e):e.close()}popupOpened(e){this.currentPopup&&e.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=e}openModal(e){this.currentModal&&e.element!==this.currentModal.element&&this.currentModal.close(),e.element.parentNode||this.popupContainer.append(e.element),e.element.open||e.element.showModal(),this.currentModal=e}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(e){this.currentTooltip&&this.currentTooltip!==e&&this.currentTooltip.remove(),this.currentTooltip=e}close(){this.currentPopup?.close()}},et=new $l;var Fa={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(a){console.error(a)}}};function Gr(e){return(t,a)=>t[e]>a[e]?1:t[e]<a[e]?-1:0}function bt(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let a,r=e.getRootNode();return r instanceof ShadowRoot&&(a=r.getElementById(t),a)?a:e.ownerDocument.getElementById(t)??void 0}var Zr=(e,t,a=e)=>K(e).tap(()=>ue(a,"toggle.close",t));function qr(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(a=>{let r=bt(e,a);return r?[r]:[]}):Array.isArray(t)?t:[t]}function Ko(e,t,a,r,n=E(e,"click").map(()=>!a())){return f(r,n).switchMap(l=>{let o=t();return o?je(o.map(s=>({target:s,open:l}))):$})}function Ot(e,t=e){function a(l,o){return[h(e,"open").switchMap(s=>(l.parentNode||et.popupContainer.append(l),l.open=s,s&&l instanceof g?G(l,"open").map(i=>{e.open&&i===!1&&(e.open=!1)}):$)),Qo(l).tap(s=>{let i=l.getAttribute("role");(i==="menu"||i==="listbox"||i==="tree"||i==="grid"||i==="dialog")&&(o.ariaHasPopup=i),o.getRootNode()===l.getRootNode()&&o.setAttribute("aria-controls",s)})]}let r=le(h(e,"trigger"),h(e,"target")).switchMap(([l])=>{let o=qr(e),s=o?f(...o.flatMap(i=>a(i,e))).ignoreElements():$;return f(l==="hover"?le(Ia(t),o?f(...o.map(i=>Ia(i))):$).map(i=>!!i.find(c=>!!c)).debounceTime(250):l==="checked"?E(t,"change").map(i=>i.target&&"checked"in i.target?!!i.target.checked:!1):E(t,"click").map(()=>!e.open),s)}),n;return Mr().switchMap(()=>Ko(t,()=>qr(e),()=>e.open,h(e,"open"),r).filter(l=>{let{open:o,target:s}=l;if(e.open!==o){if(o)n=Je(e)?.activeElement,s.trigger=e;else if(s.trigger&&s.trigger!==e)return l.open=!0,s.trigger=e,!0;return e.open=o,!1}if(!o&&s.trigger===e){let i=document.activeElement;(i===document.body||i===document.documentElement)&&n?.focus()}return!0}))}var Wr=class extends g{open=!1;target;trigger};u(Wr,{init:[b("target"),b("trigger"),v("open")],augment:[e=>Ot(e).raf(({target:t,open:a})=>t.open=a)]});var La=class extends Wr{};u(La,{tagName:"c-toggle",augment:[Ne,R]});var Pp=1440*60*1e3;function es(e,t,a){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(a,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(a,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(a,{dateStyle:t,timeStyle:t})}function ts(e,t,a){return typeof a=="string"?es(t,a,e):t.toLocaleString(e,a)}var Yr={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function Rl(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var sa={content:Yr,name:"default",localeName:Rl(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>ts(sa.localeName,e,t)},_l={content:Yr,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>ts("en-US",e,t)};function Il(){let e=ce(sa),t={default:sa,en:_l},a={},r=e.map(o=>o.content);async function n(o){let s=o.split("-")[0];if(!s)return sa;if(!(t[o]??t[s])){let i=a[o]??a[s];i&&await i()}return t[s]||sa}async function l(o){e.next(await n(o))}return navigator.language&&l(navigator.language).catch(o=>console.error(o)),{content:r,registeredLocales:t,locale:e,setLocale:l,getLocale(o){return o?At(()=>n(o)):e},get(o,s){return r.map(i=>i[o])},register(o){t[o.name]=o}}}var Dt=Il();function as(e){return Object.assign(Yr,e),Dt.get}var Ol=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,Dl=/^\d{5}(?:[-\s]\d{4})?$/,Fl={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},rs={required:Ul,email:Vl,json:Zl,zipcode:Gl,nonZero:zl,nonEmpty:Pl},Ll={pattern:Hl,equalToElement:Jr(is),greaterThan:os,lessThan:ss,greaterThanElement:Jr(os),lessThanElement:Jr(ss),min:Yl,max:Jl,equalTo:is,maxlength:Xl,minlength:Ql},Bl=as(Fl);function Jr(e){return(t,a)=>{let r=typeof t=="string"?bt(a,t):t;if(!r)throw"Invalid element";return e(r)}}function Re(e,t){return{key:e,valid:t,message:Bl(`validation.${e}`,"validation.invalid")}}function jl(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function Pl(e){return Re("nonEmpty",!jl(e))}function zl(e){return Re("nonZero",e===""||Number(e)!==0)}function Hl(e){let t=typeof e=="string"?e=new RegExp(e):e;return a=>Re("pattern",typeof a=="string"&&(a===""||t.test(a)))}function Xr(e){return e!=null&&e!==""}function Ul(e,t){let a=t&&"checked"in t?!!t.checked:!0;return Re("required",a&&Xr(e))}function Vl(e){return Re("email",typeof e=="string"&&(e===""||Ol.test(e)))}function Gl(e){return Re("zipcode",typeof e=="string"&&(e===""||Dl.test(e)))}function ql(e){try{return JSON.parse(e),!0}catch{return!1}}function Zl(e){return Re("json",ql(e))}function Wl(e){return e instanceof HTMLElement&&"value"in e}function ia(e,t,a){let r=Wl(t)?h(t,"value"):t instanceof _?t:B(t);return n=>r.map(l=>Re(e,!Xr(n)||!Xr(l)||a(n,l)))}function ns(e,t){let a=/(\w+)(?:\(([^)]+?)\))?/g,r=[],n;for(;n=a.exec(e);)if(n[2]){let l=Ll[n[1]];if(!l)throw`Invalid rule "${n[1]}"`;r.push(l(n[2],t))}else if(n[1]&&n[1]in rs)r.push(rs[n[1]]);else throw`Invalid rule "${n[1]}"`;return r}function ls(e,t){let a=(typeof e=="string"?ns(e,t):e).flatMap(r=>typeof r=="string"?ns(r,t):r);return(r,n)=>a.map(l=>{let o=l(r,n);return o instanceof _?o:o instanceof Promise?je(o):B(o)})}function Yl(e){return ia("min",e,(t,a)=>Number(t)>=Number(a))}function os(e){return ia("greaterThan",e,(t,a)=>Number(t)>Number(a))}function Jl(e){return ia("max",e,(t,a)=>Number(t)<=Number(a))}function ss(e){return ia("lessThan",e,(t,a)=>Number(t)<Number(a))}function is(e){return ia("equalTo",e,(t,a)=>t==a)}function Xl(e){return t=>Re("maxlength",!t||t.length<=+e)}function Ql(e){return t=>Re("minlength",!t||t.length>=+e)}function tt(e,t,a){return new _(r=>{let n={id:e,controller:a,target:t};ue(t,`registable.${e}`,n),r.signal.subscribe(()=>n.unsubscribe?.())})}function Ba(e,t,a,r){return new _(n=>{function l(s){let i=s.target;s.unsubscribe=()=>{let M=a.indexOf(i);M!==-1&&a.splice(M,1),r?.({type:"disconnect",target:i,elements:a}),n.next()};let c=a.indexOf(i);c!==-1&&a.splice(c,1);let x=0,A=a.length;for(;x<A;){let M=x+A>>1;a[M].compareDocumentPosition(i)&Node.DOCUMENT_POSITION_FOLLOWING?x=M+1:A=M}a.splice(x,0,i),r?.({type:"connect",target:i,elements:a}),n.next()}let o=pe(t,`registable.${e}`).subscribe(l);n.signal.subscribe(o.unsubscribe)})}function cs(e,t,a=new Set){let r=Cr();return f(pe(t,`registable.${e}`).map(n=>{let l=n.target,o=n.controller||n.target;return n.unsubscribe=()=>{a.delete(o),r.next({type:"disconnect",target:o,element:l,elements:a})},a.add(o),{type:"connect",target:o,element:l,elements:a}}),r)}function Kl(e){return ps(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function us(e){return G(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||ut(e,"change",{bubbles:!0})})}function ps(e){return f(h(e,"value"),h(e,"checked")).map(()=>{})}var ja=class ds extends g{static formAssociated=!0;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{u(ds,{init:[v("autofocus"),v("invalid"),v("disabled"),v("touched"),b("rules"),v("name"),Y("validationResult"),ta("update")],augment:[t=>(t.defaultValue=t.value,f(tt("form",t),G(t,"invalid").tap(()=>ut(t,"invalid")),h(t,"invalid").switchMap(a=>{if(a){if(t.setAria("invalid","true"),!t.validationMessage)return Dt.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return $}),re(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),h(t,"rules").switchMap(a=>{if(!a)return $;let r=ls(a,t);return ps(t).switchMap(()=>f(...r(t.value,t)).tap(n=>t.setValidity(n))).finalize(()=>t.resetValidity())}),h(t,"value").tap(a=>t.setFormValue(a)),h(t,"validationResult").switchMap(a=>!a||a.valid?$:a.message instanceof _?a.message:a.message===void 0?Dt.get("validation.invalid"):B(a.message)).tap(a=>{t.setCustomValidity(a)}))),Kl]})}get labels(){return ke(this).labels}get validity(){return ke(this).validity}get validationMessage(){return ke(this).validationMessage}reportValidity(){return ke(this).reportValidity()}checkValidity(){return ke(this).checkValidity()}setCustomValidity(t){let a=!!t,r=t!==this.validationMessage;this.applyValidity(a,t),this.invalid!==a?this.invalid=a:r&&ut(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,a){a?this.setAttribute(`aria-${t}`,a):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let a in this.validMap){let r=this.validMap[a];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,a){ke(this).setValidity({customError:t},a)}formDisabledCallback(t){this.disabled=t}setFormValue(t){ke(this).setFormValue(t)}};function ec(e){return h(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function tc(e,t=e,a=0){let r=t.hasAttribute("tabindex")?t.tabIndex:a;return ec(e).tap(n=>{n?t.removeAttribute("tabindex"):t.tabIndex=r})}function ac(e,t=e){return f(E(t,"focusout").tap(()=>e.touched=!0),f(G(e,"disabled"),G(e,"touched")).tap(()=>ue(e,"focusable.change")))}function _e(e,t=e,a=0){return f(tc(e,t,a),ac(e,t))}function la(e,t,a){return h(e,a).tap(r=>_t(t,a,r))}var rc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function Pa({host:e,input:t,toText:a,toValue:r,update:n}){t.className="cxl-native-input",t.setAttribute("style",rc),t.setAttribute("form","__cxl_ignore__");function l(i){e.value=r?r(t.value||""):t.value,i.stopPropagation(),e.dispatchEvent(new Event(i.type,{bubbles:!0}))}function o(){let i=e.value,c=a?a(i,t.value):i||"";t.value!==c&&e.setInputValue(c)}function s(){t.ariaLabel=e.ariaLabel;let i=e.getAttribute("aria-labelledby");i?t.setAttribute("aria-labelledby",i):t.removeAttribute("aria-labelledby")}return f(_e(e,t),ae(()=>(s(),t.form?E(t.form,"reset").tap(l):$)),h(e,"value").tap(()=>{a&&t.matches(":focus")||o()}),E(t,"blur").tap(o),E(t,"input").tap(l),E(t,"change").tap(l),la(e,t,"disabled"),la(e,t,"name"),la(e,t,"autocomplete"),la(e,t,"spellcheck"),la(e,t,"autofocus"),Wt(e,["aria-label","aria-labelledby"]).tap(s),n?n.tap(o):$,E(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),E(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var ms=class fs extends ja{inputValue="";static{u(fs,{init:[Y("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,E(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,a){a?this.inputEl.setAttribute(`aria-${t}`,a):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,a){ke(this).setValidity({customError:t},a,this.inputEl),this.inputEl.setCustomValidity(t?a||"Invalid Field":"")}};var nc=[d(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),xe],Qr=[...nc,R],Kr=class hs extends ms{autofilled=!1;autocomplete;static{u(hs,{init:[v("autofilled"),b("autocomplete")],augment:[t=>E(t.inputEl,"animationstart").tap(a=>{(a.animationName==="cxl-onautofillstart"||a.animationName==="cxl-onautofillend")&&(t.autofilled=a.animationName==="cxl-onautofillstart",ue(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,a){this.inputEl.setSelectionRange(t,a)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},oc=class extends Kr{value="";inputEl=C("input",{className:"input"})};u(oc,{tagName:"c-input-text",init:[b("value")],augment:[...Qr,e=>e.append(e.inputEl),e=>Pa({host:e,input:e.inputEl})]});function gs(e,t,...a){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let n in t){if(n==="children")continue;let l=t[n];r.setAttribute(n==="className"?"class":n,l??"")}return a.length&&r.append(...a),r}function za(e){return gs("svg",e,gs("path",{d:e.d}))}function bs(e){return e in Z.animation}function Ue({target:e,animation:t,options:a}){if(Z.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in Z.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?Z.animation[t]:t,n=typeof r.kf=="function"?r.kf(e):r.kf,l={duration:250,easing:Z.easing.emphasized,...r.options,...a,...Z.prefersReducedMotion?{duration:0}:void 0};return e.animate(n,l)}function xs(e){let{trigger:t,stagger:a,commit:r,keep:n}=e;function l(s){return new _(i=>{let c=Ue(s);c.ready.then(()=>i.next({type:"start",animation:c}),x=>{console.error(x)}),c.addEventListener("finish",()=>{i.next({type:"end",animation:c}),r&&c.commitStyles(),!(n||n!==!1&&s.options?.fill&&(s.options.fill==="both"||s.options.fill==="forwards"))&&i.complete()}),i.signal.subscribe(()=>{try{c.cancel()}catch{}})})}let o=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return f(...o.map((s,i)=>{let c={...e.options,delay:a!==void 0?(e.options?.delay??0)+i*a:e.options?.delay};return(t==="visible"?Ar(s).filter(x=>x):t==="hover"?_a(s):B(!0)).switchMap(x=>x?l({...e,options:c,target:s}):$)}))}function vs(e,t,a=e.getBoundingClientRect()){let r=a.width>a.height?a.width:a.height,n=new Es,l=e.shadowRoot||e,{x:o,y:s}=t??{x:1/0,y:1/0},i=!t||$t(t),c=o>a.right||o<a.left||s>a.bottom||s<a.top;return n.x=i||c?a.width/2:o-a.left,n.y=i||c?a.height/2:s-a.top,n.radius=r,t||(n.duration=0),l.prepend(n),n}function ys(e,t=e){let a,r,n,l=()=>{a=vs(t,r instanceof Event?r:void 0,n),a.duration=600,r=void 0};return f(E(e,"click").tap(o=>{r=o,n=t.getBoundingClientRect()}),h(e,"selected").raf().switchMap(()=>{if(e.selected){if(!a?.parentNode){if(Mt(e))return r=void 0,Se(e).tap(l);l()}}else a&&ws(a).catch(o=>console.error(o));return $})).ignoreElements()}function ws(e){return new Promise(t=>{Ue({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function Ie(e,t=e){let a=!1,r=0;return f(E(t,"pointerdown"),E(t,"click")).tap(n=>n.cxlRipple??=e).raf().mergeMap(n=>{if(n.cxlRipple===e&&!a&&!e.disabled&&e.parentNode){r=Date.now(),a=!0,e.style.setProperty("--cxl-mask-hover","none");let l=vs(e,n),o=l.duration,s=()=>{e.style.removeProperty("--cxl-mask-hover"),ws(l).catch(()=>{}).finally(()=>{a=!1})};return n.type==="click"?Ze(o).tap(s):f(E(document,"pointerup"),E(document,"pointercancel")).first().map(()=>{let i=Date.now()-r;setTimeout(()=>s(),i>o?32:o-i)})}return $})}var Es=class extends g{x=0;y=0;radius=0;duration=500};u(Es,{tagName:"c-ripple",init:[b("x"),b("y"),b("radius")],augment:[d(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",re(()=>{let a=t.style;a.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,a.width=a.height=e.radius*2+"px",t.parentNode||j(e).append(t),Ue({target:t,animation:"expand",options:{duration:e.duration}}),Ue({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var ca=[xe,mt,d(`
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
}`)],sc=d(`
:host {
	${O("label-large")}
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
`);function en(e){return h(e,"disabled").switchMap(t=>t?$:Yt(e).tap(a=>{a.stopPropagation(),e.click()}))}function tn(e){return f(en(e),_e(e))}var Ss=class extends g{disabled=!1;touched=!1};u(Ss,{init:[v("disabled"),v("touched")],augment:[H("button"),tn]});var an=class extends Ss{size;color;variant};u(an,{tagName:"c-button",init:[de("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),ht("color","primary"),v("variant")],augment:[...ca,sc,Ie,R]});var ee=class extends g{font};u(ee,{tagName:"c-t",init:[v("font")],augment:[d(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${Fr.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${O("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${O("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${O("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${O("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${O("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${O("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),R,e=>h(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var Ha=class extends g{};u(Ha,{tagName:"c-span"});function ic(e,t){let a,r=t.key;if(r==="ArrowDown"&&e.goDown)a=e.goDown();else if(r==="ArrowRight"&&e.goRight)a=e.goRight();else if(r==="ArrowUp"&&e.goUp)a=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)a=e.goLeft();else if(r==="Home")a=t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")a=t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)a=e.other(t);else return null;return t.stopPropagation(),a&&t.preventDefault(),a}function ua(e){return E(e.host,"keydown").map(t=>ic(e,t)).filter(t=>!!t)}function lc(e){return new _(t=>{let a=e.focus;e.focus=()=>{a.call(e),t.next()},t.signal.subscribe(()=>e.focus=a)})}function ks({host:e,observe:t,getFocusable:a,getSelected:r,getActive:n=()=>rn(e)}){let l=[];function o(){let s=l.find(i=>!i.disabled&&!i.hidden&&!Mt(i));s&&(s.tabIndex=0)}return f(E(e,"focusin").tap(()=>{let s=n(),i=!1;for(let c of l)c.tabIndex=c===s?(i=!0,0):-1;i||o()}),(t??B(!0)).tap(()=>{if(l=a(),l.find(i=>i.tabIndex===0))return;let s=r?.();s?s.tabIndex=0:o()}),e instanceof HTMLElement?lc(e).tap(()=>{let s=a();(s.find(i=>i.tabIndex===0)??s[0])?.focus()}):$).ignoreElements()}function rn(e){return Je(e)?.activeElement??document.activeElement??void 0}function Ns({getFocusable:e,getActive:t}){return(a=1,r,n=Mt)=>{let l=t(),o=e(),s=r??(l?o.indexOf(l):-1),i;do i=o[s+=a];while(i&&n(i));return i}}var cc=/([^&=]+)=?([^&]*)/g,uc=/:([\w_$@]+)/g,pc=/\/\((.*?)\)/g,dc=/(\(\?)?:\w+/g,mc=/\*\w+/g,fc=/[-{}[\]+?.,\\^$|#\s]/g,nn="@@cxlRoute",ye={location:window.location,history:window.history};function hc(e){let t=[];return[new RegExp("^/?"+e.replace(fc,"\\$&").replace(pc,"\\/?(?:$1)?").replace(dc,function(a,r){return t.push(a.substr(1)),r?a:"([^/?]*)"}).replace(mc,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function Cs(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function Va(e,t){return t?e.replace(uc,(a,r)=>t[r]||""):e}function As(e){let t={},a;for(;a=cc.exec(e);)a[1]!==void 0&&(t[a[1]]=decodeURIComponent(a[2]??""));return t}var gc=class{path;regex;parameters;constructor(e){this.path=e=Cs(e),[this.regex,this.parameters]=hc(e)}_extractQuery(e){let t=e.indexOf("?");return t===-1?{}:As(e.slice(t+1))}getArguments(e){let t=this.regex.exec(e)?.slice(1);if(!t)return;let a=this._extractQuery(e);return t.forEach((r,n)=>{let l=n===t.length-1?r||"":r?decodeURIComponent(r):"",o=this.parameters[n];o&&(a[o]=l)}),a}test(e){return this.regex.test(e)}toString(){return this.path}},Ts=class{id;path;parent;redirectTo;definition;isDefault;constructor(e){if(e.path!==void 0)this.path=new gc(e.path);else if(!e.id)throw console.log(e),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=e.id||(e.path??`route${Math.random().toString()}`),this.isDefault=e.isDefault||!1,this.parent=e.parent,this.redirectTo=e.redirectTo,this.definition=e}create(e){let t=this.definition.render();t[nn]=this;for(let a in e)e[a]!==void 0&&(t[a]=e[a]);return t}},Ms=class{routes=[];defaultRoute;findRoute(e){return this.routes.find(t=>t.path?.test(e))??this.defaultRoute}get(e){return this.routes.find(t=>t.id===e)}register(e){if(e.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=e}this.routes.unshift(e)}};function $s(e){return e[nn]}function Ga(e,t){let a=new URL(e,`http://localhost/${t}`);return{path:a.pathname.slice(1),hash:a.hash.slice(1)}}var Rs={getHref(e){return`${ye.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=pa()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let a=this.getHref(e);a!==`${location.pathname}${location.search}${location.hash}`&&ye.history.pushState({url:e},"",a)}},deserialize(){return{path:ye.location.search.slice(1),hash:ye.location.hash.slice(1)}}};function pa(){return ye.history.state}var _s={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=pa()?.url;if(!t||e.hash!==t.hash||e.path!==t.path){let a=this.getHref(e);a!==`${location.pathname}${location.search}${location.hash}`&&ye.history.pushState({url:e},"",a||"/")}},deserialize(){return{path:ye.location.pathname,hash:ye.location.hash.slice(1)}}},on={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=on.getHref(e);ye.location.hash!==t&&(ye.location.hash=t)},deserialize(){return Ga(ye.location.hash.slice(1),"")}},sn={hash:on,path:_s,query:Rs},Is=class{callbackFn;state;routes=new Ms;instances={};root;lastGo;constructor(e){this.callbackFn=e}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(e){let t=new Ts(e);return this.routes.register(t),t}go(e){this.lastGo=e;let t=this.state?.url,a=typeof e=="string"?Ga(e,t?.path??""):e,r=a.path;if(r!==t?.path){let n=this.routes.findRoute(r);if(!n)throw new Error(`Path: "${r}" not found`);let l=n.path?.getArguments(r);if(n.redirectTo)return this.go(Va(n.redirectTo,l));let o=this.execute(n,l);if(this.lastGo!==e)return;if(!this.root)throw new Error(`Route: "${r}" could not be created`);this.updateState({url:a,arguments:l,route:n,current:o,root:this.root})}else this.state&&a.hash!=t.hash&&this.updateState({...this.state,url:a})}getPath(e,t){let a=this.routes.get(e)?.path;return a&&Va(a.toString(),t)}isActiveUrl(e){let t=this.state?.url;if(!t)return!1;let a=Ga(e,t.path);return!!Object.values(this.instances).find(r=>{let n=r[nn],l=this.state?.arguments;if(n?.path?.test(a.path)&&(!a.hash||a.hash===t.hash)){if(l){let o=n.path.getArguments(a.path);for(let s in o)if(l[s]!=o[s])return!1}return!0}return!1})}updateState(e){this.state=e,this.callbackFn?.(e)}findRoute(e,t){let a=this.instances[e],r;if(a)for(r in t){let n=t[r];n!==void 0&&(a[r]=n)}return a}executeRoute(e,t,a){let r=e.parent,n=r&&this.routes.get(r),l=e.id,o=n&&this.executeRoute(n,t,a),s=this.findRoute(l,t)||e.create(t);return o?s.parentNode!==o&&o.appendChild(s):this.root=s,a[l]=s,s}discardOldRoutes(e){let t=this.instances;for(let a in t){let r=t[a];r&&e[a]!==r&&(r.parentNode?.removeChild(r),delete t[a])}}execute(e,t){let a={},r=this.executeRoute(e,t||{},a);return this.discardOldRoutes(a),this.instances=a,r}},xt=new Gt,ln=new Gt,fe=new Is(()=>xt.next());function bc(e){let t=e;for(;t=t.parentElement;)if(t.scrollTop!==0)return t.scrollTo(0,0)}function cn(e){let t;return xt.tap(()=>{let{root:a}=fe.getState();a.parentNode!==e?e.appendChild(a):t&&t!==a&&t.parentNode&&e.removeChild(t),t=a}).raf(()=>{let a=fe.getState().url;if(a.hash)e.querySelector(`#${a.hash},a[name="${a.hash}"]`)?.scrollIntoView();else{let r=pa()?.lastAction;e.parentElement&&r&&r!=="pop"&&bc(e)}})}function Os(e,t=sn.query){return f(re(()=>ln.next(t)),e.tap(()=>fe.go(t.deserialize())),xt.tap(()=>t.serialize(fe.getState().url))).catchError(a=>{if(a?.name==="SecurityError")return $;throw a})}function Ds(){return $e(B(location.hash.slice(1)),E(window,"hashchange").map(()=>location.hash.slice(1)))}var Ua;function Fs(){if(!Ua){Ua=new Ta(history.state);let e=history.pushState;history.pushState=function(...t){let a=e.apply(this,t),r=pa();return r&&(r.lastAction="push",Ua?.next(r)),a}}return f(E(window,"popstate").map(()=>{let e=pa();return e&&(e.lastAction="pop"),e}),Ua)}function Ls(){let e;return f(Ds(),Fs()).map(()=>window.location).filter(t=>{let a=t.href!==e;return e=t.href,a})}var xc=xt.raf().map(()=>{let e=[],t=fe.getState(),a=t.current;do a.routeTitle&&e.unshift({title:a.routeTitle,first:a===t.current,path:vc(a)});while(a=a.parentNode);return e});function vc(e){let t=$s(e);return t&&Va(t.path?.toString()||"",fe.state?.arguments||{})}function da(e,t,a=t){return f(le(ln,Pe(e)).tap(([r])=>{e.href!==void 0&&(t.href=e.external?e.href:r.getHref(e.href)),t.target=e.target||""}),K(t).tap(r=>{e.target||r.preventDefault()}),K(a).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):fe.go(e.href))}))}function yc(e,t){let a=document.createElement("div");return a.style.display="contents",a.routeTitle=t,a.appendChild(e.content.cloneNode(!0)),a}var Bs=class extends g{strategy="query";get state(){return fe.state}go(e){return fe.go(e)}};u(Bs,{tagName:"c-router",init:[b("strategy")],augment:[e=>{function t(a){let r=a.dataset;if(r.registered)return;r.registered="true";let n=r.title||void 0;fe.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:a.hasAttribute("data-default"),redirectTo:r.redirectto,render:yc.bind(null,a,n)})}return Ye().switchMap(()=>{for(let a of Array.from(e.children))a instanceof HTMLTemplateElement&&t(a);return f(Zt(e).tap(a=>{a.type==="added"&&a.value instanceof HTMLTemplateElement&&t(a.value)}),h(e,"strategy").switchMap(a=>{let r=sn[a];return Os(Ls(),r).catchError((n,l)=>(console.error(n),l))}))})}]});var Ft=class extends g{href;focusable=!1;external=!1;dismiss=!1;target};u(Ft,{tagName:"c-router-link",init:[b("href"),b("focusable"),b("external"),b("target"),b("dismiss")],augment:[d(`
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
	`),e=>{let t=C("a",{className:"link"},C("slot"));return j(e).append(t),f(h(e,"focusable").tap(a=>t.tabIndex=a?0:-1),Zr(e),da(e,t))}]});var qa=class extends Ft{focusable=!0};u(qa,{tagName:"c-router-a",augment:[d(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});function un(e,t=e){return f(wc(e,t).ignoreElements(),xt.map(()=>e.href!==void 0&&fe.isActiveUrl(e.href)))}function wc(e,t=e){let a=C("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return a.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,j(e).append(a),f(da(e,a),E(a,"click").tap(r=>{r.stopPropagation(),$t(r)||e.dispatchEvent(new PointerEvent(r.type,r)),ue(e,"drawer.close",void 0)}),K(t).tap(r=>{$t(r)&&a.click()}))}var Ec=class extends g{href};u(Ec,{tagName:"c-router-selectable",init:[b("href")],augment:[Ne,()=>C("slot"),e=>ae(()=>{let t=e.parentElement;return un(e,t).raf(a=>{t.selected=a})})]});var Sc=d(`
:host { ${Lr} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function kc(e){return f(tt("list",e),h(e,"selected").tap(t=>e.ariaSelected=String(t)))}function pn(e){return f(en(e),_e(e,e,-1),kc(e))}var Lt=class extends g{disabled=!1;touched=!1;selected=!1};u(Lt,{init:[v("disabled"),v("touched"),v("selected")],augment:[pn]});var Nc=class extends Lt{size};u(Nc,{tagName:"c-item",init:[de("size",e=>`{min-height:${56+e*8}px}`)],augment:[Sc,xe,mt,H("option"),R,Ie]});var Za=[d(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${O("label-large")}
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
${It("slot::after")}
	`),xe,ys,R],Bt=class extends Lt{size};u(Bt,{tagName:"c-nav-item",init:[de("size",e=>`{min-height:${56+e*8}px}`)],augment:[H("option"),...Za]});var Wa=class extends Bt{href;external=!1;target};u(Wa,{tagName:"c-router-item",init:[b("href"),b("external"),b("target")],augment:[e=>un(e).tap(t=>{e.selected=t})]});var Ya=class extends g{};u(Ya,{tagName:"c-router-outlet",init:[],augment:[H("main"),Ne,cn,R]});var dn=class extends g{xs=!1;sm=!1;md=!1;lg=!1;xl=!1};u(dn,{tagName:"c-r",init:[v("xl"),v("lg"),v("md"),v("sm"),v("xs")],augment:[d(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${J("small",':host([sm]){display:contents}:host([sm="0"]){display:none}')}
${J("medium",':host([md]){display:contents}:host([md="0"]){display:none}')}
${J("large",':host([lg]){display:contents}:host([lg="0"]){display:none}')}
${J("xlarge",':host([xl]){display:contents}:host([xl="0"]){display:none}')}
	`),R]});var js=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(e,t=this.end){let a=this.end.parentNode;a&&(this.start.parentNode||a.insertBefore(this.start,this.end),Array.isArray(e)?(this.frag.append(...e),a.insertBefore(this.frag,t)):a.insertBefore(e,t))}empty(){let e=this.end.parentNode;if(!e||this.start.parentNode!==e)return;let t=document.createRange();t.setStartAfter(this.start),t.setEndBefore(this.end),t.deleteContents()}};var Ce=class extends g{name="";width;height;alt;fill=!1};u(Ce,{tagName:"c-icon",init:[b("name"),b("width"),b("height"),b("fill"),b("alt")],augment:[H("none"),d(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,a;return e.shadowRoot?.adoptedStyleSheets.push(t),Se(e).switchMap(()=>Pe(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,n=e.height??e.width;t.replace(`:host{${r===void 0?"":`width:${r}px;`}${n===void 0?"":`height:${n}px`}}`).catch(l=>{}),a?.remove(),a=e.name?Vr(e.name,{className:"icon",width:r,height:n,fill:e.fill,alt:e.alt}):void 0,a&&(a.onerror=()=>{a&&e.alt&&a.replaceWith(e.alt)},j(e).append(a))})}]});var at;function Ps(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function Cc(e){return e==="infinite"?1/0:+e}function Ac(e){if(bs(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let a={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(s,i,c)=>(i&&(r=+i),c&&(a.composite=c),"")),at??=document.createElement("style").style,at.animation=e,a.fill=at.animationFillMode;let n=a.fill==="forwards"||a.fill==="both",l=t?void 0:Ps(at.animationDuration);l!==void 0&&(a.duration=l);let o=Ps(at.animationDelay);return o!==void 0&&(a.delay=o),at.animationIterationCount&&(a.iterations=Cc(at.animationIterationCount)),{animation:at.animationName,keep:n,stagger:r,options:a}}function Tc(e){return typeof e=="string"&&(e=e.split(",").map(t=>Ac(t.trim()))),e}function mn(e,t,a,r){let n=r?`motion-${r}-on`:"motion-on",l=Tc(a);return e.setAttribute(n,""),f(...l.map(o=>xs({target:t,...o}))).finalize(()=>e.removeAttribute(n))}var zs=d(":host(:not([open],[motion-out-on])){display:none}");function fn(e,t=()=>e,a=!1){let r=ae(()=>B(t("in"))),n=ae(()=>B(t("out"))),l=ae(()=>e.duration!==void 0&&e.duration!==1/0?Ze(e.duration).map(()=>e.open=!1):$).log();return f(pe(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),le(h(e,"motion-in").map(o=>(o?r.mergeMap(s=>mn(e,s,o,"in")):r).mergeMap(()=>l)),h(e,"motion-out").map(o=>(o?n.switchMap(s=>mn(e,s,o,"out")):n).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([o,s])=>G(e,"open").switchMap(i=>{if(e.popover!=="auto"){let c=i?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:i?"closed":"open",newState:c}))}return i?a?$e(s,o):o:a?$e(s,o):s})))}var Ja=class extends g{open=!1;duration;"motion-in";"motion-out"};u(Ja,{init:[b("motion-in"),b("motion-out"),aa("duration"),v("open")]});var hn=class extends Ja{};u(hn,{tagName:"c-toggle-target",augment:[d(`
:host{display:contents}
`),e=>{let t=C("slot"),a=C("slot",{name:"off"});return(e.open?a:t).style.display="none",j(e).append(t,a),fn(e,r=>{t.style.display=a.style.display="none";let n=e.open?r==="in"?t:a:r==="in"?a:t;return n.style.display="",n.assignedElements()},!0)}]});function Hs(e){return f(h(e,"selected").pipe(Jo(e,"selected")),tt("selectable",e),K(e).tap(()=>ue(e,"selectable.action",e)))}var vt=class extends g{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};u(vt,{tagName:"c-option",init:[b("value"),Y("view"),v("selected"),v("hidden"),v("focused")],augment:[H("option"),d(":host{display:contents} :host([hidden]){display:none;}"),us,Hs,e=>{let t;return f(h(e,"view").switchMap(a=>a?(t?.remove(),e.rendered=t=new a,t.appendChild(C("slot")),j(e).append(t),f(h(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),h(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,$)))}]});function Us(e=document){document.documentElement.lang="en";let t=[C("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),C("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),C("meta",{name:"mobile-web-app-capable",content:"yes"}),C("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${O("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function Vs(e=2e3){return f(Ze(e),na()).first()}function Gs(e){return Vs().raf(()=>e.setAttribute("ready",""))}function Xa(e){return f(re(t=>{let a=Us(e.ownerDocument);t.signal.subscribe(()=>a.forEach(r=>r.remove()))}),Ye().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),Vs().switchMap(()=>ft(e).raf(t=>e.setAttribute("breakpoint",t))),Gs(e),ra.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var Mc=class extends g{connectedCallback(){requestAnimationFrame(()=>Us(this.ownerDocument)),super.connectedCallback()}};u(Mc,{tagName:"c-meta",augment:[()=>Gs(document.body)]});var gn=class extends g{};u(gn,{tagName:"c-page",augment:[Xa,d(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${Q("background")}
}`),R]});var bn=class extends Lt{icon="arrow_drop_down";open=!1;target;size};u(bn,{tagName:"c-nav-dropdown",init:[b("icon"),b("target"),v("open"),de("size",e=>`{min-height:${56+e*8}px}`)],augment:[H("treeitem"),...Za,d(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>Ot(e).raf(({target:t,open:a})=>t.open=a),e=>{let t=C(Ce,{className:"icon"});return j(e).append(t),f(h(e,"icon").tap(a=>t.name=a))}]});var xn=class extends g{};u(xn,{tagName:"c-nav-headline",augment:[d(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),R]});var vn=class extends hn{};u(vn,{tagName:"c-nav-target",augment:[H("group"),d(":host{display:block;padding-inline-start:12px;}")]});var yn=class extends an{};u(yn,{tagName:"c-button-round",augment:[d(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var we=class extends yn{icon="";width;height;fill=!1;variant="text";alt};u(we,{tagName:"c-icon-button",init:[b("icon"),b("width"),b("height"),b("alt"),b("fill")],augment:[e=>C(Ce,{className:"icon",width:h(e,"width"),height:h(e,"height"),name:h(e,"icon"),fill:h(e,"fill"),alt:h(e,"alt")})]});var Qa=class extends we{open=!1;target;icon="menu"};u(Qa,{tagName:"c-navbar-toggle",init:[b("target"),Y("open")],augment:[e=>Ot(e).tap(({target:t,open:a})=>t.open=a)]});function $c(e){let t=We();return f(tt("field",e,a=>t.next(a)),t)}function qs(e){return $c(e).switchMap(t=>h(e,"input").switchMap(a=>a?B(a):h(t,"input").switchMap(r=>r?B(r):$)))}function Rc(e){return Ba("list",e,e.items)}function Zs(e){return ks({host:e,getFocusable:()=>e.items,getSelected:()=>e.items.find(t=>t.selected),getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),observe:Rc(e)})}function Ws(e){return Ns({getFocusable:()=>e.items,getActive:()=>rn(e)})}function wn(e){let t=document.createElement("style");return f(re(a=>{let r=e.persistkey&&Fa.get(e.persistkey);r!==void 0?e.open=r===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),a.signal.subscribe(()=>t.remove())}),Pe(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let a=e.open?e.themeon:e.themeoff;e.persistkey&&Fa.set(e.persistkey,a),zr(jr[a]||a)}),K(e).tap(()=>e.open=!e.open))}var _c=class extends g{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};u(_c,{tagName:"c-toggle-theme",init:[b("persistkey"),b("usepreferred"),b("open"),b("themeon"),b("themeoff")],augment:[H("group"),wn]});var Ka=class extends we{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};u(Ka,{tagName:"c-icon-toggle-theme",init:[b("persistkey"),b("usepreferred"),b("open"),b("themeon"),b("themeoff")],augment:[wn,e=>le(h(e,"iconon"),h(e,"iconoff"),h(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var Ic=()=>{let e;function t(){let a=document.adoptedStyleSheets.indexOf(e);a!==-1&&document.adoptedStyleSheets.splice(a,1)}addEventListener("message",a=>{let{theme:r}=a.data;t(),r!==void 0&&(e=new CSSStyleSheet,e.replace(r).catch(n=>console.error(n)),document.adoptedStyleSheets.push(e))})},Oc=()=>{let e=()=>{let t=()=>{parent.postMessage({height:document.documentElement.scrollHeight},"*")};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(t).observe(document.documentElement)},a=>console.error(a))})};document.readyState==="complete"?e():addEventListener("load",e)},er=class extends g{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=m("iframe",{loading:"lazy"})};u(er,{tagName:"c-iframe",init:[b("src"),b("srcdoc"),b("sandbox"),b("handletheme")],augment:[d(`
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
	`),e=>{let t=e.iframe,a=m("slot",{name:"loading"}),r=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(r),a.style.display="none";function n(s){r.replaceSync(":host{height:"+s+"px}"),t.style.height="100%",t.style.opacity="1",a.style.display="none"}function l(s){if(s){let i=`<script type="module">
(${Oc.toString()})();
(${Ic.toString()})();
<\/script>`;t.srcdoc=`${e.reset}${s}${i}`,a.style.display=""}}async function o(s){let i=new URL(s);return`${i.search||i.hash?`<script>history.replaceState(0,0,'about:srcdoc${i.search}${i.hash}');<\/script>`:""}<base href="${s}" />`+await fetch(s).then(c=>c.text())}return j(e).append(t,a),f(le(h(e,"srcdoc"),h(e,"src")).raf(([s,i])=>{(async()=>{l(i?await o(i):s)})().catch(()=>{})}),E(window,"message").tap(s=>{let{height:i}=s.data;s.source===t.contentWindow&&i!==void 0&&n(i)}),h(e,"handletheme").switchMap(s=>s?E(t,"load").switchMap(()=>dt.raf(i=>{let c=i?.css??"";t.contentWindow?.postMessage({theme:c},"*")})):$),h(e,"sandbox").tap(s=>s===void 0?t.removeAttribute("sandbox"):t.sandbox.value=s))}]});function Ys(e){let t=Ws(e);function a(r){return Math.round(r.getBoundingClientRect().left)}return f(Zs(e),ua({host:e,goRight:()=>t(1),goLeft:()=>t(-1),goFirst:()=>t(1,-1),goLast:()=>t(-1,e.items.length),goUp:()=>{let r=Je(e)?.activeElement,n=r&&a(r);return t(-1,void 0,n!==void 0?l=>a(l)!==n:void 0)},goDown:()=>{let r=Je(e)?.activeElement,n=r&&a(r);return t(1,void 0,n!==void 0?l=>a(l)!==n:void 0)}}).tap(r=>r.focus()))}var En=class extends g{items=[]};u(En,{tagName:"c-grid-list",augment:[H("grid"),d(":host{display:grid;box-sizing:border-box;}"),R,Ys]});var rt=class extends g{pad;vertical=!1};u(rt,{tagName:"c-hr",init:[v("pad"),v("vertical")],augment:[H("separator"),d(`
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
${Qe.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});var Sn=class extends Ja{};u(Sn,{tagName:"c-toggle-panel",augment:[R,zs,fn]});var kn=class extends g{center=!1};u(kn,{tagName:"c-backdrop",init:[v("center")],augment:[d(`
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

	`),e=>E(e,"keydown").tap(t=>t.stopPropagation()),R]});var Js=d(`
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
${J("small","#drawer { width: 360px }")}

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
`),ma=class extends g{open=!1;position;responsive;permanent=!1};u(ma,{tagName:"c-drawer",init:[v("open"),v("position"),b("responsive"),b("permanent")],augment:[Js,d(`
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
`),e=>{let t=ce(!1),a=f(h(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",n=C(Sn,{id:"drawer","motion-in":a.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":a.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},R),l=new kn;l.id="backdrop";let o=C("dialog",{id:"dialog"},l,n);return j(e).append(o),f(E(n,"close").tap(()=>o.close()),E(o,"close").tap(()=>e.open=!1),pe(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),G(n,"open").tap(s=>e.open=s),G(e,"open").raf(s=>{s||n.scrollTo(0,0)}),E(l,"click").tap(()=>e.open=!1),E(o,"cancel").tap(s=>{s.preventDefault(),e.open=!1}),h(e,"open").tap(s=>{if(t.value&&e.permanent)return n.open=!0;s?t.value||(et.openModal({element:o,close:()=>e.open=!1}),o.getBoundingClientRect()):et.currentModal?.element===o&&et.modalClosed()}).raf(s=>{n.open=s}),h(e,"responsive").switchMap(s=>s!==void 0?ft(document.body):B("xsmall")).switchMap(s=>{let i=Z.breakpoints[e.responsive||"large"],c=Z.breakpoints[s]>=i;return t.next(c),c&&n.className!=="permanent"?o.close():!c&&n.className==="permanent"&&(e.open=!1),c&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",c),n.className=c?"permanent":"drawer",G(e,"open").tap(x=>{e.hasAttribute("responsiveon")||Ue({target:l,animation:x?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});function Nn({source:e,render:t,empty:a,append:r,loading:n}){let l=[],o=document.createDocumentFragment(),s,i;function c(x){if(i?.parentNode?.removeChild(i),!x)return;let A=0;for(let F of x){let U=l[A]?.item;if(U)U.value!==F&&U.next(F);else{let z=ce(F),te=t(z,A,x),X=te instanceof DocumentFragment?Array.from(te.childNodes):[te];l.push({elements:X,item:z}),o.append(te)}A++}o.childNodes.length&&r(o),s?.remove(),A===0&&a&&r(s=a());let M=l.length;for(;M-- >A;)l.pop()?.elements.forEach(F=>F.remove())}return ae(()=>(i=n?.(),i&&r(i),e.raf(c)))}function fa(e){return _r(()=>{let t=new js;return[Nn({...e,append:a=>t.insert(a)}),t.end]})}function Dc(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function Fc(e,t){let a=e.getRootNode();if(a instanceof Document)return Dc(a.getElementById(t));throw new Error("Invalid root node")}function Xs(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=Fc(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function Lc(e){return h(e,"template").switchMap(t=>t?B(Xs(e,t)):Ye().map(()=>Xs(e,e.children[0])))}function Qs(e,t,a){return Lc(e).switchMap(r=>{let n=e.target?bt(e,e.target)??e:e;return r?Nn({source:t,render:a?(l,o,s)=>a(r(l,o,s)):r,append:l=>n.append(l)}):$})}var Ks=class extends g{source;template};u(Ks,{tagName:"c-each",init:[Y("source"),Y("template")],augment:[Ne,R,e=>Qs(e,h(e,"source"))]});var Cn=class extends g{invalid=!1};u(Cn,{tagName:"c-field-help",init:[b("invalid")],augment:[d(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${O("body-small")}
}
	`),R,e=>(e.slot||="help",h(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var An=d(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${O("body-large")}
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
	${O("body-small")}
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
`),Bc=d(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${O("body-small")}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`),jc=d(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${O("body-large")}
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

${It(".content")}
	`);function Pc(e){return f(pe(e,"registable.form",!1).tap(t=>{t.id==="form"&&(e.input=t.target)}),cs("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var zc=()=>C("div",{className:"content"},C("slot",{name:"leading"}),C("div",{className:"body"},C("slot",{name:"label"}),C("slot",{id:"bodyslot"})),C("slot",{name:"trailing"}),C("div",{className:"indicator"}));function Hc(e){function t(c){n.next(c.touched&&c.invalid),e.toggleAttribute("invalid",n.value);let x=0,A=[];for(let F of o.assignedNodes())!(F instanceof HTMLElement)||F===i||("invalid"in F&&F.invalid?n.value&&(F.invalid===!0||F.invalid===c.validationResult?.key)?(x++,F.style.display="",A.push(He(F))):F.style.display="none":A.push(He(F)));let M=!n.value||x>0;i.textContent=M?"":c.validationMessage,M?i.remove():(i.parentElement||e.append(i),A.push(He(i))),A.length?c.setAria("describedby",A.join(" ")):c.setAria("describedby",null)}function a(c){let x=e.input;if(x){if(e.toggleAttribute("inputdisabled",x.disabled),t(x),!c)return;c.type==="focus"?l.next(!0):c.type==="blur"&&l.next(!1)}}function r(){let c=e.input?.value,x=!e.input?.hasAttribute("autofilled")&&(!c||c.length===0);s?.classList.toggle("novalue",x),s?.classList.toggle("value",!x)}let n=ce(!1),l=ce(!1),o=C("slot",{name:"help"}),s=e.contentElement.children[1]?.children[0],i=C(Cn,{ariaLive:"polite"});return j(e).append(C("div",{className:"help"},o)),f(h(e,"input").switchMap(c=>c?f(B(void 0).tap(()=>{a(),queueMicrotask(r)}),E(c,"focusable.change").tap(a).tap(r),E(c,"focus").tap(a),E(c,"invalid").tap(a),E(c,"update").tap(r),G(c,"touched").tap(()=>a()),f(E(c,"blur"),E(o,"slotchange")).raf(a),E(e.contentElement,"click").tap(()=>{document.activeElement!==c&&!e.matches(":focus-within")&&!l.value&&c.focus()})):$),Pc(e))}var ha=class ei extends g{floating=!1;input;size;contentElement=zc();static{u(ei,{init:[v("floating"),Y("input"),de("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Hc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},Uc=class extends ha{};u(Uc,{tagName:"c-field",augment:[An,Bc,jc]});var tr=class extends ha{};u(tr,{tagName:"c-field-bar",augment:[An,d(`
:host {
	box-sizing: border-box;
	${Q("surface-container-high")}
	${O("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var jt=class extends g{color;size=0};u(jt,{tagName:"c-pill",init:[ht("color","surface-container-low"),de("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[d(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${O("label-large")}
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
		`),()=>C("slot",{name:"leading"}),R,()=>C("slot",{name:"trailing"})]});var Pt=class extends jt{disabled=!1;touched=!1;selected=!1};u(Pt,{tagName:"c-chip",init:[v("disabled"),v("touched"),v("selected")],augment:[H("button"),tn,...ca,d(`
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
		`),Ie]});var Tn=class extends g{};u(Tn,{tagName:"c-body",augment:[d(`
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

${J("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),R]});function ar({host:e,input:t,handleOther:a=!1,axis:r}){let n=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function l(A=1){if(e.open===!1){e.open=!0;let M=n();requestAnimationFrame(()=>{M?.focused&&c(M)})}else return o(A)}function o(A=1,M){let F=n(),U=M??(F?e.options.indexOf(F):-1),z;do z=e.options[U+=A];while(z?.hidden);return z}function s(A){let M=A.key;if(/^\w$/.test(M)){let F=n(),U=F?e.options.indexOf(F):-1;if(U===-1)return;let z=U;z+1>=e.options.length&&(U=0);let te=new RegExp(`^\\s*${M}`,"i"),X;for(;X=e.options[++U];)if(!X.hidden&&X.textContent.match(te))return X;if(z===0)return;for(U=0;U<z&&(X=e.options[U++]);)if(!X.hidden&&X.textContent.match(te))return X}}let i=()=>e.options.find(A=>A.focused);function c(A){for(let M of e.options)M.focused=!1;A?(A.focused=!0,t?.setAria("activedescendant",He(A)),A.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let x=A=>ue(A,"selectable.action",A);return f(ua({host:t??e,...r==="x"?{goLeft:()=>l(-1),goRight:()=>l(1)}:{goDown:()=>l(1),goUp:()=>l(-1)},goFirst:()=>e.open!==!1?o(1,-1):void 0,goLast:()=>e.open!==!1?o(-1,e.options.length):void 0,other:a?s:void 0}).tap(A=>{e.open===!1?x(A):c(A)}),E(t??e,"focus").tap(()=>c(n())),$r(t??e,"Enter").tap(A=>{let M=i();e.open!==!1&&M?(A.stopPropagation(),x(M)):e.open===!1&&(e.open=!0)}))}function Mn(e){return new _(t=>{f(Ba("selectable",e,e.options,a=>{if(a.type==="connect"&&(a.target.view=e.optionView,a.target.selected))return e.defaultValue===void 0&&(e.defaultValue=a.target.value),t.next(a.target);let r;for(let n of e.options)n.hidden||!n.parentNode||n.selected&&(r?n.selected=!1:r=n);t.next(r)}),pe(e,"selectable.action").tap(a=>{if(!e.disabled&&e.options.includes(a)){let r=e.value!==a.value;t.next(a),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var yt={},rr=class ti extends ja{options=[];_value;_selected=yt;static{u(ti,{init:[b("value"),Y("selected")],augment:[t=>Mn(t).tap(a=>{(!a||a!==t.selected)&&t.setSelected(a)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===yt?this.options[0]?.value:this._value}get selected(){return this._selected===yt&&this.options[0]?this.options[0]:this._selected}set value(t){if(this._selected&&this._selected!==yt&&this._selected.value===t){this._value=t;return}else for(let a of this.options)if(a.value===t){this._value=t,this.setSelected(a);return}this._selected!==yt?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let a of this.options)a.focused=a.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==yt&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=yt)}};var ai=class extends g{};u(ai,{tagName:"c-button-segmented-view",augment:[d(`
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
		`),mt,Ie,()=>C(Ce,{id:"check",name:"check"}),R]});var nr=class extends rr{optionView=ai;size};u(nr,{tagName:"c-button-segmented",init:[de("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[H("listbox"),d(`
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
	${O("label-large")}
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
		`),xe,R,_e,e=>ar({host:e,axis:"x"})]});var ri=d(`
:host {
	${Q("surface-container")}
	${O("body-medium")}
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
${gt()}
`),nt=class extends Ke{variant};u(nt,{tagName:"c-card",init:[v("variant")],augment:[ri]});var $n=class extends nt{disabled=!1;touched=!1;selected=!1};u($n,{tagName:"c-card-item",init:[v("disabled"),v("touched"),v("selected")],augment:[H("option"),...ca,d(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),pn,Ie]});var or=[d(`
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
	${O("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${O("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${O("headline-medium")}
	flex-wrap: wrap;
}`),R,()=>C("slot",{name:"title"})];function Vc(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var sr=class extends g{size;sticky=!1;contextual};u(sr,{tagName:"c-appbar",init:[v("size"),v("sticky"),v("contextual")],augment:[d(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...or,()=>C("slot",{name:"contextual"}),e=>h(e,"sticky").switchMap(t=>t?Jt(e,{threshold:[1]}).tap(a=>e.toggleAttribute("scroll",a.intersectionRatio<1)):$),e=>{let t;return f(Zt(e),h(e,"contextual")).raf().switchMap(()=>{for(let a of e.children)if(Vc(a)&&(a.slot="contextual",a.open=a.name===e.contextual,a.open))return t=a,E(a,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,$})}]});var Rn=class ni extends g{name;size;open=!1;backIcon=C(we,{icon:"arrow_back",className:"icon",ariaLabel:Dt.get("core.close"),$:t=>K(t).tap(()=>this.open=!1)});static{u(ni,{tagName:"c-appbar-contextual",init:[b("name"),v("open"),v("size")],augment:[t=>t.backIcon,...or,d(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>G(t,"open").tap(a=>{a||t.dispatchEvent(new Event("close"))})]})}};function oi(e,t,a){a==="in"&&(e.style.display="");let r=e.offsetWidth,n=Ue({target:e,animation:{kf:{[t]:a==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});a==="out"&&(n.onfinish=()=>e.style.display="none")}var zt=class extends g{sheetstart=!1;sheetend=!1};u(zt,{tagName:"c-application",init:[v("sheetstart"),v("sheetend")],augment:[d(`
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
${gt()}
	`),Xa,e=>pe(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>pe(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=C("slot",{name:"start"}),a=C("slot",{id:"body"}),r=C("slot",{name:"end"}),n=ze("html { overflow: hidden }");return j(e).append(t,a,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),et.popupContainer=e,f(re(l=>{let o=e.ownerDocument.adoptedStyleSheets;o.push(n),l.signal.subscribe(()=>{let s=o.indexOf(n);s!==-1&&o.splice(s,1)})}),G(e,"sheetstart").tap(l=>oi(t,"marginLeft",l?"in":"out")),G(e,"sheetend").tap(l=>oi(r,"marginRight",l?"in":"out")))}]});function Gc({host:e,target:t,position:a,onToggle:r,whenClosed:n=$}){return l=>(t.popover??="auto",t.togglePopover(l),r?.(l),l?f(Qt(e),E(window,"resize"),E(window,"scroll",{capture:!0,passive:!0})).tap(a):n)}function si(e){let{host:t,beforeToggle:a,target:r}=e,n=Gc({...e,whenClosed:K(t).tap(()=>{t.open=!0})});return f(E(r,"toggle").tap(l=>{let o=l.newState==="open";t.open=o}),h(t,"open").raf().switchMap(l=>(a?.(l),t.ariaExpanded=l?"true":"false",n(l))))}var qc=d(`
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
`),ii=d(`
${Br("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function Zc(e,t){return()=>{let a=e.parentElement instanceof ha?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${a.bottom}px`,t.style.left=`${a.x}px`,t.style.minWidth=`${a.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-a.bottom-16,280)}px`}}function _n({host:e,target:t,input:a,position:r,beforeToggle:n,onToggle:l,handleOther:o,axis:s}){return f(ar({host:e,input:a,handleOther:o,axis:s}),E(a??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),si({host:e,target:t,position:r??Zc(e,t),beforeToggle:n,onToggle:l}))}function Wc(e){let{host:t}=e;return f(qc(t)??$,xe(t)??$,_e(t),_n(e))}var ir=class extends g{};u(ir,{tagName:"c-select-option",augment:[d(`
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
		`),R]});var Yc=class extends rr{open=!1;optionView=ir;setSelected(e){if(super.setSelected(e),this.open)this.open=!1;else{for(let t of this.options)t!==e&&(t.slot="");e&&(e.slot="selected")}}};u(Yc,{tagName:"c-select",init:[v("open")],augment:[H("listbox"),d(`
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
		`),e=>{let t=C("div",{className:"menu"},C("slot")),a=C("slot",{name:"selected"}),r=t.style,n=Hr(e),l=0,o=0;j(e).append(t,a,za({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function s(){if(e.open)o=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let i=e.options.reduce((c,x)=>Math.max(c,x.rendered?.offsetWidth??0),0);n.replaceSync(`:host{width:min(100%,${i}px)}`)}}return f(f(Se(e),na()).raf(s),Wc({host:e,target:t,handleOther:!0,beforeToggle(i){s();let c=e.selected;c&&(c.slot=i?"":"selected"),t.classList.toggle("open",i)},onToggle(i){let c=e.selected;!i&&c&&(l=c.rendered?.offsetHeight??0)},position(){let i=e.parentElement??e,c=Math.round((o-l)/2),x=e.selected?.rendered,A=i.getBoundingClientRect(),M=e.getBoundingClientRect(),F=M.top-14,U,z=x?x.offsetTop:0;z>F&&(z=F),U=t.scrollHeight;let te=window.innerHeight-M.top+8+z,X=M.top-c-z;U>te?U=te:U<M.height&&(U=M.height),r.top=X+"px",r.left=A.left+"px",r.maxHeight=U+"px",r.minWidth=A.width+"px",r.transformOrigin=`${z}px`}}))}]});function Jc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var ga=class li extends Kr{selected;value;inputEl=C("input",{className:"input"});static{u(li,{tagName:"c-input-option",init:[b("value"),Y("selected")],augment:[...Qr,t=>t.append(t.inputEl),t=>Pa({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:a=>a!==""?t.selected?.value:void 0}),t=>G(t,"selected").tap(a=>{let r=t.selected?.textContent;t.value=a?.value,t.setInputValue(r??""),Jc(t.inputEl)})]})}};function ci(e){return lr(e,"^")}function lr(e,t=""){if(e==="")return()=>!0;let a=cr(e,t);return r=>r.textContent?a.test(r.textContent):!1}function cr(e,t="",a="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),a)}var In=class ui extends g{optionView=ir;open=!1;debounce=100;options=[];matcher=lr;static{u(ui,{tagName:"c-autocomplete",init:[v("open"),aa("debounce")],augment:[H("listbox"),ii,Ne,t=>{let a=C("slot",{name:"empty"}),r=C("div",{id:"menu",tabIndex:-1},C("slot"),a),n=za({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});n.style.cursor="pointer",a.style.display="none";function l(i){t.open=!0,s(i)}function o(i,c){i.setAria("activedescendant",He(c)),c.rendered?.scrollIntoView({block:"nearest"})}function s(i){let c=i.inputValue??i.value,x=t.doSearch(c);a.style.display=x?"none":"",x&&o(i,x)}return j(t).append(r,n),f(qs(t).switchMap(i=>(i.setAria("autocomplete","list"),i.role="combobox",i.setAria("controls",He(t)),i.setAria("haspopup",t.role),i.setAttribute("autocomplete","off"),f(h(t,"open").tap(c=>{if(c)n.tabIndex=-1,l(i);else{for(let x of t.options)x.focused=!1;n.tabIndex=0,i.setAria("activedescendant",null)}i.setAria("expanded",String(c))}),f(Yt(n),E(n,"mousedown")).tap(c=>{c.preventDefault(),c.stopPropagation(),i.focus()}).debounceTime(100).tap(()=>{t.open=!0}),h(t,"debounce").switchMap(c=>E(i,"input").debounceTime(c).tap(()=>t.open?s(i):l(i))),E(t,"change").tap(c=>{c.target===t&&i.dispatchEvent(new Event("change",{bubbles:!0}))}),_n({host:t,target:r,input:i}),f(Mn(t),G(i,"value").map(c=>{for(let x of t.options)if(x.value===c)return x})).tap(c=>{for(let x of t.options)x.focused=x.selected=!1;c&&(c.selected=!0),i instanceof ga?i.selected=c:i.value=c?.value,c&&(t.open=!1)})))))}]})}doSearch(t){let a=0,r,n=this.matcher==="substring"?lr:this.matcher==="prefix"?ci:this.matcher,l=t?n(String(t)):void 0;for(let o of this.options){let s=!l?.(o);o.hidden=s,o.focused=!(s||a++>0),o.focused&&(r=o)}return r}};var ur=class extends In{onsearch;doSearch(e){return ut(this,"search",{detail:e}),this.options[0]}};u(ur,{tagName:"c-autocomplete-dynamic",init:[ta("search")]});var On=class extends qa{};u(On,{tagName:"doc-a"});var wt=class extends tr{};u(wt,{tagName:"doc-search-input",augment:[e=>{let t=ce([]),a=m(ur,{$:r=>E(r,"search").tap(n=>{let l=n.detail,o=[],s=1e3;if(l){let i=cr(l);for(let c of CONFIG.symbols)if(i.test(c.name)&&(o.push(c),s--<0))break}t.next(o)})},fa({source:t,render:r=>m(vt,{value:r.map(n=>n.href)},r.map(n=>n.name)),empty:()=>m(Ke,{slot:"empty",pad:16},"No Results Found")}));a.style.maxHeight="50%",e.size=-2,e.append(m(Ce,{name:"search"}),m(ga,{$:r=>h(r,"selected").tap(n=>{let l=n?.value;typeof l!="string"||!l||(CONFIG.spa?fe.go(l):location.href=l,r.value="")})}),a)}]});var ba=class extends g{};u(ba,{tagName:"doc-search",augment:[d(`
:host { display: block; }
c-appbar-contextual {
	position: absolute;
	inset: 0;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	z-index: 1;
}
		`),e=>{let t=m(Rn),a=m(La,{target:t},m(we,{icon:"search"})),r=m(wt);return e.shadowRoot?.append(t,a),ft(document.body).tap(n=>{n==="xsmall"?(t.style.display="",a.style.display="",t.append(r)):(t.open=!1,t.style.display="none",a.style.display="none",r.parentNode!==e.shadowRoot&&e.shadowRoot?.append(r))})}]});var xa=class extends sr{sticky=!0};u(xa,{tagName:"doc-appbar",augment:[d(J("large",":host{display:none}")),e=>{e.append(m(Qa,{target:"navbar"}),m(me,{grow:!0},CONFIG.packageName),m(ba))}]});var Xc=["Property","Method","Function","Event","Class","Namespace","Interface","Enum","TypeAlias","Attribute","Component","Constant"],pi=Xc.map(e=>`:host([kind=${e}]){--cxl-color-surface:var(--3doc-chip-${e}-bg);--cxl-color-on-surface:var(--3doc-chip-${e}-fg)}`).join(""),Ve=class extends jt{kind;size=-1};u(Ve,{tagName:"doc-pill",init:[v("kind")],augment:[d(`
:host { ${O("code")}; border: 0; }
${pi}`)]});var va=class extends Pt{kind;size=-1};u(va,{tagName:"doc-chip",init:[v("kind")],augment:[d(`
:host { ${O("code")} }
${pi}`)]});var Dn=class extends g{name;kind};u(Dn,{tagName:"doc-card",init:[b("kind"),b("name")],augment:[d(`
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
${J("medium",":host{}")}
		`),e=>{e.shadowRoot?.append(m(nt,{color:"surface",variant:"outlined"},m("div",{id:"header"},m(Ve,{kind:h(e,"kind")},h(e,"kind")),m(ee,{id:"title",font:"title-medium"},h(e,"name")),m("slot",{name:"tags"})),m("div",{id:"body"},m("slot"))))}]});var ya=class extends g{language="html";formatter=t=>{let a;try{a=hljs.highlight(t,{language:this.language}).value}catch{a=t}return`<code>${a}</code>`}};u(ya,{tagName:"doc-hl",init:[b("language")],augment:[d(`
:host {
	display: block;
	padding:16px; border-radius: 8px;
	${Q("surface-container")}
	color: var(--hljs-on-surface);
	background-color: var(--hljs-surface);
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

	`),e=>{let t=m("div",{className:"hljs"});return t.style.tabSize="4",j(e).append(t),Se(e).switchMap(()=>Xt(e).raf(()=>{let a=Array.from(e.childNodes).map(r=>r.textContent).join("");t.innerHTML=a&&e.formatter?e.formatter(a):a}))}]});var Fn=class extends g{};u(Fn,{tagName:"doc-grd",augment:[d(`:host {
	padding: 8px 16px;
	display: grid;
	gap: 16px 12px;
}
${J("small",":host{grid-template-columns:repeat(2, minmax(0px,1fr))}")}
${J("medium",":host{grid-template-columns:repeat(3, minmax(0px,1fr))}")}
${J("large",":host{grid-template-columns:repeat(4, minmax(0px,1fr))}")}
`),R]});var wa=class extends g{view="mobile";header="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";libraries;getLibraryUrl(t){return`https://cdn.jsdelivr.net/npm/${t}`}};u(wa,{tagName:"doc-demo-bare",init:[b("view"),b("libraries"),b("header")],augment:[d(`
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
	`),e=>{let t=h(e,"view"),a=ce("container"),r=m(er,{className:a}),n=m(ya,{className:t.map(c=>c==="source"?"source visible":"source")}),l=m("div",{id:"toolbar"},m("slot",{name:"toolbar"}),m(we,{$:c=>K(c).mergeMap(async()=>{await navigator.clipboard.writeText(o),c.icon="done",setTimeout(()=>c.icon="content_copy",2e3)}),height:20,icon:"content_copy",title:"Copy source to clipboard",className:t.map(c=>c==="source"?"icon":"icon hide")}),m(nr,{$:c=>h(c,"value").tap(x=>{(x==="desktop"||x==="source")&&(e.view=x)}),id:"view",size:-2},m(vt,{value:"desktop"},"Preview"),m(vt,{value:"source"},"Code"))),o;function s(c){let x=c==="desktop";a.next(x?"container":"container cmobile")}function i(){let c=e.childNodes[0]?.textContent?.trim()||"";if(!c)return;let x=e.libraries?e.libraries.split(",").map(A=>`<script type="module" src="${e.getLibraryUrl(A)}"><\/script>`).join(""):"";r.srcdoc=`${e.header}${x}${c}`,o=c,n.replaceChildren(new Text(c))}return j(e).append(l,m("div",{id:"body"},m(Ha,{className:t.map(c=>c==="source"?"parent":`parent visible ${c}`)},r),n)),f(h(e,"view").tap(s),Se(e).switchMap(()=>Xt(e).raf(i)))}]});var Ea=class extends wa{header=this.getHeader();getHeader(){let t="<style>html{overflow:hidden;color: var(--cxl-color-on-background);background-color:var(--cxl-color-background)}</style>";return typeof CONFIG<"u"?t+`${CONFIG.demoStyles?`<style>${CONFIG.demoStyles}</style>`:""}${CONFIG.demoScripts?.map(a=>`<script type="module" src="${a}"><\/script>`).join("")??""}`:t}};u(Ea,{tagName:"doc-demo"});function di(e){let t=e.index;function a(s){if(!(!s||typeof s=="string")&&typeof s=="number")return t.find(i=>i.id===s)}function r(s){if(!(!s||typeof s=="string")){if(typeof s=="number"){let i=t.find(c=>c.id===s);return i&&(i.kind===4||i.kind===8)?i:i?r(i.resolvedType??i.type):void 0}return s.kind===6?a(s.type):s.resolvedType&&typeof s.resolvedType!="string"?s.resolvedType:s}}function n(s,i){if(s.children){for(let c of s.children)!c.name||c.flags&&c.flags&128||(i[c.name]??=c);return i}}function l(s,i={}){n(s,i);let c=r(s.type);if(c?.children)for(let x of c.children){let A=r(x);if(A?.kind!==35||A.name==="Component")break;l(A,i)}return i}function o(s){return s.kind===17||s.kind===16||s.kind===11||s.kind===13}return{getNodeProperties:l,getTypeSummary:r,isFunction:o,getRef:a,json:e}}var eu={31:"Constants",1:"Variables",4:"Interfaces",8:"Classes",10:"Properties",11:"Methods",12:"Getters",13:"Setters",14:"Constructor",16:"Functions",22:"Enums",35:"Components",36:"Attributes",2:"Type Alias",38:"Call Signature",39:"Construct Signature",44:"Events",24:"Index Signature",25:"Exports",37:"Namespaces"};function mi(e){return typeof e=="string"?e:e.map(t=>t.value).join(" ")}function tu(e){return e.name?`docs/ui-${e.name}`:void 0}function au(e){let t=tu(e),a=e.name??"?";return t?m("a",{href:t},a):a}function fi({summary:e,summaryJson:t,link:a=au,uiCdn:r,importmap:n}){let{getTypeSummary:l,getRef:o,isFunction:s}=di(t),i=t.index;function c(S){if(S)return typeof S=="string"?S:l(S)??(typeof S=="number"?void 0:S.name)}function x(S){return S?"&lt;"+S.map(k=>M(k)+(k.kind!==6&&k.type?` extends ${M(k.type)}`:"")).join(", ")+"&gt;":""}function A(S){return["{ ",...S.children?.map(he).flatMap(X("; "))??[]," }"]}function M(S){let k=c(S);if(!k||typeof k=="string")return[k||"?"];switch(k.kind){case 5:return k.children?.map(M).flatMap(X(" | "))??[];case 23:case 32:return[k.name??"?"];case 34:return A(k);case 15:return[...M(k.type),"[]"];case 4:case 8:case 35:{let P=k.typeP?x(k.typeP):void 0;return[a(k),P]}case 17:return he(k);case 33:{let P=o(S);return[P?a(P):k.name??"?"]}case 21:return[...M(k.children?.[0]),"[",...M(k.children?.[1]),"]"];default:console.log(k)}return[]}function F(S){let k=S.flags??0;return[`${`${k&4?"public ":k&8?"private":k&16?"protected ":""}${k&262144?"...":""}${S.name}${k&524288?"?":""}`}: `,...M(S.type)]}function U(S){return["(",...S?.map(F).flatMap(X(", "))??[],")"]}function z(S){let k=S.flags??0,P=S.kind===12?"get ":S.kind===13?"set ":void 0;return[k&32?"static ":"",k&64?"readonly ":"",k&128?"abstract ":"",P]}function te(S){return["[",...S.parameters?.flatMap(he)??[],"]: ",...S.type?M(S.type):["?"]]}function X(S){return(k,P)=>P!==0?[...S,...k]:k}function he(S){if(S.kind===24)return te(S);if(S.kind===45&&S.children?.[0])return["...",...M(S.children[0])];let k=S.flags&&S.flags&524288,P=s(S)?U(S.parameters):[],p=S.kind===17;return[...z(S),S.name,k?"?":"",...P,p?" => ":": ",...M(S.resolvedType??S.type)]}function Oe(S){return[m("h3",{},m(ee,{font:"title-large"},...he(S))),...it(S)]}function Ae(S,k){if(!S.children)return[];let P={};for(let p of S.children)p.kind!==14&&p.kind!==0&&(p.flags||0)&4&&!k?.(p)&&(P[p.kind]??={name:eu[p.kind]??"",nodes:[]}).nodes.push(p);return Object.values(P).sort(Gr("name")).flatMap(p=>[m("h2",{},p.name),...p.nodes.flatMap(Oe)])}function st(S){let k="";S=S.replace(/<caption>(.+?)<\/caption>/,(N,L)=>(k=L,""));let P=`<style>html{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;overflow-x:hidden;overflow-y:auto;padding:24px;gap:32px;min-height:96px;color:var(--cxl-color-on-background);
background-color:var(--cxl-color-background)}</style>`,p=(n??"")+`<script type="module" src="${r}"><\/script>`,y=m(Ea,{header:P+p},S);return[k?m(ee,{font:"title-medium"},k):void 0,y]}function De(S){return i.find(k=>k.name===S)}function Vt(S){let k=S.flatMap(P=>{let p=P.value,y=mi(p);if(typeof p=="string"){let N=De(p);y=N?a(N):p}return[y,", "]});return k.pop(),m("p",{},"Related: ",k)}function ge({src:S}){let k=m("div");return k.textContent=S,k}function it(S){let k=S.docs;if(!k?.content)return[];let P=[],p=k.content.flatMap(y=>{let N=mi(y.value);return y.tag==="icon"||y.tag==="title"?[]:y.tag==="example"||y.tag==="demo"||y.tag==="demoonly"?st(N):y.tag==="see"?(P.push(y),[]):y.tag==="return"?[m(ee,{font:"headline-small"},"Returns"),m("p",void 0,N)]:y.tag==="param"?[m("p",void 0,N)]:[y.tag?m("p",void 0,`${y.tag}: `,N):ge({src:N})]});return P.length&&p.push(Vt(P)),p}function kt(S){let k=[],P=l(S);if(P?.kind===33)return P.children?.forEach(p=>{if(typeof p!="object")return;let y=l(p);y&&y.name!=="Component"&&k.push(a(y))}),m(ee,{font:"headline-small"}," ",...k.length?["extends ",k]:[])}function Nt(S){let k=l(S.type),P=[];if(!k?.children)return[];for(let p of k.children){let y=l(p);if(y?.kind!==35||y.name==="Component")break;let N=Ae(y,L=>!!((L.flags??0)&128));N.length&&P.push(m("br"),m(ee,{font:"h6"},"Inherited from ",a(y)),...N),P.push(...Nt(y))}return P}let Ct=e.kind===35&&e.docs?.tagName;return m("div",{},m("h1",{},e.name," ",e.type&&kt(e.type)," ",Ct?m(ee,{font:"title-medium"},`<${Ct}>`):""),...it(e),...Ae(e),...Nt(e))}var Sa=class extends g{name;summary;uicdn;importmap=""};u(Sa,{tagName:"doc-page",init:[Y("name"),Y("summary"),Y("uicdn")],augment:[e=>Pe(e).raf(()=>{if(e.replaceChildren(),!e.name||!e.summary)return;let t=e.name,a=e.summary.index.find(r=>r.name===t);a&&e.append(fi({summary:a,summaryJson:e.summary,uiCdn:e.uicdn??"",importmap:e.importmap}))})]});Z.colors["outline-variant"]="rgb(219, 221, 225)";var Ln=class extends zt{summary;sheetstart=!0};u(Ln,{tagName:"doc-root",augment:[e=>{let t=We();fetch("summary.json").then(a=>a.json()).then(a=>t.next(a)).catch(a=>console.error(a)),e.append(m(Sa,{summary:t}))}]});var Bn=class extends g{summary;selected};u(Bn,{tagName:"doc-nav-list",init:[Y("summary"),Y("selected")],augment:[e=>fa({source:h(e,"summary").map(t=>t?.index),render:t=>m(Bt,{$:a=>K(a).tap(()=>e.selected=t.value.name),size:-2},t.value.name,t.value.docs?.beta?m(Pt,{size:-2},"beta"):void 0)})(e)]});var jn=class extends Wa{};u(jn,{tagName:"doc-item"});Z.globalCss+=`
doc-ct { gap:8px;margin-bottom:24px;white-space:wrap;font:var(--cxl-font-code);font-size:18px;display:flex;align-items:center; }
doc-card dl { display: flex; flex-direction: column; }
doc-card dt { border-inline-start: 2px solid var(--cxl-color-outline-variant); padding-inline-start: 16px; }
doc-card dd { border-inline-start: 2px solid var(--cxl-color-outline-variant); margin-inline-start: 0; padding-inline-start: 16px; margin-bottom:16px; }
:last-child{margin-bottom:0}
code{border-radius:4px;background-color:var(--cxl-color-surface-container);color:var(--cxl-color-on-surface);padding:2px 4px;${O("code")}}
`;var Pn=class extends g{};u(Pn,{tagName:"doc-app",augment:[d(`
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
#page { padding: 16px; flex-grow: 1; ${O("body-large")}; overflow-y: auto; }
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
${J("large",`
#navbar-container { width: auto; visibility: visible; }
#page { padding: 48px 32px; }
`)}
		`),e=>{e.style.opacity="1";let t=m(ma,{id:"navbar",responsive:"large"},m("slot",{name:"navbar"})),a=m(zt,void 0,m(xa),m(me,{id:"body"},m(me,{vflex:!0,id:"navbar-container"},m(me,{pad:16,vpad:24,middle:!0},m(ee,{font:"title-medium"},CONFIG.packageName),m(ee,{id:"version",font:"title-small"},CONFIG.activeVersion)),m(rt),m(Ke,{pad:16},m(wt)),t,m(rt),m(me,{pad:16},m(me,{grow:!0}),m(Ka,{persistkey:"3doc.theme"}))),m("div",{id:"page"},m("div",{id:"pagebody"},m("slot")))));e.shadowRoot?.append(a),e.append(new Ya)}]});var zn=class extends g{module;kind;tags};u(zn,{tagName:"doc-page-header",init:[b("kind"),b("tags"),b("module")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
#title { margin-inline-end: auto; }
		`),e=>{e.shadowRoot?.append(m(ee,{font:"title-small"},h(e,"module")),m(me,{gap:16,middle:!0},m(Ve,{kind:h(e,"kind")},h(e,"kind")),m(ee,{font:"headline-small",id:"title"},m("slot")),m("slot",{name:"tags"})),m(rt))}]});var Hn=class extends nt{};u(Hn,{tagName:"doc-members",augment:[d(`
:host { display: flex; flex-direction: column; gap: 16px; margin: 32px 0; }
		`),e=>{e.variant="outlined",e.color="surface-container-low",e.pad=16,e.shadowRoot?.prepend(m(ee,{font:"title-small"},"Members"))}]});var Un=class extends g{href};u(Un,{tagName:"doc-member",init:[b("href")],augment:[d(`
		`),e=>{e.shadowRoot?.append(m(Ft,{href:h(e,"href")},m(va,void 0,m("slot"))))}]});var Vn=class extends g{kind};u(Vn,{tagName:"doc-group",init:[b("kind")],augment:[d(`
:host { display: flex; flex-direction: column; gap: 8px; }
c-flex { flex-wrap: wrap; }
		`),e=>{e.shadowRoot?.append(m(me,{gap:16,middle:!0},m(Ve,{kind:h(e,"kind")},h(e,"kind")),m(ee,{font:"title-small"},"")),m(me,{gap:8,middle:!0},m("slot")))}]});var Di=il(Oi(),1);var hr=Di.default;function Fi(e){let t=e.regex,a=t.concat(/[\p{L}_]/u,t.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),r=/[\p{L}0-9._:-]+/u,n={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},l={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},o=e.inherit(l,{begin:/\(/,end:/\)/}),s=e.inherit(e.APOS_STRING_MODE,{className:"string"}),i=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:r,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[n]},{begin:/'/,end:/'/,contains:[n]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[l,i,s,o,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[l,o,i,s]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},n,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[i]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:t.concat(/</,t.lookahead(t.concat(a,t.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:a,relevance:0,starts:c}]},{className:"tag",begin:t.concat(/<\//,t.lookahead(t.concat(a,/>/))),contains:[{className:"name",begin:a,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}var gr="[A-Za-z$_][0-9A-Za-z$_]*",Li=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Bi=["true","false","null","undefined","NaN","Infinity"],ji=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Pi=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],zi=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Hi=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Ui=[].concat(zi,ji,Pi);function qu(e){let t=e.regex,a=(N,{after:L})=>{let W="</"+N[0].slice(1);return N.input.indexOf(W,L)!==-1},r=gr,n={begin:"<>",end:"</>"},l=/<[A-Za-z0-9\\._:-]+\s*\/>/,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(N,L)=>{let W=N[0].length+N.index,se=N.input[W];if(se==="<"||se===","){L.ignoreMatch();return}se===">"&&(a(N,{after:W})||L.ignoreMatch());let ve,lt=N.input.substring(W);if(ve=lt.match(/^\s*=/)){L.ignoreMatch();return}if((ve=lt.match(/^\s+extends\s+/))&&ve.index===0){L.ignoreMatch();return}}},s={$pattern:gr,keyword:Li,literal:Bi,built_in:Ui,"variable.language":Hi},i="[0-9](_?[0-9])*",c=`\\.(${i})`,x="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",A={className:"number",variants:[{begin:`(\\b(${x})((${c})|\\.)?|(${c}))[eE][+-]?(${i})\\b`},{begin:`\\b(${x})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},M={className:"subst",begin:"\\$\\{",end:"\\}",keywords:s,contains:[]},F={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"xml"}},U={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"css"}},z={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,M],subLanguage:"graphql"}},te={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,M]},he={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},Oe=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,F,U,z,te,{match:/\$\d+/},A];M.contains=Oe.concat({begin:/\{/,end:/\}/,keywords:s,contains:["self"].concat(Oe)});let Ae=[].concat(he,M.contains),st=Ae.concat([{begin:/(\s*)\(/,end:/\)/,keywords:s,contains:["self"].concat(Ae)}]),De={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:s,contains:st},Vt={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,t.concat(r,"(",t.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},ge={relevance:0,match:t.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...ji,...Pi]}},it={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},kt={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[De],illegal:/%/},Nt={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function Ct(N){return t.concat("(?!",N.join("|"),")")}let S={match:t.concat(/\b/,Ct([...zi,"super","import"].map(N=>`${N}\\s*\\(`)),r,t.lookahead(/\s*\(/)),className:"title.function",relevance:0},k={begin:t.concat(/\./,t.lookahead(t.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},P={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},De]},p="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",y={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,t.lookahead(p)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[De]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:s,exports:{PARAMS_CONTAINS:st,CLASS_REFERENCE:ge},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),it,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,F,U,z,te,he,{match:/\$\d+/},A,ge,{scope:"attr",match:r+t.lookahead(":"),relevance:0},y,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[he,e.REGEXP_MODE,{className:"function",begin:p,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:s,contains:st}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:n.begin,end:n.end},{match:l},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,contains:["self"]}]}]},kt,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[De,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},k,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[De]},S,Nt,Vt,P,{match:/\$[(.]/}]}}function Vi(e){let t=e.regex,a=qu(e),r=gr,n=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],l={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},o={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:n},contains:[a.exports.CLASS_REFERENCE]},s={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},i=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:gr,keyword:Li.concat(i),literal:Bi,built_in:Ui.concat(n),"variable.language":Hi},x={className:"meta",begin:"@"+r},A=(z,te,X)=>{let he=z.contains.findIndex(Oe=>Oe.label===te);if(he===-1)throw new Error("can not find mode to replace");z.contains.splice(he,1,X)};Object.assign(a.keywords,c),a.exports.PARAMS_CONTAINS.push(x);let M=a.contains.find(z=>z.scope==="attr"),F=Object.assign({},M,{match:t.concat(r,t.lookahead(/\s*\?:/))});a.exports.PARAMS_CONTAINS.push([a.exports.CLASS_REFERENCE,M,F]),a.contains=a.contains.concat([x,l,o,F]),A(a,"shebang",e.SHEBANG()),A(a,"use_strict",s);let U=a.contains.find(z=>z.label==="func.def");return U.relevance=0,Object.assign(a,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),a}hr.registerLanguage("html",Fi);hr.registerLanguage("typescript",Vi);window.hljs=hr;export{Tn as Body,$n as CardItem,Ln as ComponentList,On as DocA,Pn as DocApp,xa as DocAppbar,Dn as DocCard,ya as DocCode,Ea as DocDemo,wa as DocDemoBare,Fn as DocGrid,Vn as DocGroup,jn as DocItem,Un as DocMember,Hn as DocMembers,ma as Drawer,En as GridList,rt as Hr,Ce as Icon,bn as NavDropdown,xn as NavHeadline,Bn as NavList,vn as NavTarget,Sa as Page,zn as PageHeader,dn as R,gn as UiPage};
