import{aA as p,aI as f,aB as d,aD as u}from"./index-DmvewjL6.js";import{n as g,c as m}from"./if-defined-6N-AQws6.js";const x=p`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-color-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-modal-bg);
    transition: background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color;
  }
`;var c=function(o,e,r,a){var i=arguments.length,t=i<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,r):a,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(o,e,r,a);else for(var s=o.length-1;s>=0;s--)(n=o[s])&&(t=(i<3?n(t):i>3?n(e,r,t):n(e,r))||t);return i>3&&t&&Object.defineProperty(e,r,t),t};let l=class extends d{constructor(){super(...arguments),this.text=""}render(){return u`${this.template()}`}template(){return this.text?u`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`:null}};l.styles=[f,x];c([g()],l.prototype,"text",void 0);l=c([m("wui-separator")],l);
//# sourceMappingURL=index-Bf5mWwwH.js.map
