var Te=Symbol("undefined"),is=Symbol("terminator");function oo(e){if(e===Te)throw new Error("Value not initialized");return e}function Gl(e,t){let o=!1,r={error:n,unsubscribe:i,get closed(){return o},signal:new Je,next(a){if(!o)try{e.next?.(a)}catch(c){n(c)}},complete(){if(!o)try{e.complete?.()}finally{i()}}};e.signal?.subscribe(i);function n(a){if(o)throw a;if(!e.error)throw i(),a;try{e.error(a)}finally{i()}}function i(){o||(o=!0,r.signal.next())}try{t?.(r)}catch(a){n(a)}return r}function Gu(...e){return t=>e.reduce((o,r)=>r(o),t)}var z=class{__subscribe;constructor(t){this.__subscribe=t}then(t,o){return Jl(this).then(t,o)}pipe(...t){return t.reduce((o,r)=>r(o),this)}subscribe(t){return Gl(!t||typeof t=="function"?{next:t}:t,this.__subscribe)}},ke=class extends z{closed=!1;signal=new Je;observers=new Set;constructor(){super(t=>{this.onSubscribe(t)})}next(t){if(!this.closed)for(let o of Array.from(this.observers))o.closed||o.next(t)}error(t){if(!this.closed){this.closed=!0;let o=!1,r;for(let n of Array.from(this.observers))try{n.error(t)}catch(i){o=!0,r=i}if(o)throw r}}complete(){this.closed||(this.closed=!0,Array.from(this.observers).forEach(t=>t.complete()),this.observers.clear())}onSubscribe(t){this.closed?t.complete():(this.observers.add(t),t.signal.subscribe(()=>this.observers.delete(t)))}},Je=class extends z{closed=!1;observers=new Set;constructor(){super(t=>{this.closed?(t.next(),t.complete()):this.observers.add(t)})}next(){if(!this.closed){this.closed=!0;for(let t of Array.from(this.observers))t.closed||(t.next(),t.complete());this.observers.clear()}}},Or=class extends ke{queue=[];emitting=!1;next(t){if(!this.closed)if(this.emitting)this.queue.push(t);else{for(this.emitting=!0,super.next(t);this.queue.length;)for(let o of this.queue.splice(0))super.next(o);this.emitting=!1}}},Ro=class extends ke{currentValue;constructor(t){super(),this.currentValue=t}get value(){return this.currentValue}next(t){this.currentValue=t,super.next(t)}onSubscribe(t){let o=super.onSubscribe(t);return this.closed||t.next(this.currentValue),o}},Br=class extends ke{bufferSize;buffer=[];lastError=Te;constructor(t=1/0){super(),this.bufferSize=t}error(t){this.lastError=t,super.error(t)}next(t){return this.buffer.length===this.bufferSize&&this.buffer.shift(),this.buffer.push(t),super.next(t)}onSubscribe(t){this.observers.add(t),this.buffer.forEach(o=>t.next(o)),this.lastError!==Te?t.error(oo(this.lastError)):this.closed&&t.complete(),t.signal.subscribe(()=>this.observers.delete(t))}},ro=class extends ke{$value=Te;get hasValue(){return this.$value!==Te}get value(){if(this.$value===Te)throw new Error("Reference not initialized");return oo(this.$value)}next(t){return this.$value=t,super.next(t)}onSubscribe(t){!this.closed&&this.$value!==Te&&t.next(oo(this.$value)),super.onSubscribe(t)}},Cn=class extends Error{message="No elements in sequence"};function He(...e){return new z(t=>{let o=0,r;function n(){let i=e[o++];i&&!t.closed?(r?.next(),i.subscribe({next:t.next,error:t.error,complete:n,signal:r=new Je})):t.complete()}t.signal.subscribe(()=>r?.next()),n()})}function G(e){return new z(t=>{e().subscribe(t)})}function no(e){return new z(t=>{e.then(o=>{t.closed||t.next(o),t.complete()}).catch(o=>t.error(o))})}function Ju(e){return new z(t=>{t.signal.subscribe(()=>{let o=e.return?.();o instanceof Promise&&o.catch(r=>t.error(r))}),(async()=>{do{let o=await e.next();if(t.closed||o.done)break;t.next(o.value)}while(!t.closed);t.complete()})().catch(o=>t.error(o))})}function Vo(e){return G(()=>no(e()))}function ss(e){return new z(t=>{for(let o of e)t.closed||t.next(o);t.complete()})}function Ze(e){return e instanceof z?e:e instanceof Promise?no(e):ss(e)}function F(...e){return ss(e)}function ls(e){return new Promise((t,o)=>{let r=Te;e.subscribe({next:n=>r=n,error:o,complete:()=>t(r)})})}function Jl(e){return ls(e).then(t=>t===Te?void 0:oo(t))}async function Zu(e){return ls(e.first()).then(t=>oo(t))}function Pt(e,t){return De(o=>({next:e(o),unsubscribe:t}))}function De(e){return t=>new z(o=>{let r=e(o,t);r.unsubscribe&&o.signal.subscribe(()=>r.unsubscribe?.()),r.error||(r.error=o.error),r.complete||(r.complete=o.complete),r.signal=o.signal,t.subscribe(r)})}function Nn(e){return Pt(t=>o=>t.next(e(o)))}function Zl(e){let t=Te;return Pt(o=>r=>{let n=e(r);n!==t&&(t=n,o.next(n))})}function Ql(e,t){return De(o=>{let r=t,n=0;return{next(i){r=e(r,i,n++)},complete(){o.next(r),o.complete()}}})}function Qu(e,t){let o;function r(...n){o&&clearTimeout(o),o=setTimeout(()=>e.apply(this,n),t)}return r.cancel=()=>clearTimeout(o),r}function $l(e){return De(t=>{let o=!0,r;return{next(n){o&&(o=!1,t.next(n),r=setTimeout(()=>o=!0,e))},unsubscribe:()=>clearTimeout(r)}})}function $u(e){if(e<0)throw new Error("Invalid period");return new z(t=>{let o=setInterval(t.next,e);t.signal.subscribe(()=>clearInterval(o))})}function Ye(e){return new z(t=>{let o=setTimeout(()=>{t.next(),t.complete()},e);t.signal.subscribe(()=>clearTimeout(o))})}function ec(e,t=Ye){return cs(o=>t(e).map(()=>o))}function tc(e){return De(t=>{let o,r=!1,n=Te,i=()=>{o=void 0,!(!r||t.closed)&&(r=!1,t.next(oo(n)),n=Te)};return{next(a){n=a,r=!0,o===void 0&&(o=setTimeout(i,e))},complete(){o!==void 0&&(clearTimeout(o),i()),t.complete()},unsubscribe(){o!==void 0&&clearTimeout(o)}}})}function oc(e){if(e<0)throw new Error("Invalid period");return De(t=>{let o=[],r=setInterval(()=>{if(t.closed)return;let n=o;o=[],t.next(n)},e);return{next(n){o.push(n)},complete(){clearInterval(r),t.next(o),t.complete()},unsubscribe(){clearInterval(r)}}})}function cs(e){return t=>ee(o=>{let r=!1,n=!1,i,a=()=>{i?.next(),r=!1,n&&o.complete()},c=new Je;o.signal.subscribe(()=>{a(),c.next()}),t.subscribe({next(l){a(),i=new Je,r=!0,Ze(e(l)).subscribe({next:o.next,error:o.error,complete:a,signal:i})},error:o.error,complete(){n=!0,r||o.complete()},signal:c})})}function rc(e){return t=>ee(o=>{let r=o.signal,n=0,i=0,a=!1;function c(){i++,a&&i===n&&o.complete()}t.subscribe({next:l=>{n++,Ze(e(l)).subscribe({next:o.next,error:o.error,complete:c,signal:r})},error:o.error,complete(){a=!0,i===n&&o.complete()},signal:r})})}function nc(e){return De(t=>{let o=new Je,r,n,i=[],a=!1,c=!1,l=()=>{r?.next(),r=void 0,n=void 0,c=!1,i.length&&!t.closed?i.splice(0,1).forEach(f):a&&t.complete()},f=h=>{c=!0,r=new Je,n=Ze(e(h)).subscribe({next:t.next,error:t.error,complete:l,signal:r})};return t.signal.subscribe(()=>{r?.next(),o.next()}),{next(h){c?i.push(h):f(h)},error:t.error,complete(){a=!0,!c&&i.length===0&&t.complete()},signal:o,unsubscribe:()=>n?.unsubscribe()}})}function ic(e){return De(t=>{let o=!0;return{next(r){o&&(o=!1,Ze(e(r)).subscribe({next:t.next,error:t.error,complete:()=>o=!0,signal:t.signal}))}}})}function An(e){return Pt(t=>o=>{e(o)&&t.next(o)})}function ac(e){return Pt(t=>o=>{e-- >0&&!t.closed&&t.next(o),(e<=0||t.closed)&&t.complete()})}function sc(e){return Pt(t=>o=>{!t.closed&&e(o)?t.next(o):t.complete()})}function lc(){let e=!1;return De(t=>({next(o){e||(e=!0,t.next(o),t.complete())},complete(){t.closed||t.error(new Cn)}}))}function io(e){return Pt(t=>o=>{e(o),t.next(o)})}function cc(e){return De((t,o)=>{let r,n={next:t.next,error(i){try{if(t.closed)return;let a=e(i,o);r?.next(),r=new Je,a.subscribe({...n,signal:r})}catch(a){t.error(a)}},unsubscribe:()=>r?.next()};return n})}function pc(){return Pt(e=>{let t=Te;return o=>{o!==t&&(t=o,e.next(o))}})}function uc(){return e=>{let t=new Br(1),o=!1;return ee(r=>{t.subscribe(r),o||(o=!0,e.subscribe(t))})}}function ed(e){return t=>{let o=new Br(e),r=0;return ee(n=>{r++,o.subscribe(n),r===1&&t.subscribe(o),n.signal.subscribe(()=>{--r===0&&o.signal.next()})})}}function dc(){return e=>{let t,o=0;function r(){--o===0&&t.signal.next()}return ee(n=>{n.signal.subscribe(r),o++===0?(t=Oo(),t.subscribe(n),e.subscribe(t)):t.subscribe(n)})}}function fc(){return e=>{let t=new ke,o,r,n=!1,i=!1;return ee(a=>{i?(a.next(r),a.complete()):t.subscribe(a),o??=e.subscribe({next:c=>{n=!0,r=c},error:a.error,complete(){i=!0,n&&t.next(r),t.complete()},signal:a.signal})})}}function d(...e){return e.length===1?e[0]:new z(t=>{let o=e.length;for(let r of e)t.closed||r.subscribe({next:t.next,error:t.error,complete(){o--===1&&t.complete()},signal:t.signal})})}function td(...e){return e.length===0?k:new z(t=>{let o=new Array(e.length);function r(){let n=!0;for(;n;){for(let i of o)if(!i||i.length===0)n=!1;else if(i[0]===is)return t.complete();n&&t.next(o.map(i=>i?.shift()))}}e.forEach((n,i)=>{let a=o[i]=[];n.subscribe({next(c){a.push(c),r()},error:t.error,complete(){a.push(is),r()},signal:t.signal})})})}function P(...e){return e.length===0?k:new z(t=>{let o=e.length,r=o,n=0,i=!1,a=new Array(o),c=new Array(o);e.forEach((l,f)=>l.subscribe({next(h){c[f]=h,a[f]||(a[f]=!0,++n>=r&&(i=!0)),i&&t.next(c.slice(0))},error:t.error,complete(){--o<=0&&t.complete()},signal:t.signal}))})}function mc(e){return De(t=>({next:t.next,unsubscribe:e}))}function gc(){return De(()=>({next(){}}))}function od(e){return new z(t=>{t.error(e)})}var k=new z(e=>{e.complete()});function pe(e){return new Ro(e)}function ee(e){return new z(e)}function ps(){return new ke}function Oo(){return new ro}var as={auditTime:tc,bufferTime:oc,catchError:cc,concatMap:nc,debounceTime:ec,distinctUntilChanged:pc,exhaustMap:ic,filter:An,finalize:mc,first:lc,ignoreElements:gc,map:Nn,mergeMap:rc,publishLast:fc,reduce:Ql,select:Zl,share:dc,shareLatest:uc,switchMap:cs,take:ac,takeWhile:sc,tap:io,throttleTime:$l};for(let e in as)z.prototype[e]=function(...t){return this.pipe(as[e](...t))};function id(e){let t;for(;t=e.childNodes[0];)e.removeChild(t)}function v(e,t,o){return new z(r=>{let n=r.next.bind(r);e.addEventListener(t,n,o),r.signal.subscribe(()=>e.removeEventListener(t,n,o))})}function Hr(e){return Bo(e,{childList:!0})}function Yr(e,t){return Bo(e,{attributes:!0,attributeFilter:t})}function Bo(e,t={attributes:!0,childList:!0}){return new z(o=>{let r=new MutationObserver(n=>n.forEach(i=>{for(let a of i.addedNodes)o.next({type:"added",target:e,value:a});for(let a of i.removedNodes)o.next({type:"removed",target:e,value:a});i.type==="characterData"?o.next({type:"characterData",target:e}):i.attributeName&&o.next({type:"attribute",target:e,value:i.attributeName})}));r.observe(e,t),o.signal.subscribe(()=>r.disconnect())})}function jr(e){return v(e,"keydown").filter(t=>t.key===" "||t.key==="Enter"?(t.preventDefault(),!0):!1)}function R(e){return v(e,"click")}function Ur(e,t){return new z(o=>{let r=new IntersectionObserver(n=>{for(let i of n)o.next(i)},t);r.observe(e),o.signal.subscribe(()=>r.disconnect())})}function _r(e){return Ur(e).map(t=>t.isIntersecting)}function ao(e){return Ur(e).filter(t=>t.isIntersecting).first()}function xc(e){let t;return function(...o){t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.apply(this,o),t=0})}}function ad(e){let t;return function(...o){t||(t=!0,queueMicrotask(()=>{t=!1,e.apply(this,o)}))}}function us(e){return De(t=>{let o=xc(n=>{t.closed||(e&&e(n),t.next(n),r&&t.complete())}),r=!1;return{next:o,complete:()=>r=!0}})}function ds(){return G(()=>document.readyState!=="loading"?F(!0):v(window,"DOMContentLoaded").first().map(()=>!0))}function Pe(e,t,o){let r=new CustomEvent(t,o);e.dispatchEvent(r)}function so(e,t){let o=e,r;return d(G(()=>(r=o.childNodes,r?F(void 0):k)),pt().switchMap(()=>o.childNodes!==r?F(void 0):k),Bo(e,{childList:!0,...t}).map(()=>{}))}function pt(){return G(()=>document.readyState==="complete"?F(!0):v(window,"load").first().map(()=>!0))}function ue(...e){return new z(t=>{let o=new ResizeObserver(r=>r.forEach(n=>t.next(n)));for(let r of e)o.observe(r);t.signal.subscribe(()=>o.disconnect())})}function sd(e){return e.offsetParent===null&&!(e.offsetWidth&&e.offsetHeight)}function ld(e){return e instanceof HTMLElement&&(!("disabled"in e)||!e.disabled)&&(e.offsetParent!==null||!!(e.offsetWidth&&e.offsetHeight))&&(e.tabIndex!==-1||e.contentEditable==="true"||e.hasAttribute("tabindex"))}function fs(e,t){return e.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_PRECEDING?1:-1}function Mn(e,t,o){return r=>He(F(e?r.matches(e):!1),v(r,t).switchMap(()=>d(F(!0),v(r,o).map(()=>e?r.matches(e):!1))))}var cd=Mn("","animationstart","animationend"),vt=Mn("","mouseenter","mouseleave"),Ho=Mn(":focus,:focus-within","focusin","focusout"),Tn=e=>P(vt(e),Ho(e)).map(([t,o])=>t||o);function Qe(e,t,o){return t=t?.toLowerCase(),v(e,"keydown",o).filter(r=>!t||!!r.key&&r.key.toLowerCase()===t)}function Yo(e){return e instanceof PointerEvent&&e.pointerType===""||e instanceof MouseEvent&&e.type==="click"&&e.detail===0}function Rt(e){let t=e.getRootNode();return t instanceof Document||t instanceof ShadowRoot?t:void 0}function pd(e){return Rt(e)?.activeElement??null}var hc=io(e=>console.trace(e));z.prototype.log=function(){return this.pipe(hc)};z.prototype.raf=function(e){return this.pipe(us(e))};var de=Symbol("bindings"),ms={},ut=Symbol("augments"),gs=Symbol("specialize"),Vt=Symbol("parser"),zn=class{bindings;messageHandlers;internals;attributes$=new Or;wasConnected=!1;wasInitialized=!1;subscriptions;prebind;addMessageHandler(t){(this.messageHandlers??=new Set).add(t)}removeMessageHandler(t){this.messageHandlers?.delete(t)}message(t,o){let r=!1;if(this.messageHandlers)for(let n of this.messageHandlers)n.type===t&&(n.next(o),r||=n.stopPropagation);return r}add(t){if(this.wasConnected)throw new Error("Cannot bind connected component.");this.wasInitialized?(this.bindings??=[]).push(t):(this.prebind??=[]).push(t)}connect(){if(this.wasConnected=!0,!this.subscriptions&&(this.prebind||this.bindings)){let t=this.subscriptions=[];if(this.bindings)for(let o of this.bindings)t.push(o.subscribe());if(this.prebind)for(let o of this.prebind)t.push(o.subscribe())}}disconnect(){this.subscriptions?.forEach(t=>t.unsubscribe()),this.subscriptions=void 0}},qr=Symbol("css"),g=class extends HTMLElement{static observedAttributes;static[ut];static[Vt];[de]=new zn;[qr];connectedCallback(){this[de].wasInitialized=!0,this[de].wasConnected||this.constructor[ut]?.forEach(t=>t(this)),this[de].connect()}disconnectedCallback(){this[de].disconnect()}attributeChangedCallback(t,o,r){let n=this.constructor[Vt]?.[t]??bc;o!==r&&(this[t]=n(r,this[t]))}};function bc(e,t){let o=t===!1||t===!0;return e===""?o?!0:"":e===null?o?!1:void 0:e}function xs(e,t){Object.prototype.hasOwnProperty.call(e,ut)||(e[ut]=e[ut]?.slice(0)??[]),e[ut]?.push(t)}var yc={mode:"open"};function A(e){return e.shadowRoot??e.attachShadow(yc)}function hs(e,t){t instanceof Node?A(e).appendChild(t):e[de].add(t)}function Xr(e,t){t.length&&xs(e,o=>{for(let r of t){let n=r.call(e,o);n&&n!==o&&hs(o,n)}})}function bs(e,t){ms[e]=t,customElements.define(e,t)}function se(e){return e[de].internals??=e.attachInternals()}function md(e,...t){return o=>{typeof e=="string"?(Xr(o,t),bs(e,o)):(t.unshift(e),Xr(o,t))}}function s(e,{init:t,augment:o,tagName:r}){if(e[ut]&&(e[ut]=e[ut].map(n=>n[gs]?.(e.prototype)??n)),t)for(let n of t)n(e);o&&Xr(e,o),r&&bs(r,e)}function gd(e,...t){Xr(e,t)}function lo(e){return He(F(e),e[de].attributes$.map(()=>e))}function B(e,t){return e[de].attributes$.pipe(An(o=>o.attribute===t),Nn(()=>e[t]))}function p(e,t){return d(B(e,t),G(()=>F(e[t])))}function xd(e,t,o){e[t]=o}function vc(e){let t=e.observedAttributes;return t&&!Object.prototype.hasOwnProperty.call(e,"observedAttributes")&&(t=e.observedAttributes?.slice(0)),e.observedAttributes=t||[]}function jo(e,t,o){let r=o;return r===null||typeof r>"u"?r=null:typeof r=="boolean"&&(r=r?"":null),r===null?e.removeAttribute(t):e.setAttribute(t,String(r)),r}function wc(e,t,o){Object.prototype.hasOwnProperty.call(e,Vt)||(e[Vt]={...e[Vt]}),e[Vt]&&(e[Vt][t]=o)}function x(e,t){return o=>{t?.observe!==!1&&vc(o).push(e),t?.parse&&wc(o,e,t.parse);let r=(n,i=Object.getOwnPropertyDescriptor(n,e))=>{let a=`$$${e}`;i&&Object.defineProperty(n,a,i);let c=t?.persist,l={enumerable:!0,configurable:!1,get(){return this[a]},set(h){this[a]!==h?(this[a]=h,c?.(this,e,h),this[de].attributes$.next({target:this,attribute:e,value:h})):i?.set&&(c?.(this,e,h),this[a]=h)}},f=h=>{if(i||(h[a]=h[e]),Object.defineProperty(h,e,l),c?.(h,e,h[e]),t?.render){let b=t.render(h);b&&hs(h,b)}};return f[gs]=h=>{let b=h;for(;b!==n;){let E=Object.getOwnPropertyDescriptor(b,e);if(E)return r(h,E);b=Object.getPrototypeOf(b)}return f},f};xs(o,r(o.prototype))}}function y(e){return x(e,{persist:jo,observe:!0})}function kc(e,t,o){return new z(r=>{function n(i){i.target===e&&e[o]?.call(e,i)}e.addEventListener(t,n),r.signal.subscribe(()=>e.removeEventListener(t,n))})}function co(e){let t=`on${e}`;return x(t,{render(o){return p(o,t).switchMap(r=>r?kc(o,e,t):k)},parse(o){return o?new Function("event",o):void 0}})}function H(e){return x(e,{observe:!1})}function hd(){return{...ms}}function w(){return document.createElement("slot")}function Uo(e){return t=>{let[o,r]=e();return t[de].add(o),r}}function Sc(e,t){let o=document.createTextNode("");return e[de].add(t.tap(r=>o.textContent=String(r))),o}var Dn=document.createDocumentFragment();function Wr(e,t,o=e){if(t!=null)if(Array.isArray(t)){for(let r of t)Wr(e,r,Dn);o!==Dn&&o.appendChild(Dn)}else e instanceof g&&t instanceof z?o.appendChild(Sc(e,t)):t instanceof Node?o.appendChild(t):e instanceof g&&typeof t=="function"?Wr(e,t(e),o):o.appendChild(document.createTextNode(String(t)))}function In(e,t,o){e[t]=o}function Ec(e){return typeof e=="function"}function ys(e,t){for(let o in t){let r=t[o];if(e instanceof g)if(r instanceof z)e[de].add(o==="$"?r:r.tap(n=>In(e,o,n)));else if(o==="$"&&Ec(r)){let n=r(e);n instanceof z&&e[de].add(n)}else In(e,o,r);else In(e,o,r)}}function Cc(e,t){return e.constructor.observedAttributes?.includes(t)}function vs(e,t){let o=e instanceof g&&Cc(e,t)?B(e,t):Yr(e,[t]).map(()=>e[t]);return d(o,G(()=>F(e[t])))}function O(e,t,o){return x(e,{parse(r){if(r==="Infinity"||r==="infinity")return 1/0;let n=r===null?void 0:Number(r);return t!==void 0&&(n===void 0||n<t||isNaN(n))&&(n=t),o!==void 0&&n!==void 0&&n>o&&(n=o),n}})}function ne(e,t,o){for(let r=e.parentElement;r;r=r.parentElement)if(r instanceof g&&r[de].message(t,o))return}function fe(e,t,o=!0){let r,n=0,i=new ke,a={type:t,next(c){n?i.next(c):(r??=[]).push(c)},stopPropagation:o};return e[de].addMessageHandler(a),new z(c=>{n===0&&r?.length&&(r.forEach(f=>c.next(f)),r.length=0),n++;let l=i.subscribe(c);c.signal.subscribe(()=>{n--,l.unsubscribe()})})}function ws(e,t,o,r=!0){return fe(e,t,r).tap(n=>{o[de].message(t,n)})}function m(e,t,...o){let r=typeof e=="string"?document.createElement(e):new e;return t&&ys(r,t),o.length&&Wr(r,o),r}function ge(e,t,...o){if(e!==ge&&typeof e=="function"&&!(e.prototype instanceof g))return o.length&&((t??={}).children=o),e(t);let r=e===ge?document.createDocumentFragment():typeof e=="string"?document.createElement(e):new e;return t&&ys(r,t),o.length&&Wr(r,o),r}function ks(e,t){return o=>new z(()=>{o.hasAttribute(e)||o.setAttribute(e,t)})}function po(e,t){return ks(`aria-${e}`,t)}function Kr(e,t){return io(o=>e.setAttribute("aria-"+t,o===!0?"true":o===!1?"false":o.toString()))}function kd(e){return io(t=>e.setAttribute("aria-checked",t===void 0?"mixed":t?"true":"false"))}function S(e){return ks("role",e)}function Ss(e,t){return Re(t).tap(o=>{e.setAttribute("aria-describedby",o)}).finalize(()=>e.removeAttribute("aria-describedby"))}function Es(e,t){return e.ariaLabel||e.getAttribute("aria-labelledby")?k:t.tap(o=>e.ariaLabel=o)}var Cs=0;function dt(e){return e.id||=`cxl__${Cs++}`}function Re(e){return vs(e,"id").map(t=>(t||(e.id=`cxl__${Cs++}`),e.id))}function Gr(e,t){return P(...t.map(o=>Re(o))).tap(o=>{e.setAttribute("aria-controls",o.join(" "))})}var Nc=["xsmall","small","medium","large","xlarge","xxlarge"],Z=u(":host{display:contents}"),Is=u(":host{position:absolute;display:block;width:0;height:0;overflow:hidden}"),Pn=[-2,-1,0,1,2,3,4,5],Jr=["display-large","display-medium","display-small","body-large","body-medium","body-small","label-large","label-medium","label-small","headline-large","headline-medium","headline-small","title-large","title-medium","title-small","code"],uo=Oo(),Zr=pe(""),Y=u(`:host([disabled]) {
	cursor: default;
	pointer-events: var(--cxl-override-pointer-events, none);
}`),Qr=`
	box-sizing: border-box;
	position: relative;
	display: flex;
	padding: 4px 16px;
	min-height: 56px;
	align-items: center;
	column-gap: 16px;
	${N("body-medium")}
`,Ac=(()=>{for(let e of Array.from(document.fonts.keys()))if(e.family==="Roboto")return!0;return!1})(),zs={primary:"#186584","on-primary":"#FFFFFF","primary-container":"#C1E8FF","on-primary-container":"#004D67",secondary:"#4E616C","on-secondary":"#FFFFFF","secondary-container":"#D1E6F3","on-secondary-container":"#364954",tertiary:"#5F5A7D","on-tertiary":"#FFFFFF","tertiary-container":"#E5DEFF","on-tertiary-container":"#474364",error:"#BA1A1A","on-error":"#FFFFFF","error-container":"#FFDAD6","on-error-container":"#93000A",background:"#F6FAFE","on-background":"#171C1F",surface:"#F6FAFE","on-surface":"#171C1F","surface-variant":"#DCE3E9","on-surface-variant":"#40484D",outline:"#71787D","outline-variant":"#C0C7CD",scrim:"rgb(29 27 32 / 0.5)","inverse-surface":"#2C3134","on-inverse-surface":"#EDF1F5","inverse-primary":"#8ECFF2","primary-fixed":"#C1E8FF","on-primary-fixed":"#001E2B","primary-fixed-dim":"#8ECFF2","on-primary-fixed-variant":"#004D67","secondary-fixed":"#D1E6F3","on-secondary-fixed":"#091E28","secondary-fixed-dim":"#B5C9D7","on-secondary-fixed-variant":"#364954","tertiary-fixed":"#E5DEFF","on-tertiary-fixed":"#1B1736","tertiary-fixed-dim":"#C9C2EA","on-tertiary-fixed-variant":"#474364","surface-dim":"#D6DADE","surface-bright":"#F6FAFE","surface-container-lowest":"#FFFFFF","surface-container-low":"#F0F4F8","surface-container":"#EAEEF2","surface-container-high":"#E5E9ED","surface-container-highest":"#DFE3E7",warning:"#DD2C00","on-warning":"#FFFFFF","warning-container":"#FFF4E5","on-warning-container":"#8C1D18",success:"#2E7D32","on-success":"#FFFFFF","success-container":"#81C784","on-success-container":"#000000"};function $r(e=""){return`
:host ${e} {
	${te("surface-container")}
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
		`}function Fs(e=zs){return Object.entries(e).map(([t,o])=>`--cxl-color--${t}:${o};--cxl-color-${t}:var(--cxl-color--${t});`).join("")}var re={name:"",animation:{flash:{kf:{opacity:[1,0,1,0,1]},options:{easing:"ease-in"}},spin:{kf:{rotate:["0deg","360deg"]}},pulse:{kf:{rotate:["0deg","360deg"]},options:{easing:"steps(8)"}},openY:{kf:e=>({height:["0",`${e.scrollHeight}px`]})},closeY:{kf:e=>({height:[`${e.scrollHeight}px`,"0"]})},expand:{kf:{scale:[0,1]}},expandX:{kf:{scale:["0 1","1 1"]}},expandY:{kf:{scale:["1 0","1 1"]}},zoomIn:{kf:{scale:[.3,1]}},zoomOut:{kf:{scale:[1,.3]}},scaleUp:{kf:{scale:[1,1.25]}},fadeIn:{kf:[{opacity:0},{opacity:1}]},fadeOut:{kf:[{opacity:1},{opacity:0}]},shakeX:{kf:{translate:["0","-10px","10px","-10px","10px","-10px","10px","-10px","10px","0"]}},shakeY:{kf:{translate:["0","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0 -10px","0 10px","0"]}},slideOutLeft:{kf:{translate:["0","-100% 0"]}},slideInLeft:{kf:{translate:["-100% 0","0"]}},slideOutRight:{kf:{translate:["0","100% 0"]}},slideInRight:{kf:{translate:["100% 0","0"]}},slideInUp:{kf:{translate:["0 100%","0"]}},slideInDown:{kf:{translate:["0 -100%","0"]}},slideOutUp:{kf:{translate:["0","0 -100%"]}},slideOutDown:{kf:{translate:["0","0 100%"]}},focus:{kf:[{offset:.1,filter:"brightness(150%)"},{filter:"brightness(100%)"}],options:{duration:500}}},easing:{emphasized:"cubic-bezier(0.2, 0.0, 0, 1.0)",emphasized_accelerate:"cubic-bezier(0.05, 0.7, 0.1, 1.0)",emphasized_decelerate:"cubic-bezier(0.3, 0.0, 0.8, 0.15)",standard:"cubic-bezier(0.2, 0.0, 0, 1.0)",standard_accelerate:"cubic-bezier(0, 0, 0, 1)",standard_decelerate:"cubic-bezier(0.3, 0, 1, 1)"},breakpoints:{xsmall:0,small:600,medium:905,large:1240,xlarge:1920,xxlarge:2560},disableAnimations:!1,prefersReducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches,colors:zs,imports:Ac?void 0:["https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap"],globalCss:`:root{
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
}`};function je(e=""){return`:host ${e} {
--cxl-mask-hover: color-mix(in srgb, var(--cxl-color-on-surface) 8%, transparent);
--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
--cxl-mask-active: linear-gradient(0, var(--cxl-color-surface-container),var(--cxl-color-surface-container));
}
:host(:hover) ${e} { background-image: linear-gradient(0, var(--cxl-mask-hover),var(--cxl-mask-hover)); }
:host(:focus-visible) ${e} { background-image: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus)) }
:host{-webkit-tap-highlight-color: transparent}
`}function Ls(e){return`box-shadow:var(--cxl-elevation-${e});z-index:${e};`}var kt=u(je()),Ps={"./theme-dark.js":()=>import("./theme-dark-F4QQQFSI.js")},ft=[0,4,8,"12",16,24,32,48,64],wt,Ns,Mc;function U(e,t){return e==="xsmall"?`@media(max-width:${re.breakpoints.small}px){${t}}`:`@media(min-width:${re.breakpoints[e]}px){${t}}`}function fo(e){return d(Vo(async()=>e.getBoundingClientRect().width),ue(e).map(t=>t.contentRect.width)).map(t=>{let o=re.breakpoints,r="xsmall";for(let n of Nc){if(o[n]>t)return r;r=n}return r}).distinctUntilChanged()}function Tc(e=""){return Object.entries(Hs).map(([t,o])=>`:host([color=${t}]) ${e}{ ${o} }`).join("")}function le(e,t,o=""){return Rs(e,`
		${t?`:host ${o} { ${Hs[t]} }`:""}
		:host${t?"":"([color])"} ${o} {
			color: var(--cxl-color-on-surface);
			background-color: var(--cxl-color-surface);
		}
		:host([color=transparent]) ${o}{
			color: inherit;
			background-color: transparent;
		}
		${Tc(o)}
	`)}function Rs(e,t){let o=u(t);return x(e,{persist:jo,render:r=>o(r)})}function ce(e,t){return Rs(e,Pn.map(o=>{let r=t(o);return o===0?`:host{--cxl-size:${o}}:host ${r}`:`:host([size="${o}"]){--cxl-size:${o}}:host([size="${o}"]) ${r}`}).join(""))}function Vs(){let e=wt?document.adoptedStyleSheets.indexOf(wt):-1;e!==-1&&document.adoptedStyleSheets.splice(e,1)}function Dc(e){wt&&Vs();let t=e.globalCss??"";e.colors&&(t+=`:root{${Fs(e.colors)}}`),t?(wt=$e(t),document.adoptedStyleSheets.push(wt)):wt=void 0,uo.next({theme:e,stylesheet:wt,css:t}),Zr.next(e.name)}var As="";function Ms(e){Dc(e.default)}function Os(e){e?e!==As&&(typeof e=="string"?import(e).then(Ms,t=>console.error(t)):e().then(Ms,t=>console.error(t))):wt&&(Vs(),uo.next(void 0),Zr.next("")),As=e}function Ic(e){let t;return uo.tap(o=>{let r=o?.theme.override?.[e.tagName];r?t?t.replace(r).catch(n=>console.error(n)):e.shadowRoot?.adoptedStyleSheets.push(t??=$e(r)):t&&t.replaceSync("")})}function $e(e){let t=new CSSStyleSheet;return e&&t.replaceSync(e),t}function en(e,t=""){let o=$e(t);return A(e).adoptedStyleSheets.push(o),o}function u(e){let t;return o=>{let r=A(o);if(r.adoptedStyleSheets.push(t??=$e(e)),!o[qr])return re.css&&r.adoptedStyleSheets.unshift(Mc??=$e(re.css)),o[qr]=!0,Ic(o)}}var Rn=["background","primary","primary-container","primary-fixed-dim","primary-fixed","secondary","secondary-container","tertiary","tertiary-container","surface","surface-container","surface-container-low","surface-container-lowest","surface-container-highest","surface-container-high","error","error-container","success","success-container","warning","warning-container","inverse-surface","inverse-primary"],Bs=[...Rn,"inherit"];function Fn(e,t="surface"){return`--cxl-color-${t}: var(--cxl-color--${e});
--cxl-color-on-${t}: var(--cxl-color--on-${e}, var(--cxl-color--on-surface));
--cxl-color-surface-variant: var(--cxl-color--${e==="surface"?"surface-variant":e});
--cxl-color-on-surface-variant: ${e.includes("surface")?"var(--cxl-color--on-surface-variant)":`color-mix(in srgb, var(--cxl-color--on-${e}) 80%, transparent)`};
`}function Td(e,t,o="transparent"){return`color-mix(in srgb, var(--cxl-color-${e}) ${t}%,${o})`}function te(e){return`${Fn(e)};background-color:var(--cxl-color-surface);color:var(--cxl-color-on-surface);`}function zc(){let e={inherit:"color:inherit;background-color:inherit;",transparent:"color:inherit;background-color:transparent;"};for(let t of Rn)e[t]=`
${Fn(t)}
${t==="inverse-surface"?Fn("inverse-primary","primary"):""}
`;return e}var Hs=zc(),Ys=(e="")=>`${e?`:host(${e})`:":host"} { 
	--cxl-color-surface: transparent; 
	border-style: solid; 
	border-color: var(--cxl-color-on-surface); 
	border-width: 1px; 
	box-shadow: none;
}
${Rn.map(t=>`:host(${e}[color=${t}]) { --cxl-color-on-surface: var(--cxl-color--${t}); }`).join("")}
`;function mo(e=":host"){return`
		${e} {
			scrollbar-color: var(--cxl-color-outline-variant) var(--cxl-color-surface, transparent);
		}
		${e}::-webkit-scrollbar-track {
			background-color: var(--cxl-color-surface, transparent);
		}
	`}function N(e){return`font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e});`}function Dd(){cancelAnimationFrame(js)}var js=requestAnimationFrame(()=>Rc()),Us={},Ts=document.createElement("template"),Ds={};function Fc(e){return function(t){let o=e(t),r=Ds[o];if(r){let a=r.cloneNode(!0);if(a instanceof SVGSVGElement)return a}let n=document.createElementNS("http://www.w3.org/2000/svg","svg"),i=()=>(n.dispatchEvent(new ErrorEvent("error")),"");return fetch(o).then(a=>a.ok?a.text():i(),i).then(a=>{if(!a)return;Ts.innerHTML=a;let c=Ts.content.children[0];if(!(c instanceof SVGSVGElement))return;let l=c.getAttribute("viewBox");l?n.setAttribute("viewBox",l):c.hasAttribute("width")&&c.hasAttribute("height")&&n.setAttribute("viewBox",`0 0 ${c.getAttribute("width")} ${c.getAttribute("height")}`);for(let f of c.childNodes)n.append(f);Ds[t.name]=n}).catch(a=>console.error(a)),n.setAttribute("fill","currentColor"),n}}var Lc=Fc(({name:e,width:t,fill:o})=>(t!==20&&t!==24&&t!==40&&t!==48&&(t=48),`https://cdn.jsdelivr.net/gh/google/material-design-icons@941fa95/symbols/web/${e}/materialsymbolsoutlined/${e}_${o?"fill1_":""}${t}px.svg`)),_s=Lc;function Id(e){_s=e}function zd(e){Us[e.id]=e}function go(e,t={}){let{width:o,height:r}=t;o===void 0&&r===void 0&&(o=r=24);let n=Us[e]?.icon()??_s({name:e,width:o,fill:t.fill});return t.className&&n.setAttribute("class",t.className),o&&(n.setAttribute("width",`${o}`),r===void 0&&n.setAttribute("height",`${o}`)),r&&(n.setAttribute("height",`${r}`),o===void 0&&n.setAttribute("width",`${r}`)),t.alt&&n.setAttribute("alt",t.alt),n}var Ln,Pc=new Promise(e=>{Ln=()=>{uo.next(void 0),e()}});function Rc(e){cancelAnimationFrame(js),Ns||(e&&(e.colors&&(re.colors=e.colors),e.globalCss&&(re.globalCss+=e.globalCss)),document.adoptedStyleSheets.push(Ns=$e(`html{${Fs(re.colors)}}${re.globalCss}`)),re.imports?Promise.allSettled(re.imports.map(t=>{let o=document.createElement("link");return o.rel="stylesheet",o.href=t,document.head.append(o),new Promise((r,n)=>(o.onload=r,o.onerror=n))})).then(Ln,t=>console.error(t)):Ln())}function St(){return Vo(async()=>{await Pc,await document.fonts.ready})}var Vn=class extends g{type;details};s(Vn,{tagName:"c-action",init:[x("type"),x("details")],augment:[Z,w,e=>R(e).tap(()=>{e.type&&ne(e,e.type,e.details)})]});function Vc(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.controller??t.target}function Oc(e,t){if(t.id!==e)throw new Error("Invalid registable event");return t.target}function Se(e,t,o){return new z(r=>{let n={id:e,controller:o,target:t};pt().subscribe({next:()=>ne(t,`registable.${e}`,n),signal:r.signal}),r.signal.subscribe(()=>n.unsubscribe?.())})}function xo(e,t,o,r){return new z(n=>{function i(c){let l=Oc(e,c);c.unsubscribe=()=>{let E=o.indexOf(l);E!==-1&&o.splice(E,1),r?.({type:"disconnect",target:l,elements:o}),n.next()};let f=o.indexOf(l);f!==-1&&o.splice(f,1);let h=0,b=o.length;for(;h<b;){let E=h+b>>1,T=o[E];if(!T)break;T.compareDocumentPosition(l)&Node.DOCUMENT_POSITION_FOLLOWING?h=E+1:b=E}o.splice(h,0,l),r?.({type:"connect",target:l,elements:o}),n.next()}let a=fe(t,`registable.${e}`).subscribe(i);n.signal.subscribe(a.unsubscribe)})}function et(e,t,o=new Set){let r=ps();return d(fe(t,`registable.${e}`).map(n=>{let i=n.target,a=Vc(e,n);return n.unsubscribe=()=>{o.delete(a),r.next({type:"disconnect",target:a,element:i,elements:o})},o.add(a),{type:"connect",target:a,element:i,elements:o}}),r)}function On(e){return e in re.animation}function Ee({target:e,animation:t,options:o}){if(re.disableAnimations)return e.animate(null);if(typeof t=="string"&&!(t in re.animation))throw new Error(`Animation "${t}" not defined`);let r=typeof t=="string"?re.animation[t]:t,n=typeof r.kf=="function"?r.kf(e):r.kf,i={duration:250,easing:re.easing.emphasized,...r.options,...o,...re.prefersReducedMotion?{duration:0}:void 0};return e.animate(n,i)}function _o(e){let{trigger:t,stagger:o,commit:r,keep:n}=e;function i(c){return new z(l=>{let f=Ee(c);f.ready.then(()=>l.next({type:"start",animation:f}),h=>{console.error(h)}),f.addEventListener("finish",()=>{l.next({type:"end",animation:f}),r&&f.commitStyles(),!(n||n!==!1&&c.options?.fill&&(c.options.fill==="both"||c.options.fill==="forwards"))&&l.complete()}),l.signal.subscribe(()=>{try{f.cancel()}catch{}})})}let a=Array.isArray(e.target)?e.target:e.target instanceof Element?[e.target]:Array.from(e.target);return d(...a.map((c,l)=>{let f={...e.options,delay:o!==void 0?(e.options?.delay??0)+l*o:e.options?.delay};return(t==="visible"?_r(c).filter(b=>b):t==="hover"?vt(c):F(!0)).switchMap(b=>b?i({...e,options:f,target:c}):k)}))}var Et;function Xs(e){if(e==="0s"||e==="auto")return;let t=e.endsWith("ms")?1:1e3;return parseFloat(e)*t}function Bc(e){return e==="infinite"?1/0:+e}function Hc(e){if(On(e))return{animation:e};let t=e.startsWith("auto ");t&&(e="0s "+e.slice(5));let o={},r;e=e.replace(/stagger:(\d+)|composition:(\w+)/g,(f,h,b)=>(h&&(r=+h),(b==="replace"||b==="add"||b==="accumulate")&&(o.composite=b),"")),Et??=document.createElement("style").style,Et.animation=e;let n=Et.animationFillMode;(n==="none"||n==="forwards"||n==="backwards"||n==="both")&&(o.fill=n);let i=o.fill==="forwards"||o.fill==="both",a=t?void 0:Xs(Et.animationDuration);a!==void 0&&(o.duration=a);let c=Xs(Et.animationDelay);c!==void 0&&(o.delay=c),Et.animationIterationCount&&(o.iterations=Bc(Et.animationIterationCount));let l=Et.animationName;if(!On(l))throw new Error(`Animation "${l}" not defined`);return{animation:l,keep:i,stagger:r,options:o}}function Yc(e){return typeof e=="string"&&(e=e.split(",").map(t=>Hc(t.trim()))),e}function Xo(e,t,o,r){let n=r?`motion-${r}-on`:"motion-on",i=Yc(o);return e.setAttribute(n,""),d(...i.map(a=>_o({target:t,...a}))).finalize(()=>e.removeAttribute(n))}var ho=u(":host(:not([open],[motion-out-on])){display:none}");function mt(e,t=()=>e,o=!1){let r=G(()=>F(t("in"))),n=G(()=>F(t("out"))),i=G(()=>e.duration!==void 0&&e.duration!==1/0?Ye(e.duration).map(()=>e.open=!1):k).log();return d(fe(e,"toggle.close").tap(()=>e.open=!1).ignoreElements(),P(p(e,"motion-in").map(a=>(a?r.mergeMap(c=>Xo(e,c,a,"in")):r).mergeMap(()=>i)),p(e,"motion-out").map(a=>(a?n.switchMap(c=>Xo(e,c,a,"out")):n).finalize(()=>{e.open||e.dispatchEvent(new Event("close"))}))).switchMap(([a,c])=>B(e,"open").switchMap(l=>{if(e.popover!=="auto"){let f=l?"open":"closed";e.dispatchEvent(new ToggleEvent("toggle",{oldState:l?"closed":"open",newState:f}))}return l?o?He(c,a):a:o?He(c,a):c})))}var tt=class extends g{open=!1;duration;"motion-in";"motion-out"};s(tt,{init:[x("motion-in"),x("motion-out"),O("duration"),y("open")]});var Wo=class extends tt{};s(Wo,{tagName:"c-toggle-target",augment:[u(`
:host{display:contents}
`),e=>{let t=m("slot"),o=m("slot",{name:"off"});return(e.open?o:t).style.display="none",A(e).append(t,o),mt(e,r=>{t.style.display=o.style.display="none";let n=e.open?r==="in"?t:o:r==="in"?o:t;return n.style.display="",n.assignedElements()},!0)}]});var Bn={get(e){try{return localStorage.getItem(e)??void 0}catch(t){console.error(t)}return""},set(e,t){try{localStorage.setItem(e,t)}catch(o){console.error(o)}}};function rf(e){return(t,o)=>t[e]>o[e]?1:t[e]<o[e]?-1:0}function gt(e,t){if(t==="_parent")return e.parentElement||void 0;if(t==="_next")return e.nextElementSibling||void 0;if(typeof t!="string")return t??void 0;let o,r=e.getRootNode();return r instanceof ShadowRoot&&(o=r.getElementById(t),o)?o:e.ownerDocument.getElementById(t)??void 0}function bo(e,t){return p(e,t).map(o=>typeof o=="string"?gt(e,o):o instanceof HTMLElement?o:void 0)}async function nf(e,...[t]){try{return e instanceof Response?await e.json():JSON.parse(Ws(e))}catch{if(t!==void 0)return t;throw t}}function af(e,...[t]){try{return JSON.parse(Ws(e))}catch{if(t!==void 0)return t;throw t}}function Ws(e,t){return e?typeof e=="string"?e:new TextDecoder(t).decode(e):""}var Ue=class extends g{};s(Ue,{tagName:"c-span"});var Hn=class{currentPopupContainer;currentPopup;currentModal;currentTooltip;popupContainer=document.body;toggle(t){t.element.parentElement!==this.popupContainer?this.popupOpened(t):t.close()}popupOpened(t){this.currentPopup&&t.element!==this.currentPopup.element&&this.currentPopup.close(),this.currentPopup=t}openModal(t){this.currentModal&&t.element!==this.currentModal.element&&this.currentModal.close(),t.element.parentNode||this.popupContainer.append(t.element),t.element.open||t.element.showModal(),this.currentModal=t}closeModal(){this.currentModal?.close(),this.modalClosed()}modalClosed(){this.currentModal=void 0}tooltipOpened(t){this.currentTooltip&&this.currentTooltip!==t&&this.currentTooltip.remove(),this.currentTooltip=t}close(){this.currentPopup?.close()}},ie=new Hn;function jc(e){return e instanceof g}var on=(e,t,o=e)=>R(e).tap(()=>ne(o,"toggle.close",t)),yf=(e,t,o=e)=>R(e).tap(()=>ne(o,"toggle.open",t));function tn(e){let t=e.target;if(t)return typeof t=="string"?t.split(" ").flatMap(o=>{let r=gt(e,o);return r?[r]:[]}):Array.isArray(t)?t:[t]}function jn(e,t,o,r,n=v(e,"click").map(()=>!o())){return d(r,n).switchMap(i=>{let a=t();return a?Ze(a.map(c=>({target:c,open:i}))):k})}function Ot(e,t=e){function o(i,a){return[p(e,"open").switchMap(c=>(i.parentNode||ie.popupContainer.append(i),i.open=c,c&&jc(i)?B(i,"open").map(l=>{e.open&&l===!1&&(e.open=!1)}):k)),Re(i).tap(c=>{let l=i.getAttribute("role");(l==="menu"||l==="listbox"||l==="tree"||l==="grid"||l==="dialog")&&(a.ariaHasPopup=l),a.getRootNode()===i.getRootNode()&&a.setAttribute("aria-controls",c)})]}let r=P(p(e,"trigger"),p(e,"target")).switchMap(([i])=>{let a=tn(e),c=a?d(...a.flatMap(l=>o(l,e))).ignoreElements():k;return d(i==="hover"?P(Tn(t),a?d(...a.map(l=>Tn(l))):k).map(l=>!!l.find(f=>!!f)).debounceTime(250):i==="checked"?v(t,"change").map(l=>l.target&&"checked"in l.target?!!l.target.checked:!1):v(t,"click").map(l=>(l.stopPropagation(),!e.open)),c)}),n;return ds().switchMap(()=>jn(t,()=>tn(e),()=>e.open,p(e,"open"),r).filter(i=>{let{open:a,target:c}=i;if(e.open!==a){if(a){let l=Rt(e)?.activeElement;n=l instanceof HTMLElement?l:void 0,c.trigger=e}else if(c.trigger&&c.trigger!==e)return i.open=!0,c.trigger=e,!0;return e.open=a,!1}if(!a&&c.trigger===e){let l=document.activeElement;(l===document.body||l===document.documentElement)&&n?.focus()}return!0}))}var Ct=class extends g{open=!1;target;trigger};s(Ct,{init:[x("target"),x("trigger"),y("open")],augment:[e=>Ot(e).raf(({target:t,open:o})=>t.open=o)]});var Yn=class extends Ct{};s(Yn,{tagName:"c-toggle",augment:[Z,w]});var Bt=class extends tt{};s(Bt,{tagName:"c-details",augment:[u(`
:host { display: block; }
:host(:not([open],[motion-out-on])) #body {display:none}
		`),e=>{let t=m("slot",{id:"body"}),o=m("slot",{id:"header",name:"header"});return A(e).append(o,t),d(jn(o,()=>[e],()=>e.open,p(e,"open")).raf(({open:r})=>{e.open=r}),mt(e,()=>t))}]});var Un=class extends g{panels=new Set};s(Un,{tagName:"c-accordion",augment:[e=>et("accordion",e,e.panels),e=>v(e,"toggle",{capture:!0}).tap(t=>{let o=t.target;if(o instanceof Bt&&o.open&&e.panels.has(o))for(let r of e.panels)r!==o&&(r.open=!1)})]});var ve=class extends g{name="";width;height;alt;fill=!1};s(ve,{tagName:"c-icon",init:[x("name"),x("width"),x("height"),x("fill"),x("alt")],augment:[S("none"),u(`
		:host {
			display: inline-block;
			width: 24px;
			height: 24px;
			flex-shrink: 0;
			vertical-align: middle;
		}
		.icon { width: 100%; height: 100% }
		`),e=>{let t=new CSSStyleSheet,o;return e.shadowRoot?.adoptedStyleSheets.push(t),ao(e).switchMap(()=>lo(e)).debounceTime(0).tap(()=>{let r=e.width??e.height,n=e.height??e.width;if(t.replace(`:host{${r===void 0?"":`width:${r}px;`}${n===void 0?"":`height:${n}px`}}`).catch(i=>{}),o?.remove(),o=e.name?go(e.name,{className:"icon",width:r,height:n,fill:e.fill,alt:e.alt}):void 0,o){let i=o;i.onerror=()=>{e.alt&&i.replaceWith(e.alt)},A(e).append(i)}})}]});function Ht(e){return p(e,"disabled").tap(t=>t?e.setAttribute("aria-disabled","true"):e.removeAttribute("aria-disabled"))}function Uc(e,t=e,o=0){let r=t.hasAttribute("tabindex")?t.tabIndex:o;return Ht(e).tap(n=>{n?t.removeAttribute("tabindex"):t.tabIndex=r})}function qo(e,t=e){return d(v(t,"focusout").tap(()=>e.touched=!0),d(B(e,"disabled"),B(e,"touched")).tap(()=>ne(e,"focusable.change")))}function xe(e,t=e,o=0){return d(Uc(e,t,o),qo(e,t))}function qs(e,t,o=e.getBoundingClientRect()){let r=o.width>o.height?o.width:o.height,n=new rn,i=e.shadowRoot||e,a=t instanceof MouseEvent?t.x:1/0,c=t instanceof MouseEvent?t.y:1/0,l=!t||Yo(t),f=a>o.right||a<o.left||c>o.bottom||c<o.top;return n.x=l||f?o.width/2:a-o.left,n.y=l||f?o.height/2:c-o.top,n.radius=r,t||(n.duration=0),i.prepend(n),n}function Ks(e,t=e){let o,r,n,i=()=>{o=qs(t,r instanceof Event?r:void 0,n),o.duration=600,r=void 0};return d(v(e,"click").tap(a=>{r=a,n=t.getBoundingClientRect()}),p(e,"selected").raf().switchMap(()=>{if(e.selected){if(!o?.parentNode){if(!e.checkVisibility())return r=void 0,ao(e).tap(i);i()}}else o&&Gs(o).catch(a=>console.error(a));return k})).ignoreElements()}function Gs(e){return new Promise(t=>{Ee({target:e,animation:"fadeOut"}).addEventListener("finish",()=>{e.remove(),t()})})}function he(e,t=e){let o=!1,r=0;return d(v(t,"pointerdown"),v(t,"click")).tap(n=>n.cxlRipple??=e).raf().mergeMap(n=>{if(n.cxlRipple===e&&!o&&!e.disabled&&e.parentNode){r=Date.now(),o=!0,e.style.setProperty("--cxl-mask-hover","none");let i=qs(e,n),a=i.duration,c=()=>{e.style.removeProperty("--cxl-mask-hover"),Gs(i).catch(()=>{}).finally(()=>{o=!1})};return n.type==="click"?Ye(a).tap(c):d(v(document,"pointerup"),v(document,"pointercancel")).first().map(()=>{let l=Date.now()-r;setTimeout(()=>c(),l>a?32:a-l)})}return k})}var rn=class extends g{x=0;y=0;radius=0;duration=500};s(rn,{tagName:"c-ripple",init:[x("x"),x("y"),x("radius")],augment:[u(`
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
}`),e=>{let t=document.createElement("div");return t.className="ripple",ee(()=>{let o=t.style;o.translate=`${e.x-e.radius}px ${e.y-e.radius}px`,o.width=o.height=e.radius*2+"px",t.parentNode||A(e).append(t),Ee({target:t,animation:"expand",options:{duration:e.duration}}),Ee({target:t,animation:"fadeIn",options:{duration:e.duration/2}})})}]});var Yt=[Y,kt,u(`
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
}`)],_c=u(`
:host {
	${N("label-large")}
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
`);function _n(e){return p(e,"disabled").switchMap(t=>t?k:jr(e).tap(o=>{o.stopPropagation(),e.click()}))}function Ie(e){return d(_n(e),xe(e))}var yo=class extends g{disabled=!1;touched=!1};s(yo,{init:[y("disabled"),y("touched")],augment:[S("button"),Ie]});var ot=class extends yo{size;color;variant};s(ot,{tagName:"c-button",init:[ce("size",e=>`{
			font-size: ${14+e*4}px;
			min-height: ${40+e*8}px;
			padding-right: ${16+e*4}px;
			padding-left: ${16+e*4}px;
		}`),le("color","primary"),y("variant")],augment:[...Yt,_c,he,w]});var Ko=class extends Bt{constructor(){super(),this["motion-in"]="openY",this["motion-out"]="closeY"}};s(Ko,{tagName:"c-accordion-panel",augment:[S("region"),u(`
:host {
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	border-bottom: 1px solid var(--cxl-color-outline-variant);
}
#body {
	display: block;
	overflow: hidden;
}
		`),e=>Se("accordion",e)]});var Xn=class extends g{disabled=!1;touched=!1};s(Xn,{tagName:"c-accordion-header",init:[y("disabled")],augment:[S("button"),u(`
:host {
	${N("title-small")}
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
		`),Y,e=>{let t=new ve;t.name="keyboard_arrow_down",t.id="icon",t.role="none",e.slot||="header",A(e).append(t,document.createElement("slot"));let o=e.parentElement;return o instanceof Ko?d(Re(o).tap(r=>e.setAttribute("aria-controls",r)),p(o,"open").tap(r=>{t.classList.toggle("open",r),e.ariaExpanded=String(r)})):k},Ie]});var jt=class extends g{outline=!1;color};s(jt,{tagName:"c-alert",init:[y("outline"),le("color","inverse-surface")],augment:[S("alert"),u(`
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
	${N("body-medium")}
}
	${Ys("[outline]")}`),w]});function Xc(e){if("message"in e&&typeof e.message=="string")return e.message;if("error"in e&&typeof e.error=="string")return e.error;if("status"in e&&typeof e.status=="number")return`HTTP ${e.status}${"statusText"in e&&typeof e.statusText=="string"&&e.statusText?` ${e.statusText}`:""}`;if("toString"in e&&typeof e.toString=="function"&&e.toString!==Object.prototype.toString)return e.toString();if(Object.keys(e).length===0)return"Unknown Error"}function Wc(e){if(e==null)return"Unknown Error";if(typeof e=="string")return e||"Unknown Error";if(e instanceof Response)return`HTTP ${e.status} ${e.statusText}`;if(e instanceof Error)return e.message||"Unknown Error";if(typeof e=="object"){let t=Xc(e);if(t)return t}if(typeof e=="symbol"||typeof e=="function")return String(e);try{return JSON.stringify(e)||"Unknown Error"}catch{return String(e)||"Unknown Error"}}var Wn=class extends jt{color="error";error};s(Wn,{tagName:"c-alert-error",init:[H("error")],augment:[e=>p(e,"error").tap(t=>{e.textContent=Wc(t)})]});var qn=[u(`
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
	${N("title-large")}
}
:host([size=medium]) {
	height: 112px;
	padding: 20px 16px 24px 16px;
	${N("headline-small")}
	flex-wrap: wrap;
}
:host([size=medium]) slot[name=title],:host([size=large]) slot[name=title]  { width: 100%; display: block; margin-top:auto; }
:host([size=large]) {
	height: 152px; padding: 20px 16px 28px 16px;
	${N("headline-medium")}
	flex-wrap: wrap;
}`),w,()=>m("slot",{name:"title"})];function qc(e){return e.tagName==="C-APPBAR-CONTEXTUAL"}var Go=class extends g{size;sticky=!1;contextual};s(Go,{tagName:"c-appbar",init:[y("size"),y("sticky"),y("contextual")],augment:[u(`
:host { z-index: 2; width:100%; }
:host([sticky]) { position: sticky; top: -1px; }
:host([scroll]) {
 	transition: background-color var(--cxl-speed);
	border-top: 1px solid var(--cxl-color-surface-container); background-color: var(--cxl-color-surface-container)
}
:host([contextual]) { padding: 0; }
:host([contextual]) slot:not([name=contextual]) { display:none; }
		`),...qn,()=>m("slot",{name:"contextual"}),e=>p(e,"sticky").switchMap(t=>t?Ur(e,{threshold:[1]}).tap(o=>e.toggleAttribute("scroll",o.intersectionRatio<1)):k),e=>{let t;return d(Hr(e),p(e,"contextual")).raf().switchMap(()=>{for(let o of e.children)if(qc(o)&&(o.slot="contextual",o.open=o.name===e.contextual,o.open))return t=o,v(o,"close").tap(()=>e.contextual=void 0);return t&&(t.open=!1),t=void 0,k})}]});var Kn=class extends g{};s(Kn,{tagName:"c-appbar-title",augment:[S("heading"),po("level","1"),u(`
:host {
	display: block;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 100%;
}
	`),w]});var Ut=class extends ot{};s(Ut,{tagName:"c-button-round",augment:[u(`
:host { min-width:40px; min-height: 40px; padding: 4px; border-radius: 100%; flex-shrink: 0; }
:host([variant=text]) { margin: -8px; }
:host([variant=text]:not([disabled])) { color: inherit; }
:host(:hover) { box-shadow:none; }
		`)]});var ze=class extends Ut{icon="";width;height;fill=!1;variant="text";alt};s(ze,{tagName:"c-icon-button",init:[x("icon"),x("width"),x("height"),x("alt"),x("fill")],augment:[e=>m(ve,{className:"icon",width:p(e,"width"),height:p(e,"height"),name:p(e,"icon"),fill:p(e,"fill"),alt:p(e,"alt")})]});var Um=1440*60*1e3,Kc=/^\s*(\d{1,2})\s*:\s*(\d{1,2})\s*(?::(\d{1,2})\s*)?([pPaA][mM])?/,Gc=/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;function Jc(e){let t=Kc.exec(e);if(t){let o=new Date,r=+(t[1]??0),n=t[4]?.toLowerCase()==="pm";return o.setHours(n?r+12:r),o.setMinutes(+(t[2]??0)),o}return new Date(NaN)}function Zc(e){let t=new Date(Gc.test(e)?`${e}T00:00`:e);return isNaN(t.getTime())&&(t=Jc(e)),t}function Js(e,t,o){if(t==="relative"){let r=new Date;return e.getFullYear()===r.getFullYear()?e.getDate()===r.getDate()&&e.getMonth()===r.getMonth()?e.toLocaleTimeString(o,{hour:"2-digit",minute:"2-digit",hourCycle:"h24"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit"}):e.toLocaleDateString(o,{month:"2-digit",day:"2-digit",year:"2-digit"})}return e.toLocaleString(o,{dateStyle:t,timeStyle:t})}function Zs(e){let t=e.getFullYear(),o=e.getMonth()+1,r=e.getDate();return t+"-"+(o<10?"0":"")+o+"-"+(r<10?"0":"")+r}function Qs(e){return x(e,{parse:t=>t?Zc(t):void 0})}function $s(e,t,o){return typeof o=="string"?Js(t,o,e):t.toLocaleString(e,o)}var Gn={"core.enable":"Enable","core.disable":"Disable","core.cancel":"Cancel","core.ok":"Ok","core.open":"Open","core.close":"Close","core.of":"of"};function Qc(){try{return new Intl.NumberFormat(navigator.language),navigator.language}catch{return"en-US"}}var Jo={content:Gn,name:"default",localeName:Qc(),currencyCode:"USD",decimalSeparator:1.1.toLocaleString().substring(1,2),weekStart:0,formatDate:(e,t)=>$s(Jo.localeName,e,t)},$c={content:Gn,name:"en",localeName:"en-US",currencyCode:"USD",decimalSeparator:".",weekStart:0,formatDate:(e,t)=>$s("en-US",e,t)};function ep(){let e=pe(Jo),t={default:Jo,en:$c},o={},r=e.map(a=>a.content);async function n(a){let c=a.split("-")[0];if(!c)return Jo;if(!(t[a]??t[c])){let f=o[a]??o[c];f&&await f()}return t[c]||Jo}async function i(a){e.next(await n(a))}return navigator.language&&n(navigator.language).then(a=>e.next(a)).catch(a=>console.error(a)),{content:r,registeredLocales:t,locale:e,setLocale:i,getLocale(a){return a?Vo(()=>n(a)):e},get(a,c){return r.map(l=>l[a]??"")},register(a){t[a.name]=a}}}var j=ep();function el(e){return P(j.locale,p(e,"locale")).switchMap(([t,o])=>o?j.getLocale(o):F(t))}function Nt(e){return Object.assign(Gn,e),j.get}function Jm(e,t){return j.locale.map(o=>o.formatDate(e,t))}function Zm(e){return t=>t?j.locale.map(o=>o.formatDate(t,e)):F("")}function Qm(e,t,o=j.locale){let r=new Date,n=t==="xsmall"?"narrow":t==="small"?"short":"long";return r.setDate(r.getDate()-r.getDay()+e),o.map(i=>i.formatDate(r,{weekday:n}))}var tl=class e extends g{name;size;open=!1;backIcon=m(ze,{icon:"arrow_back",className:"icon",ariaLabel:j.get("core.close"),$:t=>R(t).tap(()=>this.open=!1)});static{s(e,{tagName:"c-appbar-contextual",init:[x("name"),y("open"),y("size")],augment:[t=>t.backIcon,...qn,u(`		
:host {
	display: none;
	flex-grow: 1;
	overflow-x: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
:host([open]) { display: flex }
:host(:dir(rtl)) .icon { scale: -1 1; }
`),t=>B(t,"open").tap(o=>{o||t.dispatchEvent(new Event("close"))})]})}};function ol(e=document){document.documentElement.lang="en";let t=[m("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),m("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),m("meta",{name:"mobile-web-app-capable",content:"yes"}),m("style",void 0,`html{height:100%;}html,body{padding:0;margin:0;min-height:100%;${N("body-large")}}
			:link{color:var(--cxl-color-primary)}
			:visited{color:var(--cxl-color-secondary)}
			`)];return e.head.append(...t),t}function rl(e=2e3){return d(Ye(e),St()).first()}function nl(e){return rl().raf(()=>e.setAttribute("ready",""))}function nn(e){return d(ee(t=>{let o=ol(e.ownerDocument);t.signal.subscribe(()=>o.forEach(r=>r.remove()))}),pt().raf(()=>{let t=e.firstElementChild;t instanceof HTMLTemplateElement&&(e.append(t.content),t.remove())}),rl().switchMap(()=>fo(e).raf(t=>e.setAttribute("breakpoint",t))),nl(e),Zr.raf(t=>t?e.setAttribute("theme",t):e.removeAttribute("theme")))}var Jn=class extends g{connectedCallback(){requestAnimationFrame(()=>ol(this.ownerDocument)),super.connectedCallback()}};s(Jn,{tagName:"c-meta",augment:[()=>nl(document.body)]});function il(e,t,o){o==="in"&&(e.style.display="");let r=e.offsetWidth,n=Ee({target:e,animation:{kf:{[t]:o==="in"?[`-${r}px`,"0"]:["0",`-${r}px`]}}});o==="out"&&(n.onfinish=()=>e.style.display="none")}var Zn=class extends g{sheetstart=!1;sheetend=!1};s(Zn,{tagName:"c-application",init:[y("sheetstart"),y("sheetend")],augment:[u(`
:host {
	display: flex;
	position: absolute;
	inset: 0;
	${te("surface")}
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
${mo()}
	`),nn,e=>fe(e,"toggle.open").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!0)}),e=>fe(e,"toggle.close").tap(t=>{(t==="sheetend"||t==="sheetstart")&&(e[t]=!1)}),e=>{let t=m("slot",{name:"start"}),o=m("slot",{id:"body"}),r=m("slot",{name:"end"}),n=$e("html { overflow: hidden }");return A(e).append(t,o,r),e.sheetstart||(t.style.display="none"),e.sheetend||(r.style.display="none"),ie.popupContainer=e,d(ee(i=>{let a=e.ownerDocument.adoptedStyleSheets;a.push(n),i.signal.subscribe(()=>{let c=a.indexOf(n);c!==-1&&a.splice(c,1)})}),B(e,"sheetstart").tap(i=>il(t,"marginLeft",i?"in":"out")),B(e,"sheetend").tap(i=>il(r,"marginRight",i?"in":"out")))}]});var Qn=class extends g{assertive=!1};s(Qn,{tagName:"c-aria-live",init:[x("assertive")],augment:[Is,w,e=>p(e,"assertive").tap(t=>{e.role=t?"alert":"status",e.ariaLive=t?"assertive":"polite",e.ariaAtomic="true"})]});var tp=/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,op=/^\d{5}(?:[-\s]\d{4})?$/,rp={"validation.invalid":"Invalid value","validation.json":"Invalid JSON value","validation.zipcode":"Please enter a valid zip code","validation.equalTo":"Values do not match","validation.equalToElement":"Values do not match","validation.greaterThanElement":"Values do not match","validation.lessThanElement":"Values do not match","validation.required":"This field is required","validation.nonZero":"Value cannot be zero","validation.email":"Please enter a valid email address","validation.pattern":"Invalid pattern","validation.min":"Invalid value","validation.max":"Invalid value","validation.minlength":"Invalid value","validation.maxlength":"Invalid value","validation.greaterThan":"Invalid value","validation.lessThan":"Invalid value","validation.nonEmpty":"Value must not be empty"},al={required:pp,email:up,json:mp,zipcode:dp,nonZero:lp,nonEmpty:sp},np={pattern:cp,equalToElement:$n(pl),greaterThan:ll,lessThan:cl,greaterThanElement:$n(ll),lessThanElement:$n(cl),min:xp,max:hp,equalTo:pl,maxlength:bp,minlength:yp},ip=Nt(rp);function $n(e){return(t,o)=>{let r=typeof t=="string"?gt(o,t):t;if(!r)throw"Invalid element";return e(r)}}function rt(e,t){return{key:e,valid:t,message:ip(`validation.${e}`,"validation.invalid")}}function ap(e){return e==null||e===""||Array.isArray(e)&&e.length===0}function sp(e){return rt("nonEmpty",!ap(e))}function lp(e){return rt("nonZero",e===""||Number(e)!==0)}function cp(e){let t=typeof e=="string"?e=new RegExp(e):e;return o=>rt("pattern",typeof o=="string"&&(o===""||t.test(o)))}function Zo(e){return e!=null&&e!==""}function pp(e,t){let o=t&&"checked"in t?!!t.checked:!0;return rt("required",o&&Zo(e))}function up(e){return rt("email",typeof e=="string"&&(e===""||tp.test(e)))}function dp(e){return rt("zipcode",typeof e=="string"&&(e===""||op.test(e)))}function fp(e){if(typeof e!="string")return!1;try{return JSON.parse(e),!0}catch{return!1}}function mp(e){return rt("json",fp(e))}function gp(e){return e instanceof HTMLElement&&"value"in e}function Qo(e,t,o){let r=gp(t)?p(t,"value"):t instanceof z?t:F(t);return n=>r.map(i=>rt(e,!Zo(n)||!Zo(i)||o(n,i)))}function sl(e,t){let o=/(\w+)(?:\(([^)]+?)\))?/g,r=[],n;for(;n=o.exec(e);){let i=n[1];if(!i)throw`Invalid rule "${i}"`;if(n[2]){let a=np[i];if(!a)throw`Invalid rule "${i}"`;r.push(a(n[2],t))}else if(i in al){let a=al[i];a&&r.push(a)}else throw`Invalid rule "${i}"`}return r}function ul(e,t){let o=(typeof e=="string"?sl(e,t):e).flatMap(r=>typeof r=="string"?sl(r,t):r);return(r,n)=>o.map(i=>{let a=i(r,n);return a instanceof z?a:a instanceof Promise?Ze(a):F(a)})}function xp(e){return Qo("min",e,(t,o)=>Number(t)>=Number(o))}function ll(e){return Qo("greaterThan",e,(t,o)=>Number(t)>Number(o))}function hp(e){return Qo("max",e,(t,o)=>Number(t)<=Number(o))}function cl(e){return Qo("lessThan",e,(t,o)=>Number(t)<Number(o))}function pl(e){return Qo("equalTo",e,(t,o)=>t===o||typeof t!=typeof o&&String(t)===String(o))}function bp(e){return t=>rt("maxlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length<=+e)}function yp(e){return t=>rt("minlength",!t||(typeof t=="string"||Array.isArray(t))&&t.length>=+e)}function vp(e){return dl(e).tap(()=>e.dispatchEvent(new Event("update",{bubbles:!0})))}function vo(e){return B(e,"value").tap(()=>{e.shadowRoot?.delegatesFocus||Pe(e,"change",{bubbles:!0})})}function dl(e){return d(p(e,"value"),p(e,"checked")).map(()=>{})}var K=class e extends g{static formAssociated=!0;inputValue;autofocus=!1;invalid=!1;disabled=!1;touched=!1;rules;validationResult;name;validMap={};onupdate;defaultValue;static{s(e,{init:[y("autofocus"),y("invalid"),y("disabled"),y("touched"),x("rules"),y("name"),H("validationResult"),co("update")],augment:[t=>(t.defaultValue=t.value,d(Se("form",t),B(t,"invalid").tap(()=>Pe(t,"invalid")),p(t,"invalid").switchMap(o=>{if(o){if(t.setAria("invalid","true"),!t.validationMessage)return j.get("validation.invalid").tap(r=>t.setCustomValidity(r))}else t.setAria("invalid",null);return k}),ee(()=>{t.autofocus&&setTimeout(()=>t.focus(),250)}),p(t,"rules").switchMap(o=>{if(!o)return k;let r=ul(o,t);return dl(t).switchMap(()=>d(...r(t.value,t)).tap(n=>t.setValidity(n))).finalize(()=>t.resetValidity())}),p(t,"value").tap(o=>t.setFormValue(o)),p(t,"validationResult").switchMap(o=>!o||o.valid?k:o.message instanceof z?o.message:o.message===void 0?j.get("validation.invalid"):F(o.message)).tap(o=>{t.setCustomValidity(o)}))),vp]})}get labels(){return se(this).labels}get validity(){return se(this).validity}get validationMessage(){return se(this).validationMessage}reportValidity(){return se(this).reportValidity()}checkValidity(){return se(this).checkValidity()}setCustomValidity(t){let o=!!t,r=t!==this.validationMessage;this.applyValidity(o,t),this.invalid!==o?this.invalid=o:r&&Pe(this,"invalid")}formResetCallback(){this.value=this.defaultValue,this.touched=!1}setAria(t,o){o?this.setAttribute(`aria-${t}`,o):this.removeAttribute(`aria-${t}`)}resetValidity(){for(let t in this.validMap)this.validMap[t]={valid:!0};this.resetInvalid()}resetInvalid(){this.validationResult=void 0,this.applyValidity(!1),this.invalid=!1}setValidity(t){this.validMap[t.key||"invalid"]=t;for(let o in this.validMap){let r=this.validMap[o];if(r&&!r.valid)return this.validationResult=r}this.resetInvalid()}applyValidity(t,o){se(this).setValidity({customError:t},o)}formDisabledCallback(t){this.disabled=t}setFormValue(t){se(this).setFormValue(t==null?null:String(t))}};function wp(e,t){let o,r=t.key;if(r==="ArrowDown"&&e.goDown)o=e.goDown();else if(r==="ArrowRight"&&e.goRight)o=e.goRight();else if(r==="ArrowUp"&&e.goUp)o=e.goUp();else if(r==="ArrowLeft"&&e.goLeft)o=e.goLeft();else if(r==="Home")o=!t.ctrlKey&&e.goFirstColumn?e.goFirstColumn():e.goFirst();else if(r==="End")o=!t.ctrlKey&&e.goLastColumn?e.goLastColumn():e.goLast();else if(e.other)o=e.other(t);else return null;return t.stopPropagation(),o&&t.preventDefault(),o}function xt(e){return v(e.host,"keydown").map(t=>wp(e,t)).filter(t=>!!t)}function kp(e){return new z(t=>{let o=e.focus;e.focus=()=>{o.call(e),t.next()},t.signal.subscribe(()=>e.focus=o)})}function $o({host:e,observe:t,getFocusable:o,getSelected:r,getActive:n=()=>ei(e)}){let i=[];function a(){let c=i.find(l=>!l.disabled&&!l.hidden&&l.checkVisibility());c&&(c.tabIndex=0)}return d(v(e,"focusin").tap(()=>{let c=n(),l=!1;for(let f of i)f.tabIndex=f===c?(l=!0,0):-1;l||a()}),(t??F(!0)).tap(()=>{i=o();let c=i.find(f=>f.tabIndex===0);if(c){for(let f of i)f!==c&&(f.tabIndex=-1);return}let l=r?.();l?l.tabIndex=0:a()}),e instanceof HTMLElement?kp(e).tap(()=>{let c=o();(c.find(f=>f.tabIndex===0)??c.at(0))?.focus()}):k).ignoreElements()}function ei(e){let t=Rt(e)?.activeElement??document.activeElement??void 0;return t instanceof HTMLElement?t:void 0}function er({getFocusable:e,getActive:t}){return(o=1,r,n=i=>!i.checkVisibility())=>{let i=t(),a=e(),c=r??(i?a.indexOf(i):-1),l;do l=a.at(c+=o);while(l&&n(l));return l}}function Vg(e){let{host:t,getFocusable:o,orientation:r,observe:n}=e,i=er(e),a=[];function c(l){l instanceof HTMLElement&&l.focus({focusVisible:!0})}return d((n??F(!0)).tap(()=>a=o()),$o(e),xt({host:t,...r==="horizontal"?{goRight:()=>i(1),goLeft:()=>i(-1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>i(1,-1),goLast:()=>i(-1,a.length),other:e.customKey}).tap(c))}function an({host:e,input:t,handleOther:o=!1,axis:r}){let n=()=>e.querySelector("[focused]")??e.querySelector("[selected]");function i(b=1){if(e.open===!1){e.open=!0;let E=n();requestAnimationFrame(()=>{E?.focused&&f(E)})}else return a(b)}function a(b=1,E){let T=n(),I=E??(T?e.options.indexOf(T):-1),V;do V=e.options.at(I+=b);while(V?.hidden);return V}function c(b){let E=b.key;if(/^\w$/.test(E)){let T=n(),I=T?e.options.indexOf(T):-1;if(I===-1)return;let V=I;V+1>=e.options.length&&(I=0);let C=new RegExp(`^\\s*${E}`,"i"),D;for(;D=e.options.at(++I);)if(!D.hidden&&D.textContent.match(C))return D;if(V===0)return;for(I=0;I<V&&(D=e.options.at(I++));)if(!D.hidden&&D.textContent.match(C))return D}}let l=()=>e.options.find(b=>b.focused);function f(b){for(let E of e.options)E.focused=!1;b?(b.focused=!0,t?.setAria("activedescendant",dt(b)),b.rendered?.scrollIntoView({block:"nearest"})):t?.setAria("activedescendant",null)}let h=b=>ne(b,"selectable.action",b);return d(xt({host:t??e,...r==="x"?{goLeft:()=>i(-1),goRight:()=>i(1)}:{goDown:()=>i(1),goUp:()=>i(-1)},goFirst:()=>e.open!==!1?a(1,-1):void 0,goLast:()=>e.open!==!1?a(-1,e.options.length):void 0,other:o?c:void 0}).tap(b=>{e.open===!1?h(b):f(b)}),v(t??e,"focus").tap(()=>f(n())),Qe(t??e,"Enter").tap(b=>{let E=l();e.open!==!1&&E?(b.stopPropagation(),h(E)):e.open===!1&&(e.open=!0)}))}function ti(e){return new z(t=>{d(xo("selectable",e,e.options,o=>{if(o.type==="connect"&&(o.target.view=e.optionView,o.target.selected))return e.defaultValue===void 0&&(e.defaultValue=o.target.value),t.next(o.target);let r;for(let n of e.options)n.hidden||!n.parentNode||n.selected&&(r?n.selected=!1:r=n);t.next(r)}),fe(e,"selectable.action").tap(o=>{if(!e.disabled&&e.options.includes(o)){let r=e.value!==o.value;t.next(o),r&&(e.dispatchEvent(new Event("change",{bubbles:!0})),e.dispatchEvent(new Event("input",{bubbles:!0})))}})).subscribe({signal:t.signal})})}var At=Symbol("unselected"),wo=class e extends K{options=[];_value;_selected=At;static{s(e,{init:[x("value"),H("selected")],augment:[t=>ti(t).tap(o=>{(!o||o!==t.selected)&&t.setSelected(o)}).raf(()=>{t.selected?.selected===!1&&t.setSelected(t.selected)})]})}get value(){return this._selected===At?this.options[0]?.value:this._value}get selected(){return this._selected===At&&this.options[0]?this.options[0]:this._selected===At?void 0:this._selected}set value(t){if(this._selected&&this._selected!==At&&this._selected.value===t){this._value=t;return}else for(let o of this.options)if(o.value===t){this._value=t,this.setSelected(o);return}this._selected!==At?(this._value=void 0,this._selected=void 0):this._value=t}formResetCallback(){super.formResetCallback(),!this.selected&&this.options.length&&this.setSelected(this.options[0])}setSelected(t){for(let o of this.options)o.focused=o.selected=!1;t?(t.selected=!0,this._selected=t,this.value=t.value):this._selected!==At&&(!this._selected||this.options.includes(this._selected)?this._selected=void 0:this._selected=At)}};function ko(e,t,...o){let r=document.createElementNS("http://www.w3.org/2000/svg",e);for(let[n,i]of Object.entries(t??{}))n!=="children"&&r.setAttribute(n==="className"?"class":n,i===void 0?"":String(i));return o.length&&r.append(...o),r}function _t(e){return ko("svg",e,ko("path",{d:e.d}))}function oi({host:e,target:t,position:o,onToggle:r,whenClosed:n=k}){return i=>(t.popover??="auto",t.togglePopover(i),r?.(i),i?d(ue(e),v(window,"resize"),v(window,"scroll",{capture:!0,passive:!0})).tap(o):n)}function fl(e){let{host:t,beforeToggle:o,target:r}=e,n=oi({...e,whenClosed:R(t).tap(()=>{t.open=!0})});return d(v(r,"toggle").tap(i=>{let a=i.newState==="open";t.open=a}),p(t,"open").raf().switchMap(i=>(o?.(i),t.ariaExpanded=i?"true":"false",n(i))))}function ml(e){return d(p(e,"selected").pipe(Kr(e,"selected")),Se("selectable",e),R(e).tap(()=>ne(e,"selectable.action",e)))}var ri=class extends g{value;view;selected=!1;hidden=!1;focused=!1;rendered;focus(){this.rendered?.focus()}};s(ri,{tagName:"c-option",init:[x("value"),H("view"),y("selected"),y("hidden"),y("focused")],augment:[S("option"),u(":host{display:contents}"),vo,ml,e=>{let t;return d(p(e,"view").switchMap(o=>o?(t?.remove(),e.rendered=t=new o,t.appendChild(m("slot")),A(e).append(t),d(p(e,"selected").tap(r=>t?.toggleAttribute("selected",r)),p(e,"focused").tap(r=>t?.toggleAttribute("focused",r)))):(e.rendered=t=void 0,k)))}]});var tr=class extends g{invalid=!1};s(tr,{tagName:"c-field-help",init:[x("invalid")],augment:[u(`
:host {
	display: flex;
	align-items: center;
	column-gap: 8px;
	${N("body-small")}
}
	`),w,e=>(e.slot||="help",p(e,"invalid").tap(t=>{e.ariaLive??=t?"assertive":"polite"}))]});var Xt=u(`
:host {
  display: block;
  position: relative;
  text-align: start;
  ${N("body-large")}
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
	${N("body-small")}
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
`),ii=u(`
:host(:focus-within) slot[name=label] { color: var(--cxl-color-primary); }
slot[name=label] {
	${N("body-small")}
	height: 16px;
}
:host([floating]) slot[name=label] {
	display:none;
	transition: font var(--cxl-speed), height var(--cxl-speed), top var(--cxl-speed), left var(--cxl-speed);
}
:host([floating]) slot[name=label].novalue, :host([floating]) slot[name=label].value { display:block; }
`),Sp=u(`
:host {
	border-radius: var(--cxl-shape-corner-xsmall) var(--cxl-shape-corner-xsmall) 0 0;
}
:host([floating]:not(:focus-within)) slot[name=label].novalue {
	${N("body-large")}
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

${je(".content")}
	`);function Ep(e){return d(fe(e,"registable.form",!1).tap(t=>{t.id==="form"&&t.target instanceof K&&(e.input=t.target)}),et("field",e).tap(t=>{t.type==="connect"&&t.target(e)}))}var Cp=()=>m("div",{className:"content"},m("slot",{name:"leading"}),m("div",{className:"body"},m("slot",{name:"label"}),m("slot",{id:"bodyslot"})),m("slot",{name:"trailing"}),m("div",{className:"indicator"}));function Np(e){function t(h){n.next(h.touched&&h.invalid),e.toggleAttribute("invalid",n.value);let b=0,E=[];for(let I of a.assignedNodes())!(I instanceof HTMLElement)||I===f||("invalid"in I&&I.invalid?n.value&&(I.invalid===!0||typeof I.invalid=="string"&&I.invalid===h.validationResult?.key)?(b++,I.style.display="",E.push(dt(I))):I.style.display="none":E.push(dt(I)));let T=!n.value||b>0;f.textContent=T?"":h.validationMessage,T?f.remove():(f.parentElement||e.append(f),E.push(dt(f))),E.length?h.setAria("describedby",E.join(" ")):h.setAria("describedby",null)}function o(h){let b=e.input;if(b){if(e.toggleAttribute("inputdisabled",b.disabled),t(b),!h)return;h.type==="focus"?i.next(!0):h.type==="blur"&&i.next(!1)}}function r(){let h=e.input?.value,b=!e.input?.hasAttribute("autofilled")&&(!h||Array.isArray(h)&&h.length===0);l?.classList.toggle("novalue",b),l?.classList.toggle("value",!b)}let n=pe(!1),i=pe(!1),a=m("slot",{name:"help"}),c=e.contentElement.children[1]?.children[0],l=c instanceof HTMLSlotElement?c:void 0,f=m(tr,{ariaLive:"polite"});return A(e).append(m("div",{className:"help"},a)),d(p(e,"input").switchMap(h=>h?d(F(void 0).tap(()=>{o(),queueMicrotask(r)}),v(h,"focusable.change").tap(o).tap(r),v(h,"focus").tap(o),v(h,"invalid").tap(o),v(h,"update").tap(r),B(h,"touched").tap(()=>o()),d(v(h,"blur"),v(a,"slotchange")).raf(o),v(e.contentElement,"click").tap(()=>{document.activeElement!==h&&!e.matches(":focus-within")&&!i.value&&h.focus()})):k),Ep(e))}var _e=class e extends g{floating=!1;input;size;contentElement=Cp();static{s(e,{init:[y("floating"),H("input"),ce("size",t=>` .content{min-height: ${56+t*8}px;}`)],augment:[t=>t.contentElement,Np]})}getContentRect(){return this.contentElement.getBoundingClientRect()}},ni=class extends _e{};s(ni,{tagName:"c-field",augment:[Xt,ii,Sp]});var Ap=u(`
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
`),gl=u(`
${$r("#menu")}
#menu { margin: 0; border: 0; box-sizing: border-box; }
:host {
	--cxl-mask-focus: color-mix(in srgb, var(--cxl-color-on-surface) 10%, transparent);
	--cxl-select-focused: linear-gradient(0, var(--cxl-mask-focus),var(--cxl-mask-focus));
}
`);function Mp(e,t){return()=>{let o=e.parentElement instanceof _e?e.parentElement.getContentRect():e.getBoundingClientRect();t.style.top=`${o.bottom}px`,t.style.left=`${o.x}px`,t.style.minWidth=`${o.width}px`,t.style.maxHeight=`${Math.min(window.innerHeight-o.bottom-16,280)}px`}}function si({host:e,target:t,input:o,position:r,beforeToggle:n,onToggle:i,handleOther:a,axis:c}){return d(an({host:e,input:o,handleOther:a,axis:c}),v(o??e,"blur").debounceTime(100).tap(()=>{e.open=!1}),fl({host:e,target:t,position:r??Mp(e,t),beforeToggle:n,onToggle:i}))}function Tp(e){let{host:t}=e;return d(Ap(t)??k,Y(t)??k,xe(t),si(e))}var So=class extends g{};s(So,{tagName:"c-select-option",augment:[u(`
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
		`),w]});var ai=class extends wo{open=!1;optionView=So;setSelected(t){if(super.setSelected(t),this.open)this.open=!1;else{for(let o of this.options)o!==t&&(o.slot="");t&&(t.slot="selected")}}};s(ai,{tagName:"c-select",init:[y("open")],augment:[S("listbox"),u(`
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
	${te("surface-container")}
	border: 0;
	transform-origin: top;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-2);
	visibility:visible;
}
		`),e=>{let t=m("div",{className:"menu"},m("slot")),o=m("slot",{name:"selected"}),r=t.style,n=en(e),i=0,a=0;A(e).append(t,o,_t({viewBox:"0 0 24 24",className:"caret",d:"M7 10l5 5 5-5z"}));function c(){if(e.open)a=e.selected?.rendered?.offsetHeight??0;else{r.cssText="";let l=e.options.reduce((f,h)=>Math.max(f,h.rendered?.offsetWidth??0),0);n.replaceSync(`:host{width:min(100%,${l}px)}`)}}return d(d(ao(e),St()).raf(c),Tp({host:e,target:t,handleOther:!0,beforeToggle(l){c();let f=e.selected;f&&(f.slot=l?"":"selected"),t.classList.toggle("open",l)},onToggle(l){let f=e.selected;!l&&f&&(i=f.rendered?.offsetHeight??0)},position(){let l=e.parentElement??e,f=Math.round((a-i)/2),h=e.selected?.rendered,b=l.getBoundingClientRect(),E=e.getBoundingClientRect(),T=E.top-14,I,V=h?h.offsetTop:0;V>T&&(V=T),I=t.scrollHeight;let C=window.innerHeight-E.top+8+V,D=E.top-f-V;I>C?I=C:I<E.height&&(I=E.height),r.top=D+"px",r.left=b.left+"px",r.maxHeight=I+"px",r.minWidth=b.width+"px",r.transformOrigin=`${V}px`}}))}]});function li(e){let t=Oo();return d(Se("field",e,o=>t.next(o)),t)}function Mt(e){return li(e).switchMap(t=>p(e,"input").switchMap(o=>o?F(o):p(t,"input").switchMap(r=>r?F(r):k)))}function or(e,t,o){return p(e,o).tap(r=>jo(t,o,r))}var Dp="display:block;border:0;padding:0;font:inherit;color:inherit;outline:0;width:100%;min-height:20px;background-color:transparent;text-align:start;white-space:pre-wrap;max-height:100%;resize:inherit;";function Ce({host:e,input:t,toText:o,toValue:r,update:n}){t.className="cxl-native-input",t.setAttribute("style",Dp),t.setAttribute("form","__cxl_ignore__");function i(l){e.value=r?r(t.value||""):t.value,l.stopPropagation(),e.dispatchEvent(new Event(l.type,{bubbles:!0}))}function a(){let l=e.value,f=o?o(l,t.value):l==null?"":String(l);t.value!==f&&e.setInputValue(f)}function c(){t.ariaLabel=e.ariaLabel;let l=e.getAttribute("aria-labelledby");l?t.setAttribute("aria-labelledby",l):t.removeAttribute("aria-labelledby")}return d(xe(e,t),G(()=>(c(),t.form?v(t.form,"reset").tap(i):k)),p(e,"value").tap(()=>{o&&t.matches(":focus")||a()}),v(t,"blur").tap(a),v(t,"input").tap(i),v(t,"change").tap(i),or(e,t,"disabled"),or(e,t,"name"),or(e,t,"autocomplete"),or(e,t,"spellcheck"),or(e,t,"autofocus"),Yr(e,["aria-label","aria-labelledby"]).tap(c),n?n.tap(a):k,v(t,"blur").tap(()=>e.dispatchEvent(new Event("blur"))),v(t,"focus").tap(()=>e.dispatchEvent(new Event("focus"))))}var Eo=class e extends K{autocomplete;inputValue="";static{s(e,{init:[H("inputValue")],augment:[t=>(t.inputValue=t.inputEl.value,v(t.inputEl,"input").tap(()=>{t.inputValue=t.inputEl.value}))]})}constructor(){super(),this.attachShadow({mode:"open",delegatesFocus:!0})}get role(){return this.inputEl.role}get validationMessage(){return this.inputEl.validationMessage||""}get validity(){return this.inputEl.validity}set role(t){this.inputEl.role=t}focus(){this.inputEl.focus()}setAria(t,o){o?this.inputEl.setAttribute(`aria-${t}`,o):this.inputEl.removeAttribute(`aria-${t}`)}setInputValue(t){this.inputEl.value=t,this.inputValue=this.inputEl.value}applyValidity(t,o){se(this).setValidity({customError:t},o,this.inputEl),this.inputEl.setCustomValidity(t?o||"Invalid Field":"")}};var rr=[u(`
:host{display: block; flex-grow: 1; /*color: var(--cxl-color-on-surface);*/ position:relative;}
`),Y],Wt=[...rr,w],we=class e extends Eo{autofilled=!1;static{s(e,{init:[y("autofilled"),x("autocomplete")],augment:[t=>v(t.inputEl,"animationstart").tap(o=>{(o.animationName==="cxl-onautofillstart"||o.animationName==="cxl-onautofillend")&&(t.autofilled=o.animationName==="cxl-onautofillstart",ne(t,"focusable.change"),t.inputValue=t.inputEl.value)})]})}get selectionStart(){return this.inputEl.selectionStart}get selectionEnd(){return this.inputEl.selectionEnd}set selectionStart(t){this.inputEl.selectionStart=t}set selectionEnd(t){this.inputEl.selectionEnd=t}setSelectionRange(t,o){this.inputEl.setSelectionRange(t,o)}getWindowSelection(){return this.shadowRoot?.getSelection?.()??getSelection()}getOwnSelection(){let t=this.getWindowSelection();return!t||t.focusNode!==this.inputEl&&!this.inputEl.contains(t.focusNode)?void 0:t}},ci=class extends we{value="";inputEl=m("input",{className:"input"})};s(ci,{tagName:"c-input-text",init:[x("value")],augment:[...Wt,e=>e.append(e.inputEl),e=>Ce({host:e,input:e.inputEl})]});function Ip(e){getComputedStyle(e).direction==="rtl"?e.scrollLeft=1e6:e.scrollLeft=e.scrollWidth}var sn=class e extends we{selected;value;inputEl=m("input",{className:"input"});static{s(e,{tagName:"c-input-option",init:[x("value"),H("selected")],augment:[...Wt,t=>t.append(t.inputEl),t=>Ce({host:t,input:t.inputEl,toText:()=>t.selected?.textContent??"",toValue:o=>o!==""?t.selected?.value:void 0}),t=>B(t,"selected").tap(o=>{let r=t.selected?.textContent;t.value=o?.value,t.setInputValue(r??""),Ip(t.inputEl)})]})}};function zp(e){return pi(e,"^")}function pi(e,t=""){if(e==="")return()=>!0;let o=Fp(e,t);return r=>r.textContent?o.test(r.textContent):!1}function Fp(e,t="",o="i"){return new RegExp(t+e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),o)}var ln=class e extends g{optionView=So;open=!1;debounce=100;options=[];matcher=pi;static{s(e,{tagName:"c-autocomplete",init:[y("open"),O("debounce")],augment:[S("listbox"),gl,Z,t=>{let o=m("slot",{name:"empty"}),r=m("div",{id:"menu",tabIndex:-1},m("slot"),o),n=_t({viewBox:"0 0 24 24",id:"caret",d:"M7 10l5 5 5-5z",width:20,height:20,fill:"currentColor"});n.style.cursor="pointer",o.style.display="none";function i(l){t.open=!0,c(l)}function a(l,f){l.setAria("activedescendant",dt(f)),f.rendered?.scrollIntoView({block:"nearest"})}function c(l){let f=l.inputValue??l.value,h=t.doSearch(f);o.style.display=h?"none":"",h&&a(l,h)}return A(t).append(r,n),d(Mt(t).switchMap(l=>(l.setAria("autocomplete","list"),l.role="combobox",l.setAria("controls",dt(t)),l.setAria("haspopup",t.role),l.setAttribute("autocomplete","off"),d(p(t,"open").tap(f=>{if(f)n.tabIndex=-1,i(l);else{for(let h of t.options)h.focused=!1;n.tabIndex=0,l.setAria("activedescendant",null)}l.setAria("expanded",String(f))}),d(jr(n),v(n,"mousedown")).tap(f=>{f.preventDefault(),f.stopPropagation(),l.focus()}).debounceTime(100).tap(()=>{t.open=!0}),p(t,"debounce").switchMap(f=>v(l,"input").debounceTime(f).tap(()=>t.open?c(l):i(l))),v(t,"change").tap(f=>{f.target===t&&l.dispatchEvent(new Event("change",{bubbles:!0}))}),si({host:t,target:r,input:l}),d(ti(t),B(l,"value").map(f=>{for(let h of t.options)if(h.value===f)return h})).tap(f=>{for(let h of t.options)h.focused=h.selected=!1;f&&(f.selected=!0),l instanceof sn?l.selected=f:l.value=f?.value,f&&(t.open=!1)})))))}]})}doSearch(t){let o=0,r,n=this.matcher==="substring"?pi:this.matcher==="prefix"?zp:this.matcher,i=t?n(String(t)):void 0;for(let a of this.options){let c=!i?.(a);a.hidden=c,a.focused=!(c||o++>0),a.focused&&(r=a)}return r}};var ui=class extends ln{onsearch;doSearch(t){return Pe(this,"search",{detail:String(t)}),this.options[0]}};s(ui,{tagName:"c-autocomplete-dynamic",init:[co("search")]});var Lp=u(`
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
	${N("title-large")}
}
svg,img { width: 100%; height: 100%; }
`),di=class extends g{size;src="";text=""};s(di,{tagName:"c-avatar",init:[ce("size",e=>`{
				width: ${30+e*8}px;
				height: ${30+e*8}px;
				font-size: ${18+e*4}px;
			}`),x("src"),x("text")],augment:[Lp,e=>{let t;return P(p(e,"src"),p(e,"text")).raf(([o,r])=>{t?.remove(),o?(t=new Image,t.alt=e.text,t.src=o):r?t=new Text(r):t=go("person"),A(e).append(t)})}]});var fi=class extends g{size;color};s(fi,{tagName:"c-badge",init:[le("color","error",".badge"),y("size")],augment:[u(`
			:host {
				box-sizing: border-box;
				display: inline-block;
				position: relative;
			}
			.badge {
				display: inline-block;
				text-align: center;
				position: absolute;
				${N("label-small")}
				padding: 0 4px 0 4px;
				margin-inline-start: -12px;
				min-width: 16px;
				height: 16px;
				border-radius: 16px;
				line-height: 16px;
				top: -2px;
				inset-inline-start: 100%;
			}
			:host([size="small"]) .badge {
				padding: 0;
				line-height: 0;
				min-width: 6px;
				height: 6px;
				top: 0;
				margin-inline-start: -6px;
			}
		`),w,()=>m("span",{className:"badge"},m("slot",{name:"badge"}))]});var mi=class extends g{};s(mi,{tagName:"c-body",augment:[u(`
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

${U("medium",`
	:host{padding:32px;}
	slot { margin: 0 auto; width:100%; }
`)}
		`),w]});var cn=class extends g{};s(cn,{tagName:"c-button-segmented-view",augment:[u(`
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
		`),kt,he,()=>m(ve,{id:"check",name:"check"}),w]});var gi=class extends wo{optionView=cn;size};s(gi,{tagName:"c-button-segmented",init:[ce("size",e=>`{
			font-size: ${14+e*1}px;
			min-height: ${40+e*8}px;
		}`)],augment:[S("listbox"),u(`
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
	${N("label-large")}
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
		`),Y,w,xe,e=>an({host:e,axis:"x"})]});var Xe=class extends yo{};s(Xe,{tagName:"c-button-text",augment:[...Yt,u(`
:host {
	${N("label-large")}
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
		`),he,w]});function xi(e="block"){let t=(o=>{for(let r=12;r>0;r--)o.xl+=`:host([xl="${r}"]){display:${e};grid-column-end:span ${r};}`,o.lg+=`:host([lg="${r}"]){display:${e};grid-column-end:span ${r};}`,o.md+=`:host([md="${r}"]){display:${e};grid-column-end:span ${r};}`,o.sm+=`:host([sm="${r}"]){display:${e};grid-column-end:span ${r};}`,o.xs+=`:host([xs="${r}"]){display:${e};grid-column-end:span ${r};}`;return o})({xl:"",lg:"",md:"",sm:"",xs:""});return u(`
:host { box-sizing:border-box; display:${e}; }
${t.xs}
:host([xs="0"]) { display:none }
:host([xsmall]) { display:${e} }
${U("small",`
:host { grid-column-end: auto; }
:host([small]) { display:${e} }
${t.sm}
:host([sm="0"]) { display:none }
`)}
${U("medium",`
${t.md}
:host([md="0"]) { display:none }
:host([medium]) { display:${e} }
`)}
${U("large",`
${t.lg}
:host([lg="0"]) { display:none }
:host([large]) { display:${e} }
`)}
${U("xlarge",`
${t.xl}
:host([xl="0"]) { display:none }
:host([xlarge]) { display:${e} }
`)}
`)}var hi=u(`
:host([grow]) { flex-grow:1; flex-shrink: 1 }
:host([color]) { background-color: var(--cxl-color-surface); color: var(--cxl-color-on-surface); }
:host([fill]) { position: absolute; inset:0 }
:host([elevation]) { --cxl-color-on-surface: var(--cxl-color--on-surface); }
:host([elevation="0"]) { --cxl-color-surface: var(--cxl-color-surface-container-lowest); }
:host([elevation="1"]) { --cxl-color-surface: var(--cxl-color-surface-container-low); }
:host([elevation="2"]) { --cxl-color-surface: var(--cxl-color-surface-container); }
:host([elevation="3"]) { --cxl-color-surface: var(--cxl-color-surface-container-high); }
:host([elevation="4"]) { --cxl-color-surface: var(--cxl-color-surface-container-highest); }
${mo()}
${ft.map(e=>`:host([pad="${e}"]){padding:${e}px}`).join("")}
${ft.map(e=>`:host([vpad="${e}"]){padding-top:${e}px;padding-bottom:${e}px}`).join("")}`),Co=class extends g{grow=!1;fill=!1;xs;sm;md;lg;xl;pad;vpad;color;center=!1;elevation};s(Co,{init:[y("sm"),y("xs"),y("md"),y("lg"),y("xl"),y("vpad"),y("pad"),y("center"),y("fill"),y("grow"),y("elevation"),le("color")]});var nr=class extends Co{};s(nr,{tagName:"c-c",augment:[hi,xi(),u(":host([center]) { text-align: center}"),w]});var Pp=u(`
:host { ${Qr} }
:host([disabled]) { color: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent); }
:host([selected]) {
	background-color: var(--cxl-color-secondary-container);
	color: var(--cxl-color-on-secondary-container);
}
`);function bi(e){return d(Se("list",e),p(e,"selected").tap(t=>e.ariaSelected=String(t)))}function yi(e){return d(_n(e),xe(e,e,-1),bi(e))}var nt=class extends g{disabled=!1;touched=!1;selected=!1};s(nt,{init:[y("disabled"),y("touched"),y("selected")],augment:[yi]});var No=class extends nt{size};s(No,{tagName:"c-item",init:[ce("size",e=>`{min-height:${56+e*8}px}`)],augment:[Pp,Y,kt,S("option"),w,he]});function ar(e){if(!e)return;let t=/^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(e);if(!t)return new Date(NaN);let o=Number(t[1]),r=Number(t[2])-1,n=Number(t[3]??1),i=new Date(0);return i.setFullYear(o,r,n),i.setHours(0,0,0,0),o>0&&i.getFullYear()===o&&i.getMonth()===r&&i.getDate()===n?i:new Date(NaN)}function vi(e){return new Date(e).setHours(0,0,0,0)}var ir=class extends Ut{selected=!1;date;locale};s(ir,{tagName:"c-calendar-date",init:[H("date"),H("locale"),y("selected")],augment:[u(`
:host([variant=text][selected]:not([disabled])) {
	background-color: var(--cxl-color-primary);
	color: var(--cxl-color-on-primary);
}
:host([today]) { outline: 1px solid var(--cxl-color-primary); }
		`),bi,e=>P(p(e,"date"),p(e,"locale"),j.locale).tap(([t,o,r])=>{e.variant="text",e.role="gridcell",e.textContent=t?String(t.date.getDate()):"",e.ariaLabel=t?.date.toLocaleDateString(o??r.localeName,{weekday:"long",year:"numeric",month:"long",day:"numeric"})??null,e.toggleAttribute("today",t?.isToday??!1),e.ariaCurrent=t?.isToday?"date":null})]});var qt=class{start=new Comment("marker-start");end=new Comment("marker-end");frag=document.createDocumentFragment();insert(t,o=this.end){let r=this.end.parentNode;r&&(this.start.parentNode||r.insertBefore(this.start,this.end),Array.isArray(t)?(this.frag.append(...t),r.insertBefore(this.frag,o)):r.insertBefore(t,o))}empty(){let t=this.end.parentNode;if(!t||this.start.parentNode!==t)return;let o=document.createRange();o.setStartAfter(this.start),o.setEndBefore(this.end),o.deleteContents()}};function xl(e,t,o){return Uo(()=>{let r=new qt;return[e.switchMap(n=>{r.empty();let i=n?t(n):o?.();return i instanceof Promise?no(i):F(i)}).tap(n=>{n&&r.insert(n)}),r.end]})}function Tt({source:e,renderFn:t,loading:o,error:r}){return Uo(()=>{let n=new qt,i=!1;return[d(o?Ye(750).tap(()=>{i||n.insert(o())}):k,e.tap(a=>{i=!0,n.empty();let c=t(a);c&&n.insert(c)}).catchError(a=>{if(i=!0,r)return n.empty(),n.insert(r(a)),k;throw a})),n.end]})}var sr=class extends g{overflow=0;date;onshowmore};s(sr,{tagName:"c-calendar-cell",init:[O("overflow"),H("date"),co("showmore")],augment:[u(`
:host { position: relative; text-align: center; }
.showmore {
	position: absolute;
	bottom: 0;
	padding: 0 4px;
	margin: 0;
	min-height: 14px;
	white-space: nowrap;
}
		`),w,e=>xl(p(e,"overflow").map(t=>t>0?t:0),t=>m(Xe,{className:"showmore",$:o=>R(o).tap(()=>{e.date&&Pe(e,"showmore",{detail:e.date})})},t," More"))(e)]});function wi(e){return xo("list",e,e.items)}function Rp(e){return $o({host:e,getFocusable:()=>e.items,getSelected:()=>e.items.find(t=>t.selected),getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),observe:wi(e)})}function Vp(e){return er({getFocusable:()=>e.items,getActive:()=>ei(e)})}function pn(e){let t=Vp(e);return d(Rp(e),xt({host:e,goDown:()=>t(1),goUp:()=>t(-1),goFirst:()=>t(1,-1),goLast:()=>t(-1,e.items.length)}).tap(o=>o.focus()))}function Si(e){let{host:t,getActive:o,getSelected:r}=e,n=e.columns?Math.max(1,Math.floor(e.columns)):void 0,i=[],a=(e.observe??so(t)).tap(()=>{i=e.getFocusable()}),c=()=>i,l=er({getFocusable:c,getActive:o});function f(b){if(n)return l(b*n);let E=o();if(!E)return;let T=E.getBoundingClientRect(),I=T.left+T.width/2,V=T.top+T.height/2,C,D=1/0;for(let L of i){if(L===E||L.disabled||!L.checkVisibility())continue;let _=L.getBoundingClientRect(),oe=_.left+_.width/2,be=(_.top+_.height/2-V)*b;if(be<=0)continue;let Fe=be**2+(oe-I)**2;Fe<D&&(C=L,D=Fe)}return C}function h(b){if(!n)return;let E=o(),T=i.findIndex(V=>V===E);if(T===-1)return;let I=T-T%n;return i[Math.min(I+(b?n-1:0),i.length-1)]}return d($o({host:t,getFocusable:c,getActive:o,getSelected:r,observe:a}),xt({host:t,goRight:()=>{let b=o(),E=i.findIndex(T=>T===b);return n&&E%n===n-1?void 0:l(1)},goLeft:()=>{let b=o(),E=i.findIndex(T=>T===b);return n&&E%n===0?void 0:l(-1)},goFirst:()=>l(1,-1),goLast:()=>l(-1,i.length),goFirstColumn:()=>h(!1),goLastColumn:()=>h(!0),goUp:()=>f(-1),goDown:()=>f(1)}).tap(b=>b.focus()))}var ki=class extends g{items=[]};s(ki,{tagName:"c-grid-list",augment:[S("grid"),u(":host{display:grid;box-sizing:border-box;}"),w,e=>Si({host:e,getFocusable:()=>e.items,getActive:()=>e.items.find(t=>t.matches(":focus,:focus-within")),getSelected:()=>e.items.find(t=>t.selected),observe:wi(e)})]});function Op(e,t){if(isNaN(e.getTime()))return[];let o=new Date(e);o.setDate(1),o.setHours(0,0,0,0),o.setDate(1-(o.getDay()-t+7)%7);let r=new Date(e);r.setDate(1),r.setMonth(r.getMonth()+1),r.setHours(0,0,0,0),r.setDate(1+(t-r.getDay()+7)%7);let n=[],i=vi(new Date);for(let a=o;a<r;a.setDate(a.getDate()+1)){let c=a.getTime();n.push({date:new Date(a),time:c,isToday:c===i,isOutsideMonth:a.getMonth()!==e.getMonth()})}return n}var un=class e extends K{month=new Date;value=void 0;locale;weekstart;minyear=1;maxyear=9999;cells={};grid;static{s(e,{tagName:"c-calendar-month-input",init:[x("month",{parse:ar}),x("value",{parse:ar}),x("locale"),O("weekstart",0,6),O("minyear"),O("maxyear")],augment:[S("group"),u(`
:host { display: block; }
#grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); width: 100%; }
.day { text-align: center; padding: 16px 0; ${N("body-large")} }
.row { display: contents; }
.cell { padding: 4px; }
.date { margin: 0; ${N("body-large")} }
.outside { opacity: .38; }
				`),Y,Ht,qo,t=>{let o=t.grid=m("div",{id:"grid",role:"grid"}),r=fo(t).share();A(t).append(o),o.append(Tt({source:P(p(t,"month"),p(t,"locale"),p(t,"weekstart"),j.locale),renderFn:([i,a,c,l])=>{let f=a??l.localeName,h=a?j.registeredLocales[a]??j.registeredLocales[a.split("-")[0]??""]:l,b=Number.isInteger(c)&&c!==void 0&&c>=0&&c<7?c:h?.weekStart??0,E=new DocumentFragment,T=m("div",{role:"row",className:"row"});for(let V=0;V<7;V++)T.append(m(Ue,{role:"columnheader",className:"day"},r.map(C=>new Date(2024,0,7+(b+V)%7).toLocaleDateString(f,{weekday:C==="xsmall"?"narrow":C==="small"?"short":"long"}))));E.append(T),t.cells={};let I=Op(i??new Date,b);for(let V=0;V<I.length;V+=7){let C=m("div",{role:"row",className:"row"});for(let[D,L]of I.slice(V,V+7).entries()){let _=m(ir,{date:L,locale:f,tabIndex:-1,className:`date${L.isOutsideMonth?" outside":""}`,selected:p(t,"value").map(ae=>!!ae&&vi(ae)===L.time),disabled:P(p(t,"disabled"),p(t,"minyear"),p(t,"maxyear")).map(([ae,be,Fe])=>ae||L.date.getFullYear()<be||L.date.getFullYear()>Fe),$:ae=>R(ae).tap(()=>{ae.disabled||t.onClickDate(L)})}),oe=m(sr,{className:"cell",date:L},_);t.cells[Zs(L.date)]={element:oe,index:V+D,overflow:0,date:L.date},C.append(oe)}E.append(C)}return E}})(t));let n=()=>Array.from(o.querySelectorAll("c-calendar-date"));return d(P(p(t,"value"),p(t,"minyear"),p(t,"maxyear")).tap(([i,a,c])=>t.setValidity({key:"date",valid:!i||!isNaN(i.getTime())&&i.getFullYear()>=a&&i.getFullYear()<=c})),p(t,"disabled").tap(i=>{i&&n().forEach(a=>a.tabIndex=-1)}).switchMap(i=>i?k:Si({host:o,columns:7,getFocusable:n,getActive:()=>n().find(a=>a.matches(":focus,:focus-within")),getSelected:()=>n().find(a=>a.selected&&!a.disabled),observe:d(so(o,{subtree:!0}),Bo(o,{attributes:!0,attributeFilter:["disabled"],subtree:!0}))})))}]})}get startDate(){return Object.values(this.cells)[0]?.date}focus(){if(this.disabled)return;let t=Array.from(this.grid?.querySelectorAll("c-calendar-date")??[]);(t.find(r=>r.selected&&!r.disabled)??t.find(r=>!r.disabled))?.focus()}onClickDate(t){this.value=new Date(t.date),this.dispatchEvent(new Event("change",{bubbles:!0}))}};var Bp=u(`
:host {
	${te("surface-container")}
	${N("body-medium")}
	border-radius: var(--cxl-shape-corner-medium);
	overflow: hidden;
}
:host([variant=elevated]:not([color])) {
	--cxl-color-surface: var(--cxl-color-surface-container-low);
	z-index: 1;
	box-shadow: var(--cxl-elevation-1);
}
:host([variant=outlined]:not([color])) {
	${te("surface")}
}
:host([variant=outlined]) {
	border: 1px solid var(--cxl-color-outline-variant);
}
${mo()}
`),lr=class extends nr{variant};s(lr,{tagName:"c-card",init:[y("variant")],augment:[Bp]});var Ei=class extends lr{disabled=!1;touched=!1;selected=!1};s(Ei,{tagName:"c-card-item",init:[y("disabled"),y("touched"),y("selected")],augment:[S("option"),...Yt,u(`
:host([variant=outlined]:hover) { box-shadow: var(--cxl-elevation-1) }
:host([variant=elevated]) { color: var(--cxl-color-on-surface); }
		`),yi,he]});function Ci(e){return d(P(p(e,"indeterminate"),p(e,"checked")).map(([t,o])=>e.ariaChecked=t?"mixed":String(o)),d(R(e).tap(()=>{e.disabled||(e.indeterminate&&(e.indeterminate=!1),e.checked=!e.checked)}),p(e,"checked").tap(()=>{se(e).setFormValue(e.checked?String(e.value):null)}),B(e,"checked").tap(()=>{e.dispatchEvent(new Event("change",{bubbles:!0}))})).ignoreElements())}var hl=class e extends K{value="on";checked=!1;indeterminate=!1;defaultChecked=!1;static{s(e,{tagName:"c-checkbox",init:[x("value"),x("checked"),x("indeterminate")],augment:[S("checkbox"),u(`
:host {
	position: relative;
	display: flex;
	column-gap: 16px;
	align-items: center;
	outline: none;
	cursor: pointer;
	text-align: start;
	padding: 15px;
	${N("body-large")}
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
${je(".mask")}
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
`),Ie,Y,t=>{t.defaultChecked=t.checked;let o=m("div",{className:"mask"}),r=m("div",{className:"box"},_t({className:"check",viewBox:"0 0 24 24",d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"}),_t({className:"minus",viewBox:"0 0 24 24",d:"M19 13H5v-2h14v2z"}),o);return A(t).append(r,m("slot")),d(he(o,t),Ci(t).tap(n=>r.setAttribute("state",n)))}]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){se(this).setFormValue(this.checked?String(t):null)}};var cr=class extends g{color;size=0};s(cr,{tagName:"c-pill",init:[le("color","surface-container-low"),ce("size",e=>`{
			padding: 2px ${e<0?2:8}px;
			font-size: ${14+e*2}px;
			height: ${32+e*6}px;
		}`)],augment:[u(`
:host {
	box-sizing: border-box;
	border: 1px solid var(--cxl-color-outline-variant);
	border-radius: var(--cxl-shape-corner-small);
	${N("label-large")}
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
		`),()=>m("slot",{name:"leading"}),w,()=>m("slot",{name:"trailing"})]});var Ni=class extends cr{disabled=!1;touched=!1;selected=!1};s(Ni,{tagName:"c-chip",init:[y("disabled"),y("touched"),y("selected")],augment:[S("button"),Ie,...Yt,u(`
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
	${te("secondary-container")}
}
:host(:hover) { box-shadow: none; }
		`),he]});var Ai=class extends g{date;format;locale};s(Ai,{tagName:"c-date",init:[Qs("date"),x("format"),x("locale")],augment:[e=>P(p(e,"locale").switchMap(t=>j.getLocale(t)),p(e,"date"),p(e,"format")).raf(([t,o,r])=>e.textContent=o?t.formatDate(o,r):"")]});var pr=class extends Co{vflex=!1;gap;middle=!1};s(pr,{tagName:"c-flex",init:[y("vflex"),y("gap"),y("middle")],augment:[xi("flex"),hi,u(`
:host([middle]) { align-items: center; }
:host([center]) { justify-content: center; }
:host([vflex]) { flex-direction: column; }
:host([vflex][middle]) { justify-content: center; align-items: normal }
:host([vflex][center]) { align-items: center; }
${ft.map(e=>`:host([gap="${e}"]){gap:${e}px}`).join("")}
	`),w]});var We=class extends pr{};s(We,{tagName:"c-toolbar",augment:[u(`
:host {
	grid-column: 1 / -1;
	column-gap: 24px;
	row-gap: 8px;
	align-items: center;
	min-height: 48px;
	flex-wrap: wrap;
	flex-shrink: 0;
}
${U("small",":host{column-gap:24px}")}
		`)]});var Hp=u(`
:host {
	position: fixed;
	margin: 0;
	padding: 0;
	outline: 0;
	border: 0;
	display: block;
	border-radius: var(--cxl-shape-corner-xsmall);
	box-shadow: var(--cxl-elevation-2);
	${te("surface-container")}
}
::backdrop { overflow: hidden; }
:host([static]) { position: static; }
	`);function Yp(e){function t(){e.exclusive&&!e.static&&ie.popupOpened({element:e,close:()=>e.open=!1}),e.static||(e.popover??="auto",e.showPopover())}return p(e,"open").switchMap(o=>o?(t(),d(v(e,"keydown").tap(r=>{r.key==="Escape"&&(e.open=!1,e.returnTo?.focus(),r.preventDefault(),r.stopPropagation())}),v(e,"toggle").tap(r=>{let n=r.newState==="open";n||(e.open=n)}),B(e,"open").tap(r=>{!r&&e.popover&&e.hidePopover()}),v(e,"close").tap(r=>{r.target===e&&e.popover&&e.hidePopover()}))):k)}var Kt=class extends tt{exclusive=!0;static=!1;trigger;returnTo};s(Kt,{tagName:"c-popup",init:[x("exclusive"),y("static")],augment:[w,ho,Hp,mt,Yp]});var Ao=class extends Kt{"motion-in"="fadeIn";"motion-out"="fadeOut";items=[];focusstart;setFocus(){let t=Rt(this)?.activeElement;if(!(t&&this.contains(t))){if(this.focusstart==="selected"){let o=this.items.find(r=>r.selected);if(o){o.focus();return}}this.items[0]?.focus()}}};s(Ao,{tagName:"c-menu",init:[x("focusstart")],augment:[S("menu"),u($r()),pn,e=>p(e,"open").tap(t=>{t&&e.setFocus()})]});var jp=Nt({"datepicker.nextYear":"Next Year","datepicker.nextMonth":"Next Month","datepicker.previousYear":"Previous Year","datepicker.previousMonth":"Previous Month"}),dn=class e extends K{value=void 0;minyear=1900;maxyear=2100;locale;weekstart;monthInput;static{s(e,{tagName:"c-datepicker",init:[x("value",{parse:ar}),O("minyear",1,9999),O("maxyear",1,9999),x("locale"),O("weekstart",0,6)],augment:[S("group"),u(`
:host {
	box-sizing: border-box;
	display: block;
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	padding: 8px 12px;
	min-width: 360px;
}
.header { padding: 0 12px; gap: 8px; flex-wrap: nowrap; }
.header c-button-text { margin: 0; padding: 8px; }
.margin { margin-inline-start: auto; }
.body { position: relative; }
.menu {
	position: absolute;
	inset: 0;
	box-shadow: none;
	overflow: hidden auto;
	z-index: 1;
}
				`),Y,Ht,qo,t=>{let o=pe(new Date),r=P(p(t,"locale"),j.locale).map(([C,D])=>C??D.localeName),n=m(Ao,{static:!0,className:"menu",focusstart:"selected"}),i=m(Ao,{static:!0,className:"menu",focusstart:"selected"}),a=P(p(n,"open"),p(i,"open")).map(([C,D])=>C||D),c=P(p(t,"minyear"),p(t,"maxyear"));function l(C){return Number.isInteger(t.minyear)&&Number.isInteger(t.maxyear)&&t.minyear>=1&&t.maxyear<=9999&&C.getFullYear()>=t.minyear&&C.getFullYear()<=t.maxyear}function f(C){let D=new Date(o.value);return D.setMonth(D.getMonth()+C),D}function h(C){let D=f(C);!t.disabled&&l(D)&&o.next(D)}function b(C,D){t.disabled||!l(C)||(o.next(C),D.open=!1,t.focus())}let E=m(Xe,{ariaHasPopup:"menu",ariaExpanded:p(i,"open").map(String),disabled:P(p(t,"disabled"),p(n,"open")).map(([C,D])=>C||D),$:C=>R(C).tap(()=>{C.disabled||(i.open=!i.open,i.open&&i.setFocus())})},P(o,r).map(([C,D])=>C.toLocaleDateString(D,{month:"short"}))),T=m(Xe,{className:"margin",ariaHasPopup:"menu",ariaExpanded:p(n,"open").map(String),disabled:P(p(t,"disabled"),p(i,"open")).map(([C,D])=>C||D),$:C=>R(C).tap(()=>{C.disabled||(n.open=!n.open,n.open&&n.setFocus())})},P(o,r).map(([C,D])=>C.toLocaleDateString(D,{year:"numeric"})));n.returnTo=T,i.returnTo=E;function I(C,D){return m(ze,{icon:C<0?"chevron_left":"chevron_right",title:jp(D),hidden:a,disabled:P(o,c,p(t,"disabled")).map(()=>t.disabled||!l(f(C))),$:L=>R(L).tap(()=>h(C))})}let V=t.monthInput=m(un,{month:o,value:p(t,"value"),locale:p(t,"locale"),weekstart:p(t,"weekstart"),disabled:p(t,"disabled"),minyear:p(t,"minyear"),maxyear:p(t,"maxyear"),$:C=>v(C,"change").tap(D=>{D.stopPropagation(),!t.disabled&&(t.value=C.value,t.dispatchEvent(new Event("change",{bubbles:!0})))})});return A(t).append(m(We,{className:"header"},I(-1,"datepicker.previousMonth"),E,I(1,"datepicker.nextMonth"),I(-12,"datepicker.previousYear"),T,I(12,"datepicker.nextYear")),m("div",{className:"body"},V,n,i)),i.append(Tt({source:p(i,"open").switchMap(C=>C?r:k),renderFn:C=>Array.from({length:12},(D,L)=>m(No,{selected:o.map(_=>_.getMonth()===L),disabled:p(t,"disabled"),$:_=>R(_).tap(()=>{let oe=new Date(o.value);oe.setMonth(L),b(oe,i)})},new Date(2e3,L,1).toLocaleDateString(C,{month:"long"})))})(t)),n.append(Tt({source:p(n,"open").switchMap(C=>C?P(c,r):k),renderFn:([[C,D],L])=>{let _=[];if(!Number.isInteger(C)||!Number.isInteger(D)||C<1||D>9999)return _;for(let oe=C;oe<=D;oe++){let ae=new Date(0);ae.setFullYear(oe,0,1),_.push(m(No,{selected:o.map(be=>be.getFullYear()===oe),disabled:p(t,"disabled"),$:be=>R(be).tap(()=>{let Fe=new Date(o.value);Fe.setFullYear(oe),b(Fe,n)})},ae.toLocaleDateString(L,{year:"numeric"})))}return _}})(t)),d(P(p(t,"value"),c).tap(([C])=>{t.setValidity({key:"date",valid:!C||!isNaN(C.getTime())&&l(C)});let D=new Date(C&&!isNaN(C.getTime())?C:new Date);D.setDate(1),D.setHours(0,0,0,0),Number.isInteger(t.minyear)&&Number.isInteger(t.maxyear)&&t.minyear<=t.maxyear&&D.setFullYear(Math.max(t.minyear,Math.min(t.maxyear,D.getFullYear()))),o.value.getTime()!==D.getTime()&&o.next(D)}),p(t,"disabled").tap(C=>{C&&(n.open=i.open=!1)}))}]})}focus(){this.disabled||this.monthInput?.focus()}};function Mi(e,t){return new Intl.DateTimeFormat(e??j.locale.value.localeName,typeof t=="string"?{dateStyle:t}:t??{year:"numeric",month:"numeric",day:"numeric"})}function yl(e,t,o){if(e<1||e>9999)return new Date(NaN);let r=new Date(0);return r.setFullYear(e,t-1,o),r.setHours(0,0,0,0),r.getFullYear()===e&&r.getMonth()===t-1&&r.getDate()===o?r:new Date(NaN)}function Up(e){if(!e)return;let t=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);return t?yl(Number(t[1]),Number(t[2]),Number(t[3])):new Date(NaN)}function bl(e){let t=e.resolvedOptions(),o=new Intl.NumberFormat(t.locale,{useGrouping:!1,numberingSystem:t.numberingSystem}),r=(b,E=!0)=>{for(let T=0;T<10;T++)b=b.replaceAll(o.format(T),String(T));return b=b.replace(/[\u200e\u200f\u061c]/g,"").replace(/\s+/g," ").toLocaleLowerCase(t.locale),E?b.trim():b},n=b=>r(b,!1).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),i=e.formatToParts(new Date(2006,10,22)),a=Array.from({length:12},(b,E)=>r(e.formatToParts(new Date(2006,E,22)).find(T=>T.type==="month")?.value??"")),c=a.every(b=>/^\d+$/.test(b)),l=t.calendar==="gregory"&&t.timeZone===new Intl.DateTimeFormat().resolvedOptions().timeZone&&!t.timeZoneName&&i.every(b=>["year","month","day","weekday","literal"].includes(b.type))&&["year","month","day"].every(b=>i.some(E=>E.type===b))&&new Set(a).size===12,f=i.map(b=>b.type==="literal"?n(b.value).replaceAll(" ","\\s*"):b.type==="weekday"?"(?<weekday>.+?)":b.type==="month"&&!c?`(?<month>${a.map(n).join("|")})`:`(?<${b.type}>\\d{1,${b.type==="year"?4:2}})`).join(""),h=l?new RegExp(`^${f}$`,"u"):void 0;return b=>{let E=h?.exec(r(b))?.groups;if(!E)return new Date(NaN);let T=Number(E.year)+(E.year?.length===2&&(t.year==="2-digit"||t.dateStyle==="short")?2e3:0),I=c?Number(E.month):a.indexOf(E.month??"")+1,V=yl(T,I,Number(E.day));if(E.weekday&&!isNaN(V.getTime())){let C=e.formatToParts(V).find(D=>D.type==="weekday")?.value;if(r(C??"")!==E.weekday)return new Date(NaN)}return V}}var ur=class e extends we{value=void 0;locale;format;inputEl=m("input",{className:"input"});static{s(e,{init:[x("value",{parse:Up}),x("format"),x("locale")],augment:[w,t=>t.append(t.inputEl),t=>{let o=Mi(t.locale,t.format),r=bl(o);return d(p(t,"value").tap(n=>t.setValidity({key:"date",valid:!n||!isNaN(n.getTime())})),Ce({host:t,input:t.inputEl,toText:(n,i)=>n?isNaN(n.getTime())?i:o.format(n):"",toValue:n=>n.trim()?r(n):void 0,update:P(j.locale,p(t,"locale"),p(t,"format")).tap(()=>{o=Mi(t.locale,t.format),r=bl(o)})}))}]})}formResetCallback(){super.formResetCallback(),this.value?isNaN(this.value.getTime())||this.setInputValue(Mi(this.locale,this.format).format(this.value)):this.setInputValue("")}},Ti=class extends ur{};s(Ti,{tagName:"c-input-date",augment:[...rr]});var Di=class extends Kt{datepicker=m(dn);input};s(Di,{tagName:"c-datepicker-popup",init:[H("input")],augment:[u(`
:host { border-radius: var(--cxl-shape-corner-large); overflow: hidden; }
#footer { margin: 0 24px; }
#footer :first-child { margin-inline-start: auto; }
		`),e=>v(e,"click").tap(t=>t.stopPropagation()),e=>{let t;function o(){e.datepicker.value=t?.value&&!isNaN(t.value.getTime())?new Date(t.value):void 0}function r(n){n&&t&&!t.disabled&&e.datepicker.checkValidity()&&(t.value=e.datepicker.value,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0}))),e.open=!1,(e.returnTo??t)?.focus()}return A(e).append(e.datepicker,m(We,{id:"footer"},m(Xe,{$:n=>R(n).tap(()=>r(!1))},j.get("core.cancel")),m(Xe,{disabled:p(e.datepicker,"disabled"),$:n=>R(n).tap(()=>{n.disabled||r(!0)})},j.get("core.ok")))),d(d(p(e,"input"),Mt(e)).switchMap(n=>(t=n instanceof ur?n:void 0,o(),t?d(p(t,"value").tap(o),p(t,"locale").tap(i=>e.datepicker.locale=i),p(t,"disabled").tap(i=>e.datepicker.disabled=i)):k)),p(e,"open").tap(n=>{o(),n&&e.datepicker.focus()}),v(e.datepicker,"change").tap(n=>n.stopPropagation()))}]});Nt({"dialog.close":"Close dialog","dialog.cancel":"Cancel","dialog.ok":"Ok"});var zi=(e,t,o=e)=>R(e).tap(()=>ne(o,"dialog.close",t)),Fi=u(`
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
	${te("surface-container-high")}
	
	box-sizing: border-box;
	min-width: 280px;
	max-width: calc(100% - 24px);
	padding: 24px;
	overflow-y: auto;
	box-shadow: var(--cxl-elevation-3);
	border-radius: var(--cxl-shape-corner-xlarge);
}

dialog::backdrop { background-color: var(--cxl-color-scrim); }

${U("small",".content { max-height: 85%; }")}
	`),Mo=class extends g{static=!1;open=!1;fullscreen=!1;dialog=document.createElement("dialog");returnValue};s(Mo,{init:[x("static"),x("open"),y("fullscreen")],augment:[Z,e=>v(e,"keydown").tap(t=>{t.key==="Escape"&&(t.preventDefault(),e.open=!1)}),e=>v(e.dialog,"close").tap(()=>e.open=!1),e=>e.dialog,e=>p(e,"open").tap(t=>{t?e.static?e.dialog.show():ie.openModal({element:e.dialog,close:()=>e.open=!1}):e.dialog.open&&(e.dialog.close(),Pe(e,"close"))}),e=>fe(e,"dialog.close").tap(t=>{e.returnValue=t,e.open=!1})]});var Ii=class extends Mo{};s(Ii,{tagName:"c-dialog",augment:[Fi,e=>{e.dialog.append(m("slot",{className:"content"}))}]});function fn(e,t,...o){let r=m(e,t,...o);return new Promise(n=>{let i=()=>{r.removeEventListener("close",i),r.remove(),n(r.returnValue)};r.addEventListener("close",i),r.parentNode||document.body.append(r),r.open=!0})}var Gt=class extends Mo{};s(Gt,{tagName:"c-dialog-basic",augment:[Fi,u(`
dialog {
	display:flex; flex-direction:column;row-gap:16px;
	max-width: min(calc(100% - 24px), 560px);
}
slot[name=title] { ${N("title-large")} }
slot[name=actions] {
	display:flex; column-gap: 24px; align-items: center; justify-content: end; margin-top:8px;
}
		`),e=>{e.dialog.append(m("slot",{name:"title"}),m("slot"),m("slot",{name:"actions"}))}]});function Zv(e){let t=[],{message:o,title:r,action:n}=typeof e=="string"?{message:e}:e;return r&&t.push(m("div",{slot:"title"},r)),t.push(m(Ue,void 0,o),m(ot,{$:on,variant:"text",slot:"actions"},n??j.get("dialog.ok"))),fn(Gt,{},...t)}function i0(e){let t=[];typeof e=="string"&&(e={message:e});let{message:o,title:r,action:n,cancelAction:i}=e;return r&&t.push(m("div",{slot:"title"},r)),t.push(m(Ue,void 0,o),m(ot,{variant:"text",slot:"actions",$:a=>zi(a,!1)},i??j.get("dialog.cancel")),m(ot,{variant:"text",slot:"actions",$:a=>zi(a,!0)},n??j.get("dialog.ok"))),fn(Gt,{},...t)}var Li=class extends g{motion;target};s(Li,{tagName:"c-dismiss",init:[x("motion"),x("target")],augment:[Z,w,e=>bo(e,"target").switchMap(t=>t?R(e).tap(()=>{e.motion?Xo(e,t,e.motion).finalize(()=>t.remove()).subscribe():t.remove()}):k)]});function Pi(e,{target:t,clientX:o,clientY:r},n,i){if(!(t instanceof HTMLElement))throw new Error("Invalid Event Target");return{type:e,target:t,clientX:o,clientY:r,startX:n,startY:i}}function _p(){let e={},t=pe(e),o=new ke;return{dragging:t,dropping:o,elements:e,next:()=>t.next(e)}}var ht=_p();function Xp(e){return({target:t,moveTarget:o,delay:r})=>{let n=!1,i=0;r??=60;let a=o||t,c=t.style,{userSelect:l,transition:f}=c;return new z(h=>{function b(L,_=!0){n?(n=!1,a.style.transition=f,C?.unsubscribe(),h.next(L),delete ht.elements.mouse,_&&ht.dropping.next({element:a,event:L}),ht.next()):clearTimeout(i)}let E=0,T=0;function I(L){n&&L.key==="Escape"&&(L.preventDefault(),b({type:"end",target:t,clientX:0,clientY:0,startX:E,startY:T},!0))}function V(L,_){if(a.style.transition="none",!!t.isConnected){try{t.setPointerCapture(_)}catch(oe){console.error(oe)}n=!0,h.next(Pi("start",L,E,T)),C=v(window,"keydown").tap(I).subscribe()}}l=c.userSelect,c.userSelect="none";let C,D=d(e(t).switchMap(L=>{if(L.type==="pointerdown"){f=a.style.transition,L.preventDefault(),E=L.clientX,T=L.clientY;let _=L.pointerId;n=!1,i=setTimeout(V,r,L,_)}else if(L.type==="pointermove"){if(n){let _=Pi("move",L,E,T);h.next(_),ht.elements.mouse={element:a,event:_},ht.next()}}else return clearTimeout(i),F(L);return k}).debounceTime().tap(L=>b(Pi("end",L,E,T))),v(t,"click",{capture:!0}).tap(L=>{n&&L.target===t&&L.stopImmediatePropagation()})).subscribe();h.signal.subscribe(()=>{D.unsubscribe(),C?.unsubscribe(),c.userSelect=l})})}}function Wp(e){return e.style.touchAction||(e.style.touchAction="none"),v(e,"pointerdown").switchMap(t=>t.currentTarget?new z(o=>{o.next(t);let r=d(v(window,"pointermove").tap(n=>o.next(n)),d(v(window,"pointercancel"),v(window,"pointerup")).tap(n=>{o.next(n),r.unsubscribe()})).subscribe();o.signal.subscribe(()=>r.unsubscribe())}):k)}var qp=Xp(Wp);function dr(e){return qp(e)}function vl(e,t){let o=t.clientX,r=t.clientY;return e.left<o&&e.right>o&&e.top<r&&e.bottom>r}function Kp(e){let t=ht.elements,o=[],r;for(let n in t){let i=t[n];if(!i)continue;let{event:a,element:c}=i;c!==e&&(r||=e.getBoundingClientRect(),vl(r,a)&&o.push({type:"over",target:e,relatedTarget:c,clientX:a.clientX,clientY:a.clientY}))}return o}function Gp(e){let t=0;return ht.dragging.switchMap(()=>{let o=Kp(e);return t===0&&o.length===0?k:(t=o.length,F(o))})}function Jp(e){return Gp(e).switchMap(t=>t.length===0?F({type:"out",target:e,clientX:0,clientY:0}):Ze(t))}function Zp(e){return ht.dropping.switchMap(({element:t,event:o})=>e!==t&&vl(e.getBoundingClientRect(),o)?F({type:"drop",target:e,clientX:o.clientX,clientY:o.clientY,relatedTarget:t}):k)}function Qp(e,t){return{width:e.offsetWidth,height:e.offsetHeight,x:t.clientX,y:t.clientY,sx:t.clientX/e.offsetWidth,sy:t.clientY/e.offsetHeight}}function $p({target:e,moveTarget:t,axis:o}){let r;return n=>{let i=t||e;if(n.type==="start")r=Qp(i,n);else if(n.type==="end")i.style.transform="",r=void 0;else if(r){let a=o==="y"?0:(n.clientX-r.x)/r.width,c=o==="x"?0:(n.clientY-r.y)/r.height;return F({event:n,x:a,y:c,sx:r.sx,sy:r.sy})}return k}}function eu(e){return({x:t,y:o})=>{let r=(e.moveTarget||e.target).style;r.transform=`translate(${t*100}%, ${o*100}%)`}}function wl(e){let t=0;return d(v(e,"dragenter").tap(o=>{++t===1&&e.setAttribute("dragover",""),o.stopPropagation()}),v(e,"dragleave").tap(()=>{--t===0&&e.removeAttribute("dragover")}),v(e,"dragover").tap(o=>o.preventDefault()),v(e,"drop").tap(o=>{o.preventDefault(),o.stopPropagation(),e.removeAttribute("dragover"),t=0})).filter(o=>o.type==="drop")}function kl(e){let t=e.moveTarget||e.target;return d(dr(e).tap(o=>{o.type==="start"?t.toggleAttribute("dragging",!0):o.type==="end"&&t.toggleAttribute("dragging",!1)}).switchMap($p(e)).tap(eu(e)).ignoreElements(),Jp(t).tap(o=>t.toggleAttribute("dragover",o.type==="over")),Zp(t))}function Sl(e){return ht.dragging.map(t=>{for(let o in t)if(t[o]?.element===e)return!0;return!1}).distinctUntilChanged()}var El=class e extends g{dragging=!1;dragover=!1;target;static{s(e,{tagName:"c-drag-handle",init:[y("dragging"),y("dragover")],augment:[w,u(`
:host { display: block; cursor:grab; position: relative; touch-action: none; }
:host([dragging]) { z-index: 10 }
		`),t=>bo(t,"target").switchMap(o=>kl({target:t,moveTarget:o,delay:150}).tap(r=>t.handleDrag?.(r)))]})}};var fr=class extends g{center=!1};s(fr,{tagName:"c-backdrop",init:[y("center")],augment:[u(`
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

	`),e=>v(e,"keydown").tap(t=>t.stopPropagation()),w]});var mr=class extends tt{};s(mr,{tagName:"c-toggle-panel",augment:[w,ho,mt]});var tu=u(`
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
${U("small","#drawer { width: 360px }")}

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
`),gr=class extends g{open=!1;position;responsive;permanent=!1};s(gr,{tagName:"c-drawer",init:[y("open"),y("position"),x("responsive"),x("permanent")],augment:[tu,u(`
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
`),e=>{let t=pe(!1),o=d(p(e,"position"),t).raf(),r=()=>e.position==="right"||getComputedStyle(e).direction==="rtl",n=m(mr,{id:"drawer","motion-in":o.map(()=>e.permanent&&t.value?void 0:r()?"slideInRight":"slideInLeft"),"motion-out":o.map(()=>e.permanent&&t.value?void 0:r()?"slideOutRight":"slideOutLeft")},w),i=new fr;i.id="backdrop";let a=m("dialog",{id:"dialog"},i,n);return A(e).append(a),d(v(n,"close").tap(()=>a.close()),v(a,"close").tap(()=>e.open=!1),fe(e,"drawer.close").tap(()=>e.open=!1).ignoreElements(),B(n,"open").tap(c=>e.open=c),B(e,"open").raf(c=>{c||n.scrollTo(0,0)}),v(i,"click").tap(()=>e.open=!1),v(a,"cancel").tap(c=>{c.preventDefault(),e.open=!1}),p(e,"open").tap(c=>{if(t.value&&e.permanent)return n.open=!0;c?t.value||(ie.openModal({element:a,close:()=>e.open=!1}),a.getBoundingClientRect()):ie.currentModal?.element===a&&ie.modalClosed()}).raf(c=>{n.open=c}),p(e,"responsive").switchMap(c=>c!==void 0?fo(document.body):F("xsmall")).switchMap(c=>{let l=re.breakpoints[e.responsive||"large"],f=re.breakpoints[c]>=l;return t.next(f),f&&n.className!=="permanent"?a.close():!f&&n.className==="permanent"&&(e.open=!1),f&&e.open===!1&&(e.open=e.permanent),e.toggleAttribute("responsiveon",f),n.className=f?"permanent":"drawer",B(e,"open").tap(h=>{e.hasAttribute("responsiveon")||Ee({target:i,animation:h?"fadeIn":"fadeOut",options:{fill:"forwards"}})})}))}]});var Ri=class extends Ct{icon="arrow_right"};s(Ri,{tagName:"c-dropdown",init:[x("icon")],augment:[u(`
:host { display: flex; gap: 0; align-items: center; cursor: pointer; }
.icon { transition: rotate var(--cxl-speed); height:24px; width:24px; translate: -7px; margin-right: -6px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=m(ve,{className:"icon"});return e.shadowRoot?.append(t,m("slot")),d(p(e,"icon").tap(o=>t.name=o),v(e,"keydown").tap(o=>{o.key==="ArrowRight"?e.open=!0:o.key==="ArrowLeft"&&(e.open=!1)}))}]});function Nl({source:e,render:t,empty:o,append:r,loading:n}){let i=[],a=document.createDocumentFragment(),c,l;function f(h){if(l?.parentNode?.removeChild(l),!h)return;let b=0;for(let T of h){let I=i[b]?.item;if(I)I.value!==T&&I.next(T);else{let V=pe(T),C=t(V,b,h),D=C instanceof DocumentFragment?Array.from(C.childNodes):[C];i.push({elements:D,item:V}),a.append(C)}b++}a.childNodes.length&&r(a),c?.remove(),b===0&&o&&r(c=o());let E=i.length;for(;E-- >b;)i.pop()?.elements.forEach(T=>T.parentNode?.removeChild(T))}return G(()=>(l=n?.(),l&&r(l),e.raf(f)))}function $0(e){return Uo(()=>{let t=new qt;return[Nl({...e,append:o=>t.insert(o)}),t.end]})}function ou(e){if(e instanceof HTMLTemplateElement)return e;throw"Element must be a <template>"}function ru(e,t){let o=e.getRootNode();if(o instanceof Document)return ou(o.getElementById(t));throw new Error("Invalid root node")}function Cl(e,t){if(t){if(typeof t=="function")return t;if(typeof t=="string"&&(t=ru(e,t)),t instanceof HTMLTemplateElement)return()=>t.content.cloneNode(!0);throw new Error("Invalid template")}}function nu(e){return p(e,"template").switchMap(t=>t?F(Cl(e,t)):pt().map(()=>Cl(e,e.children[0])))}function iu(e,t,o){return nu(e).switchMap(r=>{let n=e.target?gt(e,e.target)??e:e;return r?Nl({source:t,render:o?(i,a,c)=>o(r(i,a,c)):r,append:i=>n.append(i)}):k})}var Vi=class extends g{source;template};s(Vi,{tagName:"c-each",init:[H("source"),H("template")],augment:[Z,w,e=>iu(e,p(e,"source"))]});var Oi=class extends _e{};s(Oi,{tagName:"c-field-bar",augment:[Xt,u(`
:host {
	box-sizing: border-box;
	${te("surface-container-high")}
	${N("body-large")}
	border-radius: var(--cxl-shape-corner-xlarge);
}
.content { padding: 8px 12px; }
		`)]});var Bi=class extends _e{};s(Bi,{tagName:"c-field-frame",augment:[u(`
slot[name=label] { ${N("body-large")} }
		`),Xt]});var Hi=class extends _e{};s(Hi,{tagName:"c-field-outlined",augment:[Xt,ii,u(`
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
	${N("body-large")}
	height: 0;
	top: var(--cxl-field-outlined-label-top, 16px);
	inset-inline-start: unset;
}
${Pn.map(e=>`:host([size="${e}"]) { --cxl-field-outlined-label-top: ${16+e*4}px }`)}
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
		`)]});var Yi=class extends g{vflex=!1;getContentRect(){return this.getBoundingClientRect()}};s(Yi,{tagName:"c-fieldset",init:[y("vflex")],augment:[S("group"),u(`
:host { display: block; }
slot[name=label] {
	display: block; ${N("body-large")}
	margin-bottom: 16px;
}
#bodyslot { display: flex; flex-wrap: wrap; gap: 8px 16px; }
:host([vflex]) #bodyslot { flex-direction: column; }
`),e=>et("field",e).tap(t=>{t.type==="connect"&&t.target(e)}),e=>{let t=m("slot",{name:"label"});return A(e).append(t,m("slot",{id:"bodyslot"})),d(F(void 0),v(t,"slotchange")).switchMap(()=>{let o=t.assignedElements()[0];return e.removeAttribute("aria-labelledby"),o?Re(o).tap(r=>e.setAttribute("aria-labelledby",r)):k})}]});var mn=class e extends g{elements=new Set;initialValue;static{s(e,{tagName:"c-form",augment:[S("form"),Z,t=>v(t,"submit",{capture:!0}).tap(o=>{o.preventDefault();let r;for(let n of t.elements)n.disabled||n.matches(":disabled")||(n.invalid&&(r??=n),n.touched=!0);r&&(r.focus(),o.stopPropagation(),o.stopImmediatePropagation())}),t=>et("form",t,t.elements).tap(o=>{let r=o.target,n=r.name,i=t.initialValue;i&&n&&n in i&&(r.value=i[n])}),t=>Qe(t,"enter").tap(()=>t.submit()),w]})}checkValidity(){let t=!0;for(let o of this.elements)o.disabled||o.matches(":disabled")||(o.invalid&&(t=!1),o.touched=!0);return t}reset(){for(let t of this.elements)t.formResetCallback()}submit(){Pe(this,"submit")}requestSubmit(){this.submit()}getElementByName(t){for(let o of this.elements)if(o.name===t)return o}setTouched(t){for(let o of this.elements)o.touched=t}setFormData(t){this.initialValue=t;for(let o in t){let r=this.getElementByName(o);r&&(r.value=t[o])}}getFormData(){let t={};for(let o of this.elements){if(o.disabled||o.matches(":disabled"))continue;let r=o.checked!==void 0?o.checked?o.value:void 0:o.value;o.name&&(o.checked!==!1||!Object.hasOwn(t,o.name))&&(t[o.name]=r)}return t}};function xr(e){let t=e.parentElement;for(;t;){if(t instanceof HTMLFormElement||t instanceof mn)return t;t=t.parentElement}}var ji=class extends g{};s(ji,{tagName:"c-form-submit",augment:[Z,w,e=>G(()=>{let t=xr(e);return t?d(R(e).tap(()=>{if(t instanceof HTMLFormElement){let o;for(let r of t.elements)r instanceof K&&(r.invalid&&(o??=r),r.touched=!0);o?.focus()}t.requestSubmit()})):k})]});var Ui=class extends g{};s(Ui,{tagName:"c-form-reset",augment:[Z,w,e=>R(e).tap(()=>xr(e)?.reset())]});function au(e){let t=new CSSStyleSheet;return A(e).adoptedStyleSheets.push(t),p(e,"columns").raf(()=>{let o=`repeat(${e.columns}, minmax(0,1fr))`;t.replaceSync(`:host{grid-template-columns:${o}}`)})}var _i=class extends g{rows;columns=12};s(_i,{tagName:"c-grid",init:[x("columns"),x("rows")],augment:[w,u(`
:host{display:grid;gap:16px;box-sizing:border-box;}
${U("medium",":host{gap:24px}")}
`),au]});var Xi=u(`
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
	${Qr}
}

${U("small",`
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
${U("large",`
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
`),To=class extends g{type;center=!1;full=!1};s(To,{init:[y("type"),y("center"),y("full")]});var hr=class extends To{};s(hr,{tagName:"c-layout",augment:[Xi,()=>m("div",{id:"body",part:"body"},m("slot"))]});var qi=u(`
:host { padding: 96px 16px; }
:host([dense]) { padding-top: 48px;padding-bottom:48px; }
${U("medium",":host {padding-left:32px;padding-right:32px}")}
${U("large",":host {padding-left:64px;padding-right:64px}")}
	`),Wi=class extends hr{dense=!1;color;center=!0;type="block"};s(Wi,{tagName:"c-section",init:[y("dense"),le("color")],augment:[qi]});var Ki=class extends To{dense=!1;color;center=!0;type="block"};s(Ki,{tagName:"c-hero",init:[y("dense"),le("color")],augment:[qi,Xi,u(`
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
	${N("body-large")}
}
		`),()=>m("div",{id:"body",part:"body"},m("slot"))]});var Gi=class extends g{pad;vertical=!1};s(Gi,{tagName:"c-hr",init:[y("pad"),y("vertical")],augment:[S("separator"),u(`
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
${ft.map(e=>`:host([pad="${e}"]){margin:${e}px 0;}`).join("")}`)]});var br=class extends ze{open=!1;iconon;iconoff=""};s(br,{tagName:"c-icon-button-toggle",init:[y("open"),x("iconon"),x("iconoff")],augment:[u(`
:host([open]:not([disabled])) {
	background-color: var(--cxl-color--secondary-container);
	color: var(--cxl-color--on-secondary-container);
}
`),e=>p(e,"open").pipe(Kr(e,"pressed")),e=>P(p(e,"open"),p(e,"iconon"),p(e,"iconoff")).tap(([t,o,r])=>e.icon=t&&o||r),e=>R(e).filter(()=>!e.disabled).tap(()=>e.open=!e.open)]});function Zi(e){return d(ee(()=>{let t=e.persistkey?Bn.get(e.persistkey):void 0;t!==void 0?e.open=t===e.themeon:e.usepreferred&&(e.open=matchMedia("(prefers-color-scheme: dark)").matches)}),lo(e).raf(()=>{e.setAttribute("aria-pressed",String(e.open));let t=e.open?e.themeon:e.themeoff;e.persistkey&&Bn.set(e.persistkey,t),Os(Ps[t]||t)}))}function su(e){return d(Zi(e),R(e).tap(()=>e.open=!e.open))}var Ji=class extends g{open=!1;usepreferred=!1;persistkey="";themeoff="";themeon="./theme-dark.js"};s(Ji,{tagName:"c-toggle-theme",init:[x("persistkey"),x("usepreferred"),x("open"),x("themeon"),x("themeoff")],augment:[S("group"),su]});var Qi=class extends br{usepreferred=!1;persistkey="";iconon="wb_sunny";iconoff="dark_mode";themeoff="";themeon="./theme-dark.js"};s(Qi,{tagName:"c-icon-toggle-theme",init:[x("persistkey"),x("usepreferred"),x("themeon"),x("themeoff")],augment:[Zi]});var lu=e=>{let t;function o(){let r=document.adoptedStyleSheets.indexOf(t);r!==-1&&document.adoptedStyleSheets.splice(r,1)}addEventListener("message",r=>{if(r.source!==parent||r.origin!==e)return;let n=r.data.theme;o(),typeof n=="string"&&(t=new CSSStyleSheet,t.replace(n).catch(i=>console.error(i)),document.adoptedStyleSheets.push(t))})},cu=e=>{let t=()=>{let o=()=>{parent.postMessage({height:document.documentElement.scrollHeight},e==="null"?"*":e)};requestAnimationFrame(()=>{document.fonts.ready.then(()=>{new ResizeObserver(o).observe(document.documentElement)},r=>console.error(r))})};document.readyState==="complete"?t():addEventListener("load",t)},$i=class extends g{src="";srcdoc="";sandbox="allow-forms allow-scripts";reset="<!DOCTYPE html><style>html{display:flex;flex-direction:column;font:var(--cxl-font-default);}body{padding:0;margin:0;translate:0;overflow:auto;}</style>";handletheme=!0;iframe=ge("iframe",{loading:"lazy"})};s($i,{tagName:"c-iframe",init:[x("src"),x("srcdoc"),x("sandbox"),x("handletheme")],augment:[u(`
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
	`),e=>{let t=e.iframe,o=ge("slot",{name:"loading"}),r=new CSSStyleSheet;e.shadowRoot?.adoptedStyleSheets.push(r),o.style.display="none";function n(c){r.replaceSync(":host{height:"+c+"px}"),t.style.height="100%",t.style.opacity="1",o.style.display="none"}function i(c){if(c){let l=JSON.stringify(e.ownerDocument.location.origin),f=`<script type="module">
(${cu.toString()})(${l});
(${lu.toString()})(${l});
<\/script>`;t.srcdoc=`${e.reset}${c}${f}`,o.style.display=""}}async function a(c){let l=new URL(c);return`${l.search||l.hash?`<script>history.replaceState(0,0,'about:srcdoc${l.search}${l.hash}');<\/script>`:""}<base href="${c}" />`+await fetch(c).then(f=>f.text())}return A(e).append(t,o),d(P(p(e,"srcdoc"),p(e,"src")).raf(([c,l])=>{(async()=>{i(l?await a(l):c)})().catch(()=>{})}),v(window,"message").tap(c=>{let l=c.data.height;c.source===t.contentWindow&&typeof l=="number"&&n(l)}),p(e,"handletheme").switchMap(c=>c?v(t,"load").switchMap(()=>uo.raf(l=>{let f=l?.css??"",h=e.ownerDocument.location.origin,b=h==="null"||t.hasAttribute("sandbox")&&!t.sandbox.contains("allow-same-origin")?"*":h;t.contentWindow?.postMessage({theme:f},b)})):k),p(e,"sandbox").tap(c=>c===void 0?t.removeAttribute("sandbox"):t.sandbox.value=c))}]});function pu(e){return new Promise((t,o)=>{let r=new Image;r.addEventListener("load",()=>t(r)),r.addEventListener("error",()=>o(new Error("Failed to load image"))),r.src=e})}async function gn(e){if(e instanceof ImageData)return e;if(e instanceof Blob){let o=URL.createObjectURL(e);try{return await gn(o)}finally{URL.revokeObjectURL(o)}}let t=await createImageBitmap(typeof e=="string"?await pu(e):e);try{let r=m("canvas",{width:t.width,height:t.height}).getContext("2d");if(!r)throw new Error("Could not create context");return r.drawImage(t,0,0),r.getImageData(0,0,t.width,t.height)}finally{t.close()}}async function Al(e,t){let o=Math.max(e.width,t.width),r=Math.max(e.height,t.height),n=o*r*4,i=new Uint8ClampedArray(n),a=0;for(let c=0;c<r;c++)for(let l=0;l<o;l++){let f=(c*o+l)*4,h=(c*e.width+l)*4,b=(c*t.width+l)*4,E=l<e.width&&c<e.height&&l<t.width&&c<t.height&&e.data[h]===t.data[b]&&e.data[h+1]===t.data[b+1]&&e.data[h+2]===t.data[b+2]&&e.data[h+3]===t.data[b+3];E||(a+=4),i[f]=i[f+3]=E?0:255}return{imageA:e,imageB:t,diffBytes:a,size:n,diff:new ImageData(i,o,r)}}async function T1(e,t){let[o,r]=await Promise.all([gn(e),gn(t)]);return Al(o,r)}var ea=class extends g{src1;src2;ratio=1;hidediff=!1;value};s(ea,{tagName:"c-image-diff",init:[x("src1"),x("src2"),O("ratio",0,1),y("hidediff"),H("value")],augment:[u(`
:host { display: block; }
.images { position: relative; }
.images canvas { position: absolute; top: 0; left: 0; height: auto; }
.images .diff { display: block; height: 100%; width: 100%; }
:host([hidediff]) .diff { visibility: hidden; }
.summary {
	color: var(--cxl-color-on-surface-variant);
	font-size: 0.75rem;
	margin: 0;
	padding: 8px 10px;
}
`),e=>{let t=m("canvas",{role:"img",ariaLabel:"Actual image",width:0,height:0}),o=m("canvas",{role:"img",ariaLabel:"Baseline image",width:0,height:0}),r=m("div",{className:"images"});function n(){let l=Math.max(t.width,o.width),f=Math.max(t.height,o.height);r.style.aspectRatio=l&&f?`${l} / ${f}`:"";for(let h of[t,o])h.hidden=!h.width,h.style.width=l?`${h.width/l*100}%`:""}let i=m("canvas",{className:"diff",role:"img",ariaLabel:"rendered diff"}),a=m("p",{className:"summary",ariaLive:"polite"});r.append(t,o,i),A(e).append(r,a);function c(l,f){return p(e,l).switchMap(h=>h?He(F(null),no(gn(h).catch(()=>{}))):F(void 0)).tap(h=>{f.width=h?.width??0,f.height=h?.height??0,h&&f.getContext("2d")?.putImageData(h,0,0),n()})}return d(P(c("src1",t),c("src2",o)).switchMap(async([l,f])=>(e.value=void 0,i.width=i.height=0,i.ariaLabel="rendered diff",a.textContent=e.src1&&e.src2?"Comparing images\u2026":"",l===null||f===null?null:l&&f?Al(l,f):void 0)).tap(l=>{if(l===null)return;if(!l){e.src1&&e.src2&&(a.textContent="Comparison unavailable");return}i.width=l.diff.width,i.height=l.diff.height,i.getContext("2d")?.putImageData(l.diff,0,0);let f=l.diffBytes/4,h=l.size?l.diffBytes/l.size*100:0,b=h>0&&h<.01?"<0.01":h.toFixed(2).replace(/\.00$/,"");a.textContent=`${f.toLocaleString()} changed pixels (${b}%) \xB7 actual ${l.imageA.width}\xD7${l.imageA.height} \xB7 baseline ${l.imageB.width}\xD7${l.imageB.height}`,i.ariaLabel=a.textContent,e.value=l}),p(e,"ratio").raf(l=>{o.style.opacity=l.toString()}))}]});var uu=Nt({"input.clear":"Clear input value"}),ta=class extends ze{icon="close"};s(ta,{tagName:"c-input-clear",augment:[e=>Es(e,uu("input.clear")),e=>Mt(e).switchMap(t=>R(e).tap(()=>t.value=""))]});function du(e,t){let o=e.trim(),r=[...o].filter(i=>/\d/.test(i)||i===t||i==="-").join("").replace(t,".").replace(/(?!^)-/g,"").replace(/^([^.]*\.[^.]*)\./,"$1"),n=parseFloat(r);if(!isNaN(n))return o.startsWith("(")&&o.endsWith(")")?-Math.abs(n):n}var oa=class extends we{value=void 0;locale;format;hidesymbol=!1;inputEl=m("input",{className:"input"})};s(oa,{tagName:"c-input-currency",init:[O("value"),x("locale"),H("format"),x("hidesymbol")],augment:[...Wt,e=>e.append(e.inputEl),e=>{let t=j.locale.value,o=r=>new Intl.NumberFormat(t.localeName,{currency:t.currencyCode,...e.format,style:"currency"}).formatToParts(r);return Ce({host:e,input:e.inputEl,toText:r=>r===void 0||isNaN(r)?"":o(r).filter(n=>!e.hidesymbol||n.type!=="currency").map(n=>n.value).join(""),toValue:r=>{let n=du(r,t.decimalSeparator);if(n===void 0)return;let i=o(n).filter(a=>["integer","fraction","decimal"].includes(a.type)).map(a=>a.type==="decimal"?".":a.value).join("");return Math.sign(n)*parseFloat(i)},update:d(el(e).tap(r=>t=r),p(e,"format"),p(e,"hidesymbol")).raf()})}]});function fu(e,t){return t.style.width="0",t.style.overflow="hidden",t.parentNode||e.append(t),d(d(v(t,"input"),v(t,"change")).map(o=>{if(o.stopPropagation(),e.dispatchEvent(new Event(o.type,{bubbles:!0})),t.files)return Array.from(t.files)}),R(e).tap(()=>t.click()).ignoreElements(),wl(e).map(o=>{if(o.stopPropagation(),o.dataTransfer?.files.length)return Array.from(o.dataTransfer.files)}))}var ra=class extends Eo{value=void 0;inputEl=ge("input",{tabIndex:-1,type:"file"})};s(ra,{tagName:"c-input-file",init:[H("value")],augment:[Z,w,e=>{let t=e.inputEl;return t.setAttribute("form","__cxl_ignore__"),e.append(t),d(Ht(e),fu(e,t).tap(o=>{e.value=o}))}]});var na=class e extends we{value=void 0;formatter=mu;inputEl=m("input",{className:"input"});static{s(e,{init:[x("value")],augment:[w,t=>t.append(t.inputEl),t=>Ce({host:t,input:t.inputEl,toText:(o,r)=>o!==void 0&&isNaN(o)?r:t.formatter(o),toValue:o=>{if(o===""){t.setValidity({key:"number",valid:!0});return}let r=Number(o);return t.setValidity({key:"number",valid:!isNaN(r)}),r}})]})}},ia=class extends na{};s(ia,{tagName:"c-input-number",augment:[...rr]});function mu(e){return e===void 0||isNaN(e)?"":e.toString()}var Ml=class e extends we{value="";inputEl=m("input",{type:"password",className:"input"});static{s(e,{tagName:"c-input-password",init:[x("value")],augment:[...Wt,t=>t.append(t.inputEl),t=>Ce({host:t,input:t.inputEl})]})}};var aa=class extends g{};s(aa,{tagName:"c-input-placeholder",augment:[u(`
:host {
	display: inline-block;
	pointer-events: var(--cxl-override-pointer-events, none);
	color: var(--cxl-color-on-surface-variant);
	position: absolute;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
	`),w,e=>{let t=en(e);return Mt(e).switchMap(o=>d(ue(o),p(o,"value"),p(o,"inputValue")).raf(()=>{let r=o.inputValue??o.value,n=r===void 0||r==="";t.replaceSync(`:host{top:${o.offsetTop}px;left:${o.offsetLeft}px;width:${o.offsetWidth}px;height:${o.offsetHeight}px;${n?"":"display:none;"}`)}))}]});var sa=class extends g{};s(sa,{tagName:"c-kbd",augment:[u(`
:host {
	box-sizing: border-box;
	display: inline-block;
	padding: 2px 8px;
	border-radius: var(--cxl-shape-corner-small);
	${te("surface-container-high")}
	${N("code")}
	border: 1px solid var(--cxl-color-outline-variant);
	box-shadow: var(--cxl-elevation-1);
}
		`),w]});function gu(e,t){return e?typeof e=="string"?(t.setAttribute("aria-label",e),k):Re(e).tap(o=>{e.textContent&&t.setAttribute("aria-labelledby",o)}).finalize(()=>{t.removeAttribute("aria-labelledby")}):k}var la=class extends g{};s(la,{tagName:"c-label",augment:[u(`
:host {
	display: inline-block;
}`),w,e=>li(e).switchMap(t=>p(t,"input").switchMap(o=>o?gu(e,o):k)),e=>ee(()=>{e.slot="label"})]});var ca=class extends g{items=[]};s(ca,{tagName:"c-list",augment:[u(":host{display:block;padding:8px 0;}"),S("listbox"),w,pn]});var vr=[u(`
:host {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	--cxl-color-ripple: var(--cxl-color-secondary-container);
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	${N("label-large")}
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
${je("slot::after")}
	`),Y,Ks,w],yr=class extends nt{size};s(yr,{tagName:"c-nav-item",init:[ce("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("option"),...vr]});var pa=class extends nt{icon="arrow_drop_down";open=!1;target;size};s(pa,{tagName:"c-nav-dropdown",init:[x("icon"),x("target"),y("open"),ce("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("treeitem"),...vr,u(`
:host { padding-inline: 16px 36px; }
.icon { position: absolute; inset-inline-end: 8px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host([open]) .icon { rotate: 180deg; }
		`),e=>Ot(e).raf(({target:t,open:o})=>t.open=o),e=>{let t=m(ve,{className:"icon"});return A(e).append(t),d(p(e,"icon").tap(o=>t.name=o))}]});var wr=class extends Ct{icon="more_vert";motion};s(wr,{tagName:"c-toggle-icon",init:[x("icon")],augment:[e=>{let t;return d(p(e,"icon").raf(o=>{if(!o)return t?.remove();t=go(o),A(e).append(t)}),p(e,"open").raf(()=>{t&&e.motion&&Ee({target:t,animation:e.motion,options:{direction:e.open?"normal":"reverse",fill:"both"}})}))}]});var ua=class extends nt{icon="arrow_right";open=!1;target;size};s(ua,{tagName:"c-nav-tree-item",init:[x("icon"),x("target"),y("open"),ce("size",e=>`{min-height:${56+e*8}px}`)],augment:[S("treeitem"),...vr,u(`
:host { padding-inline-start: 20px; }
.icon { position: absolute; inset-inline-start: 0px; transition: rotate var(--cxl-speed); height:24px;width:24px; }
:host(:dir(rtl)) .icon { rotate: 180deg; }
:host([open]) .icon { rotate: 90deg; }
		`),e=>{let t=m(wr,{className:"icon"});A(e).append(t);function o(r){if(Array.isArray(r)){for(let n of r)if(n.childNodes.length)return!0}else if(r?.childNodes.length)return!0;return!1}return d(p(e,"icon").tap(r=>t.icon=r),p(e,"open").tap(r=>{e.ariaExpanded=String(r),t.open=r}),p(e,"target").switchMap(()=>{let r=tn(e),n=o(r);return t.style.display=n?"":"none",t.target=r,r?Gr(e,Array.isArray(r)?r:[r]):k}),p(t,"open").tap(r=>e.open=r),v(e,"keydown").tap(r=>{r.key==="ArrowRight"?e.open=!0:r.key==="ArrowLeft"&&(e.open=!1)}))}]});var da=class extends Wo{};s(da,{tagName:"c-nav-target",augment:[S("group"),u(":host{display:block;padding-inline-start:12px;}")]});var fa=class extends g{};s(fa,{tagName:"c-nav-headline",augment:[u(`
:host{
	color:var(--cxl-color-on-surface-variant);
	font:var(--cxl-font-title-small);
	letter-spacing:var(--cxl-letter-spacing-title-small);
	min-height:48px;
	display:flex;
	align-items: center;
	padding: 0 16px;
}
`),w]});var kr=class extends ze{open=!1;target;icon="menu"};s(kr,{tagName:"c-navbar-toggle",init:[x("target"),H("open")],augment:[e=>Ot(e).tap(({target:t,open:o})=>t.open=o)]});var Do=class extends jt{duration=4e3;"motion-in"="slideInUp,fadeIn";"motion-out"="fadeOut";open=!1;static=!1};s(Do,{tagName:"c-snackbar",init:[y("open"),O("duration"),x("motion-in"),x("motion-out"),x("static")],augment:[u(`
:host {
	display: inline-flex;
	justify-content: left;
	margin: 16px auto;
	border: 0; outline: 0;
	top: auto;
}
slot[name=action] { margin-inline-start: auto; display: block; }
	`),()=>m("slot",{name:"action"}),e=>p(e,"open").tap(t=>{t&&!e.static&&(e.popover="manual",e.showPopover())}),ho,mt,e=>v(e,"close").tap(()=>e.remove())]});var Sr=class extends g{queue=[];notify(t){let o;return typeof t=="string"?o=m(Do,void 0,t):t instanceof HTMLElement?o=t:o=m(Do,t,t.content),new Promise(r=>{this.queue.push([o,r]),this.queue.length===1&&this.queue[0]&&this.notifyNext(this.queue[0])})}notifyNext([t,o]){let r=()=>{this.queue.shift(),t.removeEventListener("close",r),o(),this.queue[0]&&this.notifyNext(this.queue[0])};this.shadowRoot?.append(t),t.addEventListener("close",r),t.open=!0}};s(Sr,{tagName:"c-snackbar-container",augment:[u(`
:host {
	position:relative; width: 100%; height: 0;
	display: flex; text-align:center; align-items: end;
	overflow: visible;
}`)]});var Tl;function NS(e){let t;return typeof e=="string"?e={content:e}:e instanceof HTMLElement||(t=e.container),t||(t=Tl??=new Sr,t.parentNode||document.body.appendChild(t)),t.notify(e)}function AS(e){Tl=e}var ma=class extends g{};s(ma,{tagName:"c-page",augment:[nn,u(`
:host {
	box-sizing:border-box;
	display: flex;
	flex-direction: column;
	/* height:100% affects sticky appbar positioning */
	min-height: 100vh;
	padding-top: 0; padding-bottom: 0;
	${te("background")}
}`),w]});var Er=class extends g{xs=!1;sm=!1;md=!1;lg=!1;xl=!1};s(Er,{tagName:"c-r",init:[y("xl"),y("lg"),y("md"),y("sm"),y("xs")],augment:[u(`
:host([xs]),:host { display:contents }
:host([xs="0"]) { display:none }
${U("small",':host([sm]){display:contents}:host([sm="0"]){display:none}')}
${U("medium",':host([md]){display:contents}:host([md="0"]){display:none}')}
${U("large",':host([lg]){display:contents}:host([lg="0"]){display:none}')}
${U("xlarge",':host([xl]){display:contents}:host([xl="0"]){display:none}')}
	`),w]});var ga=class extends g{};s(ga,{tagName:"c-page-appbar",augment:[u(`
:host { display: contents; }
#appbar { padding-top: 20px; padding-bottom: 20px; }
#toolbar { max-width: 1200px; width: 100%; margin: auto; gap: 16px; }
${U("small","#toolbar { gap: 24px; }")}
		`),e=>{let t=ge(gr,{id:"drawer"},ge("nav",void 0,ge("slot",{name:"navbar"})));return ge(Go,{$:()=>ws(e,"toggle.close",t,!0),id:"appbar",sticky:!0},ge(We,{id:"toolbar"},ge(Er,{xs:!0,md:0},ge(kr,{ariaLabel:"Toggle navigation menu",target:t})),ge("slot")),t)}]});var xa=class extends g{value=1/0;color},Dl={duration:2e3,iterations:1/0,easing:"cubic-bezier(0.4, 0, 0.6, 1)"};s(xa,{tagName:"c-progress",init:[x("value"),le("color","primary",".bar")],augment:[S("progressbar"),po("valuemax","1"),u(`
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
	`),e=>{let t,o,r=m("div",{className:"bar"}),n=m("div",{className:"bar"});return A(e).append(r,n),p(e,"value").tap(i=>{i!==1/0&&i>1?i=1:i<0&&(i=0),e.ariaValueNow=i===1/0?null:String(i),e.ariaBusy=String(i!==1),e.toggleAttribute("indeterminate",i===1/0),i===1/0?(t=Ee({target:r,animation:{kf:{transform:["translateX(-100%) scaleX(0.3)","translateX(0%) scaleX(0.8)","translateX(100%) scaleX(0.3)"]},options:Dl}}),o=Ee({target:n,animation:{kf:{transform:["translate(-150%, -100%) scaleX(0.4)","translate(-50%, -100%) scaleX(0.6)","translate(100%, -100%) scaleX(0.4)"]},options:Dl}})):(t?.cancel(),o?.cancel()),r.style.transform=i===1/0?"":"scaleX("+i+")"})},vo]});var ha=class extends g{value=1/0};s(ha,{tagName:"c-progress-circular",init:[O("value")],augment:[S("progressbar"),po("valuemax","1"),u(`
:host {
	display: inline-block;
	width: 48px;
	height: 48px;
}
svg { width: 100%; height: 100% }
		`),e=>{let t=ko("svg",{viewBox:"0 0 100 100"}),o=ko("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-secondary-container);fill:transparent;stroke-width:10%;stroke-dasharray:282.743px"}),r=ko("circle",{cx:"50%",cy:"50%",r:"45",style:"stroke:var(--cxl-color-primary);fill:transparent;transition:stroke-dashoffset var(--cxl-speed);stroke-width:10%;transform-origin:center;stroke-dasharray:282.743px"});return t.append(o,r),A(e).append(t),p(e,"value").switchMap(n=>{if(e.ariaValueNow=n===1/0?null:String(n),e.ariaBusy=String(n!==1),n!==1/0){let a=282.743-282.743*Math.max(0,Math.min(1,n));r.style.strokeDashoffset=`${a}px`,r.style.transform="rotate(-90deg)"}return n===1/0?d(_o({target:e,animation:"spin",options:{iterations:1/0,duration:2e3,easing:"linear"}}),_o({target:r,animation:{options:{duration:4e3,iterations:1/0,easing:"cubic-bezier(.35,0,.25,1)"},kf:((i,a)=>[{offset:0,strokeDashoffset:i,transform:"rotate(0)"},{offset:.125,strokeDashoffset:a,transform:"rotate(0)"},{offset:.12501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.25,strokeDashoffset:i,transform:"rotateX(180deg) rotate(72.5deg)"},{offset:.2501,strokeDashoffset:i,transform:"rotate(270deg)"},{offset:.375,strokeDashoffset:a,transform:"rotate(270deg)"},{offset:.37501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5,strokeDashoffset:i,transform:"rotateX(180deg) rotate(161.5deg)"},{offset:.5001,strokeDashoffset:i,transform:"rotate(180deg)"},{offset:.625,strokeDashoffset:a,transform:"rotate(180deg)"},{offset:.62501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.75,strokeDashoffset:i,transform:"rotateX(180deg) rotate(251.5deg)"},{offset:.7501,strokeDashoffset:i,transform:"rotate(90deg)"},{offset:.875,strokeDashoffset:a,transform:"rotate(90deg)"},{offset:.87501,strokeDashoffset:a,transform:"rotateX(180deg) rotate(341.5deg)"},{offset:1,strokeDashoffset:i,transform:"rotateX(180deg) rotate(341.5deg)"}])((282.743*(1-.05)).toString(),(282.743*(1-.8)).toString())}})):k})},vo]});var Cr=new Set,Il=class e extends K{checked=!1;value="on";defaultChecked=!1;defaultTabIndex=0;groupOwner;groupName;static{s(e,{tagName:"c-radio",init:[y("checked"),x("value")],augment:[S("radio"),u(`
:host {
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;
	outline: none;
	${N("body-large")}
	line-height: 18px;
	column-gap: 16px;
	text-align: start;
	padding: 15px;
}
:host(:empty) {
  margin: -15px;
  background-color: transparent;
}
.box {
	--cxl-color-on-surface: var(--cxl-color-on-surface-variant);
	border: 2px solid var(--cxl-color-on-surface);
	width: 18px;
	height: 18px;
	box-sizing: border-box;
	flex-shrink: 0;
	display: inline-block;
	border-radius: 14px;
	position: relative;
}
.box::after {
	position: absolute;
	display: block;
	content: '';
	border-radius: 10px;
	width: 10px;
	height: 10px;
	transition: scale var(--cxl-speed);
	scale: 0;
	margin: 2px 0 0 2px;
	background-color: var(--cxl-color-on-surface);
}
.box::before {
	position: absolute;
	display: block;
	content: '';
	width: 40px; height: 40px;
	border-radius: 100%;
	translate: -13px -13px;
}
${je(".box::before")}
:host([checked]) .box::after {
	scale: 1;
}
:host([checked]) .box {
	--cxl-color-on-surface: var(--cxl-color-primary);
}
:host([invalid][touched]) .box {
	--cxl-color-on-surface: var(--cxl-color-error);
}
:host([disabled]) .box, :host(:disabled) .box {
	--cxl-color-on-surface: var(--cxl-color--on-surface);
	opacity: 0.38;
}
		`),Y,t=>(t.defaultTabIndex=t.hasAttribute("tabindex")?t.tabIndex:0,Ie(t)),t=>(t.defaultChecked=t.checked,A(t).append(m("div",{className:"box"}),m("slot")),new z(o=>{Cr.add(t),t.syncGroups(),d(d(B(t,"checked"),B(t,"name"),B(t,"disabled"),B(t,"value")).tap(()=>t.syncGroups()),R(t).tap(()=>t.select()),v(t,"keydown").tap(r=>{if(t.isDisabled()||!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(r.key))return;r.preventDefault(),r.stopPropagation();let n=t.group().filter(c=>!c.isDisabled()),i=r.key==="ArrowUp"||r.key==="ArrowLeft"?-1:1,a=n[(n.indexOf(t)+i+n.length)%n.length];a?.focus(),a?.select()})).subscribe({signal:o.signal}),o.signal.subscribe(()=>{Cr.delete(t),t.syncGroups(!1)})}))]})}formAssociatedCallback(){this.syncGroups()}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}scope(){let t=xr(this);return!this.hasAttribute("form")&&t&&!(t instanceof HTMLFormElement)?t:se(this).form??this.getRootNode()}group(){if(!this.name)return[this];let t=this.scope();return[...Cr].filter(o=>o.name===this.name&&o.scope()===t).sort(fs)}syncGroups(t=this.checked){let o=this.group(),r=new Set(o);for(let i of Cr)this.groupName&&i.name===this.groupName&&i.scope()===this.groupOwner&&r.add(i);if(this.groupOwner=this.scope(),this.groupName=this.name,t)for(let i of o)i!==this&&(i.checked=!1);let n=new Set;for(let i of r){if(!Cr.has(i)||n.has(i))continue;let a=i.group(),c=a.filter(f=>!f.isDisabled()),l=c.find(f=>f.checked)??c[0];for(let f of a){n.add(f),f.ariaChecked=String(f.checked),f.ariaDisabled=f.isDisabled()?"true":null,f.setFormValue(f.value),f.tabIndex=f===l?f.defaultTabIndex:-1;let h=f.validMap.required;h&&f.setValidity(h,a)}}}isDisabled(){return this.disabled||this.matches(":disabled")}select(){this.isDisabled()||this.checked||(this.checked=this.touched=!0,this.dispatchEvent(new Event("change",{bubbles:!0})))}setValidity(t,o=this.group()){return t.key==="required"&&(t={...t,valid:o.some(r=>r.checked&&Zo(r.value))}),super.setValidity(t)}formDisabledCallback(){this.syncGroups(!1)}setFormValue(t){se(this).setFormValue(this.checked?String(t):null)}};function zl(e,t,o=()=>m(ve,{name:"star",fill:!0})){let r=[],n,i=0;for(;i<e;i++)n=o(i),n.classList.add(t),r.push(n);if(e!==i){let a=e+1-i;if(n&&a){let c=`${a*100}%`;n.style.clipPath=`polygon(0 0, ${c} 0, ${c} 100%, 0 100%)`}}return r}var ba=class extends g{max=5;rating=0;alt};s(ba,{tagName:"c-rating",init:[O("max"),O("rating"),y("alt")],augment:[S("img"),u(`
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
	`),e=>Tt({source:p(e,"max"),renderFn:()=>m("span",void 0,...zl(e.max,"bgstar"))})(e),e=>Tt({source:p(e,"rating"),renderFn:t=>m("span",{className:"group"},...zl(Number(t)>e.max?e.max:Number(t),"star"))})(e)]});var xu=/([^&=]+)=?([^&]*)/g,hu=/:([\w$@]+)/g,bu=/\/\((.*?)\)/g,yu=/(\(\?)?:\w+/g,vu=/\*\w+/g,wu=/[-{}[\]+?.,\\^$|#\s]/g,Na="@@cxlRoute",qe={location:window.location,history:window.history};function ku(e){let t=[];return[new RegExp("^/?"+e.replace(wu,"\\$&").replace(bu,"\\/?(?:$1)?").replace(yu,function(r,n){return t.push(r.slice(1)),n?r:"([^/?]*)"}).replace(vu,"([^?]*?)")+"(?:/$|\\?|$)"),t]}function Su(e){return e[0]==="/"&&(e=e.slice(1)),e.endsWith("/")&&(e=e.slice(0,-1)),e}function ya(e,t){return t?e.replace(hu,(o,r)=>t[r]||""):e}function Eu(e){let t={},o;for(;o=xu.exec(e);)o[1]!==void 0&&(t[o[1]]=decodeURIComponent(o[2]??""));return t}var va=class{path;regex;parameters;constructor(t){this.path=t=Su(t),[this.regex,this.parameters]=ku(t)}_extractQuery(t){let o=t.indexOf("?");return o===-1?{}:Eu(t.slice(o+1))}getArguments(t){let r=this.regex.exec(t)?.slice(1);if(!r)return;let n=this._extractQuery(t);return r.forEach((i,a)=>{let c=a===r.length-1?i||"":i?decodeURIComponent(i):"",l=this.parameters[a];l&&(n[l]=c)}),n}test(t){return this.regex.test(t)}toString(){return this.path}},wa=class{id;path;parent;redirectTo;definition;isDefault;constructor(t){if(t.path!==void 0)this.path=new va(t.path);else if(!t.id)throw console.log(t),new Error("An id or path is mandatory. You need at least one to define a valid route.");this.id=t.id||(t.path??`route${crypto.randomUUID()}`),this.isDefault=t.isDefault||!1,this.parent=t.parent,this.redirectTo=t.redirectTo,this.definition=t}create(t){let o=this.definition.render();return o[Na]=this,Object.assign(o,t),o}},ka=class{routes=[];defaultRoute;findRoute(t){return this.routes.find(o=>o.path?.test(t))??this.defaultRoute}get(t){return this.routes.find(o=>o.id===t)}register(t){if(t.isDefault){if(this.defaultRoute)throw new Error("Default route already defined");this.defaultRoute=t}this.routes.unshift(t)}};function Cu(e){return e[Na]}function Sa(e,t){let o=new URL(e,`http://localhost/${t}`);return{path:o.pathname.slice(1),hash:o.hash.slice(1)}}var Nu={getHref(e){return`${qe.location.pathname}${e.path?`?${e.path}`:""}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Nr()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&qe.history.pushState({url:e},"",o)}},deserialize(){return{path:qe.location.search.slice(1),hash:qe.location.hash.slice(1)}}};function Nr(){return qe.history.state}var Au={getHref(e){return`${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Nr()?.url;if(e.hash!==t?.hash||e.path!==t.path){let o=this.getHref(e);o!==`${location.pathname}${location.search}${location.hash}`&&qe.history.pushState({url:e},"",o||"/")}},deserialize(){return{path:qe.location.pathname,hash:qe.location.hash.slice(1)}}},Fl={getHref(e){return`#${e.path}${e.hash?`#${e.hash}`:""}`},serialize(e){let t=Fl.getHref(e);qe.location.hash!==t&&(qe.location.hash=t)},deserialize(){return Sa(qe.location.hash.slice(1),"")}},Io={hash:Fl,path:Au,query:Nu},Ea=class{callbackFn;state;routes=new ka;instances={};root;lastGo;constructor(t){this.callbackFn=t}getState(){if(!this.state)throw new Error("Invalid router state");return this.state}route(t){let o=new wa(t);return this.routes.register(o),o}go(t){this.lastGo=t;let o=this.state?.url,r=typeof t=="string"?Sa(t,o?.path??""):t,n=r.path;if(n!==o?.path){let i=this.routes.findRoute(n);if(!i)throw new Error(`Path: "${n}" not found`);let a=i.path?.getArguments(n);if(i.redirectTo)return this.go(ya(i.redirectTo,a));let c=this.execute(i,a);if(this.lastGo!==t)return;if(!this.root)throw new Error(`Route: "${n}" could not be created`);this.updateState({url:r,arguments:a,route:i,current:c,root:this.root})}else this.state&&r.hash!==o.hash&&this.updateState({...this.state,url:r})}getPath(t,o){let n=this.routes.get(t)?.path;return n&&ya(n.toString(),o)}isActiveUrl(t){let o=this.state?.url;if(!o)return!1;let r=Sa(t,o.path);return!!Object.values(this.instances).find(n=>{let i=n[Na],a=this.state?.arguments;if(i?.path?.test(r.path)&&(!r.hash||r.hash===o.hash)){if(a){let c=i.path.getArguments(r.path);for(let l in c)if(a[l]!==c[l])return!1}return!0}return!1})}updateState(t){this.state=t,this.callbackFn?.(t)}findRoute(t,o){let r=this.instances[t];return r&&Object.assign(r,o),r}executeRoute(t,o,r){let n=t.parent,i=n&&this.routes.get(n),a=t.id,c=i&&this.executeRoute(i,o,r),l=this.findRoute(a,o)||t.create(o);return c?c.isSameNode(l.parentNode)||c.appendChild(l):this.root=l,r[a]=l,l}discardOldRoutes(t){let o=this.instances;for(let r in o){let n=o[r];n&&t[r]!==n&&(n.parentNode?.removeChild(n),delete o[r])}}execute(t,o){let r={},n=this.executeRoute(t,o||{},r);return this.discardOldRoutes(r),this.instances=r,n}},Dt=new ro,Ll=new ro,me=new Ea(()=>Dt.next());function SE(e){return t=>{let o=typeof e=="string"?{path:e}:e;me.route({...o,render:()=>new t})}}function EE(e=""){return t=>{let o=typeof e=="string"?{path:e}:e;me.route({...o,isDefault:!0,render:()=>new t})}}function CE(e){return Dt.map(()=>me.isActiveUrl(e))}function Mu(e){let t=e;for(;t;){let o=t instanceof HTMLElement&&t.scrollHeight>t.clientHeight?t:null;if(o&&o.scrollTop!==0){o.scrollTo(0,0);return}if(t.assignedSlot){t=t.assignedSlot;continue}if(t.parentElement){t=t.parentElement;continue}let r=t.getRootNode();t=r instanceof ShadowRoot?r.host:null}}function Aa(e){let t;return Dt.tap(()=>{let{root:o}=me.getState();o.parentNode!==e&&e.appendChild(o),t&&t!==o&&t.parentNode===e&&e.removeChild(t),t=o}).raf(()=>{let o=me.getState().url;o.hash?e.querySelector(`#${o.hash},a[name="${o.hash}"]`)?.scrollIntoView():Nr()?.lastAction!=="pop"&&e.parentElement&&Mu(e)})}function Pl(e,t=Io.query){return d(ee(()=>{Ll.next(t)}),e.tap(()=>me.go(t.deserialize())),Dt.tap(()=>t.serialize(me.getState().url))).catchError(o=>{if(o instanceof Error&&o.name==="SecurityError")return k;throw o})}function Tu(){return Dt.switchMap(()=>{let e=me.getState(),t=[],o=e.current;do{let r=o.routeTitle;r&&t.unshift(r instanceof z?r:F(r))}while(o=o.parentNode);return P(...t)}).tap(e=>document.title=e.join(" - "))}function Rl(){return He(F(location.hash.slice(1)),v(window,"hashchange").map(()=>location.hash.slice(1)))}var xn;function Du(){if(!xn){xn=new Ro(history.state);let e=history.pushState;history.pushState=function(...t){let o=e.apply(this,t),r=Nr();return r&&(r.lastAction="push",xn?.next(r)),o}}return d(v(window,"popstate").map(()=>{let e=Nr();return e&&(e.lastAction="pop",e)}),xn)}function Vl(){let e;return d(Rl(),Du()).map(()=>window.location).filter(t=>{let o=t.href!==e;return e=t.href,o})}function Iu(e,t=Io.query,o){let r=typeof t=="string"?Io[t]:t,n=o||(r===Io.hash?Rl():Vl());return d(Aa(e),Pl(n,r),Tu())}function NE(e=Io.query,t){return o=>Iu(o,e,t)}var AE=Dt.raf().map(()=>{let e=[],t=me.getState(),o=t.current;do o.routeTitle&&e.unshift({title:o.routeTitle,first:o===t.current,path:zu(o)});while(o=o.parentNode);return e});function zu(e){let t=Cu(e);return t&&ya(t.path?.toString()||"",me.state?.arguments||{})}function ME(e){return R(e).tap(t=>{t.preventDefault(),e.external?location.assign(e.href):me.go(e.href)})}function hn(e,t,o=t){return d(P(Ll,lo(e)).tap(([r])=>{e.href!==void 0?t.href=e.external?e.href:r.getHref(e.href):t.removeAttribute("href"),t.target=e.target||""}),R(t).tap(r=>{e.target||r.preventDefault()}),R(o).tap(()=>{e.href!==void 0&&!e.target&&(e.external?location.assign(e.href):me.go(e.href))}))}function Fu(e,t){let o=document.createElement("div");return o.style.display="contents",Object.assign(o,{routeTitle:t}),o.appendChild(e.content.cloneNode(!0)),o}var Ca=class extends g{strategy="query";get state(){return me.state}go(t){return me.go(t)}};s(Ca,{tagName:"c-router",init:[x("strategy")],augment:[e=>{function t(o){let r=o.dataset;if(r.registered)return;r.registered="true";let n=r.title||void 0;me.route({path:r.path,id:r.id||void 0,parent:r.parent||void 0,isDefault:o.hasAttribute("data-default"),redirectTo:r.redirectto,render:Fu.bind(null,o,n)})}return pt().switchMap(()=>{for(let o of Array.from(e.children))o instanceof HTMLTemplateElement&&t(o);return d(Hr(e).tap(o=>{o.type==="added"&&o.value instanceof HTMLTemplateElement&&t(o.value)}),p(e,"strategy").switchMap(o=>{let r=Io[o];return Pl(Vl(),r).catchError((n,i)=>(console.error(n),i))}))})}]});function Ar(e,t=e){return d(Lu(e,t).ignoreElements(),P(Dt,p(e,"href")).map(()=>e.href!==void 0&&me.isActiveUrl(e.href)))}function Lu(e,t=e){let o=m("a",{tabIndex:-1,className:"link",ariaLabel:"link"});return o.style.cssText=`
text-decoration: none;
outline: 0;
display: block;
position: absolute;
left: 0;
right: 0;
bottom: 0;
top: 0;
	`,A(e).append(o),d(hn(e,o),v(o,"click").tap(r=>{r.stopPropagation(),Yo(r)||e.dispatchEvent(new PointerEvent(r.type,r)),ne(e,"drawer.close",void 0)}),R(t).tap(r=>{Yo(r)&&o.click()}))}var Ma=class extends g{href};s(Ma,{tagName:"c-router-selectable",init:[x("href")],augment:[Z,()=>m("slot"),e=>G(()=>{let t=e.parentElement;if(!t||!("selected"in t))throw new Error("Invalid selectable parent");return Ar(e,t).raf(o=>{t.selected=o})})]});var Ta=class extends yr{href;external=!1;target};s(Ta,{tagName:"c-router-item",init:[x("href"),x("external"),x("target")],augment:[e=>Ar(e).tap(t=>{e.selected=t})]});var bn=class extends g{selected=!1;touched=!1;disabled=!1;name};s(bn,{init:[y("touched"),y("selected"),y("disabled"),x("name")],augment:[S("tab"),Ie,e=>Se("tabs",e),e=>p(e,"name").switchMap(t=>t?R(e).tap(()=>e.selected=!0):k),e=>p(e,"selected").tap(t=>{e.setAttribute("aria-selected",t?"true":"false")})]});var Mr=class extends bn{};s(Mr,{tagName:"c-tab",augment:[u(`
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
${U("small",":host { flex-grow: 0 }")}
		`),he,Y,kt,w]});var Da=class extends Mr{href};s(Da,{tagName:"c-router-tab",init:[x("href")],augment:[e=>Ar(e).tap(t=>{e.selected=t})]});var Tr=class extends g{href;focusable=!1;external=!1;dismiss=!1;target};s(Tr,{tagName:"c-router-link",init:[x("href"),x("focusable"),x("external"),x("target"),x("dismiss")],augment:[u(`
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
	`),e=>{let t=m("a",{className:"link"},m("slot"));return A(e).append(t),d(p(e,"focusable").tap(o=>t.tabIndex=o?0:-1),on(e),hn(e,t))}]});var Ia=class extends Tr{focusable=!0};s(Ia,{tagName:"c-router-a",augment:[u(`
:host{text-decoration:underline;}
.link { display:inline-block; }
:host(:focus-within) .link { outline:var(--cxl-color-primary) auto 1px; }
`)]});var za=class extends g{};s(za,{tagName:"c-router-outlet",init:[],augment:[S("main"),Z,Aa,w]});function La(e,t,o){let r=e[t];return o?-r:r}function Pu(e,t,o,r){e[t]=o?-r:r}function Ru(e,t){return e==="x"&&getComputedStyle(t).direction==="rtl"}function Fa(e,t){return Number.isFinite(e)&&e>0?e:t}function Pa(e,t){if(!Number.isSafeInteger(e)||e<0)throw new Error(`${t} must be a non-negative safe integer.`)}function Bl(e){let t=e.estimateSize??50;if(!Number.isFinite(t)||t<=0)throw new Error("estimateSize must be a positive finite number.");let o=e.overscan??0;if(!Number.isFinite(o)||o<0)throw new Error("overscan must be a non-negative finite number.");return Pa(e.dataLength,"dataLength"),{estimateSize:t,overscan:o}}function Ol(e){let t=e>>>0;if(t!==0)return(t&-t)>>>0;let o=Math.floor(e/4294967296);return((o&-o)>>>0)*4294967296}var Ra=class{length;estimate;tree=new Map;measured=new Map;totalDelta=0;constructor(t,o){this.length=t,this.estimate=o}get totalSize(){return this.length*this.estimate+this.totalDelta}get(t){return this.measured.get(t)??this.estimate}update(t,o){if(t<0||t>=this.length||!Number.isFinite(o)||o<=0)return!1;let r=this.get(t);if(r===o)return!1;o===this.estimate?this.measured.delete(t):this.measured.set(t,o);let n=o-r;return this.totalDelta+=n,this.add(t,n),!0}offsetOf(t){t=Math.max(Math.min(t,this.length),0);let o=0;for(let r=t;r>0;r-=Ol(r))o+=this.tree.get(r)??0;return t*this.estimate+o}find(t){if(this.length===0)return{index:0,offset:0};t=Math.max(Math.min(t,this.totalSize),0);let o=0,r=0,n=1;for(;n*2<=this.length;)n*=2;for(;n>=1;n/=2){let i=o+n;if(i>this.length)continue;let a=r+n*this.estimate+(this.tree.get(i)??0);a<=t&&(o=i,r=a)}return o>=this.length?{index:this.length-1,offset:this.get(this.length-1)}:{index:o,offset:t-r}}resize(t){if(t!==this.length){this.length=t;for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}}reset(t=0){for(let o of this.measured.keys())o>=t&&this.measured.delete(o);this.rebuild()}add(t,o){for(let r=t+1;r<=this.length;r+=Ol(r)){let n=(this.tree.get(r)??0)+o;Math.abs(n)<1e-9?this.tree.delete(r):this.tree.set(r,n)}}rebuild(){this.tree.clear(),this.totalDelta=0;for(let[t,o]of this.measured){let r=o-this.estimate;this.totalDelta+=r,this.add(t,r)}}};function xC(e){let{estimateSize:t,overscan:o}=Bl(e);return G(()=>Hl(e,t,o))}function Hl(e,t,o){function r(){bt=I[L];let M=getComputedStyle(I);Jt=parseFloat(M[be])||0,Fr=parseFloat(M[Fe])||0,Ae=Math.max(bt-Jt-Fr,0),Zt=T==="x"&&M.direction==="rtl",at=!1}function n(M){let X=M[_];return Zt?-X:X}function i(M){throw console.error(`Faulty element detected: 
The provided element has an invalid or unmeasurable size. Check that the "${L}" of the element is not zero or negative. Make sure the element is styled properly and any necessary dimensions are set correctly before rendering.`),console.log(M),new Error("Rendered element size returned invalid value.")}function a(M,X){let J=M[L],Q=M[_];if((!Number.isFinite(J)||J<=0||!Number.isFinite(Q)||!Number.isFinite(Q+J))&&i(M),M instanceof Element){Qt.add(M);let q=st.get(M);q?(q.index=X,q.rect=M,q.size=J):(st.set(M,{index:X,rect:M,size:J}),yt?.observe(M))}return M}function c(){for(let M of st.keys())Qt.has(M)||(yt?.unobserve(M),st.delete(M))}function l(M,X,J){let Q=0,q=-X,$=0,Ke=0,Ft,lt=0,Ve,$t=0,Ge,Me=0,Le=[],ye;M>0&&(ye=V(M-1,Q++,"pre"));let Vr=-X,Oe=M,Sn=W.get(M);for(;Oe<Ne&&(Le.length===0||Vr<J);)Le.push(V(Oe,Q++,"on")),Vr+=Math.min(W.get(Oe++),Sn);Oe<Ne&&Le.push(V(Oe,Q++,"post"));let Lt=M,ct;ye&&(a(ye,M-1),lt=ye[L],q=-(W.get(M-1)+X),Ft=n(ye));for(let Be=0;Be<Le.length;Be++){let eo=Le[Be];if(!eo)break;let to=M+Be,os=a(eo,to),Po=n(os),rs=os[L];if(Me===0&&($=Po,Ft!==void 0)){let En=Po-Ft,ns=Fa(En,lt);W.update(M-1,ns),q=-(ns+X)}if(Ve!==void 0&&Ge!==void 0){let En=Po-Ve;W.update(Ge,Fa(En,$t))}if(Ve=Po,$t=rs,Ge=to,Ke=Po+rs,Me++,Lt=to+1,Ke-$-X>=J){ct=Le[Be+1];break}}if(Lt===Ne&&Ge!==void 0)W.update(Ge,$t);else if(ct&&Ge!==void 0&&Ve!==void 0){let Be=a(ct,Lt),eo=n(Be)-Ve;W.update(Ge,Fa(eo,$t))}return{count:(M>0?1:0)+Me+(ct?1:0),endPos:Ke,index:Lt,offset:q,rendered:Me,startPos:$}}function f(M,X,J,Q){let q=M,$=l(q,X,J);for(;Q&&q>0&&$.endPos-$.startPos<Ae;){let Ke=Ae-($.endPos-$.startPos),Ft=Math.max(Math.ceil(Ke/t),$.rendered,1),lt=Math.max(q-Ft,0);if(lt===q)break;q=lt,$=l(q,0,J)}return{...$,start:q}}function h(M,X,J,Q){return Q?J:X<=0?0:Math.max(Math.min(M/X,1),0)*J}function b(M){let X=o/2;return M>0?X=o/4:M<0&&(X=o-o/4),{before:X,after:o-X}}function E(){Qt.clear(),at&&r();let M=La(I,oe,Zt),X=M-zt;zt=M;let J=Math.max(I[ae]-bt,0),Q=!Lr&&J>0&&M>=J-1,q=Math.max(it-Ae,0),$=h(M,J,q,Q),{before:Ke,after:Ft}=b(X),lt=W.find($),Ve=W.find(Math.max($-Ke,0)).index,$t=$-W.offsetOf(Ve),Ge=Q?1/0:Ae+Ft,Me=lt.index,Le=lt.offset,ye=f(Ve,$t,Ge,Q);if(!Q){for(;Me<Ne-1&&Le>=W.get(Me);)Le-=W.get(Me++);Me!==lt.index&&(Ve=o===0?Me:W.find(Math.max($-Ke,0)).index,ye=f(Ve,o===0?Le:$-W.offsetOf(Ve),Ge,Q))}let{count:Vr}=ye,{offset:Oe}=ye;D?.(Vr);let Sn=W.get(Me),Lt=Math.min(Le,Sn);!Q&&ye.start===Me&&(Oe+=Le-Lt),ye.rendered>0&&Q&&(Oe=Ae-ye.endPos,Oe>0&&(Oe=0));let ct=W.offsetOf(Me)+Lt;if(Q)it=W.totalSize;else{let to=W.totalSize;it=Math.max(to,ct+Ae+(ct+Ae>=to?1:0))}let Be=Math.max(it-Ae,0);Q&&(ct=Be);let eo=Math.min(Math.ceil(it),Fo);return Lr=!1,c(),{dataLength:Ne,start:ye.start,end:ye.index,totalSize:eo,count:ye.rendered,offset:Oe,atEnd:Q,scrollRatio:Be>0?ct/Be:0}}let{axis:T,scrollElement:I,render:V,refresh:C,remove:D}=e,L=T==="x"?"offsetWidth":"offsetHeight",_=T==="x"?"offsetLeft":"offsetTop",oe=T==="x"?"scrollLeft":"scrollTop",ae=T==="x"?"scrollWidth":"scrollHeight",be=T==="x"?"paddingLeft":"paddingTop",Fe=T==="x"?"paddingRight":"paddingBottom",Fo=5e6,Ne=e.dataLength,W=new Ra(Ne,t),it=W.totalSize,bt=0,Ae=0,Jt=0,Fr=0,Zt=!1,Lr=!0,at=!0,zt=NaN,Lo=!1,yt,Qt=new Set,st=new Map,Pr=new z(M=>{yt=new ResizeObserver(X=>{if(!Lo)return;let J=!1;for(let Q of X){let q=st.get(Q.target);if(!q)continue;let $=q.rect[L];if(!Number.isFinite($)||$<=0||$===q.size)continue;let Ke=W.get(q.index)+$-q.size;q.size=$,J=W.update(q.index,Ke)||J}J&&(it=W.totalSize,zt=NaN,M.next())}),M.signal.subscribe(()=>{yt?.disconnect(),yt=void 0,st.clear()})}),Rr=v(I,"scroll",{passive:!0}),Kl=d(C?.tap(M=>{M?.dataLength!==void 0&&(Pa(M.dataLength,"dataLength"),M.resetFrom!==void 0&&Pa(M.resetFrom,"resetFrom"),Ne=M.dataLength,W.resize(Ne),M.resetFrom!==void 0&&W.reset(Math.max(Math.min(M.resetFrom,Ne),0)),it=W.totalSize,at=!0),zt=NaN})??k,_r(I).tap(M=>{Lo=M,M&&(at=!0)}),ue(I).tap(()=>at=!0),Pr,Rr).filter(()=>Lo);return new z(M=>{let X=0;Kl.subscribe({next(){X||(X=requestAnimationFrame(()=>{if(X=0,!(!at&&zt===La(I,oe,Zt)))try{M.next(E())}catch(J){M.error(J)}}))},error:M.error,signal:M.signal}),M.signal.subscribe(()=>{X&&cancelAnimationFrame(X)})})}function hC(e){let{axis:t,host:o,translate:r=!0}=e,n=e.scrollElement||o.parentElement;if(!n)throw"scrollElement option could not be resolved.";let{estimateSize:i,overscan:a}=Bl(e),c=t==="x"?"scrollLeft":"scrollTop",l=t==="x"?"scrollWidth":"scrollHeight",f=t==="x"?"clientWidth":"clientHeight",h=t==="x"?"width":"height";return G(()=>{let b=o.style.position,E=o.style.top,T=o.style.left,I=o.style.translate,V=document.createElement("div");V.style.position="absolute",V.style.width=V.style.height="1px",V.style.top=V.style.left="0",(e.scrollContainer??n).appendChild(V),o.style.position="sticky",o.style.top=o.style.left="0";let C=o.style.position,D=o.style.top,L=o.style.left,_=o.style.translate;r&&(o.style.translate="0 0",_=o.style.translate);let oe=0,ae=!1,be=NaN,Fe=e.dataLength,Fo=!1,Ne=Ru(t,n),W=()=>La(n,c,Ne),it=bt=>Pu(n,c,Ne,bt);return Hl({...e,scrollElement:n},i,a).tap(({dataLength:bt,totalSize:Ae,offset:Jt,atEnd:Fr,scrollRatio:Zt})=>{let Lr=W();oe!==Ae&&(V.style[h]=`${Ae}px`,oe=Ae);let at=Number.isNaN(be)?0:Lr-be,zt=at<-1,Lo=at>1,yt=bt!==Fe;if(zt&&!yt&&(Fo=!1),r){if(Jt!==0){let Rr=Ne?-Jt:Jt;o.style.translate=t==="x"?`${Rr}px 0`:`0 ${Rr}px`,ae=!0}else ae&&(o.style.translate="0 0",ae=!1);_=o.style.translate}let Qt=Math.max(n[l]-n[f],0),st=Fr&&(yt||Fo||Lo||Number.isNaN(be));st&&(r&&(o.style.translate="0 0",ae=!1,_=o.style.translate),Fo=!0);let Pr=st?Qt:Zt*Qt;Math.abs(W()-Pr)>.5&&it(Pr),Fe=bt,be=W()}).finalize(()=>{V.remove(),o.style.position===C&&(o.style.position=b),o.style.top===D&&(o.style.top=E),o.style.left===L&&(o.style.left=T),r&&o.style.translate===_&&(o.style.translate=I)})}).share()}function Vu(e){return Math.min(Math.max(e,0),1)}function Ou(e,t){return Qe(e).filter(o=>{let r=e.value,n=o.shiftKey?10:o.ctrlKey||o.altKey?.1:1,i=e.step*n;if(o.key==="Home")t(0);else if(o.key==="End")t(1);else if(o.key==="ArrowLeft"||o.key==="ArrowUp")t(e.value-i);else if(o.key==="ArrowRight"||o.key==="ArrowDown")t(e.value+i);else return!1;return o.preventDefault(),e.value!==r})}var Va=class extends K{value=0;step=.01};s(Va,{tagName:"c-slider-reveal",init:[O("value",0,1),O("step")],augment:[S("slider"),u(`
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
		`),Y,e=>{let t=m("div",{id:"slider",tabIndex:0}),o=m("slot",{name:"before"}),r=0;function n(){let a=e.value*e.offsetWidth;o.style.clipPath=`inset(0 0 0 ${a}px)`,t.style.left=`${a}px`,e.ariaValueNow=e.value.toString()}function i(a){let c=Vu(a);c!==e.value&&(e.value=c,e.dispatchEvent(new Event("change",{bubbles:!0})))}return t.setAttribute("part","slider"),e.focus=()=>{e.disabled||t.focus()},e.ariaValueMin="0",e.ariaValueMax="1",e.ariaOrientation="horizontal",A(e).append(m("slot",{name:"after"}),o,m("slot"),t),d(xe(e,t),d(p(e,"value"),ue(e)).raf(n),Ou(e,i),dr({target:t}).tap(a=>{a.type==="start"?r=t.offsetLeft:a.type==="move"&&i((r+a.clientX-a.startX)/e.offsetWidth)}))}]});var Oa=u(`
:host {
	display: flex;
	align-items: center;
	height: 48px;
	user-select: none;
	flex-grow: 1;
	position: relative;
	-webkit-user-select: none;
}
#background {
	background-color: var(--cxl-color-secondary-container);
	border-radius: var(--cxl-shape-corner-full);
	height: 16px;
	width: 100%;
}
:host([invalid][touched]) #background {
	background-color: var(--cxl-color-error-container);
}
slot {
	position: absolute;
	display: block;
	inset-inline: 6px;
}
	`),Dr=class extends g{knobs=[]};s(Dr,{tagName:"c-slider-bar",augment:[Oa,()=>{let e=m("div",{id:"background"});return e.setAttribute("part","background"),e},()=>m("slot"),e=>xo("slider",e,e.knobs).switchMap(()=>d(...e.knobs.map(t=>p(t,"value")))).tap(()=>e.knobs.forEach(t=>Ba(t))),e=>v(e,"click").tap(t=>{let o=e.knobs.length===1?e.knobs[0]:void 0;!o||o.disabled||t.composedPath().includes(o)||(o.focus(),zo(o,yn(o,t.clientX,e)))})]});var Ha=`
	display: inline-block;
	position: absolute;
	z-index: 1;
	border-left: 6px solid var(--cxl-color-surface);
	border-right: 6px solid var(--cxl-color-surface);
	background-color: var(--cxl-color-primary);
	width: 4px;
	height: 44px;
	cursor: pointer;
	border-radius: 2px;
	outline: 0;
	translate: -50% -50%;
	touch-action: none;
	user-select: none;
	-webkit-user-select: none;
`,Bu=u(`
:host { ${Ha} }
:host(:dir(rtl)) { translate: 50% -50%; }
:host(:focus-visible), :host(:active) { width: 2px; border-left-width: 7px; border-right-width: 7px; }
:host([invalid][touched]) { background-color: var(--cxl-color-error); }
`);function vn(e,t=0,o=1){return Math.min(o,Math.max(t,Number.isNaN(e)?t:e))}function Ya(e){let t=e.parentElement,o=t instanceof Dr?t.knobs:void 0,r=o?.indexOf(e)??-1,n=vn(e.min??(r>0?o?.[r-1]?.value:0)??0),i=vn(e.max??(r>=0?o?.[r+1]?.value:1)??1,n);return{min:n,max:i}}function Ba(e,t=e){let{min:o,max:r}=Ya(e),n=vn(e.value,o,r);e.value!==n&&(e.value=n),t.style.insetInlineStart=`${n*100}%`,e.ariaValueMin=String(o),e.ariaValueMax=String(r),e.ariaValueNow=String(n),e.ariaOrientation="horizontal"}function zo(e,t){if(e.disabled)return;let{min:o,max:r}=Ya(e),n=vn(t,o,r);n!==e.value&&(e.value=n,e.dispatchEvent(new Event("change",{bubbles:!0})))}function Yl(e){let t=e.getBoundingClientRect(),o=e.offsetWidth?t.width/e.offsetWidth:1;return{left:t.left+6*o,width:Math.max(0,t.width-12*o)}}function yn(e,t,o){let r=Yl(o),n=r.width?(t-r.left)/r.width:0;return getComputedStyle(e).direction==="rtl"?1-n:n}function Hu(e,t){return Qe(e).filter(o=>{if(e.disabled)return!1;let r=e.value,n=o.shiftKey?10:o.ctrlKey||o.altKey?.1:1,i=e.step*n,a=getComputedStyle(e).direction==="rtl",{min:c,max:l}=Ya(e);if(o.key==="Home")t(c);else if(o.key==="End")t(l);else if(o.key==="ArrowLeft")t(e.value+(a?i:-i));else if(o.key==="ArrowRight")t(e.value+(a?-i:i));else if(o.key==="ArrowUp")t(e.value-i);else if(o.key==="ArrowDown")t(e.value+i);else return!1;return o.preventDefault(),e.value!==r})}function ja(e,t=e){let o=0,r=0,n=1;return d(Hu(e,i=>zo(e,i)),p(e,"disabled").switchMap(i=>i?k:dr({target:t,delay:0}).tap(a=>{if(a.type==="start"){e.focus(),o=e.value;let c=t===e?e.parentElement:e;r=c?Yl(c).width:0,n=getComputedStyle(e).direction==="rtl"?-1:1}else a.type==="move"&&r>0&&zo(e,o+n*(a.clientX-a.startX)/r)})),d(p(e,"value"),p(e,"min"),p(e,"max")).tap(()=>Ba(e,t)))}var It=class extends K{value=0;step=.01;min;max};s(It,{tagName:"c-slider-knob",init:[O("value",0,1),O("step",0,1),O("max"),O("min")],augment:[S("slider"),w,Bu,Y,xe,ja,e=>Se("slider",e)]});var Ir=class extends g{knob;keepopen=!1;format=t=>Number(t).toFixed(2)};s(Ir,{tagName:"c-slider-tooltip",init:[H("knob"),H("format"),x("keepopen")],augment:[u(`
:host {
	box-sizing: border-box;
	color: var(--cxl-color-on-inverse-surface);
	background-color: var(--cxl-color-inverse-surface);
	border-radius: 16px;
	translate: calc(-50%) 0;
	padding: 12px 16px;
	border: 0; margin: 0;
	${N("label-medium")}
}
		`),e=>{let t=new Text;return A(e).append(t),e.popover="manual",e.ariaHidden="true",p(e,"knob").map(o=>o??(e.parentElement instanceof It?e.parentElement:void 0)).switchMap(o=>{if(!o)return k;let r=()=>{let a=(o instanceof It?o:o.shadowRoot?.querySelector(".knob")??o).getBoundingClientRect(),c=e.getBoundingClientRect(),l=c.width/parseFloat(getComputedStyle(e).width)||1;e.style.left=`${(a.left+a.width/2)/l}px`,e.style.top=`${(a.top-c.height)/l-8}px`},n=oi({host:o,target:e,position:r});return d(P(p(e,"keepopen"),p(o,"disabled"),vt(o),Ho(o),Sl(o)).raf().switchMap(([i,a,c,l,f])=>n(!a&&(i||c||l||f))),d(p(o,"value"),p(e,"format")).raf(()=>{t.textContent=e.format(o.value),e.matches(":popover-open")&&r()})).finalize(()=>{e.isConnected&&e.hidePopover()})})}]});var Ua=class extends K{value=0;step=.05};s(Ua,{tagName:"c-slider",init:[O("value",0,1),O("step",0,1)],augment:[S("slider"),Oa,Y,xe,u(`
:host { outline: none }
:host([disabled]) #background {
	background-color: color-mix(in srgb, var(--cxl-color-on-surface) 12%, transparent);
}
:host([disabled])  {
	--cxl-color-primary: color-mix(in srgb, var(--cxl-color-on-surface) 38%, transparent);
}
.knob { ${Ha} }
:host(:dir(rtl)) .knob { translate: 50% -50%; }
#background { display: flex; align-items: center; }
:host(:focus-visible) .knob, :host(:active) .knob { width: 2px; border-left-width: 7px; border-right-width: 7px; }
:host([invalid][touched]) { --cxl-color-primary: var(--cxl-color-error); }
#active {
	height: 16px;
	background-color: var(--cxl-color-primary);
	inset-inline-start:0; border-radius:50vh;
}
#track {
	position: absolute;
	inset-inline: 6px;
}
		`),e=>{let t=m("span",{className:"knob"},m(Ir,{knob:e})),o=m("div",{id:"active"}),r=m("div",{id:"track"},t),n=m("div",{id:"background"},o,r);return n.setAttribute("part","background"),A(e).append(n),d(ja(e,t),v(n,"click").tap(i=>{e.disabled||i.composedPath().includes(t)||(e.focus(),zo(e,yn(e,i.clientX,n)))}),p(e,"value").raf(()=>{o.style.width=`${e.value*100}%`}))}]});function jl(e,t="nextElementSibling"){let o=e;for(;o=o[t];)if(o instanceof It)return o}var _a=class extends g{};s(_a,{tagName:"c-slider-line",augment:[u(`
