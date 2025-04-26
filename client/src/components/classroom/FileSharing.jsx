import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal, Upload, List, Button, message } from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { classroomService } from '../../services/classroomService';
import './FileSharing.less';

const { Dragger } = Upload;

const FileSharing = forwardRef(({ classroomId, isTeacher }, ref) => {
  const [visible, setVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true)
  }));

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await classroomService.getFiles(classroomId);
      setFiles(response.files);
    } catch (error) {
      message.error('Failed to fetch files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classroomId', classroomId);
      
      const response = await classroomService.uploadFile(formData);
      setFiles(prev => [...prev, response.file]);
      onSuccess(response, file);
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      onError(error);
      message.error('Upload failed: ' + error.message);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await classroomService.deleteFile(classroomId, fileId);
      setFiles(files.filter(file => file.id !== fileId));
      message.success('File deleted successfully');
    } catch (error) {
      message.error('Failed to delete file: ' + error.message);
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await classroomService.downloadFile(classroomId, fileId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Download failed: ' + error.message);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchFiles();
    }
  }, [visible]);

  return (
    <Modal
      title="File Sharing"
      open={visible}
      onCancel={() => setVisible(false)}
      width={800}
      footer={null}
    >
      <div className="file-sharing">
        {isTeacher && (
          <Dragger
            customRequest={handleUpload}
            showUploadList={false}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="upload-area"
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports PDF, Word, Excel, PowerPoint, and images
            </p>
          </Dragger>
        )}
        
        <List
          loading={loading}
          dataSource={files}
          renderItem={file => (
            <List.Item
              actions={[
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => downloadFile(file.id, file.name)}
                  type="text"
                />,
                isTeacher && (
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteFile(file.id)}
                    type="text"
                    danger
                  />
                )
              ]}
            >
              <List.Item.Meta
                title={file.name}
                description={`${(file.size / 1024).toFixed(2)} KB - Uploaded by ${file.uploadedBy}`}
              />
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
});

export default FileSharing; 