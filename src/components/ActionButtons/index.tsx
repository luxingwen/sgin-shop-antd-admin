/**
 * 操作按钮组
 */

import React from 'react';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ButtonProps } from 'antd';

export interface ActionButton {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  confirm?: {
    title: string;
    okText?: string;
    cancelText?: string;
  };
  tooltip?: string;
  show?: boolean;
  disabled?: boolean;
  type?: ButtonProps['type'];
}

interface ActionButtonsProps {
  buttons?: ActionButton[];
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  deleteConfirmTitle?: string;
  size?: ButtonProps['size'];
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  buttons,
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = false,
  deleteConfirmTitle = '确定删除吗？',
  size = 'small',
}) => {
  const defaultButtons: ActionButton[] = [];

  if (showView && onView) {
    defaultButtons.push({
      key: 'view',
      icon: <EyeOutlined />,
      onClick: onView,
      tooltip: '查看',
    });
  }

  if (showEdit && onEdit) {
    defaultButtons.push({
      key: 'edit',
      icon: <EditOutlined />,
      onClick: onEdit,
      tooltip: '编辑',
    });
  }

  if (showDelete && onDelete) {
    defaultButtons.push({
      key: 'delete',
      icon: <DeleteOutlined />,
      onClick: onDelete,
      danger: true,
      confirm: {
        title: deleteConfirmTitle,
        okText: '确定',
        cancelText: '取消',
      },
      tooltip: '删除',
    });
  }

  const allButtons = [...defaultButtons, ...(buttons || [])];

  const renderButton = (btn: ActionButton) => {
    if (btn.show === false) return null;

    const buttonElement = (
      <Button
        key={btn.key}
        type={btn.type}
        size={size}
        icon={btn.icon}
        danger={btn.danger}
        disabled={btn.disabled}
        onClick={btn.onClick}
      >
        {btn.label}
      </Button>
    );

    if (btn.confirm) {
      return (
        <Popconfirm
          key={btn.key}
          title={btn.confirm.title}
          onConfirm={btn.onClick}
          okText={btn.confirm.okText || '确定'}
          cancelText={btn.confirm.cancelText || '取消'}
        >
          {btn.tooltip ? (
            <Tooltip title={btn.tooltip}>{buttonElement}</Tooltip>
          ) : (
            buttonElement
          )}
        </Popconfirm>
      );
    }

    if (btn.tooltip) {
      return (
        <Tooltip key={btn.key} title={btn.tooltip}>
          {buttonElement}
        </Tooltip>
      );
    }

    return buttonElement;
  };

  return <Space size="small">{allButtons.map(renderButton)}</Space>;
};

export default ActionButtons;
