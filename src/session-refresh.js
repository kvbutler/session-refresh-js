import createActivityDetector from 'activity-detector';
import 'regenerator-runtime/runtime';

const defaultOptions = {
  refreshInterval: 30000,
  debug: false,
};

function createSessionRefresh(options) {
  const refreshSession = new RefreshSession(options);
  refreshSession.setupListeners();
}

class RefreshSession {
  constructor(options) {
    this.validateOptions(options);
    this.options = this.setDefaultOptions(options);
    console.log(createActivityDetector);
    this.detector = createActivityDetector();
    this.log = log.bind(this);
    this.setupListeners();
  }

  setupListeners() {
    this.addActiveHandler();
    this.addIdleHandler();
  }

  validateOptions(options) {
    if (!options?.refreshUris?.length) {
      throw new Error('Options must contain at least 1 refresh URI. Example: createSessionRefresh({ refreshUris: [ \'https://example.com\' ] }).');
    }
  }

  setDefaultOptions(options) {
    return {...defaultOptions, ...options};
  }

  addActiveHandler() {
    this.detector.on('active', () => {
      this.log('User activity transitioned to active state.');
      const callback = this.invokeCallback.bind(this);
      const refresh = this.makeRefreshRequests.bind(this);
      callback(true);
      refresh();
      if (!this.intervalTask) {
        this.intervalTask = setInterval(() => {
          callback(true);
          refresh();
        }, 30000);
      }
    });
  }

  addIdleHandler() {
    this.detector.on('idle', () => {
      this.log('User activity transitioned to idle state.');
      if (this.intervalTask) {
        clearInterval(this.intervalTask);
      }
    });
  }

  invokeCallback(active) {
    if (this.options?.refreshCallback) {
      this.options.refreshCallback(active);
    }
  }

  makeRefreshRequests() {
    this.options.refreshUris.forEach(async (uri) => {
      this.log(`Sending request: ${uri}`);
      await fetch(uri);
    });
  }
}

function log(msg) {
  if (this.options?.debug) {
    console.log(msg);
  }
}

export default createSessionRefresh;
