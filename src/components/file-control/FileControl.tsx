import { Button, TextBox } from 'devextreme-react'
import { memo } from 'react';
import { useState } from 'react';
import FileManager from '../file-manager/FileManager';
import './style.scss';

function FileControl({ buttonOption, filesId, onFileChange, ...rest }: { buttonOption: any, filesId?: string, value?: string, onFileChange?: (e: any) => any }) {
    const [isOpen, setIsOpen] = useState(false);
    const _filesId = typeof filesId === 'string' ? filesId.split(',') : filesId
    const handleFileButtonClick = (e) => {
        setIsOpen(true);
        typeof buttonOption?.onClick === 'function' && buttonOption.onClick(e)
    }
    const handleFileChange = (e) => {
        if (typeof onFileChange === 'function') {
            onFileChange({ value: e.files.map(file => file?.Id)?.join(',') })
        }
    }
    return (
        <div className="download-control">
            <TextBox {...rest} style={{ flex: 1, marginRight: 4 }} readOnly={true} />
            <Button {...buttonOption} text="Xem, tải lên file" onClick={handleFileButtonClick} />
            <FileManager visible={isOpen} onHide={() => setIsOpen(false)} filesId={_filesId} onFileChange={handleFileChange} />
        </div>
    )
}


export default memo(FileControl);