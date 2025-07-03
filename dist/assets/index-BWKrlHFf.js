import{b3 as g,b4 as w,b9 as m,ba as f,aA as v,aB as b,aD as x}from"./index-xeh6oSzU.js";import{r as u,c as h}from"./if-defined-DlTid8OG.js";const e=w({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),y={state:e,subscribe(o){return f(e,()=>o(e))},subscribeKey(o,t){return m(e,o,t)},showTooltip({message:o,triggerRect:t,variant:i}){e.open=!0,e.message=o,e.triggerRect=t,e.variant=i},hide(){e.open=!1,e.message="",e.triggerRect={width:0,height:0,top:0,left:0}}},s=g(y),R=v`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;var n=function(o,t,i,l){var p=arguments.length,r=p<3?t:l===null?l=Object.getOwnPropertyDescriptor(t,i):l,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(o,t,i,l);else for(var d=o.length-1;d>=0;d--)(c=o[d])&&(r=(p<3?c(r):p>3?c(t,i,r):c(t,i))||r);return p>3&&r&&Object.defineProperty(t,i,r),r};let a=class extends b{constructor(){super(),this.unsubscribe=[],this.open=s.state.open,this.message=s.state.message,this.triggerRect=s.state.triggerRect,this.variant=s.state.variant,this.unsubscribe.push(s.subscribe(t=>{this.open=t.open,this.message=t.message,this.triggerRect=t.triggerRect,this.variant=t.variant}))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){this.dataset.variant=this.variant;const t=this.triggerRect.top,i=this.triggerRect.left;return this.style.cssText=`
    --w3m-tooltip-top: ${t}px;
    --w3m-tooltip-left: ${i}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width/2}px;
    --w3m-tooltip-display: ${this.open?"flex":"none"};
    --w3m-tooltip-opacity: ${this.open?1:0};
    `,x`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`}};a.styles=[R];n([u()],a.prototype,"open",void 0);n([u()],a.prototype,"message",void 0);n([u()],a.prototype,"triggerRect",void 0);n([u()],a.prototype,"variant",void 0);a=n([h("w3m-tooltip"),h("w3m-tooltip")],a);export{s as T};
//# sourceMappingURL=index-BWKrlHFf.js.map