:host {
	height: 16px;
	top:-8px;
	background-color: var(--cxl-color-primary);
	position: absolute;
}
	`),w,e=>{let t=e.parentElement?.shadowRoot?.querySelector("slot");return d(F(void 0),...t?[v(t,"slotchange")]:[]).switchMap(()=>{let o=jl(e,"previousElementSibling"),r=jl(e);return d(o?p(o,"value"):F(0),r?p(r,"value"):F(1)).raf(()=>{let n=o?.value??0,i=r?.value??1;e.style.insetInlineStart=`${n*100}%`,e.style.width=`${Math.max(0,i-n)*100}%`,e.style.borderStartStartRadius=e.style.borderEndStartRadius=o?"0":"50vh",e.style.borderStartEndRadius=e.style.borderEndEndRadius=r?"0":"50vh"})})}]});var Ul=class e extends K{value="on";checked=!1;defaultChecked=!1;static{s(e,{tagName:"c-switch",init:[x("value"),y("checked")],augment:[S("switch"),Ie,u(`
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
${je(".mask")}
:host([checked]) .mask { translate: 20px 0; }
		`),t=>{t.defaultChecked=t.checked},Y,()=>m("div",{className:"knob"}),()=>m("div",{className:"mask"}),Ci]})}formResetCallback(){this.checked=this.defaultChecked,this.touched=!1}setFormValue(t){se(this).setFormValue(this.checked?String(t):null)}};var Xa=class extends g{font};s(Xa,{tagName:"c-t",init:[y("font")],augment:[u(`:host{display:inline-block;font:var(--cxl-font-body-medium);}${Jr.map(e=>`:host([font="${e}"]){font:var(--cxl-font-${e});letter-spacing:var(--cxl-letter-spacing-${e})}`).join("")}
