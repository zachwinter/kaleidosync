import{aA as p,aB as u,aw as f,aC as b,aD as d}from"./index-DmvewjL6.js";import{n as g,r as m,c as w}from"./if-defined-6N-AQws6.js";import{T as l}from"./index-5KZaofc9.js";const C={interpolate(i,e,o){if(i.length!==2||e.length!==2)throw new Error("inputRange and outputRange must be an array of length 2");const n=i[0]||0,r=i[1]||0,t=e[0]||0,s=e[1]||0;return o<n?t:o>r?s:(s-t)/(r-n)*(o-n)+t}},v=p`
  :host {
    width: 100%;
    display: block;
  }
`;var c=function(i,e,o,n){var r=arguments.length,t=r<3?e:n===null?n=Object.getOwnPropertyDescriptor(e,o):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(i,e,o,n);else for(var h=i.length-1;h>=0;h--)(s=i[h])&&(t=(r<3?s(t):r>3?s(e,o,t):s(e,o))||t);return r>3&&t&&Object.defineProperty(e,o,t),t};let a=class extends u{constructor(){super(),this.unsubscribe=[],this.text="",this.open=l.state.open,this.unsubscribe.push(f.subscribeKey("view",()=>{l.hide()}),b.subscribeKey("open",e=>{e||l.hide()}),l.subscribeKey("open",e=>{this.open=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e()),l.hide()}render(){return d`
      <div
        @pointermove=${this.onMouseEnter.bind(this)}
        @pointerleave=${this.onMouseLeave.bind(this)}
      >
        ${this.renderChildren()}
      </div>
    `}renderChildren(){return d`<slot></slot> `}onMouseEnter(){const e=this.getBoundingClientRect();this.open||l.showTooltip({message:this.text,triggerRect:{width:e.width,height:e.height,left:e.left,top:e.top},variant:"shade"})}onMouseLeave(e){this.contains(e.relatedTarget)||l.hide()}};a.styles=[v];c([g()],a.prototype,"text",void 0);c([m()],a.prototype,"open",void 0);a=c([w("w3m-tooltip-trigger")],a);export{C as M};
//# sourceMappingURL=index-dPzXwcow.js.map
