import{aA as k,aI as y,aS as C,aB as v,aD as c,aL as p,aN as u,aR as m,b2 as h,aF as b,aP as $,aQ as R,aw as I,aM as A}from"./index-DmvewjL6.js";import{n as x,c as N,U as S,o as T,r as f}from"./if-defined-6N-AQws6.js";import"./index-BQJtFYnD.js";import"./index-sK67WjDC.js";import"./index-C7AuCC2I.js";const O=k`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var g=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t};let w=class extends v{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return c`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){const e=this.networkImages.slice(0,5);return c` <wui-flex class="networks">
      ${e?.map(i=>c` <wui-flex class="network-icon"> <wui-image src=${i}></wui-image> </wui-flex>`)}
    </wui-flex>`}};w.styles=[y,C,O];g([x({type:Array})],w.prototype,"networkImages",void 0);g([x()],w.prototype,"text",void 0);w=g([N("wui-compatible-network")],w);const _=k`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var d=function(n,e,i,r){var o=arguments.length,t=o<3?e:r===null?r=Object.getOwnPropertyDescriptor(e,i):r,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(n,e,i,r);else for(var a=n.length-1;a>=0;a--)(s=n[a])&&(t=(o<3?s(t):o>3?s(e,i,t):s(e,i))||t);return o>3&&t&&Object.defineProperty(e,i,t),t};let l=class extends v{constructor(){super(),this.unsubscribe=[],this.address=p.state.address,this.profileName=p.state.profileName,this.network=u.state.activeCaipNetwork,this.unsubscribe.push(p.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName):m.showError("Account not found")}),u.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw new Error("w3m-wallet-receive-view: No account provided");const e=h.getNetworkImage(this.network);return c` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${S.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:this.profileName?0:4,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${b.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${T(b.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){const e=u.getAllRequestedCaipNetworks(),i=u.checkIfSmartAccountEnabled(),r=u.state.activeCaipNetwork,o=e.filter(a=>a?.chainNamespace===r?.chainNamespace);if($(r?.chainNamespace)===R.ACCOUNT_TYPES.SMART_ACCOUNT&&i)return r?c`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[h.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;const s=(o?.filter(a=>a?.assets?.imageId)?.slice(0,5)).map(h.getNetworkImage).filter(Boolean);return c`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${s}
    ></wui-compatible-network>`}onReceiveClick(){I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(A.copyToClopboard(this.address),m.showSuccess("Address copied"))}catch{m.showError("Failed to copy")}}};l.styles=_;d([f()],l.prototype,"address",void 0);d([f()],l.prototype,"profileName",void 0);d([f()],l.prototype,"network",void 0);l=d([N("w3m-wallet-receive-view")],l);export{l as W3mWalletReceiveView};
//# sourceMappingURL=receive-CLYeZj5c.js.map
