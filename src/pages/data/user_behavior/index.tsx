import { Flex, Tabs } from 'antd';

import React from 'react';

import SearchTable from './components/SearchBehavior';
import VisitedTable from './components/VisitedBehavior';
import PurchaseTable from './components/PurchaseBehavior';
import CommentTable from './components/CommentBehavior';
import InteractTable from './components/InteractBehavior';

const { TabPane } = Tabs;

const UserBehaviorPage: React.FC = () => {
  return (
    <Flex gap="middle" vertical>
      <Tabs defaultActiveKey="1">
        <TabPane tab="浏览行为表" key="1">
          <VisitedTable />
        </TabPane>
        <TabPane tab="搜索行为表" key="2">
          <SearchTable />
        </TabPane>
        <TabPane tab="购买行为表" key="3">
          <PurchaseTable />
        </TabPane>
        <TabPane tab="评论行为表" key="4">
          <CommentTable />
        </TabPane>
        <TabPane tab="互动行为表" key="5">
          <InteractTable />
        </TabPane>
      </Tabs>
    </Flex>
  );
};

export default UserBehaviorPage;