:host([font=h1]) { ${N("display-large")} display:block;margin-top: 64px; margin-bottom: 24px; }
:host([font=h2]) { ${N("display-medium")} display:block;margin-top: 56px; margin-bottom: 24px; }
:host([font=h3]) { ${N("display-small")} display:block; margin-top: 48px; margin-bottom: 16px; }
:host([font=h4]) { ${N("headline-medium")} display:block; margin-top: 40px; margin-bottom: 16px; }
:host([font=h5]) { ${N("title-large")} display:block;margin-top: 32px; margin-bottom: 12px; }
:host([font=h6]) { ${N("title-medium")} display:block;margin-top: 24px; margin-bottom: 8px; }
:host([font=h1]:first-child),:host([font=h2]:first-child),:host([font=h3]:first-child),:host([font=h4]:first-child),:host([font=h5]:first-child),:host([font=h6]:first-child){margin-top:0}
			`),w,e=>p(e,"font").tap(t=>{switch(t){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":e.role="heading",e.ariaLevel=t.slice(1);break;default:e.role=e.ariaLevel=null}})]});var zr=class extends g{selected;tabs=new Set;variant};s(zr,{tagName:"c-tabs",init:[H("selected"),y("variant")],augment:[S("tablist"),u(`
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
		`),w,e=>{function t(o=1){let r=Array.from(e.tabs),n=e.selected||r[0],i=n?r.indexOf(n):-1;return i===-1?null:r[i+o]||null}return xt({host:e,goRight:t.bind(null,1),goLeft:t.bind(null,-1),goFirst:()=>Array.from(e.tabs)[0]||null,goLast:()=>Array.from(e.tabs)[e.tabs.size-1]||null}).tap(o=>{o.click(),o.focus()})},e=>{let t=new ke;return A(e).append(m(Ue,{className:"selected",$:o=>d(St(),p(e,"selected"),p(e,"variant"),t,ue(e)).raf(()=>{if(!e.checkVisibility())return;let r=e.selected;if(!r)return o.style.transform="scaleX(0)";let n=r.offsetLeft;if(e.variant==="secondary"){let i=r.clientWidth/100;o.style.transform=`translate(${n}px, 0) scaleX(${i})`,o.style.display="block"}else{let i=document.createRange();i.selectNodeContents(r);let{width:a}=i.getBoundingClientRect(),c=n+(r.clientWidth-a)/2,l=a/100;o.style.transform=`translate(${c}px, 0) scaleX(${l})`,o.style.display="block"}e.scrollWidth!==r.clientWidth&&(e.scrollLeft=n-32)})})),et("tabs",e,e.tabs).raf().switchMap(o=>{let r=[];for(let n of o.elements)r.push(p(n,"selected").tap(i=>{i?(e.selected&&e.selected!==n&&(e.selected.selected=!1),e.selected=n):e.selected===n&&(e.selected=void 0),n.tabIndex=i?0:-1}),ue(n).tap(()=>t.next()));return d(...r)})}]});var _l=class e extends g{tabs;name;visible=!1;static{s(e,{tagName:"c-tab-panel",init:[x("tabs"),x("name")],augment:[S("tabpanel"),t=>{let o=new CSSStyleSheet;o.replaceSync(":host{display:none}"),A(t).adoptedStyleSheets.push(o);function r(n){t.visible!==n&&(t.visible=n,o.replaceSync(`:host{display:${n?"contents":"none"}}`))}return bo(t,"tabs").switchMap(n=>n instanceof zr?so(n,{subtree:!0}).raf().switchMap(()=>{let i=Array.from(n.tabs);return P(p(t,"name"),...i.map(a=>p(a,"name"))).map(([a,...c])=>a?i[c.indexOf(a)]:void 0).distinctUntilChanged().switchMap(a=>d(p(n,"selected").tap(c=>r(!!a&&c===a)),a?d(Gr(a,[t]).finalize(()=>a.removeAttribute("aria-controls")),Re(a).tap(c=>t.setAttribute("aria-labelledby",c)).finalize(()=>t.removeAttribute("aria-labelledby"))):k))}).finalize(()=>r(!1)):k)},w]})}get open(){return this.visible}};var Wa=class extends g{};s(Wa,{tagName:"c-table",augment:[S("table"),u(`
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
	${N("body-large")}
	background-color: var(--cxl-color-surface);
	color: var(--cxl-color-on-surface);
	outline-offset: -1px;
}
		`),w]});var qa=class extends g{};s(qa,{tagName:"c-tbody",augment:[S("rowgroup"),u(":host{display:table-row-group}"),w]});var Ka=class extends g{};s(Ka,{tagName:"c-td",augment:[S("cell"),u(`
