// Declarations for non-TS assets to quiet imports during migration
declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';

export {};

// Quick stubs for internal hook re-exports used by components during migration.
declare module '@/hooks' {
  export const useLocalStorage: any;
  export const useModel: any;
  export const useRequest: any;
  export default any;
}

declare module '@/hooks/useFormValidation' {
  export const createRules: any;
  export default any;
}
