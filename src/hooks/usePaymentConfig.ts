import { useCallback, useState } from 'react';
import { useDispatch } from '@umijs/max';

export function usePaymentConfig() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const getPaymentInfo = useCallback((params: any) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'payment/getPaymentInfo', payload: params, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    });
  }, [dispatch]);

  const updateConfig = useCallback(({ uuid, config }: { uuid: string; config: string }) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'payment/updatePaymentConfig', payload: { uuid, config }, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    });
  }, [dispatch]);

  const updateAlipayConfig = useCallback((formData: FormData) => {
    setLoading(true);
    return new Promise<any>((resolve) => {
      dispatch({ type: 'payment/updateAlipayConfig', payload: formData, callback: (res: any) => {
        setLoading(false);
        resolve(res);
      }});
    });
  }, [dispatch]);

  return { loading, getPaymentInfo, updateConfig, updateAlipayConfig };
}
