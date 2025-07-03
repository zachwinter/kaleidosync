import{aV as Y,at as _,aM as R,aN as h,aJ as k,aU as f,bl as $,b4 as W,aO as A,aR as I,aL as E,aw as O,bm as S,aC as P,b9 as B,ba as H,aA as M,aB as G,aD as p,aF as F}from"./index-xeh6oSzU.js";import{o as C,r as w,c as V}from"./if-defined-DlTid8OG.js";import"./index-Cgz4xfK4.js";import"./index-B60BOmoh.js";import"./index-BuWDF8Nt.js";import"./index-_BiY2HJ4.js";import"./index-CCs5CaNi.js";import"./index-CILjpBgV.js";import"./index-DxXqiEiB.js";import"./index-zZmqK8Dj.js";import"./index-DhmUn2IF.js";const i={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},g={[i.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[i.INVALID_RECIPIENT]:"Invalid recipient address",[i.INVALID_ASSET]:"Invalid asset specified",[i.INVALID_AMOUNT]:"Invalid payment amount",[i.UNKNOWN_ERROR]:"Unknown payment error occurred",[i.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[i.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[i.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[i.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[i.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[i.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[i.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};class c extends Error{get message(){return g[this.code]}constructor(e,s){super(g[e]),this.name="AppKitPayError",this.code=e,this.details=s,Error.captureStackTrace&&Error.captureStackTrace(this,c)}}const j="https://rpc.walletconnect.org/v1/json-rpc";class K extends Error{}function z(){const n=Y.getSnapshot().projectId;return`${j}?projectId=${n}`}async function U(n,e){const s=z(),r=await(await fetch(s,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:n,params:e}),headers:{"Content-Type":"application/json"}})).json();if(r.error)throw new K(r.error.message);return r}async function L(n){return(await U("reown_getExchanges",n)).result}async function q(n){return(await U("reown_getExchangePayUrl",n)).result}async function X(n){return(await U("reown_getExchangeBuyStatus",n)).result}const J=["eip155"],Q={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"},solana:{native:{assetNamespace:"slip44",assetReference:"501"},defaultTokenNamespace:"token"}};function b(n,e){const{chainNamespace:s,chainId:a}=_.parseCaipNetworkId(n),o=Q[s];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${s}`);let r=o.native.assetNamespace,u=o.native.assetReference;return e!=="native"&&(r=o.defaultTokenNamespace,u=e),`${`${s}:${a}`}/${r}:${u}`}function Z(n){const{chainNamespace:e}=_.parseCaipNetworkId(n);return J.includes(e)}async function ee(n){const{paymentAssetNetwork:e,activeCaipNetwork:s,approvedCaipNetworkIds:a,requestedCaipNetworks:o}=n,u=R.sortRequestedNetworks(a,o).find(T=>T.caipNetworkId===e);if(!u)throw new c(i.INVALID_PAYMENT_CONFIG);if(u.caipNetworkId===s.caipNetworkId)return;const d=h.getNetworkProp("supportsAllNetworks",u.chainNamespace);if(!(a?.includes(u.caipNetworkId)||d))throw new c(i.INVALID_PAYMENT_CONFIG);try{await h.switchActiveNetwork(u)}catch(T){throw new c(i.GENERIC_PAYMENT_ERROR,T)}}async function te(n,e,s){if(e!==k.CHAIN.EVM)throw new c(i.INVALID_CHAIN_NAMESPACE);if(!s.fromAddress)throw new c(i.INVALID_PAYMENT_CONFIG,"fromAddress is required for native EVM payments.");const a=typeof s.amount=="string"?parseFloat(s.amount):s.amount;if(isNaN(a))throw new c(i.INVALID_PAYMENT_CONFIG);const o=n.metadata?.decimals??18,r=f.parseUnits(a.toString(),o);if(typeof r!="bigint")throw new c(i.GENERIC_PAYMENT_ERROR);return await f.sendTransaction({chainNamespace:e,to:s.recipient,address:s.fromAddress,value:r,data:"0x"})??void 0}async function ne(n,e){if(!e.fromAddress)throw new c(i.INVALID_PAYMENT_CONFIG,"fromAddress is required for ERC20 EVM payments.");const s=n.asset,a=e.recipient,o=Number(n.metadata.decimals),r=f.parseUnits(e.amount.toString(),o);if(r===void 0)throw new c(i.GENERIC_PAYMENT_ERROR);return await f.writeContract({fromAddress:e.fromAddress,tokenAddress:s,args:[a,r],method:"transfer",abi:$.getERC20Abi(s),chainNamespace:k.CHAIN.EVM})??void 0}const D=0,v="unknown",t=W({paymentAsset:{network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},recipient:"0x0",amount:0,isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0,analyticsSet:!1,paymentId:void 0}),l={state:t,subscribe(n){return H(t,()=>n(t))},subscribeKey(n,e){return B(t,n,e)},async handleOpenPay(n){this.resetState(),this.setPaymentConfig(n),this.subscribeEvents(),this.initializeAnalytics(),t.isConfigured=!0,A.sendEvent({type:"track",event:"PAY_MODAL_OPEN",properties:{exchanges:t.exchanges,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount}}}),await P.open({view:"Pay"})},resetState(){t.paymentAsset={network:"eip155:1",asset:"0x0",metadata:{name:"0x0",symbol:"0x0",decimals:0}},t.recipient="0x0",t.amount=0,t.isConfigured=!1,t.error=null,t.isPaymentInProgress=!1,t.isLoading=!1,t.currentPayment=void 0},setPaymentConfig(n){if(!n.paymentAsset)throw new c(i.INVALID_PAYMENT_CONFIG);try{t.paymentAsset=n.paymentAsset,t.recipient=n.recipient,t.amount=n.amount,t.openInNewTab=n.openInNewTab??!0,t.redirectUrl=n.redirectUrl,t.payWithExchange=n.payWithExchange,t.error=null}catch(e){throw new c(i.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return t.paymentAsset},getExchanges(){return t.exchanges},async fetchExchanges(){try{t.isLoading=!0;const n=await L({page:D,asset:b(t.paymentAsset.network,t.paymentAsset.asset),amount:t.amount.toString()});t.exchanges=n.exchanges.slice(0,2)}catch{throw I.showError(g.UNABLE_TO_GET_EXCHANGES),new c(i.UNABLE_TO_GET_EXCHANGES)}finally{t.isLoading=!1}},async getAvailableExchanges(n){try{const e=n?.asset&&n?.network?b(n.network,n.asset):void 0;return await L({page:n?.page??D,asset:e,amount:n?.amount?.toString()})}catch{throw new c(i.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(n,e,s=!1){try{const a=Number(e.amount),o=await q({exchangeId:n,asset:b(e.network,e.asset),amount:a.toString(),recipient:`${e.network}:${e.recipient}`});return A.sendEvent({type:"track",event:"PAY_EXCHANGE_SELECTED",properties:{exchange:{id:n},configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:n},headless:s}}),s&&(this.initiatePayment(),A.sendEvent({type:"track",event:"PAY_INITIATED",properties:{paymentId:t.paymentId||v,configuration:{network:e.network,asset:e.asset,recipient:e.recipient,amount:a},currentPayment:{type:"exchange",exchangeId:n}}})),o}catch(a){throw a instanceof Error&&a.message.includes("is not supported")?new c(i.ASSET_NOT_SUPPORTED):new Error(a.message)}},async openPayUrl(n,e,s=!1){try{const a=await this.getPayUrl(n.exchangeId,e,s);if(!a)throw new c(i.UNABLE_TO_GET_PAY_URL);const r=n.openInNewTab??!0?"_blank":"_self";return R.openHref(a.url,r),a}catch(a){throw a instanceof c?t.error=a.message:t.error=g.GENERIC_PAYMENT_ERROR,new c(i.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){t.isConfigured||(S.subscribeProviders(async n=>{const e=h.state.activeChain;S.getProvider(e)&&await this.handlePayment()}),E.subscribeKey("caipAddress",async n=>{n&&await this.handlePayment()}))},async handlePayment(){t.currentPayment={type:"wallet",status:"IN_PROGRESS"};const n=E.state.caipAddress;if(!n)return;const{chainId:e,address:s}=_.parseCaipAddress(n),a=h.state.activeChain;if(!s||!e||!a||!S.getProvider(a))return;const r=h.state.activeCaipNetwork;if(r&&!t.isPaymentInProgress)try{this.initiatePayment();const u=h.getAllRequestedCaipNetworks(),d=h.getAllApprovedCaipNetworkIds();switch(await ee({paymentAssetNetwork:t.paymentAsset.network,activeCaipNetwork:r,approvedCaipNetworkIds:d,requestedCaipNetworks:u}),await P.open({view:"PayLoading"}),a){case k.CHAIN.EVM:t.paymentAsset.asset==="native"&&(t.currentPayment.result=await te(t.paymentAsset,a,{recipient:t.recipient,amount:t.amount,fromAddress:s})),t.paymentAsset.asset.startsWith("0x")&&(t.currentPayment.result=await ne(t.paymentAsset,{recipient:t.recipient,amount:t.amount,fromAddress:s})),t.currentPayment.status="SUCCESS";break;default:throw new c(i.INVALID_CHAIN_NAMESPACE)}}catch(u){u instanceof c?t.error=u.message:t.error=g.GENERIC_PAYMENT_ERROR,t.currentPayment.status="FAILED",I.showError(t.error)}finally{t.isPaymentInProgress=!1}},getExchangeById(n){return t.exchanges.find(e=>e.id===n)},validatePayConfig(n){const{paymentAsset:e,recipient:s,amount:a}=n;if(!e)throw new c(i.INVALID_PAYMENT_CONFIG);if(!s)throw new c(i.INVALID_RECIPIENT);if(!e.asset)throw new c(i.INVALID_ASSET);if(a==null||a<=0)throw new c(i.INVALID_AMOUNT)},handlePayWithWallet(){const n=E.state.caipAddress;if(!n){O.push("Connect");return}const{chainId:e,address:s}=_.parseCaipAddress(n),a=h.state.activeChain;if(!s||!e||!a){O.push("Connect");return}this.handlePayment()},async handlePayWithExchange(n){try{t.currentPayment={type:"exchange",exchangeId:n};const{network:e,asset:s}=t.paymentAsset,a={network:e,asset:s,amount:t.amount,recipient:t.recipient},o=await this.getPayUrl(n,a);if(!o)throw new c(i.UNABLE_TO_INITIATE_PAYMENT);return t.currentPayment.sessionId=o.sessionId,t.currentPayment.status="IN_PROGRESS",t.currentPayment.exchangeId=n,this.initiatePayment(),{url:o.url,openInNewTab:t.openInNewTab}}catch(e){return e instanceof c?t.error=e.message:t.error=g.GENERIC_PAYMENT_ERROR,t.isPaymentInProgress=!1,I.showError(t.error),null}},async getBuyStatus(n,e){try{const s=await X({sessionId:e,exchangeId:n});return(s.status==="SUCCESS"||s.status==="FAILED")&&A.sendEvent({type:"track",event:s.status==="SUCCESS"?"PAY_SUCCESS":"PAY_ERROR",properties:{paymentId:t.paymentId||v,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:"exchange",exchangeId:t.currentPayment?.exchangeId,sessionId:t.currentPayment?.sessionId,result:s.txHash}}}),s}catch{throw new c(i.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(n,e){try{const s=await this.getBuyStatus(n,e);t.currentPayment&&(t.currentPayment.status=s.status,t.currentPayment.result=s.txHash),(s.status==="SUCCESS"||s.status==="FAILED")&&(t.isPaymentInProgress=!1)}catch{throw new c(i.UNABLE_TO_GET_BUY_STATUS)}},initiatePayment(){t.isPaymentInProgress=!0,t.paymentId=crypto.randomUUID()},initializeAnalytics(){t.analyticsSet||(t.analyticsSet=!0,this.subscribeKey("isPaymentInProgress",n=>{if(t.currentPayment?.status&&t.currentPayment.status!=="UNKNOWN"){const e={IN_PROGRESS:"PAY_INITIATED",SUCCESS:"PAY_SUCCESS",FAILED:"PAY_ERROR"}[t.currentPayment.status];A.sendEvent({type:"track",event:e,properties:{paymentId:t.paymentId||v,configuration:{network:t.paymentAsset.network,asset:t.paymentAsset.asset,recipient:t.recipient,amount:t.amount},currentPayment:{type:t.currentPayment.type,exchangeId:t.currentPayment.exchangeId,sessionId:t.currentPayment.sessionId,result:t.currentPayment.result}}})}}))}},se=M`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;var y=function(n,e,s,a){var o=arguments.length,r=o<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,s):a,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(n,e,s,a);else for(var d=n.length-1;d>=0;d--)(u=n[d])&&(r=(o<3?u(r):o>3?u(e,s,r):u(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r};let m=class extends G{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=l.state.exchanges,this.isLoading=l.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=E.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(l.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(l.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(E.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),l.fetchExchanges()}get isWalletConnected(){return E.state.status==="connected"}render(){return p`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){const e=l.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=l.state.amount.toString()}renderPayWithWallet(){return Z(this.networkName)?p`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`:p``}renderPaymentHeader(){let e=this.networkName;if(this.networkName){const a=h.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.networkName);a&&(e=a.name)}return p`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?p`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){const e=this.connectedWalletInfo?.name||"connected wallet";return p`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${C(this.connectedWalletInfo?.icon)}
            name=${C(this.connectedWalletInfo?.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${e}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return p`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?p`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:this.exchanges.length===0?p`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>p`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${this.loadingExchangeId!==null}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?p`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:p`<wui-wallet-image
                  size="sm"
                  imageSrc=${C(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){l.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;const s=await l.handlePayWithExchange(e);s&&(await P.open({view:"PayLoading"}),R.openHref(s.url,s.openInNewTab?"_blank":"_self"))}catch(s){console.error("Failed to pay with exchange",s),I.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await f.disconnect(),P.close()}catch{console.error("Failed to disconnect"),I.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};m.styles=se;y([w()],m.prototype,"amount",void 0);y([w()],m.prototype,"tokenSymbol",void 0);y([w()],m.prototype,"networkName",void 0);y([w()],m.prototype,"exchanges",void 0);y([w()],m.prototype,"isLoading",void 0);y([w()],m.prototype,"loadingExchangeId",void 0);y([w()],m.prototype,"connectedWalletInfo",void 0);m=y([V("w3m-pay-view")],m);const ae=M`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var x=function(n,e,s,a){var o=arguments.length,r=o<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,s):a,u;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(n,e,s,a);else for(var d=n.length-1;d>=0;d--)(u=n[d])&&(r=(o<3?u(r):o>3?u(e,s,r):u(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r};const re=4e3;let N=class extends G{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=l.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return p`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:l.state.currentPayment?.type==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){l.state.currentPayment?.type==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{const e=l.state.currentPayment?.exchangeId,s=l.state.currentPayment?.sessionId;e&&s&&(await l.updateBuyStatus(e,s),l.state.currentPayment?.status==="SUCCESS"&&clearInterval(this.exchangeSubscription))},re))}setupSubscription(){l.subscribeKey("isPaymentInProgress",e=>{!e&&this.paymentState==="in-progress"&&(l.state.error||!l.state.currentPayment?.result?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{f.state.status!=="disconnected"&&P.close()},3e3))}),l.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){const e=F.state.themeVariables["--w3m-border-radius-master"],s=e?parseInt(e.replace("px",""),10):4;return p`<wui-loading-thumbnail radius=${s*9}></wui-loading-thumbnail>`}successTemplate(){return p`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return p`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};N.styles=ae;x([w()],N.prototype,"loadingMessage",void 0);x([w()],N.prototype,"subMessage",void 0);x([w()],N.prototype,"paymentState",void 0);N=x([V("w3m-pay-loading-view")],N);async function Ne(n){return l.handleOpenPay(n)}function Ae(){return l.getExchanges()}function Ie(){return l.state.currentPayment?.result}function Pe(){return l.state.error}function _e(){return l.state.isPaymentInProgress}const xe={network:"eip155:8453",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}},Te={network:"eip155:8453",asset:"0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",metadata:{name:"USD Coin",symbol:"USDC",decimals:6}},Se={network:"eip155:84532",asset:"native",metadata:{name:"Ethereum",symbol:"ETH",decimals:18}};export{N as W3mPayLoadingView,m as W3mPayView,xe as baseETH,Se as baseSepoliaETH,Te as baseUSDC,Ae as getExchanges,_e as getIsPaymentInProgress,Pe as getPayError,Ie as getPayResult,Ne as openPay};
//# sourceMappingURL=index-B3nrOkeb.js.map
