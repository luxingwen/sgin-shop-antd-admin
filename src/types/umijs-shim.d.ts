declare module '@umijs/max' {
  // Minimal shims for ease of migration. Expand types as needed.
  export const request: any;
  export const history: any;
  export function useModel(name: string): any;
  export function useDispatch(): any;
  export function useSelector<T = any>(selector?: any): T;
  export function useLocation(): any;
  export function useNavigate(): any;
  export const Link: any;
  export type Effect = any;
  export type Reducer<T = any> = any;
  export type Subscription = any;
  export type RequestConfig = any;
  export type RequestOptions = any;
  export type AxiosError<T = any, U = any> = any;
  const _default: any;
  export default _default;
}

declare module '@umijs/use-request' {
  const anyExport: any;
  export default anyExport;
}

// Quick API namespace shim used across generated/service files.
declare namespace API {
  type UserInfo = any;
  type Result = any;
  type ListResult<T = any> = any;
  type PageInfo<T = any> = any;
}
