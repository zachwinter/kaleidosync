import{aA as u,aI as b,aS as p,aB as f,aD as v}from"./index-DmvewjL6.js";import{n as d,c as m,o as x}from"./if-defined-6N-AQws6.js";const g=u`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var l=function(a,o,r,n){var i=arguments.length,t=i<3?o:n===null?n=Object.getOwnPropertyDescriptor(o,r):n,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(a,o,r,n);else for(var c=a.length-1;c>=0;c--)(s=a[c])&&(t=(i<3?s(t):i>3?s(o,r,t):s(o,r))||t);return i>3&&t&&Object.defineProperty(o,r,t),t};let e=class extends f{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return v`
      <button ?disabled=${this.disabled} tabindex=${x(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};e.styles=[b,p,g];l([d()],e.prototype,"tabIdx",void 0);l([d({type:Boolean})],e.prototype,"disabled",void 0);l([d()],e.prototype,"color",void 0);e=l([m("wui-link")],e);
//# sourceMappingURL=index-DRBNEgTO.js.map
