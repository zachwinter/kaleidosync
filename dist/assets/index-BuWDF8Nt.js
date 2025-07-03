import{aA as u,aI as p,aS as b,bi as f,aB as h,aD as w}from"./index-xeh6oSzU.js";import{n as c,c as m}from"./if-defined-DlTid8OG.js";const v=u`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    :host(:not([size='sm'])) button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;var s=function(r,i,o,n){var a=arguments.length,e=a<3?i:n===null?n=Object.getOwnPropertyDescriptor(i,o):n,d;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,i,o,n);else for(var l=r.length-1;l>=0;l--)(d=r[l])&&(e=(a<3?d(e):a>3?d(i,o,e):d(i,o))||e);return a>3&&e&&Object.defineProperty(i,o,e),e};let t=class extends h{constructor(){super(...arguments),this.size="md",this.disabled=!1,this.icon="copy",this.iconColor="inherit"}render(){this.dataset.size=this.size;let i="",o="";switch(this.size){case"lg":i="--wui-border-radius-xs",o="--wui-spacing-1xs";break;case"sm":i="--wui-border-radius-3xs",o="--wui-spacing-xxs";break;default:i="--wui-border-radius-xxs",o="--wui-spacing-2xs";break}return this.style.cssText=`
    --local-border-radius: var(${i});
    --local-padding: var(${o});
    `,w`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `}};t.styles=[p,b,f,v];s([c()],t.prototype,"size",void 0);s([c({type:Boolean})],t.prototype,"disabled",void 0);s([c()],t.prototype,"icon",void 0);s([c()],t.prototype,"iconColor",void 0);t=s([m("wui-icon-link")],t);
//# sourceMappingURL=index-BuWDF8Nt.js.map