:host {
	box-sizing: border-box;
	display: table-cell;
	padding: 0 16px;
	height: 51px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
}
		`),w]});var Ga=class extends g{};s(Ga,{tagName:"c-th",augment:[S("columnheader"),u(`
:host {
	box-sizing: border-box;
	display: table-cell;
	${N("title-medium")}
	color: var(--cxl-color-on-surface-variant);
	padding: 16px;
	white-space: nowrap;
	height: 55px;
	vertical-align: middle;
	border-bottom: 1px solid var(--cxl-color-outline);
	position: relative;
}`),w]});var Ja=class extends we{value="";inputEl=document.createElement("textarea")};s(Ja,{tagName:"c-textarea",init:[x("value")],augment:[w,e=>e.append(e.inputEl),e=>Ce({host:e,input:e.inputEl}),Y,e=>{let t=new CSSStyleSheet;return t.replaceSync(":host{flex-grow:1;position:relative;}"),e.shadowRoot?.adoptedStyleSheets.push(t),d(p(e,"value"),ue(e.inputEl),St()).raf(()=>{let o=e.inputEl.style;o.height="0";let r=e.inputEl.scrollHeight;t.replaceSync(`:host{flex-grow:1;position:relative;height:${r}px}`),o.height="100%"})}]});function Yu(e){return getComputedStyle(e).direction==="rtl"}function ju(e,t,o,r,n){return e==="right"||e==="end"&&!r||e==="start"&&r?(n.left=t.right,!0):e==="left-to-right"||e==="start-to-end"&&!r?(n.left=t.left,!0):e==="left"||e==="end"&&r||e==="start"&&!r?(n.left=t.left-o.offsetWidth,!0):e==="center"?(n.left=t.left+t.width/2-o.offsetWidth/2,!0):e==="right-to-left"||e==="end-to-start"&&r?(n.left=t.right-o.offsetWidth,!0):e==="fill"?(n.left=t.left,n.minWidth=t.width,!0):!1}function Uu(e,t,o,r){return e==="bottom"?(r.top=t.bottom,!0):e==="top"?(r.top=t.top-o.offsetHeight,!0):e==="middle"?(r.top=t.top+t.height/2-o.offsetHeight/2,!0):e==="top-to-bottom"?(r.top=t.top,!0):e==="bottom-to-top"?(r.top=t.bottom-o.offsetHeight,!0):!1}function Xl(e,t,o){return Math.min(Math.max(e,t),o)}function wn({element:e,relativeTo:t,position:o,container:r}){if(o==="none")return;if(r??=ie.currentPopupContainer??ie.popupContainer,e.parentNode||r.appendChild(e),typeof o=="function")return o(e);let n=t.getBoundingClientRect(),i=e.style,a=Math.max(r.offsetWidth-e.offsetWidth-16,16),c=Math.max(r.offsetHeight-e.offsetHeight-16,16);i.left=i.top=i.width=i.minWidth=i.transformOrigin="",o==="auto"&&(o="center bottom");let l={left:0,top:0},f=Yu(e);for(let h of o.split(" "))if(!ju(h,n,e,f,l)&&!Uu(h,n,e,l))throw new Error(`Invalid position "${h}"`);l.left=Xl(l.left,16,a),l.top=Xl(l.top,16,c),i.left=`${l.left}px`,i.top=`${l.top}px`,l.minWidth&&(i.minWidth=`${l.minWidth}px`)}function _u(e){let t=d(B(e,"position"),v(window,"scroll",{capture:!0,passive:!0})),o=r=>wn({element:r,relativeTo:(typeof e.relative=="string"?gt(e,e.relative):e.relative)??e.firstElementChild??e,position:e.position||"auto",container:document.body});return Ot(e).switchMap(({target:r,open:n})=>{if(r.open&&n&&(r.open=!1),r.trigger!==e)return k;if(r.open=n,n){let i=r.dialog??r,a=e.firstElementChild;return r.dialog&&(i.style.margin="0"),o(i),d(ue(i),t).raf(()=>{a&&!a.checkVisibility()?e.open=!1:o(i)})}return k})}var Za=class extends g{open=!1;target;position;relative;trigger};s(Za,{tagName:"c-toggle-popup",init:[y("open"),x("target"),x("position"),x("relative"),x("trigger")],augment:[_u,w,u(":host{display:contents}")]});var Qa=class extends We{};s(Qa,{tagName:"c-toolbar-floating",augment:[u(`
:host {
	background-color: var(--cxl-color-surface-container);
	color: var(--cxl-color-on-surface-variant);
	border-radius: var(--cxl-shape-corner-full);
	padding: 8px 24px;
	height: 64px;
	${Ls(3)}
}
		`)]});var kn=class extends g{};s(kn,{tagName:"c-tooltip-popup",augment:[S("tooltip"),w,u(`
