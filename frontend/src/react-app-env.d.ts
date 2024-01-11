/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
}

declare namespace API {
  interface ResponseVO<T> {
    status: boolean;
    msg: string;
    code: number;
    data: T;
  }
  interface OrderVO {
    id?: number;
    name: string;
    desc: string;
    amount: number;
    // edit only
    prevouseDesc?: string;
    editable?: boolean;
  }
  interface Pagination<T> {
    data: T[];
    total: number;
  }
}

declare module 'moment' {
  export default any;
}
