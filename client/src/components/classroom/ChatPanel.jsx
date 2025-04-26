import React, { useState, useRef, useEffect } from 'react';
import { Input, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import './ChatPanel.less';

const { Text } = Typography;

const ChatPanel = ({ messages, onSend }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSend(newMessage);
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={message => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={message.sender}
                description={
                  <div className="message-content">
                    <Text>{message.content}</Text>
                    <Text type="secondary" className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <Input.TextArea
          ref={inputRef}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
        />
        <SendOutlined
          className="send-button"
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatPanel; 