:host {
	box-sizing: border-box;
	position: fixed;
	display: block;
	margin: 0;
	border: 0;
	border-radius: var(--cxl-shape-corner-xsmall);
	padding: 4px 8px;
	min-height: 24px;
	max-width: calc(100vw - 32px);
	${te("inverse-surface")}
	${N("body-small")}
}
		`)]});var $a=class extends g{delayin=500;delayout=100};s($a,{tagName:"c-tooltip",init:[O("delayin",0),O("delayout",0)],augment:[u(":host { display: none; }"),e=>G(()=>{let t=e.parentElement;if(!t)return k;let o=t.getAttribute("aria-describedby"),r=pe(e),n,i,a=m(kn,{$:ee(f=>{f.signal.subscribe(()=>{e.append(...a.childNodes),r.next(e),n=i=void 0,ie.currentTooltip===a&&(ie.currentTooltip=void 0)})})});a.popover="manual";function c(){a.remove()}let l=()=>{a.isConnected||t.matches(':disabled,[disabled],[aria-disabled="true"]')||!t.getClientRects().length||(a.append(...e.childNodes),ie.tooltipOpened(a),wn({element:a,relativeTo:t,container:document.body,position(f){f.showPopover();let h=t.getBoundingClientRect(),b=n??h.left+(h.width-f.offsetWidth)/2,E=(i??h.top)-f.offsetHeight;f.style.left=`${Math.max(0,Math.min(b,innerWidth-f.offsetWidth))}px`,f.style.top=`${Math.max(0,Math.min(E,innerHeight-f.offsetHeight))}px`}}),r.next(a))};return ee(f=>{let h=d(r.switchMap(b=>Ss(t,b).tap(()=>{o&&t.setAttribute("aria-describedby",`${o} ${b.id}`)})),v(t,"mousemove").tap(b=>{a.isConnected||(n=b.clientX,i=b.clientY)}),d(P(r.switchMap(b=>b===a?vt(a):F(!1)),vt(t),Ho(t)).map(b=>b.some(Boolean)).distinctUntilChanged().map(b=>({show:b,delay:b?e.delayin:e.delayout})),Qe(window,"escape").map(()=>({show:!1,delay:0}))).switchMap(({show:b,delay:E})=>(E?Ye(E):F(void 0)).tap(()=>b?l():c()))).subscribe({next:f.next,error:f.error});f.signal.subscribe(()=>{h.unsubscribe(),c(),o===null?t.removeAttribute("aria-describedby"):t.setAttribute("aria-describedby",o)})})})]});var es=class extends g{color};s(es,{tagName:"c-tr",init:[le("color")],augment:[S("row"),u(":host{display:table-row;height:53px;}"),w]});var Xu={xl:"xlarge",lg:"large",md:"medium",sm:"small",xs:"xsmall",full:"full"},Wu=Bs.map(e=>e==="inherit"?`[c~="surface-${e}"]{background-color:inherit;color:inherit}
