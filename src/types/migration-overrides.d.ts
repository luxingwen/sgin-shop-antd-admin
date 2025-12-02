// Temporary migration overrides: relax specific third-party and common signatures
// Remove or refine these once TypeScript errors are addressed file-by-file.

declare module 'react-paypal-js' {
  export type ReactPayPalScriptOptions = any;
}

declare module 'rc-upload' {
  export type RcCustomRequestOptions<T = any> = any;
}

declare module 'antd/es/upload/interface' {
  export type RcCustomRequestOptions<T = any> = any;
}

declare global {
  type ReactPayPalScriptOptions = any;
  type RcCustomRequestOptions<T = any> = any;
  type UploadRequestOption = any;
}

export {};
