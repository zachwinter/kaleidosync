import{aA as h,aI as c,aB as l,aD as f}from"./index-xeh6oSzU.js";import{n as m,c as p}from"./if-defined-DlTid8OG.js";const v=h`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var u=function(o,t,r,s){var a=arguments.length,e=a<3?t:s===null?s=Object.getOwnPropertyDescriptor(t,r):s,i;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,t,r,s);else for(var d=o.length-1;d>=0;d--)(i=o[d])&&(e=(a<3?i(e):a>3?i(t,r,e):i(t,r))||e);return a>3&&e&&Object.defineProperty(t,r,e),e};let n=class extends l{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){const t=this.radius>50?50:this.radius,s=36-t,a=116+s,e=245+s,i=360+s*1.75;return f`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${a} ${e}"
          stroke-dashoffset=${i}
        />
      </svg>
    `}};n.styles=[c,v];u([m({type:Number})],n.prototype,"radius",void 0);n=u([p("wui-loading-thumbnail")],n);
//# sourceMappingURL=index-zZmqK8Dj.js.map
