import{aA as d,aI as f,aB as p,aD as g}from"./index-DmvewjL6.js";import{n as c,c as u}from"./if-defined-6N-AQws6.js";const x=d`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var l=function(o,t,s,r){var a=arguments.length,e=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,s):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(o,t,s,r);else for(var h=o.length-1;h>=0;h--)(n=o[h])&&(e=(a<3?n(e):a>3?n(t,s,e):n(t,s))||e);return a>3&&e&&Object.defineProperty(t,s,e),e};let i=class extends p{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,g`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};i.styles=[f,x];l([c()],i.prototype,"color",void 0);l([c()],i.prototype,"size",void 0);i=l([u("wui-loading-spinner")],i);
//# sourceMappingURL=index-DKNRAvI_.js.map
