/**
 * 搜索表单组件
 */

import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';

const { RangePicker } = DatePicker;

export interface SearchField {
  name: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange';
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  span?: number;
}

interface SearchFormProps {
  fields: SearchField[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  form?: FormInstance;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: any;
  wrapperCol?: any;
}

const SearchForm: React.FC<SearchFormProps> = ({
  fields,
  onSearch,
  onReset,
  form: externalForm,
  layout = 'horizontal',
  labelCol,
  wrapperCol,
}) => {
  const [form] = Form.useForm(externalForm);

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  const renderField = (field: SearchField) => {
    switch (field.type) {
      case 'input':
        return (
          <Input
            placeholder={field.placeholder || `请输入${field.label}`}
            allowClear
          />
        );
      case 'select':
        return (
          <Select
            placeholder={field.placeholder || `请选择${field.label}`}
            options={field.options}
            allowClear
          />
        );
      case 'date':
        return (
          <DatePicker
            placeholder={field.placeholder || `请选择${field.label}`}
            style={{ width: '100%' }}
          />
        );
      case 'dateRange':
        return (
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: '100%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
    >
      <Row gutter={16}>
        {fields.map((field) => (
          <Col key={field.name} span={field.span || 8}>
            <Form.Item name={field.name} label={field.label}>
              {renderField(field)}
            </Form.Item>
          </Col>
        ))}
        <Col span={8}>
          <Form.Item label=" " colon={false}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
              >
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
