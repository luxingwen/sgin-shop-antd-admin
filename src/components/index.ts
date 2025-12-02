/**
 * 统一导出组件（来自 sgin-shop-antd-admin）
 * 后续会把更多通用组件从 sgin-antd-admin 抽取并合并到这里
 */

export { default as Footer } from './Footer';
export { default as HeaderDropdown } from './HeaderDropdown';
export { default as QuillEditor } from './QuillEditor';
export { default as HaoUpload } from './HaoUpload';
export { default as RightContent } from './RightContent';

// 已导出的本地组件
export { default as PageContainer } from './PageContainer';
export { default as StatusTag } from './StatusTag';
export { default as ActionButtons } from './ActionButtons';
export { default as SearchForm } from './SearchForm';
export { default as ExportButton, useExport } from './ExportButton';
export { default as AdvancedSearch, SimpleSearch } from './AdvancedSearch';
export {
	default as BatchActions,
	BatchEditModal,
	useBatchActions,
	useBatchDelete,
	createBatchActions,
} from './BatchActions';
export { default as ConfigForm, FormConfigBuilder } from './ConfigForm';

// TODO: 进一步抽取 sgin-antd-admin 中的其他通用组件并统一样式与类型定义
