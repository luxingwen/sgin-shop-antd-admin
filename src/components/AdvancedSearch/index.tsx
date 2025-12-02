/**
 * 高级搜索组件（简化版）
 */

import React, { useState, useMemo } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, DatePicker, Space, Collapse } from 'antd';
import { SearchOutlined, ReloadOutlined, SaveOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
// @ts-ignore: temporary shim during migration
import { useLocalStorage } from '@/hooks';

const { RangePicker } = DatePicker;
const { Option } = Select;

export interface SearchFieldConfig {
  name: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'custom';
  placeholder?: string;
  options?: { label: string; value: any }[];
  render?: () => React.ReactNode;
  initialValue?: any;
  required?: boolean;
  colSpan?: number;
}

export interface AdvancedSearchProps {
  fields: SearchFieldConfig[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  defaultExpanded?: boolean;
  showExpand?: boolean;
  expandedRowCount?: number;
  showSave?: boolean;
  saveKey?: string;
  form?: FormInstance;
  extraActions?: React.ReactNode;
  loading?: boolean;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  fields,
  onSearch,
  onReset,
  defaultExpanded = false,
  showExpand = true,
  expandedRowCount = 2,
  showSave = false,
  saveKey,
  form: externalForm,
  extraActions,
  loading = false,
}) => {
  const [form] = Form.useForm(externalForm);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [savedSearches, setSavedSearches] = useLocalStorage<Record<string, any>>(saveKey || 'advanced-search-saved', {});

  const renderField = (field: SearchFieldConfig) => {
    const commonProps = { placeholder: field.placeholder || `请输入${field.label}` };
    switch (field.type) {
      case 'input':
        return <Input {...commonProps} allowClear />;
      case 'select':
        return (
          <Select {...commonProps} allowClear>
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>{option.label}</Option>
            ))}
          </Select>
        );
      case 'date':
        return <DatePicker {...commonProps} style={{ width: '100%' }} />;
      case 'dateRange':
        return <RangePicker {...(commonProps as any)} style={{ width: '100%' }} />;
      case 'number':
        return <Input {...commonProps} type="number" allowClear />;
      case 'custom':
        return field.render?.();
      default:
        return <Input {...commonProps} allowClear />;
    }
  };

  const displayFields = useMemo(() => {
    if (!showExpand || expanded) return fields;
    const fieldsPerRow = 3;
    const maxFields = expandedRowCount * fieldsPerRow;
    return fields.slice(0, maxFields);
  }, [fields, expanded, showExpand, expandedRowCount]);

  const handleSearch = () => {
    form.validateFields().then((values) => onSearch(values));
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
    onSearch({});
  };

  const handleSave = () => {
    const values = form.getFieldsValue();
    const name = prompt('请输入搜索条件名称：');
    if (name) setSavedSearches({ ...savedSearches, [name]: values });
  };

  const handleLoad = (name: string) => {
    const values = savedSearches[name];
    if (values) {
      form.setFieldsValue(values);
      onSearch(values);
    }
  };

  return (
    <Card className="mb-4">
      <Form form={form} layout="vertical" onFinish={handleSearch} initialValues={fields.reduce((acc, field) => { if (field.initialValue !== undefined) acc[field.name] = field.initialValue; return acc; }, {} as any)}>
        <Row gutter={16}>
          {displayFields.map((field) => (
            <Col key={field.name} xs={24} sm={12} md={8} lg={field.colSpan || 8}>
              <Form.Item name={field.name} label={field.label} rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : []}>
                {renderField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>

        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              {showExpand && fields.length > expandedRowCount * 3 && (
                <Button type="link" onClick={() => setExpanded(!expanded)} icon={expanded ? <UpOutlined /> : <DownOutlined />}>{expanded ? '收起' : '展开'}</Button>
              )}
              <Button onClick={handleReset} icon={<ReloadOutlined />}>重置</Button>
              {showSave && <Button onClick={handleSave} icon={<SaveOutlined />}>保存条件</Button>}
              {extraActions}
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />} loading={loading}>搜索</Button>
            </Space>
          </Col>
        </Row>

        {showSave && Object.keys(savedSearches).length > 0 && (
          <Row className="mt-4">
            <Col span={24}>
              <Collapse ghost>
                <Collapse.Panel header="已保存的搜索条件" key="saved">
                  <Space wrap>
                    {Object.keys(savedSearches).map((name) => (
                      <Button key={name} size="small" onClick={() => handleLoad(name)}>{name}</Button>
                    ))}
                  </Space>
                </Collapse.Panel>
              </Collapse>
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  );
};

export interface SimpleSearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  defaultValue?: string;
  searchText?: string;
  showButton?: boolean;
  width?: number | string;
}

export const SimpleSearch: React.FC<SimpleSearchProps> = ({ onSearch, placeholder = '请输入搜索关键词', loading = false, defaultValue, searchText = '搜索', showButton = true, width = 300 }) => {
  const [value, setValue] = useState(defaultValue || '');
  const handleSearch = () => onSearch(value);
  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };
  if (showButton) {
    return (
      <Space.Compact style={{ width }}>
        <Input placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onKeyPress={handleKeyPress} allowClear />
        <Button type="primary" icon={<SearchOutlined />} loading={loading} onClick={handleSearch}>{searchText}</Button>
      </Space.Compact>
    );
  }
  return <Input placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} onPressEnter={handleSearch} prefix={<SearchOutlined />} allowClear style={{ width }} />;
};

export default AdvancedSearch;
