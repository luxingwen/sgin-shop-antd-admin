/**
 * 数据导出组件（简化版，保留 XLSX 支持）
 */

import React, { useState } from 'react';
import { Button, Dropdown, message, Space } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import * as XLSX from 'xlsx';

function normalizeRawData(rawData: any): any[] {
  if (Array.isArray(rawData)) return rawData;
  if (rawData && typeof rawData === 'object') {
    if (Array.isArray(rawData.data)) return rawData.data;
    if (Array.isArray(rawData.list)) return rawData.list;
    return [rawData];
  }
  return [];
}

export interface ExportConfig {
  filename?: string;
  sheetName?: string;
  columns?: any[];
  includeHeader?: boolean;
  dataTransform?: (data: any[]) => any[];
}

export interface ExportButtonProps {
  data: any[];
  config?: ExportConfig;
  formats?: ('excel' | 'csv' | 'json')[];
  buttonText?: string;
  buttonType?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  onBeforeExport?: (format: string) => Promise<boolean> | boolean;
  onExportSuccess?: (format: string) => void;
  onExportError?: (error: Error) => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  config = {},
  formats = ['excel', 'csv', 'json'],
  buttonText = '导出',
  buttonType = 'default',
  onBeforeExport,
  onExportSuccess,
  onExportError,
}) => {
  const [exporting, setExporting] = useState(false);

  const { filename = 'export', sheetName = 'Sheet1', columns, includeHeader = true, dataTransform } = config;

  const transformData = (rawData: any[]): any[] => {
    let processedData = rawData;
    if (dataTransform) processedData = dataTransform(processedData);
    if (columns && columns.length > 0) {
      processedData = processedData.map((record: any, index: number) => {
        const row: any = {};
        columns.forEach((col: any) => {
          const value = record[col.dataIndex];
          row[col.title] = col.render ? col.render(value, record, index) : value;
        });
        return row;
      });
    }
    return processedData;
  };

  const exportToExcel = async () => {
    try {
      const normalized = normalizeRawData(data);
      const processed = transformData(normalized);
      const worksheet = XLSX.utils.json_to_sheet(processed, { skipHeader: !includeHeader });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      message.success('Excel 导出成功');
      onExportSuccess?.('excel');
    } catch (error) {
      message.error('Excel 导出失败');
      onExportError?.(error as Error);
      throw error;
    }
  };

  const exportToCSV = async () => {
    try {
      const normalized = normalizeRawData(data);
      const processed = transformData(normalized);
      const worksheet = XLSX.utils.json_to_sheet(processed, { skipHeader: !includeHeader });
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      message.success('CSV 导出成功');
      onExportSuccess?.('csv');
    } catch (error) {
      message.error('CSV 导出失败');
      onExportError?.(error as Error);
      throw error;
    }
  };

  const exportToJSON = async () => {
    try {
      const normalized = normalizeRawData(data);
      const processed = transformData(normalized);
      const json = JSON.stringify(processed, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
      message.success('JSON 导出成功');
      onExportSuccess?.('json');
    } catch (error) {
      message.error('JSON 导出失败');
      onExportError?.(error as Error);
      throw error;
    }
  };

  const handleExport = async (format: 'excel' | 'csv' | 'json') => {
    if (!data || data.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }
    if (onBeforeExport) {
      const can = await onBeforeExport(format);
      if (!can) return;
    }
    setExporting(true);
    try {
      if (format === 'excel') await exportToExcel();
      if (format === 'csv') await exportToCSV();
      if (format === 'json') await exportToJSON();
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setExporting(false);
    }
  };

  if (formats.length === 1) {
    return (
      <Button type={buttonType} icon={<DownloadOutlined />} loading={exporting} onClick={() => handleExport(formats[0])}>
        {buttonText}
      </Button>
    );
  }

  const menuItems: MenuProps['items'] = formats.map((format) => {
    const icons = { excel: <FileExcelOutlined />, csv: <FileTextOutlined />, json: <FileTextOutlined /> };
    const labels: any = { excel: '导出为 Excel', csv: '导出为 CSV', json: '导出为 JSON' };
    return { key: format, icon: icons[format], label: labels[format], onClick: () => handleExport(format) };
  });

  return (
    <Dropdown menu={{ items: menuItems }} disabled={exporting}>
      <Button type={buttonType} icon={<DownloadOutlined />} loading={exporting}>
        <Space>{buttonText}</Space>
      </Button>
    </Dropdown>
  );
};

export default ExportButton;

export function useExport(config?: ExportConfig) {
  const [exporting, setExporting] = useState(false);

  const exportData = async (data: any[], format: 'excel' | 'csv' | 'json', customConfig?: ExportConfig) => {
    const finalConfig = { ...config, ...customConfig };
    const { filename = 'export', sheetName = 'Sheet1', columns, includeHeader = true, dataTransform } = finalConfig;
    const normalized = normalizeRawData(data);
    if (!normalized || normalized.length === 0) {
      message.warning('没有可导出的数据');
      return false;
    }
    setExporting(true);
    try {
      let processed = normalized;
      if (dataTransform) processed = dataTransform(processed);
      if (columns && columns.length > 0) {
        processed = processed.map((record: any, index: number) => {
          const row: any = {};
          columns.forEach((col: any) => {
            const value = record[col.dataIndex];
            row[col.title] = col.render ? col.render(value, record, index) : value;
          });
          return row;
        });
      }
      if (format === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(processed, { skipHeader: !includeHeader });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      } else if (format === 'csv') {
        const worksheet = XLSX.utils.json_to_sheet(processed, { skipHeader: !includeHeader });
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
      } else if (format === 'json') {
        const json = JSON.stringify(processed, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
      }
      message.success(`${format.toUpperCase()} 导出成功`);
      return true;
    } catch (error) {
      message.error('导出失败');
      console.error('Export error:', error);
      return false;
    } finally {
      setExporting(false);
    }
  };

  return { exporting, exportData };
}
