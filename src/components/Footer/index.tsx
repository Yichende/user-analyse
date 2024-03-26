import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by Ant Desgin"
      links={[
        {
          key: 'User Analyse',
          title: 'User Analyse',
          href: 'https://github.com/Yichende',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Yichende',
          blankTarget: true,
        },
        {
          key: 'Yichend',
          title: 'Yichend',
          href: 'https://github.com/Yichende',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
