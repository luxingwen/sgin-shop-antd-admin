/**
 * 配置化表单组件（简化版）
 */

import React, { useMemo } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, TimePicker, Switch, Radio, Checkbox, Upload, Rate, Slider, TreeSelect, Cascader, Transfer } from 'antd';
import type { FormInstance, FormItemProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// @ts-ignore: temporary shim during migration
import { createRules } from '@/hooks/useFormValidation';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

export type FormItemType = 'input' | 'textarea' | 'number' | 'password' | 'select' | 'multiSelect' | 'radio' | 'checkbox' | 'checkboxGroup' | 'date' | 'dateRange' | 'time' | 'switch' | 'rate' | 'slider' | 'upload' | 'treeSelect' | 'cascader' | 'transfer' | 'custom';

export interface FormItemConfig extends Omit<FormItemProps, 'children'> {
  name: string;
  label: string;
  type: FormItemType;
  placeholder?: string;
  initialValue?: any;
  rules?: any[];
  required?: boolean;
  disabled?: boolean;
  tooltip?: string;
  extra?: string;
  colSpan?: number;
  hidden?: boolean;
  dependencies?: string[];
  render?: (form: FormInstance) => React.ReactNode;
  props?: any;
}

export interface OptionConfig { label: string; value: any; disabled?: boolean; children?: OptionConfig[] }

export interface FormConfig { items: FormItemConfig[]; layout?: 'horizontal' | 'vertical' | 'inline'; labelCol?: any; wrapperCol?: any; columns?: number; }

const renderFormItem = (config: FormItemConfig, form: FormInstance): React.ReactNode => {
  const { type, placeholder, disabled, props = {} } = config;
  const commonProps = { placeholder: placeholder || `请输入${config.label}`, disabled, ...props };
  switch (type) {
    case 'input': return <Input {...commonProps} allowClear />;
    case 'textarea': return <TextArea {...commonProps} rows={props.rows || 4} showCount={props.showCount} maxLength={props.maxLength} allowClear />;
    case 'number': return <InputNumber {...commonProps} style={{ width: '100%' }} min={props.min} max={props.max} step={props.step} precision={props.precision} />;
    case 'password': return <Input.Password {...commonProps} allowClear />;
    case 'select': return (<Select {...commonProps} allowClear showSearch={props.showSearch}>{props.options?.map((option: OptionConfig) => (<Option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</Option>))}</Select>);
    case 'multiSelect': return (<Select {...commonProps} mode="multiple" allowClear showSearch={props.showSearch}>{props.options?.map((option: OptionConfig) => (<Option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</Option>))}</Select>);
    case 'radio': return (<Radio.Group {...commonProps}>{props.options?.map((option: OptionConfig) => (<Radio key={option.value} value={option.value} disabled={option.disabled}>{option.label}</Radio>))}</Radio.Group>);
    case 'checkbox': return <Checkbox {...commonProps}>{props.label || config.label}</Checkbox>;
    case 'checkboxGroup': return (<Checkbox.Group {...commonProps}>{props.options?.map((option: OptionConfig) => (<Checkbox key={option.value} value={option.value} disabled={option.disabled}>{option.label}</Checkbox>))}</Checkbox.Group>);
    case 'date': return <DatePicker {...commonProps} style={{ width: '100%' }} format={props.format} />;
    case 'dateRange': return <RangePicker {...commonProps} style={{ width: '100%' }} format={props.format} />;
    case 'time': return <TimePicker {...commonProps} style={{ width: '100%' }} format={props.format} />;
    case 'switch': return (<Switch {...commonProps} checkedChildren={props.checkedChildren} unCheckedChildren={props.unCheckedChildren} />);
    case 'rate': return <Rate {...commonProps} count={props.count} allowHalf={props.allowHalf} />;
    case 'slider': return (<Slider {...commonProps} min={props.min} max={props.max} step={props.step} marks={props.marks} range={props.range} />);
    case 'upload': return (<Upload {...commonProps} action={props.action} listType={props.listType}><button type="button"><UploadOutlined /> {props.buttonText || '点击上传'}</button></Upload>);
    case 'treeSelect': return (<TreeSelect {...commonProps} treeData={props.treeData} treeCheckable={props.treeCheckable} showSearch={props.showSearch} allowClear />);
    case 'cascader': return (<Cascader {...commonProps} options={props.options} showSearch={props.showSearch} allowClear />);
    case 'transfer': return (<Transfer {...commonProps} dataSource={props.dataSource} titles={props.titles} render={props.render} />);
    case 'custom': return config.render?.(form);
    default: return <Input {...commonProps} allowClear />;
  }
};

export interface ConfigFormProps { config: FormConfig; form?: FormInstance; initialValues?: any; onFinish?: (values: any) => void; onFinishFailed?: (errorInfo: any) => void; onValuesChange?: (changedValues: any, allValues: any) => void; formProps?: any; }

export const ConfigForm: React.FC<ConfigFormProps> = ({ config, form: externalForm, initialValues, onFinish, onFinishFailed, onValuesChange, formProps = {} }) => {
  const [form] = Form.useForm(externalForm);
  const { items, layout = 'horizontal', labelCol, wrapperCol, columns = 1 } = config;
  const computedInitialValues = useMemo(() => {
    const configInitialValues = items.reduce((acc, item) => { if (item.initialValue !== undefined) acc[item.name] = item.initialValue; return acc; }, {} as any);
    return { ...configInitialValues, ...initialValues };
  }, [items, initialValues]);

  const renderItems = useMemo(() => {
    return items.filter((item) => !item.hidden).map((item) => {
    const { name, label, required, rules = [], dependencies, tooltip, extra, colSpan, ...restProps } = item;
      const finalRules: any[] = [...rules];
      if (required && !rules.some((rule) => 'required' in rule)) finalRules.unshift(createRules.required(`请输入${label}`));
      const formItemProps: FormItemProps = { name, label, rules: finalRules, dependencies, tooltip, extra, ...restProps };
      return (
        <div key={name} style={{ width: colSpan ? `${(colSpan / columns) * 100}%` : `${100 / columns}%`, display: 'inline-block', paddingRight: columns > 1 ? 16 : 0, verticalAlign: 'top' }}>
          <Form.Item {...formItemProps}>{renderFormItem(item, form)}</Form.Item>
        </div>
      );
    });
  }, [items, columns, form]);

  return (
    <Form form={form} layout={layout} labelCol={labelCol} wrapperCol={wrapperCol} initialValues={computedInitialValues} onFinish={onFinish} onFinishFailed={onFinishFailed} onValuesChange={onValuesChange} {...formProps}>
      {renderItems}
    </Form>
  );
};

export const FormConfigBuilder = {
  userForm: (): FormItemConfig[] => [
    { name: 'username', label: '用户名', type: 'input', required: true, rules: [createRules.length(3, 20)] },
    { name: 'password', label: '密码', type: 'password', required: true, rules: [createRules.password('medium')] },
    { name: 'email', label: '邮箱', type: 'input', required: true, rules: [createRules.email()] },
    { name: 'phone', label: '手机号', type: 'input', rules: [createRules.phone()] },
    { name: 'status', label: '状态', type: 'select', initialValue: 1, props: { options: [{ label: '启用', value: 1 }, { label: '禁用', value: 0 }] } },
  ],
  loginForm: (): FormItemConfig[] => [
    { name: 'username', label: '用户名', type: 'input', required: true },
    { name: 'password', label: '密码', type: 'password', required: true },
    { name: 'remember', label: '', type: 'checkbox', props: { label: '记住密码' } },
  ],
  searchForm: (fields: string[]): FormItemConfig[] => fields.map((field) => ({ name: field, label: field, type: 'input' })),
};

export default ConfigForm;
