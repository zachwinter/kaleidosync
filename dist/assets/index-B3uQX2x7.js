import{aA as D,aB as O,aD as a,aI as T,aN as v,bd as p,aM as C,aw as Y,aV as L,aO as z,aP as E,aQ as F}from"./index-DmvewjL6.js";import{n as l,c as R,o as S,r as x}from"./if-defined-6N-AQws6.js";import{T as b,D as V}from"./index-P-D9Ebdi.js";import"./index-DNH6kEPE.js";import"./index-DRBNEgTO.js";import"./index-sK67WjDC.js";var A;(function(r){r.approve="approved",r.bought="bought",r.borrow="borrowed",r.burn="burnt",r.cancel="canceled",r.claim="claimed",r.deploy="deployed",r.deposit="deposited",r.execute="executed",r.mint="minted",r.receive="received",r.repay="repaid",r.send="sent",r.sell="sold",r.stake="staked",r.trade="swapped",r.unstake="unstaked",r.withdraw="withdrawn"})(A||(A={}));const W=D`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;var m=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e};let g=class extends O{constructor(){super(...arguments),this.images=[],this.secondImage={type:void 0,url:""}}render(){const[t,i]=this.images,o=t?.type==="NFT",s=i?.url?i.type==="NFT":o,e=o?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)",n=s?"var(--wui-border-radius-xxs)":"var(--wui-border-radius-s)";return this.style.cssText=`
    --local-left-border-radius: ${e};
    --local-right-border-radius: ${n};
    `,a`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`}templateVisual(){const[t,i]=this.images,o=t?.type;return this.images.length===2&&(t?.url||i?.url)?a`<div class="swap-images-container">
        ${t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:null}
        ${i?.url?a`<wui-image src=${i.url} alt="Transaction image"></wui-image>`:null}
      </div>`:t?.url?a`<wui-image src=${t.url} alt="Transaction image"></wui-image>`:o==="NFT"?a`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`:a`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`}templateIcon(){let t="accent-100",i;return i=this.getIcon(),this.status&&(t=this.getStatusColor()),i?a`
      <wui-icon-box
        size="xxs"
        iconColor=${t}
        backgroundColor=${t}
        background="opaque"
        icon=${i}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `:null}getDirectionIcon(){switch(this.direction){case"in":return"arrowBottom";case"out":return"arrowTop";default:return}}getIcon(){return this.onlyDirectionIcon?this.getDirectionIcon():this.type==="trade"?"swapHorizontalBold":this.type==="approve"?"checkmark":this.type==="cancel"?"close":this.getDirectionIcon()}getStatusColor(){switch(this.status){case"confirmed":return"success-100";case"failed":return"error-100";case"pending":return"inverse-100";default:return"accent-100"}}};g.styles=[W];m([l()],g.prototype,"type",void 0);m([l()],g.prototype,"status",void 0);m([l()],g.prototype,"direction",void 0);m([l({type:Boolean})],g.prototype,"onlyDirectionIcon",void 0);m([l({type:Array})],g.prototype,"images",void 0);m([l({type:Object})],g.prototype,"secondImage",void 0);g=m([R("wui-transaction-visual")],g);const U=D`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;var d=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e};let u=class extends O{constructor(){super(...arguments),this.type="approve",this.onlyDirectionIcon=!1,this.images=[],this.price=[],this.amount=[],this.symbol=[]}render(){return a`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${S(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${S(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${A[this.type]||this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `}templateDescription(){const t=this.descriptions?.[0];return t?a`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}templateSecondDescription(){const t=this.descriptions?.[1];return t?a`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `:null}};u.styles=[T,U];d([l()],u.prototype,"type",void 0);d([l({type:Array})],u.prototype,"descriptions",void 0);d([l()],u.prototype,"date",void 0);d([l({type:Boolean})],u.prototype,"onlyDirectionIcon",void 0);d([l()],u.prototype,"status",void 0);d([l()],u.prototype,"direction",void 0);d([l({type:Array})],u.prototype,"images",void 0);d([l({type:Array})],u.prototype,"price",void 0);d([l({type:Array})],u.prototype,"amount",void 0);d([l({type:Array})],u.prototype,"symbol",void 0);u=d([R("wui-transaction-list-item")],u);const M=D`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;var w=function(r,t,i,o){var s=arguments.length,e=s<3?t:o===null?o=Object.getOwnPropertyDescriptor(t,i):o,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")e=Reflect.decorate(r,t,i,o);else for(var c=r.length-1;c>=0;c--)(n=r[c])&&(e=(s<3?n(e):s>3?n(t,i,e):n(t,i))||e);return s>3&&e&&Object.defineProperty(t,i,e),e};const $="last-transaction",P=7;let f=class extends O{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.page="activity",this.caipAddress=v.state.activeCaipAddress,this.transactionsByYear=p.state.transactionsByYear,this.loading=p.state.loading,this.empty=p.state.empty,this.next=p.state.next,p.clearCursor(),this.unsubscribe.push(v.subscribeKey("activeCaipAddress",t=>{t&&this.caipAddress!==t&&(p.resetTransactions(),p.fetchTransactions(t)),this.caipAddress=t}),v.subscribeKey("activeCaipNetwork",()=>{this.updateTransactionView()}),p.subscribe(t=>{this.transactionsByYear=t.transactionsByYear,this.loading=t.loading,this.empty=t.empty,this.next=t.next}))}firstUpdated(){this.updateTransactionView(),this.createPaginationObserver()}updated(){this.setPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return a` ${this.empty?null:this.templateTransactionsByYear()}
    ${this.loading?this.templateLoading():null}
    ${!this.loading&&this.empty?this.templateEmpty():null}`}updateTransactionView(){p.resetTransactions(),this.caipAddress&&p.fetchTransactions(C.getPlainAddress(this.caipAddress))}templateTransactionsByYear(){return Object.keys(this.transactionsByYear).sort().reverse().map(i=>{const o=parseInt(i,10),s=new Array(12).fill(null).map((e,n)=>{const c=b.getTransactionGroupTitle(o,n),h=this.transactionsByYear[o]?.[n];return{groupTitle:c,transactions:h}}).filter(({transactions:e})=>e).reverse();return s.map(({groupTitle:e,transactions:n},c)=>{const h=c===s.length-1;return n?a`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${h?"true":"false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${e}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(n,h)}
            </wui-flex>
          </wui-flex>
        `:null})})}templateRenderTransaction(t,i){const{date:o,descriptions:s,direction:e,isAllNFT:n,images:c,status:h,transfers:y,type:I}=this.getTransactionListItemProps(t),j=y?.length>1;return y?.length===2&&!n?a`
        <wui-transaction-list-item
          date=${o}
          .direction=${e}
          id=${i&&this.next?$:""}
          status=${h}
          type=${I}
          .images=${c}
          .descriptions=${s}
        ></wui-transaction-list-item>
      `:j?y.map((_,N)=>{const B=b.getTransferDescription(_),k=i&&N===y.length-1;return a` <wui-transaction-list-item
          date=${o}
          direction=${_.direction}
          id=${k&&this.next?$:""}
          status=${h}
          type=${I}
          .onlyDirectionIcon=${!0}
          .images=${[c[N]]}
          .descriptions=${[B]}
        ></wui-transaction-list-item>`}):a`
      <wui-transaction-list-item
        date=${o}
        .direction=${e}
        id=${i&&this.next?$:""}
        status=${h}
        type=${I}
        .images=${c}
        .descriptions=${s}
      ></wui-transaction-list-item>
    `}templateTransactions(t,i){return t.map((o,s)=>{const e=i&&s===t.length-1;return a`${this.templateRenderTransaction(o,e)}`})}emptyStateActivity(){return a`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl","xl","3xl","xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`}emptyStateAccount(){return a`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`}templateEmpty(){return this.page==="account"?a`${this.emptyStateAccount()}`:a`${this.emptyStateActivity()}`}templateLoading(){return this.page==="activity"?Array(P).fill(a` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(t=>t):null}onReceiveClick(){Y.push("WalletReceive")}createPaginationObserver(){const t=v.state.activeChain,{projectId:i}=L.state;this.paginationObserver=new IntersectionObserver(([o])=>{o?.isIntersecting&&!this.loading&&(p.fetchTransactions(C.getPlainAddress(this.caipAddress)),z.sendEvent({type:"track",event:"LOAD_MORE_TRANSACTIONS",properties:{address:C.getPlainAddress(this.caipAddress),projectId:i,cursor:this.next,isSmartAccount:E(t)===F.ACCOUNT_TYPES.SMART_ACCOUNT}}))},{}),this.setPaginationObserver()}setPaginationObserver(){this.paginationObserver?.disconnect();const t=this.shadowRoot?.querySelector(`#${$}`);t&&this.paginationObserver?.observe(t)}getTransactionListItemProps(t){const i=V.formatDate(t?.metadata?.minedAt),o=b.getTransactionDescriptions(t),s=t?.transfers,e=t?.transfers?.[0],n=!!e&&t?.transfers?.every(h=>!!h.nft_info),c=b.getTransactionImages(s);return{date:i,direction:e?.direction,descriptions:o,isAllNFT:n,images:c,status:t.metadata?.status,transfers:s,type:t.metadata?.operationType}}};f.styles=M;w([l()],f.prototype,"page",void 0);w([x()],f.prototype,"caipAddress",void 0);w([x()],f.prototype,"transactionsByYear",void 0);w([x()],f.prototype,"loading",void 0);w([x()],f.prototype,"empty",void 0);w([x()],f.prototype,"next",void 0);f=w([R("w3m-activity-list")],f);
//# sourceMappingURL=index-B3uQX2x7.js.map
