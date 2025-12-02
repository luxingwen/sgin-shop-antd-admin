import { request } from '@umijs/max';
import { BaseListResult, BaseResult } from '../types';

export async function getServerList(data: any): Promise<BaseListResult<any>> {
  return request('/api/v1/server/list', { method: 'POST', data });
}

export async function createServer(data: any): Promise<BaseResult<any>> {
  return request('/api/v1/server/create', { method: 'POST', data });
}

export async function updateServer(data: any): Promise<BaseResult<any>> {
  return request('/api/v1/server/update', { method: 'POST', data });
}

export async function deleteServer(data: any): Promise<BaseResult<any>> {
  return request('/api/v1/server/delete', { method: 'POST', data });
}

export async function getServerInfo(data: any): Promise<BaseResult<any>> {
  return request('/api/v1/server/info', { method: 'POST', data });
}

export const serverApi = { getServerList, createServer, updateServer, deleteServer, getServerInfo };
