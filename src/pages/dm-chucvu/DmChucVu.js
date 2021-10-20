import React, { PureComponent } from "react";
import { ktApi } from "../../services/http";
import qS from "query-string";
import PropTypes from 'prop-types'
import LoadPanel from "devextreme-react/load-panel";
import { Popup, ToolbarItem,Position } from "devextreme-react/popup";
import ControlBar from "../../components/control-bar/ControlBar";
import PopupTitle from "../../components/PopupTitle/PopupTitle";
import { DateBox, Form, TextBox,DropDownBox } from "devextreme-react";
import { GroupItem, Label, SimpleItem } from "devextreme-react/form";
import ValidMessage from "../../components/valid-message/ValidMessage";
import notify from 'devextreme/ui/notify';
import PopupTemplate from "../../components/popup-template/PopupTemplate";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
import moment from "moment";
import { delayTyping } from "../../utils/common";
import DataGrid, {

  Column,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import PageTitle from "../../components/page-title/PageTitle";
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { Button } from 'devextreme-react/button';
import "./style.scss";
const displayModes = [{ text: 'Display Mode \'full\'', value: 'full' }, { text: 'Display Mode \'compact\'', value: 'compact' }];
const allowedPageSizes = [5, 10, 'all'];

export class DmChucVu extends PureComponent {

constructor(props) {
  super(props);
  this.state = {
    gridData: [],
    visiblePopup: false,
    visibleDelete: false,
    visibleLoading: false,
    selectedRowData: null,
    formDataPopup: {},
    currentMode: null,
  };
}
  getgridDataSource = () => {
    ktApi.get("/DanhMucChucVu/GetAll").then(({ data }) => {
      this.setState({
        gridData: data,
        visibleLoading: false,
      });
    });
  };

  componentDidMount() {
    this.getgridDataSource();
  }

  onOpenPopup = () => {
    this.setState({
      visiblePopup: true,
    });
  };

  onHidingPopup = () => {
    this.setState({
      visiblePopup: false,
    });
  };
  onClickControlBar = ({ mode }) => {
    if (mode === "CREATE") {
      this.setState({
        currentMode: mode,
        visiblePopup: true,
       
      });
      return;
    }
    if (mode === "EDIT") {
      if (this.state.selectedRowData != null) {
        this.setState({
          currentMode: mode,
          visiblePopup: true,
          formDataPopup: this.state.selectedRowData,
        });
        return;
      } else {
        NotificationManager.warning(
          "Vui lòng chọn bản ghi trước khi sửa",
          "Cảnh báo !",
          1000
        );
        return;
      }
    }
    if (mode === "DELETE") {
      if (this.state.selectedRowData != null) {
        this.setState({
          visibleDelete: true,
        });
        return;
      } else {
        NotificationManager.warning(
          "Vui lòng chọn bản ghi trước khi xoá",
          "Cảnh báo !",
          1000
        );
        return;
      }
    }
    
  };
  onClickClosePopup = () => {
    this.setState({
      visiblePopup: false,
    });
  };

  onFocusedRowChanged = (e) => {
    this.setState({
      selectedRowData: e.row.data,
    });
  };

  onDeletePopup = () => {
   
    ktApi
      .delete(
        "/DanhMucChucVU/Delete?" +
          qS.stringify({ key: this.state.selectedRowData.Id})
      )
      .then(({ data }) => {
        NotificationManager[data.success ? "success" : "error"](
          data.message,
          "Thông báo",
          1000
        );
        this.setState({
          visibleDelete: false,
        });
        this.getgridDataSource();
      });
  };
  render() {
    return (
      
      <div>
              
                {/* <div className="loading-wrapper">
          <LoadPanel visible={this.state.visibleLoading} />
        </div> */}
        <div className="control-button-wrapper">
          <ControlBar phanHe="DanhMucChucVu" onClick={this.onClickControlBar} />
        </div>
           <PageTitle title="Danh sách chức vụ" />
   <div className="data-grid-wrapper">
     <DataGrid
        dataSource={this.state.gridData}
        keyExpr="Id"
        showBorders
        showRowLines
        showColumnLines
        wordWrapEnabled
        focusedRowEnabled
        height={window.innerHeight - 200}
        onFocusedRowChanged={this.onFocusedRowChanged}
      >
         <SearchPanel visible placeholder="Tìm kiếm..." />
          <Column dataField="MaChucVu" caption="Mã chức vụ" width="20%" alignment="center"/>
          <Column dataField="TenChucVu" caption="Tên chức vụ" width="50%" />
          <Column dataField="GhiChu" caption="Ghi chú" width="30%" />
         

          <Paging defaultPageSize={50} />
        <Pager
              showPageSizeSelector
              allowedPageSizes={[50, 100, 200]}
              visible
              showInfo
            />
      </DataGrid>
     </div>
      <div className="popup-wrapper">
          {this.state.visiblePopup && (
            <PopupDmChucVu
              mode={this.state.currentMode}
              visible={this.state.visiblePopup}
              onHiding={this.onHidingPopup}
              onClickClosePopup={this.onClickClosePopup}
              getgridDataSource={this.getgridDataSource}
              formDataPopup={this.state.formDataPopup}
              parent={this}
            />
          )}
          <PopupTemplate
            visible={this.state.visibleDelete}
            onOk={this.onDeletePopup}
            onCancel={(_) => this.setState({ visibleDelete: false })}
          />
        </div>
    </div>
    
    )
  }
}

export default DmChucVu;

class PopupDmChucVu extends PureComponent {
 
  closeButtonOptions = null;
  saveButtonOptions = null;
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formDataPopup,
      validateMaChucVu: {
        isValid: true,
        message: "",
      },
      validateTenChucVu: {
        isValid: true,
        message: "",
      },
     
      focus: "MaChucVu",
    };
 


  }
  checkValidate = (e) => {
    var countError = 0;
    if (!e.MaChucVu) {
      this.setState({
        validateMaChucVu: {
          isValid: false,
          message: "Mã chức vụ là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "MaChucVu") {
        
      }
    } 
        if (this.state.focus === "MaChucVu") {
          this.refs.MaChucVuRef?.instance?.focus();
        }
       else {
        this.setState({ focus: "TenChucVu" });
      
    }
    if (!e.TenChucVu?.trim()) {
      this.setState({
        validateTenChucVu: {
          isValid: false,
          message: "Tên chức vụ là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "TenChucVu") {
        this.refs.tenChucVuRef.instance.focus();
      }
     
    }
  
    return !countError;
  };
  onKeyUpMaChucVu = (e) => {
    if (!this.state.validateMaChucVu.isValid)
      this.resetValidate("validateMaChucVu");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, MaChucVu: e.event.target.value },
      });
    }, this);
  };
  onKeyUpTenChucVu = (e) => {
    if (!this.state.validateTenChucVu.isValid)
      this.resetValidate("validateTenChucVu");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, TenChucVu: e.event.target.value },
      });
    }, this);
  };
   onKeyUpGhiChu = (e) => {
 
   
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, GhiChu: e.event.target.value },
      });
    }, this);
  };
 
  
  resetValidate = (name) => {
    this.setState({
      [name]: {
        isValid: true,
        message: "",
      },
    });
  };
  onClickSaveDanhMucChucVu = (e) => {
  
    e.component.option("disabled", true);
    const formDataSave = {
      MaChucVu: $("#MaChucVu").find('input[type="text"]').val(),
      TenChucVu: $("#TenChucVu").find('input[type="text"]').val().trim(),
      GhiChu: $("#GhiChu").find('input[type="text"]').val().trim(),
     
    };
    const oldFormData = this.state.formData;
    const newFormData = { ...oldFormData, ...formDataSave };
    if (!this.checkValidate(newFormData)) {
      e.component.option("disabled", false);
      return;
    }
    ktApi[this.props.mode === "CREATE" ? "post" : "put"](
      "/DanhMucChucVu/" +
        (this.props.mode === "CREATE" ? "Insert" : "Update") +
        "?" +
        qS.stringify({ values: JSON.stringify(newFormData) , key: oldFormData.Id})
    ).then(({ data }) => {
      if (data.success) {
        NotificationManager.success(data.message, "Thông báo", 1000);
        this.props.onClickClosePopup();
        this.props.getgridDataSource();
        this.props.parent.setState({ selectedRowData: newFormData });
        this.setState({
          formData: newFormData,
        });
      } else {
        if (data.duplicate) {
          this.setState({
            validateMaChucVu: {
              isValid: false,
              message: "Mã chức vụ đã tồn tại",
            },
          });
          this.refs.soQDHoatDongRef?.instance?.focus();
          e.component.option("disabled", false);
        } else {
          NotificationManager.error(data.message, "Thông báo", 1000);
        }
      }
    });
  };
  render() {
    const { visible, onHiding } = this.props;
    const { formData } = this.state;
 
    return (
      <div id="container">

        <Popup
           visible={visible}
           titleComponent={(props) => {
            return <PopupTitle title="Danh mục chức vụ" hidePopup={onHiding } />;
          }}
        >
          <Position
            at="center"
            my="center"
            of={this.state.positionOf}
          />
         
        
           <Form>
          <GroupItem colCount={2}>
            <SimpleItem isRequired={true}>
              <Label text="Mã chức vụ" />
              <TextBox
                ref={"MaChucVuRef"}
                value={formData.MaChucVu}
                id="MaChucVu"
                onKeyUp={this.onKeyUpMaChucVu}
              
              ></TextBox>
              <ValidMessage message={this.state.validateMaChucVu?.message} />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="Tên chức vụ" />
              <TextBox
                ref={"TenChucVuRef"}
                value={formData.TenChucVu}
                id="TenChucVu"
                onKeyUp={this.onKeyUpTenChucVu}
                maxLength={250}
              ></TextBox>
              <ValidMessage message={this.state.validateTenChucVu?.message} />
            </SimpleItem>
          </GroupItem>
          <GroupItem colCount={2}>
            
            <SimpleItem>
              <Label text="Ghi chú" />
              <TextBox
                ref={"GhiChuRef"}
                value={formData.GhiChu}
                id="GhiChu"
                onKeyUp={this.onKeyUpGhiChu}
              />
            </SimpleItem>
          
          </GroupItem>
         
        </Form>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ text: "Lưu", onClick: this.onClickSaveDanhMucChucVu }}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          style={{ background: "#3b7b9e", color: "#eee" }}
          options={{ text: "Huỷ", onClick: this.props.onClickClosePopup }}
        />
        </Popup>
     
     
      </div>
    );
  }
}








