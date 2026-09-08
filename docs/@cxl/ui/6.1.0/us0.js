var he=Symbol("undefined"),Qi=Symbol("terminator");function Rt(e){if(e===he)throw new Error("Value not initialized");return e}function Ls(e,t){let o=!1,r={error:n,unsubscribe:i,get closed(){return o},signal:new Re,next(a){if(!o)try{e.next?.(a)}catch(c){n(c)}},complete(){if(!o)try{e.complete?.()}finally{i()}}};e.signal?.subscribe(i);function n(a){if(o)throw a;if(!e.error)throw i(),a;try{e.error(a)}finally{i()}}function i(){o||(o=!0,r.signal.next())}try{t?.(r)}catch(a){n(a)}return r}function Fp(...e){return t=>e.reduce((o,r)=>r(o),t)}var A=class{__subscribe;constructor(t){this.__subscribe=t}then(t,o){return Ps(this).then(t,o)}pipe(...t){return t.reduce((o,r)=>r(o),this)}subscribe(t){return Ls(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},de=class extends A{closed=!1;signal=new Re;observers=new Set;constructor(){super(t=>{this.onSubscribe(t)})}next(t){if(!this.closed)for(let o of Array.from(this.observers))o.closed||o.next(t)}error(t){if(!this.closed){this.closed=!0;let o=!1,r;for(let n of Array.from(this.observers))try{n.error(t)}catch(i){o=!0,r=i}if(o)throw r}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Re=class extends A{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},qo=class extends de{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)for(let o of this.queue.splice(0))super.next(o);this.emitting=!1}}},po=class extends de{currentValue;constructor(t){super(),this.currentValue=t}get value(){return this.currentValue}next(t){this.currentValue=t,super.next(t)}onSubscribe(t){let o=super.onSubscribe(t);return this.closed||t.next(this.currentValue),o}},$o=class extends de{bufferSize;buffer=[];lastError=he;constructor(t=1/0){super(),this.bufferSize=t}error(t){this.lastError=t,super.error(t)}next(t){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(t),super.next(t)}onSubscribe(t){this.observers.add(t),this.buffer.forEach(o=>t.next(o)),this.lastError!==he?t.error(Rt(this.lastError)):this.closed&&t.complete(),t.signal.subscribe(()=>this.observers.delete(t))}},Lt=class extends de{$value=he;get hasValue(){return this.$value!==he}get value(){if(this.$value===he)throw new Error("Reference not initialized");return Rt(this.$value)}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==he&&t.next(Rt(this.$value)),super.onSubscribe(t)}},Nr=class extends Error{message="No elements in sequence"};function We(...e){return new A(t=>{let o=0,r;function n(){let i=e[o++];i&&!t.closed?(r?.next(),i.subscribe({next:t.next,error:t.error,complete:n,signal:r=new Re})):t.complete()}t.signal.subscribe(()=>r?.next()),n()})}function X(e){return new A(t=>{e().subscribe(t)})}function Mr(e){return new A(t=>{e.then(o=>{t.closed||t.next(o),t.complete()}).catch(o=>t.error(o))})}function Dp(e){return new A(t=>{t.signal.subscribe(()=>{let o=e.return?.();o instanceof Promise&&o.catch(r=>t.error(r))}),(async()=>{do{let o=await e.next();if(t.closed||o.done)break;t.next(o.value)}while(!t.closed);t.complete()})().catch(o=>t.error(o))})}function fo(e){return X(()=>Mr(e()))}function ea(e){return new A(t=>{for(let o of e)t.closed||t.next(o);t.complete()})}function Le(e){return e instanceof A?e:e instanceof Promise?Mr(e):ea(e)}function I(...e){return ea(e)}function ta(e){return new Promise((t,o)=>{let r=he;e.subscribe({next:n=>r=n,error:o,complete:()=>t(r)})})}function Ps(e){return ta(e).then(t=>t===he?void 0:Rt(t))}async function Rp(e){return ta(e.first()).then(t=>Rt(t))}function yt(e,t){return be(o=>({next:e(o),unsubscribe:t}))}function be(e){return t=>new A(o=>{let r=e(o,t);r.unsubscribe&&o.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=o.error),r.complete||(r.complete=o.complete),r.signal=o.signal,t.subscribe(r)})}function Tr(e){return yt(t=>o=>t.next(e(o)))}function Vs(e){let t=he;return yt(o=>r=>{let n=e(r);n!==t&&(t=n,o.next(n))})}function Os(e,t){return be(o=>{let r=t,n=0;return{next(i){r=e(r,i,n++)},complete(){o.next(r),o.complete()}}})}function Lp(e,t){let o;function r(...n){o&&clearTimeout(o),o=setTimeout(()=>e.apply(this,n),t)}return r.cancel=()=>clearTimeout(o),r}function Bs(e){return be(t=>{let o=!0,r;return{next(n){o&&(o=!1,t.next(n),r=setTimeout(()=>o=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function Pp(e){if(e<0)throw new Error("Invalid period");return new A(t=>{let o=setInterval(t.next,e);t.signal.subscribe(()=>clearInterval(o))})}function qe(e){return new A(t=>{let o=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(o))})}function Hs(e,t=qe){return oa(o=>t(e).map(()=>o))}function Ys(e){return be(t=>{let o,r=!1,n=he,i=()=>{o=void 0,!(!r||t.closed)&&(r=!1,t.next(Rt(n)),n=he)};return{next(a){n=a,r=!0,o===void 0&&(o=setTimeout(i,e))},complete(){o!==void 0&&(clearTimeout(o),i()),t.complete()},unsubscribe(){o!==void 0&&clearTimeout(o)}}})}function _s(e){if(e<0)throw new Error("Invalid period");return be(t=>{let o=[],r=setInterval(()=>{if(t.closed)return;let n=o;o=[],t.next(n)},e);return{next(n){o.push(n)},complete(){clearInterval(r),t.next(o),t.complete()},unsubscribe(){clearInterval(r)}}})}function oa(e){return t=>W(o=>{let r=!1,n=!1,i,a=()=>{i?.next(),r=!1,n&&o.complete()},c=new Re;o.signal.subscribe(()=>{a(),c.next()}),t.subscribe({next(l){a(),i=new Re,r=!0,Le(e(l)).subscribe({next:o.next,error:o.error,complete:a,signal:i})},error:o.error,complete(){n=!0,r||o.complete()},signal:c})})}function js(e){return t=>W(o=>{let r=o.signal,n=0,i=0,a=!1;function c(){i++,a&&i===n&&o.complete()}t.subscribe({next:l=>{n++,Le(e(l)).subscribe({next:o.next,error:o.error,complete:c,signal:r})},error:o.error,complete(){a=!0,i===n&&o.complete()},signal:r})})}function Us(e){return be(t=>{let o=new Re,r,n,i=[],a=!1,c=!1,l=()=>{r?.next(),r=void 0,n=void 0,c=!1,i.length&&!t.closed?i.splice(0,1).forEach(g):a&&t.complete()},g=v=>{c=!0,r=new Re,n=Le(e(v)).subscribe({next:t.next,error:t.error,complete:l,signal:r})};return t.signal.subscribe(()=>{r?.next(),o.next()}),{next(v){c?i.push(v):g(v)},error:t.error,complete(){a=!0,!c&&i.length===0&&t.complete()},signal:o,unsubscribe:()=>n?.unsubscribe()}})}function Xs(e){return be(t=>{let o=!0;return{next(r){o&&(o=!1,Le(e(r)).subscribe({next:t.next,error:t.error,complete:()=>o=!0,signal:t.signal}))}}})}function Ir(e){return yt(t=>o=>{e(o)&&t.next(o)})}function Ws(e){return yt(t=>o=>{e-- >0&&!t.closed&&t.next(o),(e<=0||t.closed)&&t.complete()})}function qs(e){return yt(t=>o=>{!t.closed&&e(o)?t.next(o):t.complete()})}function $s(){let e=!1;return be(t=>({next(o){e||(e=!0,t.next(o),t.complete())},complete(){t.closed||t.error(new Nr)}}))}function Pt(e){return yt(t=>o=>{e(o),t.next(o)})}function Ks(e){return be((t,o)=>{let r,n={next:t.next,error(i){try{if(t.closed)return;let a=e(i,o);r?.next(),r=new Re,a.subscribe({...n,signal:r})}catch(a){t.error(a)}},unsubscribe:()=>r?.next()};return n})}function Gs(){return yt(e=>{let t=he;return o=>{o!==t&&(t=o,e.next(o))}})}function Js(){return e=>{let t=new $o(1),o=!1;return W(r=>{t.subscribe(r),o||(o=!0,e.subscribe(t))})}}function Vp(e){return t=>{let o=new $o(e),r=0;return W(n=>{r++,o.subscribe(n),r===1&&t.subscribe(o),n.signal.subscribe(()=>{--r===0&&o.signal.next()})})}}function Qs(){return e=>{let t,o=0;function r(){--o===0&&t.signal.next()}return W(n=>{n.signal.subscribe(r),o++===0?(t=uo(),t.subscribe(n),e.subscribe(t)):t.subscribe(n)})}}function Zs(){return e=>{let t=new de,o,r,n=!1,i=!1;return W(a=>{i?(a.next(r),a.complete()):t.subscribe(a),o??=e.subscribe({next:c=>{n=!0,r=c},error:a.error,complete(){i=!0,n&&t.next(r),t.complete()},signal:a.signal})})}}function f(...e){return e.length===1?e[0]:new A(t=>{let o=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){o--===1&&t.complete()},signal:t.signal})})}function Op(...e){return e.length===0?w:new A(t=>{let o=new Array(e.length);function r(){let n=!0;for(;n;){for(let i of o)if(!i||i.length===0)n=!1;else if(i[0]===Qi)return t.complete();n&&t.next(o.map(i=>i?.shift()))}}e.forEach((n,i)=>{let a=o[i]=[];n.subscribe({next(c){a.push(c),r()},error:t.error,complete(){a.push(Qi),r()},signal:t.signal})})})}function V(...e){return e.length===0?w:new A(t=>{let o=e.length,r=o,n=0,i=!1,a=new Array(o),c=new Array(o);e.forEach((l,g)=>l.subscribe({next(v){c[g]=v,a[g]||(a[g]=!0,++n>=r&&(i=!0)),i&&t.next(c.slice(0))},error:t.error,complete(){--o<=0&&t.complete()},signal:t.signal}))})}function el(e){return be(t=>({next:t.next,unsubscribe:e}))}function tl(){return be(()=>({next(){}}))}function Bp(e){return new A(t=>{t.error(e)})}var w=new A(e=>{e.complete()});function ye(e){return new po(e)}function W(e){return new A(e)}function ra(){return new de}function uo(){return new Lt}var Zi={auditTime:Ys,bufferTime:_s,catchError:Ks,concatMap:Us,debounceTime:Hs,distinctUntilChanged:Gs,exhaustMap:Xs,filter:Ir,finalize:el,first:$s,ignoreElements:tl,map:Tr,mergeMap:js,publishLast:Zs,reduce:Os,select:Vs,share:Qs,shareLatest:Js,switchMap:oa,take:Ws,takeWhile:qs,tap:Pt,throttleTime:Bs};for(let e in Zi)A.prototype[e]=function(...t){return this.pipe(Zi[e](...t))};function _p(e){let t;for(;t=e.childNodes[0];)e.removeChild(t)}function b(e,t,o){return new A(r=>{let n=r.next.bind(r);e.addEventListener(t,n,o),r.signal.subscribe(()=>e.removeEventListener(t,n,o))})}function Ko(e){return zr(e,{childList:!0})}function Go(e,t){return zr(e,{attributes:!0,attributeFilter:t})}function zr(e,t={attributes:!0,childList:!0}){return new A(o=>{let r=new MutationObserver(n=>n.forEach(i=>{for(let a of i.addedNodes)o.next({type:"added",target:e,value:a});for(let a of i.removedNodes)o.next({type:"removed",target:e,value:a});i.type==="characterData"?o.next({type:"characterData",target:e}):i.attributeName&&o.next({type:"attribute",target:e,value:i.attributeName})}));r.observe(e,t),o.signal.subscribe(()=>r.disconnect())})}function Jo(e){return b(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function F(e){return b(e,"click")}function Qo(e,t){return new A(o=>{let r=new IntersectionObserver(n=>{for(let i of n)o.next(i)},t);r.observe(e),o.signal.subscribe(()=>r.disconnect())})}function Zo(e){return Qo(e).map(t=>t.isIntersecting)}function Vt(e){return Qo(e).filter(t=>t.isIntersecting).first()}function ol(e){let t;return function(...o){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,o),t=0})}}function jp(e){let t;return function(...o){t||(t=!0,queueMicrotask(()=>{t=!1,e.apply(this,o)}))}}function na(e){return be(t=>{let o=ol(n=>{t.closed||(e&&e(n),t.next(n),r&&t.complete())}),r=!1;return{next:o,complete:()=>r=!0}})}function ia(){return X(()=>document.readyState!=="loading"?I(!0):b(window,"DOMContentLoaded").first().map(()=>!0))}function Pe(e,t,o){let r=new CustomEvent(t,o);e.dispatchEvent(r)}function aa(e,t){let o=e,r;return f(X(()=>(r=o.childNodes,r?I(void 0):w)),$e().switchMap(()=>o.childNodes!==r?I(void 0):w),zr(e,{childList:!0,...t}).map(()=>{}))}function $e(){return X(()=>document.readyState==="complete"?I(!0):b(window,"load").first().map(()=>!0))}function ee(...e){return new A(t=>{let o=new ResizeObserver(r=>r.forEach(n=>t.next(n)));for(let r of e)o.observe(r);t.signal.subscribe(()=>o.disconnect())})}function Up(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function Xp(e){return e instanceof HTMLElement&&(!("disabled"in e)||!e.disabled)&&(e.offsetParent!==null||!!(e.offsetWidth&&e.offsetHeight))&&(e.tabIndex!==-1||e.contentEditable==="true"||e.hasAttribute("tabindex"))}function Wp(e,t){return e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING?1:-1}function Fr(e,t,o){return r=>We(I(e?r.matches(e):!1),b(r,t).switchMap(()=>f(I(!0),b(r,o).map(()=>e?r.matches(e):!1))))}var qp=Fr("","animationstart","animationend"),Dr=Fr("","mouseenter","mouseleave"),rl=Fr(":focus,:focus-within","focusin","focusout"),Rr=e=>V(Dr(e),rl(e)).map(([t,o])=>t||o);function Ot(e,t,o){return t=t?.toLowerCase(),b(e,"keydown",o).filter(r=>!t||!!r.key&&r.key.toLowerCase()===t)}function mo(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function vt(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}function $p(e){return vt(e)?.activeElement??null}var nl=Pt(e=>console.trace(e));A.prototype.log=function(){return this.pipe(nl)};A.prototype.raf=function(e){return this.pipe(na(e))};var te=Symbol("bindings"),sa={},Bt=Symbol("augments"),wt=Symbol("parser"),Vr=class{bindings;messageHandlers;internals;attributes$=new qo;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,o){let r=!1;if(this.messageHandlers)for(let n of this.messageHandlers)n.type===t&&(n.next(o),r||=n.stopPropagation);return r}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let o of this.bindings)t.push(o.subscribe());if(this.prebind)for(let o of this.prebind)t.push(o.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},or=Symbol("css"),u=class extends HTMLElement{static observedAttributes;static[Bt];static[wt];[te]=new Vr;[or];connectedCallback(){this[te].wasInitialized=!0,this[te].wasConnected||this.constructor[Bt]?.forEach(t=>t(this)),this[te].connect()}disconnectedCallback(){this[te].disconnect()}attributeChangedCallback(t,o,r){let n=this.constructor[wt]?.[t]??il;o!==r&&(this[t]=n(r,this[t]))}};function il(e,t){let o=t===!1||t===!0;return e===""?o?!0:"":e===null?o?!1:void 0:e}function la(e,t){Object.prototype.hasOwnProperty.call(e,Bt)||(e[Bt]=e[Bt]?.slice(0)??[]),e[Bt]?.push(t)}var al={mode:"open"};function N(e){return e.shadowRoot??e.attachShadow(al)}function ca(e,t){t instanceof Node?N(e).appendChild(t):e[te].add(t)}function er(e,t){t.length&&la(e,o=>{for(let r of t){let n=r.call(e,o);n&&n!==o&&ca(o,n)}})}function pa(e,t){sa[e]=t,customElements.define(e,t)}function pe(e){return e[te].internals??=e.attachInternals()}function Qp(e,...t){return o=>{typeof e=="string"?(er(o,t),pa(e,o)):(t.unshift(e),er(o,t))}}function s(e,{init:t,augment:o,tagName:r}){if(t)for(let n of t)n(e);o&&er(e,o),r&&pa(r,e)}function Zp(e,...t){er(e,t)}function Ht(e){return We(I(e),e[te].attributes$.map(()=>e))}function D(e,t){return e[te].attributes$.pipe(Ir(o=>o.attribute===t),Tr(()=>e[t]))}function d(e,t){return f(D(e,t),X(()=>I(e[t])))}function ef(e,t,o){e[t]=o}function sl(e){let t=e.observedAttributes;return t&&!Object.prototype.hasOwnProperty.call(e,"observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function go(e,t,o){let r=o;return r===null||typeof r>"u"?r=null:typeof r=="boolean"&&(r=r?"":null),r===null?e.removeAttribute(t):e.setAttribute(t,String(r)),r}function ll(e,t,o){Object.prototype.hasOwnProperty.call(e,wt)||(e[wt]={...e[wt]}),e[wt]&&(e[wt][t]=o)}function m(e,t){return o=>{t?.observe!==!1&&sl(o).push(e),t?.parse&&ll(o,e,t.parse);let r=`$$${e}`,n=o.prototype,i=Object.getOwnPropertyDescriptor(n,e);i&&Object.defineProperty(n,r,i);let a=t?.persist,c={enumerable:!0,configurable:!1,get(){return this[r]},set(l){this[r]!==l?(this[r]=l,a?.(this,e,l),this[te].attributes$.next({target:this,attribute:e,value:l})):i?.set&&(a?.(this,e,l),this[r]=l)}};la(o,l=>{if(i||(l[r]=l[e]),Object.defineProperty(l,e,c),a?.(l,e,l[e]),t?.render){let g=t.render(l);g&&ca(l,g)}})}}function h(e){return m(e,{persist:go,observe:!0})}function cl(e,t,o){return new A(r=>{function n(i){i.target===e&&e[o]?.call(e,i)}e.addEventListener(t,n),r.signal.subscribe(()=>e.removeEventListener(t,n))})}function rr(e){let t=`on${e}`;return m(t,{render(o){return d(o,t).switchMap(r=>r?cl(o,e,t):w)},parse(o){return o?new Function("event",o):void 0}})}function H(e){return m(e,{observe:!1})}function tf(){return{...sa}}function y(){return document.createElement("slot")}function nr(e){return t=>{let[o,r]=e();return t[te].add(o),r}}function pl(e,t){let o=document.createTextNode("");return e[te].add(t.tap(r=>o.textContent=String(r))),o}var Lr=document.createDocumentFragment();function tr(e,t,o=e){if(t!=null)if(Array.isArray(t)){for(let r of t)tr(e,r,Lr);o!==Lr&&o.appendChild(Lr)}else e instanceof u&&t instanceof A?o.appendChild(pl(e,t)):t instanceof Node?o.appendChild(t):e instanceof u&&typeof t=="function"?tr(e,t(e),o):o.appendChild(document.createTextNode(String(t)))}function Pr(e,t,o){e[t]=o}function fl(e){return typeof e=="function"}function fa(e,t){for(let o in t){let r=t[o];if(e instanceof u)if(r instanceof A)e[te].add(o==="$"?r:r.tap(n=>Pr(e,o,n)));else if(o==="$"&&fl(r)){let n=r(e);n instanceof A&&e[te].add(n)}else Pr(e,o,r);else Pr(e,o,r)}}function ul(e,t){return e.constructor.observedAttributes?.includes(t)}function ua(e,t){let o=e instanceof u&&ul(e,t)?D(e,t):Go(e,[t]).map(()=>e[t]);return f(o,X(()=>I(e[t])))}function me(e,t,o){return m(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let n=r===null?void 0:Number(r);return t!==void 0&&(n===void 0||n<t||isNaN(n))&&(n=t),o!==void 0&&n!==void 0&&n>o&&(n=o),n}})}function K(e,t,o){for(let r=e.parentElement;r;r=r.parentElement)if(r instanceof u&&r[te].message(t,o))return}function oe(e,t,o=!0){let r,n=0,i=new de,a={type:t,next(c){n?i.next(c):(r??=[]).push(c)},stopPropagation:o};return e[te].addMessageHandler(a),new A(c=>{n===0&&r?.length&&(r.forEach(g=>c.next(g)),r.length=0),n++;let l=i.subscribe(c);c.signal.subscribe(()=>{n--,l.unsubscribe()})})}function da(e,t,o,r=!0){return oe(e,t,r).tap(n=>{o[te].message(t,n)})}function x(e,t,...o){let r=typeof e=="string"?document.createElement(e):new e;return t&&fa(r,t),o.length&&tr(r,o),r}function ie(e,t,...o){if(e!==ie&&typeof e=="function"&&!(e.prototype instanceof u))return o.length&&((t??={}).children=o),e(t);let r=e===ie?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&fa(r,t),o.length&&tr(r,o),r}function ma(e,t){return o=>new A(()=>{o.hasAttribute(e)||o.setAttribute(e,t)})}function Yt(e,t){return ma(`aria-${e}`,t)}function ga(e,t){return Pt(o=>e.setAttribute("aria-"+t,o===!0?"true":o===!1?"false":o.toString()))}function sf(e){return Pt(t=>e.setAttribute("aria-checked",t===void 0?"mixed":t?"true":"false"))}function S(e){return ma("role",e)}function lf(e,t){return it(t).tap(o=>{e.setAttribute("aria-describedby",o)}).finalize(()=>e.removeAttribute("aria-describedby"))}function xa(e,t){return e.ariaLabel||e.getAttribute("aria-labelledby")?w:t.tap(o=>e.ariaLabel=o)}var ha=0;function Ke(e){return e.id||=`cxl__${ha++}`}function it(e){return ua(e,"id").map(t=>(t||(e.id=`cxl__${ha++}`),e.id))}function ba(e,t){return V(...t.map(o=>it(o))).tap(o=>{e.setAttribute("aria-controls",o.join(" "))})}var dl=["xsmall","small","medium","large","xlarge","xxlarge"],Y=p(":host{display:contents}"),Ea=p(":host{position:absolute;display:block;width:0;height:0;overflow:hidden}"),Hr=[-2,-1,0,1,2,3,4,5],ir=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],_t=uo(),ar=ye(""),O=p(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),sr=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${E("body-medium")}
`,ml=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),Ca={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function lr(e=""){return`
:host ${e} {
	${q("surface-container")}
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
		`}function Aa(e=Ca){return Object.entries(e).map(([t,o])=>`--cxl-color--${t}:${o};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var U={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:Ca,imports:ml?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
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
}`};function Ge(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}function Na(e){return`box-shadow:var(--cxl-elevation-${e});z-index:${e};`}var st=p(Ge()),Ma={"./theme-dark.js":()=>import("./theme-dark-F4QQQFSI.js")},Je=[0,4,8,"12",16,24,32,48,64],at,ya,gl;function L(e,t){return e==="xsmall"?`@media(max-width:${U.breakpoints.small}px){${t}}`:`@media(min-width:${U.breakpoints[e]}px){${t}}`}function cr(e){return f(fo(async()=>e.getBoundingClientRect().width),ee(e).map(t=>t.contentRect.width)).map(t=>{let o=U.breakpoints,r="xsmall";for(let n of dl){if(o[n]>t)return r;r=n}return r}).distinctUntilChanged()}function xl(e=""){return Object.entries(Da).map(([t,o])=>`:host([color=${t}]) ${e}{ ${o} }`).join("")}function ae(e,t,o=""){return Ta(e,`
		${t?`:host ${o} { ${Da[t]} }`:""}
		:host${t?"":"([color])"} ${o} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${o}{
			color: inherit;
			background-color: transparent;
		}
		${xl(o)}
	`)}function Ta(e,t){let o=p(t);return m(e,{persist:go,render:r=>o(r)})}function J(e,t){return Ta(e,Hr.map(o=>{let r=t(o);return o===0?`:host{--cxl-size:${o}}:host ${r}`:`:host([size="${o}"]){--cxl-size:${o}}:host([size="${o}"]) ${r}`}).join(""))}function Ia(){let e=at?document.adoptedStyleSheets.indexOf(at):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function hl(e){at&&Ia();let t=e.globalCss??"";e.colors&&(t+=`:root{${Aa(e.colors)}}`),t?(at=Ve(t),document.adoptedStyleSheets.push(at)):at=void 0,_t.next({theme:e,stylesheet:at,css:t}),ar.next(e.name)}var va="";function wa(e){hl(e.default)}function za(e){e?e!==va&&(typeof e=="string"?import(e).then(wa,t=>console.error(t)):e().then(wa,t=>console.error(t))):at&&(Ia(),_t.next(void 0),ar.next("")),va=e}function bl(e){let t;return _t.tap(o=>{let r=o?.theme.override?.[e.tagName];r?t?t.replace(r).catch(n=>console.error(n)):e.shadowRoot?.adoptedStyleSheets.push(t??=Ve(r)):t&&t.replaceSync("")})}function Ve(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function pr(e,t=""){let o=Ve(t);return N(e).adoptedStyleSheets.push(o),o}function p(e){let t;return o=>{let r=N(o);if(r.adoptedStyleSheets.push(t??=Ve(e)),!o[or])return U.css&&r.adoptedStyleSheets.unshift(gl??=Ve(U.css)),o[or]=!0,bl(o)}}var Yr=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Fa=[...Yr,"inherit"];function Or(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function gf(e,t,o="transparent"){return`color-mix(in srgb, var(--cxl-color-${e}) ${t}%,${o})`}function q(e){return`${Or(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}function yl(){let e={inherit:"color:inherit;background-color:inherit;",transparent:"color:inherit;background-color:transparent;"};for(let t of Yr)e[t]=`
${Or(t)}
${t==="inverse-surface"?Or("inverse-primary","primary"):""}
`;return e}var Da=yl(),Ra=(e="")=>`${e?`:host(${e})`:":host"} { 
	--cxl-color-surface: transparent; 
	border-style: solid; 
	border-color: var(--cxl-color-on-surface); 
	border-width: 1px; 
	box-shadow: none;
}
${Yr.map(t=>`:host(${e}[color=${t}]) { --cxl-color-on-surface: var(--cxl-color--${t}); }`).join("")}
`;function jt(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function E(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}function xf(){cancelAnimationFrame(La)}var La=requestAnimationFrame(()=>Sl()),Pa={},ka=document.createElement("template"),Sa={};function vl(e){return function(t){let o=e(t),r=Sa[o];if(r){let a=r.cloneNode(!0);if(a instanceof SVGSVGElement)return a}let n=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=()=>(n.dispatchEvent(new ErrorEvent("error")),"");return fetch(o).then(a=>a.ok?a.text():i(),i).then(a=>{if(!a)return;ka.innerHTML=a;let c=ka.content.children[0];if(!(c instanceof SVGSVGElement))return;let l=c.getAttribute("viewBox");l?n.setAttribute("viewBox",l):c.hasAttribute("width")&&c.hasAttribute("height")&&n.setAttribute("viewBox",`0 0 ${c.getAttribute("width")} ${c.getAttribute("height")}`);for(let g of c.childNodes)n.append(g);Sa[t.name]=n}).catch(a=>console.error(a)),n.setAttribute("fill","currentColor"),n}}var wl=vl(({name:e,width:t,fill:o})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${o?"fill1_":""}${t}px.svg`)),Va=wl;function hf(e){Va=e}function bf(e){Pa[e.id]=e}function Ut(e,t={}){let{width:o,height:r}=t;o===void 0&&r===void 0&&(o=r=24);let n=Pa[e]?.icon()??Va({name:e,width:o,fill:t.fill});return t.className&&n.setAttribute("class",t.className),o&&(n.setAttribute("width",`${o}`),r===void 0&&n.setAttribute("height",`${o}`)),r&&(n.setAttribute("height",`${r}`),o===void 0&&n.setAttribute("width",`${r}`)),t.alt&&n.setAttribute("alt",t.alt),n}var Br,kl=new Promise(e=>{Br=()=>{_t.next(void 0),e()}});function Sl(e){cancelAnimationFrame(La),ya||(e&&(e.colors&&(U.colors=e.colors),e.globalCss&&(U.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(ya=Ve(`html{${Aa(U.colors)}}${U.globalCss}`)),U.imports?Promise.allSettled(U.imports.map(t=>{let o=document.createElement("link");return o.rel="stylesheet",o.href=t,document.head.append(o),new Promise((r,n)=>(o.onload=r,o.onerror=n))})).then(Br,t=>console.error(t)):Br())}function lt(){return fo(async()=>{await kl,await document.fonts.ready})}var _r=class extends u{type;details};s(_r,{tagName:"c-action",init:[m("type"),m("details")],augment:[Y,y,e=>F(e).tap(()=>{e.type&&K(e,e.type,e.details)})]});function El(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.controller??t.target}function Cl(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.target}function Se(e,t,o){return new A(r=>{let n={id:e,controller:o,target:t};$e().subscribe({next:()=>K(t,`registable.${e}`,n),signal:r.signal}),r.signal.subscribe(()=>n.unsubscribe?.())})}function fr(e,t,o,r){return new A(n=>{function i(c){let l=Cl(e,c);c.unsubscribe=()=>{let C=o.indexOf(l);C!==-1&&o.splice(C,1),r?.({type:"disconnect",target:l,elements:o}),n.next()};let g=o.indexOf(l);g!==-1&&o.splice(g,1);let v=0,k=o.length;for(;v<k;){let C=v+k>>1,M=o[C];if(!M)break;M.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING?v=C+1:k=C}o.splice(v,0,l),r?.({type:"connect",target:l,elements:o}),n.next()}let a=oe(t,`registable.${e}`).subscribe(i);n.signal.subscribe(a.unsubscribe)})}function ct(e,t,o=new Set){let r=ra();return f(oe(t,`registable.${e}`).map(n=>{let i=n.target,a=El(e,n);return n.unsubscribe=()=>{o.delete(a),r.next({type:"disconnect",target:a,element:i,elements:o})},o.add(a),{type:"connect",target:a,element:i,elements:o}}),r)}function jr(e){return e in U.animation}function ge({target:e,animation:t,options:o}){if(U.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in U.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?U.animation[t]:t,n=typeof r.kf=="function"?r.kf(e):r.kf,i={duration:250,easing:U.easing.emphasized,...r.options,...o,...U.prefersReducedMotion?{duration:0}:void 0};return e.animate(n,i)}function xo(e){let{trigger:t,stagger:o,commit:r,keep:n}=e;function i(c){return new A(l=>{let g=ge(c);g.ready.then(()=>l.next({type:"start",animation:g}),v=>{console.error(v)}),g.addEventListener("finish",()=>{l.next({type:"end",animation:g}),r&&g.commitStyles(),!(n||n!==!1&&c.options?.fill&&(c.options.fill==="both"||c.options.fill==="forwards"))&&l.complete()}),l.signal.subscribe(()=>{try{g.cancel()}catch{}})})}let a=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return f(...a.map((c,l)=>{let g={...e.options,delay:o!==void 0?(e.options?.delay??0)+l*o:e.options?.delay};return(t==="visible"?Zo(c).filter(k=>k):t==="hover"?Dr(c):I(!0)).switchMap(k=>k?i({...e,options:g,target:c}):w)}))}var pt;function Oa(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function Al(e){return e==="infinite"?1/0:+e}function Nl(e){if(jr(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let o={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(g,v,k)=>(v&&(r=+v),(k==="replace"||k==="add"||k==="accumulate")&&(o.composite=k),"")),pt??=document.createElement("style").style,pt.animation=e;let n=pt.animationFillMode;(n==="none"||n==="forwards"||n==="backwards"||n==="both")&&(o.fill=n);let i=o.fill==="forwards"||o.fill==="both",a=t?void 0:Oa(pt.animationDuration);a!==void 0&&(o.duration=a);let c=Oa(pt.animationDelay);c!==void 0&&(o.delay=c),pt.animationIterationCount&&(o.iterations=Al(pt.animationIterationCount));let l=pt.animationName;if(!jr(l))throw new Error(`Animation "${l}" not defined`);return{animation:l,keep:i,stagger:r,options:o}}function Ml(e){return typeof e=="string"&&(e=e.split(",").map(t=>Nl(t.trim()))),e}function ho(e,t,o,r){let n=r?`motion-${r}-on`:"motion-on",i=Ml(o);return e.setAttribute(n,""),f(...i.map(a=>xo({target:t,...a}))).finalize(()=>e.removeAttribute(n))}var Xt=p(":host(:not([open],[motion-out-on])){display:none}");function Qe(e,t=()=>e,o=!1){let r=X(()=>I(t("in"))),n=X(()=>I(t("out"))),i=X(()=>e.duration!==void 0&&e.duration!==1/0?qe(e.duration).map(()=>e.open=!1):w).log();return f(oe(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),V(d(e,"motion-in").map(a=>(a?r.mergeMap(c=>ho(e,c,a,"in")):r).mergeMap(()=>i)),d(e,"motion-out").map(a=>(a?n.switchMap(c=>ho(e,c,a,"out")):n).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([a,c])=>D(e,"open").switchMap(l=>{if(e.popover!=="auto"){let g=l?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:l?"closed":"open",newState:g}))}return l?o?We(c,a):a:o?We(c,a):c})))}var Oe=class extends u{open=!1;duration;"motion-in";"motion-out"};s(Oe,{init:[m("motion-in"),m("motion-out"),me("duration"),h("open")]});var bo=class extends Oe{};s(bo,{tagName:"c-toggle-target",augment:[p(`
:host{display:contents}
`),e=>{let t=x("slot"),o=x("slot",{name:"off"});return(e.open?o:t).style.display="none",N(e).append(t,o),Qe(e,r=>{t.style.display=o.style.display="none";let n=e.open?r==="in"?t:o:r==="in"?o:t;return n.style.display="",n.assignedElements()},!0)}]});var Ur={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(o){console.error(o)}}};function jf(e){return(t,o)=>t[e]>o[e]?1:t[e]<o[e]?-1:0}function Ze(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let o,r=e.getRootNode();return r instanceof ShadowRoot&&(o=r.getElementById(t),o)?o:e.ownerDocument.getElementById(t)??void 0}function ur(e,t){return d(e,t).map(o=>typeof o=="string"?Ze(e,o):o instanceof HTMLElement?o:void 0)}async function Uf(e,...[t]){try{return e instanceof Response?await e.json():JSON.parse(Ba(e))}catch{if(t!==void 0)return t;throw t}}function Xf(e,...[t]){try{return JSON.parse(Ba(e))}catch{if(t!==void 0)return t;throw t}}function Ba(e,t){return e?typeof e=="string"?e:new TextDecoder(t).decode(e):""}var et=class extends u{};s(et,{tagName:"c-span"});var Xr=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},fe=new Xr;var mr=(e,t,o=e)=>F(e).tap(()=>K(o,"toggle.close",t)),nu=(e,t,o=e)=>F(e).tap(()=>K(o,"toggle.open",t));function dr(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(o=>{let r=Ze(e,o);return r?[r]:[]}):Array.isArray(t)?t:[t]}function qr(e,t,o,r,n=b(e,"click").map(()=>!o())){return f(r,n).switchMap(i=>{let a=t();return a?Le(a.map(c=>({target:c,open:i}))):w})}function kt(e,t=e){function o(i,a){return[d(e,"open").switchMap(c=>(i.parentNode||fe.popupContainer.append(i),i.open=c,c&&i instanceof u&&"open"in i?D(i,"open").map(l=>{e.open&&l===!1&&(e.open=!1)}):w)),it(i).tap(c=>{let l=i.getAttribute("role");(l==="menu"||l==="listbox"||l==="tree"||l==="grid"||l==="dialog")&&(a.ariaHasPopup=l),a.getRootNode()===i.getRootNode()&&a.setAttribute("aria-controls",c)})]}let r=V(d(e,"trigger"),d(e,"target")).switchMap(([i])=>{let a=dr(e),c=a?f(...a.flatMap(l=>o(l,e))).ignoreElements():w;return f(i==="hover"?V(Rr(t),a?f(...a.map(l=>Rr(l))):w).map(l=>!!l.find(g=>!!g)).debounceTime(250):i==="checked"?b(t,"change").map(l=>l.target&&"checked"in l.target?!!l.target.checked:!1):b(t,"click").map(l=>(l.stopPropagation(),!e.open)),c)}),n;return ia().switchMap(()=>qr(t,()=>dr(e),()=>e.open,d(e,"open"),r).filter(i=>{let{open:a,target:c}=i;if(e.open!==a){if(a){let l=vt(e)?.activeElement;n=l instanceof HTMLElement?l:void 0,c.trigger=e}else if(c.trigger&&c.trigger!==e)return i.open=!0,c.trigger=e,!0;return e.open=a,!1}if(!a&&c.trigger===e){let l=document.activeElement;(l===document.body||l===document.documentElement)&&n?.focus()}return!0}))}var ft=class extends u{open=!1;target;trigger};s(ft,{init:[m("target"),m("trigger"),h("open")],augment:[e=>kt(e).raf(({target:t,open:o})=>t.open=o)]});var Wr=class extends ft{};s(Wr,{tagName:"c-toggle",augment:[Y,y]});var St=class extends Oe{};s(St,{tagName:"c-details",augment:[p(`
:host { display: block; }
:host(:not([open],[motion-out-on])) #body {display:none}
		`),e=>{let t=x("slot",{id:"body"}),o=x("slot",{id:"header",name:"header"});return N(e).append(o,t),f(qr(o,()=>[e],()=>e.open,d(e,"open")).raf(({open:r})=>{e.open=r}),Qe(e,()=>t))}]});var $r=class extends u{panels=new Set};s($r,{tagName:"c-accordion",augment:[e=>ct("accordion",e,e.panels),e=>b(e,"toggle",{capture:!0}).tap(t=>{let o=t.target;if(o instanceof St&&o.open&&e.panels.has(o))for(let r of e.panels)r!==o&&(r.open=!1)})]});var ue=class extends u{name="";width;height;alt;fill=!1};s(ue,{tagName:"c-icon",init:[m("name"),m("width"),m("height"),m("fill"),m("alt")],augment:[S("none"),p(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,o;return e.shadowRoot?.adoptedStyleSheets.push(t),Vt(e).switchMap(()=>Ht(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,n=e.height??e.width;if(t.replace(`:host{${r===void 0?"":`width:${r}px;`}${n===void 0?"":`height:${n}px`}}`).catch(i=>{}),o?.remove(),o=e.name?Ut(e.name,{className:"icon",width:r,height:n,fill:e.fill,alt:e.alt}):void 0,o){let i=o;i.onerror=()=>{e.alt&&i.replaceWith(e.alt)},N(e).append(i)}})}]});function Kr(e){return d(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function Tl(e,t=e,o=0){let r=t.hasAttribute("tabindex")?t.tabIndex:o;return Kr(e).tap(n=>{n?t.removeAttribute("tabindex"):t.tabIndex=r})}function Il(e,t=e){return f(b(t,"focusout").tap(()=>e.touched=!0),f(D(e,"disabled"),D(e,"touched")).tap(()=>K(e,"focusable.change")))}function Ee(e,t=e,o=0){return f(Tl(e,t,o),Il(e,t))}function Ha(e,t,o=e.getBoundingClientRect()){let r=o.width>o.height?o.width:o.height,n=new gr,i=e.shadowRoot||e,a=t instanceof MouseEvent?t.x:1/0,c=t instanceof MouseEvent?t.y:1/0,l=!t||mo(t),g=a>o.right||a<o.left||c>o.bottom||c<o.top;return n.x=l||g?o.width/2:a-o.left,n.y=l||g?o.height/2:c-o.top,n.radius=r,t||(n.duration=0),i.prepend(n),n}function Ya(e,t=e){let o,r,n,i=()=>{o=Ha(t,r instanceof Event?r:void 0,n),o.duration=600,r=void 0};return f(b(e,"click").tap(a=>{r=a,n=t.getBoundingClientRect()}),d(e,"selected").raf().switchMap(()=>{if(e.selected){if(!o?.parentNode){if(!e.checkVisibility())return r=void 0,Vt(e).tap(i);i()}}else o&&_a(o).catch(a=>console.error(a));return w})).ignoreElements()}function _a(e){return new Promise(t=>{ge({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function se(e,t=e){let o=!1,r=0;return f(b(t,"pointerdown"),b(t,"click")).tap(n=>n.cxlRipple??=e).raf().mergeMap(n=>{if(n.cxlRipple===e&&!o&&!e.disabled&&e.parentNode){r=Date.now(),o=!0,e.style.setProperty("--cxl-mask-hover","none");let i=Ha(e,n),a=i.duration,c=()=>{e.style.removeProperty("--cxl-mask-hover"),_a(i).catch(()=>{}).finally(()=>{o=!1})};return n.type==="click"?qe(a).tap(c):f(b(document,"pointerup"),b(document,"pointercancel")).first().map(()=>{let l=Date.now()-r;setTimeout(()=>c(),l>a?32:a-l)})}return w})}var gr=class extends u{x=0;y=0;radius=0;duration=500};s(gr,{tagName:"c-ripple",init:[m("x"),m("y"),m("radius")],augment:[p(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",W(()=>{let o=t.style;o.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,o.width=o.height=e.radius*2+"px",t.parentNode||N(e).append(t),ge({target:t,animation:"expand",options:{duration:e.duration}}),ge({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var Et=[O,st,p(`
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
}`)],zl=p(`
:host {
	${E("label-large")}
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
`);function Gr(e){return d(e,"disabled").switchMap(t=>t?w:Jo(e).tap(o=>{o.stopPropagation(),e.click()}))}function Ne(e){return f(Gr(e),Ee(e))}var Wt=class extends u{disabled=!1;touched=!1};s(Wt,{init:[h("disabled"),h("touched")],augment:[S("button"),Ne]});var Be=class extends Wt{size;color;variant};s(Be,{tagName:"c-button",init:[J("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),ae("color","primary"),h("variant")],augment:[...Et,zl,se,y]});var yo=class extends St{constructor(){super(),this["motion-in"]="openY",this["motion-out"]="closeY"}};s(yo,{tagName:"c-accordion-panel",augment:[S("region"),p(`
:host {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-bottom: 1px solid var(--cxl-color-outline-variant);
}
#body {
	display: block;
	overflow: hidden;
}
		`),e=>Se("accordion",e)]});var Jr=class extends u{disabled=!1;touched=!1};s(Jr,{tagName:"c-accordion-header",init:[h("disabled")],augment:[S("button"),p(`
:host {
	${E("title-small")}
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
		`),O,e=>{let t=new ue;t.name="keyboard_arrow_down",t.id="icon",t.role="none",e.slot||="header",N(e).append(t,document.createElement("slot"));let o=e.parentElement;return o instanceof yo?f(it(o).tap(r=>e.setAttribute("aria-controls",r)),d(o,"open").tap(r=>{t.classList.toggle("open",r),e.ariaExpanded=String(r)})):w},Ne]});var Ct=class extends u{outline=!1;color};s(Ct,{tagName:"c-alert",init:[h("outline"),ae("color","inverse-surface")],augment:[S("alert"),p(`
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
	${E("body-medium")}
}
	${Ra("[outline]")}`),y]});function Fl(e){if("message"in e&&typeof e.message=="string")return e.message;if("error"in e&&typeof e.error=="string")return e.error;if("status"in e&&typeof e.status=="number")return`HTTP ${e.status}${"statusText"in e&&typeof e.statusText=="string"&&e.statusText?` ${e.statusText}`:""}`;if("toString"in e&&typeof e.toString=="function"&&e.toString!==Object.prototype.toString)return e.toString();if(Object.keys(e).length===0)return"Unknown Error"}function Dl(e){if(e==null)return"Unknown Error";if(typeof e=="string")return e||"Unknown Error";if(e instanceof Response)return`HTTP ${e.status} ${e.statusText}`;if(e instanceof Error)return e.message||"Unknown Error";if(typeof e=="object"){let t=Fl(e);if(t)return t}if(typeof e=="symbol"||typeof e=="function")return String(e);try{return JSON.stringify(e)||"Unknown Error"}catch{return String(e)||"Unknown Error"}}var Qr=class extends Ct{color="error";error};s(Qr,{tagName:"c-alert-error",init:[H("error")],augment:[e=>d(e,"error").tap(t=>{e.textContent=Dl(t)})]});var Zr=[p(`
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
	${E("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${E("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${E("headline-medium")}
	flex-wrap: wrap;
}`),y,()=>x("slot",{name:"title"})];function Rl(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var vo=class extends u{size;sticky=!1;contextual};s(vo,{tagName:"c-appbar",init:[h("size"),h("sticky"),h("contextual")],augment:[p(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...Zr,()=>x("slot",{name:"contextual"}),e=>d(e,"sticky").switchMap(t=>t?Qo(e,{threshold:[1]}).tap(o=>e.toggleAttribute("scroll",o.intersectionRatio<1)):w),e=>{let t;return f(Ko(e),d(e,"contextual")).raf().switchMap(()=>{for(let o of e.children)if(Rl(o)&&(o.slot="contextual",o.open=o.name===e.contextual,o.open))return t=o,b(o,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,w})}]});var en=class extends u{};s(en,{tagName:"c-appbar-title",augment:[S("heading"),Yt("level","1"),p(`
:host {
	display: block;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
}
	`),y]});var wo=class extends Be{};s(wo,{tagName:"c-button-round",augment:[p(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var Me=class extends wo{icon="";width;height;fill=!1;variant="text";alt};s(Me,{tagName:"c-icon-button",init:[m("icon"),m("width"),m("height"),m("alt"),m("fill")],augment:[e=>x(ue,{className:"icon",width:d(e,"width"),height:d(e,"height"),name:d(e,"icon"),fill:d(e,"fill"),alt:d(e,"alt")})]});var Md=1440*60*1e3,Ll=/^\s*(\d{1,2})\s*:\s*(\d{1,2})\s*(?::(\d{1,2})\s*)?([pPaA][mM])?/,Pl=/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;function Vl(e){let t=Ll.exec(e);if(t){let o=new Date,r=+(t[1]??0),n=t[4]?.toLowerCase()==="pm";return o.setHours(n?r+12:r),o.setMinutes(+(t[2]??0)),o}return new Date(NaN)}function Ol(e){let t=new Date(Pl.test(e)?`${e}T00:00`:e);return isNaN(t.getTime())&&(t=Vl(e)),t}function ja(e,t,o){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(o,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(o,{dateStyle:t,timeStyle:t})}function Ua(e){return m(e,{parse:t=>t?Ol(t):void 0})}function Xa(e,t,o){return typeof o=="string"?ja(t,o,e):t.toLocaleString(e,o)}var tn={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function Bl(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var ko={content:tn,name:"default",localeName:Bl(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>Xa(ko.localeName,e,t)},Hl={content:tn,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>Xa("en-US",e,t)};function Yl(){let e=ye(ko),t={default:ko,en:Hl},o={},r=e.map(a=>a.content);async function n(a){let c=a.split("-")[0];if(!c)return ko;if(!(t[a]??t[c])){let g=o[a]??o[c];g&&await g()}return t[c]||ko}async function i(a){e.next(await n(a))}return navigator.language&&n(navigator.language).then(a=>e.next(a)).catch(a=>console.error(a)),{content:r,registeredLocales:t,locale:e,setLocale:i,getLocale(a){return a?fo(()=>n(a)):e},get(a,c){return r.map(l=>l[a]??"")},register(a){t[a.name]=a}}}var Q=Yl();function Ld(e){return V(Q.locale,d(e,"locale")).switchMap(([t,o])=>o?Q.getLocale(o):I(t))}function qt(e){return Object.assign(tn,e),Q.get}function Pd(e,t){return Q.locale.map(o=>o.formatDate(e,t))}function Vd(e){return t=>t?Q.locale.map(o=>o.formatDate(t,e)):I("")}function Od(e,t,o=Q.locale){let r=new Date,n=t==="xsmall"?"narrow":t==="small"?"short":"long";return r.setDate(r.getDate()-r.getDay()+e),o.map(i=>i.formatDate(r,{weekday:n}))}var Wa=class e extends u{name;size;open=!1;backIcon=x(Me,{icon:"arrow_back",className:"icon",ariaLabel:Q.get("core.close"),$:t=>F(t).tap(()=>this.open=!1)});static{s(e,{tagName:"c-appbar-contextual",init:[m("name"),h("open"),h("size")],augment:[t=>t.backIcon,...Zr,p(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>D(t,"open").tap(o=>{o||t.dispatchEvent(new Event("close"))})]})}};function qa(e=document){document.documentElement.lang="en";let t=[x("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),x("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),x("meta",{name:"mobile-web-app-capable",content:"yes"}),x("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${E("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function $a(e=2e3){return f(qe(e),lt()).first()}function Ka(e){return $a().raf(()=>e.setAttribute("ready",""))}function xr(e){return f(W(t=>{let o=qa(e.ownerDocument);t.signal.subscribe(()=>o.forEach(r=>r.remove()))}),$e().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),$a().switchMap(()=>cr(e).raf(t=>e.setAttribute("breakpoint",t))),Ka(e),ar.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var on=class extends u{connectedCallback(){requestAnimationFrame(()=>qa(this.ownerDocument)),super.connectedCallback()}};s(on,{tagName:"c-meta",augment:[()=>Ka(document.body)]});function Ga(e,t,o){o==="in"&&(e.style.display="");let r=e.offsetWidth,n=ge({target:e,animation:{kf:{[t]:o==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});o==="out"&&(n.onfinish=()=>e.style.display="none")}var rn=class extends u{sheetstart=!1;sheetend=!1};s(rn,{tagName:"c-application",init:[h("sheetstart"),h("sheetend")],augment:[p(`
:host {
	display: flex;
	position: absolute;
	inset: 0;
	${q("surface")}
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
${jt()}
	`),xr,e=>oe(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>oe(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=x("slot",{name:"start"}),o=x("slot",{id:"body"}),r=x("slot",{name:"end"}),n=Ve("html { overflow: hidden }");return N(e).append(t,o,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),fe.popupContainer=e,f(W(i=>{let a=e.ownerDocument.adoptedStyleSheets;a.push(n),i.signal.subscribe(()=>{let c=a.indexOf(n);c!==-1&&a.splice(c,1)})}),D(e,"sheetstart").tap(i=>Ga(t,"marginLeft",i?"in":"out")),D(e,"sheetend").tap(i=>Ga(r,"marginRight",i?"in":"out")))}]});var nn=class extends u{assertive=!1};s(nn,{tagName:"c-aria-live",init:[m("assertive")],augment:[Ea,y,e=>d(e,"assertive").tap(t=>{e.role=t?"alert":"status",e.ariaLive=t?"assertive":"polite",e.ariaAtomic="true"})]});var _l=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,jl=/^\d{5}(?:[-\s]\d{4})?$/,Ul={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},Ja={required:Jl,email:Ql,json:tc,zipcode:Zl,nonZero:Kl,nonEmpty:$l},Xl={pattern:Gl,equalToElement:an(ts),greaterThan:Za,lessThan:es,greaterThanElement:an(Za),lessThanElement:an(es),min:rc,max:nc,equalTo:ts,maxlength:ic,minlength:ac},Wl=qt(Ul);function an(e){return(t,o)=>{let r=typeof t=="string"?Ze(o,t):t;if(!r)throw"Invalid element";return e(r)}}function He(e,t){return{key:e,valid:t,message:Wl(`validation.${e}`,"validation.invalid")}}function ql(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function $l(e){return He("nonEmpty",!ql(e))}function Kl(e){return He("nonZero",e===""||Number(e)!==0)}function Gl(e){let t=typeof e=="string"?e=new RegExp(e):e;return o=>He("pattern",typeof o=="string"&&(o===""||t.test(o)))}function sn(e){return e!=null&&e!==""}function Jl(e,t){let o=t&&"checked"in t?!!t.checked:!0;return He("required",o&&sn(e))}function Ql(e){return He("email",typeof e=="string"&&(e===""||_l.test(e)))}function Zl(e){return He("zipcode",typeof e=="string"&&(e===""||jl.test(e)))}function ec(e){if(typeof e!="string")return!1;try{return JSON.parse(e),!0}catch{return!1}}function tc(e){return He("json",ec(e))}function oc(e){return e instanceof HTMLElement&&"value"in e}function So(e,t,o){let r=oc(t)?d(t,"value"):t instanceof A?t:I(t);return n=>r.map(i=>He(e,!sn(n)||!sn(i)||o(n,i)))}function Qa(e,t){let o=/(\w+)(?:\(([^)]+?)\))?/g,r=[],n;for(;n=o.exec(e);){let i=n[1];if(!i)throw`Invalid rule "${i}"`;if(n[2]){let a=Xl[i];if(!a)throw`Invalid rule "${i}"`;r.push(a(n[2],t))}else if(i in Ja){let a=Ja[i];a&&r.push(a)}else throw`Invalid rule "${i}"`}return r}function os(e,t){let o=(typeof e=="string"?Qa(e,t):e).flatMap(r=>typeof r=="string"?Qa(r,t):r);return(r,n)=>o.map(i=>{let a=i(r,n);return a instanceof A?a:a instanceof Promise?Le(a):I(a)})}function rc(e){return So("min",e,(t,o)=>Number(t)>=Number(o))}function Za(e){return So("greaterThan",e,(t,o)=>Number(t)>Number(o))}function nc(e){return So("max",e,(t,o)=>Number(t)<=Number(o))}function es(e){return So("lessThan",e,(t,o)=>Number(t)<Number(o))}function ts(e){return So("equalTo",e,(t,o)=>t===o||typeof t!=typeof o&&String(t)===String(o))}function ic(e){return t=>He("maxlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length<=+e)}function ac(e){return t=>He("minlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length>=+e)}function sc(e){return rs(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function $t(e){return D(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||Pe(e,"change",{bubbles:!0})})}function rs(e){return f(d(e,"value"),d(e,"checked")).map(()=>{})}var le=class e extends u{static formAssociated=!0;inputValue;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{s(e,{init:[h("autofocus"),h("invalid"),h("disabled"),h("touched"),m("rules"),h("name"),H("validationResult"),rr("update")],augment:[t=>(t.defaultValue=t.value,f(Se("form",t),D(t,"invalid").tap(()=>Pe(t,"invalid")),d(t,"invalid").switchMap(o=>{if(o){if(t.setAria("invalid","true"),!t.validationMessage)return Q.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return w}),W(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),d(t,"rules").switchMap(o=>{if(!o)return w;let r=os(o,t);return rs(t).switchMap(()=>f(...r(t.value,t)).tap(n=>t.setValidity(n))).finalize(()=>t.resetValidity())}),d(t,"value").tap(o=>t.setFormValue(o)),d(t,"validationResult").switchMap(o=>!o||o.valid?w:o.message instanceof A?o.message:o.message===void 0?Q.get("validation.invalid"):I(o.message)).tap(o=>{t.setCustomValidity(o)}))),sc]})}get labels(){return pe(this).labels}get validity(){return pe(this).validity}get validationMessage(){return pe(this).validationMessage}reportValidity(){return pe(this).reportValidity()}checkValidity(){return pe(this).checkValidity()}setCustomValidity(t){let o=!!t,r=t!==this.validationMessage;this.applyValidity(o,t),this.invalid!==o?this.invalid=o:r&&Pe(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,o){o?this.setAttribute(`aria-${t}`,o):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let o in this.validMap){let r=this.validMap[o];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,o){pe(this).setValidity({customError:t},o)}formDisabledCallback(t){this.disabled=t}setFormValue(t){pe(this).setFormValue(t==null?null:String(t))}};function lc(e,t){let o,r=t.key;if(r==="ArrowDown"&&e.goDown)o=e.goDown();else if(r==="ArrowRight"&&e.goRight)o=e.goRight();else if(r==="ArrowUp"&&e.goUp)o=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)o=e.goLeft();else if(r==="Home")o=!t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")o=!t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)o=e.other(t);else return null;return t.stopPropagation(),o&&t.preventDefault(),o}function tt(e){return b(e.host,"keydown").map(t=>lc(e,t)).filter(t=>!!t)}function cc(e){return new A(t=>{let o=e.focus;e.focus=()=>{o.call(e),t.next()},t.signal.subscribe(()=>e.focus=o)})}function Eo({host:e,observe:t,getFocusable:o,getSelected:r,getActive:n=()=>ln(e)}){let i=[];function a(){let c=i.find(l=>!l.disabled&&!l.hidden&&l.checkVisibility());c&&(c.tabIndex=0)}return f(b(e,"focusin").tap(()=>{let c=n(),l=!1;for(let g of i)g.tabIndex=g===c?(l=!0,0):-1;l||a()}),(t??I(!0)).tap(()=>{i=o();let c=i.find(g=>g.tabIndex===0);if(c){for(let g of i)g!==c&&(g.tabIndex=-1);return}let l=r?.();l?l.tabIndex=0:a()}),e instanceof HTMLElement?cc(e).tap(()=>{let c=o();(c.find(g=>g.tabIndex===0)??c.at(0))?.focus()}):w).ignoreElements()}function ln(e){let t=vt(e)?.activeElement??document.activeElement??void 0;return t instanceof HTMLElement?t:void 0}function Co({getFocusable:e,getActive:t}){return(o=1,r,n=i=>!i.checkVisibility())=>{let i=t(),a=e(),c=r??(i?a.indexOf(i):-1),l;do l=a.at(c+=o);while(l&&n(l));return l}}function Sm(e){let{host:t,getFocusable:o,orientation:r,observe:n}=e,i=Co(e),a=[];function c(l){l instanceof HTMLElement&&l.focus({focusVisible:!0})}return f((n??I(!0)).tap(()=>a=o()),Eo(e),tt({host:t,...r==="horizontal"?{goRight:()=>i(1),goLeft:()=>i(-1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>i(1,-1),goLast:()=>i(-1,a.length),other:e.customKey}).tap(c))}function hr({host:e,input:t,handleOther:o=!1,axis:r}){let n=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function i(k=1){if(e.open===!1){e.open=!0;let C=n();requestAnimationFrame(()=>{C?.focused&&g(C)})}else return a(k)}function a(k=1,C){let M=n(),T=C??(M?e.options.indexOf(M):-1),P;do P=e.options.at(T+=k);while(P?.hidden);return P}function c(k){let C=k.key;if(/^\w$/.test(C)){let M=n(),T=M?e.options.indexOf(M):-1;if(T===-1)return;let P=T;P+1>=e.options.length&&(T=0);let B=new RegExp(`^\\s*${C}`,"i"),_;for(;_=e.options.at(++T);)if(!_.hidden&&_.textContent.match(B))return _;if(P===0)return;for(T=0;T<P&&(_=e.options.at(T++));)if(!_.hidden&&_.textContent.match(B))return _}}let l=()=>e.options.find(k=>k.focused);function g(k){for(let C of e.options)C.focused=!1;k?(k.focused=!0,t?.setAria("activedescendant",Ke(k)),k.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let v=k=>K(k,"selectable.action",k);return f(tt({host:t??e,...r==="x"?{goLeft:()=>i(-1),goRight:()=>i(1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>e.open!==!1?a(1,-1):void 0,goLast:()=>e.open!==!1?a(-1,e.options.length):void 0,other:o?c:void 0}).tap(k=>{e.open===!1?v(k):g(k)}),b(t??e,"focus").tap(()=>g(n())),Ot(t??e,"Enter").tap(k=>{let C=l();e.open!==!1&&C?(k.stopPropagation(),v(C)):e.open===!1&&(e.open=!0)}))}function cn(e){return new A(t=>{f(fr("selectable",e,e.options,o=>{if(o.type==="connect"&&(o.target.view=e.optionView,o.target.selected))return e.defaultValue===void 0&&(e.defaultValue=o.target.value),t.next(o.target);let r;for(let n of e.options)n.hidden||!n.parentNode||n.selected&&(r?n.selected=!1:r=n);t.next(r)}),oe(e,"selectable.action").tap(o=>{if(!e.disabled&&e.options.includes(o)){let r=e.value!==o.value;t.next(o),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var ut=Symbol("unselected"),Kt=class e extends le{options=[];_value;_selected=ut;static{s(e,{init:[m("value"),H("selected")],augment:[t=>cn(t).tap(o=>{(!o||o!==t.selected)&&t.setSelected(o)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===ut?this.options[0]?.value:this._value}get selected(){return this._selected===ut&&this.options[0]?this.options[0]:this._selected===ut?void 0:this._selected}set value(t){if(this._selected&&this._selected!==ut&&this._selected.value===t){this._value=t;return}else for(let o of this.options)if(o.value===t){this._value=t,this.setSelected(o);return}this._selected!==ut?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let o of this.options)o.focused=o.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==ut&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=ut)}};function Gt(e,t,...o){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let[n,i]of Object.entries(t??{}))n!=="children"&&r.setAttribute(n==="className"?"class":n,i===void 0?"":String(i));return o.length&&r.append(...o),r}function At(e){return Gt("svg",e,Gt("path",{d:e.d}))}function pc({host:e,target:t,position:o,onToggle:r,whenClosed:n=w}){return i=>(t.popover??="auto",t.togglePopover(i),r?.(i),i?f(ee(e),b(window,"resize"),b(window,"scroll",{capture:!0,passive:!0})).tap(o):n)}function ns(e){let{host:t,beforeToggle:o,target:r}=e,n=pc({...e,whenClosed:F(t).tap(()=>{t.open=!0})});return f(b(r,"toggle").tap(i=>{let a=i.newState==="open";t.open=a}),d(t,"open").raf().switchMap(i=>(o?.(i),t.ariaExpanded=i?"true":"false",n(i))))}function is(e){return f(d(e,"selected").pipe(ga(e,"selected")),Se("selectable",e),F(e).tap(()=>K(e,"selectable.action",e)))}var pn=class extends u{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};s(pn,{tagName:"c-option",init:[m("value"),H("view"),h("selected"),h("hidden"),h("focused")],augment:[S("option"),p(":host{display:contents}"),$t,is,e=>{let t;return f(d(e,"view").switchMap(o=>o?(t?.remove(),e.rendered=t=new o,t.appendChild(x("slot")),N(e).append(t),f(d(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),d(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,w)))}]});var Ao=class extends u{invalid=!1};s(Ao,{tagName:"c-field-help",init:[m("invalid")],augment:[p(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${E("body-small")}
}
	`),y,e=>(e.slot||="help",d(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Nt=p(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${E("body-large")}
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
	${E("body-small")}
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
`),un=p(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${E("body-small")}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`),fc=p(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${E("body-large")}
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

${Ge(".content")}
	`);function uc(e){return f(oe(e,"registable.form",!1).tap(t=>{t.id==="form"&&t.target instanceof le&&(e.input=t.target)}),ct("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var dc=()=>x("div",{className:"content"},x("slot",{name:"leading"}),x("div",{className:"body"},x("slot",{name:"label"}),x("slot",{id:"bodyslot"})),x("slot",{name:"trailing"}),x("div",{className:"indicator"}));function mc(e){function t(v){n.next(v.touched&&v.invalid),e.toggleAttribute("invalid",n.value);let k=0,C=[];for(let T of a.assignedNodes())!(T instanceof HTMLElement)||T===g||("invalid"in T&&T.invalid?n.value&&(T.invalid===!0||typeof T.invalid=="string"&&T.invalid===v.validationResult?.key)?(k++,T.style.display="",C.push(Ke(T))):T.style.display="none":C.push(Ke(T)));let M=!n.value||k>0;g.textContent=M?"":v.validationMessage,M?g.remove():(g.parentElement||e.append(g),C.push(Ke(g))),C.length?v.setAria("describedby",C.join(" ")):v.setAria("describedby",null)}function o(v){let k=e.input;if(k){if(e.toggleAttribute("inputdisabled",k.disabled),t(k),!v)return;v.type==="focus"?i.next(!0):v.type==="blur"&&i.next(!1)}}function r(){let v=e.input?.value,k=!e.input?.hasAttribute("autofilled")&&(!v||Array.isArray(v)&&v.length===0);l?.classList.toggle("novalue",k),l?.classList.toggle("value",!k)}let n=ye(!1),i=ye(!1),a=x("slot",{name:"help"}),c=e.contentElement.children[1]?.children[0],l=c instanceof HTMLSlotElement?c:void 0,g=x(Ao,{ariaLive:"polite"});return N(e).append(x("div",{className:"help"},a)),f(d(e,"input").switchMap(v=>v?f(I(void 0).tap(()=>{o(),queueMicrotask(r)}),b(v,"focusable.change").tap(o).tap(r),b(v,"focus").tap(o),b(v,"invalid").tap(o),b(v,"update").tap(r),D(v,"touched").tap(()=>o()),f(b(v,"blur"),b(a,"slotchange")).raf(o),b(e.contentElement,"click").tap(()=>{document.activeElement!==v&&!e.matches(":focus-within")&&!i.value&&v.focus()})):w),uc(e))}var Te=class e extends u{floating=!1;input;size;contentElement=dc();static{s(e,{init:[h("floating"),H("input"),J("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,mc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},fn=class extends Te{};s(fn,{tagName:"c-field",augment:[Nt,un,fc]});var gc=p(`
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
`),as=p(`
${lr("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function xc(e,t){return()=>{let o=e.parentElement instanceof Te?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${o.bottom}px`,t.style.left=`${o.x}px`,t.style.minWidth=`${o.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-o.bottom-16,280)}px`}}function mn({host:e,target:t,input:o,position:r,beforeToggle:n,onToggle:i,handleOther:a,axis:c}){return f(hr({host:e,input:o,handleOther:a,axis:c}),b(o??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),ns({host:e,target:t,position:r??xc(e,t),beforeToggle:n,onToggle:i}))}function hc(e){let{host:t}=e;return f(gc(t)??w,O(t)??w,Ee(t),mn(e))}var Jt=class extends u{};s(Jt,{tagName:"c-select-option",augment:[p(`
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
		`),y]});var dn=class extends Kt{open=!1;optionView=Jt;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let o of this.options)o!==t&&(o.slot="");t&&(t.slot="selected")}}};s(dn,{tagName:"c-select",init:[h("open")],augment:[S("listbox"),p(`
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
	${q("surface-container")}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),e=>{let t=x("div",{className:"menu"},x("slot")),o=x("slot",{name:"selected"}),r=t.style,n=pr(e),i=0,a=0;N(e).append(t,o,At({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function c(){if(e.open)a=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let l=e.options.reduce((g,v)=>Math.max(g,v.rendered?.offsetWidth??0),0);n.replaceSync(`:host{width:min(100%,${l}px)}`)}}return f(f(Vt(e),lt()).raf(c),hc({host:e,target:t,handleOther:!0,beforeToggle(l){c();let g=e.selected;g&&(g.slot=l?"":"selected"),t.classList.toggle("open",l)},onToggle(l){let g=e.selected;!l&&g&&(i=g.rendered?.offsetHeight??0)},position(){let l=e.parentElement??e,g=Math.round((a-i)/2),v=e.selected?.rendered,k=l.getBoundingClientRect(),C=e.getBoundingClientRect(),M=C.top-14,T,P=v?v.offsetTop:0;P>M&&(P=M),T=t.scrollHeight;let B=window.innerHeight-C.top+8+P,_=C.top-g-P;T>B?T=B:T<C.height&&(T=C.height),r.top=_+"px",r.left=k.left+"px",r.maxHeight=T+"px",r.minWidth=k.width+"px",r.transformOrigin=`${P}px`}}))}]});function gn(e){let t=uo();return f(Se("field",e,o=>t.next(o)),t)}function Qt(e){return gn(e).switchMap(t=>d(e,"input").switchMap(o=>o?I(o):d(t,"input").switchMap(r=>r?I(r):w)))}function No(e,t,o){return d(e,o).tap(r=>go(t,o,r))}var bc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function Ye({host:e,input:t,toText:o,toValue:r,update:n}){t.className="cxl-native-input",t.setAttribute("style",bc),t.setAttribute("form","__cxl_ignore__");function i(l){e.value=r?r(t.value||""):t.value,l.stopPropagation(),e.dispatchEvent(new Event(l.type,{bubbles:!0}))}function a(){let l=e.value,g=o?o(l,t.value):l==null?"":String(l);t.value!==g&&e.setInputValue(g)}function c(){t.ariaLabel=e.ariaLabel;let l=e.getAttribute("aria-labelledby");l?t.setAttribute("aria-labelledby",l):t.removeAttribute("aria-labelledby")}return f(Ee(e,t),X(()=>(c(),t.form?b(t.form,"reset").tap(i):w)),d(e,"value").tap(()=>{o&&t.matches(":focus")||a()}),b(t,"blur").tap(a),b(t,"input").tap(i),b(t,"change").tap(i),No(e,t,"disabled"),No(e,t,"name"),No(e,t,"autocomplete"),No(e,t,"spellcheck"),No(e,t,"autofocus"),Go(e,["aria-label","aria-labelledby"]).tap(c),n?n.tap(a):w,b(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),b(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var Zt=class e extends le{autocomplete;inputValue="";static{s(e,{init:[H("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,b(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,o){o?this.inputEl.setAttribute(`aria-${t}`,o):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,o){pe(this).setValidity({customError:t},o,this.inputEl),this.inputEl.setCustomValidity(t?o||"Invalid Field":"")}};var hn=[p(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),O],Mo=[...hn,y],Ie=class e extends Zt{autofilled=!1;static{s(e,{init:[h("autofilled"),m("autocomplete")],augment:[t=>b(t.inputEl,"animationstart").tap(o=>{(o.animationName==="cxl-onautofillstart"||o.animationName==="cxl-onautofillend")&&(t.autofilled=o.animationName==="cxl-onautofillstart",K(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,o){this.inputEl.setSelectionRange(t,o)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},xn=class extends Ie{value="";inputEl=x("input",{className:"input"})};s(xn,{tagName:"c-input-text",init:[m("value")],augment:[...Mo,e=>e.append(e.inputEl),e=>Ye({host:e,input:e.inputEl})]});function yc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var br=class e extends Ie{selected;value;inputEl=x("input",{className:"input"});static{s(e,{tagName:"c-input-option",init:[m("value"),H("selected")],augment:[...Mo,t=>t.append(t.inputEl),t=>Ye({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:o=>o!==""?t.selected?.value:void 0}),t=>D(t,"selected").tap(o=>{let r=t.selected?.textContent;t.value=o?.value,t.setInputValue(r??""),yc(t.inputEl)})]})}};function vc(e){return bn(e,"^")}function bn(e,t=""){if(e==="")return()=>!0;let o=wc(e,t);return r=>r.textContent?o.test(r.textContent):!1}function wc(e,t="",o="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),o)}var yr=class e extends u{optionView=Jt;open=!1;debounce=100;options=[];matcher=bn;static{s(e,{tagName:"c-autocomplete",init:[h("open"),me("debounce")],augment:[S("listbox"),as,Y,t=>{let o=x("slot",{name:"empty"}),r=x("div",{id:"menu",tabIndex:-1},x("slot"),o),n=At({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});n.style.cursor="pointer",o.style.display="none";function i(l){t.open=!0,c(l)}function a(l,g){l.setAria("activedescendant",Ke(g)),g.rendered?.scrollIntoView({block:"nearest"})}function c(l){let g=l.inputValue??l.value,v=t.doSearch(g);o.style.display=v?"none":"",v&&a(l,v)}return N(t).append(r,n),f(Qt(t).switchMap(l=>(l.setAria("autocomplete","list"),l.role="combobox",l.setAria("controls",Ke(t)),l.setAria("haspopup",t.role),l.setAttribute("autocomplete","off"),f(d(t,"open").tap(g=>{if(g)n.tabIndex=-1,i(l);else{for(let v of t.options)v.focused=!1;n.tabIndex=0,l.setAria("activedescendant",null)}l.setAria("expanded",String(g))}),f(Jo(n),b(n,"mousedown")).tap(g=>{g.preventDefault(),g.stopPropagation(),l.focus()}).debounceTime(100).tap(()=>{t.open=!0}),d(t,"debounce").switchMap(g=>b(l,"input").debounceTime(g).tap(()=>t.open?c(l):i(l))),b(t,"change").tap(g=>{g.target===t&&l.dispatchEvent(new Event("change",{bubbles:!0}))}),mn({host:t,target:r,input:l}),f(cn(t),D(l,"value").map(g=>{for(let v of t.options)if(v.value===g)return v})).tap(g=>{for(let v of t.options)v.focused=v.selected=!1;g&&(g.selected=!0),l instanceof br?l.selected=g:l.value=g?.value,g&&(t.open=!1)})))))}]})}doSearch(t){let o=0,r,n=this.matcher==="substring"?bn:this.matcher==="prefix"?vc:this.matcher,i=t?n(String(t)):void 0;for(let a of this.options){let c=!i?.(a);a.hidden=c,a.focused=!(c||o++>0),a.focused&&(r=a)}return r}};var yn=class extends yr{onsearch;doSearch(t){return Pe(this,"search",{detail:String(t)}),this.options[0]}};s(yn,{tagName:"c-autocomplete-dynamic",init:[rr("search")]});var kc=p(`
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
	${E("title-large")}
}
svg,img { width: 100%; height: 100%; }
`),vn=class extends u{size;src="";text=""};s(vn,{tagName:"c-avatar",init:[J("size",e=>`{
				width: ${30+e*8}px;
				height: ${30+e*8}px;
				font-size: ${18+e*4}px;
			}`),m("src"),m("text")],augment:[kc,e=>{let t;return V(d(e,"src"),d(e,"text")).raf(([o,r])=>{t?.remove(),o?(t=new Image,t.alt=e.text,t.src=o):r?t=new Text(r):t=Ut("person"),N(e).append(t)})}]});var wn=class extends u{};s(wn,{tagName:"c-body",augment:[p(`
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

${L("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),y]});var vr=class extends u{};s(vr,{tagName:"c-button-segmented-view",augment:[p(`
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
		`),st,se,()=>x(ue,{id:"check",name:"check"}),y]});var kn=class extends Kt{optionView=vr;size};s(kn,{tagName:"c-button-segmented",init:[J("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[S("listbox"),p(`
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
	${E("label-large")}
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
		`),O,y,Ee,e=>hr({host:e,axis:"x"})]});var Sn=class extends Wt{};s(Sn,{tagName:"c-button-text",augment:[...Et,p(`
:host {
	${E("label-large")}
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
		`),se,y]});function En(e="block"){let t=(o=>{for(let r=12;r>0;r--)o.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,o.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,o.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,o.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,o.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return o})({xl:"",lg:"",md:"",sm:"",xs:""});return p(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${L("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${L("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${L("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${L("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var Cn=p(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${jt()}
${Je.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${Je.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),eo=class extends u{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};s(eo,{init:[h("sm"),h("xs"),h("md"),h("lg"),h("xl"),h("vpad"),h("pad"),h("center"),h("fill"),h("grow"),h("elevation"),ae("color")]});var To=class extends eo{};s(To,{tagName:"c-c",augment:[Cn,En(),p(":host([center]) { text-align: center}"),y]});var Sc=p(`
:host {
	${q("surface-container")}
	${E("body-medium")}
	border-radius: var(--cxl-shape-corner-medium);
	overflow: hidden;
}
:host([variant=elevated]:not([color])) {
	--cxl-color-surface: var(--cxl-color-surface-container-low);
	z-index: 1;
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=outlined]:not([color])) {
	${q("surface")}
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline-variant);
}
${jt()}
`),Io=class extends To{variant};s(Io,{tagName:"c-card",init:[h("variant")],augment:[Sc]});var Ec=p(`
:host { ${sr} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function Cc(e){return f(Se("list",e),d(e,"selected").tap(t=>e.ariaSelected=String(t)))}function Nn(e){return f(Gr(e),Ee(e,e,-1),Cc(e))}var _e=class extends u{disabled=!1;touched=!1;selected=!1};s(_e,{init:[h("disabled"),h("touched"),h("selected")],augment:[Nn]});var An=class extends _e{size};s(An,{tagName:"c-item",init:[J("size",e=>`{min-height:${56+e*8}px}`)],augment:[Ec,O,st,S("option"),y,se]});var Mn=class extends Io{disabled=!1;touched=!1;selected=!1};s(Mn,{tagName:"c-card-item",init:[h("disabled"),h("touched"),h("selected")],augment:[S("option"),...Et,p(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),Nn,se]});function Tn(e){return f(V(d(e,"indeterminate"),d(e,"checked")).map(([t,o])=>e.ariaChecked=t?"mixed":String(o)),f(F(e).tap(()=>{e.disabled||(e.indeterminate&&(e.indeterminate=!1),e.checked=!e.checked)}),d(e,"checked").tap(()=>{pe(e).setFormValue(e.checked?String(e.value):null)}),D(e,"checked").tap(()=>{e.dispatchEvent(new Event("change",{bubbles:!0}))})).ignoreElements())}var ss=class e extends le{value="on";checked=!1;indeterminate=!1;defaultChecked=!1;static{s(e,{tagName:"c-checkbox",init:[m("value"),m("checked"),m("indeterminate")],augment:[S("checkbox"),p(`
:host {
	position: relative;
	display: flex;
	column-gap: 16px;
	align-items: center;
	outline: none;
	cursor: pointer;
	text-align: start;
	padding: 15px;
	${E("body-large")}
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
${Ge(".mask")}
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
`),Ne,O,t=>{t.defaultChecked=t.checked;let o=x("div",{className:"mask"}),r=x("div",{className:"box"},At({className:"check",viewBox:"0 0 24 24",d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),At({className:"minus",viewBox:"0 0 24 24",d:"M19 13H5v-2h14v2z"}),o);return N(t).append(r,x("slot")),f(se(o,t),Tn(t).tap(n=>r.setAttribute("state",n)))}]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){pe(this).setFormValue(this.checked?String(t):null)}};var zo=class extends u{color;size=0};s(zo,{tagName:"c-pill",init:[ae("color","surface-container-low"),J("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[p(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${E("label-large")}
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
		`),()=>x("slot",{name:"leading"}),y,()=>x("slot",{name:"trailing"})]});var In=class extends zo{disabled=!1;touched=!1;selected=!1};s(In,{tagName:"c-chip",init:[h("disabled"),h("touched"),h("selected")],augment:[S("button"),Ne,...Et,p(`
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
	${q("secondary-container")}
}
:host(:hover) { box-shadow: none; }
		`),se]});var zn=class extends u{date;format;locale};s(zn,{tagName:"c-date",init:[Ua("date"),m("format"),m("locale")],augment:[e=>V(d(e,"locale").switchMap(t=>Q.getLocale(t)),d(e,"date"),d(e,"format")).raf(([t,o,r])=>e.textContent=o?t.formatDate(o,r):"")]});qt({"dialog.close":"Close dialog","dialog.cancel":"Cancel","dialog.ok":"Ok"});var Dn=(e,t,o=e)=>F(e).tap(()=>K(o,"dialog.close",t)),Rn=p(`
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
	${q("surface-container-high")}
	
	box-sizing: border-box;
	min-width: 280px;
	max-width: calc(100% - 24px);
	padding: 24px;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-3);
	border-radius: var(--cxl-shape-corner-xlarge);
}

dialog::backdrop { background-color: var(--cxl-color-scrim); }

${L("small",".content { max-height: 85%; }")}
	`),to=class extends u{static=!1;open=!1;fullscreen=!1;dialog=document.createElement("dialog");returnValue};s(to,{init:[m("static"),m("open"),h("fullscreen")],augment:[Y,e=>b(e,"keydown").tap(t=>{t.key==="Escape"&&(t.preventDefault(),e.open=!1)}),e=>b(e.dialog,"close").tap(()=>e.open=!1),e=>e.dialog,e=>d(e,"open").tap(t=>{t?e.static?e.dialog.show():fe.openModal({element:e.dialog,close:()=>e.open=!1}):e.dialog.open&&(e.dialog.close(),Pe(e,"close"))}),e=>oe(e,"dialog.close").tap(t=>{e.returnValue=t,e.open=!1})]});var Fn=class extends to{};s(Fn,{tagName:"c-dialog",augment:[Rn,e=>{e.dialog.append(x("slot",{className:"content"}))}]});function wr(e,t,...o){let r=x(e,t,...o);return new Promise(n=>{let i=()=>{r.removeEventListener("close",i),r.remove(),n(r.returnValue)};r.addEventListener("close",i),r.parentNode||document.body.append(r),r.open=!0})}var Mt=class extends to{};s(Mt,{tagName:"c-dialog-basic",augment:[Rn,p(`
dialog {
	display:flex; flex-direction:column;row-gap:16px;
	max-width: min(calc(100% - 24px), 560px);
}
slot[name=title] { ${E("title-large")} }
slot[name=actions] {
	display:flex; column-gap: 24px; align-items: center; justify-content: end; margin-top:8px;
}
		`),e=>{e.dialog.append(x("slot",{name:"title"}),x("slot"),x("slot",{name:"actions"}))}]});function Oh(e){let t=[],{message:o,title:r,action:n}=typeof e=="string"?{message:e}:e;return r&&t.push(x("div",{slot:"title"},r)),t.push(x(et,void 0,o),x(Be,{$:mr,variant:"text",slot:"actions"},n??Q.get("dialog.ok"))),wr(Mt,{},...t)}function Wh(e){let t=[];typeof e=="string"&&(e={message:e});let{message:o,title:r,action:n,cancelAction:i}=e;return r&&t.push(x("div",{slot:"title"},r)),t.push(x(et,void 0,o),x(Be,{variant:"text",slot:"actions",$:a=>Dn(a,!1)},i??Q.get("dialog.cancel")),x(Be,{variant:"text",slot:"actions",$:a=>Dn(a,!0)},n??Q.get("dialog.ok"))),wr(Mt,{},...t)}var Ln=class extends u{motion;target};s(Ln,{tagName:"c-dismiss",init:[m("motion"),m("target")],augment:[Y,y,e=>ur(e,"target").switchMap(t=>t?F(e).tap(()=>{e.motion?ho(e,t,e.motion).finalize(()=>t.remove()).subscribe():t.remove()}):w)]});function Pn(e,{target:t,clientX:o,clientY:r},n,i){if(!(t instanceof HTMLElement))throw new Error("Invalid Event Target");return{type:e,target:t,clientX:o,clientY:r,startX:n,startY:i}}function Ac(){let e={},t=ye(e),o=new de;return{dragging:t,dropping:o,elements:e,next:()=>t.next(e)}}var dt=Ac();function Nc(e){return({target:t,moveTarget:o,delay:r})=>{let n=!1,i=0;r??=60;let a=o||t,c=t.style,{userSelect:l,transition:g}=c;return new A(v=>{function k(z,$=!0){n?(n=!1,a.style.transition=g,B?.unsubscribe(),v.next(z),delete dt.elements.mouse,$&&dt.dropping.next({element:a,event:z}),dt.next()):clearTimeout(i)}let C=0,M=0;function T(z){n&&z.key==="Escape"&&(z.preventDefault(),k({type:"end",target:t,clientX:0,clientY:0,startX:C,startY:M},!0))}function P(z,$){if(a.style.transition="none",!!t.isConnected){try{t.setPointerCapture($)}catch(ve){console.error(ve)}n=!0,v.next(Pn("start",z,C,M)),B=b(window,"keydown").tap(T).subscribe()}}l=c.userSelect,c.userSelect="none";let B,_=f(e(t).switchMap(z=>{if(z.type==="pointerdown"){g=a.style.transition,z.preventDefault(),C=z.clientX,M=z.clientY;let $=z.pointerId;n=!1,i=setTimeout(P,r,z,$)}else if(z.type==="pointermove"){if(n){let $=Pn("move",z,C,M);v.next($),dt.elements.mouse={element:a,event:$},dt.next()}}else return clearTimeout(i),I(z);return w}).debounceTime().tap(z=>k(Pn("end",z,C,M))),b(t,"click",{capture:!0}).tap(z=>{n&&z.target===t&&z.stopImmediatePropagation()})).subscribe();v.signal.subscribe(()=>{_.unsubscribe(),B?.unsubscribe(),c.userSelect=l})})}}function Mc(e){return e.style.touchAction||(e.style.touchAction="none"),b(e,"pointerdown").switchMap(t=>t.currentTarget?new A(o=>{o.next(t);let r=f(b(window,"pointermove").tap(n=>o.next(n)),f(b(window,"pointercancel"),b(window,"pointerup")).tap(n=>{o.next(n),r.unsubscribe()})).subscribe();o.signal.subscribe(()=>r.unsubscribe())}):w)}var Tc=Nc(Mc);function Vn(e){return Tc(e)}function ls(e,t){let o=t.clientX,r=t.clientY;return e.left<o&&e.right>o&&e.top<r&&e.bottom>r}function Ic(e){let t=dt.elements,o=[],r;for(let n in t){let i=t[n];if(!i)continue;let{event:a,element:c}=i;c!==e&&(r||=e.getBoundingClientRect(),ls(r,a)&&o.push({type:"over",target:e,relatedTarget:c,clientX:a.clientX,clientY:a.clientY}))}return o}function zc(e){let t=0;return dt.dragging.switchMap(()=>{let o=Ic(e);return t===0&&o.length===0?w:(t=o.length,I(o))})}function Fc(e){return zc(e).switchMap(t=>t.length===0?I({type:"out",target:e,clientX:0,clientY:0}):Le(t))}function Dc(e){return dt.dropping.switchMap(({element:t,event:o})=>e!==t&&ls(e.getBoundingClientRect(),o)?I({type:"drop",target:e,clientX:o.clientX,clientY:o.clientY,relatedTarget:t}):w)}function Rc(e,t){return{width:e.offsetWidth,height:e.offsetHeight,x:t.clientX,y:t.clientY,sx:t.clientX/e.offsetWidth,sy:t.clientY/e.offsetHeight}}function Lc({target:e,moveTarget:t,axis:o}){let r;return n=>{let i=t||e;if(n.type==="start")r=Rc(i,n);else if(n.type==="end")i.style.transform="",r=void 0;else if(r){let a=o==="y"?0:(n.clientX-r.x)/r.width,c=o==="x"?0:(n.clientY-r.y)/r.height;return I({event:n,x:a,y:c,sx:r.sx,sy:r.sy})}return w}}function Pc(e){return({x:t,y:o})=>{let r=(e.moveTarget||e.target).style;r.transform=`translate(${t*100}%, ${o*100}%)`}}function cs(e){let t=0;return f(b(e,"dragenter").tap(o=>{++t===1&&e.setAttribute("dragover",""),o.stopPropagation()}),b(e,"dragleave").tap(()=>{--t===0&&e.removeAttribute("dragover")}),b(e,"dragover").tap(o=>o.preventDefault()),b(e,"drop").tap(o=>{o.preventDefault(),o.stopPropagation(),e.removeAttribute("dragover"),t=0})).filter(o=>o.type==="drop")}function ps(e){let t=e.moveTarget||e.target;return f(Vn(e).tap(o=>{o.type==="start"?t.toggleAttribute("dragging",!0):o.type==="end"&&t.toggleAttribute("dragging",!1)}).switchMap(Lc(e)).tap(Pc(e)).ignoreElements(),Fc(t).tap(o=>t.toggleAttribute("dragover",o.type==="over")),Dc(t))}var fs=class e extends u{dragging=!1;dragover=!1;target;static{s(e,{tagName:"c-drag-handle",init:[h("dragging"),h("dragover")],augment:[y,p(`
:host { display: block; cursor:grab; position: relative; touch-action: none; }
:host([dragging]) { z-index: 10 }
		`),t=>ur(t,"target").switchMap(o=>ps({target:t,moveTarget:o,delay:150}).tap(r=>t.handleDrag?.(r)))]})}};var Fo=class extends u{center=!1};s(Fo,{tagName:"c-backdrop",init:[h("center")],augment:[p(`
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

	`),e=>b(e,"keydown").tap(t=>t.stopPropagation()),y]});var Do=class extends Oe{};s(Do,{tagName:"c-toggle-panel",augment:[y,Xt,Qe]});var Vc=p(`
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
${L("small","#drawer { width: 360px }")}

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
`),Ro=class extends u{open=!1;position;responsive;permanent=!1};s(Ro,{tagName:"c-drawer",init:[h("open"),h("position"),m("responsive"),m("permanent")],augment:[Vc,p(`
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
`),e=>{let t=ye(!1),o=f(d(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",n=x(Do,{id:"drawer","motion-in":o.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":o.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},y),i=new Fo;i.id="backdrop";let a=x("dialog",{id:"dialog"},i,n);return N(e).append(a),f(b(n,"close").tap(()=>a.close()),b(a,"close").tap(()=>e.open=!1),oe(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),D(n,"open").tap(c=>e.open=c),D(e,"open").raf(c=>{c||n.scrollTo(0,0)}),b(i,"click").tap(()=>e.open=!1),b(a,"cancel").tap(c=>{c.preventDefault(),e.open=!1}),d(e,"open").tap(c=>{if(t.value&&e.permanent)return n.open=!0;c?t.value||(fe.openModal({element:a,close:()=>e.open=!1}),a.getBoundingClientRect()):fe.currentModal?.element===a&&fe.modalClosed()}).raf(c=>{n.open=c}),d(e,"responsive").switchMap(c=>c!==void 0?cr(document.body):I("xsmall")).switchMap(c=>{let l=U.breakpoints[e.responsive||"large"],g=U.breakpoints[c]>=l;return t.next(g),g&&n.className!=="permanent"?a.close():!g&&n.className==="permanent"&&(e.open=!1),g&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",g),n.className=g?"permanent":"drawer",D(e,"open").tap(v=>{e.hasAttribute("responsiveon")||ge({target:i,animation:v?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var On=class extends ft{icon="arrow_right"};s(On,{tagName:"c-dropdown",init:[m("icon")],augment:[p(`
:host { display: flex; gap: 0; align-items: center; cursor: pointer; }
.icon { transition: rotate var(--cxl-speed); height:24px; width:24px; translate: -7px; margin-right: -6px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x(ue,{className:"icon"});return e.shadowRoot?.append(t,x("slot")),f(d(e,"icon").tap(o=>t.name=o),b(e,"keydown").tap(o=>{o.key==="ArrowRight"?e.open=!0:o.key==="ArrowLeft"&&(e.open=!1)}))}]});var oo=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,o=this.end){let r=this.end.parentNode;r&&(this.start.parentNode||r.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),r.insertBefore(this.frag,o)):r.insertBefore(t,o))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let o=document.createRange();o.setStartAfter(this.start),o.setEndBefore(this.end),o.deleteContents()}};function ds({source:e,render:t,empty:o,append:r,loading:n}){let i=[],a=document.createDocumentFragment(),c,l;function g(v){if(l?.parentNode?.removeChild(l),!v)return;let k=0;for(let M of v){let T=i[k]?.item;if(T)T.value!==M&&T.next(M);else{let P=ye(M),B=t(P,k,v),_=B instanceof DocumentFragment?Array.from(B.childNodes):[B];i.push({elements:_,item:P}),a.append(B)}k++}a.childNodes.length&&r(a),c?.remove(),k===0&&o&&r(c=o());let C=i.length;for(;C-- >k;)i.pop()?.elements.forEach(M=>M.parentNode?.removeChild(M))}return X(()=>(l=n?.(),l&&r(l),e.raf(g)))}function Yb(e){return nr(()=>{let t=new oo;return[ds({...e,append:o=>t.insert(o)}),t.end]})}function Oc(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function Bc(e,t){let o=e.getRootNode();if(o instanceof Document)return Oc(o.getElementById(t));throw new Error("Invalid root node")}function us(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=Bc(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function Hc(e){return d(e,"template").switchMap(t=>t?I(us(e,t)):$e().map(()=>us(e,e.children[0])))}function Yc(e,t,o){return Hc(e).switchMap(r=>{let n=e.target?Ze(e,e.target)??e:e;return r?ds({source:t,render:o?(i,a,c)=>o(r(i,a,c)):r,append:i=>n.append(i)}):w})}var Bn=class extends u{source;template};s(Bn,{tagName:"c-each",init:[H("source"),H("template")],augment:[Y,y,e=>Yc(e,d(e,"source"))]});var Hn=class extends Te{};s(Hn,{tagName:"c-field-bar",augment:[Nt,p(`
:host {
	box-sizing: border-box;
	${q("surface-container-high")}
	${E("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var Yn=class extends Te{};s(Yn,{tagName:"c-field-frame",augment:[p(`
slot[name=label] { ${E("body-large")} }
		`),Nt]});var _n=class extends Te{};s(_n,{tagName:"c-field-outlined",augment:[Nt,un,p(`
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
	${E("body-large")}
	height: 0;
	top: var(--cxl-field-outlined-label-top, 16px);
	inset-inline-start: unset;
}
${Hr.map(e=>`:host([size="${e}"]) { --cxl-field-outlined-label-top: ${16+e*4}px }`)}
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
		`)]});var Lo=class extends eo{vflex=!1;gap;middle=!1};s(Lo,{tagName:"c-flex",init:[h("vflex"),h("gap"),h("middle")],augment:[En("flex"),Cn,p(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${Je.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),y]});var kr=class e extends u{elements=new Set;initialValue;static{s(e,{tagName:"c-form",augment:[S("form"),Y,t=>b(t,"submit",{capture:!0}).tap(o=>{o.preventDefault();let r;for(let n of t.elements)n.invalid&&(r??=n),n.touched=!0;r&&(r.focus(),o.stopPropagation(),o.stopImmediatePropagation())}),t=>ct("form",t,t.elements).tap(o=>{let r=o.target,n=r.name,i=t.initialValue;i&&n&&n in i&&(r.value=i[n])}),t=>Ot(t,"enter").tap(()=>t.submit()),y]})}checkValidity(){let t=!0;for(let o of this.elements)o.invalid&&(t=!1),o.touched=!0;return t}reset(){for(let t of this.elements)t.formResetCallback()}submit(){Pe(this,"submit")}requestSubmit(){this.submit()}getElementByName(t){for(let o of this.elements)if(o.name===t)return o}setTouched(t){for(let o of this.elements)o.touched=t}setFormData(t){this.initialValue=t;for(let o in t){let r=this.getElementByName(o);r&&(r.value=t[o])}}getFormData(){let t={};for(let o of this.elements){let r="checked"in o?o.checked?o.value:void 0:o.value;o.name&&(t[o.name]=r)}return t}};function _c(e){let t=e.parentElement;for(;t;){if(t instanceof HTMLFormElement||t instanceof kr)return t;t=t.parentElement}}var jn=class extends u{};s(jn,{tagName:"c-form-submit",augment:[Y,y,e=>X(()=>{let t=_c(e);return t?f(F(e).tap(()=>{if(t instanceof HTMLFormElement){let o;for(let r of t.elements)r instanceof le&&(r.invalid&&(o??=r),r.touched=!0);o?.focus()}t.requestSubmit()})):w})]});function jc(e){let t=new CSSStyleSheet;return N(e).adoptedStyleSheets.push(t),d(e,"columns").raf(()=>{let o=`repeat(${e.columns}, minmax(0,1fr))`;t.replaceSync(`:host{grid-template-columns:${o}}`)})}var Un=class extends u{rows;columns=12};s(Un,{tagName:"c-grid",init:[m("columns"),m("rows")],augment:[y,p(`
:host{display:grid;gap:16px;box-sizing:border-box;}
${L("medium",":host{gap:24px}")}
`),jc]});function Xn(e){return fr("list",e,e.items)}function Uc(e){return Eo({host:e,getFocusable:()=>e.items,getSelected:()=>e.items.find(t=>t.selected),getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),observe:Xn(e)})}function Xc(e){return Co({getFocusable:()=>e.items,getActive:()=>ln(e)})}function Sr(e){let t=Xc(e);return f(Uc(e),tt({host:e,goDown:()=>t(1),goUp:()=>t(-1),goFirst:()=>t(1,-1),goLast:()=>t(-1,e.items.length)}).tap(o=>o.focus()))}function Wc(e){let{host:t,getActive:o,getSelected:r}=e,n=e.columns?Math.max(1,Math.floor(e.columns)):void 0,i=[],a=(e.observe??aa(t)).tap(()=>{i=e.getFocusable()}),c=()=>i,l=Co({getFocusable:c,getActive:o});function g(k){if(n)return l(k*n);let C=o();if(!C)return;let M=C.getBoundingClientRect(),T=M.left+M.width/2,P=M.top+M.height/2,B,_=1/0;for(let z of i){if(z===C||z.disabled||!z.checkVisibility())continue;let $=z.getBoundingClientRect(),ve=$.left+$.width/2,j=($.top+$.height/2-P)*k;if(j<=0)continue;let Ce=j**2+(ve-T)**2;Ce<_&&(B=z,_=Ce)}return B}function v(k){if(!n)return;let C=o(),M=i.findIndex(P=>P===C);if(M===-1)return;let T=M-M%n;return i[Math.min(T+(k?n-1:0),i.length-1)]}return f(Eo({host:t,getFocusable:c,getActive:o,getSelected:r,observe:a}),tt({host:t,goRight:()=>{let k=o(),C=i.findIndex(M=>M===k);return n&&C%n===n-1?void 0:l(1)},goLeft:()=>{let k=o(),C=i.findIndex(M=>M===k);return n&&C%n===0?void 0:l(-1)},goFirst:()=>l(1,-1),goLast:()=>l(-1,i.length),goFirstColumn:()=>v(!1),goLastColumn:()=>v(!0),goUp:()=>g(-1),goDown:()=>g(1)}).tap(k=>k.focus()))}var Wn=class extends u{items=[]};s(Wn,{tagName:"c-grid-list",augment:[S("grid"),p(":host{display:grid;box-sizing:border-box;}"),y,e=>Wc({host:e,getFocusable:()=>e.items,getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),getSelected:()=>e.items.find(t=>t.selected),observe:Xn(e)})]});var qn=p(`
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
	${sr}
}

${L("small",`
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
${L("large",`
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
`),ro=class extends u{type;center=!1;full=!1};s(ro,{init:[h("type"),h("center"),h("full")]});var Po=class extends ro{};s(Po,{tagName:"c-layout",augment:[qn,()=>x("div",{id:"body",part:"body"},x("slot"))]});var Kn=p(`
:host { padding: 96px 16px; }
:host([dense]) { padding-top: 48px;padding-bottom:48px; }
${L("medium",":host {padding-left:32px;padding-right:32px}")}
${L("large",":host {padding-left:64px;padding-right:64px}")}
	`),$n=class extends Po{dense=!1;color;center=!0;type="block"};s($n,{tagName:"c-section",init:[h("dense"),ae("color")],augment:[Kn]});var Gn=class extends ro{dense=!1;color;center=!0;type="block"};s(Gn,{tagName:"c-hero",init:[h("dense"),ae("color")],augment:[Kn,qn,p(`
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
	${E("body-large")}
}
		`),()=>x("div",{id:"body",part:"body"},x("slot"))]});var Jn=class extends u{pad;vertical=!1};s(Jn,{tagName:"c-hr",init:[h("pad"),h("vertical")],augment:[S("separator"),p(`
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
${Je.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});function Zn(e){let t=document.createElement("style");return f(W(o=>{let r=e.persistkey&&Ur.get(e.persistkey);r!==void 0?e.open=r===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),o.signal.subscribe(()=>t.remove())}),Ht(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let o=e.open?e.themeon:e.themeoff;e.persistkey&&Ur.set(e.persistkey,o),za(Ma[o]||o)}),F(e).tap(()=>e.open=!e.open))}var Qn=class extends u{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};s(Qn,{tagName:"c-toggle-theme",init:[m("persistkey"),m("usepreferred"),m("open"),m("themeon"),m("themeoff")],augment:[S("group"),Zn]});var ei=class extends Me{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};s(ei,{tagName:"c-icon-toggle-theme",init:[m("persistkey"),m("usepreferred"),m("open"),m("themeon"),m("themeoff")],augment:[Zn,e=>V(d(e,"iconon"),d(e,"iconoff"),d(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var qc=e=>{let t;function o(){let r=document.adoptedStyleSheets.indexOf(t);r!==-1&&document.adoptedStyleSheets.splice(r,1)}addEventListener("message",r=>{if(r.source!==parent||r.origin!==e)return;let n=r.data.theme;o(),typeof n=="string"&&(t=new CSSStyleSheet,t.replace(n).catch(i=>console.error(i)),document.adoptedStyleSheets.push(t))})},$c=e=>{let t=()=>{let o=()=>{parent.postMessage({height:document.documentElement.scrollHeight},e==="null"?"*":e)};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(o).observe(document.documentElement)},r=>console.error(r))})};document.readyState==="complete"?t():addEventListener("load",t)},ti=class extends u{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=ie("iframe",{loading:"lazy"})};s(ti,{tagName:"c-iframe",init:[m("src"),m("srcdoc"),m("sandbox"),m("handletheme")],augment:[p(`
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
	`),e=>{let t=e.iframe,o=ie("slot",{name:"loading"}),r=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(r),o.style.display="none";function n(c){r.replaceSync(":host{height:"+c+"px}"),t.style.height="100%",t.style.opacity="1",o.style.display="none"}function i(c){if(c){let l=JSON.stringify(e.ownerDocument.location.origin),g=`<script type="module">
(${$c.toString()})(${l});
(${qc.toString()})(${l});
<\/script>`;t.srcdoc=`${e.reset}${c}${g}`,o.style.display=""}}async function a(c){let l=new URL(c);return`${l.search||l.hash?`<script>history.replaceState(0,0,'about:srcdoc${l.search}${l.hash}');<\/script>`:""}<base href="${c}" />`+await fetch(c).then(g=>g.text())}return N(e).append(t,o),f(V(d(e,"srcdoc"),d(e,"src")).raf(([c,l])=>{(async()=>{i(l?await a(l):c)})().catch(()=>{})}),b(window,"message").tap(c=>{let l=c.data.height;c.source===t.contentWindow&&typeof l=="number"&&n(l)}),d(e,"handletheme").switchMap(c=>c?b(t,"load").switchMap(()=>_t.raf(l=>{let g=l?.css??"",v=e.ownerDocument.location.origin,k=v==="null"||t.hasAttribute("sandbox")&&!t.sandbox.contains("allow-same-origin")?"*":v;t.contentWindow?.postMessage({theme:g},k)})):w),d(e,"sandbox").tap(c=>c===void 0?t.removeAttribute("sandbox"):t.sandbox.value=c))}]});var Kc=qt({"input.clear":"Clear input value"}),oi=class extends Me{icon="close"};s(oi,{tagName:"c-input-clear",augment:[e=>xa(e,Kc("input.clear")),e=>Qt(e).switchMap(t=>F(e).tap(()=>t.value=""))]});function Gc(e,t){return t.style.width="0",t.style.overflow="hidden",t.parentNode||e.append(t),f(f(b(t,"input"),b(t,"change")).map(o=>{if(o.stopPropagation(),e.dispatchEvent(new Event(o.type,{bubbles:!0})),t.files)return Array.from(t.files)}),F(e).tap(()=>t.click()).ignoreElements(),cs(e).map(o=>{if(o.stopPropagation(),o.dataTransfer?.files.length)return Array.from(o.dataTransfer.files)}))}var ri=class extends Zt{value=void 0;inputEl=ie("input",{tabIndex:-1,type:"file"})};s(ri,{tagName:"c-input-file",init:[H("value")],augment:[Y,y,e=>{let t=e.inputEl;return t.setAttribute("form","__cxl_ignore__"),e.append(t),f(Kr(e),Gc(e,t).tap(o=>{e.value=o}))}]});var ni=class e extends Ie{value=void 0;formatter=Jc;inputEl=x("input",{className:"input"});static{s(e,{init:[m("value")],augment:[y,t=>t.append(t.inputEl),t=>Ye({host:t,input:t.inputEl,toText:(o,r)=>o!==void 0&&isNaN(o)?r:t.formatter(o),toValue:o=>{if(o===""){t.setValidity({key:"number",valid:!0});return}let r=Number(o);return t.setValidity({key:"number",valid:!isNaN(r)}),r}})]})}},ii=class extends ni{};s(ii,{tagName:"c-input-number",augment:[...hn]});function Jc(e){return e===void 0||isNaN(e)?"":e.toString()}var ms=class e extends Ie{value="";inputEl=x("input",{type:"password",className:"input"});static{s(e,{tagName:"c-input-password",init:[m("value")],augment:[...Mo,t=>t.append(t.inputEl),t=>Ye({host:t,input:t.inputEl})]})}};var ai=class extends u{};s(ai,{tagName:"c-input-placeholder",augment:[p(`
:host {
	display: inline-block;
	pointer-events: var(--cxl-override-pointer-events, none);
	color: var(--cxl-color-on-surface-variant);
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
	`),y,e=>{let t=pr(e);return Qt(e).switchMap(o=>f(ee(o),d(o,"value"),d(o,"inputValue")).raf(()=>{let r=o.inputValue??o.value,n=r===void 0||r==="";t.replaceSync(`:host{top:${o.offsetTop}px;left:${o.offsetLeft}px;width:${o.offsetWidth}px;height:${o.offsetHeight}px;${n?"":"display:none;"}`)}))}]});var si=class extends u{};s(si,{tagName:"c-kbd",augment:[p(`
:host {
	box-sizing: border-box;
	display: inline-block;
	padding: 2px 8px;
	border-radius: var(--cxl-shape-corner-small);
	${q("surface-container-high")}
	${E("code")}
	border: 1px solid var(--cxl-color-outline-variant);
	box-shadow: var(--cxl-elevation-1);
}
		`),y]});function gs(e,t){return e?typeof e=="string"?(t.setAttribute("aria-label",e),w):it(e).tap(o=>{e.textContent&&t.setAttribute("aria-labelledby",o)}).finalize(()=>{t.removeAttribute("aria-labelledby")}):w}var li=class extends u{};s(li,{tagName:"c-label",augment:[p(`
:host {
	display: inline-block;
}`),y,e=>gn(e).switchMap(t=>"input"in t?d(t,"input").switchMap(o=>o?gs(e,o):w):gs(e,t)),e=>W(()=>{e.slot="label"})]});var ci=class extends u{items=[]};s(ci,{tagName:"c-list",augment:[p(":host{display:block;padding:8px 0;}"),S("listbox"),y,Sr]});var Qc=p(`
:host {
	position: fixed;
	margin: 0;
	padding: 0;
	outline: 0;
	border: 0;
	display: block;
	border-radius: var(--cxl-shape-corner-xsmall);
	box-shadow: var(--cxl-elevation-2);
	${q("surface-container")}
}
::backdrop { overflow: hidden; }
:host([static]) { position: static; }
	`);function Zc(e){function t(){e.exclusive&&!e.static&&fe.popupOpened({element:e,close:()=>e.open=!1}),e.static||(e.popover??="auto",e.showPopover())}return d(e,"open").switchMap(o=>o?(t(),f(b(e,"keydown").tap(r=>{r.key==="Escape"&&(e.open=!1,e.returnTo?.focus(),r.preventDefault(),r.stopPropagation())}),b(e,"toggle").tap(r=>{let n=r.newState==="open";n||(e.open=n)}),D(e,"open").tap(r=>{!r&&e.popover&&e.hidePopover()}),b(e,"close").tap(r=>{r.target===e&&e.popover&&e.hidePopover()}))):w)}var Vo=class extends Oe{exclusive=!0;static=!1;trigger;returnTo};s(Vo,{tagName:"c-popup",init:[m("exclusive"),h("static")],augment:[y,Xt,Qc,Qe,Zc]});var pi=class extends Vo{"motion-in"="fadeIn";"motion-out"="fadeOut";items=[];focusstart;setFocus(){let t=vt(this)?.activeElement;if(!(t&&this.contains(t))){if(this.focusstart==="selected"){let o=this.items.find(r=>r.selected);if(o){o.focus();return}}this.items[0]?.focus()}}};s(pi,{tagName:"c-menu",init:[m("focusstart")],augment:[S("menu"),p(lr()),Sr,e=>d(e,"open").tap(t=>{t&&e.setFocus()})]});var Bo=[p(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${E("label-large")}
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
${Ge("slot::after")}
	`),O,Ya,y],Oo=class extends _e{size};s(Oo,{tagName:"c-nav-item",init:[J("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("option"),...Bo]});var fi=class extends _e{icon="arrow_drop_down";open=!1;target;size};s(fi,{tagName:"c-nav-dropdown",init:[m("icon"),m("target"),h("open"),J("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("treeitem"),...Bo,p(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>kt(e).raf(({target:t,open:o})=>t.open=o),e=>{let t=x(ue,{className:"icon"});return N(e).append(t),f(d(e,"icon").tap(o=>t.name=o))}]});var Ho=class extends ft{icon="more_vert";motion};s(Ho,{tagName:"c-toggle-icon",init:[m("icon")],augment:[e=>{let t;return f(d(e,"icon").raf(o=>{if(!o)return t?.remove();t=Ut(o),N(e).append(t)}),d(e,"open").raf(()=>{t&&e.motion&&ge({target:t,animation:e.motion,options:{direction:e.open?"normal":"reverse",fill:"both"}})}))}]});var ui=class extends _e{icon="arrow_right";open=!1;target;size};s(ui,{tagName:"c-nav-tree-item",init:[m("icon"),m("target"),h("open"),J("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("treeitem"),...Bo,p(`
:host { padding-inline-start: 20px; }
.icon { position: absolute; inset-inline-start: 0px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x(Ho,{className:"icon"});N(e).append(t);function o(r){if(Array.isArray(r)){for(let n of r)if(n.childNodes.length)return!0}else if(r?.childNodes.length)return!0;return!1}return f(d(e,"icon").tap(r=>t.icon=r),d(e,"open").tap(r=>{e.ariaExpanded=String(r),t.open=r}),d(e,"target").switchMap(()=>{let r=dr(e),n=o(r);return t.style.display=n?"":"none",t.target=r,r?ba(e,Array.isArray(r)?r:[r]):w}),d(t,"open").tap(r=>e.open=r),b(e,"keydown").tap(r=>{r.key==="ArrowRight"?e.open=!0:r.key==="ArrowLeft"&&(e.open=!1)}))}]});var di=class extends bo{};s(di,{tagName:"c-nav-target",augment:[S("group"),p(":host{display:block;padding-inline-start:12px;}")]});var mi=class extends u{};s(mi,{tagName:"c-nav-headline",augment:[p(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),y]});var Yo=class extends Me{open=!1;target;icon="menu"};s(Yo,{tagName:"c-navbar-toggle",init:[m("target"),H("open")],augment:[e=>kt(e).tap(({target:t,open:o})=>t.open=o)]});var no=class extends Ct{duration=4e3;"motion-in"="slideInUp,fadeIn";"motion-out"="fadeOut";open=!1;static=!1};s(no,{tagName:"c-snackbar",init:[h("open"),me("duration"),m("motion-in"),m("motion-out"),m("static")],augment:[p(`
:host {
	display: inline-flex;
	justify-content: left;
	margin: 16px auto;
	border: 0; outline: 0;
	top: auto;
}
slot[name=action] { margin-inline-start: auto; display: block; }
	`),()=>x("slot",{name:"action"}),e=>d(e,"open").tap(t=>{t&&!e.static&&(e.popover="manual",e.showPopover())}),Xt,Qe,e=>b(e,"close").tap(()=>e.remove())]});var _o=class extends u{queue=[];notify(t){let o;return typeof t=="string"?o=x(no,void 0,t):t instanceof HTMLElement?o=t:o=x(no,t,t.content),new Promise(r=>{this.queue.push([o,r]),this.queue.length===1&&this.queue[0]&&this.notifyNext(this.queue[0])})}notifyNext([t,o]){let r=()=>{this.queue.shift(),t.removeEventListener("close",r),o(),this.queue[0]&&this.notifyNext(this.queue[0])};this.shadowRoot?.append(t),t.addEventListener("close",r),t.open=!0}};s(_o,{tagName:"c-snackbar-container",augment:[p(`
:host {
	position:relative; width: 100%; height: 0;
	display: flex; text-align:center; align-items: end;
	overflow: visible;
}`)]});var xs;function xw(e){let t;return typeof e=="string"?e={content:e}:e instanceof HTMLElement||(t=e.container),t||(t=xs??=new _o,t.parentNode||document.body.appendChild(t)),t.notify(e)}function hw(e){xs=e}var gi=class extends u{};s(gi,{tagName:"c-page",augment:[xr,p(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${q("background")}
}`),y]});var jo=class extends u{xs=!1;sm=!1;md=!1;lg=!1;xl=!1};s(jo,{tagName:"c-r",init:[h("xl"),h("lg"),h("md"),h("sm"),h("xs")],augment:[p(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${L("small",':host([sm]){display:contents}:host([sm="0"]){display:none}')}
${L("medium",':host([md]){display:contents}:host([md="0"]){display:none}')}
${L("large",':host([lg]){display:contents}:host([lg="0"]){display:none}')}
${L("xlarge",':host([xl]){display:contents}:host([xl="0"]){display:none}')}
	`),y]});var Tt=class extends Lo{};s(Tt,{tagName:"c-toolbar",augment:[p(`
:host {
	grid-column: 1 / -1;
	column-gap: 24px;
	row-gap: 8px;
	align-items: center;
	min-height: 48px;
	flex-wrap: wrap;
	flex-shrink: 0;
}
${L("small",":host{column-gap:24px}")}
		`)]});var xi=class extends u{};s(xi,{tagName:"c-page-appbar",augment:[p(`
:host { display: contents; }
#appbar { padding-top: 20px; padding-bottom: 20px; }
#toolbar { max-width: 1200px; width: 100%; margin: auto; gap: 16px; }
${L("small","#toolbar { gap: 24px; }")}
		`),e=>{let t=ie(Ro,{id:"drawer"},ie("nav",void 0,ie("slot",{name:"navbar"})));return ie(vo,{$:()=>da(e,"toggle.close",t,!0),id:"appbar",sticky:!0},ie(Tt,{id:"toolbar"},ie(jo,{xs:!0,md:0},ie(Yo,{ariaLabel:"Toggle navigation menu",target:t})),ie("slot")),t)}]});var hi=class extends u{value=1/0;color},hs={duration:2e3,iterations:1/0,easing:"cubic-bezier(0.4, 0, 0.6, 1)"};s(hi,{tagName:"c-progress",init:[m("value"),ae("color","primary",".bar")],augment:[S("progressbar"),Yt("valuemax","1"),p(`
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
	`),e=>{let t,o,r=x("div",{className:"bar"}),n=x("div",{className:"bar"});return N(e).append(r,n),d(e,"value").tap(i=>{i!==1/0&&i>1?i=1:i<0&&(i=0),e.ariaValueNow=i===1/0?null:String(i),e.ariaBusy=String(i!==1),e.toggleAttribute("indeterminate",i===1/0),i===1/0?(t=ge({target:r,animation:{kf:{transform:["translateX(-100%) scaleX(0.3)","translateX(0%) scaleX(0.8)","translateX(100%) scaleX(0.3)"]},options:hs}}),o=ge({target:n,animation:{kf:{transform:["translate(-150%, -100%) scaleX(0.4)","translate(-50%, -100%) scaleX(0.6)","translate(100%, -100%) scaleX(0.4)"]},options:hs}})):(t?.cancel(),o?.cancel()),r.style.transform=i===1/0?"":"scaleX("+i+")"})},$t]});var bi=class extends u{value=1/0};s(bi,{tagName:"c-progress-circular",init:[me("value")],augment:[S("progressbar"),Yt("valuemax","1"),p(`
:host {
	display: inline-block;
	width: 48px;
	height: 48px;
}
svg { width: 100%; height: 100% }
		`),e=>{let t=Gt("svg",{viewBox:"0 0 100 100"}),o=Gt("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-secondary-container);fill:transparent;stroke-width:10%;stroke-dasharray:282.743px"}),r=Gt("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-primary);fill:transparent;transition:stroke-dashoffset var(--cxl-speed);stroke-width:10%;transform-origin:center;stroke-dasharray:282.743px"});return t.append(o,r),N(e).append(t),d(e,"value").switchMap(n=>{if(e.ariaValueNow=n===1/0?null:String(n),e.ariaBusy=String(n!==1),n!==1/0){let a=282.743-282.743*Math.max(0,Math.min(1,n));r.style.strokeDashoffset=`${a}px`,r.style.transform="rotate(-90deg)"}return n===1/0?f(xo({target:e,animation:"spin",options:{iterations:1/0,duration:2e3,easing:"linear"}}),xo({target:r,animation:{options:{duration:4e3,iterations:1/0,easing:"cubic-bezier(.35,0,.25,1)"},kf:((i,a)=>[{offset:0,strokeDashoffset:i,transform:"rotate(0)"},{offset:.125,strokeDashoffset:a,transform:"rotate(0)"},{offset:.12501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.25,strokeDashoffset:i,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.2501,strokeDashoffset:i,transform:"rotate(270deg)"},{offset:.375,strokeDashoffset:a,transform:"rotate(270deg)"},{offset:.37501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5,strokeDashoffset:i,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5001,strokeDashoffset:i,transform:"rotate(180deg)"},{offset:.625,strokeDashoffset:a,transform:"rotate(180deg)"},{offset:.62501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.75,strokeDashoffset:i,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.7501,strokeDashoffset:i,transform:"rotate(90deg)"},{offset:.875,strokeDashoffset:a,transform:"rotate(90deg)"},{offset:.87501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(341.5deg)"},{offset:1,strokeDashoffset:i,transform:"rotateX(180deg) rotate(341.5deg)"}])((282.743*(1-.05)).toString(),(282.743*(1-.8)).toString())}})):w})},$t]});function yi({source:e,renderFn:t,loading:o,error:r}){return nr(()=>{let n=new oo,i=!1;return[f(o?qe(750).tap(()=>{i||n.insert(o())}):w,e.tap(a=>{i=!0,n.empty();let c=t(a);c&&n.insert(c)}).catchError(a=>{if(i=!0,r)return n.empty(),n.insert(r(a)),w;throw a})),n.end]})}function bs(e,t,o=()=>x(ue,{name:"star",fill:!0})){let r=[],n,i=0;for(;i<e;i++)n=o(i),n.classList.add(t),r.push(n);if(e!==i){let a=e+1-i;if(n&&a){let c=`${a*100}%`;n.style.clipPath=`polygon(0 0, ${c} 0, ${c} 100%, 0 100%)`}}return r}var vi=class extends u{max=5;rating=0;alt};s(vi,{tagName:"c-rating",init:[me("max"),me("rating"),h("alt")],augment:[S("img"),p(`
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
	`),e=>yi({source:d(e,"max"),renderFn:()=>x("span",void 0,...bs(e.max,"bgstar"))})(e),e=>yi({source:d(e,"rating"),renderFn:t=>x("span",{className:"group"},...bs(Number(t)>e.max?e.max:Number(t),"star"))})(e)]});var ep=/([^&=]+)=?([^&]*)/g,tp=/:([\w$@]+)/g,op=/\/\((.*?)\)/g,rp=/(\(\?)?:\w+/g,np=/\*\w+/g,ip=/[-{}[\]+?.,\\^$|#\s]/g,Mi="@@cxlRoute",ze={location:window.location,history:window.history};function ap(e){let t=[];return[new RegExp("^/?"+e.replace(ip,"\\$&").replace(op,"\\/?(?:$1)?").replace(rp,function(r,n){return t.push(r.slice(1)),n?r:"([^/?]*)"}).replace(np,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function sp(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function wi(e,t){return t?e.replace(tp,(o,r)=>t[r]||""):e}function lp(e){let t={},o;for(;o=ep.exec(e);)o[1]!==void 0&&(t[o[1]]=decodeURIComponent(o[2]??""));return t}var ki=class{path;regex;parameters;constructor(t){this.path=t=sp(t),[this.regex,this.parameters]=ap(t)}_extractQuery(t){let o=t.indexOf("?");return o===-1?{}:lp(t.slice(o+1))}getArguments(t){let r=this.regex.exec(t)?.slice(1);if(!r)return;let n=this._extractQuery(t);return r.forEach((i,a)=>{let c=a===r.length-1?i||"":i?decodeURIComponent(i):"",l=this.parameters[a];l&&(n[l]=c)}),n}test(t){return this.regex.test(t)}toString(){return this.path}},Si=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new ki(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${crypto.randomUUID()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let o=this.definition.render();return o[Mi]=this,Object.assign(o,t),o}},Ei=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(o=>o.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(o=>o.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function cp(e){return e[Mi]}function Ci(e,t){let o=new URL(e,`http://localhost/${t}`);return{path:o.pathname.slice(1),hash:o.hash.slice(1)}}var pp={getHref(e){return`${ze.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Uo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&ze.history.pushState({url:e},"",o)}},deserialize(){return{path:ze.location.search.slice(1),hash:ze.location.hash.slice(1)}}};function Uo(){return ze.history.state}var fp={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Uo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&ze.history.pushState({url:e},"",o||"/")}},deserialize(){return{path:ze.location.pathname,hash:ze.location.hash.slice(1)}}},ys={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=ys.getHref(e);ze.location.hash!==t&&(ze.location.hash=t)},deserialize(){return Ci(ze.location.hash.slice(1),"")}},io={hash:ys,path:fp,query:pp},Ai=class{callbackFn;state;routes=new Ei;instances={};root;lastGo;constructor(t){this.callbackFn=t}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let o=new Si(t);return this.routes.register(o),o}go(t){this.lastGo=t;let o=this.state?.url,r=typeof t=="string"?Ci(t,o?.path??""):t,n=r.path;if(n!==o?.path){let i=this.routes.findRoute(n);if(!i)throw new Error(`Path: "${n}" not found`);let a=i.path?.getArguments(n);if(i.redirectTo)return this.go(wi(i.redirectTo,a));let c=this.execute(i,a);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${n}" could not be created`);this.updateState({url:r,arguments:a,route:i,current:c,root:this.root})}else this.state&&r.hash!==o.hash&&this.updateState({...this.state,url:r})}getPath(t,o){let n=this.routes.get(t)?.path;return n&&wi(n.toString(),o)}isActiveUrl(t){let o=this.state?.url;if(!o)return!1;let r=Ci(t,o.path);return!!Object.values(this.instances).find(n=>{let i=n[Mi],a=this.state?.arguments;if(i?.path?.test(r.path)&&(!r.hash||r.hash===o.hash)){if(a){let c=i.path.getArguments(r.path);for(let l in c)if(a[l]!==c[l])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,o){let r=this.instances[t];return r&&Object.assign(r,o),r}executeRoute(t,o,r){let n=t.parent,i=n&&this.routes.get(n),a=t.id,c=i&&this.executeRoute(i,o,r),l=this.findRoute(a,o)||t.create(o);return c?c.isSameNode(l.parentNode)||c.appendChild(l):this.root=l,r[a]=l,l}discardOldRoutes(t){let o=this.instances;for(let r in o){let n=o[r];n&&t[r]!==n&&(n.parentNode?.removeChild(n),delete o[r])}}execute(t,o){let r={},n=this.executeRoute(t,o||{},r);return this.discardOldRoutes(r),this.instances=r,n}},mt=new Lt,vs=new Lt,re=new Ai(()=>mt.next());function u1(e){return t=>{let o=typeof e=="string"?{path:e}:e;re.route({...o,render:()=>new t})}}function d1(e=""){return t=>{let o=typeof e=="string"?{path:e}:e;re.route({...o,isDefault:!0,render:()=>new t})}}function m1(e){return mt.map(()=>re.isActiveUrl(e))}function up(e){let t=e;for(;t;){let o=t instanceof HTMLElement&&t.scrollHeight>t.clientHeight?t:null;if(o&&o.scrollTop!==0){o.scrollTo(0,0);return}if(t.assignedSlot){t=t.assignedSlot;continue}if(t.parentElement){t=t.parentElement;continue}let r=t.getRootNode();t=r instanceof ShadowRoot?r.host:null}}function Ti(e){let t;return mt.tap(()=>{let{root:o}=re.getState();o.parentNode!==e?e.appendChild(o):t&&t!==o&&t.parentNode&&e.removeChild(t),t=o}).raf(()=>{let o=re.getState().url;o.hash?e.querySelector(`#${o.hash},a[name="${o.hash}"]`)?.scrollIntoView():Uo()?.lastAction!=="pop"&&e.parentElement&&up(e)})}function ws(e,t=io.query){return f(W(()=>{vs.next(t)}),e.tap(()=>re.go(t.deserialize())),mt.tap(()=>t.serialize(re.getState().url))).catchError(o=>{if(o instanceof Error&&o.name==="SecurityError")return w;throw o})}function dp(){return mt.switchMap(()=>{let e=re.getState(),t=[],o=e.current;do{let r=o.routeTitle;r&&t.unshift(r instanceof A?r:I(r))}while(o=o.parentNode);return V(...t)}).tap(e=>document.title=e.join(" - "))}function ks(){return We(I(location.hash.slice(1)),b(window,"hashchange").map(()=>location.hash.slice(1)))}var Er;function mp(){if(!Er){Er=new po(history.state);let e=history.pushState;history.pushState=function(...t){let o=e.apply(this,t),r=Uo();return r&&(r.lastAction="push",Er?.next(r)),o}}return f(b(window,"popstate").map(()=>{let e=Uo();return e&&(e.lastAction="pop",e)}),Er)}function Ss(){let e;return f(ks(),mp()).map(()=>window.location).filter(t=>{let o=t.href!==e;return e=t.href,o})}function gp(e,t=io.query,o){let r=typeof t=="string"?io[t]:t,n=o||(r===io.hash?ks():Ss());return f(Ti(e),ws(n,r),dp())}function g1(e=io.query,t){return o=>gp(o,e,t)}var x1=mt.raf().map(()=>{let e=[],t=re.getState(),o=t.current;do o.routeTitle&&e.unshift({title:o.routeTitle,first:o===t.current,path:xp(o)});while(o=o.parentNode);return e});function xp(e){let t=cp(e);return t&&wi(t.path?.toString()||"",re.state?.arguments||{})}function h1(e){return F(e).tap(t=>{t.preventDefault(),e.external?location.assign(e.href):re.go(e.href)})}function Cr(e,t,o=t){return f(V(vs,Ht(e)).tap(([r])=>{e.href!==void 0&&(t.href=e.external?e.href:r.getHref(e.href)),t.target=e.target||""}),F(t).tap(r=>{e.target||r.preventDefault()}),F(o).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):re.go(e.href))}))}function hp(e,t){let o=document.createElement("div");return o.style.display="contents",Object.assign(o,{routeTitle:t}),o.appendChild(e.content.cloneNode(!0)),o}var Ni=class extends u{strategy="query";get state(){return re.state}go(t){return re.go(t)}};s(Ni,{tagName:"c-router",init:[m("strategy")],augment:[e=>{function t(o){let r=o.dataset;if(r.registered)return;r.registered="true";let n=r.title||void 0;re.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:o.hasAttribute("data-default"),redirectTo:r.redirectto,render:hp.bind(null,o,n)})}return $e().switchMap(()=>{for(let o of Array.from(e.children))o instanceof HTMLTemplateElement&&t(o);return f(Ko(e).tap(o=>{o.type==="added"&&o.value instanceof HTMLTemplateElement&&t(o.value)}),d(e,"strategy").switchMap(o=>{let r=io[o];return ws(Ss(),r).catchError((n,i)=>(console.error(n),i))}))})}]});function zi(e,t=e){return f(bp(e,t).ignoreElements(),mt.map(()=>e.href!==void 0&&re.isActiveUrl(e.href)))}function bp(e,t=e){let o=x("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return o.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,N(e).append(o),f(Cr(e,o),b(o,"click").tap(r=>{r.stopPropagation(),mo(r)||e.dispatchEvent(new PointerEvent(r.type,r)),K(e,"drawer.close",void 0)}),F(t).tap(r=>{mo(r)&&o.click()}))}var Ii=class extends u{href};s(Ii,{tagName:"c-router-selectable",init:[m("href")],augment:[Y,()=>x("slot"),e=>X(()=>{let t=e.parentElement;if(!t||!("selected"in t))throw new Error("Invalid selectable parent");return zi(e,t).raf(o=>{t.selected=o})})]});var Fi=class extends Oo{href;external=!1;target};s(Fi,{tagName:"c-router-item",init:[m("href"),m("external"),m("target")],augment:[e=>zi(e).tap(t=>{e.selected=t})]});var Xo=class extends u{href;focusable=!1;external=!1;dismiss=!1;target};s(Xo,{tagName:"c-router-link",init:[m("href"),m("focusable"),m("external"),m("target"),m("dismiss")],augment:[p(`
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
	`),e=>{let t=x("a",{className:"link"},x("slot"));return N(e).append(t),f(d(e,"focusable").tap(o=>t.tabIndex=o?0:-1),mr(e),Cr(e,t))}]});var Di=class extends Xo{focusable=!0};s(Di,{tagName:"c-router-a",augment:[p(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var Ri=class extends u{};s(Ri,{tagName:"c-router-outlet",init:[],augment:[S("main"),Y,Ti,y]});function Cs(e,t,o){let r=e[t];return o?-r:r}function yp(e,t,o,r){e[t]=o?-r:r}function vp(e,t){return e==="x"&&getComputedStyle(t).direction==="rtl"}function Li(e,t){return Number.isFinite(e)&&e>0?e:t}function Pi(e,t){if(!Number.isSafeInteger(e)||e<0)throw new Error(`${t} must be a non-negative safe integer.`)}function Es(e){let t=e>>>0;if(t!==0)return(t&-t)>>>0;let o=Math.floor(e/4294967296);return((o&-o)>>>0)*4294967296}var Vi=class{length;estimate;tree=new Map;measured=new Map;totalDelta=0;constructor(t,o){this.length=t,this.estimate=o}get totalSize(){return this.length*this.estimate+this.totalDelta}get(t){return this.measured.get(t)??this.estimate}update(t,o){if(t<0||t>=this.length||!Number.isFinite(o)||o<=0)return!1;let r=this.get(t);if(r===o)return!1;o===this.estimate?this.measured.delete(t):this.measured.set(t,o);let n=o-r;return this.totalDelta+=n,this.add(t,n),!0}offsetOf(t){t=Math.max(Math.min(t,this.length),0);let o=0;for(let r=t;r>0;r-=Es(r))o+=this.tree.get(r)??0;return t*this.estimate+o}find(t){if(this.length===0)return{index:0,offset:0};t=Math.max(Math.min(t,this.totalSize),0);let o=0,r=0,n=1;for(;n*2<=this.length;)n*=2;for(;n>=1;n/=2){let i=o+n;if(i>this.length)continue;let a=r+n*this.estimate+(this.tree.get(i)??0);a<=t&&(o=i,r=a)}return o>=this.length?{index:this.length-1,offset:this.get(this.length-1)}:{index:o,offset:t-r}}resize(t){if(t!==this.length){this.length=t;for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}}reset(t=0){for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}add(t,o){for(let r=t+1;r<=this.length;r+=Es(r)){let n=(this.tree.get(r)??0)+o;Math.abs(n)<1e-9?this.tree.delete(r):this.tree.set(r,n)}}rebuild(){this.tree.clear(),this.totalDelta=0;for(let[t,o]of this.measured){let r=o-this.estimate;this.totalDelta+=r,this.add(t,r)}}};function wp(e){function t(){It=g[M];let R=getComputedStyle(g);Wo=parseFloat(R[_])||0,ao=parseFloat(R[z])||0,Ae=Math.max(It-Wo-ao,0),zt=l==="x"&&R.direction==="rtl",ot=!1}function o(R){let G=R[T];return zt?-G:G}function r(R){throw console.error(`Faulty element detected: 
The provided element has an invalid or unmeasurable size. Check that the "${M}" of the element is not zero or negative. Make sure the element is styled properly and any necessary dimensions are set correctly before rendering.`),console.log(R),new Error("Rendered element size returned invalid value.")}function n(R){let G=R[M],Z=R[T];return(!Number.isFinite(G)||G<=0||!Number.isFinite(Z)||!Number.isFinite(Z+G))&&r(R),R}function i(R,G,Z){let Fe=R,xe=0,ce=-G,gt=0,rt=0,ne,je=0,xt,ke=0,nt,Ue=0;if(R>0){let ht=n(v(Fe-1,xe++,"pre"));je=ht[M],ce=-(j.get(R-1)+G),ne=o(ht)}for(;Fe<we;){let ht=Fe++,lo=n(v(ht,xe++,"on")),De=o(lo),Dt=lo[M];if(Ue===0&&(gt=De,ne!==void 0)){let co=De-ne,bt=Li(co,je);j.update(R-1,bt),ce=-(bt+G)}if(xt!==void 0&&nt!==void 0){let co=De-xt;j.update(nt,Li(co,ke))}if(xt=De,ke=Dt,nt=ht,rt=De+Dt,Ue++,rt-gt-G>=Z)break}return Fe===we&&nt!==void 0&&j.update(nt,ke),{count:xe,endPos:rt,index:Fe,lastIndex:nt,lastPosition:xt,lastSize:ke,offset:ce,rendered:Ue,startPos:gt}}function a(R,G,Z,Fe){let xe=R,ce=i(xe,G,Z);for(;Fe&&xe>0&&ce.endPos-ce.startPos<Ae;){let gt=Ae-(ce.endPos-ce.startPos),rt=Math.max(Math.ceil(gt/ve),ce.rendered,1),ne=Math.max(xe-rt,0);if(ne===xe)break;xe=ne,ce=i(xe,0,Z)}return{...ce,start:xe}}function c(){ot&&t();let R=Cs(g,P,zt);Ft=g[P];let G=Math.max(g[B]-It,0),Z=!so&&G>0&&R>=G-1,Fe=Math.max(Ce-Ae,0),xe=Z?Fe:G>0?Math.max(Math.min(R/G,1),0)*Fe:0,ce=j.find(xe),gt=Z?1/0:Ae;function rt(bt,Fs){let Xe=a(bt,Fs,gt,Z),{count:Ji}=Xe;if(Xe.index<we&&Xe.lastIndex!==void 0&&Xe.lastPosition!==void 0){let Ds=n(v(Xe.index,Ji++,"post")),Rs=o(Ds)-Xe.lastPosition;j.update(Xe.lastIndex,Li(Rs,Xe.lastSize))}return{range:Xe,count:Ji}}let ne=ce.index,je=ce.offset,xt=rt(ne,je);if(!Z){for(;ne<we-1&&je>=j.get(ne);)je-=j.get(ne++);ne!==ce.index&&(xt=rt(ne,je))}let{range:ke,count:nt}=xt,{offset:Ue}=ke;C?.(nt);let ht=j.get(ne),lo=Math.min(je,ht);!Z&&ke.start===ne&&(Ue+=je-lo),ke.rendered>0&&Z&&(Ue=Ae-ke.endPos,Ue>0&&(Ue=0));let De=j.offsetOf(ne)+lo;if(Z)Ce=j.totalSize;else{let bt=j.totalSize;Ce=Math.max(bt,De+Ae+(De+Ae>=bt?1:0))}let Dt=Math.max(Ce-Ae,0);Z&&(De=Dt);let co=Math.min(Math.ceil(Ce),$);return so=!1,{dataLength:we,start:ke.start,end:ke.index,totalSize:co,count:ke.rendered,offset:Ue,atEnd:Z,scrollRatio:Dt>0?De/Dt:0}}let{axis:l,scrollElement:g,render:v,refresh:k,remove:C}=e,M=l==="x"?"offsetWidth":"offsetHeight",T=l==="x"?"offsetLeft":"offsetTop",P=l==="x"?"scrollLeft":"scrollTop",B=l==="x"?"scrollWidth":"scrollHeight",_=l==="x"?"paddingLeft":"paddingTop",z=l==="x"?"paddingRight":"paddingBottom",$=5e6,ve=e.estimateSize??50;if(!Number.isFinite(ve)||ve<=0)throw new Error("estimateSize must be a positive finite number.");Pi(e.dataLength,"dataLength");let we=e.dataLength,j=new Vi(we,ve),Ce=j.totalSize,It=0,Ae=0,Wo=0,ao=0,zt=!1,so=!0,ot=!0,Ft=NaN,zs=b(g,"scroll",{passive:!0});return f(k?.tap(R=>{R?.dataLength!==void 0&&(Pi(R.dataLength,"dataLength"),R.resetFrom!==void 0&&Pi(R.resetFrom,"resetFrom"),we=R.dataLength,j.resize(we),R.resetFrom!==void 0&&j.reset(Math.max(Math.min(R.resetFrom,we),0)),Ce=j.totalSize,ot=!0),Ft=NaN})??w,Zo(g).switchMap(R=>R?f(ee(g).tap(()=>ot=!0),zs).raf():w)).filter(()=>ot||Ft!==g[P]).map(c)}function q1(e){let{axis:t,host:o,translate:r=!0}=e,n=e.scrollElement||o.parentElement;if(!n)throw"scrollElement option could not be resolved.";let i=t==="x"?"scrollLeft":"scrollTop",a=t==="x"?"scrollWidth":"scrollHeight",c=t==="x"?"clientWidth":"clientHeight",l=document.createElement("div"),g=t==="x"?"width":"height";l.style.position="absolute",l.style.width=l.style.height="1px",l.style.top=l.style.left="0",(e.scrollContainer??n).appendChild(l),o.style.position="sticky",o.style.top=o.style.left="0",r&&(o.style.translate="0 0");let v=0,k=!1,C=NaN,M=e.dataLength,T=!1,P=vp(t,n),B=()=>Cs(n,i,P),_=z=>yp(n,i,P,z);return wp({...e,scrollElement:n}).tap(({dataLength:z,totalSize:$,offset:ve,atEnd:we,scrollRatio:j})=>{let Ce=B();v!==$&&(l.style[g]=`${$}px`,v=$);let It=Number.isNaN(C)?0:Ce-C,Ae=It<-1,Wo=It>1,ao=z!==M;if(Ae&&!ao&&(T=!1),r)if(ve!==0){let Ft=P?-ve:ve;o.style.translate=t==="x"?`${Ft}px 0`:`0 ${Ft}px`,k=!0}else k&&(o.style.translate="0 0",k=!1);let zt=Math.max(n[a]-n[c],0),so=we&&(ao||T||Wo||Number.isNaN(C));so&&(r&&(o.style.translate="0 0",k=!1),T=!0);let ot=so?zt:j*zt;Math.abs(B()-ot)>.5&&_(ot),M=z,C=B()}).finalize(()=>l.remove())}function kp(e){return Math.min(Math.max(e,0),1)}function Sp(e,t){return Ot(e).filter(o=>{let r=e.value,n=o.shiftKey?10:o.ctrlKey||o.altKey?.1:1,i=e.step*n;if(o.key==="Home")t(0);else if(o.key==="End")t(1);else if(o.key==="ArrowLeft"||o.key==="ArrowUp")t(e.value-i);else if(o.key==="ArrowRight"||o.key==="ArrowDown")t(e.value+i);else return!1;return o.preventDefault(),e.value!==r})}var Oi=class extends le{value=0;step=.01};s(Oi,{tagName:"c-slider-reveal",init:[me("value",0,1),me("step")],augment:[S("slider"),p(`
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
		`),O,e=>{let t=x("div",{id:"slider",tabIndex:0}),o=x("slot",{name:"before"}),r=0;function n(){let a=e.value*e.offsetWidth;o.style.clipPath=`inset(0 0 0 ${a}px)`,t.style.left=`${a}px`,e.ariaValueNow=e.value.toString()}function i(a){let c=kp(a);c!==e.value&&(e.value=c,e.dispatchEvent(new Event("change",{bubbles:!0})))}return t.setAttribute("part","slider"),e.focus=()=>{e.disabled||t.focus()},e.ariaValueMin="0",e.ariaValueMax="1",e.ariaOrientation="horizontal",N(e).append(x("slot",{name:"after"}),o,x("slot"),t),f(Ee(e,t),f(d(e,"value"),ee(e)).raf(n),Sp(e,i),Vn({target:t}).tap(a=>{a.type==="start"?r=t.offsetLeft:a.type==="move"&&i((r+a.clientX-a.startX)/e.offsetWidth)}))}]});var As=class e extends le{value="on";checked=!1;defaultChecked=!1;static{s(e,{tagName:"c-switch",init:[m("value"),h("checked")],augment:[S("switch"),Ne,p(`
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
${Ge(".mask")}
:host([checked]) .mask { translate: 20px 0; }
		`),t=>{t.defaultChecked=t.checked},O,()=>x("div",{className:"knob"}),()=>x("div",{className:"mask"}),Tn]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){pe(this).setFormValue(this.checked?String(t):null)}};var Bi=class extends u{font};s(Bi,{tagName:"c-t",init:[h("font")],augment:[p(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${ir.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${E("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${E("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${E("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${E("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${E("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${E("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),y,e=>d(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var Hi=class extends u{selected;tabs=new Set;variant};s(Hi,{tagName:"c-tabs",init:[H("selected"),h("variant")],augment:[S("tablist"),p(`
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
		`),y,e=>{function t(o=1){let r=Array.from(e.tabs),n=e.selected||r[0],i=n?r.indexOf(n):-1;return i===-1?null:r[i+o]||null}return tt({host:e,goRight:t.bind(null,1),goLeft:t.bind(null,-1),goFirst:()=>Array.from(e.tabs)[0]||null,goLast:()=>Array.from(e.tabs)[e.tabs.size-1]||null}).tap(o=>{o.click(),o.focus()})},e=>{let t=new de;return N(e).append(x(et,{className:"selected",$:o=>f(lt(),d(e,"selected"),d(e,"variant"),t,ee(e)).raf(()=>{if(!e.checkVisibility())return;let r=e.selected;if(!r)return o.style.transform="scaleX(0)";let n=r.offsetLeft;if(e.variant==="secondary"){let i=r.clientWidth/100;o.style.transform=`translate(${n}px, 0) scaleX(${i})`,o.style.display="block"}else{let i=document.createRange();i.selectNodeContents(r);let{width:a}=i.getBoundingClientRect(),c=n+(r.clientWidth-a)/2,l=a/100;o.style.transform=`translate(${c}px, 0) scaleX(${l})`,o.style.display="block"}e.scrollWidth!==r.clientWidth&&(e.scrollLeft=n-32)})})),ct("tabs",e,e.tabs).raf().switchMap(o=>{let r=[];for(let n of o.elements)r.push(d(n,"selected").tap(i=>{i?(e.selected&&e.selected!==n&&(e.selected.selected=!1),e.selected=n):e.selected===n&&(e.selected=void 0),n.tabIndex=i?0:-1}),ee(n).tap(()=>t.next()));return f(...r)})}]});var Ar=class extends u{selected=!1;touched=!1;disabled=!1;name};s(Ar,{init:[h("touched"),h("selected"),h("disabled"),m("name")],augment:[S("tab"),Ne,e=>Se("tabs",e),e=>d(e,"name").switchMap(t=>t?F(e).tap(()=>e.selected=!0):w),e=>d(e,"selected").tap(t=>{e.setAttribute("aria-selected",t?"true":"false")})]});var Yi=class extends Ar{};s(Yi,{tagName:"c-tab",augment:[p(`
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
${L("small",":host { flex-grow: 0 }")}
		`),se,O,st,y]});var _i=class extends u{};s(_i,{tagName:"c-table",augment:[S("table"),p(`
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
	${E("body-large")}
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	outline-offset: -1px;
}
		`),y]});var ji=class extends u{};s(ji,{tagName:"c-tbody",augment:[S("rowgroup"),p(":host{display:table-row-group}"),y]});var Ui=class extends u{};s(Ui,{tagName:"c-td",augment:[S("cell"),p(`
:host {
	box-sizing: border-box;
	display: table-cell;
	padding: 0 16px;
	height: 51px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
}
		`),y]});var Xi=class extends u{};s(Xi,{tagName:"c-th",augment:[S("columnheader"),p(`
:host {
	box-sizing: border-box;
	display: table-cell;
	${E("title-medium")}
	color: var(--cxl-color-on-surface-variant);
	padding: 16px;
	white-space: nowrap;
	height: 55px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
	position: relative;
}`),y]});var Wi=class extends Ie{value="";inputEl=document.createElement("textarea")};s(Wi,{tagName:"c-textarea",init:[m("value")],augment:[y,e=>e.append(e.inputEl),e=>Ye({host:e,input:e.inputEl}),O,e=>{let t=new CSSStyleSheet;return t.replaceSync(":host{flex-grow:1;position:relative;}"),e.shadowRoot?.adoptedStyleSheets.push(t),f(d(e,"value"),ee(e.inputEl),lt()).raf(()=>{let o=e.inputEl.style;o.height="0";let r=e.inputEl.scrollHeight;t.replaceSync(`:host{flex-grow:1;position:relative;height:${r}px}`),o.height="100%"})}]});function Ep(e){return getComputedStyle(e).direction==="rtl"}function Cp(e,t,o,r,n){return e==="right"||e==="end"&&!r||e==="start"&&r?(n.left=t.right,!0):e==="left-to-right"||e==="start-to-end"&&!r?(n.left=t.left,!0):e==="left"||e==="end"&&r||e==="start"&&!r?(n.left=t.left-o.offsetWidth,!0):e==="center"?(n.left=t.left+t.width/2-o.offsetWidth/2,!0):e==="right-to-left"||e==="end-to-start"&&r?(n.left=t.right-o.offsetWidth,!0):e==="fill"?(n.left=t.left,n.minWidth=t.width,!0):!1}function Ap(e,t,o,r){return e==="bottom"?(r.top=t.bottom,!0):e==="top"?(r.top=t.top-o.offsetHeight,!0):e==="middle"?(r.top=t.top+t.height/2-o.offsetHeight/2,!0):e==="top-to-bottom"?(r.top=t.top,!0):e==="bottom-to-top"?(r.top=t.bottom-o.offsetHeight,!0):!1}function Ns(e,t,o){return Math.min(Math.max(e,t),o)}function Ms({element:e,relativeTo:t,position:o,container:r}){if(o==="none")return;if(r??=fe.currentPopupContainer??fe.popupContainer,e.parentNode||r.appendChild(e),typeof o=="function")return o(e);let n=t.getBoundingClientRect(),i=e.style,a=Math.max(r.offsetWidth-e.offsetWidth-16,16),c=Math.max(r.offsetHeight-e.offsetHeight-16,16);i.left=i.top=i.width=i.minWidth=i.transformOrigin="",o==="auto"&&(o="center bottom");let l={left:0,top:0},g=Ep(e);for(let v of o.split(" "))if(!Cp(v,n,e,g,l)&&!Ap(v,n,e,l))throw new Error(`Invalid position "${v}"`);l.left=Ns(l.left,16,a),l.top=Ns(l.top,16,c),i.left=`${l.left}px`,i.top=`${l.top}px`,l.minWidth&&(i.minWidth=`${l.minWidth}px`)}function Np(e){let t=f(D(e,"position"),b(window,"scroll",{capture:!0,passive:!0})),o=r=>Ms({element:r,relativeTo:(typeof e.relative=="string"?Ze(e,e.relative):e.relative)??e.firstElementChild??e,position:e.position||"auto",container:document.body});return kt(e).switchMap(({target:r,open:n})=>{if(r.open&&n&&(r.open=!1),r.trigger!==e)return w;if(r.open=n,n){let i=r.dialog??r,a=e.firstElementChild;return r.dialog&&(i.style.margin="0"),o(i),f(ee(i),t).raf(()=>{a&&!a.checkVisibility()?e.open=!1:o(i)})}return w})}var qi=class extends u{open=!1;target;position;relative;trigger};s(qi,{tagName:"c-toggle-popup",init:[h("open"),m("target"),m("position"),m("relative"),m("trigger")],augment:[Np,y,p(":host{display:contents}")]});var $i=class extends Tt{};s($i,{tagName:"c-toolbar-floating",augment:[p(`
:host {
	background-color: var(--cxl-color-surface-container);
	color: var(--cxl-color-on-surface-variant);
	border-radius: var(--cxl-shape-corner-full);
	padding: 8px 24px;
	height: 64px;
	${Na(3)}
}
		`)]});var Ki=class extends u{color};s(Ki,{tagName:"c-tr",init:[ae("color")],augment:[S("row"),p(":host{display:table-row;height:53px;}"),y]});var Mp={xl:"xlarge",lg:"large",md:"medium",sm:"small",xs:"xsmall",full:"full"},Tp=Fa.map(e=>e==="inherit"?`[c~="surface-${e}"]{background-color:inherit;color:inherit}
[c~="color-${e}"]{color:inherit}`:`[c~="surface-${e}"]{background-color:var(--cxl-color-${e});color:var(--cxl-color-on-${e})}
[c~="color-${e}"]{color:var(--cxl-color-${e})}`).join(""),Ts=`[c~="cover"]{object-fit:cover;width:100%;height:100%;}
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
[c~="section-header"]{display:block;${E("title-medium")}margin-bottom:48px;grid-column:1 / -1;}
[c~="section-header"] > h2{${E("display-small")}font-weight:700;}
${Tp}
${ir.map(e=>`[c-font="${e}"]{${E(e)}}`).join("")}
${Je.map(e=>`[c~="pad-${e}"]{padding:${e}px}
[c~="corner-${e}"]{border-radius:${e}px}
[c~="gap-${e}"]{gap:${e}px}`).join("")}
${Object.entries(Mp).map(([e,t])=>`[c~="corner-${e}"]{border-radius:var(--cxl-shape-corner-${t})}`).join("")}
[c~="surface-scrim"]{
	background-color:var(--cxl-color-scrim);
	background-size:cover;
	background-blend-mode:darken;
	background-position:center;
}`,Ip=`${Ts}
${L("small",Ts.replace(/\[c~/g,"[c\\:sm~"))}
`,Is=new WeakMap;function zp(e=document){let t=Is.get(e);return t||(t=Ve(Ip),e.adoptedStyleSheets.push(t),Is.set(e,t)),t}var Gi=class extends u{};s(Gi,{tagName:"c-www",augment:[e=>{zp(e.ownerDocument)}]});export{$r as Accordion,Jr as AccordionHeader,yo as AccordionPanel,_r as Action,Ct as Alert,Qr as AlertError,vo as Appbar,Wa as AppbarContextual,Zr as AppbarLayout,en as AppbarTitle,rn as Application,nn as AriaLive,Qp as Augment,yr as Autocomplete,yn as AutocompleteDynamic,vn as Avatar,po as BehaviorSubject,Vr as Bindings,eo as Block,wn as Body,Be as Button,Wt as ButtonBase,wo as ButtonRound,kn as ButtonSegmented,Sn as ButtonText,To as C,Io as Card,Mn as CardItem,ss as Checkbox,In as Chip,Da as ColorStyles,u as Component,Yl as ContentManager,zn as Date,d1 as DefaultRoute,Fn as Dialog,to as DialogBase,Mt as DialogBasic,Ln as Dismiss,fs as DragHandle,Ro as Drawer,On as Dropdown,w as EMPTY,Bn as Each,Nr as EmptyError,fn as Field,Hn as FieldBar,Te as FieldBase,Yn as FieldFrame,Ao as FieldHelp,_n as FieldOutlined,Lo as Flex,kr as Form,jn as FormSubmit,Un as Grid,Wn as GridList,ys as HashStrategy,Gn as Hero,Jn as Hr,ue as Icon,Me as IconButton,ei as IconToggleTheme,ti as Iframe,le as Input,oi as InputClear,ri as InputFile,ii as InputNumber,ni as InputNumberBase,br as InputOption,ms as InputPassword,ai as InputPlaceholder,xn as InputText,Ie as InputTextBase,An as Item,_e as ItemBase,si as Kbd,li as Label,Po as Layout,ro as LayoutBase,ci as List,Ai as MainRouter,pi as Menu,on as Meta,fi as NavDropdown,mi as NavHeadline,Oo as NavItem,di as NavTarget,ui as NavTreeItem,Yo as NavbarToggle,A as Observable,pn as Option,qo as OrderedSubject,Ra as OutlineColorStyles,gi as Page,xi as PageAppbar,fp as PathStrategy,zo as Pill,Vo as Popup,hi as Progress,bi as ProgressCircular,pp as QueryStrategy,jo as R,vi as Rating,Lt as Reference,$o as ReplaySubject,gr as Ripple,Si as RouteBase,Ei as RouteManager,Di as RouterA,Ni as RouterComponent,Fi as RouterItem,Xo as RouterLink,Ri as RouterOutlet,Ii as RouterSelectable,$n as Section,dn as Select,Jt as SelectOption,Re as Signal,Hr as SizeValues,Oi as SliderReveal,y as Slot,no as Snackbar,_o as SnackbarContainer,et as Span,io as Strategies,de as Subject,Ls as Subscriber,Fa as SurfaceColorNames,As as Switch,Bi as T,Yi as Tab,Ar as TabBase,_i as Table,Hi as Tabs,ji as Tbody,Ui as Td,Wi as TextArea,Xi as Th,Wr as Toggle,ft as ToggleBase,Do as TogglePanel,qi as TogglePopup,bo as ToggleTarget,Oe as ToggleTargetBase,Tt as Toolbar,$i as ToolbarFloating,Ki as Tr,ir as TypographyValues,Gi as Www,Ya as activeRipple,Oh as alert,qp as animated,qa as applyMeta,Sl as applyTheme,Yt as aria,sf as ariaChecked,ba as ariaControls,lf as ariaDescribed,Ke as ariaId,xa as ariaLabel,ga as ariaValue,m as attribute,D as attributeChanged,Ys as auditTime,Zp as augment,kc as avatarBaseStyles,ye as be,Cr as bindHref,te as bindings,cr as breakpoint,_s as bufferTime,Co as buildGo,En as buildGridCss,vl as buildIconFactoryCdn,Xc as buildListGo,Ge as buildMask,lr as buildMenuStyles,Et as buttonBaseStyles,Ne as buttonBehavior,Gr as buttonKeyboardBehavior,zl as buttonStyles,Sc as cardStyles,Ks as catchError,$t as changeEvent,Tn as checkedBehavior,ae as colorAttribute,gf as colorMix,V as combineLatest,s as component,We as concat,Us as concatMap,Wh as confirm,Q as content,x as create,p as css,Ta as cssAttribute,or as cssSymbol,Lp as debounceFunction,jp as debounceImmediate,ol as debounceRaf,Hs as debounceTime,Ba as decode,Xa as defaultFormatDate,Ma as defaultThemes,X as defer,xf as delayTheme,wr as dialog,Dn as dialogClose,Rn as dialogStyles,Kr as disabledAttribute,O as disabledStyles,Y as displayContents,Gs as distinctUntilChanged,Vc as drawerStyles,ds as each,Yc as eachBehavior,Na as elevation,_p as empty,Dl as errorToString,rr as event,Xs as exhaustMap,pl as expression,un as fieldBaseStyles,mc as fieldBehavior,dc as fieldLayout,Nt as fieldLayoutStyles,fc as fieldStyles,Gc as fileUploadBehavior,Ir as filter,el as finalize,_c as findForm,$s as first,Rp as firstValueFrom,Ee as focusable,Tl as focusableDisabled,Il as focusableEvents,rl as focused,E as font,Vd as formatDate,Le as from,fo as fromAsync,Dp as fromGenerator,ea as fromIterable,Mr as fromPromise,d as get,$p as getActiveElement,it as getAriaId,ua as getAttribute,Od as getDayText,cp as getElementRoute,Pd as getFormattedDate,ln as getHostActive,Ut as getIcon,Ld as getLocale,tf as getRegisteredComponents,vt as getRoot,wc as getSearchRegex,N as getShadow,bs as getStars,ur as getTarget,Ze as getTargetById,dr as getTargets,jc as gridColumns,Wc as gridNavigation,Cn as growAndFillStyles,lc as handleListArrowKeys,Dr as hovered,Rr as hoveredOrFocused,tl as ignoreElements,gp as initializeRouter,uc as inputContainer,Mo as inputTextBase,hn as inputTextStyles,zp as installWwwCss,pe as internals,Pp as interval,Xp as isFocusable,Up as isHidden,mo as isKeyboardClick,Ka as isPageReady,Cc as itemBehavior,Nn as itemButtonBehavior,Xn as itemHost,sr as itemLayout,Ec as itemStyles,Uf as json,qn as layoutStyles,h1 as linkBehavior,za as loadTheme,hl as loadThemeDefinition,Eo as manageFocus,Uc as manageFocusList,Tr as map,st as maskStyles,L as media,f as merge,js as mergeMap,K as message,da as messageProxy,xr as metaBehavior,ho as motion,Bo as navItemComponent,tt as navigation,Sm as navigationItems,Sr as navigationList,Ve as newStylesheet,Wp as nodeSort,sp as normalize,xw as notify,me as numberAttribute,W as observable,aa as observeChildren,bl as observeTheme,I as of,b as on,F as onAction,Go as onAttributeMutation,Ko as onChildrenMutation,Fr as onEvent,lt as onFontsReady,ks as onHashChange,mp as onHistoryChange,Qo as onIntersection,Jo as onKeyAction,Ot as onKeypress,$e as onLoad,Ss as onLocation,oe as onMessage,zr as onMutation,$a as onPageReady,ia as onReady,ee as onResize,_t as onThemeChange,Ht as onUpdate,Zo as onVisibility,Vt as onVisible,be as operator,yt as operatorNext,Zi as operators,cc as overrideFocusMethod,Nl as parseAnimation,Xf as parseJson,Ml as parseMotion,lp as parseQueryParameters,Ci as parseUrl,Fp as pipe,nr as placeholder,Zc as popupBehavior,Qc as popupStyles,Np as popupToggleBehavior,xc as positionUnder,vc as prefixMatcher,H as property,Zs as publishLast,na as raf,Os as reduce,uo as ref,hf as registerDefaultIconFactory,bf as registerIcon,qt as registerText,tr as renderChildren,Yb as renderEach,wi as replaceParameters,se as ripple,S as role,u1 as route,m1 as routeIsActive,x1 as routeTitles,re as router,g1 as routerHost,bp as routerLink,Ti as routerOutlet,zi as routerSelectable,mt as routerState,ws as routerStrategy,jt as scrollbarStyles,Kn as sectionStyles,Vs as select,mn as selectBehavior,hc as selectComponent,gc as selectInputStyles,as as selectMenuStyles,ef as set,go as setAttribute,dp as setDocumentTitle,hw as setSnackbarContainer,Qs as share,Js as shareLatest,Vp as shareReplay,J as sizeAttribute,xs as snackbarContainer,jf as sortBy,Je as spacingValues,Ur as storage,vs as strategy$,h as styleAttribute,pr as stylesheet,ra as subject,bn as substringMatcher,q as surface,Gt as svg,At as svgPath,oa as switchMap,ze as sys,Ws as take,qs as takeWhile,Pt as tap,U as theme,ar as themeName,kl as themeReady,Bs as throttleTime,Bp as throwError,qe as timer,Ps as toPromise,qr as toggleBehavior,mr as toggleClose,kt as toggleComponent,nu as toggleOpen,Qe as toggleTargetBehavior,Xt as toggleTargetStyles,Pe as trigger,ie as tsx,sc as updateEvent,q1 as virtualScroll,wp as virtualScrollRender,Ea as visuallyHidden,Ip as wwwCss,Op as zip};
