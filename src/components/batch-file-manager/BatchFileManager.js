import { Button, DataGrid, Popup } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import React, { PureComponent } from "react";
import $ from "jquery";
import "./FileManager.scss";
import { ktApi } from "../../services/http";
import _, { times } from "lodash";
import { fileHelper } from "../../utils/common";
export class BatchFileManager extends PureComponent {
  state = {
    filesSource: [],
    visible: false,
  };

  openPicker = () => {
    $("#select-file").click();
  };
  componentDidMount() {
    const { filesId } = this.props;
    if (filesId && filesId.length) this.getFileSource(filesId);
  }

  onPickerChange = (e) => {
    const { onUploaded } = this.props;
    const { files } = e.target;
    const formData = new FormData();
    [...files].forEach((file) => formData.append("files", file));
    formData.append("folder", "KhaoSatDATN");
    ktApi
      .post("/FileManager/Upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        if (data.success) {
          console.log("file data : ", data);
          this.addFileSource(data.files, true);
          if (typeof onUploaded === "function")
            onUploaded({ files: data.files });
        }
      });
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.filesId && nextProps.filesId.length) {
  //     const { filesId } = nextProps;
  //     if (!_.isEqual(_.sortBy(filesId), _.sortBy(this.props.filesId))) {
  //       this.getFileSource(filesId);
  //     }
  //   }
  // }

  getFileSource = (filesId) => {
    console.log("fileid: ", filesId);
    ktApi
      .get("/FileManager/GetFiles", {
        params: { filesId: filesId.toString() },
      })
      .then(({ data }) => {
        this.addFileSource(data.files);
      });
  };

  addFileSource = (files = [], isNew = false) => {
    const { filesSource } = this.state;
    const { onFileChange } = this.props;
    let listFile = files
      .map((file) => ({ ...file, isNew: isNew }))
      .concat([...filesSource].filter((item) => item.isNew));
    this.setState({
      filesSource: listFile,
    });
    if (typeof onFileChange === "function")
      onFileChange({ files: listFile, key: this.rowKey });
  };

  removeFile = (fileId) => {
    ktApi
      .delete("/FileManager/RemoveFile", {
        params: { fileId },
      })
      .then(({ data }) => {
        const { filesSource } = this.state;
        const newFileSource = filesSource.filter((item) => item.Id !== fileId);
        this.setState({ filesSource: newFileSource });
        const { onFileChange } = this.props;
        if (typeof onFileChange === "function")
          onFileChange({ files: newFileSource, key: this.rowKey });
      });
  };

  downloadFile = (fileUrl) => {
    fileHelper.download(fileUrl);
    alert("Đang trong quá trình phát triển vui lòng quay lại sau");
  };
  open = (file) => {
    this.rowKey = file.key;
    console.log("file log :", file);
    this.setState({ visible: true });
    this.setState({ filesSource: file.files });
  };
  close = () => {
    this.setState({ visible: false });
  };
  render() {
    const { readOnly } = this.props;
    const { filesSource, visible } = this.state;
    return (
      <Popup
        visible={visible}
        width={600}
        height={410}
        title="Quản lý file"
        onHiding={(e) => this.setState({ visible: false })}
        closeOnOutsideClick
      >
        <DataGrid
          showRowLines
          showBorders
          noDataText={"Không có file"}
          height={260}
          dataSource={filesSource}
          keyExpr="Id"
        >
          <Column
            dataField="FileName"
            caption="Tên file"
            cellComponent={(props) => {
              const {
                data: { data },
              } = props;
              return (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{data.FileName}</span>
                  {data.isNew && (
                    <div
                      style={{
                        color: "#27ae60",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      Mới
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Column
            caption="Điều kiển"
            width={160}
            cellComponent={(props) => {
              const {
                data: { data },
              } = props;
              return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    style={{
                      color: "#fff",
                      backgroundColor: "#2980b9",
                      border: "1px solid #fff",
                      borderRadius: 2,
                      margin: "0px 4px",
                      cursor: "pointer",
                      width: 32,
                      height: 22,
                      fontSize: 12,
                    }}
                    onClick={() => this.downloadFile(data.Url)}
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  {!readOnly && (
                    <button
                      style={{
                        color: "#fff",
                        backgroundColor: "#d35400",
                        border: "1px solid #fff",
                        borderRadius: 2,
                        margin: "0px 4px",
                        cursor: "pointer",
                        width: 32,
                        height: 22,
                        fontSize: 12,
                      }}
                      onClick={() => this.removeFile(data.Id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  )}
                </div>
              );
            }}
          />
        </DataGrid>
        <div
          className={"drop-zone"}
          style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
        >
          <Button
            disabled={readOnly}
            icon="upload"
            onClick={this.openPicker}
            className="upload-button"
            text="Chọn file"
          />
        </div>
        <input
          type="file"
          id="select-file"
          multiple={true}
          style={{ display: "none" }}
          onChange={this.onPickerChange}
        />
      </Popup>
    );
  }
}

export default BatchFileManager;
