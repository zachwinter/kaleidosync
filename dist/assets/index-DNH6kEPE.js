import{aA as h,aI as g,aS as p,aB as v,aD as x}from"./index-DmvewjL6.js";import{n as c,c as f}from"./if-defined-6N-AQws6.js";const y=h`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var i=function(d,e,t,a){var l=arguments.length,r=l<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,t):a,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(d,e,t,a);else for(var s=d.length-1;s>=0;s--)(n=d[s])&&(r=(l<3?n(r):l>3?n(e,t,r):n(e,t))||r);return l>3&&r&&Object.defineProperty(e,t,r),r};let o=class extends v{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){const e=this.iconSize||this.size,t=this.size==="lg",a=this.size==="xl",l=t?"12%":"16%",r=t?"xxs":a?"s":"3xl",n=this.background==="gray",s=this.background==="opaque",b=this.backgroundColor==="accent-100"&&s||this.backgroundColor==="success-100"&&s||this.backgroundColor==="error-100"&&s||this.backgroundColor==="inverse-100"&&s;let u=`var(--wui-color-${this.backgroundColor})`;return b?u=`var(--wui-icon-box-bg-${this.backgroundColor})`:n&&(u=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${u};
       --local-bg-mix: ${b||n?"100%":l};
       --local-border-radius: var(--wui-border-radius-${r});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor==="wui-color-bg-125"?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}
   `,x` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `}};o.styles=[g,p,y];i([c()],o.prototype,"size",void 0);i([c()],o.prototype,"backgroundColor",void 0);i([c()],o.prototype,"iconColor",void 0);i([c()],o.prototype,"iconSize",void 0);i([c()],o.prototype,"background",void 0);i([c({type:Boolean})],o.prototype,"border",void 0);i([c()],o.prototype,"borderColor",void 0);i([c()],o.prototype,"icon",void 0);o=i([f("wui-icon-box")],o);
//# sourceMappingURL=index-DNH6kEPE.js.map
