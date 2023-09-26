export interface DataFeedOptions {
  SymbolInfo?: TradingView.LibrarySymbolInfo;
  DatafeedConfiguration?: TradingView.DatafeedConfiguration;
  getBars?: TradingView.IDatafeedChartApi['getBars'];
}

export interface DataSubscriber {
  symbolInfo: TradingView.LibrarySymbolInfo;
  resolution: string;
  lastBarTime: number | null;
  listener: TradingView.SubscribeBarsCallback;
}

export class DataFeed implements TradingView.IExternalDatafeed, TradingView.IDatafeedChartApi {
  private options: DataFeedOptions;
  private subscribers: Record<string, DataSubscriber> = {};

  constructor(options: DataFeedOptions) {
    this.options = options;
  }

  public async onReady(callback: TradingView.OnReadyCallback) {
    return new Promise((resolve) => resolve(void 0)).then(() => {
      if (this.options.DatafeedConfiguration) {
        callback(this.options.DatafeedConfiguration);
      }
    });
  }

  public async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: TradingView.SearchSymbolsCallback,
  ) {
    return new Promise((resolve) => resolve(void 0)).then(() => {
      onResult([]);
    });
  }

  public async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: TradingView.ResolveCallback,
    onResolveErrorCallback: TradingView.ErrorCallback,
  ) {
    return new Promise((resolve) => resolve(void 0)).then(() => {
      if (this.options.SymbolInfo) {
        onSymbolResolvedCallback({
          ...this.options.SymbolInfo,
          name: symbolName,
          full_name: symbolName,
          pricescale: symbolName.match(/^(BTC|ETH|AVAX).+/)
            ? 1e2
            : symbolName.match(/^(SHIB).+/)
            ? 1e8
            : 1e5,
        });
      } else {
        onResolveErrorCallback('');
      }
    });
  }

  public async getBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: TradingView.ResolutionString,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: TradingView.HistoryCallback,
    onError: TradingView.ErrorCallback,
    isFirstCall: boolean,
  ) {
    if (!this.options.getBars) {
      return new Promise((resolve) => resolve(void 0)).then(() => {
        onResult([], { noData: true });
      });
    }
    return this.options.getBars(
      symbolInfo,
      resolution,
      rangeStartDate,
      rangeEndDate,
      onResult,
      onError,
      isFirstCall,
    );
  }

  public subscribeBars(
    symbolInfo: TradingView.LibrarySymbolInfo,
    resolution: string,
    onRealtimeCallback: TradingView.SubscribeBarsCallback,
    subscriberUID: string,
  ) {
    if (this.subscribers[subscriberUID]) {
      return;
    }
    this.subscribers[subscriberUID] = {
      lastBarTime: null,
      listener: onRealtimeCallback,
      resolution: resolution,
      symbolInfo: symbolInfo,
    };
  }

  public unsubscribeBars(subscriberUID: string) {
    if (!this.subscribers[subscriberUID]) {
      return;
    }
    delete this.subscribers[subscriberUID];
  }

  public updateBar(bar: TradingView.Bar) {
    for (const listenerGuid in this.subscribers) {
      const subscriptionRecord = this.subscribers[listenerGuid];
      if (
        subscriptionRecord.lastBarTime !== null &&
        bar.time < subscriptionRecord.lastBarTime
      ) {
        continue;
      }
      subscriptionRecord.lastBarTime = bar.time;
      subscriptionRecord.listener(bar);
    }
  }

  public calculateHistoryDepth(
    resolution: TradingView.ResolutionString,
    resolutionBack: TradingView.ResolutionBackValues,
    intervalBack: number,
  ) {
    if (resolution === '5') {
      return {
        resolutionBack: 'D',
        intervalBack: 3,
      } as TradingView.HistoryDepth;
    } else if (resolution === '15') {
      return {
        resolutionBack: 'D',
        intervalBack: 5,
      } as TradingView.HistoryDepth;
    } else if (resolution === '1h') {
      return {
        resolutionBack: 'M',
        intervalBack: 1,
      } as TradingView.HistoryDepth;
    } else if (resolution === '4h') {
      return {
        resolutionBack: 'M',
        intervalBack: 3,
      } as TradingView.HistoryDepth;
    } else if (resolution === '1D') {
      return {
        resolutionBack: 'M',
        intervalBack: 24,
      } as TradingView.HistoryDepth;
    }
    return {
      resolutionBack,
      intervalBack,
    } as TradingView.HistoryDepth;
  }
}
