import React from 'react';
import { List, Button, Avatar, Badge, Tooltip } from 'antd';
import { UserOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './HandRaisePanel.less';

const HandRaisePanel = ({ raisedHands, onAcknowledge, onDismiss }) => {
  return (
    <div className="hand-raise-panel">
      <div className="panel-header">
        <h3>
          <Badge count={raisedHands.length} offset={[10, 0]}>
            Raised Hands
          </Badge>
        </h3>
      </div>
      <List
        dataSource={raisedHands}
        renderItem={({ userId, name, timestamp }) => (
          <List.Item
            actions={[
              <Tooltip title="Acknowledge">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => onAcknowledge(userId)}
                />
              </Tooltip>,
              <Tooltip title="Dismiss">
                <Button
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => onDismiss(userId)}
                />
              </Tooltip>
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={name}
              description={`Raised at ${new Date(timestamp).toLocaleTimeString()}`}
            />
          </List.Item>
        )}
        locale={{ emptyText: 'No raised hands' }}
      />
    </div>
  );
};

export default HandRaisePanel; 