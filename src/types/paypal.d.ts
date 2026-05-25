// src/types/paypal.d.ts

declare module '@paypal/checkout-server-sdk' {
  export namespace core {
    export class SandboxEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    export class LiveEnvironment {
      constructor(clientId: string, clientSecret: string);
    }
    export class PayPalHttpClient {
      constructor(environment: any);
      execute(request: any): Promise<any>;
    }
  }

  export namespace orders {
    export class OrdersCreateRequest {
      headers: Record<string, string>;
      body: any;
      constructor();
      prefer(preference: string): void;
      requestBody(order: any): void;
    }
    export class OrdersCaptureRequest {
      constructor(orderId: string);
      requestBody(body: any): void;
    }
  }
}
