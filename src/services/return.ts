/**
 * Return / After-sales 服务
 */
import { request } from '@umijs/max';

export async function getMyReturns() {
  return request('/api/v1/return/mylist', {
    method: 'GET',
  });
}

export async function getReturnInfo(data: { uuid: string }) {
  return request('/api/v1/return/info', {
    method: 'POST',
    data,
  });
}

export async function adminApprove(data: { uuid: string; refund_amount: number }) {
  return request('/api/v1/admin/return/approve', {
    method: 'POST',
    data,
  });
}

export async function adminReject(data: { uuid: string; reason?: string }) {
  return request('/api/v1/admin/return/reject', {
    method: 'POST',
    data,
  });
}

export const returnApi = {
  getMyReturns,
  getReturnInfo,
  adminApprove,
  adminReject,
};
