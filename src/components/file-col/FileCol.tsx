import React from 'react'

function FileCol(props) {
    const { value } = props.data;
    return (
        value ? <button className="file-col-item" onClick={(e) => props.onClick(props.data.data.FileId?.split(','), e)}><i className="fas fa-download"></i></button> : null
    )
}

export default React.memo(FileCol);
