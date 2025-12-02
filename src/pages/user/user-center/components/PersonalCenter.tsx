// userService dynamic import inside effect
import {
  Avatar,
  Card,
  Col,
  Divider,
  message,
  Row,
  Space,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from '@umijs/max';

const { Title, Paragraph, Text } = Typography;

const PersonalCenter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch({ type: 'user/getMyUserInfo', callback: (res: any) => {
      setLoading(false);
      if (res?.code === 200) setUser(res.data);
      else message.error('获取用户信息失败');
    }});
  }, [dispatch]);

  const getAvatar = () => {
    if (user?.avatar) {
      const res = '/public' + user.avatar;
      return res;
    }
    return '';
  };

  return (
    <Card loading={loading}>
      <Row gutter={16} justify="start" align="middle">
        <Col style={{ textAlign: 'center' }}>
          <Avatar size={120} src={getAvatar()} />
          <Title level={2}>{user?.username}</Title>
          <Paragraph>{user?.nickname}</Paragraph>
          <Divider />
          <div style={{ textAlign: 'left' }}>
            <Paragraph>
              <Text strong>UUID: </Text>
              {user?.uuid}
            </Paragraph>
            <Paragraph>
              <Text strong>邮箱: </Text>
              {user?.email}
            </Paragraph>
            <Paragraph>
              <Text strong>电话: </Text>
              {user?.phone}
            </Paragraph>
            <Paragraph>
              <Text strong>签名: </Text>
              {user?.signed}
            </Paragraph>
            <Paragraph>
              <Text strong>性别: </Text>
              {user?.sex}
            </Paragraph>
            <Paragraph>
              <Text strong>状态: </Text>
              {user?.status === 1 ? '启用' : '禁用'}
            </Paragraph>
          </div>
        </Col>
      </Row>
      <Divider />
      <div style={{ textAlign: 'left' }}>
        <Title level={4}>标签</Title>
        <Space wrap>
          <Tag color="blue">很有想法的</Tag>
          <Tag color="green">专注设计</Tag>
          <Tag color="orange">辣~</Tag>
          <Tag color="red">大长腿</Tag>
          <Tag color="purple">川妹子</Tag>
          <Tag color="cyan">海纳百川</Tag>
        </Space>
      </div>
      <Divider />
      <div style={{ textAlign: 'left' }}>
        <Title level={4}>团队</Title>
        <Space size="large">
          <Tag icon={<Avatar src="path_to_icon1.png" />} color="default">
            科学搬砖组
          </Tag>
          <Tag icon={<Avatar src="path_to_icon2.png" />} color="default">
            全组都是黑马
          </Tag>
          <Tag icon={<Avatar src="path_to_icon3.png" />} color="default">
            中二少女团
          </Tag>
          <Tag icon={<Avatar src="path_to_icon4.png" />} color="default">
            程序员日常
          </Tag>
          <Tag icon={<Avatar src="path_to_icon5.png" />} color="default">
            高逼格设计天团
          </Tag>
          <Tag icon={<Avatar src="path_to_icon6.png" />} color="default">
            骗你来学计算机
          </Tag>
        </Space>
      </div>
    </Card>
  );
};

export default PersonalCenter;
