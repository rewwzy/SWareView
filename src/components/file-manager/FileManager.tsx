import { Button, DataGrid, Popup } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { PureComponent } from "react";
import $ from "jquery";
import "./FileManager.scss";
import { ktApi } from "../../services/http";
import { fileHelper } from "../../utils/common";
import _ from "lodash";
interface IFileManagerProps {
  filesId?: any;
  onUploaded?: (a: any) => any;
  onFileChange?: (a: any) => any;
  visible?: boolean;
  onHide?: () => any;
  readOnly?: boolean;
  mode?: any;
}

interface IFileManagerState {
  filesSource: any[];
}
export class FileManager extends PureComponent<
  IFileManagerProps,
  IFileManagerState
> {
  state = {
    filesSource: [],
  };

  openPicker = () => {
    $("#select-file").click();
  };
  componentWillReceiveProps(nextProps) {
    const { props } = this;
    if (!_.isEqual(props.filesId, nextProps.filesId)) {
      if (nextProps.filesId && nextProps.filesId?.length) {
        let inputFile = this.state.filesSource
          .map((file) => file.Id)
          .toString();
        let outputFile = nextProps.filesId;
        // if(!_.isEqual(inputFile, outputFile)) this.getFileSource(nextProps.filesId);
      }
    }
  }
  componentDidMount() {
    if (this.props.filesId) this.getFileSource(this.props.filesId);
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
          this.addFileSource(data.files, true);
          if (typeof onUploaded === "function")
            onUploaded({ files: data.files });
        }
      });
  };

  getFileSource = (filesId) => {
    ktApi
      .get("/FileManager/GetFiles", {
        params: { filesId: filesId.toString() },
      })
      .then(({ data }) => {
        this.addFileSource(data.files);
        console.log("file source data : ", data.files);
      });
  };

  addFileSource = (files = [], isNew = false) => {
    const { filesSource } = this.state;
    const { onFileChange } = this.props;
    let listFile = files
      .map((file) => ({ ...file, isNew: isNew }))
      .concat(filesSource);
    this.setState({ filesSource: listFile });
    if (typeof onFileChange === "function") onFileChange({ files: listFile });
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
          onFileChange({ files: newFileSource });
      });
  };

  downloadFile = (fileUrl) => {
    fileHelper.download(fileUrl);
    console.log("fileUrl : ", fileUrl);
    window.open(`http://localhost:5001/download/${fileUrl}`);
  };

  render() {
    const { visible, onHide, readOnly } = this.props;
    const { filesSource } = this.state;
    return (
      <Popup
        visible={visible}
        width={600}
        height={410}
        title="Quản lý file"
        onHiding={onHide}
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

export default FileManager;
