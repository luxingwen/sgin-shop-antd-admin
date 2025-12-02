import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
// @ts-ignore: import less during migration
const styles = require('./index.less') as any;

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <h1>欢迎 {trim(name)}</h1>
      </div>
    </PageContainer>
  );
};

export default HomePage;
