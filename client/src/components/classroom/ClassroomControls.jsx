import React from 'react';
import { Button, Popover, Space } from 'antd';
import { 
  VideoCameraOutlined, 
  AudioOutlined, 
  DesktopOutlined,
  SettingOutlined,
  UserAddOutlined,
  FileAddOutlined,
  SaveOutlined
} from '@ant-design/icons';
import './ClassroomControls.less';

const ClassroomControls = ({
  isTeacher,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onInviteStudents,
  onUploadFile,
  onSaveWhiteboard,
  onSettings
}) => {
  return (
    <div className="classroom-controls">
      <Space>
        <Button
          icon={<VideoCameraOutlined />}
          onClick={onToggleVideo}
          shape="circle"
          size="large"
        />
        
        <Button
          icon={<AudioOutlined />}
          onClick={onToggleAudio}
          shape="circle"
          size="large"
        />
        
        <Button
          icon={<DesktopOutlined />}
          onClick={onToggleScreenShare}
          shape="circle"
          size="large"
        />
        
        {isTeacher && (
          <>
            <Popover content="Invite Students" placement="bottom">
              <Button
                icon={<UserAddOutlined />}
                onClick={onInviteStudents}
                shape="circle"
                size="large"
              />
            </Popover>
            
            <Popover content="Upload File" placement="bottom">
              <Button
                icon={<FileAddOutlined />}
                onClick={onUploadFile}
                shape="circle"
                size="large"
              />
            </Popover>
            
            <Popover content="Save Whiteboard" placement="bottom">
              <Button
                icon={<SaveOutlined />}
                onClick={onSaveWhiteboard}
                shape="circle"
                size="large"
              />
            </Popover>
          </>
        )}
        
        <Popover content="Settings" placement="bottom">
          <Button
            icon={<SettingOutlined />}
            onClick={onSettings}
            shape="circle"
            size="large"
          />
        </Popover>
      </Space>
    </div>
  );
};

export default ClassroomControls; 