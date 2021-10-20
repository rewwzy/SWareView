import React from 'react'
import './style.scss';
export interface IBatchFileCellUploadProps {
    onClick?: (Id: any) => void; 
    data?: any;
}

const BatchFileCellUpload: React.FC<IBatchFileCellUploadProps> = (props) => {
    const handleUploadClick = () => {
        if(props.onClick) props.onClick({ fileId: props.data.data.FileId, Id: props.data.data.Id});
        console.log('batch file : ', props);
    }
    
    return (
        <i className="fas fa-upload file-upload-icon" onClick={handleUploadClick}></i>
    )
}

export default BatchFileCellUpload