[c~="color-${e}"]{color:inherit}`:`[c~="surface-${e}"]{background-color:var(--cxl-color-${e});color:var(--cxl-color-on-${e})}
[c~="color-${e}"]{color:var(--cxl-color-${e})}`).join(""),Wl=`[c~="cover"]{object-fit:cover;width:100%;height:100%;}
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
[c~="section-header"]{display:block;${N("title-medium")}margin-bottom:48px;grid-column:1 / -1;}
[c~="section-header"] > h2{${N("display-small")}font-weight:700;}
${Wu}
${Jr.map(e=>`[c-font="${e}"]{${N(e)}}`).join("")}
${ft.map(e=>`[c~="pad-${e}"]{padding:${e}px}
[c~="corner-${e}"]{border-radius:${e}px}
[c~="gap-${e}"]{gap:${e}px}`).join("")}
${Object.entries(Xu).map(([e,t])=>`[c~="corner-${e}"]{border-radius:var(--cxl-shape-corner-${t})}`).join("")}
[c~="surface-scrim"]{
	background-color:var(--cxl-color-scrim);
	background-size:cover;
	background-blend-mode:darken;
	background-position:center;
}`,qu=`${Wl}
${U("small",Wl.replace(/\[c~/g,"[c\\:sm~"))}
`,ql=new WeakMap;function Ku(e=document){let t=ql.get(e);return t||(t=$e(qu),e.adoptedStyleSheets.push(t),ql.set(e,t)),t}var ts=class extends g{};s(ts,{tagName:"c-www",augment:[e=>{Ku(e.ownerDocument)}]});export{Un as Accordion,Xn as AccordionHeader,Ko as AccordionPanel,Vn as Action,jt as Alert,Wn as AlertError,Go as Appbar,tl as AppbarContextual,qn as AppbarLayout,Kn as AppbarTitle,Zn as Application,Qn as AriaLive,md as Augment,ln as Autocomplete,ui as AutocompleteDynamic,di as Avatar,fi as Badge,Ro as BehaviorSubject,zn as Bindings,Co as Block,mi as Body,ot as Button,yo as ButtonBase,Ut as ButtonRound,gi as ButtonSegmented,Xe as ButtonText,nr as C,sr as CalendarCell,ir as CalendarDate,un as CalendarMonthInput,lr as Card,Ei as CardItem,hl as Checkbox,Ni as Chip,Hs as ColorStyles,g as Component,ep as ContentManager,Ai as Date,dn as Datepicker,Di as DatepickerPopup,EE as DefaultRoute,Ii as Dialog,Mo as DialogBase,Gt as DialogBasic,Li as Dismiss,El as DragHandle,gr as Drawer,Ri as Dropdown,k as EMPTY,Vi as Each,Cn as EmptyError,ni as Field,Oi as FieldBar,_e as FieldBase,Bi as FieldFrame,tr as FieldHelp,Hi as FieldOutlined,Yi as Fieldset,pr as Flex,mn as Form,Ui as FormReset,ji as FormSubmit,_i as Grid,ki as GridList,Fl as HashStrategy,Ki as Hero,Gi as Hr,ve as Icon,ze as IconButton,br as IconButtonToggle,Qi as IconToggleTheme,$i as Iframe,ea as ImageDiff,K as Input,ta as InputClear,oa as InputCurrency,Ti as InputDate,ur as InputDateBase,ra as InputFile,ia as InputNumber,na as InputNumberBase,sn as InputOption,Ml as InputPassword,aa as InputPlaceholder,ci as InputText,we as InputTextBase,No as Item,nt as ItemBase,sa as Kbd,la as Label,hr as Layout,To as LayoutBase,ca as List,Ea as MainRouter,Ao as Menu,Jn as Meta,pa as NavDropdown,fa as NavHeadline,yr as NavItem,da as NavTarget,ua as NavTreeItem,kr as NavbarToggle,z as Observable,ri as Option,Or as OrderedSubject,Ys as OutlineColorStyles,ma as Page,ga as PageAppbar,Au as PathStrategy,cr as Pill,Kt as Popup,xa as Progress,ha as ProgressCircular,Nu as QueryStrategy,Er as R,Il as Radio,ba as Rating,ro as Reference,Br as ReplaySubject,rn as Ripple,wa as RouteBase,ka as RouteManager,Ia as RouterA,Ca as RouterComponent,Ta as RouterItem,Tr as RouterLink,za as RouterOutlet,Ma as RouterSelectable,Da as RouterTab,Wi as Section,ai as Select,So as SelectOption,Je as Signal,Pn as SizeValues,Ua as Slider,Dr as SliderBar,It as SliderKnob,_a as SliderLine,Va as SliderReveal,Ir as SliderTooltip,w as Slot,Do as Snackbar,Sr as SnackbarContainer,Ue as Span,Io as Strategies,ke as Subject,Gl as Subscriber,Bs as SurfaceColorNames,Ul as Switch,Xa as T,Mr as Tab,bn as TabBase,_l as TabPanel,Wa as Table,zr as Tabs,qa as Tbody,Ka as Td,Ja as TextArea,Ga as Th,Yn as Toggle,Ct as ToggleBase,mr as TogglePanel,Za as TogglePopup,Wo as ToggleTarget,tt as ToggleTargetBase,We as Toolbar,Qa as ToolbarFloating,$a as Tooltip,kn as TooltipPopup,es as Tr,Jr as TypographyValues,ts as Www,Ks as activeRipple,Zv as alert,cd as animated,ol as applyMeta,Rc as applyTheme,po as aria,kd as ariaChecked,Gr as ariaControls,Ss as ariaDescribed,dt as ariaId,Es as ariaLabel,Kr as ariaValue,x as attribute,B as attributeChanged,tc as auditTime,gd as augment,Lp as avatarBaseStyles,pe as be,hn as bindHref,de as bindings,fo as breakpoint,oc as bufferTime,er as buildGo,xi as buildGridCss,Fc as buildIconFactoryCdn,Vp as buildListGo,je as buildMask,$r as buildMenuStyles,Yt as buttonBaseStyles,Ie as buttonBehavior,_n as buttonKeyboardBehavior,_c as buttonStyles,Bp as cardStyles,cc as catchError,vo as changeEvent,Ci as checkedBehavior,le as colorAttribute,Td as colorMix,P as combineLatest,s as component,He as concat,nc as concatMap,i0 as confirm,j as content,m as create,u as css,Rs as cssAttribute,qr as cssSymbol,Qu as debounceFunction,ad as debounceImmediate,xc as debounceRaf,ec as debounceTime,Ws as decode,$s as defaultFormatDate,Ps as defaultThemes,G as defer,Dd as delayTheme,fn as dialog,zi as dialogClose,Fi as dialogStyles,Ht as disabledAttribute,Y as disabledStyles,Z as displayContents,pc as distinctUntilChanged,tu as drawerStyles,Nl as each,iu as eachBehavior,Ls as elevation,id as empty,Wc as errorToString,co as event,ic as exhaustMap,Sc as expression,ii as fieldBaseStyles,Np as fieldBehavior,Cp as fieldLayout,Xt as fieldLayoutStyles,Sp as fieldStyles,fu as fileUploadBehavior,An as filter,mc as finalize,xr as findForm,lc as first,Zu as firstValueFrom,xe as focusable,Uc as focusableDisabled,qo as focusableEvents,Ho as focused,N as font,Zm as formatDate,Ze as from,Vo as fromAsync,Ju as fromGenerator,ss as fromIterable,no as fromPromise,p as get,pd as getActiveElement,Re as getAriaId,vs as getAttribute,Qm as getDayText,Cu as getElementRoute,Jm as getFormattedDate,ei as getHostActive,go as getIcon,el as getLocale,hd as getRegisteredComponents,Rt as getRoot,Fp as getSearchRegex,A as getShadow,zl as getStars,bo as getTarget,gt as getTargetById,tn as getTargets,au as gridColumns,Si as gridNavigation,hi as growAndFillStyles,wp as handleListArrowKeys,vt as hovered,Tn as hoveredOrFocused,gc as ignoreElements,gn as imageData,Al as imageDataDiff,T1 as imageDiff,Iu as initializeRouter,Ep as inputContainer,Wt as inputTextBase,rr as inputTextStyles,Ku as installWwwCss,se as internals,$u as interval,ld as isFocusable,sd as isHidden,Yo as isKeyboardClick,nl as isPageReady,bi as itemBehavior,yi as itemButtonBehavior,wi as itemHost,Qr as itemLayout,Pp as itemStyles,nf as json,Ha as knobStyle,Xi as layoutStyles,ME as linkBehavior,pu as loadImage,Os as loadTheme,Dc as loadThemeDefinition,$o as manageFocus,Rp as manageFocusList,Nn as map,kt as maskStyles,U as media,d as merge,rc as mergeMap,ne as message,ws as messageProxy,nn as metaBehavior,Xo as motion,vr as navItemComponent,xt as navigation,Vg as navigationItems,pn as navigationList,$e as newStylesheet,fs as nodeSort,Su as normalize,vi as normalizeDate,NS as notify,O as numberAttribute,ee as observable,so as observeChildren,Ic as observeTheme,F as of,v as on,R as onAction,Yr as onAttributeMutation,Hr as onChildrenMutation,Mn as onEvent,St as onFontsReady,Rl as onHashChange,Du as onHistoryChange,Ur as onIntersection,jr as onKeyAction,Qe as onKeypress,pt as onLoad,Vl as onLocation,fe as onMessage,Bo as onMutation,rl as onPageReady,ds as onReady,ue as onResize,uo as onThemeChange,lo as onUpdate,_r as onVisibility,ao as onVisible,De as operator,Pt as operatorNext,as as operators,kp as overrideFocusMethod,Hc as parseAnimation,ar as parseCalendarDate,af as parseJson,Yc as parseMotion,Eu as parseQueryParameters,Sa as parseUrl,Gu as pipe,Uo as placeholder,Yp as popupBehavior,Hp as popupStyles,_u as popupToggleBehavior,Mp as positionUnder,zp as prefixMatcher,H as property,fc as publishLast,us as raf,Ql as reduce,Oo as ref,Id as registerDefaultIconFactory,zd as registerIcon,Nt as registerText,Wr as renderChildren,$0 as renderEach,ya as replaceParameters,he as ripple,S as role,SE as route,CE as routeIsActive,AE as routeTitles,me as router,NE as routerHost,Lu as routerLink,Aa as routerOutlet,Ar as routerSelectable,Dt as routerState,Pl as routerStrategy,mo as scrollbarStyles,qi as sectionStyles,Zl as select,si as selectBehavior,Tp as selectComponent,Ap as selectInputStyles,gl as selectMenuStyles,xd as set,jo as setAttribute,Tu as setDocumentTitle,zo as setSliderValue,AS as setSnackbarContainer,dc as share,uc as shareLatest,ed as shareReplay,ce as sizeAttribute,Oa as sliderBarStyles,ja as sliderKnobBehavior,Bu as sliderKnobStyles,Hu as sliderOnKeypress,yn as sliderPointerValue,Tl as snackbarContainer,rf as sortBy,ft as spacingValues,Bn as storage,Ll as strategy$,y as styleAttribute,en as stylesheet,ps as subject,pi as substringMatcher,te as surface,ko as svg,_t as svgPath,cs as switchMap,qe as sys,ac as take,sc as takeWhile,io as tap,re as theme,Zr as themeName,Pc as themeReady,$l as throttleTime,od as throwError,Ye as timer,Jl as toPromise,jn as toggleBehavior,on as toggleClose,Ot as toggleComponent,yf as toggleOpen,mt as toggleTargetBehavior,ho as toggleTargetStyles,Pe as trigger,ge as tsx,vp as updateEvent,Ba as updateSlider,hC as virtualScroll,xC as virtualScrollRender,Is as visuallyHidden,qu as wwwCss,td as zip};
