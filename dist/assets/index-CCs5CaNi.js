import{aA as h,aI as b,aS as w,aB as g,aD as r}from"./index-xeh6oSzU.js";import{n as o,c as v,o as p}from"./if-defined-DlTid8OG.js";import"./index-_BiY2HJ4.js";import"./index-CILjpBgV.js";import"./index-DhmUn2IF.js";const x=h`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var t=function(u,a,e,s){var l=arguments.length,n=l<3?a:s===null?s=Object.getOwnPropertyDescriptor(a,e):s,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")n=Reflect.decorate(u,a,e,s);else for(var d=u.length-1;d>=0;d--)(c=u[d])&&(n=(l<3?c(n):l>3?c(a,e,n):c(a,e))||n);return l>3&&n&&Object.defineProperty(a,e,n),n};let i=class extends g{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return r`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${p(this.iconVariant)}
        tabindex=${p(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if(this.variant==="image"&&this.imageSrc)return r`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if(this.iconVariant==="square"&&this.icon&&this.variant==="icon")return r`<wui-icon name=${this.icon}></wui-icon>`;if(this.variant==="icon"&&this.icon&&this.iconVariant){const a=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",e=this.iconVariant==="square-blue"?"mdl":"md",s=this.iconSize?this.iconSize:e;return r`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${s}
          background="transparent"
          iconColor=${a}
          backgroundColor=${a}
          size=${e}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?r`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:r``}chevronTemplate(){return this.chevron?r`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};i.styles=[b,w,x];t([o()],i.prototype,"icon",void 0);t([o()],i.prototype,"iconSize",void 0);t([o()],i.prototype,"tabIdx",void 0);t([o()],i.prototype,"variant",void 0);t([o()],i.prototype,"iconVariant",void 0);t([o({type:Boolean})],i.prototype,"disabled",void 0);t([o()],i.prototype,"imageSrc",void 0);t([o()],i.prototype,"alt",void 0);t([o({type:Boolean})],i.prototype,"chevron",void 0);t([o({type:Boolean})],i.prototype,"loading",void 0);i=t([v("wui-list-item")],i);
//# sourceMappingURL=index-CCs5CaNi.js.map
