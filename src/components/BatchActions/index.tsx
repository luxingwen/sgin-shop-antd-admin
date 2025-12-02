/**
 * 批量操作组件
 */

import React, { useState } from 'react';
import { Button, Space, Popconfirm, message, Modal } from 'antd';
import { DeleteOutlined, ExportOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import type { Key } from 'react';

export interface BatchAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  danger?: boolean;
  confirm?: boolean;
  confirmTitle?: string;
  handler: (selectedKeys: Key[], selectedRows: any[]) => Promise<void> | void;
  disabled?: boolean | ((selectedKeys: Key[], selectedRows: any[]) => boolean);
}

export interface BatchActionsProps {
  selectedRowKeys: Key[];
  selectedRows?: any[];
  actions: BatchAction[];
  extra?: React.ReactNode;
  onActionComplete?: () => void;
}

export const BatchActions: React.FC<BatchActionsProps> = ({ selectedRowKeys, selectedRows = [], actions, extra, onActionComplete }) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleAction = async (action: BatchAction) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要操作的数据');
      return;
    }
    setLoading({ ...loading, [action.key]: true });
    try {
      await action.handler(selectedRowKeys, selectedRows);
      message.success(`${action.label}成功`);
      onActionComplete?.();
    } catch (error) {
      message.error(`${action.label}失败`);
      console.error(error);
    } finally {
      setLoading({ ...loading, [action.key]: false });
    }
  };

  const renderButton = (action: BatchAction) => {
    const isDisabled = typeof action.disabled === 'function' ? action.disabled(selectedRowKeys, selectedRows) : action.disabled;
    const button = (
      <Button key={action.key} type={action.type || 'default'} icon={action.icon} danger={action.danger} loading={loading[action.key]} disabled={isDisabled || selectedRowKeys.length === 0} onClick={() => !action.confirm && handleAction(action)}>
        {action.label}
      </Button>
    );

    if (action.confirm) {
      return (
        <Popconfirm key={action.key} title={action.confirmTitle || `确定要${action.label}吗？`} onConfirm={() => handleAction(action)} okText="确定" cancelText="取消">
          {button}
        </Popconfirm>
      );
    }

    return button;
  };

  if (selectedRowKeys.length === 0 && !extra) return null;

  return (
    <Space className="mb-4">
      {selectedRowKeys.length > 0 && <span className="text-gray-600">已选择 <strong className="text-primary">{selectedRowKeys.length}</strong> 项</span>}
      {actions.map(renderButton)}
      {extra}
    </Space>
  );
};

export function useBatchDelete(deleteApi: (ids: Key[]) => Promise<any>) {
  const [deleting, setDeleting] = useState(false);
  const batchDelete = async (selectedKeys: Key[]) => {
    setDeleting(true);
    try {
      await deleteApi(selectedKeys as Key[]);
      return true;
    } finally {
      setDeleting(false);
    }
  };
  return { deleting, batchDelete };
}

export interface BatchEditModalProps {
  visible: boolean;
  onClose: () => void;
  selectedRows: any[];
  fields: { name: string; label: string; type: 'input' | 'select' | 'number'; options?: { label: string; value: any }[] }[];
  onSubmit: (values: any, selectedRows: any[]) => Promise<void>;
}

export const BatchEditModal: React.FC<BatchEditModalProps> = ({ visible, onClose, selectedRows, fields, onSubmit }) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [loadingState, setLoadingState] = useState(false);
  const handleSubmit = async () => {
    if (Object.keys(values).length === 0) { message.warning('请至少修改一个字段'); return; }
    setLoadingState(true);
    try { await onSubmit(values, selectedRows); message.success('批量编辑成功'); onClose(); } catch (error) { message.error('批量编辑失败'); } finally { setLoadingState(false); }
  };
  return (
    <Modal title="批量编辑" open={visible} onCancel={onClose} onOk={handleSubmit} confirmLoading={loadingState} width={600}>
      <div className="mb-4 text-gray-600">已选择 <strong>{selectedRows.length}</strong> 项数据</div>
      <Space direction="vertical" style={{ width: '100%' }}>
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block mb-2">{field.label}</label>
            {field.type === 'input' && (
              <input className="w-full px-3 py-2 border rounded" value={values[field.name] || ''} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })} placeholder={`请输入${field.label}`} />
            )}
            {field.type === 'select' && (
              <select className="w-full px-3 py-2 border rounded" value={values[field.name] || ''} onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}>
                <option value="">请选择{field.label}</option>
                {field.options?.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
              </select>
            )}
            {field.type === 'number' && (
              <input type="number" className="w-full px-3 py-2 border rounded" value={values[field.name] || ''} onChange={(e) => setValues({ ...values, [field.name]: Number(e.target.value) })} placeholder={`请输入${field.label}`} />
            )}
          </div>
        ))}
      </Space>
    </Modal>
  );
};

export function useBatchActions() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const rowSelection = { selectedRowKeys, onChange: (keys: Key[], rows: any[]) => { setSelectedRowKeys(keys); setSelectedRows(rows); } };
  const clearSelection = () => { setSelectedRowKeys([]); setSelectedRows([]); };
  const selectAll = (allRows: any[], rowKey: string = 'id') => { const keys = allRows.map((row) => row[rowKey]); setSelectedRowKeys(keys); setSelectedRows(allRows); };
  const invertSelection = (allRows: any[], rowKey: string = 'id') => { const allKeys = allRows.map((row) => row[rowKey]); const newKeys = allKeys.filter((key) => !selectedRowKeys.includes(key)); const newRows = allRows.filter((row) => newKeys.includes(row[rowKey])); setSelectedRowKeys(newKeys); setSelectedRows(newRows); };
  return { selectedRowKeys, selectedRows, rowSelection, clearSelection, selectAll, invertSelection, hasSelected: selectedRowKeys.length > 0, selectedCount: selectedRowKeys.length };
}

export const createBatchActions = {
  delete: (handler: (keys: Key[]) => Promise<void>): BatchAction => ({ key: 'delete', label: '批量删除', icon: <DeleteOutlined />, danger: true, confirm: true, confirmTitle: '确定要删除选中的数据吗？', handler }),
  export: (handler: (keys: Key[], rows: any[]) => Promise<void>): BatchAction => ({ key: 'export', label: '批量导出', icon: <ExportOutlined />, handler }),
  enable: (handler: (keys: Key[]) => Promise<void>): BatchAction => ({ key: 'enable', label: '批量启用', icon: <CheckOutlined />, type: 'primary', handler }),
  disable: (handler: (keys: Key[]) => Promise<void>): BatchAction => ({ key: 'disable', label: '批量禁用', icon: <DeleteOutlined />, handler }),
  edit: (handler: (keys: Key[], rows: any[]) => Promise<void>): BatchAction => ({ key: 'edit', label: '批量编辑', icon: <EditOutlined />, handler }),
};

export default BatchActions;
