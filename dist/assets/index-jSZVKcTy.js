import{aA as c,aI as m,aB as f,aD as d}from"./index-DmvewjL6.js";import{n as u,c as v,o as w}from"./if-defined-6N-AQws6.js";import"./index-CS_cg2zt.js";const x=c`
  :host {
    position: relative;
    display: inline-block;
  }

  wui-text {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }
`;var a=function(o,i,r,s){var n=arguments.length,e=n<3?i:s===null?s=Object.getOwnPropertyDescriptor(i,r):s,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,i,r,s);else for(var p=o.length-1;p>=0;p--)(l=o[p])&&(e=(n<3?l(e):n>3?l(i,r,e):l(i,r))||e);return n>3&&e&&Object.defineProperty(i,r,e),e};let t=class extends f{constructor(){super(...arguments),this.disabled=!1}render(){return d`
      <wui-input-text
        type="email"
        placeholder="Email"
        icon="mail"
        size="mdl"
        .disabled=${this.disabled}
        .value=${this.value}
        data-testid="wui-email-input"
        tabIdx=${w(this.tabIdx)}
      ></wui-input-text>
      ${this.templateError()}
    `}templateError(){return this.errorMessage?d`<wui-text variant="tiny-500" color="error-100">${this.errorMessage}</wui-text>`:null}};t.styles=[m,x];a([u()],t.prototype,"errorMessage",void 0);a([u({type:Boolean})],t.prototype,"disabled",void 0);a([u()],t.prototype,"value",void 0);a([u()],t.prototype,"tabIdx",void 0);t=a([v("wui-email-input")],t);
//# sourceMappingURL=index-jSZVKcTy.js.map
