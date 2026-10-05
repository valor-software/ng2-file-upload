export class FakeXhr {
  static instances: FakeXhr[] = [];
  upload: any = {};
  status = 0;
  response = '';
  responseText = '';
  readyState = 0;
  withCredentials = false;
  method?: string;
  url?: string;
  body: any;
  requestHeaders: { [ name: string ]: string } = {};
  sent = false;
  aborted = false;
  onload?: () => void;
  onerror?: () => void;
  onabort?: () => void;
  onreadystatechange?: () => void;

  constructor() {
    FakeXhr.instances.push(this);
  }

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string): void {
    this.requestHeaders[ name ] = value;
  }

  send(body: any): void {
    this.body = body;
    this.sent = true;
  }

  abort(): void {
    if (this.readyState === 4) {
      this.status = 0;
    }
    if (!this.sent || this.readyState === 4) {
      return;
    }
    this.aborted = true;
    this.onabort?.();
  }

  getAllResponseHeaders(): string {
    return '';
  }

  respond(status: number, response = ''): void {
    this.status = status;
    this.response = response;
    this.responseText = response;
    this.readyState = 4;
    this.onreadystatechange?.();
    this.onload?.();
  }
}

export function sent(): FakeXhr[] {
  return FakeXhr.instances.filter(xhr => xhr.sent);
}

export function last(): FakeXhr {
  const requests = sent();

  return requests[ requests.length - 1 ];
}

export function installFakeXhr(): void {
  const originalXhr = (globalThis as any).XMLHttpRequest;

  beforeEach(() => {
    FakeXhr.instances = [];
    (globalThis as any).XMLHttpRequest = FakeXhr;
    (FakeXhr as any).DONE = 4;
  });

  afterEach(() => {
    (globalThis as any).XMLHttpRequest = originalXhr;
  });
}
