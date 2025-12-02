/**
 * 页面容器组件
 */

import React from 'react';
import { PageContainer as ProPageContainer } from '@ant-design/pro-components';
import type { PageContainerProps as ProPageContainerProps } from '@ant-design/pro-components';

interface PageContainerProps extends ProPageContainerProps {
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, ...rest }) => {
  return <ProPageContainer ghost {...rest}>{children}</ProPageContainer>;
};

export default PageContainer;
