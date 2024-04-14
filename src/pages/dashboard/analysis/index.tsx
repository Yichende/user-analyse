import { Column, Pie } from '@ant-design/charts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import { Card, Col, Progress, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import numeral from 'numeral';
import { useState } from 'react';
import useStyles from '../style.style';
import { ChartCard, Field } from './Charts';
import Trend from './Trend';

const Dashboard = () => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);
  // 模拟数据
  const totalUsers = 1500;
  const totalData = '1.5 TB';
  const newUsersToday = 80;
  const chartData = [
    { type: '柱状图', count: 45 },
    { type: '折线图', count: 34 },
    { type: '饼图', count: 24 },
    { type: '雷达图', count: 2 },
    { type: '散点图', count: 21 },
    { type: '面积图', count: 56 },
    { type: '条形图', count: 76 },
    { type: '环图', count: 22 },
    { type: '雷达图', count: 4 },
  ];

  const visitData = [];
  const beginDay = new Date().getTime();

  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
      x: dayjs(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY[i],
    });
  }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <ChartCard
            bordered={false}
            title="用户总数"
            action={
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            }
            loading={loading}
            total={() => <div>126560</div>}
            footer={<Field label="日活跃用户数" value={`${numeral(32423).format('0,0')}`} />}
            contentHeight={46}
          >
            <Trend
              flag="up"
              style={{
                marginRight: 16,
              }}
            >
              周同比
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              日同比
              <span className={styles.trendText}>5%</span>
            </Trend>
          </ChartCard>
        </Col>
        <Col span={6}>
          <ChartCard
            loading={loading}
            bordered={false}
            title="数据总量"
            action={
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total="78%"
            footer={
              <div
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                <Trend
                  flag="up"
                  style={{
                    marginRight: 5,
                  }}
                >
                  周比
                  <span className={styles.trendText}>12%</span>
                </Trend>
                <Trend flag="down">
                  日比
                  <span className={styles.trendText}>1%</span>
                </Trend>
              </div>
            }
            contentHeight={46}
          >
            <Progress
              percent={78}
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              status="active"
            />
          </ChartCard>
        </Col>
        <Col span={12}>
          <ChartCard
            bordered={false}
            loading={loading}
            title="访问量"
            action={
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            }
            total={numeral(8846).format('0,0')}
            footer={<Field label="日访问量" value={numeral(1234).format('0,0')} />}
            contentHeight={46}
          >
            <Area
              xField="x"
              yField="y"
              shapeField="smooth"
              height={46}
              axis={false}
              style={{
                fill: 'linear-gradient(-90deg, white 0%, #975FE4 100%)',
                fillOpacity: 0.6,
                width: '100%',
              }}
              padding={-20}
              data={visitData}
            />
          </ChartCard>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{marginTop: 20}}>
        <Col span={12}>
          <Card title="最近用户行为趋势">
            <Pie
              data={[
                { type: '购买', value: 20 },
                { type: '浏览', value: 30 },
                { type: '搜索', value: 25 },
                { type: '互动', value: 15 },
                { type: '评论', value: 10 },
              ]}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{ type: 'inner', offset: '-50%' }}
              height={300}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="数据图表种类及数量">
            <Column data={chartData} xField="type" yField="count" height={300} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
