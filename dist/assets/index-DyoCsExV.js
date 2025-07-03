import{aA as h,aI as p,aS as w,aB as x,aD as m}from"./index-DmvewjL6.js";import{n as a,c as g,U as f}from"./if-defined-6N-AQws6.js";import"./index-sK67WjDC.js";const b=h`
  button {
    padding: 6.5px var(--wui-spacing-l) 6.5px var(--wui-spacing-xs);
    display: flex;
    justify-content: space-between;
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    background-color: var(--wui-color-gray-glass-002);
  }

  button[data-clickable='false'] {
    pointer-events: none;
    background-color: transparent;
  }

  wui-image,
  wui-icon {
    width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var u=function(t,o,r,i){var l=arguments.length,e=l<3?o:i===null?i=Object.getOwnPropertyDescriptor(o,r):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,i);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(e=(l<3?c(e):l>3?c(o,r,e):c(o,r))||e);return l>3&&e&&Object.defineProperty(o,r,e),e};let n=class extends x{constructor(){super(...arguments),this.tokenName="",this.tokenImageUrl="",this.tokenValue=0,this.tokenAmount="0.0",this.tokenCurrency="",this.clickable=!1}render(){return m`
      <button data-clickable=${String(this.clickable)}>
        <wui-flex gap="s" alignItems="center">
          ${this.visualTemplate()}
          <wui-flex flexDirection="column" justifyContent="spaceBetween">
            <wui-text variant="paragraph-500" color="fg-100">${this.tokenName}</wui-text>
            <wui-text variant="small-400" color="fg-200">
              ${f.formatNumberToLocalString(this.tokenAmount,4)} ${this.tokenCurrency}
            </wui-text>
          </wui-flex>
        </wui-flex>
        <wui-text variant="paragraph-500" color="fg-100">$${this.tokenValue.toFixed(2)}</wui-text>
      </button>
    `}visualTemplate(){return this.tokenName&&this.tokenImageUrl?m`<wui-image alt=${this.tokenName} src=${this.tokenImageUrl}></wui-image>`:m`<wui-icon name="coinPlaceholder" color="fg-100"></wui-icon>`}};n.styles=[p,w,b];u([a()],n.prototype,"tokenName",void 0);u([a()],n.prototype,"tokenImageUrl",void 0);u([a({type:Number})],n.prototype,"tokenValue",void 0);u([a()],n.prototype,"tokenAmount",void 0);u([a()],n.prototype,"tokenCurrency",void 0);u([a({type:Boolean})],n.prototype,"clickable",void 0);n=u([g("wui-list-token")],n);const y=h`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
    border-radius: var(--wui-border-radius-3xl);
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    overflow: hidden;
    position: relative;
  }

  :host([data-variant='generated']) {
    --mixed-local-color-1: var(--local-color-1);
    --mixed-local-color-2: var(--local-color-2);
    --mixed-local-color-3: var(--local-color-3);
    --mixed-local-color-4: var(--local-color-4);
    --mixed-local-color-5: var(--local-color-5);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host([data-variant='generated']) {
      --mixed-local-color-1: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-1)
      );
      --mixed-local-color-2: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-2)
      );
      --mixed-local-color-3: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-3)
      );
      --mixed-local-color-4: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-4)
      );
      --mixed-local-color-5: color-mix(
        in srgb,
        var(--w3m-color-mix) var(--w3m-color-mix-strength),
        var(--local-color-5)
      );
    }
  }

  :host([data-variant='generated']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      var(--local-radial-circle),
      #fff 0.52%,
      var(--mixed-local-color-5) 31.25%,
      var(--mixed-local-color-3) 51.56%,
      var(--mixed-local-color-2) 65.63%,
      var(--mixed-local-color-1) 82.29%,
      var(--mixed-local-color-4) 100%
    );
  }

  :host([data-variant='default']) {
    box-shadow: 0 0 0 8px var(--wui-color-gray-glass-005);
    background: radial-gradient(
      75.29% 75.29% at 64.96% 24.36%,
      #fff 0.52%,
      #f5ccfc 31.25%,
      #dba4f5 51.56%,
      #9a8ee8 65.63%,
      #6493da 82.29%,
      #6ebdea 100%
    );
  }
`;var v=function(t,o,r,i){var l=arguments.length,e=l<3?o:i===null?i=Object.getOwnPropertyDescriptor(o,r):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(t,o,r,i);else for(var s=t.length-1;s>=0;s--)(c=t[s])&&(e=(l<3?c(e):l>3?c(o,r,e):c(o,r))||e);return l>3&&e&&Object.defineProperty(o,r,e),e};let d=class extends x{constructor(){super(...arguments),this.imageSrc=void 0,this.alt=void 0,this.address=void 0,this.size="xl"}render(){return this.style.cssText=`
    --local-width: var(--wui-icon-box-size-${this.size});
    --local-height: var(--wui-icon-box-size-${this.size});
    `,m`${this.visualTemplate()}`}visualTemplate(){if(this.imageSrc)return this.dataset.variant="image",m`<wui-image src=${this.imageSrc} alt=${this.alt??"avatar"}></wui-image>`;if(this.address){this.dataset.variant="generated";const o=f.generateAvatarColors(this.address);return this.style.cssText+=`
 ${o}`,null}return this.dataset.variant="default",null}};d.styles=[p,y];v([a()],d.prototype,"imageSrc",void 0);v([a()],d.prototype,"alt",void 0);v([a()],d.prototype,"address",void 0);v([a()],d.prototype,"size",void 0);d=v([g("wui-avatar")],d);
//# sourceMappingURL=index-DyoCsExV.js.map
