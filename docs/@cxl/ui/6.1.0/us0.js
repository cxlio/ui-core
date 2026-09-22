var Js=Object.defineProperty;var Qs=(e,t,o)=>()=>{if(o)throw o[0];try{return e&&(t=e(e=0)),t}catch(n){throw o=[n],n}};var Zs=(e,t)=>{for(var o in t)Js(e,o,{get:t[o],enumerable:!0})};var Fa={};Zs(Fa,{default:()=>Dl,theme:()=>Pa});var Nl,Pa,Dl,Ha=Qs(()=>{"use strict";Nl={primary:"#8ECFF2","on-primary":"#003548","primary-container":"#004D67","on-primary-container":"#C1E8FF",secondary:"#B5C9D7","on-secondary":"#1F333D","secondary-container":"#364954","on-secondary-container":"#D1E6F3",tertiary:"#C9C2EA","on-tertiary":"#312C4C","tertiary-container":"#474364","on-tertiary-container":"#E5DEFF",error:"#FFB4AB","on-error":"#690005","error-container":"#93000A","on-error-container":"#FFDAD6",background:"#0F1417","on-background":"#DFE3E7",surface:"#0F1417","on-surface":"#DFE3E7","surface-variant":"#40484D","on-surface-variant":"#C0C7CD",outline:"#8A9297","outline-variant":"#40484D",scrim:"rgb(0 0 0 / 0.5)","inverse-surface":"#DFE3E7","on-inverse-surface":"#2C3134","inverse-primary":"#186584","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#0F1417","surface-bright":"#353A3D","surface-container-lowest":"#0A0F12","surface-container-low":"#171C1F","surface-container":"#1B2023","surface-container-high":"#262B2E","surface-container-highest":"#313539",warning:"#FFC107","on-warning":"#212121","warning-container":"#4E3400","on-warning-container":"#FFF3CF",success:"#81C784","on-success":"#000","success-container":"#2E7D32","on-success-container":"#fff"},Pa={name:"dark",colors:Nl},Dl=Pa});var Te=Symbol("undefined"),fa=Symbol("terminator");function Ut(e){if(e===Te)throw new Error("Value not initialized");return e}function el(e,t){let o=!1,n={error:r,unsubscribe:i,get closed(){return o},signal:new Be,next(a){if(!o)try{e.next?.(a)}catch(c){r(c)}},complete(){if(!o)try{e.complete?.()}finally{i()}}};e.signal?.subscribe(i);function r(a){if(o)throw a;if(!e.error)throw i(),a;try{e.error(a)}finally{i()}}function i(){o||(o=!0,n.signal.next())}try{t?.(n)}catch(a){r(a)}return n}function Zp(...e){return t=>e.reduce((o,n)=>n(o),t)}var M=class{constructor(t){this.__subscribe=t}__subscribe;then(t,o){return tl(this).then(t,o)}pipe(...t){return t.reduce((o,n)=>n(o),this)}subscribe(t){return el(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},xe=class extends M{closed=!1;signal=new Be;observers=new Set;constructor(){super(t=>{this.onSubscribe(t)})}next(t){if(!this.closed)for(let o of Array.from(this.observers))o.closed||o.next(t)}error(t){if(!this.closed){this.closed=!0;let o=!1,n;for(let r of Array.from(this.observers))try{r.error(t)}catch(i){o=!0,n=i}if(o)throw n}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Be=class extends M{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},rn=class extends xe{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)for(let o of this.queue.splice(0))super.next(o);this.emitting=!1}}},bo=class extends xe{constructor(o){super();this.currentValue=o}currentValue;get value(){return this.currentValue}next(o){this.currentValue=o,super.next(o)}onSubscribe(o){let n=super.onSubscribe(o);return this.closed||o.next(this.currentValue),n}},an=class extends xe{constructor(o=1/0){super();this.bufferSize=o}bufferSize;buffer=[];lastError=Te;error(o){this.lastError=o,super.error(o)}next(o){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(o),super.next(o)}onSubscribe(o){this.observers.add(o),this.buffer.forEach(n=>o.next(n)),this.lastError!==Te?o.error(Ut(this.lastError)):this.closed&&o.complete(),o.signal.subscribe(()=>this.observers.delete(o))}},Yt=class extends xe{$value=Te;get hasValue(){return this.$value!==Te}get value(){if(this.$value===Te)throw new Error("Reference not initialized");return Ut(this.$value)}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==Te&&t.next(Ut(this.$value)),super.onSubscribe(t)}},Vn=class extends Error{message="No elements in sequence"};function Qe(...e){return new M(t=>{let o=0,n;function r(){let i=e[o++];i&&!t.closed?(n?.next(),i.subscribe({next:t.next,error:t.error,complete:r,signal:n=new Be})):t.complete()}t.signal.subscribe(()=>n?.next()),r()})}function Y(e){return new M(t=>{e().subscribe(t)})}function jn(e){return new M(t=>{e.then(o=>{t.closed||t.next(o),t.complete()}).catch(o=>t.error(o))})}function eu(e){return new M(t=>{t.signal.subscribe(()=>{let o=e.return?.();o instanceof Promise&&o.catch(n=>t.error(n))}),(async()=>{do{let o=await e.next();if(t.closed||o.done)break;t.next(o.value)}while(!t.closed);t.complete()})().catch(o=>t.error(o))})}function yo(e){return Y(()=>jn(e()))}function xa(e){return new M(t=>{for(let o of e)t.closed||t.next(o);t.complete()})}function ze(e){return e instanceof M?e:e instanceof Promise?jn(e):xa(e)}function L(...e){return xa(e)}function ha(e){return new Promise((t,o)=>{let n=Te;e.subscribe({next:r=>n=r,error:o,complete:()=>t(n)})})}function tl(e){return ha(e).then(t=>t===Te?void 0:Ut(t))}async function tu(e){return ha(e.first()).then(t=>Ut(t))}function Mt(e,t){return we(o=>({next:e(o),unsubscribe:t}))}function we(e){return t=>new M(o=>{let n=e(o,t);n.unsubscribe&&o.signal.subscribe(()=>n.unsubscribe?.()),n.error||(n.error=o.error),n.complete||(n.complete=o.complete),n.signal=o.signal,t.subscribe(n)})}function Un(e){return Mt(t=>o=>t.next(e(o)))}function ol(e){let t=Te;return Mt(o=>n=>{let r=e(n);r!==t&&(t=r,o.next(r))})}function nl(e,t){return we(o=>{let n=t,r=0;return{next(i){n=e(n,i,r++)},complete(){o.next(n),o.complete()}}})}function ou(e,t){let o;function n(...r){o&&clearTimeout(o),o=setTimeout(()=>e.apply(this,r),t)}return n.cancel=()=>clearTimeout(o),n}function rl(e){return we(t=>{let o=!0,n;return{next(r){o&&(o=!1,t.next(r),n=setTimeout(()=>o=!0,e))},unsubscribe:()=>clearTimeout(n)}})}function nu(e){if(e<0)throw new Error("Invalid period");return new M(t=>{let o=setInterval(t.next,e);t.signal.subscribe(()=>clearInterval(o))})}function Ze(e){return new M(t=>{let o=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(o))})}function il(e,t=Ze){return ba(o=>t(e).map(()=>o))}function al(e){return we(t=>{let o,n=!1,r=Te,i=()=>{o=void 0,!(!n||t.closed)&&(n=!1,t.next(Ut(r)),r=Te)};return{next(a){r=a,n=!0,o===void 0&&(o=setTimeout(i,e))},complete(){o!==void 0&&(clearTimeout(o),i()),t.complete()},unsubscribe(){o!==void 0&&clearTimeout(o)}}})}function sl(e){if(e<0)throw new Error("Invalid period");return we(t=>{let o=[],n=setInterval(()=>{if(t.closed)return;let r=o;o=[],t.next(r)},e);return{next(r){o.push(r)},complete(){clearInterval(n),t.next(o),t.complete()},unsubscribe(){clearInterval(n)}}})}function ba(e){return t=>Q(o=>{let n=!1,r=!1,i,a=()=>{i?.next(),n=!1,r&&o.complete()},c=new Be;o.signal.subscribe(()=>{a(),c.next()}),t.subscribe({next(l){a(),i=new Be,n=!0,ze(e(l)).subscribe({next:o.next,error:o.error,complete:a,signal:i})},error:o.error,complete(){r=!0,n||o.complete()},signal:c})})}function ll(e){return t=>Q(o=>{let n=o.signal,r=0,i=0,a=!1;function c(){i++,a&&i===r&&o.complete()}t.subscribe({next:l=>{r++,ze(e(l)).subscribe({next:o.next,error:o.error,complete:c,signal:n})},error:o.error,complete(){a=!0,i===r&&o.complete()},signal:n})})}function cl(e){return we(t=>{let o=new Be,n,r,i=[],a=!1,c=!1,l=()=>{n?.next(),n=void 0,r=void 0,c=!1,i.length&&!t.closed?i.splice(0,1).forEach(g):a&&t.complete()},g=v=>{c=!0,n=new Be,r=ze(e(v)).subscribe({next:t.next,error:t.error,complete:l,signal:n})};return t.signal.subscribe(()=>{n?.next(),o.next()}),{next(v){c?i.push(v):g(v)},error:t.error,complete(){a=!0,!c&&i.length===0&&t.complete()},signal:o,unsubscribe:()=>r?.unsubscribe()}})}function pl(e){return we(t=>{let o=!0;return{next(n){o&&(o=!1,ze(e(n)).subscribe({next:t.next,error:t.error,complete:()=>o=!0,signal:t.signal}))}}})}function Yn(e){return Mt(t=>o=>{e(o)&&t.next(o)})}function ul(e){return Mt(t=>o=>{e-- >0&&!t.closed&&t.next(o),(e<=0||t.closed)&&t.complete()})}function ml(e){return Mt(t=>o=>{!t.closed&&e(o)?t.next(o):t.complete()})}function dl(){let e=!1;return we(t=>({next(o){e||(e=!0,t.next(o),t.complete())},complete(){t.closed||t.error(new Vn)}}))}function _t(e){return Mt(t=>o=>{e(o),t.next(o)})}function fl(e){return we((t,o)=>{let n,r={next:t.next,error(i){try{if(t.closed)return;let a=e(i,o);n?.next(),n=new Be,a.subscribe({...r,signal:n})}catch(a){t.error(a)}},unsubscribe:()=>n?.next()};return r})}function gl(){return Mt(e=>{let t=Te;return o=>{o!==t&&(t=o,e.next(o))}})}function xl(){return e=>{let t=new an(1),o=!1;return Q(n=>{t.subscribe(n),o||(o=!0,e.subscribe(t))})}}function ru(e){return t=>{let o=new an(e),n=0;return Q(r=>{n++,o.subscribe(r),n===1&&t.subscribe(o),r.signal.subscribe(()=>{--n===0&&o.signal.next()})})}}function hl(){return e=>{let t,o=0;function n(){--o===0&&t.signal.next()}return Q(r=>{r.signal.subscribe(n),o++===0?(t=vo(),t.subscribe(r),e.subscribe(t)):t.subscribe(r)})}}function bl(){return e=>{let t=new xe,o,n,r=!1,i=!1;return Q(a=>{i?(a.next(n),a.complete()):t.subscribe(a),o??=e.subscribe({next:c=>{r=!0,n=c},error:a.error,complete(){i=!0,r&&t.next(n),t.complete()},signal:a.signal})})}}function u(...e){return e.length===1?e[0]:new M(t=>{let o=e.length;for(let n of e)t.closed||n.subscribe({next:t.next,error:t.error,complete(){o--===1&&t.complete()},signal:t.signal})})}function iu(...e){return e.length===0?T:new M(t=>{let o=new Array(e.length);function n(){let r=!0;for(;r;){for(let i of o)if(!i||i.length===0)r=!1;else if(i[0]===fa)return t.complete();r&&t.next(o.map(i=>i?.shift()))}}e.forEach((r,i)=>{let a=o[i]=[];r.subscribe({next(c){a.push(c),n()},error:t.error,complete(){a.push(fa),n()},signal:t.signal})})})}function V(...e){return e.length===0?T:new M(t=>{let o=e.length,n=o,r=0,i=!1,a=new Array(o),c=new Array(o);e.forEach((l,g)=>l.subscribe({next(v){c[g]=v,a[g]||(a[g]=!0,++r>=n&&(i=!0)),i&&t.next(c.slice(0))},error:t.error,complete(){--o<=0&&t.complete()},signal:t.signal}))})}function yl(e){return we(t=>({next:t.next,unsubscribe:e}))}function vl(){return we(()=>({next(){}}))}function au(e){return new M(t=>{t.error(e)})}var T=new M(e=>{e.complete()});function Ee(e){return new bo(e)}function Q(e){return new M(e)}function ya(){return new xe}function vo(){return new Yt}var ga={auditTime:al,bufferTime:sl,catchError:fl,concatMap:cl,debounceTime:il,distinctUntilChanged:gl,exhaustMap:pl,filter:Yn,finalize:yl,first:dl,ignoreElements:vl,map:Un,mergeMap:ll,publishLast:bl,reduce:nl,select:ol,share:hl,shareLatest:xl,switchMap:ba,take:ul,takeWhile:ml,tap:_t,throttleTime:rl};for(let e in ga)M.prototype[e]=function(...t){return this.pipe(ga[e](...t))};function cu(e){let t;for(;t=e.childNodes[0];)e.removeChild(t)}function b(e,t,o){return new M(n=>{let r=n.next.bind(n);e.addEventListener(t,r,o),n.signal.subscribe(()=>e.removeEventListener(t,r,o))})}function sn(e){return _n(e,{childList:!0})}function ln(e,t){return _n(e,{attributes:!0,attributeFilter:t})}function _n(e,t={attributes:!0,childList:!0}){return new M(o=>{let n=new MutationObserver(r=>r.forEach(i=>{for(let a of i.addedNodes)o.next({type:"added",target:e,value:a});for(let a of i.removedNodes)o.next({type:"removed",target:e,value:a});i.type==="characterData"?o.next({type:"characterData",target:e}):i.attributeName&&o.next({type:"attribute",target:e,value:i.attributeName})}));n.observe(e,t),o.signal.subscribe(()=>n.disconnect())})}function cn(e){return b(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function I(e){return b(e,"click")}function pn(e,t){return new M(o=>{let n=new IntersectionObserver(r=>{for(let i of r)o.next(i)},t);n.observe(e),o.signal.subscribe(()=>n.disconnect())})}function un(e){return pn(e).map(t=>t.isIntersecting)}function Xt(e){return pn(e).filter(t=>t.isIntersecting).first()}function Tl(e){let t;return function(...o){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,o),t=0})}}function pu(e){let t;return function(...o){t||(t=!0,queueMicrotask(()=>{t=!1,e.apply(this,o)}))}}function va(e){return we(t=>{let o=Tl(r=>{t.closed||(e&&e(r),t.next(r),n&&t.complete())}),n=!1;return{next:o,complete:()=>n=!0}})}function Ta(){return Y(()=>document.readyState!=="loading"?L(!0):b(window,"DOMContentLoaded").first().map(()=>!0))}function Ve(e,t,o){let n=new CustomEvent(t,o);e.dispatchEvent(n)}function wa(e,t){let o=e,n;return u(Y(()=>(n=o.childNodes,n?L(void 0):T)),et().switchMap(()=>o.childNodes!==n?L(void 0):T),_n(e,{childList:!0,...t}).map(()=>{}))}function et(){return Y(()=>document.readyState==="complete"?L(!0):b(window,"load").first().map(()=>!0))}function ne(...e){return new M(t=>{let o=new ResizeObserver(n=>n.forEach(r=>t.next(r)));for(let n of e)o.observe(n);t.signal.subscribe(()=>o.disconnect())})}function uu(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function mu(e){return e instanceof HTMLElement&&(!("disabled"in e)||!e.disabled)&&(e.offsetParent!==null||!!(e.offsetWidth&&e.offsetHeight))&&(e.tabIndex!==-1||e.contentEditable==="true"||e.hasAttribute("tabindex"))}function du(e,t){return e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING?1:-1}function Xn(e,t,o){return n=>Qe(L(e?n.matches(e):!1),b(n,t).switchMap(()=>u(L(!0),b(n,o).map(()=>e?n.matches(e):!1))))}var fu=Xn("","animationstart","animationend"),Wn=Xn("","mouseenter","mouseleave"),wl=Xn(":focus,:focus-within","focusin","focusout"),qn=e=>V(Wn(e),wl(e)).map(([t,o])=>t||o);function Wt(e,t,o){return t=t?.toLowerCase(),b(e,"keydown",o).filter(n=>!t||!!n.key&&n.key.toLowerCase()===t)}function To(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function At(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}function gu(e){return At(e)?.activeElement??null}var El=_t(e=>console.trace(e));M.prototype.log=function(){return this.pipe(El)};M.prototype.raf=function(e){return this.pipe(va(e))};var re=Symbol("bindings"),Ea={},qt=Symbol("augments"),Ot=Symbol("parser"),Jn=class{bindings;messageHandlers;internals;attributes$=new rn;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,o){let n=!1;if(this.messageHandlers)for(let r of this.messageHandlers)r.type===t&&(r.next(o),n||=r.stopPropagation);return n}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let o of this.bindings)t.push(o.subscribe());if(this.prebind)for(let o of this.prebind)t.push(o.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},fn=Symbol("css"),m=class extends HTMLElement{static observedAttributes;static[qt];static[Ot];[re]=new Jn;[fn];connectedCallback(){this[re].wasInitialized=!0,this[re].wasConnected||this.constructor[qt]?.forEach(t=>t(this)),this[re].connect()}disconnectedCallback(){this[re].disconnect()}attributeChangedCallback(t,o,n){let r=this.constructor[Ot]?.[t]??kl;o!==n&&(this[t]=r(n,this[t]))}};function kl(e,t){let o=t===!1||t===!0;return e===""?o?!0:"":e===null?o?!1:void 0:e}function ka(e,t){Object.prototype.hasOwnProperty.call(e,qt)||(e[qt]=e[qt]?.slice(0)??[]),e[qt]?.push(t)}var Cl={mode:"open"};function A(e){return e.shadowRoot??e.attachShadow(Cl)}function Ca(e,t){t instanceof Node?A(e).appendChild(t):e[re].add(t)}function mn(e,t){t.length&&ka(e,o=>{for(let n of t){let r=n.call(e,o);r&&r!==o&&Ca(o,r)}})}function Sa(e,t){Ea[e]=t,customElements.define(e,t)}function de(e){return e[re].internals??=e.attachInternals()}function yu(e,...t){return o=>{typeof e=="string"?(mn(o,t),Sa(e,o)):(t.unshift(e),mn(o,t))}}function s(e,{init:t,augment:o,tagName:n}){if(t)for(let r of t)r(e);o&&mn(e,o),n&&Sa(n,e)}function vu(e,...t){mn(e,t)}function $t(e){return Qe(L(e),e[re].attributes$.map(()=>e))}function P(e,t){return e[re].attributes$.pipe(Yn(o=>o.attribute===t),Un(()=>e[t]))}function d(e,t){return u(P(e,t),Y(()=>L(e[t])))}function Tu(e,t,o){e[t]=o}function Sl(e){let t=e.observedAttributes;return t&&!Object.prototype.hasOwnProperty.call(e,"observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function wo(e,t,o){let n=o;return n===null||typeof n>"u"?n=null:typeof n=="boolean"&&(n=n?"":null),n===null?e.removeAttribute(t):e.setAttribute(t,String(n)),n}function Ml(e,t,o){Object.prototype.hasOwnProperty.call(e,Ot)||(e[Ot]={...e[Ot]}),e[Ot]&&(e[Ot][t]=o)}function f(e,t){return o=>{t?.observe!==!1&&Sl(o).push(e),t?.parse&&Ml(o,e,t.parse);let n=`$$${e}`,r=o.prototype,i=Object.getOwnPropertyDescriptor(r,e);i&&Object.defineProperty(r,n,i);let a=t?.persist,c={enumerable:!0,configurable:!1,get(){return this[n]},set(l){this[n]!==l?(this[n]=l,a?.(this,e,l),this[re].attributes$.next({target:this,attribute:e,value:l})):i?.set&&(a?.(this,e,l),this[n]=l)}};ka(o,l=>{if(i||(l[n]=l[e]),Object.defineProperty(l,e,c),a?.(l,e,l[e]),t?.render){let g=t.render(l);g&&Ca(l,g)}})}}function h(e){return f(e,{persist:wo,observe:!0})}function Al(e,t,o){return new M(n=>{function r(i){i.target===e&&e[o]?.call(e,i)}e.addEventListener(t,r),n.signal.subscribe(()=>e.removeEventListener(t,r))})}function gn(e){let t=`on${e}`;return f(t,{render(o){return d(o,t).switchMap(n=>n?Al(o,e,t):T)},parse(o){return o?new Function("event",o):void 0}})}function _(e){return f(e,{observe:!1})}function wu(){return{...Ea}}function y(){return document.createElement("slot")}function xn(e){return t=>{let[o,n]=e();return t[re].add(o),n}}function Ol(e,t){let o=document.createTextNode("");return e[re].add(t.tap(n=>o.textContent=String(n))),o}var $n=document.createDocumentFragment();function dn(e,t,o=e){if(t!=null)if(Array.isArray(t)){for(let n of t)dn(e,n,$n);o!==$n&&o.appendChild($n)}else e instanceof m&&t instanceof M?o.appendChild(Ol(e,t)):t instanceof Node?o.appendChild(t):e instanceof m&&typeof t=="function"?dn(e,t(e),o):o.appendChild(document.createTextNode(String(t)))}function Gn(e,t,o){e[t]=o}function Ll(e){return typeof e=="function"}function Ma(e,t){for(let o in t){let n=t[o];if(e instanceof m)if(n instanceof M)e[re].add(o==="$"?n:n.tap(r=>Gn(e,o,r)));else if(o==="$"&&Ll(n)){let r=n(e);r instanceof M&&e[re].add(r)}else Gn(e,o,n);else Gn(e,o,n)}}function Rl(e,t){return e.constructor.observedAttributes?.includes(t)}function Aa(e,t){let o=e instanceof m&&Rl(e,t)?P(e,t):ln(e,[t]).map(()=>e[t]);return u(o,Y(()=>L(e[t])))}function he(e,t,o){return f(e,{parse(n){if(n==="Infinity"||n==="infinity")return 1/0;let r=n===null?void 0:Number(n);return t!==void 0&&(r===void 0||r<t||isNaN(r))&&(r=t),o!==void 0&&r!==void 0&&r>o&&(r=o),r}})}function ee(e,t,o){for(let n=e.parentElement;n;n=n.parentElement)if(n instanceof m&&n[re].message(t,o))return}function ie(e,t,o=!0){let n,r=0,i=new xe,a={type:t,next(c){r?i.next(c):(n??=[]).push(c)},stopPropagation:o};return e[re].addMessageHandler(a),new M(c=>{r===0&&n?.length&&(n.forEach(g=>c.next(g)),n.length=0),r++;let l=i.subscribe(c);c.signal.subscribe(()=>{r--,l.unsubscribe()})})}function Oa(e,t,o,n=!0){return ie(e,t,n).tap(r=>{o[re].message(t,r)})}function x(e,t,...o){let n=typeof e=="string"?document.createElement(e):new e;return t&&Ma(n,t),o.length&&dn(n,o),n}function se(e,t,...o){if(e!==se&&typeof e=="function"&&!(e.prototype instanceof m))return o.length&&((t??={}).children=o),e(t);let n=e===se?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&Ma(n,t),o.length&&dn(n,o),n}function La(e,t){return o=>new M(()=>{o.hasAttribute(e)||o.setAttribute(e,t)})}function Gt(e,t){return La(`aria-${e}`,t)}function Ra(e,t){return _t(o=>e.setAttribute("aria-"+t,o===!0?"true":o===!1?"false":o.toString()))}function Mu(e){return _t(t=>e.setAttribute("aria-checked",t===void 0?"mixed":t?"true":"false"))}function E(e){return La("role",e)}function Au(e,t){return ut(t).tap(o=>{e.setAttribute("aria-describedby",o)}).finalize(()=>e.removeAttribute("aria-describedby"))}function Na(e,t){return e.ariaLabel||e.getAttribute("aria-labelledby")?T:t.tap(o=>e.ariaLabel=o)}var Da=0;function tt(e){return e.id||=`cxl__${Da++}`}function ut(e){return Aa(e,"id").map(t=>(t||(e.id=`cxl__${Da++}`),e.id))}function Ia(e,t){return V(...t.map(o=>ut(o))).tap(o=>{e.setAttribute("aria-controls",o.join(" "))})}var Il=["xsmall","small","medium","large","xlarge","xxlarge"],q=p(":host{display:contents}"),Ua=p(":host{position:absolute;display:block;width:0;height:0;overflow:hidden}"),er=[-2,-1,0,1,2,3,4,5],hn=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],Jt=vo(),bn=Ee(""),j=p(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),yn=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${C("body-medium")}
`,Pl=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),Ya={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function vn(e=""){return`
:host ${e} {
	${Z("surface-container")}
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
		`}function _a(e=Ya){return Object.entries(e).map(([t,o])=>`--cxl-color--${t}:${o};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var G={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:Ya,imports:Pl?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
--cxl-font-family: Roboto, sans-serif;
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
[hidden]:not([hidden="until-found"]) {
	display: none;
}
	`,css:`:host([hidden]:not([hidden="until-found"])) {
	display: none;
}`};function ot(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}function Xa(e){return`box-shadow:var(--cxl-elevation-${e});z-index:${e};`}var dt=p(ot()),Wa={"./theme-dark.js":()=>Promise.resolve().then(()=>(Ha(),Fa))},nt=[0,4,8,"12",16,24,32,48,64],mt,Ka,Fl;function F(e,t){return e==="xsmall"?`@media(max-width:${G.breakpoints.small}px){${t}}`:`@media(min-width:${G.breakpoints[e]}px){${t}}`}function Tn(e){return u(yo(async()=>e.getBoundingClientRect().width),ne(e).map(t=>t.contentRect.width)).map(t=>{let o=G.breakpoints,n="xsmall";for(let r of Il){if(o[r]>t)return n;n=r}return n}).distinctUntilChanged()}function Hl(e=""){return Object.entries(Qa).map(([t,o])=>`:host([color=${t}]) ${e}{ ${o} }`).join("")}function le(e,t,o=""){return qa(e,`
		${t?`:host ${o} { ${Qa[t]} }`:""}
		:host${t?"":"([color])"} ${o} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${o}{
			color: inherit;
			background-color: transparent;
		}
		${Hl(o)}
	`)}function qa(e,t){let o=p(t);return f(e,{persist:wo,render:n=>o(n)})}function te(e,t){return qa(e,er.map(o=>{let n=t(o);return o===0?`:host{--cxl-size:${o}}:host ${n}`:`:host([size="${o}"]){--cxl-size:${o}}:host([size="${o}"]) ${n}`}).join(""))}function $a(){let e=mt?document.adoptedStyleSheets.indexOf(mt):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Kl(e){mt&&$a();let t=e.globalCss??"";e.colors&&(t+=`:root{${_a(e.colors)}}`),t?(mt=je(t),document.adoptedStyleSheets.push(mt)):mt=void 0,Jt.next({theme:e,stylesheet:mt,css:t}),bn.next(e.name)}var Ba="";function za(e){Kl(e.default)}function Ga(e){e?e!==Ba&&(typeof e=="string"?import(e).then(za,t=>console.error(t)):e().then(za,t=>console.error(t))):mt&&($a(),Jt.next(void 0),bn.next("")),Ba=e}function Bl(e){let t;return Jt.tap(o=>{let n=o?.theme.override?.[e.tagName];n?t?t.replace(n).catch(r=>console.error(r)):e.shadowRoot?.adoptedStyleSheets.push(t??=je(n)):t&&t.replaceSync("")})}function je(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function wn(e,t=""){let o=je(t);return A(e).adoptedStyleSheets.push(o),o}function p(e){let t;return o=>{let n=A(o);if(n.adoptedStyleSheets.push(t??=je(e)),!o[fn])return G.css&&n.adoptedStyleSheets.unshift(Fl??=je(G.css)),o[fn]=!0,Bl(o)}}var tr=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Ja=[...tr,"inherit"];function Qn(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function Pu(e,t,o="transparent"){return`color-mix(in srgb, var(--cxl-color-${e}) ${t}%,${o})`}function Z(e){return`${Qn(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}function zl(){let e={inherit:"color:inherit;background-color:inherit;",transparent:"color:inherit;background-color:transparent;"};for(let t of tr)e[t]=`
${Qn(t)}
${t==="inverse-surface"?Qn("inverse-primary","primary"):""}
`;return e}var Qa=zl(),Za=(e="")=>`${e?`:host(${e})`:":host"} { 
	--cxl-color-surface: transparent; 
	border-style: solid; 
	border-color: var(--cxl-color-on-surface); 
	border-width: 1px; 
	box-shadow: none;
}
${tr.map(t=>`:host(${e}[color=${t}]) { --cxl-color-on-surface: var(--cxl-color--${t}); }`).join("")}
`;function Qt(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function C(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}function Fu(){cancelAnimationFrame(es)}var es=requestAnimationFrame(()=>Yl()),ts={},Va=document.createElement("template"),ja={};function Vl(e){return function(t){let o=e(t),n=ja[o];if(n){let a=n.cloneNode(!0);if(a instanceof SVGSVGElement)return a}let r=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=()=>(r.dispatchEvent(new ErrorEvent("error")),"");return fetch(o).then(a=>a.ok?a.text():i(),i).then(a=>{if(!a)return;Va.innerHTML=a;let c=Va.content.children[0];if(!(c instanceof SVGSVGElement))return;let l=c.getAttribute("viewBox");l?r.setAttribute("viewBox",l):c.hasAttribute("width")&&c.hasAttribute("height")&&r.setAttribute("viewBox",`0 0 ${c.getAttribute("width")} ${c.getAttribute("height")}`);for(let g of c.childNodes)r.append(g);ja[t.name]=r}).catch(a=>console.error(a)),r.setAttribute("fill","currentColor"),r}}var jl=Vl(({name:e,width:t,fill:o})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${o?"fill1_":""}${t}px.svg`)),os=jl;function Hu(e){os=e}function Ku(e){ts[e.id]=e}function Zt(e,t={}){let{width:o,height:n}=t;o===void 0&&n===void 0&&(o=n=24);let r=ts[e]?.icon()??os({name:e,width:o,fill:t.fill});return t.className&&r.setAttribute("class",t.className),o&&(r.setAttribute("width",`${o}`),n===void 0&&r.setAttribute("height",`${o}`)),n&&(r.setAttribute("height",`${n}`),o===void 0&&r.setAttribute("width",`${n}`)),t.alt&&r.setAttribute("alt",t.alt),r}var Zn,Ul=new Promise(e=>{Zn=()=>{Jt.next(void 0),e()}});function Yl(e){cancelAnimationFrame(es),Ka||(e&&(e.colors&&(G.colors=e.colors),e.globalCss&&(G.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(Ka=je(`html{${_a(G.colors)}}${G.globalCss}`)),G.imports?Promise.allSettled(G.imports.map(t=>{let o=document.createElement("link");return o.rel="stylesheet",o.href=t,document.head.append(o),new Promise((n,r)=>(o.onload=n,o.onerror=r))})).then(Zn,t=>console.error(t)):Zn())}function ft(){return yo(async()=>{await Ul,await document.fonts.ready})}var or=class extends m{type;details};s(or,{tagName:"c-action",init:[f("type"),f("details")],augment:[q,y,e=>I(e).tap(()=>{e.type&&ee(e,e.type,e.details)})]});function _l(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.controller??t.target}function Xl(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.target}function Ce(e,t,o){return new M(n=>{let r={id:e,controller:o,target:t};et().subscribe({next:()=>ee(t,`registable.${e}`,r),signal:n.signal}),n.signal.subscribe(()=>r.unsubscribe?.())})}function En(e,t,o,n){return new M(r=>{function i(c){let l=Xl(e,c);c.unsubscribe=()=>{let S=o.indexOf(l);S!==-1&&o.splice(S,1),n?.({type:"disconnect",target:l,elements:o}),r.next()};let g=o.indexOf(l);g!==-1&&o.splice(g,1);let v=0,w=o.length;for(;v<w;){let S=v+w>>1,O=o[S];if(!O)break;O.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING?v=S+1:w=S}o.splice(v,0,l),n?.({type:"connect",target:l,elements:o}),r.next()}let a=ie(t,`registable.${e}`).subscribe(i);r.signal.subscribe(a.unsubscribe)})}function gt(e,t,o=new Set){let n=ya();return u(ie(t,`registable.${e}`).map(r=>{let i=r.target,a=_l(e,r);return r.unsubscribe=()=>{o.delete(a),n.next({type:"disconnect",target:a,element:i,elements:o})},o.add(a),{type:"connect",target:a,element:i,elements:o}}),n)}function nr(e){return e in G.animation}function be({target:e,animation:t,options:o}){if(G.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in G.animation))throw new Error(`Animation "${t}" not defined`);let n=typeof t=="string"?G.animation[t]:t,r=typeof n.kf=="function"?n.kf(e):n.kf,i={duration:250,easing:G.easing.emphasized,...n.options,...o,...G.prefersReducedMotion?{duration:0}:void 0};return e.animate(r,i)}function Eo(e){let{trigger:t,stagger:o,commit:n,keep:r}=e;function i(c){return new M(l=>{let g=be(c);g.ready.then(()=>l.next({type:"start",animation:g}),v=>{console.error(v)}),g.addEventListener("finish",()=>{l.next({type:"end",animation:g}),n&&g.commitStyles(),!(r||r!==!1&&c.options?.fill&&(c.options.fill==="both"||c.options.fill==="forwards"))&&l.complete()}),l.signal.subscribe(()=>{try{g.cancel()}catch{}})})}let a=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return u(...a.map((c,l)=>{let g={...e.options,delay:o!==void 0?(e.options?.delay??0)+l*o:e.options?.delay};return(t==="visible"?un(c).filter(w=>w):t==="hover"?Wn(c):L(!0)).switchMap(w=>w?i({...e,options:g,target:c}):T)}))}var xt;function ns(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function Wl(e){return e==="infinite"?1/0:+e}function ql(e){if(nr(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let o={},n;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(g,v,w)=>(v&&(n=+v),(w==="replace"||w==="add"||w==="accumulate")&&(o.composite=w),"")),xt??=document.createElement("style").style,xt.animation=e;let r=xt.animationFillMode;(r==="none"||r==="forwards"||r==="backwards"||r==="both")&&(o.fill=r);let i=o.fill==="forwards"||o.fill==="both",a=t?void 0:ns(xt.animationDuration);a!==void 0&&(o.duration=a);let c=ns(xt.animationDelay);c!==void 0&&(o.delay=c),xt.animationIterationCount&&(o.iterations=Wl(xt.animationIterationCount));let l=xt.animationName;if(!nr(l))throw new Error(`Animation "${l}" not defined`);return{animation:l,keep:i,stagger:n,options:o}}function $l(e){return typeof e=="string"&&(e=e.split(",").map(t=>ql(t.trim()))),e}function ko(e,t,o,n){let r=n?`motion-${n}-on`:"motion-on",i=$l(o);return e.setAttribute(r,""),u(...i.map(a=>Eo({target:t,...a}))).finalize(()=>e.removeAttribute(r))}var eo=p(":host(:not([open],[motion-out-on])){display:none}");function rt(e,t=()=>e,o=!1){let n=Y(()=>L(t("in"))),r=Y(()=>L(t("out"))),i=Y(()=>e.duration!==void 0&&e.duration!==1/0?Ze(e.duration).map(()=>e.open=!1):T).log();return u(ie(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),V(d(e,"motion-in").map(a=>(a?n.mergeMap(c=>ko(e,c,a,"in")):n).mergeMap(()=>i)),d(e,"motion-out").map(a=>(a?r.switchMap(c=>ko(e,c,a,"out")):r).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([a,c])=>P(e,"open").switchMap(l=>{if(e.popover!=="auto"){let g=l?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:l?"closed":"open",newState:g}))}return l?o?Qe(c,a):a:o?Qe(c,a):c})))}var Ue=class extends m{open=!1;duration;"motion-in";"motion-out"};s(Ue,{init:[f("motion-in"),f("motion-out"),he("duration"),h("open")]});var Co=class extends Ue{};s(Co,{tagName:"c-toggle-target",augment:[p(`
:host{display:contents}
`),e=>{let t=x("slot"),o=x("slot",{name:"off"});return(e.open?o:t).style.display="none",A(e).append(t,o),rt(e,n=>{t.style.display=o.style.display="none";let r=e.open?n==="in"?t:o:n==="in"?o:t;return r.style.display="",r.assignedElements()},!0)}]});var rr={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(o){console.error(o)}}};function cm(e){return(t,o)=>t[e]>o[e]?1:t[e]<o[e]?-1:0}function it(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let o,n=e.getRootNode();return n instanceof ShadowRoot&&(o=n.getElementById(t),o)?o:e.ownerDocument.getElementById(t)??void 0}function kn(e,t){return d(e,t).map(o=>typeof o=="string"?it(e,o):o instanceof HTMLElement?o:void 0)}async function pm(e,...[t]){try{return e instanceof Response?await e.json():JSON.parse(rs(e))}catch{if(t!==void 0)return t;throw t}}function um(e,...[t]){try{return JSON.parse(rs(e))}catch{if(t!==void 0)return t;throw t}}function rs(e,t){return e?typeof e=="string"?e:new TextDecoder(t).decode(e):""}var at=class extends m{};s(at,{tagName:"c-span"});var ir=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},fe=new ir;var Sn=(e,t,o=e)=>I(e).tap(()=>ee(o,"toggle.close",t)),km=(e,t,o=e)=>I(e).tap(()=>ee(o,"toggle.open",t));function Cn(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(o=>{let n=it(e,o);return n?[n]:[]}):Array.isArray(t)?t:[t]}function sr(e,t,o,n,r=b(e,"click").map(()=>!o())){return u(n,r).switchMap(i=>{let a=t();return a?ze(a.map(c=>({target:c,open:i}))):T})}function Lt(e,t=e){function o(i,a){return[d(e,"open").switchMap(c=>(i.parentNode||fe.popupContainer.append(i),i.open=c,c&&i instanceof m&&"open"in i?P(i,"open").map(l=>{e.open&&l===!1&&(e.open=!1)}):T)),ut(i).tap(c=>{let l=i.getAttribute("role");(l==="menu"||l==="listbox"||l==="tree"||l==="grid"||l==="dialog")&&(a.ariaHasPopup=l),a.getRootNode()===i.getRootNode()&&a.setAttribute("aria-controls",c)})]}let n=V(d(e,"trigger"),d(e,"target")).switchMap(([i])=>{let a=Cn(e),c=a?u(...a.flatMap(l=>o(l,e))).ignoreElements():T;return u(i==="hover"?V(qn(t),a?u(...a.map(l=>qn(l))):T).map(l=>!!l.find(g=>!!g)).debounceTime(250):i==="checked"?b(t,"change").map(l=>l.target&&"checked"in l.target?!!l.target.checked:!1):b(t,"click").map(l=>(l.stopPropagation(),!e.open)),c)}),r;return Ta().switchMap(()=>sr(t,()=>Cn(e),()=>e.open,d(e,"open"),n).filter(i=>{let{open:a,target:c}=i;if(e.open!==a){if(a){let l=At(e)?.activeElement;r=l instanceof HTMLElement?l:void 0,c.trigger=e}else if(c.trigger&&c.trigger!==e)return i.open=!0,c.trigger=e,!0;return e.open=a,!1}if(!a&&c.trigger===e){let l=document.activeElement;(l===document.body||l===document.documentElement)&&r?.focus()}return!0}))}var ht=class extends m{open=!1;target;trigger};s(ht,{init:[f("target"),f("trigger"),h("open")],augment:[e=>Lt(e).raf(({target:t,open:o})=>t.open=o)]});var ar=class extends ht{};s(ar,{tagName:"c-toggle",augment:[q,y]});var Rt=class extends Ue{};s(Rt,{tagName:"c-details",augment:[p(`
:host { display: block; }
:host(:not([open],[motion-out-on])) #body {display:none}
		`),e=>{let t=x("slot",{id:"body"}),o=x("slot",{id:"header",name:"header"});return A(e).append(o,t),u(sr(o,()=>[e],()=>e.open,d(e,"open")).raf(({open:n})=>{e.open=n}),rt(e,()=>t))}]});var lr=class extends m{panels=new Set};s(lr,{tagName:"c-accordion",augment:[e=>gt("accordion",e,e.panels),e=>b(e,"toggle",{capture:!0}).tap(t=>{let o=t.target;if(o instanceof Rt&&o.open&&e.panels.has(o))for(let n of e.panels)n!==o&&(n.open=!1)})]});var ge=class extends m{name="";width;height;alt;fill=!1};s(ge,{tagName:"c-icon",init:[f("name"),f("width"),f("height"),f("fill"),f("alt")],augment:[E("none"),p(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,o;return e.shadowRoot?.adoptedStyleSheets.push(t),Xt(e).switchMap(()=>$t(e)).debounceTime(0).tap(()=>{let n=e.width??e.height,r=e.height??e.width;if(t.replace(`:host{${n===void 0?"":`width:${n}px;`}${r===void 0?"":`height:${r}px`}}`).catch(i=>{}),o?.remove(),o=e.name?Zt(e.name,{className:"icon",width:n,height:r,fill:e.fill,alt:e.alt}):void 0,o){let i=o;i.onerror=()=>{e.alt&&i.replaceWith(e.alt)},A(e).append(i)}})}]});function cr(e){return d(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function Gl(e,t=e,o=0){let n=t.hasAttribute("tabindex")?t.tabIndex:o;return cr(e).tap(r=>{r?t.removeAttribute("tabindex"):t.tabIndex=n})}function Jl(e,t=e){return u(b(t,"focusout").tap(()=>e.touched=!0),u(P(e,"disabled"),P(e,"touched")).tap(()=>ee(e,"focusable.change")))}function Se(e,t=e,o=0){return u(Gl(e,t,o),Jl(e,t))}function is(e,t,o=e.getBoundingClientRect()){let n=o.width>o.height?o.width:o.height,r=new Mn,i=e.shadowRoot||e,a=t instanceof MouseEvent?t.x:1/0,c=t instanceof MouseEvent?t.y:1/0,l=!t||To(t),g=a>o.right||a<o.left||c>o.bottom||c<o.top;return r.x=l||g?o.width/2:a-o.left,r.y=l||g?o.height/2:c-o.top,r.radius=n,t||(r.duration=0),i.prepend(r),r}function as(e,t=e){let o,n,r,i=()=>{o=is(t,n instanceof Event?n:void 0,r),o.duration=600,n=void 0};return u(b(e,"click").tap(a=>{n=a,r=t.getBoundingClientRect()}),d(e,"selected").raf().switchMap(()=>{if(e.selected){if(!o?.parentNode){if(!e.checkVisibility())return n=void 0,Xt(e).tap(i);i()}}else o&&ss(o).catch(a=>console.error(a));return T})).ignoreElements()}function ss(e){return new Promise(t=>{be({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function ce(e,t=e){let o=!1,n=0;return u(b(t,"pointerdown"),b(t,"click")).tap(r=>r.cxlRipple??=e).raf().mergeMap(r=>{if(r.cxlRipple===e&&!o&&!e.disabled&&e.parentNode){n=Date.now(),o=!0,e.style.setProperty("--cxl-mask-hover","none");let i=is(e,r),a=i.duration,c=()=>{e.style.removeProperty("--cxl-mask-hover"),ss(i).catch(()=>{}).finally(()=>{o=!1})};return r.type==="click"?Ze(a).tap(c):u(b(document,"pointerup"),b(document,"pointercancel")).first().map(()=>{let l=Date.now()-n;setTimeout(()=>c(),l>a?32:a-l)})}return T})}var Mn=class extends m{x=0;y=0;radius=0;duration=500};s(Mn,{tagName:"c-ripple",init:[f("x"),f("y"),f("radius")],augment:[p(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",Q(()=>{let o=t.style;o.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,o.width=o.height=e.radius*2+"px",t.parentNode||A(e).append(t),be({target:t,animation:"expand",options:{duration:e.duration}}),be({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var Nt=[j,dt,p(`
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
}`)],Ql=p(`
:host {
	${C("label-large")}
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
	--cxl-color-ripple: color-mix(in srgb, var(--cxl-color-surface) 12%, transparent);
	border: 1px solid var(--cxl-color-outline);
	background-color: transparent;
	color: var(--cxl-color-surface);
}
:host([variant=elevated]) {
	--cxl-color-on-surface: var(--cxl-color-primary);
}
`);function pr(e){return d(e,"disabled").switchMap(t=>t?T:cn(e).tap(o=>{o.stopPropagation(),e.click()}))}function Ne(e){return u(pr(e),Se(e))}var to=class extends m{disabled=!1;touched=!1};s(to,{init:[h("disabled"),h("touched")],augment:[E("button"),Ne]});var Ye=class extends to{size;color;variant};s(Ye,{tagName:"c-button",init:[te("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),le("color","primary"),h("variant")],augment:[...Nt,Ql,ce,y]});var So=class extends Rt{constructor(){super(),this["motion-in"]="openY",this["motion-out"]="closeY"}};s(So,{tagName:"c-accordion-panel",augment:[E("region"),p(`
:host {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-bottom: 1px solid var(--cxl-color-outline-variant);
}
#body {
	display: block;
	overflow: hidden;
}
		`),e=>Ce("accordion",e)]});var ur=class extends m{disabled=!1;touched=!1};s(ur,{tagName:"c-accordion-header",init:[h("disabled")],augment:[E("button"),p(`
:host {
	${C("title-small")}
	line-height: unset;
	display: flex;
	align-items: center;
	padding: 16px;
	padding-inline-end: 44px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}	
#icon {
	position: absolute;
	inset-inline-end: 12px;
	transition: rotate var(--cxl-speed);
}
#icon.open {
	rotate: -180deg;
}
:host([disabled]) {
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
}
		`),j,e=>{let t=new ge;t.name="keyboard_arrow_down",t.id="icon",t.role="none",e.slot||="header",A(e).append(t,document.createElement("slot"));let o=e.parentElement;return o instanceof So?u(ut(o).tap(n=>e.setAttribute("aria-controls",n)),d(o,"open").tap(n=>{t.classList.toggle("open",n),e.ariaExpanded=String(n)})):T},Ne]});var Dt=class extends m{outline=!1;color};s(Dt,{tagName:"c-alert",init:[h("outline"),le("color","inverse-surface")],augment:[E("alert"),p(`
:host {
	box-sizing: border-box;
	display: flex;
	align-items: center;
	column-gap: 8px;
	justify-content: center;
	padding: 14px 16px;
	min-height: 48px;
	min-width: min(340px, 100%);
	border-radius: 4px;
	${C("body-medium")}
}
	${Za("[outline]")}`),y]});function Zl(e){if("message"in e&&typeof e.message=="string")return e.message;if("error"in e&&typeof e.error=="string")return e.error;if("status"in e&&typeof e.status=="number")return`HTTP ${e.status}${"statusText"in e&&typeof e.statusText=="string"&&e.statusText?` ${e.statusText}`:""}`;if("toString"in e&&typeof e.toString=="function"&&e.toString!==Object.prototype.toString)return e.toString();if(Object.keys(e).length===0)return"Unknown Error"}function ec(e){if(e==null)return"Unknown Error";if(typeof e=="string")return e||"Unknown Error";if(e instanceof Response)return`HTTP ${e.status} ${e.statusText}`;if(e instanceof Error)return e.message||"Unknown Error";if(typeof e=="object"){let t=Zl(e);if(t)return t}if(typeof e=="symbol"||typeof e=="function")return String(e);try{return JSON.stringify(e)||"Unknown Error"}catch{return String(e)||"Unknown Error"}}var mr=class extends Dt{color="error";error};s(mr,{tagName:"c-alert-error",init:[_("error")],augment:[e=>d(e,"error").tap(t=>{e.textContent=ec(t)})]});var dr=[p(`
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
	${C("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${C("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${C("headline-medium")}
	flex-wrap: wrap;
}`),y,()=>x("slot",{name:"title"})];function tc(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var Mo=class extends m{size;sticky=!1;contextual};s(Mo,{tagName:"c-appbar",init:[h("size"),h("sticky"),h("contextual")],augment:[p(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...dr,()=>x("slot",{name:"contextual"}),e=>d(e,"sticky").switchMap(t=>t?pn(e,{threshold:[1]}).tap(o=>e.toggleAttribute("scroll",o.intersectionRatio<1)):T),e=>{let t;return u(sn(e),d(e,"contextual")).raf().switchMap(()=>{for(let o of e.children)if(tc(o)&&(o.slot="contextual",o.open=o.name===e.contextual,o.open))return t=o,b(o,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,T})}]});var fr=class extends m{};s(fr,{tagName:"c-appbar-title",augment:[E("heading"),Gt("level","1"),p(`
:host {
	display: block;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
}
	`),y]});var Ao=class extends Ye{};s(Ao,{tagName:"c-button-round",augment:[p(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var De=class extends Ao{icon="";width;height;fill=!1;variant="text";alt};s(De,{tagName:"c-icon-button",init:[f("icon"),f("width"),f("height"),f("alt"),f("fill")],augment:[e=>x(ge,{className:"icon",width:d(e,"width"),height:d(e,"height"),name:d(e,"icon"),fill:d(e,"fill"),alt:d(e,"alt")})]});var qd=1440*60*1e3,oc=/^\s*(\d{1,2})\s*:\s*(\d{1,2})\s*(?::(\d{1,2})\s*)?([pPaA][mM])?/,nc=/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;function rc(e){let t=oc.exec(e);if(t){let o=new Date,n=+(t[1]??0),r=t[4]?.toLowerCase()==="pm";return o.setHours(r?n+12:n),o.setMinutes(+(t[2]??0)),o}return new Date(NaN)}function ic(e){let t=new Date(nc.test(e)?`${e}T00:00`:e);return isNaN(t.getTime())&&(t=rc(e)),t}function ls(e,t,o){if(t==="relative"){let n=new Date;return e.getFullYear()===n.getFullYear()?e.getDate()===n.getDate()&&e.getMonth()===n.getMonth()?e.toLocaleTimeString(o,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(o,{dateStyle:t,timeStyle:t})}function cs(e){return f(e,{parse:t=>t?ic(t):void 0})}function ps(e,t,o){return typeof o=="string"?ls(t,o,e):t.toLocaleString(e,o)}var gr={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function ac(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var Oo={content:gr,name:"default",localeName:ac(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>ps(Oo.localeName,e,t)},sc={content:gr,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>ps("en-US",e,t)};function lc(){let e=Ee(Oo),t={default:Oo,en:sc},o={},n=e.map(a=>a.content);async function r(a){let c=a.split("-")[0];if(!c)return Oo;if(!(t[a]??t[c])){let g=o[a]??o[c];g&&await g()}return t[c]||Oo}async function i(a){e.next(await r(a))}return navigator.language&&r(navigator.language).then(a=>e.next(a)).catch(a=>console.error(a)),{content:n,registeredLocales:t,locale:e,setLocale:i,getLocale(a){return a?yo(()=>r(a)):e},get(a,c){return n.map(l=>l[a]??"")},register(a){t[a.name]=a}}}var oe=lc();function tf(e){return V(oe.locale,d(e,"locale")).switchMap(([t,o])=>o?oe.getLocale(o):L(t))}function oo(e){return Object.assign(gr,e),oe.get}function of(e,t){return oe.locale.map(o=>o.formatDate(e,t))}function nf(e){return t=>t?oe.locale.map(o=>o.formatDate(t,e)):L("")}function rf(e,t,o=oe.locale){let n=new Date,r=t==="xsmall"?"narrow":t==="small"?"short":"long";return n.setDate(n.getDate()-n.getDay()+e),o.map(i=>i.formatDate(n,{weekday:r}))}var us=class e extends m{name;size;open=!1;backIcon=x(De,{icon:"arrow_back",className:"icon",ariaLabel:oe.get("core.close"),$:t=>I(t).tap(()=>this.open=!1)});static{s(e,{tagName:"c-appbar-contextual",init:[f("name"),h("open"),h("size")],augment:[t=>t.backIcon,...dr,p(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>P(t,"open").tap(o=>{o||t.dispatchEvent(new Event("close"))})]})}};function ms(e=document){document.documentElement.lang="en";let t=[x("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),x("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),x("meta",{name:"mobile-web-app-capable",content:"yes"}),x("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${C("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function ds(e=2e3){return u(Ze(e),ft()).first()}function fs(e){return ds().raf(()=>e.setAttribute("ready",""))}function An(e){return u(Q(t=>{let o=ms(e.ownerDocument);t.signal.subscribe(()=>o.forEach(n=>n.remove()))}),et().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),ds().switchMap(()=>Tn(e).raf(t=>e.setAttribute("breakpoint",t))),fs(e),bn.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var xr=class extends m{connectedCallback(){requestAnimationFrame(()=>ms(this.ownerDocument)),super.connectedCallback()}};s(xr,{tagName:"c-meta",augment:[()=>fs(document.body)]});function gs(e,t,o){o==="in"&&(e.style.display="");let n=e.offsetWidth,r=be({target:e,animation:{kf:{[t]:o==="in"?[`-${n}px`,"0"]:["0",`-${n}px`]}}});o==="out"&&(r.onfinish=()=>e.style.display="none")}var hr=class extends m{sheetstart=!1;sheetend=!1};s(hr,{tagName:"c-application",init:[h("sheetstart"),h("sheetend")],augment:[p(`
:host {
	display: flex;
	position: absolute;
	inset: 0;
	${Z("surface")}
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
${Qt()}
	`),An,e=>ie(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>ie(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=x("slot",{name:"start"}),o=x("slot",{id:"body"}),n=x("slot",{name:"end"}),r=je("html { overflow: hidden }");return A(e).append(t,o,n),e.sheetstart||(t.style.display="none"),e.sheetend||(n.style.display="none"),fe.popupContainer=e,u(Q(i=>{let a=e.ownerDocument.adoptedStyleSheets;a.push(r),i.signal.subscribe(()=>{let c=a.indexOf(r);c!==-1&&a.splice(c,1)})}),P(e,"sheetstart").tap(i=>gs(t,"marginLeft",i?"in":"out")),P(e,"sheetend").tap(i=>gs(n,"marginRight",i?"in":"out")))}]});var br=class extends m{assertive=!1};s(br,{tagName:"c-aria-live",init:[f("assertive")],augment:[Ua,y,e=>d(e,"assertive").tap(t=>{e.role=t?"alert":"status",e.ariaLive=t?"assertive":"polite",e.ariaAtomic="true"})]});var cc=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,pc=/^\d{5}(?:[-\s]\d{4})?$/,uc={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},xs={required:bc,email:yc,json:wc,zipcode:vc,nonZero:xc,nonEmpty:gc},mc={pattern:hc,equalToElement:yr(vs),greaterThan:bs,lessThan:ys,greaterThanElement:yr(bs),lessThanElement:yr(ys),min:kc,max:Cc,equalTo:vs,maxlength:Sc,minlength:Mc},dc=oo(uc);function yr(e){return(t,o)=>{let n=typeof t=="string"?it(o,t):t;if(!n)throw"Invalid element";return e(n)}}function _e(e,t){return{key:e,valid:t,message:dc(`validation.${e}`,"validation.invalid")}}function fc(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function gc(e){return _e("nonEmpty",!fc(e))}function xc(e){return _e("nonZero",e===""||Number(e)!==0)}function hc(e){let t=typeof e=="string"?e=new RegExp(e):e;return o=>_e("pattern",typeof o=="string"&&(o===""||t.test(o)))}function vr(e){return e!=null&&e!==""}function bc(e,t){let o=t&&"checked"in t?!!t.checked:!0;return _e("required",o&&vr(e))}function yc(e){return _e("email",typeof e=="string"&&(e===""||cc.test(e)))}function vc(e){return _e("zipcode",typeof e=="string"&&(e===""||pc.test(e)))}function Tc(e){if(typeof e!="string")return!1;try{return JSON.parse(e),!0}catch{return!1}}function wc(e){return _e("json",Tc(e))}function Ec(e){return e instanceof HTMLElement&&"value"in e}function Lo(e,t,o){let n=Ec(t)?d(t,"value"):t instanceof M?t:L(t);return r=>n.map(i=>_e(e,!vr(r)||!vr(i)||o(r,i)))}function hs(e,t){let o=/(\w+)(?:\(([^)]+?)\))?/g,n=[],r;for(;r=o.exec(e);){let i=r[1];if(!i)throw`Invalid rule "${i}"`;if(r[2]){let a=mc[i];if(!a)throw`Invalid rule "${i}"`;n.push(a(r[2],t))}else if(i in xs){let a=xs[i];a&&n.push(a)}else throw`Invalid rule "${i}"`}return n}function Ts(e,t){let o=(typeof e=="string"?hs(e,t):e).flatMap(n=>typeof n=="string"?hs(n,t):n);return(n,r)=>o.map(i=>{let a=i(n,r);return a instanceof M?a:a instanceof Promise?ze(a):L(a)})}function kc(e){return Lo("min",e,(t,o)=>Number(t)>=Number(o))}function bs(e){return Lo("greaterThan",e,(t,o)=>Number(t)>Number(o))}function Cc(e){return Lo("max",e,(t,o)=>Number(t)<=Number(o))}function ys(e){return Lo("lessThan",e,(t,o)=>Number(t)<Number(o))}function vs(e){return Lo("equalTo",e,(t,o)=>t===o||typeof t!=typeof o&&String(t)===String(o))}function Sc(e){return t=>_e("maxlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length<=+e)}function Mc(e){return t=>_e("minlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length>=+e)}function Ac(e){return ws(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function no(e){return P(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||Ve(e,"change",{bubbles:!0})})}function ws(e){return u(d(e,"value"),d(e,"checked")).map(()=>{})}var pe=class e extends m{static formAssociated=!0;inputValue;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{s(e,{init:[h("autofocus"),h("invalid"),h("disabled"),h("touched"),f("rules"),h("name"),_("validationResult"),gn("update")],augment:[t=>(t.defaultValue=t.value,u(Ce("form",t),P(t,"invalid").tap(()=>Ve(t,"invalid")),d(t,"invalid").switchMap(o=>{if(o){if(t.setAria("invalid","true"),!t.validationMessage)return oe.get("validation.invalid").tap(n=>t.setCustomValidity(n))}else t.setAria("invalid",null);return T}),Q(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),d(t,"rules").switchMap(o=>{if(!o)return T;let n=Ts(o,t);return ws(t).switchMap(()=>u(...n(t.value,t)).tap(r=>t.setValidity(r))).finalize(()=>t.resetValidity())}),d(t,"value").tap(o=>t.setFormValue(o)),d(t,"validationResult").switchMap(o=>!o||o.valid?T:o.message instanceof M?o.message:o.message===void 0?oe.get("validation.invalid"):L(o.message)).tap(o=>{t.setCustomValidity(o)}))),Ac]})}get labels(){return de(this).labels}get validity(){return de(this).validity}get validationMessage(){return de(this).validationMessage}reportValidity(){return de(this).reportValidity()}checkValidity(){return de(this).checkValidity()}setCustomValidity(t){let o=!!t,n=t!==this.validationMessage;this.applyValidity(o,t),this.invalid!==o?this.invalid=o:n&&Ve(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,o){o?this.setAttribute(`aria-${t}`,o):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let o in this.validMap){let n=this.validMap[o];if(n&&!n.valid)return this.validationResult=n}this.resetInvalid()}applyValidity(t,o){de(this).setValidity({customError:t},o)}formDisabledCallback(t){this.disabled=t}setFormValue(t){de(this).setFormValue(t==null?null:String(t))}};function Oc(e,t){let o,n=t.key;if(n==="ArrowDown"&&e.goDown)o=e.goDown();else if(n==="ArrowRight"&&e.goRight)o=e.goRight();else if(n==="ArrowUp"&&e.goUp)o=e.goUp();else if(n==="ArrowLeft"&&e.goLeft)o=e.goLeft();else if(n==="Home")o=!t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(n==="End")o=!t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)o=e.other(t);else return null;return t.stopPropagation(),o&&t.preventDefault(),o}function st(e){return b(e.host,"keydown").map(t=>Oc(e,t)).filter(t=>!!t)}function Lc(e){return new M(t=>{let o=e.focus;e.focus=()=>{o.call(e),t.next()},t.signal.subscribe(()=>e.focus=o)})}function Ro({host:e,observe:t,getFocusable:o,getSelected:n,getActive:r=()=>Tr(e)}){let i=[];function a(){let c=i.find(l=>!l.disabled&&!l.hidden&&l.checkVisibility());c&&(c.tabIndex=0)}return u(b(e,"focusin").tap(()=>{let c=r(),l=!1;for(let g of i)g.tabIndex=g===c?(l=!0,0):-1;l||a()}),(t??L(!0)).tap(()=>{i=o();let c=i.find(g=>g.tabIndex===0);if(c){for(let g of i)g!==c&&(g.tabIndex=-1);return}let l=n?.();l?l.tabIndex=0:a()}),e instanceof HTMLElement?Lc(e).tap(()=>{let c=o();(c.find(g=>g.tabIndex===0)??c.at(0))?.focus()}):T).ignoreElements()}function Tr(e){let t=At(e)?.activeElement??document.activeElement??void 0;return t instanceof HTMLElement?t:void 0}function No({getFocusable:e,getActive:t}){return(o=1,n,r=i=>!i.checkVisibility())=>{let i=t(),a=e(),c=n??(i?a.indexOf(i):-1),l;do l=a.at(c+=o);while(l&&r(l));return l}}function Yf(e){let{host:t,getFocusable:o,orientation:n,observe:r}=e,i=No(e),a=[];function c(l){l instanceof HTMLElement&&l.focus({focusVisible:!0})}return u((r??L(!0)).tap(()=>a=o()),Ro(e),st({host:t,...n==="horizontal"?{goRight:()=>i(1),goLeft:()=>i(-1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>i(1,-1),goLast:()=>i(-1,a.length),other:e.customKey}).tap(c))}function On({host:e,input:t,handleOther:o=!1,axis:n}){let r=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function i(w=1){if(e.open===!1){e.open=!0;let S=r();requestAnimationFrame(()=>{S?.focused&&g(S)})}else return a(w)}function a(w=1,S){let O=r(),R=S??(O?e.options.indexOf(O):-1),N;do N=e.options.at(R+=w);while(N?.hidden);return N}function c(w){let S=w.key;if(/^\w$/.test(S)){let O=r(),R=O?e.options.indexOf(O):-1;if(R===-1)return;let N=R;N+1>=e.options.length&&(R=0);let B=new RegExp(`^\\s*${S}`,"i"),X;for(;X=e.options.at(++R);)if(!X.hidden&&X.textContent.match(B))return X;if(N===0)return;for(R=0;R<N&&(X=e.options.at(R++));)if(!X.hidden&&X.textContent.match(B))return X}}let l=()=>e.options.find(w=>w.focused);function g(w){for(let S of e.options)S.focused=!1;w?(w.focused=!0,t?.setAria("activedescendant",tt(w)),w.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let v=w=>ee(w,"selectable.action",w);return u(st({host:t??e,...n==="x"?{goLeft:()=>i(-1),goRight:()=>i(1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>e.open!==!1?a(1,-1):void 0,goLast:()=>e.open!==!1?a(-1,e.options.length):void 0,other:o?c:void 0}).tap(w=>{e.open===!1?v(w):g(w)}),b(t??e,"focus").tap(()=>g(r())),Wt(t??e,"Enter").tap(w=>{let S=l();e.open!==!1&&S?(w.stopPropagation(),v(S)):e.open===!1&&(e.open=!0)}))}function wr(e){return new M(t=>{u(En("selectable",e,e.options,o=>{if(o.type==="connect"&&(o.target.view=e.optionView,o.target.selected))return e.defaultValue===void 0&&(e.defaultValue=o.target.value),t.next(o.target);let n;for(let r of e.options)r.hidden||!r.parentNode||r.selected&&(n?r.selected=!1:n=r);t.next(n)}),ie(e,"selectable.action").tap(o=>{if(!e.disabled&&e.options.includes(o)){let n=e.value!==o.value;t.next(o),n&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var bt=Symbol("unselected"),ro=class e extends pe{options=[];_value;_selected=bt;static{s(e,{init:[f("value"),_("selected")],augment:[t=>wr(t).tap(o=>{(!o||o!==t.selected)&&t.setSelected(o)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===bt?this.options[0]?.value:this._value}get selected(){return this._selected===bt&&this.options[0]?this.options[0]:this._selected===bt?void 0:this._selected}set value(t){if(this._selected&&this._selected!==bt&&this._selected.value===t){this._value=t;return}else for(let o of this.options)if(o.value===t){this._value=t,this.setSelected(o);return}this._selected!==bt?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let o of this.options)o.focused=o.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==bt&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=bt)}};function io(e,t,...o){let n=document.createElementNS("http://www.w3.org/2000/svg",e);for(let[r,i]of Object.entries(t??{}))r!=="children"&&n.setAttribute(r==="className"?"class":r,i===void 0?"":String(i));return o.length&&n.append(...o),n}function It(e){return io("svg",e,io("path",{d:e.d}))}function Rc({host:e,target:t,position:o,onToggle:n,whenClosed:r=T}){return i=>(t.popover??="auto",t.togglePopover(i),n?.(i),i?u(ne(e),b(window,"resize"),b(window,"scroll",{capture:!0,passive:!0})).tap(o):r)}function Es(e){let{host:t,beforeToggle:o,target:n}=e,r=Rc({...e,whenClosed:I(t).tap(()=>{t.open=!0})});return u(b(n,"toggle").tap(i=>{let a=i.newState==="open";t.open=a}),d(t,"open").raf().switchMap(i=>(o?.(i),t.ariaExpanded=i?"true":"false",r(i))))}function ks(e){return u(d(e,"selected").pipe(Ra(e,"selected")),Ce("selectable",e),I(e).tap(()=>ee(e,"selectable.action",e)))}var Er=class extends m{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};s(Er,{tagName:"c-option",init:[f("value"),_("view"),h("selected"),h("hidden"),h("focused")],augment:[E("option"),p(":host{display:contents}"),no,ks,e=>{let t;return u(d(e,"view").switchMap(o=>o?(t?.remove(),e.rendered=t=new o,t.appendChild(x("slot")),A(e).append(t),u(d(e,"selected").tap(n=>t?.toggleAttribute("selected",n)),d(e,"focused").tap(n=>t?.toggleAttribute("focused",n)))):(e.rendered=t=void 0,T)))}]});var Do=class extends m{invalid=!1};s(Do,{tagName:"c-field-help",init:[f("invalid")],augment:[p(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${C("body-small")}
}
	`),y,e=>(e.slot||="help",d(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Pt=p(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${C("body-large")}
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
	${C("body-small")}
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
`),Cr=p(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${C("body-small")}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`),Nc=p(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${C("body-large")}
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

${ot(".content")}
	`);function Dc(e){return u(ie(e,"registable.form",!1).tap(t=>{t.id==="form"&&t.target instanceof pe&&(e.input=t.target)}),gt("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var Ic=()=>x("div",{className:"content"},x("slot",{name:"leading"}),x("div",{className:"body"},x("slot",{name:"label"}),x("slot",{id:"bodyslot"})),x("slot",{name:"trailing"}),x("div",{className:"indicator"}));function Pc(e){function t(v){r.next(v.touched&&v.invalid),e.toggleAttribute("invalid",r.value);let w=0,S=[];for(let R of a.assignedNodes())!(R instanceof HTMLElement)||R===g||("invalid"in R&&R.invalid?r.value&&(R.invalid===!0||typeof R.invalid=="string"&&R.invalid===v.validationResult?.key)?(w++,R.style.display="",S.push(tt(R))):R.style.display="none":S.push(tt(R)));let O=!r.value||w>0;g.textContent=O?"":v.validationMessage,O?g.remove():(g.parentElement||e.append(g),S.push(tt(g))),S.length?v.setAria("describedby",S.join(" ")):v.setAria("describedby",null)}function o(v){let w=e.input;if(w){if(e.toggleAttribute("inputdisabled",w.disabled),t(w),!v)return;v.type==="focus"?i.next(!0):v.type==="blur"&&i.next(!1)}}function n(){let v=e.input?.value,w=!e.input?.hasAttribute("autofilled")&&(!v||Array.isArray(v)&&v.length===0);l?.classList.toggle("novalue",w),l?.classList.toggle("value",!w)}let r=Ee(!1),i=Ee(!1),a=x("slot",{name:"help"}),c=e.contentElement.children[1]?.children[0],l=c instanceof HTMLSlotElement?c:void 0,g=x(Do,{ariaLive:"polite"});return A(e).append(x("div",{className:"help"},a)),u(d(e,"input").switchMap(v=>v?u(L(void 0).tap(()=>{o(),queueMicrotask(n)}),b(v,"focusable.change").tap(o).tap(n),b(v,"focus").tap(o),b(v,"invalid").tap(o),b(v,"update").tap(n),P(v,"touched").tap(()=>o()),u(b(v,"blur"),b(a,"slotchange")).raf(o),b(e.contentElement,"click").tap(()=>{document.activeElement!==v&&!e.matches(":focus-within")&&!i.value&&v.focus()})):T),Dc(e))}var Ie=class e extends m{floating=!1;input;size;contentElement=Ic();static{s(e,{init:[h("floating"),_("input"),te("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Pc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},kr=class extends Ie{};s(kr,{tagName:"c-field",augment:[Pt,Cr,Nc]});var Fc=p(`
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
`),Cs=p(`
${vn("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function Hc(e,t){return()=>{let o=e.parentElement instanceof Ie?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${o.bottom}px`,t.style.left=`${o.x}px`,t.style.minWidth=`${o.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-o.bottom-16,280)}px`}}function Mr({host:e,target:t,input:o,position:n,beforeToggle:r,onToggle:i,handleOther:a,axis:c}){return u(On({host:e,input:o,handleOther:a,axis:c}),b(o??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),Es({host:e,target:t,position:n??Hc(e,t),beforeToggle:r,onToggle:i}))}function Kc(e){let{host:t}=e;return u(Fc(t)??T,j(t)??T,Se(t),Mr(e))}var ao=class extends m{};s(ao,{tagName:"c-select-option",augment:[p(`
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
		`),y]});var Sr=class extends ro{open=!1;optionView=ao;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let o of this.options)o!==t&&(o.slot="");t&&(t.slot="selected")}}};s(Sr,{tagName:"c-select",init:[h("open")],augment:[E("listbox"),p(`
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
	${Z("surface-container")}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),e=>{let t=x("div",{className:"menu"},x("slot")),o=x("slot",{name:"selected"}),n=t.style,r=wn(e),i=0,a=0;A(e).append(t,o,It({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function c(){if(e.open)a=e.selected?.rendered?.offsetHeight??0;else{n.cssText="";let l=e.options.reduce((g,v)=>Math.max(g,v.rendered?.offsetWidth??0),0);r.replaceSync(`:host{width:min(100%,${l}px)}`)}}return u(u(Xt(e),ft()).raf(c),Kc({host:e,target:t,handleOther:!0,beforeToggle(l){c();let g=e.selected;g&&(g.slot=l?"":"selected"),t.classList.toggle("open",l)},onToggle(l){let g=e.selected;!l&&g&&(i=g.rendered?.offsetHeight??0)},position(){let l=e.parentElement??e,g=Math.round((a-i)/2),v=e.selected?.rendered,w=l.getBoundingClientRect(),S=e.getBoundingClientRect(),O=S.top-14,R,N=v?v.offsetTop:0;N>O&&(N=O),R=t.scrollHeight;let B=window.innerHeight-S.top+8+N,X=S.top-g-N;R>B?R=B:R<S.height&&(R=S.height),n.top=X+"px",n.left=w.left+"px",n.maxHeight=R+"px",n.minWidth=w.width+"px",n.transformOrigin=`${N}px`}}))}]});function Ar(e){let t=vo();return u(Ce("field",e,o=>t.next(o)),t)}function so(e){return Ar(e).switchMap(t=>d(e,"input").switchMap(o=>o?L(o):d(t,"input").switchMap(n=>n?L(n):T)))}function Io(e,t,o){return d(e,o).tap(n=>wo(t,o,n))}var Bc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function Xe({host:e,input:t,toText:o,toValue:n,update:r}){t.className="cxl-native-input",t.setAttribute("style",Bc),t.setAttribute("form","__cxl_ignore__");function i(l){e.value=n?n(t.value||""):t.value,l.stopPropagation(),e.dispatchEvent(new Event(l.type,{bubbles:!0}))}function a(){let l=e.value,g=o?o(l,t.value):l==null?"":String(l);t.value!==g&&e.setInputValue(g)}function c(){t.ariaLabel=e.ariaLabel;let l=e.getAttribute("aria-labelledby");l?t.setAttribute("aria-labelledby",l):t.removeAttribute("aria-labelledby")}return u(Se(e,t),Y(()=>(c(),t.form?b(t.form,"reset").tap(i):T)),d(e,"value").tap(()=>{o&&t.matches(":focus")||a()}),b(t,"blur").tap(a),b(t,"input").tap(i),b(t,"change").tap(i),Io(e,t,"disabled"),Io(e,t,"name"),Io(e,t,"autocomplete"),Io(e,t,"spellcheck"),Io(e,t,"autofocus"),ln(e,["aria-label","aria-labelledby"]).tap(c),r?r.tap(a):T,b(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),b(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var lo=class e extends pe{autocomplete;inputValue="";static{s(e,{init:[_("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,b(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,o){o?this.inputEl.setAttribute(`aria-${t}`,o):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,o){de(this).setValidity({customError:t},o,this.inputEl),this.inputEl.setCustomValidity(t?o||"Invalid Field":"")}};var Lr=[p(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),j],Po=[...Lr,y],Pe=class e extends lo{autofilled=!1;static{s(e,{init:[h("autofilled"),f("autocomplete")],augment:[t=>b(t.inputEl,"animationstart").tap(o=>{(o.animationName==="cxl-onautofillstart"||o.animationName==="cxl-onautofillend")&&(t.autofilled=o.animationName==="cxl-onautofillstart",ee(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,o){this.inputEl.setSelectionRange(t,o)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},Or=class extends Pe{value="";inputEl=x("input",{className:"input"})};s(Or,{tagName:"c-input-text",init:[f("value")],augment:[...Po,e=>e.append(e.inputEl),e=>Xe({host:e,input:e.inputEl})]});function zc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var Ln=class e extends Pe{selected;value;inputEl=x("input",{className:"input"});static{s(e,{tagName:"c-input-option",init:[f("value"),_("selected")],augment:[...Po,t=>t.append(t.inputEl),t=>Xe({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:o=>o!==""?t.selected?.value:void 0}),t=>P(t,"selected").tap(o=>{let n=t.selected?.textContent;t.value=o?.value,t.setInputValue(n??""),zc(t.inputEl)})]})}};function Vc(e){return Rr(e,"^")}function Rr(e,t=""){if(e==="")return()=>!0;let o=jc(e,t);return n=>n.textContent?o.test(n.textContent):!1}function jc(e,t="",o="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),o)}var Rn=class e extends m{optionView=ao;open=!1;debounce=100;options=[];matcher=Rr;static{s(e,{tagName:"c-autocomplete",init:[h("open"),he("debounce")],augment:[E("listbox"),Cs,q,t=>{let o=x("slot",{name:"empty"}),n=x("div",{id:"menu",tabIndex:-1},x("slot"),o),r=It({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});r.style.cursor="pointer",o.style.display="none";function i(l){t.open=!0,c(l)}function a(l,g){l.setAria("activedescendant",tt(g)),g.rendered?.scrollIntoView({block:"nearest"})}function c(l){let g=l.inputValue??l.value,v=t.doSearch(g);o.style.display=v?"none":"",v&&a(l,v)}return A(t).append(n,r),u(so(t).switchMap(l=>(l.setAria("autocomplete","list"),l.role="combobox",l.setAria("controls",tt(t)),l.setAria("haspopup",t.role),l.setAttribute("autocomplete","off"),u(d(t,"open").tap(g=>{if(g)r.tabIndex=-1,i(l);else{for(let v of t.options)v.focused=!1;r.tabIndex=0,l.setAria("activedescendant",null)}l.setAria("expanded",String(g))}),u(cn(r),b(r,"mousedown")).tap(g=>{g.preventDefault(),g.stopPropagation(),l.focus()}).debounceTime(100).tap(()=>{t.open=!0}),d(t,"debounce").switchMap(g=>b(l,"input").debounceTime(g).tap(()=>t.open?c(l):i(l))),b(t,"change").tap(g=>{g.target===t&&l.dispatchEvent(new Event("change",{bubbles:!0}))}),Mr({host:t,target:n,input:l}),u(wr(t),P(l,"value").map(g=>{for(let v of t.options)if(v.value===g)return v})).tap(g=>{for(let v of t.options)v.focused=v.selected=!1;g&&(g.selected=!0),l instanceof Ln?l.selected=g:l.value=g?.value,g&&(t.open=!1)})))))}]})}doSearch(t){let o=0,n,r=this.matcher==="substring"?Rr:this.matcher==="prefix"?Vc:this.matcher,i=t?r(String(t)):void 0;for(let a of this.options){let c=!i?.(a);a.hidden=c,a.focused=!(c||o++>0),a.focused&&(n=a)}return n}};var Nr=class extends Rn{onsearch;doSearch(t){return Ve(this,"search",{detail:String(t)}),this.options[0]}};s(Nr,{tagName:"c-autocomplete-dynamic",init:[gn("search")]});var Uc=p(`
:host {
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border-radius: 100%;
	overflow-y: hidden;
	vertical-align: middle;
	position: relative;
	${C("title-large")}
}
svg,img { width: 100%; height: 100%; }
`),Dr=class extends m{size;src="";text=""};s(Dr,{tagName:"c-avatar",init:[te("size",e=>`{
				width: ${30+e*8}px;
				height: ${30+e*8}px;
				font-size: ${18+e*4}px;
			}`),f("src"),f("text")],augment:[Uc,e=>{let t;return V(d(e,"src"),d(e,"text")).raf(([o,n])=>{t?.remove(),o?(t=new Image,t.alt=e.text,t.src=o):n?t=new Text(n):t=Zt("person"),A(e).append(t)})}]});var Ir=class extends m{};s(Ir,{tagName:"c-body",augment:[p(`
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

${F("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),y]});var Nn=class extends m{};s(Nn,{tagName:"c-button-segmented-view",augment:[p(`
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
		`),dt,ce,()=>x(ge,{id:"check",name:"check"}),y]});var Pr=class extends ro{optionView=Nn;size};s(Pr,{tagName:"c-button-segmented",init:[te("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[E("listbox"),p(`
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
	${C("label-large")}
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
		`),j,y,Se,e=>On({host:e,axis:"x"})]});var Fr=class extends to{};s(Fr,{tagName:"c-button-text",augment:[...Nt,p(`
:host {
	${C("label-large")}
	padding: 0 12px; border-radius: var(--cxl-shape-corner-full);
	flex-shrink: 0;
	margin: -10px -12px;
	background-color: transparent;
	color: var(--cxl-color-primary);
	cursor: pointer;
	overflow: hidden;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	column-gap: 8px;
	line-height: unset;
	min-height: 40px;
	align-self: center;
}
:host([disabled]) {
	color: color-mix(in srgb, var(--cxl-color--on-surface) 38%, transparent);
	background-color: transparent;
}
:host(:hover) { box-shadow: none; }
		`),ce,y]});function Hr(e="block"){let t=(o=>{for(let n=12;n>0;n--)o.xl+=`:host([xl="${n}"]){display:${e};grid-column-end:span ${n};}`,o.lg+=`:host([lg="${n}"]){display:${e};grid-column-end:span ${n};}`,o.md+=`:host([md="${n}"]){display:${e};grid-column-end:span ${n};}`,o.sm+=`:host([sm="${n}"]){display:${e};grid-column-end:span ${n};}`,o.xs+=`:host([xs="${n}"]){display:${e};grid-column-end:span ${n};}`;return o})({xl:"",lg:"",md:"",sm:"",xs:""});return p(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${F("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${F("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${F("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${F("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var Kr=p(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${Qt()}
${nt.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${nt.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),co=class extends m{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};s(co,{init:[h("sm"),h("xs"),h("md"),h("lg"),h("xl"),h("vpad"),h("pad"),h("center"),h("fill"),h("grow"),h("elevation"),le("color")]});var Fo=class extends co{};s(Fo,{tagName:"c-c",augment:[Kr,Hr(),p(":host([center]) { text-align: center}"),y]});var Yc=p(`
:host {
	${Z("surface-container")}
	${C("body-medium")}
	border-radius: var(--cxl-shape-corner-medium);
	overflow: hidden;
}
:host([variant=elevated]:not([color])) {
	--cxl-color-surface: var(--cxl-color-surface-container-low);
	z-index: 1;
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=outlined]:not([color])) {
	${Z("surface")}
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline-variant);
}
${Qt()}
`),Ho=class extends Fo{variant};s(Ho,{tagName:"c-card",init:[h("variant")],augment:[Yc]});var _c=p(`
:host { ${yn} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function Xc(e){return u(Ce("list",e),d(e,"selected").tap(t=>e.ariaSelected=String(t)))}function zr(e){return u(pr(e),Se(e,e,-1),Xc(e))}var We=class extends m{disabled=!1;touched=!1;selected=!1};s(We,{init:[h("disabled"),h("touched"),h("selected")],augment:[zr]});var Br=class extends We{size};s(Br,{tagName:"c-item",init:[te("size",e=>`{min-height:${56+e*8}px}`)],augment:[_c,j,dt,E("option"),y,ce]});var Vr=class extends Ho{disabled=!1;touched=!1;selected=!1};s(Vr,{tagName:"c-card-item",init:[h("disabled"),h("touched"),h("selected")],augment:[E("option"),...Nt,p(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),zr,ce]});function jr(e){return u(V(d(e,"indeterminate"),d(e,"checked")).map(([t,o])=>e.ariaChecked=t?"mixed":String(o)),u(I(e).tap(()=>{e.disabled||(e.indeterminate&&(e.indeterminate=!1),e.checked=!e.checked)}),d(e,"checked").tap(()=>{de(e).setFormValue(e.checked?String(e.value):null)}),P(e,"checked").tap(()=>{e.dispatchEvent(new Event("change",{bubbles:!0}))})).ignoreElements())}var Ss=class e extends pe{value="on";checked=!1;indeterminate=!1;defaultChecked=!1;static{s(e,{tagName:"c-checkbox",init:[f("value"),f("checked"),f("indeterminate")],augment:[E("checkbox"),p(`
:host {
	position: relative;
	display: flex;
	column-gap: 16px;
	align-items: center;
	outline: none;
	cursor: pointer;
	text-align: start;
	padding: 15px;
	${C("body-large")}
	line-height: 18px;
}
:host(:empty) {
  margin: -15px;
  background-color: transparent;
}
:host(:empty) slot { display: none; }
:host([invalid][touched]) .box {
  border-color: var(--cxl-color-error);
  background-color: var(--cxl-color-error);
  color: var(--cxl-color-on-error);
}
:host([invalid][touched]) .box[state=false] {
  background-color: var(--cxl-color-surface);
}
.box {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	position: relative;
	box-sizing: border-box;
	flex-shrink: 0;
	width: 18px;
	height: 18px;
	border-radius: 2px;
	border: 2px solid var(--cxl-color-on-surface);
	background-color: var(--cxl-color-surface);
}
.mask {
	display: block;
	position: absolute;
	top: -13px; left: -13px;
	width: 40px; height: 40px;
	border-radius: 100%;
	overflow: hidden;
}
${ot(".mask")}
svg { display:none; stroke-width:4px;fill:currentColor;stroke:currentColor;width:14px;height:14px; }

.box[state=mixed] .minus { display: block; }
.box[state=true] .check { display: block; }

.box[state=true],.box[state=mixed]  {
	--cxl-color-on-surface: var(--cxl-color-primary);
	background-color: var(--cxl-color-on-surface);
	color: var(--cxl-color-on-primary);
}
:host([invalid][touched]) .box {
	--cxl-color-on-surface: var(--cxl-color-error);
}
:host([disabled]) .box {
	--cxl-color-on-surface: var(--cxl-color--on-surface);
	opacity: 0.38;
}
`),Ne,j,t=>{t.defaultChecked=t.checked;let o=x("div",{className:"mask"}),n=x("div",{className:"box"},It({className:"check",viewBox:"0 0 24 24",d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),It({className:"minus",viewBox:"0 0 24 24",d:"M19 13H5v-2h14v2z"}),o);return A(t).append(n,x("slot")),u(ce(o,t),jr(t).tap(r=>n.setAttribute("state",r)))}]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){de(this).setFormValue(this.checked?String(t):null)}};var Ko=class extends m{color;size=0};s(Ko,{tagName:"c-pill",init:[le("color","surface-container-low"),te("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[p(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${C("label-large")}
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
		`),()=>x("slot",{name:"leading"}),y,()=>x("slot",{name:"trailing"})]});var Ur=class extends Ko{disabled=!1;touched=!1;selected=!1};s(Ur,{tagName:"c-chip",init:[h("disabled"),h("touched"),h("selected")],augment:[E("button"),Ne,...Nt,p(`
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
	${Z("secondary-container")}
}
:host(:hover) { box-shadow: none; }
		`),ce]});var Yr=class extends m{date;format;locale};s(Yr,{tagName:"c-date",init:[cs("date"),f("format"),f("locale")],augment:[e=>V(d(e,"locale").switchMap(t=>oe.getLocale(t)),d(e,"date"),d(e,"format")).raf(([t,o,n])=>e.textContent=o?t.formatDate(o,n):"")]});oo({"dialog.close":"Close dialog","dialog.cancel":"Cancel","dialog.ok":"Ok"});var Xr=(e,t,o=e)=>I(e).tap(()=>ee(o,"dialog.close",t)),Wr=p(`
:host([fullscreen]) dialog {
	background-color: var(--cxl-color-surface);
	box-shadow: none;
	margin: 0;
	width: 100%; height: 100%; max-width: none;
	border-radius: 0; max-height: none;
}
dialog {
	margin: auto;
	border-width: 0;
	max-height: none;
	text-align: start;
	outline: none;
	${Z("surface-container-high")}
	
	box-sizing: border-box;
	min-width: 280px;
	max-width: calc(100% - 24px);
	padding: 24px;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-3);
	border-radius: var(--cxl-shape-corner-xlarge);
}

dialog::backdrop { background-color: var(--cxl-color-scrim); }

${F("small",".content { max-height: 85%; }")}
	`),po=class extends m{static=!1;open=!1;fullscreen=!1;dialog=document.createElement("dialog");returnValue};s(po,{init:[f("static"),f("open"),h("fullscreen")],augment:[q,e=>b(e,"keydown").tap(t=>{t.key==="Escape"&&(t.preventDefault(),e.open=!1)}),e=>b(e.dialog,"close").tap(()=>e.open=!1),e=>e.dialog,e=>d(e,"open").tap(t=>{t?e.static?e.dialog.show():fe.openModal({element:e.dialog,close:()=>e.open=!1}):e.dialog.open&&(e.dialog.close(),Ve(e,"close"))}),e=>ie(e,"dialog.close").tap(t=>{e.returnValue=t,e.open=!1})]});var _r=class extends po{};s(_r,{tagName:"c-dialog",augment:[Wr,e=>{e.dialog.append(x("slot",{className:"content"}))}]});function Dn(e,t,...o){let n=x(e,t,...o);return new Promise(r=>{let i=()=>{n.removeEventListener("close",i),n.remove(),r(n.returnValue)};n.addEventListener("close",i),n.parentNode||document.body.append(n),n.open=!0})}var Ft=class extends po{};s(Ft,{tagName:"c-dialog-basic",augment:[Wr,p(`
dialog {
	display:flex; flex-direction:column;row-gap:16px;
	max-width: min(calc(100% - 24px), 560px);
}
slot[name=title] { ${C("title-large")} }
slot[name=actions] {
	display:flex; column-gap: 24px; align-items: center; justify-content: end; margin-top:8px;
}
		`),e=>{e.dialog.append(x("slot",{name:"title"}),x("slot"),x("slot",{name:"actions"}))}]});function ib(e){let t=[],{message:o,title:n,action:r}=typeof e=="string"?{message:e}:e;return n&&t.push(x("div",{slot:"title"},n)),t.push(x(at,void 0,o),x(Ye,{$:Sn,variant:"text",slot:"actions"},r??oe.get("dialog.ok"))),Dn(Ft,{},...t)}function db(e){let t=[];typeof e=="string"&&(e={message:e});let{message:o,title:n,action:r,cancelAction:i}=e;return n&&t.push(x("div",{slot:"title"},n)),t.push(x(at,void 0,o),x(Ye,{variant:"text",slot:"actions",$:a=>Xr(a,!1)},i??oe.get("dialog.cancel")),x(Ye,{variant:"text",slot:"actions",$:a=>Xr(a,!0)},r??oe.get("dialog.ok"))),Dn(Ft,{},...t)}var qr=class extends m{motion;target};s(qr,{tagName:"c-dismiss",init:[f("motion"),f("target")],augment:[q,y,e=>kn(e,"target").switchMap(t=>t?I(e).tap(()=>{e.motion?ko(e,t,e.motion).finalize(()=>t.remove()).subscribe():t.remove()}):T)]});function $r(e,{target:t,clientX:o,clientY:n},r,i){if(!(t instanceof HTMLElement))throw new Error("Invalid Event Target");return{type:e,target:t,clientX:o,clientY:n,startX:r,startY:i}}function Wc(){let e={},t=Ee(e),o=new xe;return{dragging:t,dropping:o,elements:e,next:()=>t.next(e)}}var yt=Wc();function qc(e){return({target:t,moveTarget:o,delay:n})=>{let r=!1,i=0;n??=60;let a=o||t,c=t.style,{userSelect:l,transition:g}=c;return new M(v=>{function w(D,J=!0){r?(r=!1,a.style.transition=g,B?.unsubscribe(),v.next(D),delete yt.elements.mouse,J&&yt.dropping.next({element:a,event:D}),yt.next()):clearTimeout(i)}let S=0,O=0;function R(D){r&&D.key==="Escape"&&(D.preventDefault(),w({type:"end",target:t,clientX:0,clientY:0,startX:S,startY:O},!0))}function N(D,J){if(a.style.transition="none",!!t.isConnected){try{t.setPointerCapture(J)}catch(lt){console.error(lt)}r=!0,v.next($r("start",D,S,O)),B=b(window,"keydown").tap(R).subscribe()}}l=c.userSelect,c.userSelect="none";let B,X=u(e(t).switchMap(D=>{if(D.type==="pointerdown"){g=a.style.transition,D.preventDefault(),S=D.clientX,O=D.clientY;let J=D.pointerId;r=!1,i=setTimeout(N,n,D,J)}else if(D.type==="pointermove"){if(r){let J=$r("move",D,S,O);v.next(J),yt.elements.mouse={element:a,event:J},yt.next()}}else return clearTimeout(i),L(D);return T}).debounceTime().tap(D=>w($r("end",D,S,O))),b(t,"click",{capture:!0}).tap(D=>{r&&D.target===t&&D.stopImmediatePropagation()})).subscribe();v.signal.subscribe(()=>{X.unsubscribe(),B?.unsubscribe(),c.userSelect=l})})}}function $c(e){return e.style.touchAction||(e.style.touchAction="none"),b(e,"pointerdown").switchMap(t=>t.currentTarget?new M(o=>{o.next(t);let n=u(b(window,"pointermove").tap(r=>o.next(r)),u(b(window,"pointercancel"),b(window,"pointerup")).tap(r=>{o.next(r),n.unsubscribe()})).subscribe();o.signal.subscribe(()=>n.unsubscribe())}):T)}var Gc=qc($c);function Gr(e){return Gc(e)}function Ms(e,t){let o=t.clientX,n=t.clientY;return e.left<o&&e.right>o&&e.top<n&&e.bottom>n}function Jc(e){let t=yt.elements,o=[],n;for(let r in t){let i=t[r];if(!i)continue;let{event:a,element:c}=i;c!==e&&(n||=e.getBoundingClientRect(),Ms(n,a)&&o.push({type:"over",target:e,relatedTarget:c,clientX:a.clientX,clientY:a.clientY}))}return o}function Qc(e){let t=0;return yt.dragging.switchMap(()=>{let o=Jc(e);return t===0&&o.length===0?T:(t=o.length,L(o))})}function Zc(e){return Qc(e).switchMap(t=>t.length===0?L({type:"out",target:e,clientX:0,clientY:0}):ze(t))}function ep(e){return yt.dropping.switchMap(({element:t,event:o})=>e!==t&&Ms(e.getBoundingClientRect(),o)?L({type:"drop",target:e,clientX:o.clientX,clientY:o.clientY,relatedTarget:t}):T)}function tp(e,t){return{width:e.offsetWidth,height:e.offsetHeight,x:t.clientX,y:t.clientY,sx:t.clientX/e.offsetWidth,sy:t.clientY/e.offsetHeight}}function op({target:e,moveTarget:t,axis:o}){let n;return r=>{let i=t||e;if(r.type==="start")n=tp(i,r);else if(r.type==="end")i.style.transform="",n=void 0;else if(n){let a=o==="y"?0:(r.clientX-n.x)/n.width,c=o==="x"?0:(r.clientY-n.y)/n.height;return L({event:r,x:a,y:c,sx:n.sx,sy:n.sy})}return T}}function np(e){return({x:t,y:o})=>{let n=(e.moveTarget||e.target).style;n.transform=`translate(${t*100}%, ${o*100}%)`}}function As(e){let t=0;return u(b(e,"dragenter").tap(o=>{++t===1&&e.setAttribute("dragover",""),o.stopPropagation()}),b(e,"dragleave").tap(()=>{--t===0&&e.removeAttribute("dragover")}),b(e,"dragover").tap(o=>o.preventDefault()),b(e,"drop").tap(o=>{o.preventDefault(),o.stopPropagation(),e.removeAttribute("dragover"),t=0})).filter(o=>o.type==="drop")}function Os(e){let t=e.moveTarget||e.target;return u(Gr(e).tap(o=>{o.type==="start"?t.toggleAttribute("dragging",!0):o.type==="end"&&t.toggleAttribute("dragging",!1)}).switchMap(op(e)).tap(np(e)).ignoreElements(),Zc(t).tap(o=>t.toggleAttribute("dragover",o.type==="over")),ep(t))}var Ls=class e extends m{dragging=!1;dragover=!1;target;static{s(e,{tagName:"c-drag-handle",init:[h("dragging"),h("dragover")],augment:[y,p(`
:host { display: block; cursor:grab; position: relative; touch-action: none; }
:host([dragging]) { z-index: 10 }
		`),t=>kn(t,"target").switchMap(o=>Os({target:t,moveTarget:o,delay:150}).tap(n=>t.handleDrag?.(n)))]})}};var Bo=class extends m{center=!1};s(Bo,{tagName:"c-backdrop",init:[h("center")],augment:[p(`
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

	`),e=>b(e,"keydown").tap(t=>t.stopPropagation()),y]});var zo=class extends Ue{};s(zo,{tagName:"c-toggle-panel",augment:[y,eo,rt]});var rp=p(`
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
${F("small","#drawer { width: 360px }")}

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
`),Vo=class extends m{open=!1;position;responsive;permanent=!1};s(Vo,{tagName:"c-drawer",init:[h("open"),h("position"),f("responsive"),f("permanent")],augment:[rp,p(`
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
`),e=>{let t=Ee(!1),o=u(d(e,"position"),t).raf(),n=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",r=x(zo,{id:"drawer","motion-in":o.map(()=>e.permanent&&t.value?void 0:n()?"slideInRight":"slideInLeft"),"motion-out":o.map(()=>e.permanent&&t.value?void 0:n()?"slideOutRight":"slideOutLeft")},y),i=new Bo;i.id="backdrop";let a=x("dialog",{id:"dialog"},i,r);return A(e).append(a),u(b(r,"close").tap(()=>a.close()),b(a,"close").tap(()=>e.open=!1),ie(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),P(r,"open").tap(c=>e.open=c),P(e,"open").raf(c=>{c||r.scrollTo(0,0)}),b(i,"click").tap(()=>e.open=!1),b(a,"cancel").tap(c=>{c.preventDefault(),e.open=!1}),d(e,"open").tap(c=>{if(t.value&&e.permanent)return r.open=!0;c?t.value||(fe.openModal({element:a,close:()=>e.open=!1}),a.getBoundingClientRect()):fe.currentModal?.element===a&&fe.modalClosed()}).raf(c=>{r.open=c}),d(e,"responsive").switchMap(c=>c!==void 0?Tn(document.body):L("xsmall")).switchMap(c=>{let l=G.breakpoints[e.responsive||"large"],g=G.breakpoints[c]>=l;return t.next(g),g&&r.className!=="permanent"?a.close():!g&&r.className==="permanent"&&(e.open=!1),g&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",g),r.className=g?"permanent":"drawer",P(e,"open").tap(v=>{e.hasAttribute("responsiveon")||be({target:i,animation:v?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var Jr=class extends ht{icon="arrow_right"};s(Jr,{tagName:"c-dropdown",init:[f("icon")],augment:[p(`
:host { display: flex; gap: 0; align-items: center; cursor: pointer; }
.icon { transition: rotate var(--cxl-speed); height:24px; width:24px; translate: -7px; margin-right: -6px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x(ge,{className:"icon"});return e.shadowRoot?.append(t,x("slot")),u(d(e,"icon").tap(o=>t.name=o),b(e,"keydown").tap(o=>{o.key==="ArrowRight"?e.open=!0:o.key==="ArrowLeft"&&(e.open=!1)}))}]});var uo=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,o=this.end){let n=this.end.parentNode;n&&(this.start.parentNode||n.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),n.insertBefore(this.frag,o)):n.insertBefore(t,o))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let o=document.createRange();o.setStartAfter(this.start),o.setEndBefore(this.end),o.deleteContents()}};function Ns({source:e,render:t,empty:o,append:n,loading:r}){let i=[],a=document.createDocumentFragment(),c,l;function g(v){if(l?.parentNode?.removeChild(l),!v)return;let w=0;for(let O of v){let R=i[w]?.item;if(R)R.value!==O&&R.next(O);else{let N=Ee(O),B=t(N,w,v),X=B instanceof DocumentFragment?Array.from(B.childNodes):[B];i.push({elements:X,item:N}),a.append(B)}w++}a.childNodes.length&&n(a),c?.remove(),w===0&&o&&n(c=o());let S=i.length;for(;S-- >w;)i.pop()?.elements.forEach(O=>O.parentNode?.removeChild(O))}return Y(()=>(l=r?.(),l&&n(l),e.raf(g)))}function ly(e){return xn(()=>{let t=new uo;return[Ns({...e,append:o=>t.insert(o)}),t.end]})}function ip(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function ap(e,t){let o=e.getRootNode();if(o instanceof Document)return ip(o.getElementById(t));throw new Error("Invalid root node")}function Rs(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=ap(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function sp(e){return d(e,"template").switchMap(t=>t?L(Rs(e,t)):et().map(()=>Rs(e,e.children[0])))}function lp(e,t,o){return sp(e).switchMap(n=>{let r=e.target?it(e,e.target)??e:e;return n?Ns({source:t,render:o?(i,a,c)=>o(n(i,a,c)):n,append:i=>r.append(i)}):T})}var Qr=class extends m{source;template};s(Qr,{tagName:"c-each",init:[_("source"),_("template")],augment:[q,y,e=>lp(e,d(e,"source"))]});var Zr=class extends Ie{};s(Zr,{tagName:"c-field-bar",augment:[Pt,p(`
:host {
	box-sizing: border-box;
	${Z("surface-container-high")}
	${C("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var ei=class extends Ie{};s(ei,{tagName:"c-field-frame",augment:[p(`
slot[name=label] { ${C("body-large")} }
		`),Pt]});var ti=class extends Ie{};s(ti,{tagName:"c-field-outlined",augment:[Pt,Cr,p(`
:host { margin-top: 4px; }
.content {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border: 1px solid var(--cxl-color-outline);
	border-radius: var(--cxl-shape-corner-xsmall);
	transition: outline calc(var(--cxl-speed) / 2);
	outline: 0 solid var(--cxl-color-primary);
}
.indicator { display: none; }
slot[name=label] {
	position: absolute;	
	background-color: var(--cxl-color-surface);
	inset-inline-start: 12px;
	top: -8px;
}
::slotted([slot="label"]) { margin: 0 4px; }
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${C("body-large")}
	height: 0;
	top: var(--cxl-field-outlined-label-top, 16px);
	inset-inline-start: unset;
}
${er.map(e=>`:host([size="${e}"]) { --cxl-field-outlined-label-top: ${16+e*4}px }`)}
:host([invalid]) .content { border-color: var(--cxl-color-error); }
:host(:hover) .content, :host(:focus) .content { background-image: none; }
:host(:focus-within) .content {
	outline-width: 2px;
}
:host([inputdisabled]) {
	color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
:host([inputdisabled]) .content {
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
	color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
		`)]});var jo=class extends co{vflex=!1;gap;middle=!1};s(jo,{tagName:"c-flex",init:[h("vflex"),h("gap"),h("middle")],augment:[Hr("flex"),Kr,p(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${nt.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),y]});var In=class e extends m{elements=new Set;initialValue;static{s(e,{tagName:"c-form",augment:[E("form"),q,t=>b(t,"submit",{capture:!0}).tap(o=>{o.preventDefault();let n;for(let r of t.elements)r.invalid&&(n??=r),r.touched=!0;n&&(n.focus(),o.stopPropagation(),o.stopImmediatePropagation())}),t=>gt("form",t,t.elements).tap(o=>{let n=o.target,r=n.name,i=t.initialValue;i&&r&&r in i&&(n.value=i[r])}),t=>Wt(t,"enter").tap(()=>t.submit()),y]})}checkValidity(){let t=!0;for(let o of this.elements)o.invalid&&(t=!1),o.touched=!0;return t}reset(){for(let t of this.elements)t.formResetCallback()}submit(){Ve(this,"submit")}requestSubmit(){this.submit()}getElementByName(t){for(let o of this.elements)if(o.name===t)return o}setTouched(t){for(let o of this.elements)o.touched=t}setFormData(t){this.initialValue=t;for(let o in t){let n=this.getElementByName(o);n&&(n.value=t[o])}}getFormData(){let t={};for(let o of this.elements){let n="checked"in o?o.checked?o.value:void 0:o.value;o.name&&(t[o.name]=n)}return t}};function cp(e){let t=e.parentElement;for(;t;){if(t instanceof HTMLFormElement||t instanceof In)return t;t=t.parentElement}}var oi=class extends m{};s(oi,{tagName:"c-form-submit",augment:[q,y,e=>Y(()=>{let t=cp(e);return t?u(I(e).tap(()=>{if(t instanceof HTMLFormElement){let o;for(let n of t.elements)n instanceof pe&&(n.invalid&&(o??=n),n.touched=!0);o?.focus()}t.requestSubmit()})):T})]});function pp(e){let t=new CSSStyleSheet;return A(e).adoptedStyleSheets.push(t),d(e,"columns").raf(()=>{let o=`repeat(${e.columns}, minmax(0,1fr))`;t.replaceSync(`:host{grid-template-columns:${o}}`)})}var ni=class extends m{rows;columns=12};s(ni,{tagName:"c-grid",init:[f("columns"),f("rows")],augment:[y,p(`
:host{display:grid;gap:16px;box-sizing:border-box;}
${F("medium",":host{gap:24px}")}
`),pp]});function ri(e){return En("list",e,e.items)}function up(e){return Ro({host:e,getFocusable:()=>e.items,getSelected:()=>e.items.find(t=>t.selected),getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),observe:ri(e)})}function mp(e){return No({getFocusable:()=>e.items,getActive:()=>Tr(e)})}function Pn(e){let t=mp(e);return u(up(e),st({host:e,goDown:()=>t(1),goUp:()=>t(-1),goFirst:()=>t(1,-1),goLast:()=>t(-1,e.items.length)}).tap(o=>o.focus()))}function dp(e){let{host:t,getActive:o,getSelected:n}=e,r=e.columns?Math.max(1,Math.floor(e.columns)):void 0,i=[],a=(e.observe??wa(t)).tap(()=>{i=e.getFocusable()}),c=()=>i,l=No({getFocusable:c,getActive:o});function g(w){if(r)return l(w*r);let S=o();if(!S)return;let O=S.getBoundingClientRect(),R=O.left+O.width/2,N=O.top+O.height/2,B,X=1/0;for(let D of i){if(D===S||D.disabled||!D.checkVisibility())continue;let J=D.getBoundingClientRect(),lt=J.left+J.width/2,qe=(J.top+J.height/2-N)*w;if(qe<=0)continue;let ue=qe**2+(lt-R)**2;ue<X&&(B=D,X=ue)}return B}function v(w){if(!r)return;let S=o(),O=i.findIndex(N=>N===S);if(O===-1)return;let R=O-O%r;return i[Math.min(R+(w?r-1:0),i.length-1)]}return u(Ro({host:t,getFocusable:c,getActive:o,getSelected:n,observe:a}),st({host:t,goRight:()=>{let w=o(),S=i.findIndex(O=>O===w);return r&&S%r===r-1?void 0:l(1)},goLeft:()=>{let w=o(),S=i.findIndex(O=>O===w);return r&&S%r===0?void 0:l(-1)},goFirst:()=>l(1,-1),goLast:()=>l(-1,i.length),goFirstColumn:()=>v(!1),goLastColumn:()=>v(!0),goUp:()=>g(-1),goDown:()=>g(1)}).tap(w=>w.focus()))}var ii=class extends m{items=[]};s(ii,{tagName:"c-grid-list",augment:[E("grid"),p(":host{display:grid;box-sizing:border-box;}"),y,e=>dp({host:e,getFocusable:()=>e.items,getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),getSelected:()=>e.items.find(t=>t.selected),observe:ri(e)})]});var ai=p(`
#body {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 16px;
  column-gap: 0;
}
:host([type=grid]) #body { display: grid; }
:host([type="two-column-left"]) #body,
:host([type="two-column-right"]) #body,
:host([type="three-column"]) #body,
:host([type="two-column"]) #body {
  row-gap: 32px;
}

:host([type="item"]) #body {
	${yn}
}

${F("small",`
  #body {
    column-gap: 32px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  :host([type="two-column-left"]) #body {
    grid-template-columns: 2fr 1fr;
    column-gap: 64px;
    row-gap: 32px;
  }
  :host([type="three-column"]) #body {
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 32px;
    row-gap: 32px;
  }
  :host([type="four-column"]) #body {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 24px;
    row-gap: 24px;
  }
  :host([type="two-column-right"]) #body {
    grid-template-columns: 1fr 2fr;
    column-gap: 64px;
    row-gap: 32px;
  }
  :host([type="two-column"]) #body {
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
    row-gap: 32px;
  }
`)}
${F("large",`
  #body {
    width: 100%;
    max-width: 1200px;
  }

  :host([center]) #body {
    margin-left: auto;
    margin-right: auto;
  }
`)}
:host { display:block }
:host([type=block]) #body { display: block }
:host([full]) #body { width:auto;max-width:none }
`),mo=class extends m{type;center=!1;full=!1};s(mo,{init:[h("type"),h("center"),h("full")]});var Uo=class extends mo{};s(Uo,{tagName:"c-layout",augment:[ai,()=>x("div",{id:"body",part:"body"},x("slot"))]});var li=p(`
:host { padding: 96px 16px; }
:host([dense]) { padding-top: 48px;padding-bottom:48px; }
${F("medium",":host {padding-left:32px;padding-right:32px}")}
${F("large",":host {padding-left:64px;padding-right:64px}")}
	`),si=class extends Uo{dense=!1;color;center=!0;type="block"};s(si,{tagName:"c-section",init:[h("dense"),le("color")],augment:[li]});var ci=class extends mo{dense=!1;color;center=!0;type="block"};s(ci,{tagName:"c-hero",init:[h("dense"),le("color")],augment:[li,ai,p(`
:host {
	box-sizing: border-box;
	display: block;
}
#body {
	row-gap: 24px;
}
::slotted(c-t:first-child) {
	max-width: 820px;
}
::slotted(p) {
	max-width: 720px;
	margin: 0;
	${C("body-large")}
}
		`),()=>x("div",{id:"body",part:"body"},x("slot"))]});var pi=class extends m{pad;vertical=!1};s(pi,{tagName:"c-hr",init:[h("pad"),h("vertical")],augment:[E("separator"),p(`
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
${nt.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});function mi(e){let t=document.createElement("style");return u(Q(o=>{let n=e.persistkey&&rr.get(e.persistkey);n!==void 0?e.open=n===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),o.signal.subscribe(()=>t.remove())}),$t(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let o=e.open?e.themeon:e.themeoff;e.persistkey&&rr.set(e.persistkey,o),Ga(Wa[o]||o)}),I(e).tap(()=>e.open=!e.open))}var ui=class extends m{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};s(ui,{tagName:"c-toggle-theme",init:[f("persistkey"),f("usepreferred"),f("open"),f("themeon"),f("themeoff")],augment:[E("group"),mi]});var di=class extends De{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};s(di,{tagName:"c-icon-toggle-theme",init:[f("persistkey"),f("usepreferred"),f("open"),f("themeon"),f("themeoff")],augment:[mi,e=>V(d(e,"iconon"),d(e,"iconoff"),d(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var fp=e=>{let t;function o(){let n=document.adoptedStyleSheets.indexOf(t);n!==-1&&document.adoptedStyleSheets.splice(n,1)}addEventListener("message",n=>{if(n.source!==parent||n.origin!==e)return;let r=n.data.theme;o(),typeof r=="string"&&(t=new CSSStyleSheet,t.replace(r).catch(i=>console.error(i)),document.adoptedStyleSheets.push(t))})},gp=e=>{let t=()=>{let o=()=>{parent.postMessage({height:document.documentElement.scrollHeight},e==="null"?"*":e)};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(o).observe(document.documentElement)},n=>console.error(n))})};document.readyState==="complete"?t():addEventListener("load",t)},fi=class extends m{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=se("iframe",{loading:"lazy"})};s(fi,{tagName:"c-iframe",init:[f("src"),f("srcdoc"),f("sandbox"),f("handletheme")],augment:[p(`
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
	`),e=>{let t=e.iframe,o=se("slot",{name:"loading"}),n=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(n),o.style.display="none";function r(c){n.replaceSync(":host{height:"+c+"px}"),t.style.height="100%",t.style.opacity="1",o.style.display="none"}function i(c){if(c){let l=JSON.stringify(e.ownerDocument.location.origin),g=`<script type="module">
(${gp.toString()})(${l});
(${fp.toString()})(${l});
<\/script>`;t.srcdoc=`${e.reset}${c}${g}`,o.style.display=""}}async function a(c){let l=new URL(c);return`${l.search||l.hash?`<script>history.replaceState(0,0,'about:srcdoc${l.search}${l.hash}');<\/script>`:""}<base href="${c}" />`+await fetch(c).then(g=>g.text())}return A(e).append(t,o),u(V(d(e,"srcdoc"),d(e,"src")).raf(([c,l])=>{(async()=>{i(l?await a(l):c)})().catch(()=>{})}),b(window,"message").tap(c=>{let l=c.data.height;c.source===t.contentWindow&&typeof l=="number"&&r(l)}),d(e,"handletheme").switchMap(c=>c?b(t,"load").switchMap(()=>Jt.raf(l=>{let g=l?.css??"",v=e.ownerDocument.location.origin,w=v==="null"||t.hasAttribute("sandbox")&&!t.sandbox.contains("allow-same-origin")?"*":v;t.contentWindow?.postMessage({theme:g},w)})):T),d(e,"sandbox").tap(c=>c===void 0?t.removeAttribute("sandbox"):t.sandbox.value=c))}]});var xp=oo({"input.clear":"Clear input value"}),gi=class extends De{icon="close"};s(gi,{tagName:"c-input-clear",augment:[e=>Na(e,xp("input.clear")),e=>so(e).switchMap(t=>I(e).tap(()=>t.value=""))]});function hp(e,t){return t.style.width="0",t.style.overflow="hidden",t.parentNode||e.append(t),u(u(b(t,"input"),b(t,"change")).map(o=>{if(o.stopPropagation(),e.dispatchEvent(new Event(o.type,{bubbles:!0})),t.files)return Array.from(t.files)}),I(e).tap(()=>t.click()).ignoreElements(),As(e).map(o=>{if(o.stopPropagation(),o.dataTransfer?.files.length)return Array.from(o.dataTransfer.files)}))}var xi=class extends lo{value=void 0;inputEl=se("input",{tabIndex:-1,type:"file"})};s(xi,{tagName:"c-input-file",init:[_("value")],augment:[q,y,e=>{let t=e.inputEl;return t.setAttribute("form","__cxl_ignore__"),e.append(t),u(cr(e),hp(e,t).tap(o=>{e.value=o}))}]});var hi=class e extends Pe{value=void 0;formatter=bp;inputEl=x("input",{className:"input"});static{s(e,{init:[f("value")],augment:[y,t=>t.append(t.inputEl),t=>Xe({host:t,input:t.inputEl,toText:(o,n)=>o!==void 0&&isNaN(o)?n:t.formatter(o),toValue:o=>{if(o===""){t.setValidity({key:"number",valid:!0});return}let n=Number(o);return t.setValidity({key:"number",valid:!isNaN(n)}),n}})]})}},bi=class extends hi{};s(bi,{tagName:"c-input-number",augment:[...Lr]});function bp(e){return e===void 0||isNaN(e)?"":e.toString()}var Ds=class e extends Pe{value="";inputEl=x("input",{type:"password",className:"input"});static{s(e,{tagName:"c-input-password",init:[f("value")],augment:[...Po,t=>t.append(t.inputEl),t=>Xe({host:t,input:t.inputEl})]})}};var yi=class extends m{};s(yi,{tagName:"c-input-placeholder",augment:[p(`
:host {
	display: inline-block;
	pointer-events: var(--cxl-override-pointer-events, none);
	color: var(--cxl-color-on-surface-variant);
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
	`),y,e=>{let t=wn(e);return so(e).switchMap(o=>u(ne(o),d(o,"value"),d(o,"inputValue")).raf(()=>{let n=o.inputValue??o.value,r=n===void 0||n==="";t.replaceSync(`:host{top:${o.offsetTop}px;left:${o.offsetLeft}px;width:${o.offsetWidth}px;height:${o.offsetHeight}px;${r?"":"display:none;"}`)}))}]});var vi=class extends m{};s(vi,{tagName:"c-kbd",augment:[p(`
:host {
	box-sizing: border-box;
	display: inline-block;
	padding: 2px 8px;
	border-radius: var(--cxl-shape-corner-small);
	${Z("surface-container-high")}
	${C("code")}
	border: 1px solid var(--cxl-color-outline-variant);
	box-shadow: var(--cxl-elevation-1);
}
		`),y]});function Is(e,t){return e?typeof e=="string"?(t.setAttribute("aria-label",e),T):ut(e).tap(o=>{e.textContent&&t.setAttribute("aria-labelledby",o)}).finalize(()=>{t.removeAttribute("aria-labelledby")}):T}var Ti=class extends m{};s(Ti,{tagName:"c-label",augment:[p(`
:host {
	display: inline-block;
}`),y,e=>Ar(e).switchMap(t=>"input"in t?d(t,"input").switchMap(o=>o?Is(e,o):T):Is(e,t)),e=>Q(()=>{e.slot="label"})]});var wi=class extends m{items=[]};s(wi,{tagName:"c-list",augment:[p(":host{display:block;padding:8px 0;}"),E("listbox"),y,Pn]});var yp=p(`
:host {
	position: fixed;
	margin: 0;
	padding: 0;
	outline: 0;
	border: 0;
	display: block;
	border-radius: var(--cxl-shape-corner-xsmall);
	box-shadow: var(--cxl-elevation-2);
	${Z("surface-container")}
}
::backdrop { overflow: hidden; }
:host([static]) { position: static; }
	`);function vp(e){function t(){e.exclusive&&!e.static&&fe.popupOpened({element:e,close:()=>e.open=!1}),e.static||(e.popover??="auto",e.showPopover())}return d(e,"open").switchMap(o=>o?(t(),u(b(e,"keydown").tap(n=>{n.key==="Escape"&&(e.open=!1,e.returnTo?.focus(),n.preventDefault(),n.stopPropagation())}),b(e,"toggle").tap(n=>{let r=n.newState==="open";r||(e.open=r)}),P(e,"open").tap(n=>{!n&&e.popover&&e.hidePopover()}),b(e,"close").tap(n=>{n.target===e&&e.popover&&e.hidePopover()}))):T)}var Yo=class extends Ue{exclusive=!0;static=!1;trigger;returnTo};s(Yo,{tagName:"c-popup",init:[f("exclusive"),h("static")],augment:[y,eo,yp,rt,vp]});var Ei=class extends Yo{"motion-in"="fadeIn";"motion-out"="fadeOut";items=[];focusstart;setFocus(){let t=At(this)?.activeElement;if(!(t&&this.contains(t))){if(this.focusstart==="selected"){let o=this.items.find(n=>n.selected);if(o){o.focus();return}}this.items[0]?.focus()}}};s(Ei,{tagName:"c-menu",init:[f("focusstart")],augment:[E("menu"),p(vn()),Pn,e=>d(e,"open").tap(t=>{t&&e.setFocus()})]});var Xo=[p(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${C("label-large")}
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
${ot("slot::after")}
	`),j,as,y],_o=class extends We{size};s(_o,{tagName:"c-nav-item",init:[te("size",e=>`{min-height:${56+e*8}px}`)],augment:[E("option"),...Xo]});var ki=class extends We{icon="arrow_drop_down";open=!1;target;size};s(ki,{tagName:"c-nav-dropdown",init:[f("icon"),f("target"),h("open"),te("size",e=>`{min-height:${56+e*8}px}`)],augment:[E("treeitem"),...Xo,p(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>Lt(e).raf(({target:t,open:o})=>t.open=o),e=>{let t=x(ge,{className:"icon"});return A(e).append(t),u(d(e,"icon").tap(o=>t.name=o))}]});var Wo=class extends ht{icon="more_vert";motion};s(Wo,{tagName:"c-toggle-icon",init:[f("icon")],augment:[e=>{let t;return u(d(e,"icon").raf(o=>{if(!o)return t?.remove();t=Zt(o),A(e).append(t)}),d(e,"open").raf(()=>{t&&e.motion&&be({target:t,animation:e.motion,options:{direction:e.open?"normal":"reverse",fill:"both"}})}))}]});var Ci=class extends We{icon="arrow_right";open=!1;target;size};s(Ci,{tagName:"c-nav-tree-item",init:[f("icon"),f("target"),h("open"),te("size",e=>`{min-height:${56+e*8}px}`)],augment:[E("treeitem"),...Xo,p(`
:host { padding-inline-start: 20px; }
.icon { position: absolute; inset-inline-start: 0px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x(Wo,{className:"icon"});A(e).append(t);function o(n){if(Array.isArray(n)){for(let r of n)if(r.childNodes.length)return!0}else if(n?.childNodes.length)return!0;return!1}return u(d(e,"icon").tap(n=>t.icon=n),d(e,"open").tap(n=>{e.ariaExpanded=String(n),t.open=n}),d(e,"target").switchMap(()=>{let n=Cn(e),r=o(n);return t.style.display=r?"":"none",t.target=n,n?Ia(e,Array.isArray(n)?n:[n]):T}),d(t,"open").tap(n=>e.open=n),b(e,"keydown").tap(n=>{n.key==="ArrowRight"?e.open=!0:n.key==="ArrowLeft"&&(e.open=!1)}))}]});var Si=class extends Co{};s(Si,{tagName:"c-nav-target",augment:[E("group"),p(":host{display:block;padding-inline-start:12px;}")]});var Mi=class extends m{};s(Mi,{tagName:"c-nav-headline",augment:[p(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),y]});var qo=class extends De{open=!1;target;icon="menu"};s(qo,{tagName:"c-navbar-toggle",init:[f("target"),_("open")],augment:[e=>Lt(e).tap(({target:t,open:o})=>t.open=o)]});var fo=class extends Dt{duration=4e3;"motion-in"="slideInUp,fadeIn";"motion-out"="fadeOut";open=!1;static=!1};s(fo,{tagName:"c-snackbar",init:[h("open"),he("duration"),f("motion-in"),f("motion-out"),f("static")],augment:[p(`
:host {
	display: inline-flex;
	justify-content: left;
	margin: 16px auto;
	border: 0; outline: 0;
	top: auto;
}
slot[name=action] { margin-inline-start: auto; display: block; }
	`),()=>x("slot",{name:"action"}),e=>d(e,"open").tap(t=>{t&&!e.static&&(e.popover="manual",e.showPopover())}),eo,rt,e=>b(e,"close").tap(()=>e.remove())]});var $o=class extends m{queue=[];notify(t){let o;return typeof t=="string"?o=x(fo,void 0,t):t instanceof HTMLElement?o=t:o=x(fo,t,t.content),new Promise(n=>{this.queue.push([o,n]),this.queue.length===1&&this.queue[0]&&this.notifyNext(this.queue[0])})}notifyNext([t,o]){let n=()=>{this.queue.shift(),t.removeEventListener("close",n),o(),this.queue[0]&&this.notifyNext(this.queue[0])};this.shadowRoot?.append(t),t.addEventListener("close",n),t.open=!0}};s($o,{tagName:"c-snackbar-container",augment:[p(`
:host {
	position:relative; width: 100%; height: 0;
	display: flex; text-align:center; align-items: end;
	overflow: visible;
}`)]});var Ps;function Hw(e){let t;return typeof e=="string"?e={content:e}:e instanceof HTMLElement||(t=e.container),t||(t=Ps??=new $o,t.parentNode||document.body.appendChild(t)),t.notify(e)}function Kw(e){Ps=e}var Ai=class extends m{};s(Ai,{tagName:"c-page",augment:[An,p(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${Z("background")}
}`),y]});var Go=class extends m{xs=!1;sm=!1;md=!1;lg=!1;xl=!1};s(Go,{tagName:"c-r",init:[h("xl"),h("lg"),h("md"),h("sm"),h("xs")],augment:[p(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${F("small",':host([sm]){display:contents}:host([sm="0"]){display:none}')}
${F("medium",':host([md]){display:contents}:host([md="0"]){display:none}')}
${F("large",':host([lg]){display:contents}:host([lg="0"]){display:none}')}
${F("xlarge",':host([xl]){display:contents}:host([xl="0"]){display:none}')}
	`),y]});var Ht=class extends jo{};s(Ht,{tagName:"c-toolbar",augment:[p(`
:host {
	grid-column: 1 / -1;
	column-gap: 24px;
	row-gap: 8px;
	align-items: center;
	min-height: 48px;
	flex-wrap: wrap;
	flex-shrink: 0;
}
${F("small",":host{column-gap:24px}")}
		`)]});var Oi=class extends m{};s(Oi,{tagName:"c-page-appbar",augment:[p(`
:host { display: contents; }
#appbar { padding-top: 20px; padding-bottom: 20px; }
#toolbar { max-width: 1200px; width: 100%; margin: auto; gap: 16px; }
${F("small","#toolbar { gap: 24px; }")}
		`),e=>{let t=se(Vo,{id:"drawer"},se("nav",void 0,se("slot",{name:"navbar"})));return se(Mo,{$:()=>Oa(e,"toggle.close",t,!0),id:"appbar",sticky:!0},se(Ht,{id:"toolbar"},se(Go,{xs:!0,md:0},se(qo,{ariaLabel:"Toggle navigation menu",target:t})),se("slot")),t)}]});var Li=class extends m{value=1/0;color},Fs={duration:2e3,iterations:1/0,easing:"cubic-bezier(0.4, 0, 0.6, 1)"};s(Li,{tagName:"c-progress",init:[f("value"),le("color","primary",".bar")],augment:[E("progressbar"),Gt("valuemax","1"),p(`
:host {
	position:relative;
	display:block; height: 4px; 
	background-color:var(--cxl-color-secondary-container);
	border-radius: 2px; overflow:hidden;
	border-inline-end: 4px solid var(--cxl-color-primary);
}
:host([indeterminate]) { border-inline-end: 0; }
.bar { height: 100%; will-change: transform; }
:host(:not([indeterminate])) .bar { transform-origin: left center; }
:host(:dir(rtl):not([indeterminate])) .bar { transform-origin: right center; }
	`),e=>{let t,o,n=x("div",{className:"bar"}),r=x("div",{className:"bar"});return A(e).append(n,r),d(e,"value").tap(i=>{i!==1/0&&i>1?i=1:i<0&&(i=0),e.ariaValueNow=i===1/0?null:String(i),e.ariaBusy=String(i!==1),e.toggleAttribute("indeterminate",i===1/0),i===1/0?(t=be({target:n,animation:{kf:{transform:["translateX(-100%) scaleX(0.3)","translateX(0%) scaleX(0.8)","translateX(100%) scaleX(0.3)"]},options:Fs}}),o=be({target:r,animation:{kf:{transform:["translate(-150%, -100%) scaleX(0.4)","translate(-50%, -100%) scaleX(0.6)","translate(100%, -100%) scaleX(0.4)"]},options:Fs}})):(t?.cancel(),o?.cancel()),n.style.transform=i===1/0?"":"scaleX("+i+")"})},no]});var Ri=class extends m{value=1/0};s(Ri,{tagName:"c-progress-circular",init:[he("value")],augment:[E("progressbar"),Gt("valuemax","1"),p(`
:host {
	display: inline-block;
	width: 48px;
	height: 48px;
}
svg { width: 100%; height: 100% }
		`),e=>{let t=io("svg",{viewBox:"0 0 100 100"}),o=io("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-secondary-container);fill:transparent;stroke-width:10%;stroke-dasharray:282.743px"}),n=io("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-primary);fill:transparent;transition:stroke-dashoffset var(--cxl-speed);stroke-width:10%;transform-origin:center;stroke-dasharray:282.743px"});return t.append(o,n),A(e).append(t),d(e,"value").switchMap(r=>{if(e.ariaValueNow=r===1/0?null:String(r),e.ariaBusy=String(r!==1),r!==1/0){let a=282.743-282.743*Math.max(0,Math.min(1,r));n.style.strokeDashoffset=`${a}px`,n.style.transform="rotate(-90deg)"}return r===1/0?u(Eo({target:e,animation:"spin",options:{iterations:1/0,duration:2e3,easing:"linear"}}),Eo({target:n,animation:{options:{duration:4e3,iterations:1/0,easing:"cubic-bezier(.35,0,.25,1)"},kf:((i,a)=>[{offset:0,strokeDashoffset:i,transform:"rotate(0)"},{offset:.125,strokeDashoffset:a,transform:"rotate(0)"},{offset:.12501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.25,strokeDashoffset:i,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.2501,strokeDashoffset:i,transform:"rotate(270deg)"},{offset:.375,strokeDashoffset:a,transform:"rotate(270deg)"},{offset:.37501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5,strokeDashoffset:i,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5001,strokeDashoffset:i,transform:"rotate(180deg)"},{offset:.625,strokeDashoffset:a,transform:"rotate(180deg)"},{offset:.62501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.75,strokeDashoffset:i,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.7501,strokeDashoffset:i,transform:"rotate(90deg)"},{offset:.875,strokeDashoffset:a,transform:"rotate(90deg)"},{offset:.87501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(341.5deg)"},{offset:1,strokeDashoffset:i,transform:"rotateX(180deg) rotate(341.5deg)"}])((282.743*(1-.05)).toString(),(282.743*(1-.8)).toString())}})):T})},no]});function Ni({source:e,renderFn:t,loading:o,error:n}){return xn(()=>{let r=new uo,i=!1;return[u(o?Ze(750).tap(()=>{i||r.insert(o())}):T,e.tap(a=>{i=!0,r.empty();let c=t(a);c&&r.insert(c)}).catchError(a=>{if(i=!0,n)return r.empty(),r.insert(n(a)),T;throw a})),r.end]})}function Hs(e,t,o=()=>x(ge,{name:"star",fill:!0})){let n=[],r,i=0;for(;i<e;i++)r=o(i),r.classList.add(t),n.push(r);if(e!==i){let a=e+1-i;if(r&&a){let c=`${a*100}%`;r.style.clipPath=`polygon(0 0, ${c} 0, ${c} 100%, 0 100%)`}}return n}var Di=class extends m{max=5;rating=0;alt};s(Di,{tagName:"c-rating",init:[he("max"),he("rating"),h("alt")],augment:[E("img"),p(`
:host {
  display: inline-block;
  position: relative;
  color: #faaf00;
  stroke: currentColor;
}
.group {
  position: absolute;
  left: 0;
  top: 0;
}
.bgstar {
  color: var(--cxl-color-outline-variant);
}
	`),e=>Ni({source:d(e,"max"),renderFn:()=>x("span",void 0,...Hs(e.max,"bgstar"))})(e),e=>Ni({source:d(e,"rating"),renderFn:t=>x("span",{className:"group"},...Hs(Number(t)>e.max?e.max:Number(t),"star"))})(e)]});var Tp=/([^&=]+)=?([^&]*)/g,wp=/:([\w$@]+)/g,Ep=/\/\((.*?)\)/g,kp=/(\(\?)?:\w+/g,Cp=/\*\w+/g,Sp=/[-{}[\]+?.,\\^$|#\s]/g,Vi="@@cxlRoute",Fe={location:window.location,history:window.history};function Mp(e){let t=[];return[new RegExp("^/?"+e.replace(Sp,"\\$&").replace(Ep,"\\/?(?:$1)?").replace(kp,function(n,r){return t.push(n.slice(1)),r?n:"([^/?]*)"}).replace(Cp,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function Ap(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function Ii(e,t){return t?e.replace(wp,(o,n)=>t[n]||""):e}function Op(e){let t={},o;for(;o=Tp.exec(e);)o[1]!==void 0&&(t[o[1]]=decodeURIComponent(o[2]??""));return t}var Pi=class{path;regex;parameters;constructor(t){this.path=t=Ap(t),[this.regex,this.parameters]=Mp(t)}_extractQuery(t){let o=t.indexOf("?");return o===-1?{}:Op(t.slice(o+1))}getArguments(t){let n=this.regex.exec(t)?.slice(1);if(!n)return;let r=this._extractQuery(t);return n.forEach((i,a)=>{let c=a===n.length-1?i||"":i?decodeURIComponent(i):"",l=this.parameters[a];l&&(r[l]=c)}),r}test(t){return this.regex.test(t)}toString(){return this.path}},Fi=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new Pi(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${crypto.randomUUID()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let o=this.definition.render();return o[Vi]=this,Object.assign(o,t),o}},Hi=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(o=>o.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(o=>o.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function Lp(e){return e[Vi]}function Ki(e,t){let o=new URL(e,`http://localhost/${t}`);return{path:o.pathname.slice(1),hash:o.hash.slice(1)}}var Rp={getHref(e){return`${Fe.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Jo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&Fe.history.pushState({url:e},"",o)}},deserialize(){return{path:Fe.location.search.slice(1),hash:Fe.location.hash.slice(1)}}};function Jo(){return Fe.history.state}var Np={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Jo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&Fe.history.pushState({url:e},"",o||"/")}},deserialize(){return{path:Fe.location.pathname,hash:Fe.location.hash.slice(1)}}},Ks={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Ks.getHref(e);Fe.location.hash!==t&&(Fe.location.hash=t)},deserialize(){return Ki(Fe.location.hash.slice(1),"")}},go={hash:Ks,path:Np,query:Rp},Bi=class{constructor(t){this.callbackFn=t}callbackFn;state;routes=new Hi;instances={};root;lastGo;getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let o=new Fi(t);return this.routes.register(o),o}go(t){this.lastGo=t;let o=this.state?.url,n=typeof t=="string"?Ki(t,o?.path??""):t,r=n.path;if(r!==o?.path){let i=this.routes.findRoute(r);if(!i)throw new Error(`Path: "${r}" not found`);let a=i.path?.getArguments(r);if(i.redirectTo)return this.go(Ii(i.redirectTo,a));let c=this.execute(i,a);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${r}" could not be created`);this.updateState({url:n,arguments:a,route:i,current:c,root:this.root})}else this.state&&n.hash!==o.hash&&this.updateState({...this.state,url:n})}getPath(t,o){let r=this.routes.get(t)?.path;return r&&Ii(r.toString(),o)}isActiveUrl(t){let o=this.state?.url;if(!o)return!1;let n=Ki(t,o.path);return!!Object.values(this.instances).find(r=>{let i=r[Vi],a=this.state?.arguments;if(i?.path?.test(n.path)&&(!n.hash||n.hash===o.hash)){if(a){let c=i.path.getArguments(n.path);for(let l in c)if(a[l]!==c[l])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,o){let n=this.instances[t];return n&&Object.assign(n,o),n}executeRoute(t,o,n){let r=t.parent,i=r&&this.routes.get(r),a=t.id,c=i&&this.executeRoute(i,o,n),l=this.findRoute(a,o)||t.create(o);return c?c.isSameNode(l.parentNode)||c.appendChild(l):this.root=l,n[a]=l,l}discardOldRoutes(t){let o=this.instances;for(let n in o){let r=o[n];r&&t[n]!==r&&(r.parentNode?.removeChild(r),delete o[n])}}execute(t,o){let n={},r=this.executeRoute(t,o||{},n);return this.discardOldRoutes(n),this.instances=n,r}},vt=new Yt,Bs=new Yt,ae=new Bi(()=>vt.next());function D0(e){return t=>{let o=typeof e=="string"?{path:e}:e;ae.route({...o,render:()=>new t})}}function I0(e=""){return t=>{let o=typeof e=="string"?{path:e}:e;ae.route({...o,isDefault:!0,render:()=>new t})}}function P0(e){return vt.map(()=>ae.isActiveUrl(e))}function Dp(e){let t=e;for(;t;){let o=t instanceof HTMLElement&&t.scrollHeight>t.clientHeight?t:null;if(o&&o.scrollTop!==0){o.scrollTo(0,0);return}if(t.assignedSlot){t=t.assignedSlot;continue}if(t.parentElement){t=t.parentElement;continue}let n=t.getRootNode();t=n instanceof ShadowRoot?n.host:null}}function ji(e){let t;return vt.tap(()=>{let{root:o}=ae.getState();o.parentNode!==e?e.appendChild(o):t&&t!==o&&t.parentNode&&e.removeChild(t),t=o}).raf(()=>{let o=ae.getState().url;o.hash?e.querySelector(`#${o.hash},a[name="${o.hash}"]`)?.scrollIntoView():Jo()?.lastAction!=="pop"&&e.parentElement&&Dp(e)})}function zs(e,t=go.query){return u(Q(()=>{Bs.next(t)}),e.tap(()=>ae.go(t.deserialize())),vt.tap(()=>t.serialize(ae.getState().url))).catchError(o=>{if(o instanceof Error&&o.name==="SecurityError")return T;throw o})}function Ip(){return vt.switchMap(()=>{let e=ae.getState(),t=[],o=e.current;do{let n=o.routeTitle;n&&t.unshift(n instanceof M?n:L(n))}while(o=o.parentNode);return V(...t)}).tap(e=>document.title=e.join(" - "))}function Vs(){return Qe(L(location.hash.slice(1)),b(window,"hashchange").map(()=>location.hash.slice(1)))}var Fn;function Pp(){if(!Fn){Fn=new bo(history.state);let e=history.pushState;history.pushState=function(...t){let o=e.apply(this,t),n=Jo();return n&&(n.lastAction="push",Fn?.next(n)),o}}return u(b(window,"popstate").map(()=>{let e=Jo();return e&&(e.lastAction="pop",e)}),Fn)}function js(){let e;return u(Vs(),Pp()).map(()=>window.location).filter(t=>{let o=t.href!==e;return e=t.href,o})}function Fp(e,t=go.query,o){let n=typeof t=="string"?go[t]:t,r=o||(n===go.hash?Vs():js());return u(ji(e),zs(r,n),Ip())}function F0(e=go.query,t){return o=>Fp(o,e,t)}var H0=vt.raf().map(()=>{let e=[],t=ae.getState(),o=t.current;do o.routeTitle&&e.unshift({title:o.routeTitle,first:o===t.current,path:Hp(o)});while(o=o.parentNode);return e});function Hp(e){let t=Lp(e);return t&&Ii(t.path?.toString()||"",ae.state?.arguments||{})}function K0(e){return I(e).tap(t=>{t.preventDefault(),e.external?location.assign(e.href):ae.go(e.href)})}function Hn(e,t,o=t){return u(V(Bs,$t(e)).tap(([n])=>{e.href!==void 0&&(t.href=e.external?e.href:n.getHref(e.href)),t.target=e.target||""}),I(t).tap(n=>{e.target||n.preventDefault()}),I(o).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):ae.go(e.href))}))}function Kp(e,t){let o=document.createElement("div");return o.style.display="contents",Object.assign(o,{routeTitle:t}),o.appendChild(e.content.cloneNode(!0)),o}var zi=class extends m{strategy="query";get state(){return ae.state}go(t){return ae.go(t)}};s(zi,{tagName:"c-router",init:[f("strategy")],augment:[e=>{function t(o){let n=o.dataset;if(n.registered)return;n.registered="true";let r=n.title||void 0;ae.route({path:n.path,id:n.id||void 0,parent:n.parent||void 0,isDefault:o.hasAttribute("data-default"),redirectTo:n.redirectto,render:Kp.bind(null,o,r)})}return et().switchMap(()=>{for(let o of Array.from(e.children))o instanceof HTMLTemplateElement&&t(o);return u(sn(e).tap(o=>{o.type==="added"&&o.value instanceof HTMLTemplateElement&&t(o.value)}),d(e,"strategy").switchMap(o=>{let n=go[o];return zs(js(),n).catchError((r,i)=>(console.error(r),i))}))})}]});function Yi(e,t=e){return u(Bp(e,t).ignoreElements(),vt.map(()=>e.href!==void 0&&ae.isActiveUrl(e.href)))}function Bp(e,t=e){let o=x("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return o.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,A(e).append(o),u(Hn(e,o),b(o,"click").tap(n=>{n.stopPropagation(),To(n)||e.dispatchEvent(new PointerEvent(n.type,n)),ee(e,"drawer.close",void 0)}),I(t).tap(n=>{To(n)&&o.click()}))}var Ui=class extends m{href};s(Ui,{tagName:"c-router-selectable",init:[f("href")],augment:[q,()=>x("slot"),e=>Y(()=>{let t=e.parentElement;if(!t||!("selected"in t))throw new Error("Invalid selectable parent");return Yi(e,t).raf(o=>{t.selected=o})})]});var _i=class extends _o{href;external=!1;target};s(_i,{tagName:"c-router-item",init:[f("href"),f("external"),f("target")],augment:[e=>Yi(e).tap(t=>{e.selected=t})]});var Qo=class extends m{href;focusable=!1;external=!1;dismiss=!1;target};s(Qo,{tagName:"c-router-link",init:[f("href"),f("focusable"),f("external"),f("target"),f("dismiss")],augment:[p(`
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
	`),e=>{let t=x("a",{className:"link"},x("slot"));return A(e).append(t),u(d(e,"focusable").tap(o=>t.tabIndex=o?0:-1),Sn(e),Hn(e,t))}]});var Xi=class extends Qo{focusable=!0};s(Xi,{tagName:"c-router-a",augment:[p(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var Wi=class extends m{};s(Wi,{tagName:"c-router-outlet",init:[],augment:[E("main"),q,ji,y]});function $i(e,t,o){let n=e[t];return o?-n:n}function zp(e,t,o,n){e[t]=o?-n:n}function Vp(e,t){return e==="x"&&getComputedStyle(t).direction==="rtl"}function qi(e,t){return Number.isFinite(e)&&e>0?e:t}function Gi(e,t){if(!Number.isSafeInteger(e)||e<0)throw new Error(`${t} must be a non-negative safe integer.`)}function Ys(e){let t=e.estimateSize??50;if(!Number.isFinite(t)||t<=0)throw new Error("estimateSize must be a positive finite number.");let o=e.overscan??0;if(!Number.isFinite(o)||o<0)throw new Error("overscan must be a non-negative finite number.");return Gi(e.dataLength,"dataLength"),{estimateSize:t,overscan:o}}function Us(e){let t=e>>>0;if(t!==0)return(t&-t)>>>0;let o=Math.floor(e/4294967296);return((o&-o)>>>0)*4294967296}var Ji=class{constructor(t,o){this.length=t;this.estimate=o}length;estimate;tree=new Map;measured=new Map;totalDelta=0;get totalSize(){return this.length*this.estimate+this.totalDelta}get(t){return this.measured.get(t)??this.estimate}update(t,o){if(t<0||t>=this.length||!Number.isFinite(o)||o<=0)return!1;let n=this.get(t);if(n===o)return!1;o===this.estimate?this.measured.delete(t):this.measured.set(t,o);let r=o-n;return this.totalDelta+=r,this.add(t,r),!0}offsetOf(t){t=Math.max(Math.min(t,this.length),0);let o=0;for(let n=t;n>0;n-=Us(n))o+=this.tree.get(n)??0;return t*this.estimate+o}find(t){if(this.length===0)return{index:0,offset:0};t=Math.max(Math.min(t,this.totalSize),0);let o=0,n=0,r=1;for(;r*2<=this.length;)r*=2;for(;r>=1;r/=2){let i=o+r;if(i>this.length)continue;let a=n+r*this.estimate+(this.tree.get(i)??0);a<=t&&(o=i,n=a)}return o>=this.length?{index:this.length-1,offset:this.get(this.length-1)}:{index:o,offset:t-n}}resize(t){if(t!==this.length){this.length=t;for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}}reset(t=0){for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}add(t,o){for(let n=t+1;n<=this.length;n+=Us(n)){let r=(this.tree.get(n)??0)+o;Math.abs(r)<1e-9?this.tree.delete(n):this.tree.set(n,r)}}rebuild(){this.tree.clear(),this.totalDelta=0;for(let[t,o]of this.measured){let n=o-this.estimate;this.totalDelta+=n,this.add(t,n)}}};function dE(e){let{estimateSize:t,overscan:o}=Ys(e);return Y(()=>_s(e,t,o))}function _s(e,t,o){function n(){wt=S[B];let k=getComputedStyle(S);Et=parseFloat(k[lt])||0,Kt=parseFloat(k[Tt])||0,Ae=Math.max(wt-Et-Kt,0),ct=w==="x"&&k.direction==="rtl",pt=!1}function r(k){let z=k[X];return ct?-z:z}function i(k){throw console.error(`Faulty element detected: 
The provided element has an invalid or unmeasurable size. Check that the "${B}" of the element is not zero or negative. Make sure the element is styled properly and any necessary dimensions are set correctly before rendering.`),console.log(k),new Error("Rendered element size returned invalid value.")}function a(k,z){let W=k[B],$=k[X];if((!Number.isFinite(W)||W<=0||!Number.isFinite($)||!Number.isFinite($+W))&&i(k),k instanceof Element){xo.add(k);let K=$e.get(k);K?(K.index=z,K.rect=k,K.size=W):($e.set(k,{index:z,rect:k,size:W}),Ct?.observe(k))}return k}function c(){for(let k of $e.keys())xo.has(k)||(Ct?.unobserve(k),$e.delete(k))}function l(k,z,W){let $=0,K=-z,U=0,ye=0,He,Ge=0,Oe,zt=0,Ke,ve=0,ke=[],me;k>0&&(me=O(k-1,$++,"pre"));let nn=-z,Le=k,Bn=H.get(k);for(;Le<ue&&(ke.length===0||nn<W);)ke.push(O(Le,$++,"on")),nn+=Math.min(H.get(Le++),Bn);Le<ue&&ke.push(O(Le,$++,"post"));let St=k,Je;me&&(a(me,k-1),Ge=me[B],K=-(H.get(k-1)+z),He=r(me));for(let Re=0;Re<ke.length;Re++){let Vt=ke[Re];if(!Vt)break;let jt=k+Re,ua=a(Vt,jt),ho=r(ua),ma=ua[B];if(ve===0&&(U=ho,He!==void 0)){let zn=ho-He,da=qi(zn,Ge);H.update(k-1,da),K=-(da+z)}if(Oe!==void 0&&Ke!==void 0){let zn=ho-Oe;H.update(Ke,qi(zn,zt))}if(Oe=ho,zt=ma,Ke=jt,ye=ho+ma,ve++,St=jt+1,ye-U-z>=W){Je=ke[Re+1];break}}if(St===ue&&Ke!==void 0)H.update(Ke,zt);else if(Je&&Ke!==void 0&&Oe!==void 0){let Re=a(Je,St),Vt=r(Re)-Oe;H.update(Ke,qi(Vt,zt))}return{count:(k>0?1:0)+ve+(Je?1:0),endPos:ye,index:St,offset:K,rendered:ve,startPos:U}}function g(k,z,W,$){let K=k,U=l(K,z,W);for(;$&&K>0&&U.endPos-U.startPos<Ae;){let ye=Ae-(U.endPos-U.startPos),He=Math.max(Math.ceil(ye/t),U.rendered,1),Ge=Math.max(K-He,0);if(Ge===K)break;K=Ge,U=l(K,0,W)}return{...U,start:K}}function v(){xo.clear(),pt&&n();let k=$i(S,D,ct),z=k-kt;kt=k;let W=Math.max(S[J]-wt,0),$=!Zo&&W>0&&k>=W-1,K=Math.max(Me-Ae,0),U=$?K:W>0?Math.max(Math.min(k/W,1),0)*K:0,ye=o/2,He=o/2;z>0?(ye=o/4,He=o-ye):z<0&&(He=o/4,ye=o-He);let Ge=H.find(U),Oe=H.find(Math.max(U-ye,0)).index,zt=U-H.offsetOf(Oe),Ke=$?1/0:Ae+He,ve=Ge.index,ke=Ge.offset,me=g(Oe,zt,Ke,$);if(!$){for(;ve<ue-1&&ke>=H.get(ve);)ke-=H.get(ve++);ve!==Ge.index&&(Oe=o===0?ve:H.find(Math.max(U-ye,0)).index,me=g(Oe,o===0?ke:U-H.offsetOf(Oe),Ke,$))}let{count:nn}=me,{offset:Le}=me;N?.(nn);let Bn=H.get(ve),St=Math.min(ke,Bn);!$&&me.start===ve&&(Le+=ke-St),me.rendered>0&&$&&(Le=Ae-me.endPos,Le>0&&(Le=0));let Je=H.offsetOf(ve)+St;if($)Me=H.totalSize;else{let jt=H.totalSize;Me=Math.max(jt,Je+Ae+(Je+Ae>=jt?1:0))}let Re=Math.max(Me-Ae,0);$&&(Je=Re);let Vt=Math.min(Math.ceil(Me),qe);return Zo=!1,c(),{dataLength:ue,start:me.start,end:me.index,totalSize:Vt,count:me.rendered,offset:Le,atEnd:$,scrollRatio:Re>0?Je/Re:0}}let{axis:w,scrollElement:S,render:O,refresh:R,remove:N}=e,B=w==="x"?"offsetWidth":"offsetHeight",X=w==="x"?"offsetLeft":"offsetTop",D=w==="x"?"scrollLeft":"scrollTop",J=w==="x"?"scrollWidth":"scrollHeight",lt=w==="x"?"paddingLeft":"paddingTop",Tt=w==="x"?"paddingRight":"paddingBottom",qe=5e6,ue=e.dataLength,H=new Ji(ue,t),Me=H.totalSize,wt=0,Ae=0,Et=0,Kt=0,ct=!1,Zo=!0,pt=!0,kt=NaN,Bt=!1,Ct,xo=new Set,$e=new Map,en=new M(k=>{Ct=new ResizeObserver(z=>{if(!Bt)return;let W=!1;for(let $ of z){let K=$e.get($.target);if(!K)continue;let U=K.rect[B];if(!Number.isFinite(U)||U<=0||U===K.size)continue;let ye=H.get(K.index)+U-K.size;K.size=U,W=H.update(K.index,ye)||W}W&&(Me=H.totalSize,kt=NaN,k.next())}),k.signal.subscribe(()=>{Ct?.disconnect(),Ct=void 0,$e.clear()})}),tn=b(S,"scroll",{passive:!0}),on=u(R?.tap(k=>{k?.dataLength!==void 0&&(Gi(k.dataLength,"dataLength"),k.resetFrom!==void 0&&Gi(k.resetFrom,"resetFrom"),ue=k.dataLength,H.resize(ue),k.resetFrom!==void 0&&H.reset(Math.max(Math.min(k.resetFrom,ue),0)),Me=H.totalSize,pt=!0),kt=NaN})??T,un(S).tap(k=>{Bt=k,k&&(pt=!0)}),ne(S).tap(()=>pt=!0),en,tn).filter(()=>Bt);return new M(k=>{let z=0;on.subscribe({next(){z||(z=requestAnimationFrame(()=>{if(z=0,!(!pt&&kt===$i(S,D,ct)))try{k.next(v())}catch(W){k.error(W)}}))},error:k.error,signal:k.signal}),k.signal.subscribe(()=>{z&&cancelAnimationFrame(z)})})}function fE(e){let{axis:t,host:o,translate:n=!0}=e,r=e.scrollElement||o.parentElement;if(!r)throw"scrollElement option could not be resolved.";let{estimateSize:i,overscan:a}=Ys(e),c=t==="x"?"scrollLeft":"scrollTop",l=t==="x"?"scrollWidth":"scrollHeight",g=t==="x"?"clientWidth":"clientHeight",v=t==="x"?"width":"height";return Y(()=>{let w=o.style.position,S=o.style.top,O=o.style.left,R=o.style.translate,N=document.createElement("div");N.style.position="absolute",N.style.width=N.style.height="1px",N.style.top=N.style.left="0",(e.scrollContainer??r).appendChild(N),o.style.position="sticky",o.style.top=o.style.left="0";let B=o.style.position,X=o.style.top,D=o.style.left,J=o.style.translate;n&&(o.style.translate="0 0",J=o.style.translate);let lt=0,Tt=!1,qe=NaN,ue=e.dataLength,H=!1,Me=Vp(t,r),wt=()=>$i(r,c,Me),Ae=Et=>zp(r,c,Me,Et);return _s({...e,scrollElement:r},i,a).tap(({dataLength:Et,totalSize:Kt,offset:ct,atEnd:Zo,scrollRatio:pt})=>{let kt=wt();lt!==Kt&&(N.style[v]=`${Kt}px`,lt=Kt);let Bt=Number.isNaN(qe)?0:kt-qe,Ct=Bt<-1,xo=Bt>1,$e=Et!==ue;if(Ct&&!$e&&(H=!1),n){if(ct!==0){let k=Me?-ct:ct;o.style.translate=t==="x"?`${k}px 0`:`0 ${k}px`,Tt=!0}else Tt&&(o.style.translate="0 0",Tt=!1);J=o.style.translate}let en=Math.max(r[l]-r[g],0),tn=Zo&&($e||H||xo||Number.isNaN(qe));tn&&(n&&(o.style.translate="0 0",Tt=!1,J=o.style.translate),H=!0);let on=tn?en:pt*en;Math.abs(wt()-on)>.5&&Ae(on),ue=Et,qe=wt()}).finalize(()=>{N.remove(),o.style.position===B&&(o.style.position=w),o.style.top===X&&(o.style.top=S),o.style.left===D&&(o.style.left=O),n&&o.style.translate===J&&(o.style.translate=R)})}).share()}function jp(e){return Math.min(Math.max(e,0),1)}function Up(e,t){return Wt(e).filter(o=>{let n=e.value,r=o.shiftKey?10:o.ctrlKey||o.altKey?.1:1,i=e.step*r;if(o.key==="Home")t(0);else if(o.key==="End")t(1);else if(o.key==="ArrowLeft"||o.key==="ArrowUp")t(e.value-i);else if(o.key==="ArrowRight"||o.key==="ArrowDown")t(e.value+i);else return!1;return o.preventDefault(),e.value!==n})}var Qi=class extends pe{value=0;step=.01};s(Qi,{tagName:"c-slider-reveal",init:[he("value",0,1),he("step")],augment:[E("slider"),p(`
:host {
	display: grid; position: relative; box-sizing: border-box;
	touch-action: pan-y;
}
slot { display: block; grid-area: 1 / 1 / 2 / 2; }
slot:not([name]) { z-index: 1 }

#slider {
	width: 40px;
	box-sizing: border-box;
	cursor: col-resize;
	z-index: 5;
	translate: -50% 0;
	top: 0;
	bottom: 0;
	position: absolute;
	opacity: 0.75;
	border-width: 0 16px;
	border-color: transparent;
	border-style: solid;
	background-clip: content-box;
	touch-action: none;
}
:host(:hover) #slider {
	background-color: var(--cxl-color-outline);
}
		`),j,e=>{let t=x("div",{id:"slider",tabIndex:0}),o=x("slot",{name:"before"}),n=0;function r(){let a=e.value*e.offsetWidth;o.style.clipPath=`inset(0 0 0 ${a}px)`,t.style.left=`${a}px`,e.ariaValueNow=e.value.toString()}function i(a){let c=jp(a);c!==e.value&&(e.value=c,e.dispatchEvent(new Event("change",{bubbles:!0})))}return t.setAttribute("part","slider"),e.focus=()=>{e.disabled||t.focus()},e.ariaValueMin="0",e.ariaValueMax="1",e.ariaOrientation="horizontal",A(e).append(x("slot",{name:"after"}),o,x("slot"),t),u(Se(e,t),u(d(e,"value"),ne(e)).raf(r),Up(e,i),Gr({target:t}).tap(a=>{a.type==="start"?n=t.offsetLeft:a.type==="move"&&i((n+a.clientX-a.startX)/e.offsetWidth)}))}]});var Xs=class e extends pe{value="on";checked=!1;defaultChecked=!1;static{s(e,{tagName:"c-switch",init:[f("value"),h("checked")],augment:[E("switch"),Ne,p(`
:host {
	position: relative;
	box-sizing: border-box;
	display: inline-flex;
	align-items: center;
	cursor: pointer;
	width: 52px;
	height: 32px;
	border: 2px solid var(--cxl-color-outline);
	border-radius: var(--cxl-shape-corner-full);
	background-color: var(--cxl-color-surface-container-highest);
}
:host([checked]) {
	border-color: var(--cxl-color-primary);
	background-color: var(--cxl-color-primary);
}
.knob {
	transition: scale var(--cxl-speed), translate var(--cxl-speed);
	width: 28px;
	height: 28px;
	border-radius: var(--cxl-shape-corner-full);
	background-color: var(--cxl-color-outline);
	scale: 0.5714;
}
:host([checked]) .knob {
	background-color: var(--cxl-color-on-primary);
	scale: 0.8571;
	translate: 20px 0;
}
:host(:active) .knob {
	width: 28px;
	height: 28px;
	scale: 1;
}
:host([disabled]) .knob { opacity: 38%; }
:host([disabled]) {
	background-color: color-mix(in srgb, var(--cxl-color-surface-container-highest) 12%, transparent);
	border-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([disabled][active]) {
	background-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
.mask {
	transition: translate var(--cxl-speed);
	display: block;
	position: absolute;
	left: -8px;
	width: 40px; height: 40px;
	border-radius: 100%;
	overflow: hidden;
}
${ot(".mask")}
:host([checked]) .mask { translate: 20px 0; }
		`),t=>{t.defaultChecked=t.checked},j,()=>x("div",{className:"knob"}),()=>x("div",{className:"mask"}),jr]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){de(this).setFormValue(this.checked?String(t):null)}};var Zi=class extends m{font};s(Zi,{tagName:"c-t",init:[h("font")],augment:[p(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${hn.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${C("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${C("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${C("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${C("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${C("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${C("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),y,e=>d(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var ea=class extends m{selected;tabs=new Set;variant};s(ea,{tagName:"c-tabs",init:[_("selected"),h("variant")],augment:[E("tablist"),p(`
			:host {
				background-color: var(--cxl-color-surface);
				color: var(--cxl-color-on-surface);
				flex-shrink: 0;
				position: relative;
				overflow-y: hidden;
				display: flex;
				align-items: center;
				overflow-x: auto;
				border-bottom: 1px solid var(--cxl-color-surface-variant);
				--cxl-tabs-direction: column;
				--cxl-tabs-height: 63px;
			}
			.selected {
				transform-origin: left;
				background-color: var(--cxl-color-primary);
				height: 3px;
				border-radius: 3px 3px 0 0;
				width: 100px;
				display: none;
				position:absolute;
				left: 0;
				transition: transform var(--cxl-speed);
				bottom: 0;
			}
			:host([variant=secondary]) {
				--cxl-tabs-direction: row;
				--cxl-tabs-height: 47px;
			}
			:host([variant=secondary]) .selected {
				height: 2px;
				margin-top: -2px;
				border-radius: 0;
			}
		`),y,e=>{function t(o=1){let n=Array.from(e.tabs),r=e.selected||n[0],i=r?n.indexOf(r):-1;return i===-1?null:n[i+o]||null}return st({host:e,goRight:t.bind(null,1),goLeft:t.bind(null,-1),goFirst:()=>Array.from(e.tabs)[0]||null,goLast:()=>Array.from(e.tabs)[e.tabs.size-1]||null}).tap(o=>{o.click(),o.focus()})},e=>{let t=new xe;return A(e).append(x(at,{className:"selected",$:o=>u(ft(),d(e,"selected"),d(e,"variant"),t,ne(e)).raf(()=>{if(!e.checkVisibility())return;let n=e.selected;if(!n)return o.style.transform="scaleX(0)";let r=n.offsetLeft;if(e.variant==="secondary"){let i=n.clientWidth/100;o.style.transform=`translate(${r}px, 0) scaleX(${i})`,o.style.display="block"}else{let i=document.createRange();i.selectNodeContents(n);let{width:a}=i.getBoundingClientRect(),c=r+(n.clientWidth-a)/2,l=a/100;o.style.transform=`translate(${c}px, 0) scaleX(${l})`,o.style.display="block"}e.scrollWidth!==n.clientWidth&&(e.scrollLeft=r-32)})})),gt("tabs",e,e.tabs).raf().switchMap(o=>{let n=[];for(let r of o.elements)n.push(d(r,"selected").tap(i=>{i?(e.selected&&e.selected!==r&&(e.selected.selected=!1),e.selected=r):e.selected===r&&(e.selected=void 0),r.tabIndex=i?0:-1}),ne(r).tap(()=>t.next()));return u(...n)})}]});var Kn=class extends m{selected=!1;touched=!1;disabled=!1;name};s(Kn,{init:[h("touched"),h("selected"),h("disabled"),f("name")],augment:[E("tab"),Ne,e=>Ce("tabs",e),e=>d(e,"name").switchMap(t=>t?I(e).tap(()=>e.selected=!0):T),e=>d(e,"selected").tap(t=>{e.setAttribute("aria-selected",t?"true":"false")})]});var ta=class extends Kn{};s(ta,{tagName:"c-tab",augment:[p(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	box-sizing: border-box;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	font: var(--cxl-font-title-small);
	letter-spacing: var(--cxl-letter-spacing-title-small);
	flex-shrink: 0;
	flex-grow: 1;
	padding: 7px 16px 8px 16px;
	min-height: 47px;
	flex-direction: var(--cxl-tabs-direction, row);
	text-decoration: none;
	justify-content: center;
	display: inline-flex;
	gap: 4px 8px;
	align-items: center;
	cursor: pointer;
	min-width: 90px;
	position: relative;
}
:host([selected]) { 
	--cxl-color-on-surface: var(--cxl-color-primary);
}
${F("small",":host { flex-grow: 0 }")}
		`),ce,j,dt,y]});var oa=class extends m{};s(oa,{tagName:"c-table",augment:[E("table"),p(`
:host {
	--cxl-color-outline: var(--cxl-color-outline-variant);
	box-sizing: border-box;
	display: table;
	width: 100%;
	/* Hide overflow for draggable columns */
	overflow: hidden;
	outline: 1px solid var(--cxl-color-outline);
	border-bottom: 0;
	border-radius: 24px;
	${C("body-large")}
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	outline-offset: -1px;
}
		`),y]});var na=class extends m{};s(na,{tagName:"c-tbody",augment:[E("rowgroup"),p(":host{display:table-row-group}"),y]});var ra=class extends m{};s(ra,{tagName:"c-td",augment:[E("cell"),p(`
:host {
	box-sizing: border-box;
	display: table-cell;
	padding: 0 16px;
	height: 51px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
}
		`),y]});var ia=class extends m{};s(ia,{tagName:"c-th",augment:[E("columnheader"),p(`
:host {
	box-sizing: border-box;
	display: table-cell;
	${C("title-medium")}
	color: var(--cxl-color-on-surface-variant);
	padding: 16px;
	white-space: nowrap;
	height: 55px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
	position: relative;
}`),y]});var aa=class extends Pe{value="";inputEl=document.createElement("textarea")};s(aa,{tagName:"c-textarea",init:[f("value")],augment:[y,e=>e.append(e.inputEl),e=>Xe({host:e,input:e.inputEl}),j,e=>{let t=new CSSStyleSheet;return t.replaceSync(":host{flex-grow:1;position:relative;}"),e.shadowRoot?.adoptedStyleSheets.push(t),u(d(e,"value"),ne(e.inputEl),ft()).raf(()=>{let o=e.inputEl.style;o.height="0";let n=e.inputEl.scrollHeight;t.replaceSync(`:host{flex-grow:1;position:relative;height:${n}px}`),o.height="100%"})}]});function Yp(e){return getComputedStyle(e).direction==="rtl"}function _p(e,t,o,n,r){return e==="right"||e==="end"&&!n||e==="start"&&n?(r.left=t.right,!0):e==="left-to-right"||e==="start-to-end"&&!n?(r.left=t.left,!0):e==="left"||e==="end"&&n||e==="start"&&!n?(r.left=t.left-o.offsetWidth,!0):e==="center"?(r.left=t.left+t.width/2-o.offsetWidth/2,!0):e==="right-to-left"||e==="end-to-start"&&n?(r.left=t.right-o.offsetWidth,!0):e==="fill"?(r.left=t.left,r.minWidth=t.width,!0):!1}function Xp(e,t,o,n){return e==="bottom"?(n.top=t.bottom,!0):e==="top"?(n.top=t.top-o.offsetHeight,!0):e==="middle"?(n.top=t.top+t.height/2-o.offsetHeight/2,!0):e==="top-to-bottom"?(n.top=t.top,!0):e==="bottom-to-top"?(n.top=t.bottom-o.offsetHeight,!0):!1}function Ws(e,t,o){return Math.min(Math.max(e,t),o)}function qs({element:e,relativeTo:t,position:o,container:n}){if(o==="none")return;if(n??=fe.currentPopupContainer??fe.popupContainer,e.parentNode||n.appendChild(e),typeof o=="function")return o(e);let r=t.getBoundingClientRect(),i=e.style,a=Math.max(n.offsetWidth-e.offsetWidth-16,16),c=Math.max(n.offsetHeight-e.offsetHeight-16,16);i.left=i.top=i.width=i.minWidth=i.transformOrigin="",o==="auto"&&(o="center bottom");let l={left:0,top:0},g=Yp(e);for(let v of o.split(" "))if(!_p(v,r,e,g,l)&&!Xp(v,r,e,l))throw new Error(`Invalid position "${v}"`);l.left=Ws(l.left,16,a),l.top=Ws(l.top,16,c),i.left=`${l.left}px`,i.top=`${l.top}px`,l.minWidth&&(i.minWidth=`${l.minWidth}px`)}function Wp(e){let t=u(P(e,"position"),b(window,"scroll",{capture:!0,passive:!0})),o=n=>qs({element:n,relativeTo:(typeof e.relative=="string"?it(e,e.relative):e.relative)??e.firstElementChild??e,position:e.position||"auto",container:document.body});return Lt(e).switchMap(({target:n,open:r})=>{if(n.open&&r&&(n.open=!1),n.trigger!==e)return T;if(n.open=r,r){let i=n.dialog??n,a=e.firstElementChild;return n.dialog&&(i.style.margin="0"),o(i),u(ne(i),t).raf(()=>{a&&!a.checkVisibility()?e.open=!1:o(i)})}return T})}var sa=class extends m{open=!1;target;position;relative;trigger};s(sa,{tagName:"c-toggle-popup",init:[h("open"),f("target"),f("position"),f("relative"),f("trigger")],augment:[Wp,y,p(":host{display:contents}")]});var la=class extends Ht{};s(la,{tagName:"c-toolbar-floating",augment:[p(`
:host {
	background-color: var(--cxl-color-surface-container);
	color: var(--cxl-color-on-surface-variant);
	border-radius: var(--cxl-shape-corner-full);
	padding: 8px 24px;
	height: 64px;
	${Xa(3)}
}
		`)]});var ca=class extends m{color};s(ca,{tagName:"c-tr",init:[le("color")],augment:[E("row"),p(":host{display:table-row;height:53px;}"),y]});var qp={xl:"xlarge",lg:"large",md:"medium",sm:"small",xs:"xsmall",full:"full"},$p=Ja.map(e=>e==="inherit"?`[c~="surface-${e}"]{background-color:inherit;color:inherit}
[c~="color-${e}"]{color:inherit}`:`[c~="surface-${e}"]{background-color:var(--cxl-color-${e});color:var(--cxl-color-on-${e})}
[c~="color-${e}"]{color:var(--cxl-color-${e})}`).join(""),$s=`[c~="cover"]{object-fit:cover;width:100%;height:100%;}
[c~="fill"]{position:absolute;inset:0;}
[c~="text-center"]{text-align:center;}
[c~="text-left"]{text-align:left;}
[c~="text-right"]{text-align:right;}
[c~="vflex"]{display:flex;flex-direction:column;}
[c~="flex"]{display:flex;}
[c~="grow"]{flex-grow:1}
[c~="wrap"]{flex-wrap:wrap;}
[c~="hide"]{display:none;}
[c~="show"]{display:initial;}
[c~="section-header"]{display:block;${C("title-medium")}margin-bottom:48px;grid-column:1 / -1;}
[c~="section-header"] > h2{${C("display-small")}font-weight:700;}
${$p}
${hn.map(e=>`[c-font="${e}"]{${C(e)}}`).join("")}
${nt.map(e=>`[c~="pad-${e}"]{padding:${e}px}
[c~="corner-${e}"]{border-radius:${e}px}
[c~="gap-${e}"]{gap:${e}px}`).join("")}
${Object.entries(qp).map(([e,t])=>`[c~="corner-${e}"]{border-radius:var(--cxl-shape-corner-${t})}`).join("")}
[c~="surface-scrim"]{
	background-color:var(--cxl-color-scrim);
	background-size:cover;
	background-blend-mode:darken;
	background-position:center;
}`,Gp=`${$s}
${F("small",$s.replace(/\[c~/g,"[c\\:sm~"))}
`,Gs=new WeakMap;function Jp(e=document){let t=Gs.get(e);return t||(t=je(Gp),e.adoptedStyleSheets.push(t),Gs.set(e,t)),t}var pa=class extends m{};s(pa,{tagName:"c-www",augment:[e=>{Jp(e.ownerDocument)}]});export{lr as Accordion,ur as AccordionHeader,So as AccordionPanel,or as Action,Dt as Alert,mr as AlertError,Mo as Appbar,us as AppbarContextual,dr as AppbarLayout,fr as AppbarTitle,hr as Application,br as AriaLive,yu as Augment,Rn as Autocomplete,Nr as AutocompleteDynamic,Dr as Avatar,bo as BehaviorSubject,Jn as Bindings,co as Block,Ir as Body,Ye as Button,to as ButtonBase,Ao as ButtonRound,Pr as ButtonSegmented,Fr as ButtonText,Fo as C,Ho as Card,Vr as CardItem,Ss as Checkbox,Ur as Chip,Qa as ColorStyles,m as Component,lc as ContentManager,Yr as Date,I0 as DefaultRoute,_r as Dialog,po as DialogBase,Ft as DialogBasic,qr as Dismiss,Ls as DragHandle,Vo as Drawer,Jr as Dropdown,T as EMPTY,Qr as Each,Vn as EmptyError,kr as Field,Zr as FieldBar,Ie as FieldBase,ei as FieldFrame,Do as FieldHelp,ti as FieldOutlined,jo as Flex,In as Form,oi as FormSubmit,ni as Grid,ii as GridList,Ks as HashStrategy,ci as Hero,pi as Hr,ge as Icon,De as IconButton,di as IconToggleTheme,fi as Iframe,pe as Input,gi as InputClear,xi as InputFile,bi as InputNumber,hi as InputNumberBase,Ln as InputOption,Ds as InputPassword,yi as InputPlaceholder,Or as InputText,Pe as InputTextBase,Br as Item,We as ItemBase,vi as Kbd,Ti as Label,Uo as Layout,mo as LayoutBase,wi as List,Bi as MainRouter,Ei as Menu,xr as Meta,ki as NavDropdown,Mi as NavHeadline,_o as NavItem,Si as NavTarget,Ci as NavTreeItem,qo as NavbarToggle,M as Observable,Er as Option,rn as OrderedSubject,Za as OutlineColorStyles,Ai as Page,Oi as PageAppbar,Np as PathStrategy,Ko as Pill,Yo as Popup,Li as Progress,Ri as ProgressCircular,Rp as QueryStrategy,Go as R,Di as Rating,Yt as Reference,an as ReplaySubject,Mn as Ripple,Fi as RouteBase,Hi as RouteManager,Xi as RouterA,zi as RouterComponent,_i as RouterItem,Qo as RouterLink,Wi as RouterOutlet,Ui as RouterSelectable,si as Section,Sr as Select,ao as SelectOption,Be as Signal,er as SizeValues,Qi as SliderReveal,y as Slot,fo as Snackbar,$o as SnackbarContainer,at as Span,go as Strategies,xe as Subject,el as Subscriber,Ja as SurfaceColorNames,Xs as Switch,Zi as T,ta as Tab,Kn as TabBase,oa as Table,ea as Tabs,na as Tbody,ra as Td,aa as TextArea,ia as Th,ar as Toggle,ht as ToggleBase,zo as TogglePanel,sa as TogglePopup,Co as ToggleTarget,Ue as ToggleTargetBase,Ht as Toolbar,la as ToolbarFloating,ca as Tr,hn as TypographyValues,pa as Www,as as activeRipple,ib as alert,fu as animated,ms as applyMeta,Yl as applyTheme,Gt as aria,Mu as ariaChecked,Ia as ariaControls,Au as ariaDescribed,tt as ariaId,Na as ariaLabel,Ra as ariaValue,f as attribute,P as attributeChanged,al as auditTime,vu as augment,Uc as avatarBaseStyles,Ee as be,Hn as bindHref,re as bindings,Tn as breakpoint,sl as bufferTime,No as buildGo,Hr as buildGridCss,Vl as buildIconFactoryCdn,mp as buildListGo,ot as buildMask,vn as buildMenuStyles,Nt as buttonBaseStyles,Ne as buttonBehavior,pr as buttonKeyboardBehavior,Ql as buttonStyles,Yc as cardStyles,fl as catchError,no as changeEvent,jr as checkedBehavior,le as colorAttribute,Pu as colorMix,V as combineLatest,s as component,Qe as concat,cl as concatMap,db as confirm,oe as content,x as create,p as css,qa as cssAttribute,fn as cssSymbol,ou as debounceFunction,pu as debounceImmediate,Tl as debounceRaf,il as debounceTime,rs as decode,ps as defaultFormatDate,Wa as defaultThemes,Y as defer,Fu as delayTheme,Dn as dialog,Xr as dialogClose,Wr as dialogStyles,cr as disabledAttribute,j as disabledStyles,q as displayContents,gl as distinctUntilChanged,rp as drawerStyles,Ns as each,lp as eachBehavior,Xa as elevation,cu as empty,ec as errorToString,gn as event,pl as exhaustMap,Ol as expression,Cr as fieldBaseStyles,Pc as fieldBehavior,Ic as fieldLayout,Pt as fieldLayoutStyles,Nc as fieldStyles,hp as fileUploadBehavior,Yn as filter,yl as finalize,cp as findForm,dl as first,tu as firstValueFrom,Se as focusable,Gl as focusableDisabled,Jl as focusableEvents,wl as focused,C as font,nf as formatDate,ze as from,yo as fromAsync,eu as fromGenerator,xa as fromIterable,jn as fromPromise,d as get,gu as getActiveElement,ut as getAriaId,Aa as getAttribute,rf as getDayText,Lp as getElementRoute,of as getFormattedDate,Tr as getHostActive,Zt as getIcon,tf as getLocale,wu as getRegisteredComponents,At as getRoot,jc as getSearchRegex,A as getShadow,Hs as getStars,kn as getTarget,it as getTargetById,Cn as getTargets,pp as gridColumns,dp as gridNavigation,Kr as growAndFillStyles,Oc as handleListArrowKeys,Wn as hovered,qn as hoveredOrFocused,vl as ignoreElements,Fp as initializeRouter,Dc as inputContainer,Po as inputTextBase,Lr as inputTextStyles,Jp as installWwwCss,de as internals,nu as interval,mu as isFocusable,uu as isHidden,To as isKeyboardClick,fs as isPageReady,Xc as itemBehavior,zr as itemButtonBehavior,ri as itemHost,yn as itemLayout,_c as itemStyles,pm as json,ai as layoutStyles,K0 as linkBehavior,Ga as loadTheme,Kl as loadThemeDefinition,Ro as manageFocus,up as manageFocusList,Un as map,dt as maskStyles,F as media,u as merge,ll as mergeMap,ee as message,Oa as messageProxy,An as metaBehavior,ko as motion,Xo as navItemComponent,st as navigation,Yf as navigationItems,Pn as navigationList,je as newStylesheet,du as nodeSort,Ap as normalize,Hw as notify,he as numberAttribute,Q as observable,wa as observeChildren,Bl as observeTheme,L as of,b as on,I as onAction,ln as onAttributeMutation,sn as onChildrenMutation,Xn as onEvent,ft as onFontsReady,Vs as onHashChange,Pp as onHistoryChange,pn as onIntersection,cn as onKeyAction,Wt as onKeypress,et as onLoad,js as onLocation,ie as onMessage,_n as onMutation,ds as onPageReady,Ta as onReady,ne as onResize,Jt as onThemeChange,$t as onUpdate,un as onVisibility,Xt as onVisible,we as operator,Mt as operatorNext,ga as operators,Lc as overrideFocusMethod,ql as parseAnimation,um as parseJson,$l as parseMotion,Op as parseQueryParameters,Ki as parseUrl,Zp as pipe,xn as placeholder,vp as popupBehavior,yp as popupStyles,Wp as popupToggleBehavior,Hc as positionUnder,Vc as prefixMatcher,_ as property,bl as publishLast,va as raf,nl as reduce,vo as ref,Hu as registerDefaultIconFactory,Ku as registerIcon,oo as registerText,dn as renderChildren,ly as renderEach,Ii as replaceParameters,ce as ripple,E as role,D0 as route,P0 as routeIsActive,H0 as routeTitles,ae as router,F0 as routerHost,Bp as routerLink,ji as routerOutlet,Yi as routerSelectable,vt as routerState,zs as routerStrategy,Qt as scrollbarStyles,li as sectionStyles,ol as select,Mr as selectBehavior,Kc as selectComponent,Fc as selectInputStyles,Cs as selectMenuStyles,Tu as set,wo as setAttribute,Ip as setDocumentTitle,Kw as setSnackbarContainer,hl as share,xl as shareLatest,ru as shareReplay,te as sizeAttribute,Ps as snackbarContainer,cm as sortBy,nt as spacingValues,rr as storage,Bs as strategy$,h as styleAttribute,wn as stylesheet,ya as subject,Rr as substringMatcher,Z as surface,io as svg,It as svgPath,ba as switchMap,Fe as sys,ul as take,ml as takeWhile,_t as tap,G as theme,bn as themeName,Ul as themeReady,rl as throttleTime,au as throwError,Ze as timer,tl as toPromise,sr as toggleBehavior,Sn as toggleClose,Lt as toggleComponent,km as toggleOpen,rt as toggleTargetBehavior,eo as toggleTargetStyles,Ve as trigger,se as tsx,Ac as updateEvent,fE as virtualScroll,dE as virtualScrollRender,Ua as visuallyHidden,Gp as wwwCss,iu as zip};
