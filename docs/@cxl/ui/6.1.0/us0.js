var we=Symbol("undefined"),ga=Symbol("terminator");function jt(e){if(e===we)throw new Error("Value not initialized");return e}function Ks(e,t){let o=!1,r={error:n,unsubscribe:i,get closed(){return o},signal:new Ve,next(a){if(!o)try{e.next?.(a)}catch(c){n(c)}},complete(){if(!o)try{e.complete?.()}finally{i()}}};e.signal?.subscribe(i);function n(a){if(o)throw a;if(!e.error)throw i(),a;try{e.error(a)}finally{i()}}function i(){o||(o=!0,r.signal.next())}try{t?.(r)}catch(a){n(a)}return r}function qp(...e){return t=>e.reduce((o,r)=>r(o),t)}var A=class{__subscribe;constructor(t){this.__subscribe=t}then(t,o){return Gs(this).then(t,o)}pipe(...t){return t.reduce((o,r)=>r(o),this)}subscribe(t){return Ks(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},ge=class extends A{closed=!1;signal=new Ve;observers=new Set;constructor(){super(t=>{this.onSubscribe(t)})}next(t){if(!this.closed)for(let o of Array.from(this.observers))o.closed||o.next(t)}error(t){if(!this.closed){this.closed=!0;let o=!1,r;for(let n of Array.from(this.observers))try{n.error(t)}catch(i){o=!0,r=i}if(o)throw r}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Ve=class extends A{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},ir=class extends ge{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)for(let o of this.queue.splice(0))super.next(o);this.emitting=!1}}},yo=class extends ge{currentValue;constructor(t){super(),this.currentValue=t}get value(){return this.currentValue}next(t){this.currentValue=t,super.next(t)}onSubscribe(t){let o=super.onSubscribe(t);return this.closed||t.next(this.currentValue),o}},ar=class extends ge{bufferSize;buffer=[];lastError=we;constructor(t=1/0){super(),this.bufferSize=t}error(t){this.lastError=t,super.error(t)}next(t){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(t),super.next(t)}onSubscribe(t){this.observers.add(t),this.buffer.forEach(o=>t.next(o)),this.lastError!==we?t.error(jt(this.lastError)):this.closed&&t.complete(),t.signal.subscribe(()=>this.observers.delete(t))}},Ut=class extends ge{$value=we;get hasValue(){return this.$value!==we}get value(){if(this.$value===we)throw new Error("Reference not initialized");return jt(this.$value)}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==we&&t.next(jt(this.$value)),super.onSubscribe(t)}},Yr=class extends Error{message="No elements in sequence"};function Ze(...e){return new A(t=>{let o=0,r;function n(){let i=e[o++];i&&!t.closed?(r?.next(),i.subscribe({next:t.next,error:t.error,complete:n,signal:r=new Ve})):t.complete()}t.signal.subscribe(()=>r?.next()),n()})}function X(e){return new A(t=>{e().subscribe(t)})}function _r(e){return new A(t=>{e.then(o=>{t.closed||t.next(o),t.complete()}).catch(o=>t.error(o))})}function $p(e){return new A(t=>{t.signal.subscribe(()=>{let o=e.return?.();o instanceof Promise&&o.catch(r=>t.error(r))}),(async()=>{do{let o=await e.next();if(t.closed||o.done)break;t.next(o.value)}while(!t.closed);t.complete()})().catch(o=>t.error(o))})}function vo(e){return X(()=>_r(e()))}function ha(e){return new A(t=>{for(let o of e)t.closed||t.next(o);t.complete()})}function Oe(e){return e instanceof A?e:e instanceof Promise?_r(e):ha(e)}function I(...e){return ha(e)}function ba(e){return new Promise((t,o)=>{let r=we;e.subscribe({next:n=>r=n,error:o,complete:()=>t(r)})})}function Gs(e){return ba(e).then(t=>t===we?void 0:jt(t))}async function Kp(e){return ba(e.first()).then(t=>jt(t))}function At(e,t){return ke(o=>({next:e(o),unsubscribe:t}))}function ke(e){return t=>new A(o=>{let r=e(o,t);r.unsubscribe&&o.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=o.error),r.complete||(r.complete=o.complete),r.signal=o.signal,t.subscribe(r)})}function jr(e){return At(t=>o=>t.next(e(o)))}function Js(e){let t=we;return At(o=>r=>{let n=e(r);n!==t&&(t=n,o.next(n))})}function Qs(e,t){return ke(o=>{let r=t,n=0;return{next(i){r=e(r,i,n++)},complete(){o.next(r),o.complete()}}})}function Gp(e,t){let o;function r(...n){o&&clearTimeout(o),o=setTimeout(()=>e.apply(this,n),t)}return r.cancel=()=>clearTimeout(o),r}function Zs(e){return ke(t=>{let o=!0,r;return{next(n){o&&(o=!1,t.next(n),r=setTimeout(()=>o=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function Jp(e){if(e<0)throw new Error("Invalid period");return new A(t=>{let o=setInterval(t.next,e);t.signal.subscribe(()=>clearInterval(o))})}function et(e){return new A(t=>{let o=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(o))})}function el(e,t=et){return ya(o=>t(e).map(()=>o))}function tl(e){return ke(t=>{let o,r=!1,n=we,i=()=>{o=void 0,!(!r||t.closed)&&(r=!1,t.next(jt(n)),n=we)};return{next(a){n=a,r=!0,o===void 0&&(o=setTimeout(i,e))},complete(){o!==void 0&&(clearTimeout(o),i()),t.complete()},unsubscribe(){o!==void 0&&clearTimeout(o)}}})}function ol(e){if(e<0)throw new Error("Invalid period");return ke(t=>{let o=[],r=setInterval(()=>{if(t.closed)return;let n=o;o=[],t.next(n)},e);return{next(n){o.push(n)},complete(){clearInterval(r),t.next(o),t.complete()},unsubscribe(){clearInterval(r)}}})}function ya(e){return t=>Q(o=>{let r=!1,n=!1,i,a=()=>{i?.next(),r=!1,n&&o.complete()},c=new Ve;o.signal.subscribe(()=>{a(),c.next()}),t.subscribe({next(l){a(),i=new Ve,r=!0,Oe(e(l)).subscribe({next:o.next,error:o.error,complete:a,signal:i})},error:o.error,complete(){n=!0,r||o.complete()},signal:c})})}function rl(e){return t=>Q(o=>{let r=o.signal,n=0,i=0,a=!1;function c(){i++,a&&i===n&&o.complete()}t.subscribe({next:l=>{n++,Oe(e(l)).subscribe({next:o.next,error:o.error,complete:c,signal:r})},error:o.error,complete(){a=!0,i===n&&o.complete()},signal:r})})}function nl(e){return ke(t=>{let o=new Ve,r,n,i=[],a=!1,c=!1,l=()=>{r?.next(),r=void 0,n=void 0,c=!1,i.length&&!t.closed?i.splice(0,1).forEach(g):a&&t.complete()},g=v=>{c=!0,r=new Ve,n=Oe(e(v)).subscribe({next:t.next,error:t.error,complete:l,signal:r})};return t.signal.subscribe(()=>{r?.next(),o.next()}),{next(v){c?i.push(v):g(v)},error:t.error,complete(){a=!0,!c&&i.length===0&&t.complete()},signal:o,unsubscribe:()=>n?.unsubscribe()}})}function il(e){return ke(t=>{let o=!0;return{next(r){o&&(o=!1,Oe(e(r)).subscribe({next:t.next,error:t.error,complete:()=>o=!0,signal:t.signal}))}}})}function Ur(e){return At(t=>o=>{e(o)&&t.next(o)})}function al(e){return At(t=>o=>{e-- >0&&!t.closed&&t.next(o),(e<=0||t.closed)&&t.complete()})}function sl(e){return At(t=>o=>{!t.closed&&e(o)?t.next(o):t.complete()})}function ll(){let e=!1;return ke(t=>({next(o){e||(e=!0,t.next(o),t.complete())},complete(){t.closed||t.error(new Yr)}}))}function Xt(e){return At(t=>o=>{e(o),t.next(o)})}function cl(e){return ke((t,o)=>{let r,n={next:t.next,error(i){try{if(t.closed)return;let a=e(i,o);r?.next(),r=new Ve,a.subscribe({...n,signal:r})}catch(a){t.error(a)}},unsubscribe:()=>r?.next()};return n})}function pl(){return At(e=>{let t=we;return o=>{o!==t&&(t=o,e.next(o))}})}function fl(){return e=>{let t=new ar(1),o=!1;return Q(r=>{t.subscribe(r),o||(o=!0,e.subscribe(t))})}}function Qp(e){return t=>{let o=new ar(e),r=0;return Q(n=>{r++,o.subscribe(n),r===1&&t.subscribe(o),n.signal.subscribe(()=>{--r===0&&o.signal.next()})})}}function ul(){return e=>{let t,o=0;function r(){--o===0&&t.signal.next()}return Q(n=>{n.signal.subscribe(r),o++===0?(t=wo(),t.subscribe(n),e.subscribe(t)):t.subscribe(n)})}}function dl(){return e=>{let t=new ge,o,r,n=!1,i=!1;return Q(a=>{i?(a.next(r),a.complete()):t.subscribe(a),o??=e.subscribe({next:c=>{n=!0,r=c},error:a.error,complete(){i=!0,n&&t.next(r),t.complete()},signal:a.signal})})}}function f(...e){return e.length===1?e[0]:new A(t=>{let o=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){o--===1&&t.complete()},signal:t.signal})})}function Zp(...e){return e.length===0?w:new A(t=>{let o=new Array(e.length);function r(){let n=!0;for(;n;){for(let i of o)if(!i||i.length===0)n=!1;else if(i[0]===ga)return t.complete();n&&t.next(o.map(i=>i?.shift()))}}e.forEach((n,i)=>{let a=o[i]=[];n.subscribe({next(c){a.push(c),r()},error:t.error,complete(){a.push(ga),r()},signal:t.signal})})})}function Y(...e){return e.length===0?w:new A(t=>{let o=e.length,r=o,n=0,i=!1,a=new Array(o),c=new Array(o);e.forEach((l,g)=>l.subscribe({next(v){c[g]=v,a[g]||(a[g]=!0,++n>=r&&(i=!0)),i&&t.next(c.slice(0))},error:t.error,complete(){--o<=0&&t.complete()},signal:t.signal}))})}function ml(e){return ke(t=>({next:t.next,unsubscribe:e}))}function gl(){return ke(()=>({next(){}}))}function ef(e){return new A(t=>{t.error(e)})}var w=new A(e=>{e.complete()});function Se(e){return new yo(e)}function Q(e){return new A(e)}function va(){return new ge}function wo(){return new Ut}var xa={auditTime:tl,bufferTime:ol,catchError:cl,concatMap:nl,debounceTime:el,distinctUntilChanged:pl,exhaustMap:il,filter:Ur,finalize:ml,first:ll,ignoreElements:gl,map:jr,mergeMap:rl,publishLast:dl,reduce:Qs,select:Js,share:ul,shareLatest:fl,switchMap:ya,take:al,takeWhile:sl,tap:Xt,throttleTime:Zs};for(let e in xa)A.prototype[e]=function(...t){return this.pipe(xa[e](...t))};function rf(e){let t;for(;t=e.childNodes[0];)e.removeChild(t)}function b(e,t,o){return new A(r=>{let n=r.next.bind(r);e.addEventListener(t,n,o),r.signal.subscribe(()=>e.removeEventListener(t,n,o))})}function sr(e){return Xr(e,{childList:!0})}function lr(e,t){return Xr(e,{attributes:!0,attributeFilter:t})}function Xr(e,t={attributes:!0,childList:!0}){return new A(o=>{let r=new MutationObserver(n=>n.forEach(i=>{for(let a of i.addedNodes)o.next({type:"added",target:e,value:a});for(let a of i.removedNodes)o.next({type:"removed",target:e,value:a});i.type==="characterData"?o.next({type:"characterData",target:e}):i.attributeName&&o.next({type:"attribute",target:e,value:i.attributeName})}));r.observe(e,t),o.signal.subscribe(()=>r.disconnect())})}function cr(e){return b(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function R(e){return b(e,"click")}function pr(e,t){return new A(o=>{let r=new IntersectionObserver(n=>{for(let i of n)o.next(i)},t);r.observe(e),o.signal.subscribe(()=>r.disconnect())})}function fr(e){return pr(e).map(t=>t.isIntersecting)}function Wt(e){return pr(e).filter(t=>t.isIntersecting).first()}function xl(e){let t;return function(...o){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,o),t=0})}}function nf(e){let t;return function(...o){t||(t=!0,queueMicrotask(()=>{t=!1,e.apply(this,o)}))}}function wa(e){return ke(t=>{let o=xl(n=>{t.closed||(e&&e(n),t.next(n),r&&t.complete())}),r=!1;return{next:o,complete:()=>r=!0}})}function ka(){return X(()=>document.readyState!=="loading"?I(!0):b(window,"DOMContentLoaded").first().map(()=>!0))}function Be(e,t,o){let r=new CustomEvent(t,o);e.dispatchEvent(r)}function Sa(e,t){let o=e,r;return f(X(()=>(r=o.childNodes,r?I(void 0):w)),tt().switchMap(()=>o.childNodes!==r?I(void 0):w),Xr(e,{childList:!0,...t}).map(()=>{}))}function tt(){return X(()=>document.readyState==="complete"?I(!0):b(window,"load").first().map(()=>!0))}function re(...e){return new A(t=>{let o=new ResizeObserver(r=>r.forEach(n=>t.next(n)));for(let r of e)o.observe(r);t.signal.subscribe(()=>o.disconnect())})}function af(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function sf(e){return e instanceof HTMLElement&&(!("disabled"in e)||!e.disabled)&&(e.offsetParent!==null||!!(e.offsetWidth&&e.offsetHeight))&&(e.tabIndex!==-1||e.contentEditable==="true"||e.hasAttribute("tabindex"))}function lf(e,t){return e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING?1:-1}function Wr(e,t,o){return r=>Ze(I(e?r.matches(e):!1),b(r,t).switchMap(()=>f(I(!0),b(r,o).map(()=>e?r.matches(e):!1))))}var cf=Wr("","animationstart","animationend"),qr=Wr("","mouseenter","mouseleave"),hl=Wr(":focus,:focus-within","focusin","focusout"),$r=e=>Y(qr(e),hl(e)).map(([t,o])=>t||o);function qt(e,t,o){return t=t?.toLowerCase(),b(e,"keydown",o).filter(r=>!t||!!r.key&&r.key.toLowerCase()===t)}function ko(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function Nt(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}function pf(e){return Nt(e)?.activeElement??null}var bl=Xt(e=>console.trace(e));A.prototype.log=function(){return this.pipe(bl)};A.prototype.raf=function(e){return this.pipe(wa(e))};var ne=Symbol("bindings"),Ea={},$t=Symbol("augments"),Mt=Symbol("parser"),Jr=class{bindings;messageHandlers;internals;attributes$=new ir;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,o){let r=!1;if(this.messageHandlers)for(let n of this.messageHandlers)n.type===t&&(n.next(o),r||=n.stopPropagation);return r}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let o of this.bindings)t.push(o.subscribe());if(this.prebind)for(let o of this.prebind)t.push(o.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},mr=Symbol("css"),u=class extends HTMLElement{static observedAttributes;static[$t];static[Mt];[ne]=new Jr;[mr];connectedCallback(){this[ne].wasInitialized=!0,this[ne].wasConnected||this.constructor[$t]?.forEach(t=>t(this)),this[ne].connect()}disconnectedCallback(){this[ne].disconnect()}attributeChangedCallback(t,o,r){let n=this.constructor[Mt]?.[t]??yl;o!==r&&(this[t]=n(r,this[t]))}};function yl(e,t){let o=t===!1||t===!0;return e===""?o?!0:"":e===null?o?!1:void 0:e}function Ca(e,t){Object.prototype.hasOwnProperty.call(e,$t)||(e[$t]=e[$t]?.slice(0)??[]),e[$t]?.push(t)}var vl={mode:"open"};function M(e){return e.shadowRoot??e.attachShadow(vl)}function Aa(e,t){t instanceof Node?M(e).appendChild(t):e[ne].add(t)}function ur(e,t){t.length&&Ca(e,o=>{for(let r of t){let n=r.call(e,o);n&&n!==o&&Aa(o,n)}})}function Na(e,t){Ea[e]=t,customElements.define(e,t)}function ue(e){return e[ne].internals??=e.attachInternals()}function mf(e,...t){return o=>{typeof e=="string"?(ur(o,t),Na(e,o)):(t.unshift(e),ur(o,t))}}function s(e,{init:t,augment:o,tagName:r}){if(t)for(let n of t)n(e);o&&ur(e,o),r&&Na(r,e)}function gf(e,...t){ur(e,t)}function Kt(e){return Ze(I(e),e[ne].attributes$.map(()=>e))}function L(e,t){return e[ne].attributes$.pipe(Ur(o=>o.attribute===t),jr(()=>e[t]))}function d(e,t){return f(L(e,t),X(()=>I(e[t])))}function xf(e,t,o){e[t]=o}function wl(e){let t=e.observedAttributes;return t&&!Object.prototype.hasOwnProperty.call(e,"observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function So(e,t,o){let r=o;return r===null||typeof r>"u"?r=null:typeof r=="boolean"&&(r=r?"":null),r===null?e.removeAttribute(t):e.setAttribute(t,String(r)),r}function kl(e,t,o){Object.prototype.hasOwnProperty.call(e,Mt)||(e[Mt]={...e[Mt]}),e[Mt]&&(e[Mt][t]=o)}function m(e,t){return o=>{t?.observe!==!1&&wl(o).push(e),t?.parse&&kl(o,e,t.parse);let r=`$$${e}`,n=o.prototype,i=Object.getOwnPropertyDescriptor(n,e);i&&Object.defineProperty(n,r,i);let a=t?.persist,c={enumerable:!0,configurable:!1,get(){return this[r]},set(l){this[r]!==l?(this[r]=l,a?.(this,e,l),this[ne].attributes$.next({target:this,attribute:e,value:l})):i?.set&&(a?.(this,e,l),this[r]=l)}};Ca(o,l=>{if(i||(l[r]=l[e]),Object.defineProperty(l,e,c),a?.(l,e,l[e]),t?.render){let g=t.render(l);g&&Aa(l,g)}})}}function h(e){return m(e,{persist:So,observe:!0})}function Sl(e,t,o){return new A(r=>{function n(i){i.target===e&&e[o]?.call(e,i)}e.addEventListener(t,n),r.signal.subscribe(()=>e.removeEventListener(t,n))})}function gr(e){let t=`on${e}`;return m(t,{render(o){return d(o,t).switchMap(r=>r?Sl(o,e,t):w)},parse(o){return o?new Function("event",o):void 0}})}function W(e){return m(e,{observe:!1})}function hf(){return{...Ea}}function y(){return document.createElement("slot")}function xr(e){return t=>{let[o,r]=e();return t[ne].add(o),r}}function El(e,t){let o=document.createTextNode("");return e[ne].add(t.tap(r=>o.textContent=String(r))),o}var Kr=document.createDocumentFragment();function dr(e,t,o=e){if(t!=null)if(Array.isArray(t)){for(let r of t)dr(e,r,Kr);o!==Kr&&o.appendChild(Kr)}else e instanceof u&&t instanceof A?o.appendChild(El(e,t)):t instanceof Node?o.appendChild(t):e instanceof u&&typeof t=="function"?dr(e,t(e),o):o.appendChild(document.createTextNode(String(t)))}function Gr(e,t,o){e[t]=o}function Cl(e){return typeof e=="function"}function Ma(e,t){for(let o in t){let r=t[o];if(e instanceof u)if(r instanceof A)e[ne].add(o==="$"?r:r.tap(n=>Gr(e,o,n)));else if(o==="$"&&Cl(r)){let n=r(e);n instanceof A&&e[ne].add(n)}else Gr(e,o,r);else Gr(e,o,r)}}function Al(e,t){return e.constructor.observedAttributes?.includes(t)}function Ta(e,t){let o=e instanceof u&&Al(e,t)?L(e,t):lr(e,[t]).map(()=>e[t]);return f(o,X(()=>I(e[t])))}function xe(e,t,o){return m(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let n=r===null?void 0:Number(r);return t!==void 0&&(n===void 0||n<t||isNaN(n))&&(n=t),o!==void 0&&n!==void 0&&n>o&&(n=o),n}})}function ee(e,t,o){for(let r=e.parentElement;r;r=r.parentElement)if(r instanceof u&&r[ne].message(t,o))return}function ie(e,t,o=!0){let r,n=0,i=new ge,a={type:t,next(c){n?i.next(c):(r??=[]).push(c)},stopPropagation:o};return e[ne].addMessageHandler(a),new A(c=>{n===0&&r?.length&&(r.forEach(g=>c.next(g)),r.length=0),n++;let l=i.subscribe(c);c.signal.subscribe(()=>{n--,l.unsubscribe()})})}function za(e,t,o,r=!0){return ie(e,t,r).tap(n=>{o[ne].message(t,n)})}function x(e,t,...o){let r=typeof e=="string"?document.createElement(e):new e;return t&&Ma(r,t),o.length&&dr(r,o),r}function se(e,t,...o){if(e!==se&&typeof e=="function"&&!(e.prototype instanceof u))return o.length&&((t??={}).children=o),e(t);let r=e===se?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&Ma(r,t),o.length&&dr(r,o),r}function Ia(e,t){return o=>new A(()=>{o.hasAttribute(e)||o.setAttribute(e,t)})}function Gt(e,t){return Ia(`aria-${e}`,t)}function Fa(e,t){return Xt(o=>e.setAttribute("aria-"+t,o===!0?"true":o===!1?"false":o.toString()))}function kf(e){return Xt(t=>e.setAttribute("aria-checked",t===void 0?"mixed":t?"true":"false"))}function k(e){return Ia("role",e)}function Sf(e,t){return ft(t).tap(o=>{e.setAttribute("aria-describedby",o)}).finalize(()=>e.removeAttribute("aria-describedby"))}function Da(e,t){return e.ariaLabel||e.getAttribute("aria-labelledby")?w:t.tap(o=>e.ariaLabel=o)}var Ra=0;function ot(e){return e.id||=`cxl__${Ra++}`}function ft(e){return Ta(e,"id").map(t=>(t||(e.id=`cxl__${Ra++}`),e.id))}function La(e,t){return Y(...t.map(o=>ft(o))).tap(o=>{e.setAttribute("aria-controls",o.join(" "))})}var Nl=["xsmall","small","medium","large","xlarge","xxlarge"],q=p(":host{display:contents}"),Ya=p(":host{position:absolute;display:block;width:0;height:0;overflow:hidden}"),en=[-2,-1,0,1,2,3,4,5],hr=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],Jt=wo(),br=Se(""),_=p(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),yr=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${C("body-medium")}
`,Ml=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),_a={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function vr(e=""){return`
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
		`}function ja(e=_a){return Object.entries(e).map(([t,o])=>`--cxl-color--${t}:${o};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var J={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:_a,imports:Ml?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
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
}`};function rt(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}function Ua(e){return`box-shadow:var(--cxl-elevation-${e});z-index:${e};`}var dt=p(rt()),Xa={"./theme-dark.js":()=>import("./theme-dark-F4QQQFSI.js")},nt=[0,4,8,"12",16,24,32,48,64],ut,Pa,Tl;function P(e,t){return e==="xsmall"?`@media(max-width:${J.breakpoints.small}px){${t}}`:`@media(min-width:${J.breakpoints[e]}px){${t}}`}function wr(e){return f(vo(async()=>e.getBoundingClientRect().width),re(e).map(t=>t.contentRect.width)).map(t=>{let o=J.breakpoints,r="xsmall";for(let n of Nl){if(o[n]>t)return r;r=n}return r}).distinctUntilChanged()}function zl(e=""){return Object.entries(Ga).map(([t,o])=>`:host([color=${t}]) ${e}{ ${o} }`).join("")}function le(e,t,o=""){return Wa(e,`
		${t?`:host ${o} { ${Ga[t]} }`:""}
		:host${t?"":"([color])"} ${o} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${o}{
			color: inherit;
			background-color: transparent;
		}
		${zl(o)}
	`)}function Wa(e,t){let o=p(t);return m(e,{persist:So,render:r=>o(r)})}function te(e,t){return Wa(e,en.map(o=>{let r=t(o);return o===0?`:host{--cxl-size:${o}}:host ${r}`:`:host([size="${o}"]){--cxl-size:${o}}:host([size="${o}"]) ${r}`}).join(""))}function qa(){let e=ut?document.adoptedStyleSheets.indexOf(ut):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Il(e){ut&&qa();let t=e.globalCss??"";e.colors&&(t+=`:root{${ja(e.colors)}}`),t?(ut=He(t),document.adoptedStyleSheets.push(ut)):ut=void 0,Jt.next({theme:e,stylesheet:ut,css:t}),br.next(e.name)}var Va="";function Oa(e){Il(e.default)}function $a(e){e?e!==Va&&(typeof e=="string"?import(e).then(Oa,t=>console.error(t)):e().then(Oa,t=>console.error(t))):ut&&(qa(),Jt.next(void 0),br.next("")),Va=e}function Fl(e){let t;return Jt.tap(o=>{let r=o?.theme.override?.[e.tagName];r?t?t.replace(r).catch(n=>console.error(n)):e.shadowRoot?.adoptedStyleSheets.push(t??=He(r)):t&&t.replaceSync("")})}function He(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function kr(e,t=""){let o=He(t);return M(e).adoptedStyleSheets.push(o),o}function p(e){let t;return o=>{let r=M(o);if(r.adoptedStyleSheets.push(t??=He(e)),!o[mr])return J.css&&r.adoptedStyleSheets.unshift(Tl??=He(J.css)),o[mr]=!0,Fl(o)}}var tn=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Ka=[...tn,"inherit"];function Qr(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function zf(e,t,o="transparent"){return`color-mix(in srgb, var(--cxl-color-${e}) ${t}%,${o})`}function Z(e){return`${Qr(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}function Dl(){let e={inherit:"color:inherit;background-color:inherit;",transparent:"color:inherit;background-color:transparent;"};for(let t of tn)e[t]=`
${Qr(t)}
${t==="inverse-surface"?Qr("inverse-primary","primary"):""}
`;return e}var Ga=Dl(),Ja=(e="")=>`${e?`:host(${e})`:":host"} { 
	--cxl-color-surface: transparent; 
	border-style: solid; 
	border-color: var(--cxl-color-on-surface); 
	border-width: 1px; 
	box-shadow: none;
}
${tn.map(t=>`:host(${e}[color=${t}]) { --cxl-color-on-surface: var(--cxl-color--${t}); }`).join("")}
`;function Qt(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function C(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}function If(){cancelAnimationFrame(Qa)}var Qa=requestAnimationFrame(()=>Vl()),Za={},Ba=document.createElement("template"),Ha={};function Rl(e){return function(t){let o=e(t),r=Ha[o];if(r){let a=r.cloneNode(!0);if(a instanceof SVGSVGElement)return a}let n=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=()=>(n.dispatchEvent(new ErrorEvent("error")),"");return fetch(o).then(a=>a.ok?a.text():i(),i).then(a=>{if(!a)return;Ba.innerHTML=a;let c=Ba.content.children[0];if(!(c instanceof SVGSVGElement))return;let l=c.getAttribute("viewBox");l?n.setAttribute("viewBox",l):c.hasAttribute("width")&&c.hasAttribute("height")&&n.setAttribute("viewBox",`0 0 ${c.getAttribute("width")} ${c.getAttribute("height")}`);for(let g of c.childNodes)n.append(g);Ha[t.name]=n}).catch(a=>console.error(a)),n.setAttribute("fill","currentColor"),n}}var Ll=Rl(({name:e,width:t,fill:o})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${o?"fill1_":""}${t}px.svg`)),es=Ll;function Ff(e){es=e}function Df(e){Za[e.id]=e}function Zt(e,t={}){let{width:o,height:r}=t;o===void 0&&r===void 0&&(o=r=24);let n=Za[e]?.icon()??es({name:e,width:o,fill:t.fill});return t.className&&n.setAttribute("class",t.className),o&&(n.setAttribute("width",`${o}`),r===void 0&&n.setAttribute("height",`${o}`)),r&&(n.setAttribute("height",`${r}`),o===void 0&&n.setAttribute("width",`${r}`)),t.alt&&n.setAttribute("alt",t.alt),n}var Zr,Pl=new Promise(e=>{Zr=()=>{Jt.next(void 0),e()}});function Vl(e){cancelAnimationFrame(Qa),Pa||(e&&(e.colors&&(J.colors=e.colors),e.globalCss&&(J.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(Pa=He(`html{${ja(J.colors)}}${J.globalCss}`)),J.imports?Promise.allSettled(J.imports.map(t=>{let o=document.createElement("link");return o.rel="stylesheet",o.href=t,document.head.append(o),new Promise((r,n)=>(o.onload=r,o.onerror=n))})).then(Zr,t=>console.error(t)):Zr())}function mt(){return vo(async()=>{await Pl,await document.fonts.ready})}var on=class extends u{type;details};s(on,{tagName:"c-action",init:[m("type"),m("details")],augment:[q,y,e=>R(e).tap(()=>{e.type&&ee(e,e.type,e.details)})]});function Ol(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.controller??t.target}function Bl(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.target}function Ce(e,t,o){return new A(r=>{let n={id:e,controller:o,target:t};tt().subscribe({next:()=>ee(t,`registable.${e}`,n),signal:r.signal}),r.signal.subscribe(()=>n.unsubscribe?.())})}function Sr(e,t,o,r){return new A(n=>{function i(c){let l=Bl(e,c);c.unsubscribe=()=>{let N=o.indexOf(l);N!==-1&&o.splice(N,1),r?.({type:"disconnect",target:l,elements:o}),n.next()};let g=o.indexOf(l);g!==-1&&o.splice(g,1);let v=0,S=o.length;for(;v<S;){let N=v+S>>1,T=o[N];if(!T)break;T.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING?v=N+1:S=N}o.splice(v,0,l),r?.({type:"connect",target:l,elements:o}),n.next()}let a=ie(t,`registable.${e}`).subscribe(i);n.signal.subscribe(a.unsubscribe)})}function gt(e,t,o=new Set){let r=va();return f(ie(t,`registable.${e}`).map(n=>{let i=n.target,a=Ol(e,n);return n.unsubscribe=()=>{o.delete(a),r.next({type:"disconnect",target:a,element:i,elements:o})},o.add(a),{type:"connect",target:a,element:i,elements:o}}),r)}function rn(e){return e in J.animation}function he({target:e,animation:t,options:o}){if(J.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in J.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?J.animation[t]:t,n=typeof r.kf=="function"?r.kf(e):r.kf,i={duration:250,easing:J.easing.emphasized,...r.options,...o,...J.prefersReducedMotion?{duration:0}:void 0};return e.animate(n,i)}function Eo(e){let{trigger:t,stagger:o,commit:r,keep:n}=e;function i(c){return new A(l=>{let g=he(c);g.ready.then(()=>l.next({type:"start",animation:g}),v=>{console.error(v)}),g.addEventListener("finish",()=>{l.next({type:"end",animation:g}),r&&g.commitStyles(),!(n||n!==!1&&c.options?.fill&&(c.options.fill==="both"||c.options.fill==="forwards"))&&l.complete()}),l.signal.subscribe(()=>{try{g.cancel()}catch{}})})}let a=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return f(...a.map((c,l)=>{let g={...e.options,delay:o!==void 0?(e.options?.delay??0)+l*o:e.options?.delay};return(t==="visible"?fr(c).filter(S=>S):t==="hover"?qr(c):I(!0)).switchMap(S=>S?i({...e,options:g,target:c}):w)}))}var xt;function ts(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function Hl(e){return e==="infinite"?1/0:+e}function Yl(e){if(rn(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let o={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(g,v,S)=>(v&&(r=+v),(S==="replace"||S==="add"||S==="accumulate")&&(o.composite=S),"")),xt??=document.createElement("style").style,xt.animation=e;let n=xt.animationFillMode;(n==="none"||n==="forwards"||n==="backwards"||n==="both")&&(o.fill=n);let i=o.fill==="forwards"||o.fill==="both",a=t?void 0:ts(xt.animationDuration);a!==void 0&&(o.duration=a);let c=ts(xt.animationDelay);c!==void 0&&(o.delay=c),xt.animationIterationCount&&(o.iterations=Hl(xt.animationIterationCount));let l=xt.animationName;if(!rn(l))throw new Error(`Animation "${l}" not defined`);return{animation:l,keep:i,stagger:r,options:o}}function _l(e){return typeof e=="string"&&(e=e.split(",").map(t=>Yl(t.trim()))),e}function Co(e,t,o,r){let n=r?`motion-${r}-on`:"motion-on",i=_l(o);return e.setAttribute(n,""),f(...i.map(a=>Eo({target:t,...a}))).finalize(()=>e.removeAttribute(n))}var eo=p(":host(:not([open],[motion-out-on])){display:none}");function it(e,t=()=>e,o=!1){let r=X(()=>I(t("in"))),n=X(()=>I(t("out"))),i=X(()=>e.duration!==void 0&&e.duration!==1/0?et(e.duration).map(()=>e.open=!1):w).log();return f(ie(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),Y(d(e,"motion-in").map(a=>(a?r.mergeMap(c=>Co(e,c,a,"in")):r).mergeMap(()=>i)),d(e,"motion-out").map(a=>(a?n.switchMap(c=>Co(e,c,a,"out")):n).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([a,c])=>L(e,"open").switchMap(l=>{if(e.popover!=="auto"){let g=l?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:l?"closed":"open",newState:g}))}return l?o?Ze(c,a):a:o?Ze(c,a):c})))}var Ye=class extends u{open=!1;duration;"motion-in";"motion-out"};s(Ye,{init:[m("motion-in"),m("motion-out"),xe("duration"),h("open")]});var Ao=class extends Ye{};s(Ao,{tagName:"c-toggle-target",augment:[p(`
:host{display:contents}
`),e=>{let t=x("slot"),o=x("slot",{name:"off"});return(e.open?o:t).style.display="none",M(e).append(t,o),it(e,r=>{t.style.display=o.style.display="none";let n=e.open?r==="in"?t:o:r==="in"?o:t;return n.style.display="",n.assignedElements()},!0)}]});var nn={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(o){console.error(o)}}};function nu(e){return(t,o)=>t[e]>o[e]?1:t[e]<o[e]?-1:0}function at(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let o,r=e.getRootNode();return r instanceof ShadowRoot&&(o=r.getElementById(t),o)?o:e.ownerDocument.getElementById(t)??void 0}function Er(e,t){return d(e,t).map(o=>typeof o=="string"?at(e,o):o instanceof HTMLElement?o:void 0)}async function iu(e,...[t]){try{return e instanceof Response?await e.json():JSON.parse(os(e))}catch{if(t!==void 0)return t;throw t}}function au(e,...[t]){try{return JSON.parse(os(e))}catch{if(t!==void 0)return t;throw t}}function os(e,t){return e?typeof e=="string"?e:new TextDecoder(t).decode(e):""}var st=class extends u{};s(st,{tagName:"c-span"});var an=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},de=new an;function jl(e){return e instanceof u}var Ar=(e,t,o=e)=>R(e).tap(()=>ee(o,"toggle.close",t)),yu=(e,t,o=e)=>R(e).tap(()=>ee(o,"toggle.open",t));function Cr(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(o=>{let r=at(e,o);return r?[r]:[]}):Array.isArray(t)?t:[t]}function ln(e,t,o,r,n=b(e,"click").map(()=>!o())){return f(r,n).switchMap(i=>{let a=t();return a?Oe(a.map(c=>({target:c,open:i}))):w})}function Tt(e,t=e){function o(i,a){return[d(e,"open").switchMap(c=>(i.parentNode||de.popupContainer.append(i),i.open=c,c&&jl(i)?L(i,"open").map(l=>{e.open&&l===!1&&(e.open=!1)}):w)),ft(i).tap(c=>{let l=i.getAttribute("role");(l==="menu"||l==="listbox"||l==="tree"||l==="grid"||l==="dialog")&&(a.ariaHasPopup=l),a.getRootNode()===i.getRootNode()&&a.setAttribute("aria-controls",c)})]}let r=Y(d(e,"trigger"),d(e,"target")).switchMap(([i])=>{let a=Cr(e),c=a?f(...a.flatMap(l=>o(l,e))).ignoreElements():w;return f(i==="hover"?Y($r(t),a?f(...a.map(l=>$r(l))):w).map(l=>!!l.find(g=>!!g)).debounceTime(250):i==="checked"?b(t,"change").map(l=>l.target&&"checked"in l.target?!!l.target.checked:!1):b(t,"click").map(l=>(l.stopPropagation(),!e.open)),c)}),n;return ka().switchMap(()=>ln(t,()=>Cr(e),()=>e.open,d(e,"open"),r).filter(i=>{let{open:a,target:c}=i;if(e.open!==a){if(a){let l=Nt(e)?.activeElement;n=l instanceof HTMLElement?l:void 0,c.trigger=e}else if(c.trigger&&c.trigger!==e)return i.open=!0,c.trigger=e,!0;return e.open=a,!1}if(!a&&c.trigger===e){let l=document.activeElement;(l===document.body||l===document.documentElement)&&n?.focus()}return!0}))}var ht=class extends u{open=!1;target;trigger};s(ht,{init:[m("target"),m("trigger"),h("open")],augment:[e=>Tt(e).raf(({target:t,open:o})=>t.open=o)]});var sn=class extends ht{};s(sn,{tagName:"c-toggle",augment:[q,y]});var zt=class extends Ye{};s(zt,{tagName:"c-details",augment:[p(`
:host { display: block; }
:host(:not([open],[motion-out-on])) #body {display:none}
		`),e=>{let t=x("slot",{id:"body"}),o=x("slot",{id:"header",name:"header"});return M(e).append(o,t),f(ln(o,()=>[e],()=>e.open,d(e,"open")).raf(({open:r})=>{e.open=r}),it(e,()=>t))}]});var cn=class extends u{panels=new Set};s(cn,{tagName:"c-accordion",augment:[e=>gt("accordion",e,e.panels),e=>b(e,"toggle",{capture:!0}).tap(t=>{let o=t.target;if(o instanceof zt&&o.open&&e.panels.has(o))for(let r of e.panels)r!==o&&(r.open=!1)})]});var me=class extends u{name="";width;height;alt;fill=!1};s(me,{tagName:"c-icon",init:[m("name"),m("width"),m("height"),m("fill"),m("alt")],augment:[k("none"),p(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,o;return e.shadowRoot?.adoptedStyleSheets.push(t),Wt(e).switchMap(()=>Kt(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,n=e.height??e.width;if(t.replace(`:host{${r===void 0?"":`width:${r}px;`}${n===void 0?"":`height:${n}px`}}`).catch(i=>{}),o?.remove(),o=e.name?Zt(e.name,{className:"icon",width:r,height:n,fill:e.fill,alt:e.alt}):void 0,o){let i=o;i.onerror=()=>{e.alt&&i.replaceWith(e.alt)},M(e).append(i)}})}]});function pn(e){return d(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function Ul(e,t=e,o=0){let r=t.hasAttribute("tabindex")?t.tabIndex:o;return pn(e).tap(n=>{n?t.removeAttribute("tabindex"):t.tabIndex=r})}function Xl(e,t=e){return f(b(t,"focusout").tap(()=>e.touched=!0),f(L(e,"disabled"),L(e,"touched")).tap(()=>ee(e,"focusable.change")))}function Ae(e,t=e,o=0){return f(Ul(e,t,o),Xl(e,t))}function rs(e,t,o=e.getBoundingClientRect()){let r=o.width>o.height?o.width:o.height,n=new Nr,i=e.shadowRoot||e,a=t instanceof MouseEvent?t.x:1/0,c=t instanceof MouseEvent?t.y:1/0,l=!t||ko(t),g=a>o.right||a<o.left||c>o.bottom||c<o.top;return n.x=l||g?o.width/2:a-o.left,n.y=l||g?o.height/2:c-o.top,n.radius=r,t||(n.duration=0),i.prepend(n),n}function ns(e,t=e){let o,r,n,i=()=>{o=rs(t,r instanceof Event?r:void 0,n),o.duration=600,r=void 0};return f(b(e,"click").tap(a=>{r=a,n=t.getBoundingClientRect()}),d(e,"selected").raf().switchMap(()=>{if(e.selected){if(!o?.parentNode){if(!e.checkVisibility())return r=void 0,Wt(e).tap(i);i()}}else o&&is(o).catch(a=>console.error(a));return w})).ignoreElements()}function is(e){return new Promise(t=>{he({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function ce(e,t=e){let o=!1,r=0;return f(b(t,"pointerdown"),b(t,"click")).tap(n=>n.cxlRipple??=e).raf().mergeMap(n=>{if(n.cxlRipple===e&&!o&&!e.disabled&&e.parentNode){r=Date.now(),o=!0,e.style.setProperty("--cxl-mask-hover","none");let i=rs(e,n),a=i.duration,c=()=>{e.style.removeProperty("--cxl-mask-hover"),is(i).catch(()=>{}).finally(()=>{o=!1})};return n.type==="click"?et(a).tap(c):f(b(document,"pointerup"),b(document,"pointercancel")).first().map(()=>{let l=Date.now()-r;setTimeout(()=>c(),l>a?32:a-l)})}return w})}var Nr=class extends u{x=0;y=0;radius=0;duration=500};s(Nr,{tagName:"c-ripple",init:[m("x"),m("y"),m("radius")],augment:[p(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",Q(()=>{let o=t.style;o.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,o.width=o.height=e.radius*2+"px",t.parentNode||M(e).append(t),he({target:t,animation:"expand",options:{duration:e.duration}}),he({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var It=[_,dt,p(`
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
}`)],Wl=p(`
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
`);function fn(e){return d(e,"disabled").switchMap(t=>t?w:cr(e).tap(o=>{o.stopPropagation(),e.click()}))}function ze(e){return f(fn(e),Ae(e))}var to=class extends u{disabled=!1;touched=!1};s(to,{init:[h("disabled"),h("touched")],augment:[k("button"),ze]});var _e=class extends to{size;color;variant};s(_e,{tagName:"c-button",init:[te("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),le("color","primary"),h("variant")],augment:[...It,Wl,ce,y]});var No=class extends zt{constructor(){super(),this["motion-in"]="openY",this["motion-out"]="closeY"}};s(No,{tagName:"c-accordion-panel",augment:[k("region"),p(`
:host {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-bottom: 1px solid var(--cxl-color-outline-variant);
}
#body {
	display: block;
	overflow: hidden;
}
		`),e=>Ce("accordion",e)]});var un=class extends u{disabled=!1;touched=!1};s(un,{tagName:"c-accordion-header",init:[h("disabled")],augment:[k("button"),p(`
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
		`),_,e=>{let t=new me;t.name="keyboard_arrow_down",t.id="icon",t.role="none",e.slot||="header",M(e).append(t,document.createElement("slot"));let o=e.parentElement;return o instanceof No?f(ft(o).tap(r=>e.setAttribute("aria-controls",r)),d(o,"open").tap(r=>{t.classList.toggle("open",r),e.ariaExpanded=String(r)})):w},ze]});var Ft=class extends u{outline=!1;color};s(Ft,{tagName:"c-alert",init:[h("outline"),le("color","inverse-surface")],augment:[k("alert"),p(`
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
	${Ja("[outline]")}`),y]});function ql(e){if("message"in e&&typeof e.message=="string")return e.message;if("error"in e&&typeof e.error=="string")return e.error;if("status"in e&&typeof e.status=="number")return`HTTP ${e.status}${"statusText"in e&&typeof e.statusText=="string"&&e.statusText?` ${e.statusText}`:""}`;if("toString"in e&&typeof e.toString=="function"&&e.toString!==Object.prototype.toString)return e.toString();if(Object.keys(e).length===0)return"Unknown Error"}function $l(e){if(e==null)return"Unknown Error";if(typeof e=="string")return e||"Unknown Error";if(e instanceof Response)return`HTTP ${e.status} ${e.statusText}`;if(e instanceof Error)return e.message||"Unknown Error";if(typeof e=="object"){let t=ql(e);if(t)return t}if(typeof e=="symbol"||typeof e=="function")return String(e);try{return JSON.stringify(e)||"Unknown Error"}catch{return String(e)||"Unknown Error"}}var dn=class extends Ft{color="error";error};s(dn,{tagName:"c-alert-error",init:[W("error")],augment:[e=>d(e,"error").tap(t=>{e.textContent=$l(t)})]});var mn=[p(`
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
}`),y,()=>x("slot",{name:"title"})];function Kl(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var Mo=class extends u{size;sticky=!1;contextual};s(Mo,{tagName:"c-appbar",init:[h("size"),h("sticky"),h("contextual")],augment:[p(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...mn,()=>x("slot",{name:"contextual"}),e=>d(e,"sticky").switchMap(t=>t?pr(e,{threshold:[1]}).tap(o=>e.toggleAttribute("scroll",o.intersectionRatio<1)):w),e=>{let t;return f(sr(e),d(e,"contextual")).raf().switchMap(()=>{for(let o of e.children)if(Kl(o)&&(o.slot="contextual",o.open=o.name===e.contextual,o.open))return t=o,b(o,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,w})}]});var gn=class extends u{};s(gn,{tagName:"c-appbar-title",augment:[k("heading"),Gt("level","1"),p(`
:host {
	display: block;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
}
	`),y]});var To=class extends _e{};s(To,{tagName:"c-button-round",augment:[p(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var Ie=class extends To{icon="";width;height;fill=!1;variant="text";alt};s(Ie,{tagName:"c-icon-button",init:[m("icon"),m("width"),m("height"),m("alt"),m("fill")],augment:[e=>x(me,{className:"icon",width:d(e,"width"),height:d(e,"height"),name:d(e,"icon"),fill:d(e,"fill"),alt:d(e,"alt")})]});var jd=1440*60*1e3,Gl=/^\s*(\d{1,2})\s*:\s*(\d{1,2})\s*(?::(\d{1,2})\s*)?([pPaA][mM])?/,Jl=/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;function Ql(e){let t=Gl.exec(e);if(t){let o=new Date,r=+(t[1]??0),n=t[4]?.toLowerCase()==="pm";return o.setHours(n?r+12:r),o.setMinutes(+(t[2]??0)),o}return new Date(NaN)}function Zl(e){let t=new Date(Jl.test(e)?`${e}T00:00`:e);return isNaN(t.getTime())&&(t=Ql(e)),t}function as(e,t,o){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(o,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(o,{dateStyle:t,timeStyle:t})}function ss(e){return m(e,{parse:t=>t?Zl(t):void 0})}function ls(e,t,o){return typeof o=="string"?as(t,o,e):t.toLocaleString(e,o)}var xn={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function ec(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var zo={content:xn,name:"default",localeName:ec(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>ls(zo.localeName,e,t)},tc={content:xn,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>ls("en-US",e,t)};function oc(){let e=Se(zo),t={default:zo,en:tc},o={},r=e.map(a=>a.content);async function n(a){let c=a.split("-")[0];if(!c)return zo;if(!(t[a]??t[c])){let g=o[a]??o[c];g&&await g()}return t[c]||zo}async function i(a){e.next(await n(a))}return navigator.language&&n(navigator.language).then(a=>e.next(a)).catch(a=>console.error(a)),{content:r,registeredLocales:t,locale:e,setLocale:i,getLocale(a){return a?vo(()=>n(a)):e},get(a,c){return r.map(l=>l[a]??"")},register(a){t[a.name]=a}}}var oe=oc();function Gd(e){return Y(oe.locale,d(e,"locale")).switchMap(([t,o])=>o?oe.getLocale(o):I(t))}function oo(e){return Object.assign(xn,e),oe.get}function Jd(e,t){return oe.locale.map(o=>o.formatDate(e,t))}function Qd(e){return t=>t?oe.locale.map(o=>o.formatDate(t,e)):I("")}function Zd(e,t,o=oe.locale){let r=new Date,n=t==="xsmall"?"narrow":t==="small"?"short":"long";return r.setDate(r.getDate()-r.getDay()+e),o.map(i=>i.formatDate(r,{weekday:n}))}var cs=class e extends u{name;size;open=!1;backIcon=x(Ie,{icon:"arrow_back",className:"icon",ariaLabel:oe.get("core.close"),$:t=>R(t).tap(()=>this.open=!1)});static{s(e,{tagName:"c-appbar-contextual",init:[m("name"),h("open"),h("size")],augment:[t=>t.backIcon,...mn,p(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>L(t,"open").tap(o=>{o||t.dispatchEvent(new Event("close"))})]})}};function ps(e=document){document.documentElement.lang="en";let t=[x("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),x("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),x("meta",{name:"mobile-web-app-capable",content:"yes"}),x("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${C("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function fs(e=2e3){return f(et(e),mt()).first()}function us(e){return fs().raf(()=>e.setAttribute("ready",""))}function Mr(e){return f(Q(t=>{let o=ps(e.ownerDocument);t.signal.subscribe(()=>o.forEach(r=>r.remove()))}),tt().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),fs().switchMap(()=>wr(e).raf(t=>e.setAttribute("breakpoint",t))),us(e),br.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var hn=class extends u{connectedCallback(){requestAnimationFrame(()=>ps(this.ownerDocument)),super.connectedCallback()}};s(hn,{tagName:"c-meta",augment:[()=>us(document.body)]});function ds(e,t,o){o==="in"&&(e.style.display="");let r=e.offsetWidth,n=he({target:e,animation:{kf:{[t]:o==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});o==="out"&&(n.onfinish=()=>e.style.display="none")}var bn=class extends u{sheetstart=!1;sheetend=!1};s(bn,{tagName:"c-application",init:[h("sheetstart"),h("sheetend")],augment:[p(`
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
	`),Mr,e=>ie(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>ie(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=x("slot",{name:"start"}),o=x("slot",{id:"body"}),r=x("slot",{name:"end"}),n=He("html { overflow: hidden }");return M(e).append(t,o,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),de.popupContainer=e,f(Q(i=>{let a=e.ownerDocument.adoptedStyleSheets;a.push(n),i.signal.subscribe(()=>{let c=a.indexOf(n);c!==-1&&a.splice(c,1)})}),L(e,"sheetstart").tap(i=>ds(t,"marginLeft",i?"in":"out")),L(e,"sheetend").tap(i=>ds(r,"marginRight",i?"in":"out")))}]});var yn=class extends u{assertive=!1};s(yn,{tagName:"c-aria-live",init:[m("assertive")],augment:[Ya,y,e=>d(e,"assertive").tap(t=>{e.role=t?"alert":"status",e.ariaLive=t?"assertive":"polite",e.ariaAtomic="true"})]});var rc=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,nc=/^\d{5}(?:[-\s]\d{4})?$/,ic={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},ms={required:uc,email:dc,json:xc,zipcode:mc,nonZero:pc,nonEmpty:cc},ac={pattern:fc,equalToElement:vn(bs),greaterThan:xs,lessThan:hs,greaterThanElement:vn(xs),lessThanElement:vn(hs),min:bc,max:yc,equalTo:bs,maxlength:vc,minlength:wc},sc=oo(ic);function vn(e){return(t,o)=>{let r=typeof t=="string"?at(o,t):t;if(!r)throw"Invalid element";return e(r)}}function je(e,t){return{key:e,valid:t,message:sc(`validation.${e}`,"validation.invalid")}}function lc(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function cc(e){return je("nonEmpty",!lc(e))}function pc(e){return je("nonZero",e===""||Number(e)!==0)}function fc(e){let t=typeof e=="string"?e=new RegExp(e):e;return o=>je("pattern",typeof o=="string"&&(o===""||t.test(o)))}function wn(e){return e!=null&&e!==""}function uc(e,t){let o=t&&"checked"in t?!!t.checked:!0;return je("required",o&&wn(e))}function dc(e){return je("email",typeof e=="string"&&(e===""||rc.test(e)))}function mc(e){return je("zipcode",typeof e=="string"&&(e===""||nc.test(e)))}function gc(e){if(typeof e!="string")return!1;try{return JSON.parse(e),!0}catch{return!1}}function xc(e){return je("json",gc(e))}function hc(e){return e instanceof HTMLElement&&"value"in e}function Io(e,t,o){let r=hc(t)?d(t,"value"):t instanceof A?t:I(t);return n=>r.map(i=>je(e,!wn(n)||!wn(i)||o(n,i)))}function gs(e,t){let o=/(\w+)(?:\(([^)]+?)\))?/g,r=[],n;for(;n=o.exec(e);){let i=n[1];if(!i)throw`Invalid rule "${i}"`;if(n[2]){let a=ac[i];if(!a)throw`Invalid rule "${i}"`;r.push(a(n[2],t))}else if(i in ms){let a=ms[i];a&&r.push(a)}else throw`Invalid rule "${i}"`}return r}function ys(e,t){let o=(typeof e=="string"?gs(e,t):e).flatMap(r=>typeof r=="string"?gs(r,t):r);return(r,n)=>o.map(i=>{let a=i(r,n);return a instanceof A?a:a instanceof Promise?Oe(a):I(a)})}function bc(e){return Io("min",e,(t,o)=>Number(t)>=Number(o))}function xs(e){return Io("greaterThan",e,(t,o)=>Number(t)>Number(o))}function yc(e){return Io("max",e,(t,o)=>Number(t)<=Number(o))}function hs(e){return Io("lessThan",e,(t,o)=>Number(t)<Number(o))}function bs(e){return Io("equalTo",e,(t,o)=>t===o||typeof t!=typeof o&&String(t)===String(o))}function vc(e){return t=>je("maxlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length<=+e)}function wc(e){return t=>je("minlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length>=+e)}function kc(e){return vs(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function ro(e){return L(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||Be(e,"change",{bubbles:!0})})}function vs(e){return f(d(e,"value"),d(e,"checked")).map(()=>{})}var pe=class e extends u{static formAssociated=!0;inputValue;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{s(e,{init:[h("autofocus"),h("invalid"),h("disabled"),h("touched"),m("rules"),h("name"),W("validationResult"),gr("update")],augment:[t=>(t.defaultValue=t.value,f(Ce("form",t),L(t,"invalid").tap(()=>Be(t,"invalid")),d(t,"invalid").switchMap(o=>{if(o){if(t.setAria("invalid","true"),!t.validationMessage)return oe.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return w}),Q(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),d(t,"rules").switchMap(o=>{if(!o)return w;let r=ys(o,t);return vs(t).switchMap(()=>f(...r(t.value,t)).tap(n=>t.setValidity(n))).finalize(()=>t.resetValidity())}),d(t,"value").tap(o=>t.setFormValue(o)),d(t,"validationResult").switchMap(o=>!o||o.valid?w:o.message instanceof A?o.message:o.message===void 0?oe.get("validation.invalid"):I(o.message)).tap(o=>{t.setCustomValidity(o)}))),kc]})}get labels(){return ue(this).labels}get validity(){return ue(this).validity}get validationMessage(){return ue(this).validationMessage}reportValidity(){return ue(this).reportValidity()}checkValidity(){return ue(this).checkValidity()}setCustomValidity(t){let o=!!t,r=t!==this.validationMessage;this.applyValidity(o,t),this.invalid!==o?this.invalid=o:r&&Be(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,o){o?this.setAttribute(`aria-${t}`,o):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let o in this.validMap){let r=this.validMap[o];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,o){ue(this).setValidity({customError:t},o)}formDisabledCallback(t){this.disabled=t}setFormValue(t){ue(this).setFormValue(t==null?null:String(t))}};function Sc(e,t){let o,r=t.key;if(r==="ArrowDown"&&e.goDown)o=e.goDown();else if(r==="ArrowRight"&&e.goRight)o=e.goRight();else if(r==="ArrowUp"&&e.goUp)o=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)o=e.goLeft();else if(r==="Home")o=!t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")o=!t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)o=e.other(t);else return null;return t.stopPropagation(),o&&t.preventDefault(),o}function lt(e){return b(e.host,"keydown").map(t=>Sc(e,t)).filter(t=>!!t)}function Ec(e){return new A(t=>{let o=e.focus;e.focus=()=>{o.call(e),t.next()},t.signal.subscribe(()=>e.focus=o)})}function Fo({host:e,observe:t,getFocusable:o,getSelected:r,getActive:n=()=>kn(e)}){let i=[];function a(){let c=i.find(l=>!l.disabled&&!l.hidden&&l.checkVisibility());c&&(c.tabIndex=0)}return f(b(e,"focusin").tap(()=>{let c=n(),l=!1;for(let g of i)g.tabIndex=g===c?(l=!0,0):-1;l||a()}),(t??I(!0)).tap(()=>{i=o();let c=i.find(g=>g.tabIndex===0);if(c){for(let g of i)g!==c&&(g.tabIndex=-1);return}let l=r?.();l?l.tabIndex=0:a()}),e instanceof HTMLElement?Ec(e).tap(()=>{let c=o();(c.find(g=>g.tabIndex===0)??c.at(0))?.focus()}):w).ignoreElements()}function kn(e){let t=Nt(e)?.activeElement??document.activeElement??void 0;return t instanceof HTMLElement?t:void 0}function Do({getFocusable:e,getActive:t}){return(o=1,r,n=i=>!i.checkVisibility())=>{let i=t(),a=e(),c=r??(i?a.indexOf(i):-1),l;do l=a.at(c+=o);while(l&&n(l));return l}}function Om(e){let{host:t,getFocusable:o,orientation:r,observe:n}=e,i=Do(e),a=[];function c(l){l instanceof HTMLElement&&l.focus({focusVisible:!0})}return f((n??I(!0)).tap(()=>a=o()),Fo(e),lt({host:t,...r==="horizontal"?{goRight:()=>i(1),goLeft:()=>i(-1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>i(1,-1),goLast:()=>i(-1,a.length),other:e.customKey}).tap(c))}function Tr({host:e,input:t,handleOther:o=!1,axis:r}){let n=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function i(S=1){if(e.open===!1){e.open=!0;let N=n();requestAnimationFrame(()=>{N?.focused&&g(N)})}else return a(S)}function a(S=1,N){let T=n(),z=N??(T?e.options.indexOf(T):-1),D;do D=e.options.at(z+=S);while(D?.hidden);return D}function c(S){let N=S.key;if(/^\w$/.test(N)){let T=n(),z=T?e.options.indexOf(T):-1;if(z===-1)return;let D=z;D+1>=e.options.length&&(z=0);let $=new RegExp(`^\\s*${N}`,"i"),K;for(;K=e.options.at(++z);)if(!K.hidden&&K.textContent.match($))return K;if(D===0)return;for(z=0;z<D&&(K=e.options.at(z++));)if(!K.hidden&&K.textContent.match($))return K}}let l=()=>e.options.find(S=>S.focused);function g(S){for(let N of e.options)N.focused=!1;S?(S.focused=!0,t?.setAria("activedescendant",ot(S)),S.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let v=S=>ee(S,"selectable.action",S);return f(lt({host:t??e,...r==="x"?{goLeft:()=>i(-1),goRight:()=>i(1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>e.open!==!1?a(1,-1):void 0,goLast:()=>e.open!==!1?a(-1,e.options.length):void 0,other:o?c:void 0}).tap(S=>{e.open===!1?v(S):g(S)}),b(t??e,"focus").tap(()=>g(n())),qt(t??e,"Enter").tap(S=>{let N=l();e.open!==!1&&N?(S.stopPropagation(),v(N)):e.open===!1&&(e.open=!0)}))}function Sn(e){return new A(t=>{f(Sr("selectable",e,e.options,o=>{if(o.type==="connect"&&(o.target.view=e.optionView,o.target.selected))return e.defaultValue===void 0&&(e.defaultValue=o.target.value),t.next(o.target);let r;for(let n of e.options)n.hidden||!n.parentNode||n.selected&&(r?n.selected=!1:r=n);t.next(r)}),ie(e,"selectable.action").tap(o=>{if(!e.disabled&&e.options.includes(o)){let r=e.value!==o.value;t.next(o),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var bt=Symbol("unselected"),no=class e extends pe{options=[];_value;_selected=bt;static{s(e,{init:[m("value"),W("selected")],augment:[t=>Sn(t).tap(o=>{(!o||o!==t.selected)&&t.setSelected(o)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===bt?this.options[0]?.value:this._value}get selected(){return this._selected===bt&&this.options[0]?this.options[0]:this._selected===bt?void 0:this._selected}set value(t){if(this._selected&&this._selected!==bt&&this._selected.value===t){this._value=t;return}else for(let o of this.options)if(o.value===t){this._value=t,this.setSelected(o);return}this._selected!==bt?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let o of this.options)o.focused=o.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==bt&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=bt)}};function io(e,t,...o){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let[n,i]of Object.entries(t??{}))n!=="children"&&r.setAttribute(n==="className"?"class":n,i===void 0?"":String(i));return o.length&&r.append(...o),r}function Dt(e){return io("svg",e,io("path",{d:e.d}))}function Cc({host:e,target:t,position:o,onToggle:r,whenClosed:n=w}){return i=>(t.popover??="auto",t.togglePopover(i),r?.(i),i?f(re(e),b(window,"resize"),b(window,"scroll",{capture:!0,passive:!0})).tap(o):n)}function ws(e){let{host:t,beforeToggle:o,target:r}=e,n=Cc({...e,whenClosed:R(t).tap(()=>{t.open=!0})});return f(b(r,"toggle").tap(i=>{let a=i.newState==="open";t.open=a}),d(t,"open").raf().switchMap(i=>(o?.(i),t.ariaExpanded=i?"true":"false",n(i))))}function ks(e){return f(d(e,"selected").pipe(Fa(e,"selected")),Ce("selectable",e),R(e).tap(()=>ee(e,"selectable.action",e)))}var En=class extends u{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};s(En,{tagName:"c-option",init:[m("value"),W("view"),h("selected"),h("hidden"),h("focused")],augment:[k("option"),p(":host{display:contents}"),ro,ks,e=>{let t;return f(d(e,"view").switchMap(o=>o?(t?.remove(),e.rendered=t=new o,t.appendChild(x("slot")),M(e).append(t),f(d(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),d(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,w)))}]});var Ro=class extends u{invalid=!1};s(Ro,{tagName:"c-field-help",init:[m("invalid")],augment:[p(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${C("body-small")}
}
	`),y,e=>(e.slot||="help",d(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Rt=p(`
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
`),An=p(`
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
`),Ac=p(`
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

${rt(".content")}
	`);function Nc(e){return f(ie(e,"registable.form",!1).tap(t=>{t.id==="form"&&t.target instanceof pe&&(e.input=t.target)}),gt("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var Mc=()=>x("div",{className:"content"},x("slot",{name:"leading"}),x("div",{className:"body"},x("slot",{name:"label"}),x("slot",{id:"bodyslot"})),x("slot",{name:"trailing"}),x("div",{className:"indicator"}));function Tc(e){function t(v){n.next(v.touched&&v.invalid),e.toggleAttribute("invalid",n.value);let S=0,N=[];for(let z of a.assignedNodes())!(z instanceof HTMLElement)||z===g||("invalid"in z&&z.invalid?n.value&&(z.invalid===!0||typeof z.invalid=="string"&&z.invalid===v.validationResult?.key)?(S++,z.style.display="",N.push(ot(z))):z.style.display="none":N.push(ot(z)));let T=!n.value||S>0;g.textContent=T?"":v.validationMessage,T?g.remove():(g.parentElement||e.append(g),N.push(ot(g))),N.length?v.setAria("describedby",N.join(" ")):v.setAria("describedby",null)}function o(v){let S=e.input;if(S){if(e.toggleAttribute("inputdisabled",S.disabled),t(S),!v)return;v.type==="focus"?i.next(!0):v.type==="blur"&&i.next(!1)}}function r(){let v=e.input?.value,S=!e.input?.hasAttribute("autofilled")&&(!v||Array.isArray(v)&&v.length===0);l?.classList.toggle("novalue",S),l?.classList.toggle("value",!S)}let n=Se(!1),i=Se(!1),a=x("slot",{name:"help"}),c=e.contentElement.children[1]?.children[0],l=c instanceof HTMLSlotElement?c:void 0,g=x(Ro,{ariaLive:"polite"});return M(e).append(x("div",{className:"help"},a)),f(d(e,"input").switchMap(v=>v?f(I(void 0).tap(()=>{o(),queueMicrotask(r)}),b(v,"focusable.change").tap(o).tap(r),b(v,"focus").tap(o),b(v,"invalid").tap(o),b(v,"update").tap(r),L(v,"touched").tap(()=>o()),f(b(v,"blur"),b(a,"slotchange")).raf(o),b(e.contentElement,"click").tap(()=>{document.activeElement!==v&&!e.matches(":focus-within")&&!i.value&&v.focus()})):w),Nc(e))}var Fe=class e extends u{floating=!1;input;size;contentElement=Mc();static{s(e,{init:[h("floating"),W("input"),te("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Tc]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},Cn=class extends Fe{};s(Cn,{tagName:"c-field",augment:[Rt,An,Ac]});var zc=p(`
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
`),Ss=p(`
${vr("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function Ic(e,t){return()=>{let o=e.parentElement instanceof Fe?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${o.bottom}px`,t.style.left=`${o.x}px`,t.style.minWidth=`${o.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-o.bottom-16,280)}px`}}function Mn({host:e,target:t,input:o,position:r,beforeToggle:n,onToggle:i,handleOther:a,axis:c}){return f(Tr({host:e,input:o,handleOther:a,axis:c}),b(o??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),ws({host:e,target:t,position:r??Ic(e,t),beforeToggle:n,onToggle:i}))}function Fc(e){let{host:t}=e;return f(zc(t)??w,_(t)??w,Ae(t),Mn(e))}var ao=class extends u{};s(ao,{tagName:"c-select-option",augment:[p(`
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
		`),y]});var Nn=class extends no{open=!1;optionView=ao;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let o of this.options)o!==t&&(o.slot="");t&&(t.slot="selected")}}};s(Nn,{tagName:"c-select",init:[h("open")],augment:[k("listbox"),p(`
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
		`),e=>{let t=x("div",{className:"menu"},x("slot")),o=x("slot",{name:"selected"}),r=t.style,n=kr(e),i=0,a=0;M(e).append(t,o,Dt({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function c(){if(e.open)a=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let l=e.options.reduce((g,v)=>Math.max(g,v.rendered?.offsetWidth??0),0);n.replaceSync(`:host{width:min(100%,${l}px)}`)}}return f(f(Wt(e),mt()).raf(c),Fc({host:e,target:t,handleOther:!0,beforeToggle(l){c();let g=e.selected;g&&(g.slot=l?"":"selected"),t.classList.toggle("open",l)},onToggle(l){let g=e.selected;!l&&g&&(i=g.rendered?.offsetHeight??0)},position(){let l=e.parentElement??e,g=Math.round((a-i)/2),v=e.selected?.rendered,S=l.getBoundingClientRect(),N=e.getBoundingClientRect(),T=N.top-14,z,D=v?v.offsetTop:0;D>T&&(D=T),z=t.scrollHeight;let $=window.innerHeight-N.top+8+D,K=N.top-g-D;z>$?z=$:z<N.height&&(z=N.height),r.top=K+"px",r.left=S.left+"px",r.maxHeight=z+"px",r.minWidth=S.width+"px",r.transformOrigin=`${D}px`}}))}]});function Tn(e){let t=wo();return f(Ce("field",e,o=>t.next(o)),t)}function so(e){return Tn(e).switchMap(t=>d(e,"input").switchMap(o=>o?I(o):d(t,"input").switchMap(r=>r?I(r):w)))}function Lo(e,t,o){return d(e,o).tap(r=>So(t,o,r))}var Dc="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function Ue({host:e,input:t,toText:o,toValue:r,update:n}){t.className="cxl-native-input",t.setAttribute("style",Dc),t.setAttribute("form","__cxl_ignore__");function i(l){e.value=r?r(t.value||""):t.value,l.stopPropagation(),e.dispatchEvent(new Event(l.type,{bubbles:!0}))}function a(){let l=e.value,g=o?o(l,t.value):l==null?"":String(l);t.value!==g&&e.setInputValue(g)}function c(){t.ariaLabel=e.ariaLabel;let l=e.getAttribute("aria-labelledby");l?t.setAttribute("aria-labelledby",l):t.removeAttribute("aria-labelledby")}return f(Ae(e,t),X(()=>(c(),t.form?b(t.form,"reset").tap(i):w)),d(e,"value").tap(()=>{o&&t.matches(":focus")||a()}),b(t,"blur").tap(a),b(t,"input").tap(i),b(t,"change").tap(i),Lo(e,t,"disabled"),Lo(e,t,"name"),Lo(e,t,"autocomplete"),Lo(e,t,"spellcheck"),Lo(e,t,"autofocus"),lr(e,["aria-label","aria-labelledby"]).tap(c),n?n.tap(a):w,b(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),b(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var lo=class e extends pe{autocomplete;inputValue="";static{s(e,{init:[W("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,b(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,o){o?this.inputEl.setAttribute(`aria-${t}`,o):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,o){ue(this).setValidity({customError:t},o,this.inputEl),this.inputEl.setCustomValidity(t?o||"Invalid Field":"")}};var In=[p(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),_],Po=[...In,y],De=class e extends lo{autofilled=!1;static{s(e,{init:[h("autofilled"),m("autocomplete")],augment:[t=>b(t.inputEl,"animationstart").tap(o=>{(o.animationName==="cxl-onautofillstart"||o.animationName==="cxl-onautofillend")&&(t.autofilled=o.animationName==="cxl-onautofillstart",ee(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,o){this.inputEl.setSelectionRange(t,o)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},zn=class extends De{value="";inputEl=x("input",{className:"input"})};s(zn,{tagName:"c-input-text",init:[m("value")],augment:[...Po,e=>e.append(e.inputEl),e=>Ue({host:e,input:e.inputEl})]});function Rc(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var zr=class e extends De{selected;value;inputEl=x("input",{className:"input"});static{s(e,{tagName:"c-input-option",init:[m("value"),W("selected")],augment:[...Po,t=>t.append(t.inputEl),t=>Ue({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:o=>o!==""?t.selected?.value:void 0}),t=>L(t,"selected").tap(o=>{let r=t.selected?.textContent;t.value=o?.value,t.setInputValue(r??""),Rc(t.inputEl)})]})}};function Lc(e){return Fn(e,"^")}function Fn(e,t=""){if(e==="")return()=>!0;let o=Pc(e,t);return r=>r.textContent?o.test(r.textContent):!1}function Pc(e,t="",o="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),o)}var Ir=class e extends u{optionView=ao;open=!1;debounce=100;options=[];matcher=Fn;static{s(e,{tagName:"c-autocomplete",init:[h("open"),xe("debounce")],augment:[k("listbox"),Ss,q,t=>{let o=x("slot",{name:"empty"}),r=x("div",{id:"menu",tabIndex:-1},x("slot"),o),n=Dt({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});n.style.cursor="pointer",o.style.display="none";function i(l){t.open=!0,c(l)}function a(l,g){l.setAria("activedescendant",ot(g)),g.rendered?.scrollIntoView({block:"nearest"})}function c(l){let g=l.inputValue??l.value,v=t.doSearch(g);o.style.display=v?"none":"",v&&a(l,v)}return M(t).append(r,n),f(so(t).switchMap(l=>(l.setAria("autocomplete","list"),l.role="combobox",l.setAria("controls",ot(t)),l.setAria("haspopup",t.role),l.setAttribute("autocomplete","off"),f(d(t,"open").tap(g=>{if(g)n.tabIndex=-1,i(l);else{for(let v of t.options)v.focused=!1;n.tabIndex=0,l.setAria("activedescendant",null)}l.setAria("expanded",String(g))}),f(cr(n),b(n,"mousedown")).tap(g=>{g.preventDefault(),g.stopPropagation(),l.focus()}).debounceTime(100).tap(()=>{t.open=!0}),d(t,"debounce").switchMap(g=>b(l,"input").debounceTime(g).tap(()=>t.open?c(l):i(l))),b(t,"change").tap(g=>{g.target===t&&l.dispatchEvent(new Event("change",{bubbles:!0}))}),Mn({host:t,target:r,input:l}),f(Sn(t),L(l,"value").map(g=>{for(let v of t.options)if(v.value===g)return v})).tap(g=>{for(let v of t.options)v.focused=v.selected=!1;g&&(g.selected=!0),l instanceof zr?l.selected=g:l.value=g?.value,g&&(t.open=!1)})))))}]})}doSearch(t){let o=0,r,n=this.matcher==="substring"?Fn:this.matcher==="prefix"?Lc:this.matcher,i=t?n(String(t)):void 0;for(let a of this.options){let c=!i?.(a);a.hidden=c,a.focused=!(c||o++>0),a.focused&&(r=a)}return r}};var Dn=class extends Ir{onsearch;doSearch(t){return Be(this,"search",{detail:String(t)}),this.options[0]}};s(Dn,{tagName:"c-autocomplete-dynamic",init:[gr("search")]});var Vc=p(`
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
`),Rn=class extends u{size;src="";text=""};s(Rn,{tagName:"c-avatar",init:[te("size",e=>`{
				width: ${30+e*8}px;
				height: ${30+e*8}px;
				font-size: ${18+e*4}px;
			}`),m("src"),m("text")],augment:[Vc,e=>{let t;return Y(d(e,"src"),d(e,"text")).raf(([o,r])=>{t?.remove(),o?(t=new Image,t.alt=e.text,t.src=o):r?t=new Text(r):t=Zt("person"),M(e).append(t)})}]});var Ln=class extends u{};s(Ln,{tagName:"c-body",augment:[p(`
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

${P("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),y]});var Fr=class extends u{};s(Fr,{tagName:"c-button-segmented-view",augment:[p(`
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
		`),dt,ce,()=>x(me,{id:"check",name:"check"}),y]});var Pn=class extends no{optionView=Fr;size};s(Pn,{tagName:"c-button-segmented",init:[te("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[k("listbox"),p(`
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
		`),_,y,Ae,e=>Tr({host:e,axis:"x"})]});var Vn=class extends to{};s(Vn,{tagName:"c-button-text",augment:[...It,p(`
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
		`),ce,y]});function On(e="block"){let t=(o=>{for(let r=12;r>0;r--)o.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,o.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,o.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,o.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,o.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return o})({xl:"",lg:"",md:"",sm:"",xs:""});return p(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${P("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${P("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${P("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${P("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var Bn=p(`
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
${nt.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),co=class extends u{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};s(co,{init:[h("sm"),h("xs"),h("md"),h("lg"),h("xl"),h("vpad"),h("pad"),h("center"),h("fill"),h("grow"),h("elevation"),le("color")]});var Vo=class extends co{};s(Vo,{tagName:"c-c",augment:[Bn,On(),p(":host([center]) { text-align: center}"),y]});var Oc=p(`
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
`),Oo=class extends Vo{variant};s(Oo,{tagName:"c-card",init:[h("variant")],augment:[Oc]});var Bc=p(`
:host { ${yr} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function Hc(e){return f(Ce("list",e),d(e,"selected").tap(t=>e.ariaSelected=String(t)))}function Yn(e){return f(fn(e),Ae(e,e,-1),Hc(e))}var Xe=class extends u{disabled=!1;touched=!1;selected=!1};s(Xe,{init:[h("disabled"),h("touched"),h("selected")],augment:[Yn]});var Hn=class extends Xe{size};s(Hn,{tagName:"c-item",init:[te("size",e=>`{min-height:${56+e*8}px}`)],augment:[Bc,_,dt,k("option"),y,ce]});var _n=class extends Oo{disabled=!1;touched=!1;selected=!1};s(_n,{tagName:"c-card-item",init:[h("disabled"),h("touched"),h("selected")],augment:[k("option"),...It,p(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),Yn,ce]});function jn(e){return f(Y(d(e,"indeterminate"),d(e,"checked")).map(([t,o])=>e.ariaChecked=t?"mixed":String(o)),f(R(e).tap(()=>{e.disabled||(e.indeterminate&&(e.indeterminate=!1),e.checked=!e.checked)}),d(e,"checked").tap(()=>{ue(e).setFormValue(e.checked?String(e.value):null)}),L(e,"checked").tap(()=>{e.dispatchEvent(new Event("change",{bubbles:!0}))})).ignoreElements())}var Es=class e extends pe{value="on";checked=!1;indeterminate=!1;defaultChecked=!1;static{s(e,{tagName:"c-checkbox",init:[m("value"),m("checked"),m("indeterminate")],augment:[k("checkbox"),p(`
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
${rt(".mask")}
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
`),ze,_,t=>{t.defaultChecked=t.checked;let o=x("div",{className:"mask"}),r=x("div",{className:"box"},Dt({className:"check",viewBox:"0 0 24 24",d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),Dt({className:"minus",viewBox:"0 0 24 24",d:"M19 13H5v-2h14v2z"}),o);return M(t).append(r,x("slot")),f(ce(o,t),jn(t).tap(n=>r.setAttribute("state",n)))}]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){ue(this).setFormValue(this.checked?String(t):null)}};var Bo=class extends u{color;size=0};s(Bo,{tagName:"c-pill",init:[le("color","surface-container-low"),te("size",e=>`{
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
		`),()=>x("slot",{name:"leading"}),y,()=>x("slot",{name:"trailing"})]});var Un=class extends Bo{disabled=!1;touched=!1;selected=!1};s(Un,{tagName:"c-chip",init:[h("disabled"),h("touched"),h("selected")],augment:[k("button"),ze,...It,p(`
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
		`),ce]});var Xn=class extends u{date;format;locale};s(Xn,{tagName:"c-date",init:[ss("date"),m("format"),m("locale")],augment:[e=>Y(d(e,"locale").switchMap(t=>oe.getLocale(t)),d(e,"date"),d(e,"format")).raf(([t,o,r])=>e.textContent=o?t.formatDate(o,r):"")]});oo({"dialog.close":"Close dialog","dialog.cancel":"Cancel","dialog.ok":"Ok"});var qn=(e,t,o=e)=>R(e).tap(()=>ee(o,"dialog.close",t)),$n=p(`
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

${P("small",".content { max-height: 85%; }")}
	`),po=class extends u{static=!1;open=!1;fullscreen=!1;dialog=document.createElement("dialog");returnValue};s(po,{init:[m("static"),m("open"),h("fullscreen")],augment:[q,e=>b(e,"keydown").tap(t=>{t.key==="Escape"&&(t.preventDefault(),e.open=!1)}),e=>b(e.dialog,"close").tap(()=>e.open=!1),e=>e.dialog,e=>d(e,"open").tap(t=>{t?e.static?e.dialog.show():de.openModal({element:e.dialog,close:()=>e.open=!1}):e.dialog.open&&(e.dialog.close(),Be(e,"close"))}),e=>ie(e,"dialog.close").tap(t=>{e.returnValue=t,e.open=!1})]});var Wn=class extends po{};s(Wn,{tagName:"c-dialog",augment:[$n,e=>{e.dialog.append(x("slot",{className:"content"}))}]});function Dr(e,t,...o){let r=x(e,t,...o);return new Promise(n=>{let i=()=>{r.removeEventListener("close",i),r.remove(),n(r.returnValue)};r.addEventListener("close",i),r.parentNode||document.body.append(r),r.open=!0})}var Lt=class extends po{};s(Lt,{tagName:"c-dialog-basic",augment:[$n,p(`
dialog {
	display:flex; flex-direction:column;row-gap:16px;
	max-width: min(calc(100% - 24px), 560px);
}
slot[name=title] { ${C("title-large")} }
slot[name=actions] {
	display:flex; column-gap: 24px; align-items: center; justify-content: end; margin-top:8px;
}
		`),e=>{e.dialog.append(x("slot",{name:"title"}),x("slot"),x("slot",{name:"actions"}))}]});function Zh(e){let t=[],{message:o,title:r,action:n}=typeof e=="string"?{message:e}:e;return r&&t.push(x("div",{slot:"title"},r)),t.push(x(st,void 0,o),x(_e,{$:Ar,variant:"text",slot:"actions"},n??oe.get("dialog.ok"))),Dr(Lt,{},...t)}function sb(e){let t=[];typeof e=="string"&&(e={message:e});let{message:o,title:r,action:n,cancelAction:i}=e;return r&&t.push(x("div",{slot:"title"},r)),t.push(x(st,void 0,o),x(_e,{variant:"text",slot:"actions",$:a=>qn(a,!1)},i??oe.get("dialog.cancel")),x(_e,{variant:"text",slot:"actions",$:a=>qn(a,!0)},n??oe.get("dialog.ok"))),Dr(Lt,{},...t)}var Kn=class extends u{motion;target};s(Kn,{tagName:"c-dismiss",init:[m("motion"),m("target")],augment:[q,y,e=>Er(e,"target").switchMap(t=>t?R(e).tap(()=>{e.motion?Co(e,t,e.motion).finalize(()=>t.remove()).subscribe():t.remove()}):w)]});function Gn(e,{target:t,clientX:o,clientY:r},n,i){if(!(t instanceof HTMLElement))throw new Error("Invalid Event Target");return{type:e,target:t,clientX:o,clientY:r,startX:n,startY:i}}function Yc(){let e={},t=Se(e),o=new ge;return{dragging:t,dropping:o,elements:e,next:()=>t.next(e)}}var yt=Yc();function _c(e){return({target:t,moveTarget:o,delay:r})=>{let n=!1,i=0;r??=60;let a=o||t,c=t.style,{userSelect:l,transition:g}=c;return new A(v=>{function S(F,G=!0){n?(n=!1,a.style.transition=g,$?.unsubscribe(),v.next(F),delete yt.elements.mouse,G&&yt.dropping.next({element:a,event:F}),yt.next()):clearTimeout(i)}let N=0,T=0;function z(F){n&&F.key==="Escape"&&(F.preventDefault(),S({type:"end",target:t,clientX:0,clientY:0,startX:N,startY:T},!0))}function D(F,G){if(a.style.transition="none",!!t.isConnected){try{t.setPointerCapture(G)}catch(We){console.error(We)}n=!0,v.next(Gn("start",F,N,T)),$=b(window,"keydown").tap(z).subscribe()}}l=c.userSelect,c.userSelect="none";let $,K=f(e(t).switchMap(F=>{if(F.type==="pointerdown"){g=a.style.transition,F.preventDefault(),N=F.clientX,T=F.clientY;let G=F.pointerId;n=!1,i=setTimeout(D,r,F,G)}else if(F.type==="pointermove"){if(n){let G=Gn("move",F,N,T);v.next(G),yt.elements.mouse={element:a,event:G},yt.next()}}else return clearTimeout(i),I(F);return w}).debounceTime().tap(F=>S(Gn("end",F,N,T))),b(t,"click",{capture:!0}).tap(F=>{n&&F.target===t&&F.stopImmediatePropagation()})).subscribe();v.signal.subscribe(()=>{K.unsubscribe(),$?.unsubscribe(),c.userSelect=l})})}}function jc(e){return e.style.touchAction||(e.style.touchAction="none"),b(e,"pointerdown").switchMap(t=>t.currentTarget?new A(o=>{o.next(t);let r=f(b(window,"pointermove").tap(n=>o.next(n)),f(b(window,"pointercancel"),b(window,"pointerup")).tap(n=>{o.next(n),r.unsubscribe()})).subscribe();o.signal.subscribe(()=>r.unsubscribe())}):w)}var Uc=_c(jc);function Jn(e){return Uc(e)}function Cs(e,t){let o=t.clientX,r=t.clientY;return e.left<o&&e.right>o&&e.top<r&&e.bottom>r}function Xc(e){let t=yt.elements,o=[],r;for(let n in t){let i=t[n];if(!i)continue;let{event:a,element:c}=i;c!==e&&(r||=e.getBoundingClientRect(),Cs(r,a)&&o.push({type:"over",target:e,relatedTarget:c,clientX:a.clientX,clientY:a.clientY}))}return o}function Wc(e){let t=0;return yt.dragging.switchMap(()=>{let o=Xc(e);return t===0&&o.length===0?w:(t=o.length,I(o))})}function qc(e){return Wc(e).switchMap(t=>t.length===0?I({type:"out",target:e,clientX:0,clientY:0}):Oe(t))}function $c(e){return yt.dropping.switchMap(({element:t,event:o})=>e!==t&&Cs(e.getBoundingClientRect(),o)?I({type:"drop",target:e,clientX:o.clientX,clientY:o.clientY,relatedTarget:t}):w)}function Kc(e,t){return{width:e.offsetWidth,height:e.offsetHeight,x:t.clientX,y:t.clientY,sx:t.clientX/e.offsetWidth,sy:t.clientY/e.offsetHeight}}function Gc({target:e,moveTarget:t,axis:o}){let r;return n=>{let i=t||e;if(n.type==="start")r=Kc(i,n);else if(n.type==="end")i.style.transform="",r=void 0;else if(r){let a=o==="y"?0:(n.clientX-r.x)/r.width,c=o==="x"?0:(n.clientY-r.y)/r.height;return I({event:n,x:a,y:c,sx:r.sx,sy:r.sy})}return w}}function Jc(e){return({x:t,y:o})=>{let r=(e.moveTarget||e.target).style;r.transform=`translate(${t*100}%, ${o*100}%)`}}function As(e){let t=0;return f(b(e,"dragenter").tap(o=>{++t===1&&e.setAttribute("dragover",""),o.stopPropagation()}),b(e,"dragleave").tap(()=>{--t===0&&e.removeAttribute("dragover")}),b(e,"dragover").tap(o=>o.preventDefault()),b(e,"drop").tap(o=>{o.preventDefault(),o.stopPropagation(),e.removeAttribute("dragover"),t=0})).filter(o=>o.type==="drop")}function Ns(e){let t=e.moveTarget||e.target;return f(Jn(e).tap(o=>{o.type==="start"?t.toggleAttribute("dragging",!0):o.type==="end"&&t.toggleAttribute("dragging",!1)}).switchMap(Gc(e)).tap(Jc(e)).ignoreElements(),qc(t).tap(o=>t.toggleAttribute("dragover",o.type==="over")),$c(t))}var Ms=class e extends u{dragging=!1;dragover=!1;target;static{s(e,{tagName:"c-drag-handle",init:[h("dragging"),h("dragover")],augment:[y,p(`
:host { display: block; cursor:grab; position: relative; touch-action: none; }
:host([dragging]) { z-index: 10 }
		`),t=>Er(t,"target").switchMap(o=>Ns({target:t,moveTarget:o,delay:150}).tap(r=>t.handleDrag?.(r)))]})}};var Ho=class extends u{center=!1};s(Ho,{tagName:"c-backdrop",init:[h("center")],augment:[p(`
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

	`),e=>b(e,"keydown").tap(t=>t.stopPropagation()),y]});var Yo=class extends Ye{};s(Yo,{tagName:"c-toggle-panel",augment:[y,eo,it]});var Qc=p(`
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
${P("small","#drawer { width: 360px }")}

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
`),_o=class extends u{open=!1;position;responsive;permanent=!1};s(_o,{tagName:"c-drawer",init:[h("open"),h("position"),m("responsive"),m("permanent")],augment:[Qc,p(`
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
`),e=>{let t=Se(!1),o=f(d(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",n=x(Yo,{id:"drawer","motion-in":o.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":o.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},y),i=new Ho;i.id="backdrop";let a=x("dialog",{id:"dialog"},i,n);return M(e).append(a),f(b(n,"close").tap(()=>a.close()),b(a,"close").tap(()=>e.open=!1),ie(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),L(n,"open").tap(c=>e.open=c),L(e,"open").raf(c=>{c||n.scrollTo(0,0)}),b(i,"click").tap(()=>e.open=!1),b(a,"cancel").tap(c=>{c.preventDefault(),e.open=!1}),d(e,"open").tap(c=>{if(t.value&&e.permanent)return n.open=!0;c?t.value||(de.openModal({element:a,close:()=>e.open=!1}),a.getBoundingClientRect()):de.currentModal?.element===a&&de.modalClosed()}).raf(c=>{n.open=c}),d(e,"responsive").switchMap(c=>c!==void 0?wr(document.body):I("xsmall")).switchMap(c=>{let l=J.breakpoints[e.responsive||"large"],g=J.breakpoints[c]>=l;return t.next(g),g&&n.className!=="permanent"?a.close():!g&&n.className==="permanent"&&(e.open=!1),g&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",g),n.className=g?"permanent":"drawer",L(e,"open").tap(v=>{e.hasAttribute("responsiveon")||he({target:i,animation:v?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var Qn=class extends ht{icon="arrow_right"};s(Qn,{tagName:"c-dropdown",init:[m("icon")],augment:[p(`
:host { display: flex; gap: 0; align-items: center; cursor: pointer; }
.icon { transition: rotate var(--cxl-speed); height:24px; width:24px; translate: -7px; margin-right: -6px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x(me,{className:"icon"});return e.shadowRoot?.append(t,x("slot")),f(d(e,"icon").tap(o=>t.name=o),b(e,"keydown").tap(o=>{o.key==="ArrowRight"?e.open=!0:o.key==="ArrowLeft"&&(e.open=!1)}))}]});var fo=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,o=this.end){let r=this.end.parentNode;r&&(this.start.parentNode||r.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),r.insertBefore(this.frag,o)):r.insertBefore(t,o))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let o=document.createRange();o.setStartAfter(this.start),o.setEndBefore(this.end),o.deleteContents()}};function zs({source:e,render:t,empty:o,append:r,loading:n}){let i=[],a=document.createDocumentFragment(),c,l;function g(v){if(l?.parentNode?.removeChild(l),!v)return;let S=0;for(let T of v){let z=i[S]?.item;if(z)z.value!==T&&z.next(T);else{let D=Se(T),$=t(D,S,v),K=$ instanceof DocumentFragment?Array.from($.childNodes):[$];i.push({elements:K,item:D}),a.append($)}S++}a.childNodes.length&&r(a),c?.remove(),S===0&&o&&r(c=o());let N=i.length;for(;N-- >S;)i.pop()?.elements.forEach(T=>T.parentNode?.removeChild(T))}return X(()=>(l=n?.(),l&&r(l),e.raf(g)))}function oy(e){return xr(()=>{let t=new fo;return[zs({...e,append:o=>t.insert(o)}),t.end]})}function Zc(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function ep(e,t){let o=e.getRootNode();if(o instanceof Document)return Zc(o.getElementById(t));throw new Error("Invalid root node")}function Ts(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=ep(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function tp(e){return d(e,"template").switchMap(t=>t?I(Ts(e,t)):tt().map(()=>Ts(e,e.children[0])))}function op(e,t,o){return tp(e).switchMap(r=>{let n=e.target?at(e,e.target)??e:e;return r?zs({source:t,render:o?(i,a,c)=>o(r(i,a,c)):r,append:i=>n.append(i)}):w})}var Zn=class extends u{source;template};s(Zn,{tagName:"c-each",init:[W("source"),W("template")],augment:[q,y,e=>op(e,d(e,"source"))]});var ei=class extends Fe{};s(ei,{tagName:"c-field-bar",augment:[Rt,p(`
:host {
	box-sizing: border-box;
	${Z("surface-container-high")}
	${C("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var ti=class extends Fe{};s(ti,{tagName:"c-field-frame",augment:[p(`
slot[name=label] { ${C("body-large")} }
		`),Rt]});var oi=class extends Fe{};s(oi,{tagName:"c-field-outlined",augment:[Rt,An,p(`
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
${en.map(e=>`:host([size="${e}"]) { --cxl-field-outlined-label-top: ${16+e*4}px }`)}
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
		`)]});var jo=class extends co{vflex=!1;gap;middle=!1};s(jo,{tagName:"c-flex",init:[h("vflex"),h("gap"),h("middle")],augment:[On("flex"),Bn,p(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${nt.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),y]});var Rr=class e extends u{elements=new Set;initialValue;static{s(e,{tagName:"c-form",augment:[k("form"),q,t=>b(t,"submit",{capture:!0}).tap(o=>{o.preventDefault();let r;for(let n of t.elements)n.invalid&&(r??=n),n.touched=!0;r&&(r.focus(),o.stopPropagation(),o.stopImmediatePropagation())}),t=>gt("form",t,t.elements).tap(o=>{let r=o.target,n=r.name,i=t.initialValue;i&&n&&n in i&&(r.value=i[n])}),t=>qt(t,"enter").tap(()=>t.submit()),y]})}checkValidity(){let t=!0;for(let o of this.elements)o.invalid&&(t=!1),o.touched=!0;return t}reset(){for(let t of this.elements)t.formResetCallback()}submit(){Be(this,"submit")}requestSubmit(){this.submit()}getElementByName(t){for(let o of this.elements)if(o.name===t)return o}setTouched(t){for(let o of this.elements)o.touched=t}setFormData(t){this.initialValue=t;for(let o in t){let r=this.getElementByName(o);r&&(r.value=t[o])}}getFormData(){let t={};for(let o of this.elements){let r=o.checked!==void 0?o.checked?o.value:void 0:o.value;o.name&&(t[o.name]=r)}return t}};function rp(e){let t=e.parentElement;for(;t;){if(t instanceof HTMLFormElement||t instanceof Rr)return t;t=t.parentElement}}var ri=class extends u{};s(ri,{tagName:"c-form-submit",augment:[q,y,e=>X(()=>{let t=rp(e);return t?f(R(e).tap(()=>{if(t instanceof HTMLFormElement){let o;for(let r of t.elements)r instanceof pe&&(r.invalid&&(o??=r),r.touched=!0);o?.focus()}t.requestSubmit()})):w})]});function np(e){let t=new CSSStyleSheet;return M(e).adoptedStyleSheets.push(t),d(e,"columns").raf(()=>{let o=`repeat(${e.columns}, minmax(0,1fr))`;t.replaceSync(`:host{grid-template-columns:${o}}`)})}var ni=class extends u{rows;columns=12};s(ni,{tagName:"c-grid",init:[m("columns"),m("rows")],augment:[y,p(`
:host{display:grid;gap:16px;box-sizing:border-box;}
${P("medium",":host{gap:24px}")}
`),np]});function ii(e){return Sr("list",e,e.items)}function ip(e){return Fo({host:e,getFocusable:()=>e.items,getSelected:()=>e.items.find(t=>t.selected),getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),observe:ii(e)})}function ap(e){return Do({getFocusable:()=>e.items,getActive:()=>kn(e)})}function Lr(e){let t=ap(e);return f(ip(e),lt({host:e,goDown:()=>t(1),goUp:()=>t(-1),goFirst:()=>t(1,-1),goLast:()=>t(-1,e.items.length)}).tap(o=>o.focus()))}function sp(e){let{host:t,getActive:o,getSelected:r}=e,n=e.columns?Math.max(1,Math.floor(e.columns)):void 0,i=[],a=(e.observe??Sa(t)).tap(()=>{i=e.getFocusable()}),c=()=>i,l=Do({getFocusable:c,getActive:o});function g(S){if(n)return l(S*n);let N=o();if(!N)return;let T=N.getBoundingClientRect(),z=T.left+T.width/2,D=T.top+T.height/2,$,K=1/0;for(let F of i){if(F===N||F.disabled||!F.checkVisibility())continue;let G=F.getBoundingClientRect(),We=G.left+G.width/2,qe=(G.top+G.height/2-D)*S;if(qe<=0)continue;let kt=qe**2+(We-z)**2;kt<K&&($=F,K=kt)}return $}function v(S){if(!n)return;let N=o(),T=i.findIndex(D=>D===N);if(T===-1)return;let z=T-T%n;return i[Math.min(z+(S?n-1:0),i.length-1)]}return f(Fo({host:t,getFocusable:c,getActive:o,getSelected:r,observe:a}),lt({host:t,goRight:()=>{let S=o(),N=i.findIndex(T=>T===S);return n&&N%n===n-1?void 0:l(1)},goLeft:()=>{let S=o(),N=i.findIndex(T=>T===S);return n&&N%n===0?void 0:l(-1)},goFirst:()=>l(1,-1),goLast:()=>l(-1,i.length),goFirstColumn:()=>v(!1),goLastColumn:()=>v(!0),goUp:()=>g(-1),goDown:()=>g(1)}).tap(S=>S.focus()))}var ai=class extends u{items=[]};s(ai,{tagName:"c-grid-list",augment:[k("grid"),p(":host{display:grid;box-sizing:border-box;}"),y,e=>sp({host:e,getFocusable:()=>e.items,getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),getSelected:()=>e.items.find(t=>t.selected),observe:ii(e)})]});var si=p(`
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
	${yr}
}

${P("small",`
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
${P("large",`
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
`),uo=class extends u{type;center=!1;full=!1};s(uo,{init:[h("type"),h("center"),h("full")]});var Uo=class extends uo{};s(Uo,{tagName:"c-layout",augment:[si,()=>x("div",{id:"body",part:"body"},x("slot"))]});var ci=p(`
:host { padding: 96px 16px; }
:host([dense]) { padding-top: 48px;padding-bottom:48px; }
${P("medium",":host {padding-left:32px;padding-right:32px}")}
${P("large",":host {padding-left:64px;padding-right:64px}")}
	`),li=class extends Uo{dense=!1;color;center=!0;type="block"};s(li,{tagName:"c-section",init:[h("dense"),le("color")],augment:[ci]});var pi=class extends uo{dense=!1;color;center=!0;type="block"};s(pi,{tagName:"c-hero",init:[h("dense"),le("color")],augment:[ci,si,p(`
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
		`),()=>x("div",{id:"body",part:"body"},x("slot"))]});var fi=class extends u{pad;vertical=!1};s(fi,{tagName:"c-hr",init:[h("pad"),h("vertical")],augment:[k("separator"),p(`
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
${nt.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});function di(e){let t=document.createElement("style");return f(Q(o=>{let r=e.persistkey&&nn.get(e.persistkey);r!==void 0?e.open=r===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches),o.signal.subscribe(()=>t.remove())}),Kt(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let o=e.open?e.themeon:e.themeoff;e.persistkey&&nn.set(e.persistkey,o),$a(Xa[o]||o)}),R(e).tap(()=>e.open=!e.open))}var ui=class extends u{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};s(ui,{tagName:"c-toggle-theme",init:[m("persistkey"),m("usepreferred"),m("open"),m("themeon"),m("themeoff")],augment:[k("group"),di]});var mi=class extends Ie{open=!1;usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};s(mi,{tagName:"c-icon-toggle-theme",init:[m("persistkey"),m("usepreferred"),m("open"),m("themeon"),m("themeoff")],augment:[di,e=>Y(d(e,"iconon"),d(e,"iconoff"),d(e,"open")).tap(()=>e.icon=e.open?e.iconon:e.iconoff)]});var lp=e=>{let t;function o(){let r=document.adoptedStyleSheets.indexOf(t);r!==-1&&document.adoptedStyleSheets.splice(r,1)}addEventListener("message",r=>{if(r.source!==parent||r.origin!==e)return;let n=r.data.theme;o(),typeof n=="string"&&(t=new CSSStyleSheet,t.replace(n).catch(i=>console.error(i)),document.adoptedStyleSheets.push(t))})},cp=e=>{let t=()=>{let o=()=>{parent.postMessage({height:document.documentElement.scrollHeight},e==="null"?"*":e)};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(o).observe(document.documentElement)},r=>console.error(r))})};document.readyState==="complete"?t():addEventListener("load",t)},gi=class extends u{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=se("iframe",{loading:"lazy"})};s(gi,{tagName:"c-iframe",init:[m("src"),m("srcdoc"),m("sandbox"),m("handletheme")],augment:[p(`
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
	`),e=>{let t=e.iframe,o=se("slot",{name:"loading"}),r=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(r),o.style.display="none";function n(c){r.replaceSync(":host{height:"+c+"px}"),t.style.height="100%",t.style.opacity="1",o.style.display="none"}function i(c){if(c){let l=JSON.stringify(e.ownerDocument.location.origin),g=`<script type="module">
(${cp.toString()})(${l});
(${lp.toString()})(${l});
<\/script>`;t.srcdoc=`${e.reset}${c}${g}`,o.style.display=""}}async function a(c){let l=new URL(c);return`${l.search||l.hash?`<script>history.replaceState(0,0,'about:srcdoc${l.search}${l.hash}');<\/script>`:""}<base href="${c}" />`+await fetch(c).then(g=>g.text())}return M(e).append(t,o),f(Y(d(e,"srcdoc"),d(e,"src")).raf(([c,l])=>{(async()=>{i(l?await a(l):c)})().catch(()=>{})}),b(window,"message").tap(c=>{let l=c.data.height;c.source===t.contentWindow&&typeof l=="number"&&n(l)}),d(e,"handletheme").switchMap(c=>c?b(t,"load").switchMap(()=>Jt.raf(l=>{let g=l?.css??"",v=e.ownerDocument.location.origin,S=v==="null"||t.hasAttribute("sandbox")&&!t.sandbox.contains("allow-same-origin")?"*":v;t.contentWindow?.postMessage({theme:g},S)})):w),d(e,"sandbox").tap(c=>c===void 0?t.removeAttribute("sandbox"):t.sandbox.value=c))}]});var pp=oo({"input.clear":"Clear input value"}),xi=class extends Ie{icon="close"};s(xi,{tagName:"c-input-clear",augment:[e=>Da(e,pp("input.clear")),e=>so(e).switchMap(t=>R(e).tap(()=>t.value=""))]});function fp(e,t){return t.style.width="0",t.style.overflow="hidden",t.parentNode||e.append(t),f(f(b(t,"input"),b(t,"change")).map(o=>{if(o.stopPropagation(),e.dispatchEvent(new Event(o.type,{bubbles:!0})),t.files)return Array.from(t.files)}),R(e).tap(()=>t.click()).ignoreElements(),As(e).map(o=>{if(o.stopPropagation(),o.dataTransfer?.files.length)return Array.from(o.dataTransfer.files)}))}var hi=class extends lo{value=void 0;inputEl=se("input",{tabIndex:-1,type:"file"})};s(hi,{tagName:"c-input-file",init:[W("value")],augment:[q,y,e=>{let t=e.inputEl;return t.setAttribute("form","__cxl_ignore__"),e.append(t),f(pn(e),fp(e,t).tap(o=>{e.value=o}))}]});var bi=class e extends De{value=void 0;formatter=up;inputEl=x("input",{className:"input"});static{s(e,{init:[m("value")],augment:[y,t=>t.append(t.inputEl),t=>Ue({host:t,input:t.inputEl,toText:(o,r)=>o!==void 0&&isNaN(o)?r:t.formatter(o),toValue:o=>{if(o===""){t.setValidity({key:"number",valid:!0});return}let r=Number(o);return t.setValidity({key:"number",valid:!isNaN(r)}),r}})]})}},yi=class extends bi{};s(yi,{tagName:"c-input-number",augment:[...In]});function up(e){return e===void 0||isNaN(e)?"":e.toString()}var Is=class e extends De{value="";inputEl=x("input",{type:"password",className:"input"});static{s(e,{tagName:"c-input-password",init:[m("value")],augment:[...Po,t=>t.append(t.inputEl),t=>Ue({host:t,input:t.inputEl})]})}};var vi=class extends u{};s(vi,{tagName:"c-input-placeholder",augment:[p(`
:host {
	display: inline-block;
	pointer-events: var(--cxl-override-pointer-events, none);
	color: var(--cxl-color-on-surface-variant);
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
	`),y,e=>{let t=kr(e);return so(e).switchMap(o=>f(re(o),d(o,"value"),d(o,"inputValue")).raf(()=>{let r=o.inputValue??o.value,n=r===void 0||r==="";t.replaceSync(`:host{top:${o.offsetTop}px;left:${o.offsetLeft}px;width:${o.offsetWidth}px;height:${o.offsetHeight}px;${n?"":"display:none;"}`)}))}]});var wi=class extends u{};s(wi,{tagName:"c-kbd",augment:[p(`
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
		`),y]});function dp(e,t){return e?typeof e=="string"?(t.setAttribute("aria-label",e),w):ft(e).tap(o=>{e.textContent&&t.setAttribute("aria-labelledby",o)}).finalize(()=>{t.removeAttribute("aria-labelledby")}):w}var ki=class extends u{};s(ki,{tagName:"c-label",augment:[p(`
:host {
	display: inline-block;
}`),y,e=>Tn(e).switchMap(t=>d(t,"input").switchMap(o=>o?dp(e,o):w)),e=>Q(()=>{e.slot="label"})]});var Si=class extends u{items=[]};s(Si,{tagName:"c-list",augment:[p(":host{display:block;padding:8px 0;}"),k("listbox"),y,Lr]});var mp=p(`
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
	`);function gp(e){function t(){e.exclusive&&!e.static&&de.popupOpened({element:e,close:()=>e.open=!1}),e.static||(e.popover??="auto",e.showPopover())}return d(e,"open").switchMap(o=>o?(t(),f(b(e,"keydown").tap(r=>{r.key==="Escape"&&(e.open=!1,e.returnTo?.focus(),r.preventDefault(),r.stopPropagation())}),b(e,"toggle").tap(r=>{let n=r.newState==="open";n||(e.open=n)}),L(e,"open").tap(r=>{!r&&e.popover&&e.hidePopover()}),b(e,"close").tap(r=>{r.target===e&&e.popover&&e.hidePopover()}))):w)}var Xo=class extends Ye{exclusive=!0;static=!1;trigger;returnTo};s(Xo,{tagName:"c-popup",init:[m("exclusive"),h("static")],augment:[y,eo,mp,it,gp]});var Ei=class extends Xo{"motion-in"="fadeIn";"motion-out"="fadeOut";items=[];focusstart;setFocus(){let t=Nt(this)?.activeElement;if(!(t&&this.contains(t))){if(this.focusstart==="selected"){let o=this.items.find(r=>r.selected);if(o){o.focus();return}}this.items[0]?.focus()}}};s(Ei,{tagName:"c-menu",init:[m("focusstart")],augment:[k("menu"),p(vr()),Lr,e=>d(e,"open").tap(t=>{t&&e.setFocus()})]});var qo=[p(`
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
${rt("slot::after")}
	`),_,ns,y],Wo=class extends Xe{size};s(Wo,{tagName:"c-nav-item",init:[te("size",e=>`{min-height:${56+e*8}px}`)],augment:[k("option"),...qo]});var Ci=class extends Xe{icon="arrow_drop_down";open=!1;target;size};s(Ci,{tagName:"c-nav-dropdown",init:[m("icon"),m("target"),h("open"),te("size",e=>`{min-height:${56+e*8}px}`)],augment:[k("treeitem"),...qo,p(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>Tt(e).raf(({target:t,open:o})=>t.open=o),e=>{let t=x(me,{className:"icon"});return M(e).append(t),f(d(e,"icon").tap(o=>t.name=o))}]});var $o=class extends ht{icon="more_vert";motion};s($o,{tagName:"c-toggle-icon",init:[m("icon")],augment:[e=>{let t;return f(d(e,"icon").raf(o=>{if(!o)return t?.remove();t=Zt(o),M(e).append(t)}),d(e,"open").raf(()=>{t&&e.motion&&he({target:t,animation:e.motion,options:{direction:e.open?"normal":"reverse",fill:"both"}})}))}]});var Ai=class extends Xe{icon="arrow_right";open=!1;target;size};s(Ai,{tagName:"c-nav-tree-item",init:[m("icon"),m("target"),h("open"),te("size",e=>`{min-height:${56+e*8}px}`)],augment:[k("treeitem"),...qo,p(`
:host { padding-inline-start: 20px; }
.icon { position: absolute; inset-inline-start: 0px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=x($o,{className:"icon"});M(e).append(t);function o(r){if(Array.isArray(r)){for(let n of r)if(n.childNodes.length)return!0}else if(r?.childNodes.length)return!0;return!1}return f(d(e,"icon").tap(r=>t.icon=r),d(e,"open").tap(r=>{e.ariaExpanded=String(r),t.open=r}),d(e,"target").switchMap(()=>{let r=Cr(e),n=o(r);return t.style.display=n?"":"none",t.target=r,r?La(e,Array.isArray(r)?r:[r]):w}),d(t,"open").tap(r=>e.open=r),b(e,"keydown").tap(r=>{r.key==="ArrowRight"?e.open=!0:r.key==="ArrowLeft"&&(e.open=!1)}))}]});var Ni=class extends Ao{};s(Ni,{tagName:"c-nav-target",augment:[k("group"),p(":host{display:block;padding-inline-start:12px;}")]});var Mi=class extends u{};s(Mi,{tagName:"c-nav-headline",augment:[p(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),y]});var Ko=class extends Ie{open=!1;target;icon="menu"};s(Ko,{tagName:"c-navbar-toggle",init:[m("target"),W("open")],augment:[e=>Tt(e).tap(({target:t,open:o})=>t.open=o)]});var mo=class extends Ft{duration=4e3;"motion-in"="slideInUp,fadeIn";"motion-out"="fadeOut";open=!1;static=!1};s(mo,{tagName:"c-snackbar",init:[h("open"),xe("duration"),m("motion-in"),m("motion-out"),m("static")],augment:[p(`
:host {
	display: inline-flex;
	justify-content: left;
	margin: 16px auto;
	border: 0; outline: 0;
	top: auto;
}
slot[name=action] { margin-inline-start: auto; display: block; }
	`),()=>x("slot",{name:"action"}),e=>d(e,"open").tap(t=>{t&&!e.static&&(e.popover="manual",e.showPopover())}),eo,it,e=>b(e,"close").tap(()=>e.remove())]});var Go=class extends u{queue=[];notify(t){let o;return typeof t=="string"?o=x(mo,void 0,t):t instanceof HTMLElement?o=t:o=x(mo,t,t.content),new Promise(r=>{this.queue.push([o,r]),this.queue.length===1&&this.queue[0]&&this.notifyNext(this.queue[0])})}notifyNext([t,o]){let r=()=>{this.queue.shift(),t.removeEventListener("close",r),o(),this.queue[0]&&this.notifyNext(this.queue[0])};this.shadowRoot?.append(t),t.addEventListener("close",r),t.open=!0}};s(Go,{tagName:"c-snackbar-container",augment:[p(`
:host {
	position:relative; width: 100%; height: 0;
	display: flex; text-align:center; align-items: end;
	overflow: visible;
}`)]});var Fs;function Iw(e){let t;return typeof e=="string"?e={content:e}:e instanceof HTMLElement||(t=e.container),t||(t=Fs??=new Go,t.parentNode||document.body.appendChild(t)),t.notify(e)}function Fw(e){Fs=e}var Ti=class extends u{};s(Ti,{tagName:"c-page",augment:[Mr,p(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${Z("background")}
}`),y]});var Jo=class extends u{xs=!1;sm=!1;md=!1;lg=!1;xl=!1};s(Jo,{tagName:"c-r",init:[h("xl"),h("lg"),h("md"),h("sm"),h("xs")],augment:[p(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${P("small",':host([sm]){display:contents}:host([sm="0"]){display:none}')}
${P("medium",':host([md]){display:contents}:host([md="0"]){display:none}')}
${P("large",':host([lg]){display:contents}:host([lg="0"]){display:none}')}
${P("xlarge",':host([xl]){display:contents}:host([xl="0"]){display:none}')}
	`),y]});var Pt=class extends jo{};s(Pt,{tagName:"c-toolbar",augment:[p(`
:host {
	grid-column: 1 / -1;
	column-gap: 24px;
	row-gap: 8px;
	align-items: center;
	min-height: 48px;
	flex-wrap: wrap;
	flex-shrink: 0;
}
${P("small",":host{column-gap:24px}")}
		`)]});var zi=class extends u{};s(zi,{tagName:"c-page-appbar",augment:[p(`
:host { display: contents; }
#appbar { padding-top: 20px; padding-bottom: 20px; }
#toolbar { max-width: 1200px; width: 100%; margin: auto; gap: 16px; }
${P("small","#toolbar { gap: 24px; }")}
		`),e=>{let t=se(_o,{id:"drawer"},se("nav",void 0,se("slot",{name:"navbar"})));return se(Mo,{$:()=>za(e,"toggle.close",t,!0),id:"appbar",sticky:!0},se(Pt,{id:"toolbar"},se(Jo,{xs:!0,md:0},se(Ko,{ariaLabel:"Toggle navigation menu",target:t})),se("slot")),t)}]});var Ii=class extends u{value=1/0;color},Ds={duration:2e3,iterations:1/0,easing:"cubic-bezier(0.4, 0, 0.6, 1)"};s(Ii,{tagName:"c-progress",init:[m("value"),le("color","primary",".bar")],augment:[k("progressbar"),Gt("valuemax","1"),p(`
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
	`),e=>{let t,o,r=x("div",{className:"bar"}),n=x("div",{className:"bar"});return M(e).append(r,n),d(e,"value").tap(i=>{i!==1/0&&i>1?i=1:i<0&&(i=0),e.ariaValueNow=i===1/0?null:String(i),e.ariaBusy=String(i!==1),e.toggleAttribute("indeterminate",i===1/0),i===1/0?(t=he({target:r,animation:{kf:{transform:["translateX(-100%) scaleX(0.3)","translateX(0%) scaleX(0.8)","translateX(100%) scaleX(0.3)"]},options:Ds}}),o=he({target:n,animation:{kf:{transform:["translate(-150%, -100%) scaleX(0.4)","translate(-50%, -100%) scaleX(0.6)","translate(100%, -100%) scaleX(0.4)"]},options:Ds}})):(t?.cancel(),o?.cancel()),r.style.transform=i===1/0?"":"scaleX("+i+")"})},ro]});var Fi=class extends u{value=1/0};s(Fi,{tagName:"c-progress-circular",init:[xe("value")],augment:[k("progressbar"),Gt("valuemax","1"),p(`
:host {
	display: inline-block;
	width: 48px;
	height: 48px;
}
svg { width: 100%; height: 100% }
		`),e=>{let t=io("svg",{viewBox:"0 0 100 100"}),o=io("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-secondary-container);fill:transparent;stroke-width:10%;stroke-dasharray:282.743px"}),r=io("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-primary);fill:transparent;transition:stroke-dashoffset var(--cxl-speed);stroke-width:10%;transform-origin:center;stroke-dasharray:282.743px"});return t.append(o,r),M(e).append(t),d(e,"value").switchMap(n=>{if(e.ariaValueNow=n===1/0?null:String(n),e.ariaBusy=String(n!==1),n!==1/0){let a=282.743-282.743*Math.max(0,Math.min(1,n));r.style.strokeDashoffset=`${a}px`,r.style.transform="rotate(-90deg)"}return n===1/0?f(Eo({target:e,animation:"spin",options:{iterations:1/0,duration:2e3,easing:"linear"}}),Eo({target:r,animation:{options:{duration:4e3,iterations:1/0,easing:"cubic-bezier(.35,0,.25,1)"},kf:((i,a)=>[{offset:0,strokeDashoffset:i,transform:"rotate(0)"},{offset:.125,strokeDashoffset:a,transform:"rotate(0)"},{offset:.12501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.25,strokeDashoffset:i,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.2501,strokeDashoffset:i,transform:"rotate(270deg)"},{offset:.375,strokeDashoffset:a,transform:"rotate(270deg)"},{offset:.37501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5,strokeDashoffset:i,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5001,strokeDashoffset:i,transform:"rotate(180deg)"},{offset:.625,strokeDashoffset:a,transform:"rotate(180deg)"},{offset:.62501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.75,strokeDashoffset:i,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.7501,strokeDashoffset:i,transform:"rotate(90deg)"},{offset:.875,strokeDashoffset:a,transform:"rotate(90deg)"},{offset:.87501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(341.5deg)"},{offset:1,strokeDashoffset:i,transform:"rotateX(180deg) rotate(341.5deg)"}])((282.743*(1-.05)).toString(),(282.743*(1-.8)).toString())}})):w})},ro]});function Di({source:e,renderFn:t,loading:o,error:r}){return xr(()=>{let n=new fo,i=!1;return[f(o?et(750).tap(()=>{i||n.insert(o())}):w,e.tap(a=>{i=!0,n.empty();let c=t(a);c&&n.insert(c)}).catchError(a=>{if(i=!0,r)return n.empty(),n.insert(r(a)),w;throw a})),n.end]})}function Rs(e,t,o=()=>x(me,{name:"star",fill:!0})){let r=[],n,i=0;for(;i<e;i++)n=o(i),n.classList.add(t),r.push(n);if(e!==i){let a=e+1-i;if(n&&a){let c=`${a*100}%`;n.style.clipPath=`polygon(0 0, ${c} 0, ${c} 100%, 0 100%)`}}return r}var Ri=class extends u{max=5;rating=0;alt};s(Ri,{tagName:"c-rating",init:[xe("max"),xe("rating"),h("alt")],augment:[k("img"),p(`
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
	`),e=>Di({source:d(e,"max"),renderFn:()=>x("span",void 0,...Rs(e.max,"bgstar"))})(e),e=>Di({source:d(e,"rating"),renderFn:t=>x("span",{className:"group"},...Rs(Number(t)>e.max?e.max:Number(t),"star"))})(e)]});var xp=/([^&=]+)=?([^&]*)/g,hp=/:([\w$@]+)/g,bp=/\/\((.*?)\)/g,yp=/(\(\?)?:\w+/g,vp=/\*\w+/g,wp=/[-{}[\]+?.,\\^$|#\s]/g,_i="@@cxlRoute",Re={location:window.location,history:window.history};function kp(e){let t=[];return[new RegExp("^/?"+e.replace(wp,"\\$&").replace(bp,"\\/?(?:$1)?").replace(yp,function(r,n){return t.push(r.slice(1)),n?r:"([^/?]*)"}).replace(vp,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function Sp(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function Li(e,t){return t?e.replace(hp,(o,r)=>t[r]||""):e}function Ep(e){let t={},o;for(;o=xp.exec(e);)o[1]!==void 0&&(t[o[1]]=decodeURIComponent(o[2]??""));return t}var Pi=class{path;regex;parameters;constructor(t){this.path=t=Sp(t),[this.regex,this.parameters]=kp(t)}_extractQuery(t){let o=t.indexOf("?");return o===-1?{}:Ep(t.slice(o+1))}getArguments(t){let r=this.regex.exec(t)?.slice(1);if(!r)return;let n=this._extractQuery(t);return r.forEach((i,a)=>{let c=a===r.length-1?i||"":i?decodeURIComponent(i):"",l=this.parameters[a];l&&(n[l]=c)}),n}test(t){return this.regex.test(t)}toString(){return this.path}},Vi=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new Pi(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${crypto.randomUUID()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let o=this.definition.render();return o[_i]=this,Object.assign(o,t),o}},Oi=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(o=>o.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(o=>o.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function Cp(e){return e[_i]}function Bi(e,t){let o=new URL(e,`http://localhost/${t}`);return{path:o.pathname.slice(1),hash:o.hash.slice(1)}}var Ap={getHref(e){return`${Re.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Qo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&Re.history.pushState({url:e},"",o)}},deserialize(){return{path:Re.location.search.slice(1),hash:Re.location.hash.slice(1)}}};function Qo(){return Re.history.state}var Np={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Qo()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&Re.history.pushState({url:e},"",o||"/")}},deserialize(){return{path:Re.location.pathname,hash:Re.location.hash.slice(1)}}},Ls={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Ls.getHref(e);Re.location.hash!==t&&(Re.location.hash=t)},deserialize(){return Bi(Re.location.hash.slice(1),"")}},go={hash:Ls,path:Np,query:Ap},Hi=class{callbackFn;state;routes=new Oi;instances={};root;lastGo;constructor(t){this.callbackFn=t}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let o=new Vi(t);return this.routes.register(o),o}go(t){this.lastGo=t;let o=this.state?.url,r=typeof t=="string"?Bi(t,o?.path??""):t,n=r.path;if(n!==o?.path){let i=this.routes.findRoute(n);if(!i)throw new Error(`Path: "${n}" not found`);let a=i.path?.getArguments(n);if(i.redirectTo)return this.go(Li(i.redirectTo,a));let c=this.execute(i,a);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${n}" could not be created`);this.updateState({url:r,arguments:a,route:i,current:c,root:this.root})}else this.state&&r.hash!==o.hash&&this.updateState({...this.state,url:r})}getPath(t,o){let n=this.routes.get(t)?.path;return n&&Li(n.toString(),o)}isActiveUrl(t){let o=this.state?.url;if(!o)return!1;let r=Bi(t,o.path);return!!Object.values(this.instances).find(n=>{let i=n[_i],a=this.state?.arguments;if(i?.path?.test(r.path)&&(!r.hash||r.hash===o.hash)){if(a){let c=i.path.getArguments(r.path);for(let l in c)if(a[l]!==c[l])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,o){let r=this.instances[t];return r&&Object.assign(r,o),r}executeRoute(t,o,r){let n=t.parent,i=n&&this.routes.get(n),a=t.id,c=i&&this.executeRoute(i,o,r),l=this.findRoute(a,o)||t.create(o);return c?c.isSameNode(l.parentNode)||c.appendChild(l):this.root=l,r[a]=l,l}discardOldRoutes(t){let o=this.instances;for(let r in o){let n=o[r];n&&t[r]!==n&&(n.parentNode?.removeChild(n),delete o[r])}}execute(t,o){let r={},n=this.executeRoute(t,o||{},r);return this.discardOldRoutes(r),this.instances=r,n}},vt=new Ut,Ps=new Ut,ae=new Hi(()=>vt.next());function N1(e){return t=>{let o=typeof e=="string"?{path:e}:e;ae.route({...o,render:()=>new t})}}function M1(e=""){return t=>{let o=typeof e=="string"?{path:e}:e;ae.route({...o,isDefault:!0,render:()=>new t})}}function T1(e){return vt.map(()=>ae.isActiveUrl(e))}function Mp(e){let t=e;for(;t;){let o=t instanceof HTMLElement&&t.scrollHeight>t.clientHeight?t:null;if(o&&o.scrollTop!==0){o.scrollTo(0,0);return}if(t.assignedSlot){t=t.assignedSlot;continue}if(t.parentElement){t=t.parentElement;continue}let r=t.getRootNode();t=r instanceof ShadowRoot?r.host:null}}function ji(e){let t;return vt.tap(()=>{let{root:o}=ae.getState();o.parentNode!==e?e.appendChild(o):t&&t!==o&&t.parentNode&&e.removeChild(t),t=o}).raf(()=>{let o=ae.getState().url;o.hash?e.querySelector(`#${o.hash},a[name="${o.hash}"]`)?.scrollIntoView():Qo()?.lastAction!=="pop"&&e.parentElement&&Mp(e)})}function Vs(e,t=go.query){return f(Q(()=>{Ps.next(t)}),e.tap(()=>ae.go(t.deserialize())),vt.tap(()=>t.serialize(ae.getState().url))).catchError(o=>{if(o instanceof Error&&o.name==="SecurityError")return w;throw o})}function Tp(){return vt.switchMap(()=>{let e=ae.getState(),t=[],o=e.current;do{let r=o.routeTitle;r&&t.unshift(r instanceof A?r:I(r))}while(o=o.parentNode);return Y(...t)}).tap(e=>document.title=e.join(" - "))}function Os(){return Ze(I(location.hash.slice(1)),b(window,"hashchange").map(()=>location.hash.slice(1)))}var Pr;function zp(){if(!Pr){Pr=new yo(history.state);let e=history.pushState;history.pushState=function(...t){let o=e.apply(this,t),r=Qo();return r&&(r.lastAction="push",Pr?.next(r)),o}}return f(b(window,"popstate").map(()=>{let e=Qo();return e&&(e.lastAction="pop",e)}),Pr)}function Bs(){let e;return f(Os(),zp()).map(()=>window.location).filter(t=>{let o=t.href!==e;return e=t.href,o})}function Ip(e,t=go.query,o){let r=typeof t=="string"?go[t]:t,n=o||(r===go.hash?Os():Bs());return f(ji(e),Vs(n,r),Tp())}function z1(e=go.query,t){return o=>Ip(o,e,t)}var I1=vt.raf().map(()=>{let e=[],t=ae.getState(),o=t.current;do o.routeTitle&&e.unshift({title:o.routeTitle,first:o===t.current,path:Fp(o)});while(o=o.parentNode);return e});function Fp(e){let t=Cp(e);return t&&Li(t.path?.toString()||"",ae.state?.arguments||{})}function F1(e){return R(e).tap(t=>{t.preventDefault(),e.external?location.assign(e.href):ae.go(e.href)})}function Vr(e,t,o=t){return f(Y(Ps,Kt(e)).tap(([r])=>{e.href!==void 0&&(t.href=e.external?e.href:r.getHref(e.href)),t.target=e.target||""}),R(t).tap(r=>{e.target||r.preventDefault()}),R(o).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):ae.go(e.href))}))}function Dp(e,t){let o=document.createElement("div");return o.style.display="contents",Object.assign(o,{routeTitle:t}),o.appendChild(e.content.cloneNode(!0)),o}var Yi=class extends u{strategy="query";get state(){return ae.state}go(t){return ae.go(t)}};s(Yi,{tagName:"c-router",init:[m("strategy")],augment:[e=>{function t(o){let r=o.dataset;if(r.registered)return;r.registered="true";let n=r.title||void 0;ae.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:o.hasAttribute("data-default"),redirectTo:r.redirectto,render:Dp.bind(null,o,n)})}return tt().switchMap(()=>{for(let o of Array.from(e.children))o instanceof HTMLTemplateElement&&t(o);return f(sr(e).tap(o=>{o.type==="added"&&o.value instanceof HTMLTemplateElement&&t(o.value)}),d(e,"strategy").switchMap(o=>{let r=go[o];return Vs(Bs(),r).catchError((n,i)=>(console.error(n),i))}))})}]});function Xi(e,t=e){return f(Rp(e,t).ignoreElements(),vt.map(()=>e.href!==void 0&&ae.isActiveUrl(e.href)))}function Rp(e,t=e){let o=x("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return o.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,M(e).append(o),f(Vr(e,o),b(o,"click").tap(r=>{r.stopPropagation(),ko(r)||e.dispatchEvent(new PointerEvent(r.type,r)),ee(e,"drawer.close",void 0)}),R(t).tap(r=>{ko(r)&&o.click()}))}var Ui=class extends u{href};s(Ui,{tagName:"c-router-selectable",init:[m("href")],augment:[q,()=>x("slot"),e=>X(()=>{let t=e.parentElement;if(!t||!("selected"in t))throw new Error("Invalid selectable parent");return Xi(e,t).raf(o=>{t.selected=o})})]});var Wi=class extends Wo{href;external=!1;target};s(Wi,{tagName:"c-router-item",init:[m("href"),m("external"),m("target")],augment:[e=>Xi(e).tap(t=>{e.selected=t})]});var Zo=class extends u{href;focusable=!1;external=!1;dismiss=!1;target};s(Zo,{tagName:"c-router-link",init:[m("href"),m("focusable"),m("external"),m("target"),m("dismiss")],augment:[p(`
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
	`),e=>{let t=x("a",{className:"link"},x("slot"));return M(e).append(t),f(d(e,"focusable").tap(o=>t.tabIndex=o?0:-1),Ar(e),Vr(e,t))}]});var qi=class extends Zo{focusable=!0};s(qi,{tagName:"c-router-a",augment:[p(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var $i=class extends u{};s($i,{tagName:"c-router-outlet",init:[],augment:[k("main"),q,ji,y]});function Gi(e,t,o){let r=e[t];return o?-r:r}function Lp(e,t,o,r){e[t]=o?-r:r}function Pp(e,t){return e==="x"&&getComputedStyle(t).direction==="rtl"}function Ki(e,t){return Number.isFinite(e)&&e>0?e:t}function Ji(e,t){if(!Number.isSafeInteger(e)||e<0)throw new Error(`${t} must be a non-negative safe integer.`)}function Ys(e){let t=e.estimateSize??50;if(!Number.isFinite(t)||t<=0)throw new Error("estimateSize must be a positive finite number.");let o=e.overscan??0;if(!Number.isFinite(o)||o<0)throw new Error("overscan must be a non-negative finite number.");return Ji(e.dataLength,"dataLength"),{estimateSize:t,overscan:o}}function Hs(e){let t=e>>>0;if(t!==0)return(t&-t)>>>0;let o=Math.floor(e/4294967296);return((o&-o)>>>0)*4294967296}var Qi=class{length;estimate;tree=new Map;measured=new Map;totalDelta=0;constructor(t,o){this.length=t,this.estimate=o}get totalSize(){return this.length*this.estimate+this.totalDelta}get(t){return this.measured.get(t)??this.estimate}update(t,o){if(t<0||t>=this.length||!Number.isFinite(o)||o<=0)return!1;let r=this.get(t);if(r===o)return!1;o===this.estimate?this.measured.delete(t):this.measured.set(t,o);let n=o-r;return this.totalDelta+=n,this.add(t,n),!0}offsetOf(t){t=Math.max(Math.min(t,this.length),0);let o=0;for(let r=t;r>0;r-=Hs(r))o+=this.tree.get(r)??0;return t*this.estimate+o}find(t){if(this.length===0)return{index:0,offset:0};t=Math.max(Math.min(t,this.totalSize),0);let o=0,r=0,n=1;for(;n*2<=this.length;)n*=2;for(;n>=1;n/=2){let i=o+n;if(i>this.length)continue;let a=r+n*this.estimate+(this.tree.get(i)??0);a<=t&&(o=i,r=a)}return o>=this.length?{index:this.length-1,offset:this.get(this.length-1)}:{index:o,offset:t-r}}resize(t){if(t!==this.length){this.length=t;for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}}reset(t=0){for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}add(t,o){for(let r=t+1;r<=this.length;r+=Hs(r)){let n=(this.tree.get(r)??0)+o;Math.abs(n)<1e-9?this.tree.delete(r):this.tree.set(r,n)}}rebuild(){this.tree.clear(),this.totalDelta=0;for(let[t,o]of this.measured){let r=o-this.estimate;this.totalDelta+=r,this.add(t,r)}}};function sk(e){let{estimateSize:t,overscan:o}=Ys(e);return X(()=>_s(e,t,o))}function _s(e,t,o){function r(){ct=z[F];let E=getComputedStyle(z);Vt=parseFloat(E[qe])||0,er=parseFloat(E[kt])||0,ye=Math.max(ct-Vt-er,0),Ot=T==="x"&&E.direction==="rtl",Ke=!1}function n(E){let V=E[G];return Ot?-V:V}function i(E){throw console.error(`Faulty element detected: 
The provided element has an invalid or unmeasurable size. Check that the "${F}" of the element is not zero or negative. Make sure the element is styled properly and any necessary dimensions are set correctly before rendering.`),console.log(E),new Error("Rendered element size returned invalid value.")}function a(E,V){let H=E[F],j=E[G];if((!Number.isFinite(H)||H<=0||!Number.isFinite(j)||!Number.isFinite(j+H))&&i(E),E instanceof Element){Bt.add(E);let B=Ge.get(E);B?(B.index=V,B.rect=E,B.size=H):(Ge.set(E,{index:V,rect:E,size:H}),pt?.observe(E))}return E}function c(){for(let E of Ge.keys())Bt.has(E)||(pt?.unobserve(E),Ge.delete(E))}function l(E,V,H){let j=0,B=-V,U=0,Le=0,Et,Je=0,Ne,Ht=0,Pe,ve=0,Ee=[],fe;E>0&&(fe=D(E-1,j++,"pre"));let nr=-V,Me=E,Br=O.get(E);for(;Me<be&&(Ee.length===0||nr<H);)Ee.push(D(Me,j++,"on")),nr+=Math.min(O.get(Me++),Br);Me<be&&Ee.push(D(Me,j++,"post"));let Ct=E,Qe;fe&&(a(fe,E-1),Je=fe[F],B=-(O.get(E-1)+V),Et=n(fe));for(let Te=0;Te<Ee.length;Te++){let Yt=Ee[Te];if(!Yt)break;let _t=E+Te,ua=a(Yt,_t),bo=n(ua),da=ua[F];if(ve===0&&(U=bo,Et!==void 0)){let Hr=bo-Et,ma=Ki(Hr,Je);O.update(E-1,ma),B=-(ma+V)}if(Ne!==void 0&&Pe!==void 0){let Hr=bo-Ne;O.update(Pe,Ki(Hr,Ht))}if(Ne=bo,Ht=da,Pe=_t,Le=bo+da,ve++,Ct=_t+1,Le-U-V>=H){Qe=Ee[Te+1];break}}if(Ct===be&&Pe!==void 0)O.update(Pe,Ht);else if(Qe&&Pe!==void 0&&Ne!==void 0){let Te=a(Qe,Ct),Yt=n(Te)-Ne;O.update(Pe,Ki(Yt,Ht))}return{count:(E>0?1:0)+ve+(Qe?1:0),endPos:Le,index:Ct,offset:B,rendered:ve,startPos:U}}function g(E,V,H,j){let B=E,U=l(B,V,H);for(;j&&B>0&&U.endPos-U.startPos<ye;){let Le=ye-(U.endPos-U.startPos),Et=Math.max(Math.ceil(Le/t),U.rendered,1),Je=Math.max(B-Et,0);if(Je===B)break;B=Je,U=l(B,0,H)}return{...U,start:B}}function v(E,V,H,j){return j?H:V<=0?0:Math.max(Math.min(E/V,1),0)*H}function S(E){let V=o/2;return E>0?V=o/4:E<0&&(V=o-o/4),{before:V,after:o-V}}function N(){Bt.clear(),Ke&&r();let E=Gi(z,We,Ot),V=E-St;St=E;let H=Math.max(z[wt]-ct,0),j=!tr&&H>0&&E>=H-1,B=Math.max($e-ye,0),U=v(E,H,B,j),{before:Le,after:Et}=S(V),Je=O.find(U),Ne=O.find(Math.max(U-Le,0)).index,Ht=U-O.offsetOf(Ne),Pe=j?1/0:ye+Et,ve=Je.index,Ee=Je.offset,fe=g(Ne,Ht,Pe,j);if(!j){for(;ve<be-1&&Ee>=O.get(ve);)Ee-=O.get(ve++);ve!==Je.index&&(Ne=o===0?ve:O.find(Math.max(U-Le,0)).index,fe=g(Ne,o===0?Ee:U-O.offsetOf(Ne),Pe,j))}let{count:nr}=fe,{offset:Me}=fe;K?.(nr);let Br=O.get(ve),Ct=Math.min(Ee,Br);!j&&fe.start===ve&&(Me+=Ee-Ct),fe.rendered>0&&j&&(Me=ye-fe.endPos,Me>0&&(Me=0));let Qe=O.offsetOf(ve)+Ct;if(j)$e=O.totalSize;else{let _t=O.totalSize;$e=Math.max(_t,Qe+ye+(Qe+ye>=_t?1:0))}let Te=Math.max($e-ye,0);j&&(Qe=Te);let Yt=Math.min(Math.ceil($e),xo);return tr=!1,c(),{dataLength:be,start:fe.start,end:fe.index,totalSize:Yt,count:fe.rendered,offset:Me,atEnd:j,scrollRatio:Te>0?Qe/Te:0}}let{axis:T,scrollElement:z,render:D,refresh:$,remove:K}=e,F=T==="x"?"offsetWidth":"offsetHeight",G=T==="x"?"offsetLeft":"offsetTop",We=T==="x"?"scrollLeft":"scrollTop",wt=T==="x"?"scrollWidth":"scrollHeight",qe=T==="x"?"paddingLeft":"paddingTop",kt=T==="x"?"paddingRight":"paddingBottom",xo=5e6,be=e.dataLength,O=new Qi(be,t),$e=O.totalSize,ct=0,ye=0,Vt=0,er=0,Ot=!1,tr=!0,Ke=!0,St=NaN,ho=!1,pt,Bt=new Set,Ge=new Map,or=new A(E=>{pt=new ResizeObserver(V=>{if(!ho)return;let H=!1;for(let j of V){let B=Ge.get(j.target);if(!B)continue;let U=B.rect[F];if(!Number.isFinite(U)||U<=0||U===B.size)continue;let Le=O.get(B.index)+U-B.size;B.size=U,H=O.update(B.index,Le)||H}H&&($e=O.totalSize,St=NaN,E.next())}),E.signal.subscribe(()=>{pt?.disconnect(),pt=void 0,Ge.clear()})}),rr=b(z,"scroll",{passive:!0}),$s=f($?.tap(E=>{E?.dataLength!==void 0&&(Ji(E.dataLength,"dataLength"),E.resetFrom!==void 0&&Ji(E.resetFrom,"resetFrom"),be=E.dataLength,O.resize(be),E.resetFrom!==void 0&&O.reset(Math.max(Math.min(E.resetFrom,be),0)),$e=O.totalSize,Ke=!0),St=NaN})??w,fr(z).tap(E=>{ho=E,E&&(Ke=!0)}),re(z).tap(()=>Ke=!0),or,rr).filter(()=>ho);return new A(E=>{let V=0;$s.subscribe({next(){V||(V=requestAnimationFrame(()=>{if(V=0,!(!Ke&&St===Gi(z,We,Ot)))try{E.next(N())}catch(H){E.error(H)}}))},error:E.error,signal:E.signal}),E.signal.subscribe(()=>{V&&cancelAnimationFrame(V)})})}function lk(e){let{axis:t,host:o,translate:r=!0}=e,n=e.scrollElement||o.parentElement;if(!n)throw"scrollElement option could not be resolved.";let{estimateSize:i,overscan:a}=Ys(e),c=t==="x"?"scrollLeft":"scrollTop",l=t==="x"?"scrollWidth":"scrollHeight",g=t==="x"?"clientWidth":"clientHeight",v=t==="x"?"width":"height";return X(()=>{let S=o.style.position,N=o.style.top,T=o.style.left,z=o.style.translate,D=document.createElement("div");D.style.position="absolute",D.style.width=D.style.height="1px",D.style.top=D.style.left="0",(e.scrollContainer??n).appendChild(D),o.style.position="sticky",o.style.top=o.style.left="0";let $=o.style.position,K=o.style.top,F=o.style.left,G=o.style.translate;r&&(o.style.translate="0 0",G=o.style.translate);let We=0,wt=!1,qe=NaN,kt=e.dataLength,xo=!1,be=Pp(t,n),O=()=>Gi(n,c,be),$e=ct=>Lp(n,c,be,ct);return _s({...e,scrollElement:n},i,a).tap(({dataLength:ct,totalSize:ye,offset:Vt,atEnd:er,scrollRatio:Ot})=>{let tr=O();We!==ye&&(D.style[v]=`${ye}px`,We=ye);let Ke=Number.isNaN(qe)?0:tr-qe,St=Ke<-1,ho=Ke>1,pt=ct!==kt;if(St&&!pt&&(xo=!1),r){if(Vt!==0){let rr=be?-Vt:Vt;o.style.translate=t==="x"?`${rr}px 0`:`0 ${rr}px`,wt=!0}else wt&&(o.style.translate="0 0",wt=!1);G=o.style.translate}let Bt=Math.max(n[l]-n[g],0),Ge=er&&(pt||xo||ho||Number.isNaN(qe));Ge&&(r&&(o.style.translate="0 0",wt=!1,G=o.style.translate),xo=!0);let or=Ge?Bt:Ot*Bt;Math.abs(O()-or)>.5&&$e(or),kt=ct,qe=O()}).finalize(()=>{D.remove(),o.style.position===$&&(o.style.position=S),o.style.top===K&&(o.style.top=N),o.style.left===F&&(o.style.left=T),r&&o.style.translate===G&&(o.style.translate=z)})}).share()}function Vp(e){return Math.min(Math.max(e,0),1)}function Op(e,t){return qt(e).filter(o=>{let r=e.value,n=o.shiftKey?10:o.ctrlKey||o.altKey?.1:1,i=e.step*n;if(o.key==="Home")t(0);else if(o.key==="End")t(1);else if(o.key==="ArrowLeft"||o.key==="ArrowUp")t(e.value-i);else if(o.key==="ArrowRight"||o.key==="ArrowDown")t(e.value+i);else return!1;return o.preventDefault(),e.value!==r})}var Zi=class extends pe{value=0;step=.01};s(Zi,{tagName:"c-slider-reveal",init:[xe("value",0,1),xe("step")],augment:[k("slider"),p(`
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
		`),_,e=>{let t=x("div",{id:"slider",tabIndex:0}),o=x("slot",{name:"before"}),r=0;function n(){let a=e.value*e.offsetWidth;o.style.clipPath=`inset(0 0 0 ${a}px)`,t.style.left=`${a}px`,e.ariaValueNow=e.value.toString()}function i(a){let c=Vp(a);c!==e.value&&(e.value=c,e.dispatchEvent(new Event("change",{bubbles:!0})))}return t.setAttribute("part","slider"),e.focus=()=>{e.disabled||t.focus()},e.ariaValueMin="0",e.ariaValueMax="1",e.ariaOrientation="horizontal",M(e).append(x("slot",{name:"after"}),o,x("slot"),t),f(Ae(e,t),f(d(e,"value"),re(e)).raf(n),Op(e,i),Jn({target:t}).tap(a=>{a.type==="start"?r=t.offsetLeft:a.type==="move"&&i((r+a.clientX-a.startX)/e.offsetWidth)}))}]});var js=class e extends pe{value="on";checked=!1;defaultChecked=!1;static{s(e,{tagName:"c-switch",init:[m("value"),h("checked")],augment:[k("switch"),ze,p(`
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
${rt(".mask")}
:host([checked]) .mask { translate: 20px 0; }
		`),t=>{t.defaultChecked=t.checked},_,()=>x("div",{className:"knob"}),()=>x("div",{className:"mask"}),jn]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){ue(this).setFormValue(this.checked?String(t):null)}};var ea=class extends u{font};s(ea,{tagName:"c-t",init:[h("font")],augment:[p(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${hr.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${C("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${C("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${C("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${C("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${C("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${C("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),y,e=>d(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var ta=class extends u{selected;tabs=new Set;variant};s(ta,{tagName:"c-tabs",init:[W("selected"),h("variant")],augment:[k("tablist"),p(`
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
		`),y,e=>{function t(o=1){let r=Array.from(e.tabs),n=e.selected||r[0],i=n?r.indexOf(n):-1;return i===-1?null:r[i+o]||null}return lt({host:e,goRight:t.bind(null,1),goLeft:t.bind(null,-1),goFirst:()=>Array.from(e.tabs)[0]||null,goLast:()=>Array.from(e.tabs)[e.tabs.size-1]||null}).tap(o=>{o.click(),o.focus()})},e=>{let t=new ge;return M(e).append(x(st,{className:"selected",$:o=>f(mt(),d(e,"selected"),d(e,"variant"),t,re(e)).raf(()=>{if(!e.checkVisibility())return;let r=e.selected;if(!r)return o.style.transform="scaleX(0)";let n=r.offsetLeft;if(e.variant==="secondary"){let i=r.clientWidth/100;o.style.transform=`translate(${n}px, 0) scaleX(${i})`,o.style.display="block"}else{let i=document.createRange();i.selectNodeContents(r);let{width:a}=i.getBoundingClientRect(),c=n+(r.clientWidth-a)/2,l=a/100;o.style.transform=`translate(${c}px, 0) scaleX(${l})`,o.style.display="block"}e.scrollWidth!==r.clientWidth&&(e.scrollLeft=n-32)})})),gt("tabs",e,e.tabs).raf().switchMap(o=>{let r=[];for(let n of o.elements)r.push(d(n,"selected").tap(i=>{i?(e.selected&&e.selected!==n&&(e.selected.selected=!1),e.selected=n):e.selected===n&&(e.selected=void 0),n.tabIndex=i?0:-1}),re(n).tap(()=>t.next()));return f(...r)})}]});var Or=class extends u{selected=!1;touched=!1;disabled=!1;name};s(Or,{init:[h("touched"),h("selected"),h("disabled"),m("name")],augment:[k("tab"),ze,e=>Ce("tabs",e),e=>d(e,"name").switchMap(t=>t?R(e).tap(()=>e.selected=!0):w),e=>d(e,"selected").tap(t=>{e.setAttribute("aria-selected",t?"true":"false")})]});var oa=class extends Or{};s(oa,{tagName:"c-tab",augment:[p(`
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
${P("small",":host { flex-grow: 0 }")}
		`),ce,_,dt,y]});var ra=class extends u{};s(ra,{tagName:"c-table",augment:[k("table"),p(`
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
		`),y]});var na=class extends u{};s(na,{tagName:"c-tbody",augment:[k("rowgroup"),p(":host{display:table-row-group}"),y]});var ia=class extends u{};s(ia,{tagName:"c-td",augment:[k("cell"),p(`
:host {
	box-sizing: border-box;
	display: table-cell;
	padding: 0 16px;
	height: 51px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
}
		`),y]});var aa=class extends u{};s(aa,{tagName:"c-th",augment:[k("columnheader"),p(`
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
}`),y]});var sa=class extends De{value="";inputEl=document.createElement("textarea")};s(sa,{tagName:"c-textarea",init:[m("value")],augment:[y,e=>e.append(e.inputEl),e=>Ue({host:e,input:e.inputEl}),_,e=>{let t=new CSSStyleSheet;return t.replaceSync(":host{flex-grow:1;position:relative;}"),e.shadowRoot?.adoptedStyleSheets.push(t),f(d(e,"value"),re(e.inputEl),mt()).raf(()=>{let o=e.inputEl.style;o.height="0";let r=e.inputEl.scrollHeight;t.replaceSync(`:host{flex-grow:1;position:relative;height:${r}px}`),o.height="100%"})}]});function Bp(e){return getComputedStyle(e).direction==="rtl"}function Hp(e,t,o,r,n){return e==="right"||e==="end"&&!r||e==="start"&&r?(n.left=t.right,!0):e==="left-to-right"||e==="start-to-end"&&!r?(n.left=t.left,!0):e==="left"||e==="end"&&r||e==="start"&&!r?(n.left=t.left-o.offsetWidth,!0):e==="center"?(n.left=t.left+t.width/2-o.offsetWidth/2,!0):e==="right-to-left"||e==="end-to-start"&&r?(n.left=t.right-o.offsetWidth,!0):e==="fill"?(n.left=t.left,n.minWidth=t.width,!0):!1}function Yp(e,t,o,r){return e==="bottom"?(r.top=t.bottom,!0):e==="top"?(r.top=t.top-o.offsetHeight,!0):e==="middle"?(r.top=t.top+t.height/2-o.offsetHeight/2,!0):e==="top-to-bottom"?(r.top=t.top,!0):e==="bottom-to-top"?(r.top=t.bottom-o.offsetHeight,!0):!1}function Us(e,t,o){return Math.min(Math.max(e,t),o)}function Xs({element:e,relativeTo:t,position:o,container:r}){if(o==="none")return;if(r??=de.currentPopupContainer??de.popupContainer,e.parentNode||r.appendChild(e),typeof o=="function")return o(e);let n=t.getBoundingClientRect(),i=e.style,a=Math.max(r.offsetWidth-e.offsetWidth-16,16),c=Math.max(r.offsetHeight-e.offsetHeight-16,16);i.left=i.top=i.width=i.minWidth=i.transformOrigin="",o==="auto"&&(o="center bottom");let l={left:0,top:0},g=Bp(e);for(let v of o.split(" "))if(!Hp(v,n,e,g,l)&&!Yp(v,n,e,l))throw new Error(`Invalid position "${v}"`);l.left=Us(l.left,16,a),l.top=Us(l.top,16,c),i.left=`${l.left}px`,i.top=`${l.top}px`,l.minWidth&&(i.minWidth=`${l.minWidth}px`)}function _p(e){let t=f(L(e,"position"),b(window,"scroll",{capture:!0,passive:!0})),o=r=>Xs({element:r,relativeTo:(typeof e.relative=="string"?at(e,e.relative):e.relative)??e.firstElementChild??e,position:e.position||"auto",container:document.body});return Tt(e).switchMap(({target:r,open:n})=>{if(r.open&&n&&(r.open=!1),r.trigger!==e)return w;if(r.open=n,n){let i=r.dialog??r,a=e.firstElementChild;return r.dialog&&(i.style.margin="0"),o(i),f(re(i),t).raf(()=>{a&&!a.checkVisibility()?e.open=!1:o(i)})}return w})}var la=class extends u{open=!1;target;position;relative;trigger};s(la,{tagName:"c-toggle-popup",init:[h("open"),m("target"),m("position"),m("relative"),m("trigger")],augment:[_p,y,p(":host{display:contents}")]});var ca=class extends Pt{};s(ca,{tagName:"c-toolbar-floating",augment:[p(`
:host {
	background-color: var(--cxl-color-surface-container);
	color: var(--cxl-color-on-surface-variant);
	border-radius: var(--cxl-shape-corner-full);
	padding: 8px 24px;
	height: 64px;
	${Ua(3)}
}
		`)]});var pa=class extends u{color};s(pa,{tagName:"c-tr",init:[le("color")],augment:[k("row"),p(":host{display:table-row;height:53px;}"),y]});var jp={xl:"xlarge",lg:"large",md:"medium",sm:"small",xs:"xsmall",full:"full"},Up=Ka.map(e=>e==="inherit"?`[c~="surface-${e}"]{background-color:inherit;color:inherit}
[c~="color-${e}"]{color:inherit}`:`[c~="surface-${e}"]{background-color:var(--cxl-color-${e});color:var(--cxl-color-on-${e})}
[c~="color-${e}"]{color:var(--cxl-color-${e})}`).join(""),Ws=`[c~="cover"]{object-fit:cover;width:100%;height:100%;}
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
${Up}
${hr.map(e=>`[c-font="${e}"]{${C(e)}}`).join("")}
${nt.map(e=>`[c~="pad-${e}"]{padding:${e}px}
[c~="corner-${e}"]{border-radius:${e}px}
[c~="gap-${e}"]{gap:${e}px}`).join("")}
${Object.entries(jp).map(([e,t])=>`[c~="corner-${e}"]{border-radius:var(--cxl-shape-corner-${t})}`).join("")}
[c~="surface-scrim"]{
	background-color:var(--cxl-color-scrim);
	background-size:cover;
	background-blend-mode:darken;
	background-position:center;
}`,Xp=`${Ws}
${P("small",Ws.replace(/\[c~/g,"[c\\:sm~"))}
`,qs=new WeakMap;function Wp(e=document){let t=qs.get(e);return t||(t=He(Xp),e.adoptedStyleSheets.push(t),qs.set(e,t)),t}var fa=class extends u{};s(fa,{tagName:"c-www",augment:[e=>{Wp(e.ownerDocument)}]});export{cn as Accordion,un as AccordionHeader,No as AccordionPanel,on as Action,Ft as Alert,dn as AlertError,Mo as Appbar,cs as AppbarContextual,mn as AppbarLayout,gn as AppbarTitle,bn as Application,yn as AriaLive,mf as Augment,Ir as Autocomplete,Dn as AutocompleteDynamic,Rn as Avatar,yo as BehaviorSubject,Jr as Bindings,co as Block,Ln as Body,_e as Button,to as ButtonBase,To as ButtonRound,Pn as ButtonSegmented,Vn as ButtonText,Vo as C,Oo as Card,_n as CardItem,Es as Checkbox,Un as Chip,Ga as ColorStyles,u as Component,oc as ContentManager,Xn as Date,M1 as DefaultRoute,Wn as Dialog,po as DialogBase,Lt as DialogBasic,Kn as Dismiss,Ms as DragHandle,_o as Drawer,Qn as Dropdown,w as EMPTY,Zn as Each,Yr as EmptyError,Cn as Field,ei as FieldBar,Fe as FieldBase,ti as FieldFrame,Ro as FieldHelp,oi as FieldOutlined,jo as Flex,Rr as Form,ri as FormSubmit,ni as Grid,ai as GridList,Ls as HashStrategy,pi as Hero,fi as Hr,me as Icon,Ie as IconButton,mi as IconToggleTheme,gi as Iframe,pe as Input,xi as InputClear,hi as InputFile,yi as InputNumber,bi as InputNumberBase,zr as InputOption,Is as InputPassword,vi as InputPlaceholder,zn as InputText,De as InputTextBase,Hn as Item,Xe as ItemBase,wi as Kbd,ki as Label,Uo as Layout,uo as LayoutBase,Si as List,Hi as MainRouter,Ei as Menu,hn as Meta,Ci as NavDropdown,Mi as NavHeadline,Wo as NavItem,Ni as NavTarget,Ai as NavTreeItem,Ko as NavbarToggle,A as Observable,En as Option,ir as OrderedSubject,Ja as OutlineColorStyles,Ti as Page,zi as PageAppbar,Np as PathStrategy,Bo as Pill,Xo as Popup,Ii as Progress,Fi as ProgressCircular,Ap as QueryStrategy,Jo as R,Ri as Rating,Ut as Reference,ar as ReplaySubject,Nr as Ripple,Vi as RouteBase,Oi as RouteManager,qi as RouterA,Yi as RouterComponent,Wi as RouterItem,Zo as RouterLink,$i as RouterOutlet,Ui as RouterSelectable,li as Section,Nn as Select,ao as SelectOption,Ve as Signal,en as SizeValues,Zi as SliderReveal,y as Slot,mo as Snackbar,Go as SnackbarContainer,st as Span,go as Strategies,ge as Subject,Ks as Subscriber,Ka as SurfaceColorNames,js as Switch,ea as T,oa as Tab,Or as TabBase,ra as Table,ta as Tabs,na as Tbody,ia as Td,sa as TextArea,aa as Th,sn as Toggle,ht as ToggleBase,Yo as TogglePanel,la as TogglePopup,Ao as ToggleTarget,Ye as ToggleTargetBase,Pt as Toolbar,ca as ToolbarFloating,pa as Tr,hr as TypographyValues,fa as Www,ns as activeRipple,Zh as alert,cf as animated,ps as applyMeta,Vl as applyTheme,Gt as aria,kf as ariaChecked,La as ariaControls,Sf as ariaDescribed,ot as ariaId,Da as ariaLabel,Fa as ariaValue,m as attribute,L as attributeChanged,tl as auditTime,gf as augment,Vc as avatarBaseStyles,Se as be,Vr as bindHref,ne as bindings,wr as breakpoint,ol as bufferTime,Do as buildGo,On as buildGridCss,Rl as buildIconFactoryCdn,ap as buildListGo,rt as buildMask,vr as buildMenuStyles,It as buttonBaseStyles,ze as buttonBehavior,fn as buttonKeyboardBehavior,Wl as buttonStyles,Oc as cardStyles,cl as catchError,ro as changeEvent,jn as checkedBehavior,le as colorAttribute,zf as colorMix,Y as combineLatest,s as component,Ze as concat,nl as concatMap,sb as confirm,oe as content,x as create,p as css,Wa as cssAttribute,mr as cssSymbol,Gp as debounceFunction,nf as debounceImmediate,xl as debounceRaf,el as debounceTime,os as decode,ls as defaultFormatDate,Xa as defaultThemes,X as defer,If as delayTheme,Dr as dialog,qn as dialogClose,$n as dialogStyles,pn as disabledAttribute,_ as disabledStyles,q as displayContents,pl as distinctUntilChanged,Qc as drawerStyles,zs as each,op as eachBehavior,Ua as elevation,rf as empty,$l as errorToString,gr as event,il as exhaustMap,El as expression,An as fieldBaseStyles,Tc as fieldBehavior,Mc as fieldLayout,Rt as fieldLayoutStyles,Ac as fieldStyles,fp as fileUploadBehavior,Ur as filter,ml as finalize,rp as findForm,ll as first,Kp as firstValueFrom,Ae as focusable,Ul as focusableDisabled,Xl as focusableEvents,hl as focused,C as font,Qd as formatDate,Oe as from,vo as fromAsync,$p as fromGenerator,ha as fromIterable,_r as fromPromise,d as get,pf as getActiveElement,ft as getAriaId,Ta as getAttribute,Zd as getDayText,Cp as getElementRoute,Jd as getFormattedDate,kn as getHostActive,Zt as getIcon,Gd as getLocale,hf as getRegisteredComponents,Nt as getRoot,Pc as getSearchRegex,M as getShadow,Rs as getStars,Er as getTarget,at as getTargetById,Cr as getTargets,np as gridColumns,sp as gridNavigation,Bn as growAndFillStyles,Sc as handleListArrowKeys,qr as hovered,$r as hoveredOrFocused,gl as ignoreElements,Ip as initializeRouter,Nc as inputContainer,Po as inputTextBase,In as inputTextStyles,Wp as installWwwCss,ue as internals,Jp as interval,sf as isFocusable,af as isHidden,ko as isKeyboardClick,us as isPageReady,Hc as itemBehavior,Yn as itemButtonBehavior,ii as itemHost,yr as itemLayout,Bc as itemStyles,iu as json,si as layoutStyles,F1 as linkBehavior,$a as loadTheme,Il as loadThemeDefinition,Fo as manageFocus,ip as manageFocusList,jr as map,dt as maskStyles,P as media,f as merge,rl as mergeMap,ee as message,za as messageProxy,Mr as metaBehavior,Co as motion,qo as navItemComponent,lt as navigation,Om as navigationItems,Lr as navigationList,He as newStylesheet,lf as nodeSort,Sp as normalize,Iw as notify,xe as numberAttribute,Q as observable,Sa as observeChildren,Fl as observeTheme,I as of,b as on,R as onAction,lr as onAttributeMutation,sr as onChildrenMutation,Wr as onEvent,mt as onFontsReady,Os as onHashChange,zp as onHistoryChange,pr as onIntersection,cr as onKeyAction,qt as onKeypress,tt as onLoad,Bs as onLocation,ie as onMessage,Xr as onMutation,fs as onPageReady,ka as onReady,re as onResize,Jt as onThemeChange,Kt as onUpdate,fr as onVisibility,Wt as onVisible,ke as operator,At as operatorNext,xa as operators,Ec as overrideFocusMethod,Yl as parseAnimation,au as parseJson,_l as parseMotion,Ep as parseQueryParameters,Bi as parseUrl,qp as pipe,xr as placeholder,gp as popupBehavior,mp as popupStyles,_p as popupToggleBehavior,Ic as positionUnder,Lc as prefixMatcher,W as property,dl as publishLast,wa as raf,Qs as reduce,wo as ref,Ff as registerDefaultIconFactory,Df as registerIcon,oo as registerText,dr as renderChildren,oy as renderEach,Li as replaceParameters,ce as ripple,k as role,N1 as route,T1 as routeIsActive,I1 as routeTitles,ae as router,z1 as routerHost,Rp as routerLink,ji as routerOutlet,Xi as routerSelectable,vt as routerState,Vs as routerStrategy,Qt as scrollbarStyles,ci as sectionStyles,Js as select,Mn as selectBehavior,Fc as selectComponent,zc as selectInputStyles,Ss as selectMenuStyles,xf as set,So as setAttribute,Tp as setDocumentTitle,Fw as setSnackbarContainer,ul as share,fl as shareLatest,Qp as shareReplay,te as sizeAttribute,Fs as snackbarContainer,nu as sortBy,nt as spacingValues,nn as storage,Ps as strategy$,h as styleAttribute,kr as stylesheet,va as subject,Fn as substringMatcher,Z as surface,io as svg,Dt as svgPath,ya as switchMap,Re as sys,al as take,sl as takeWhile,Xt as tap,J as theme,br as themeName,Pl as themeReady,Zs as throttleTime,ef as throwError,et as timer,Gs as toPromise,ln as toggleBehavior,Ar as toggleClose,Tt as toggleComponent,yu as toggleOpen,it as toggleTargetBehavior,eo as toggleTargetStyles,Be as trigger,se as tsx,kc as updateEvent,lk as virtualScroll,sk as virtualScrollRender,Ya as visuallyHidden,Xp as wwwCss,Zp as zip};
