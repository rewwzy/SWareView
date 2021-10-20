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
  Editing,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import "./style.scss";
import PageTitle from "../../components/page-title/PageTitle";
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { Button } from 'devextreme-react/button';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { thisExpression } from "@babel/types";
const displayModes = [{ text: 'Display Mode \'full\'', value: 'full' }, { text: 'Display Mode \'compact\'', value: 'compact' }];
const allowedPageSizes = [5, 10, 'all'];



export class QuanLyThuaPhatLai extends PureComponent {

constructor(props) {
  super(props);
  this.state = {
    gridData: [],
    IdMaster:null,
    visiblePopup: false,
    visibleDelete: false,
    visibleLoading: false,
    selectedRowData: null,
    formDataPopup: {},
    formDataPopupD:{},
    currentMode: null,
  };
}
  getgridDataSource = () => {
    ktApi.get("/QuanLyThuaPhatLaiMaster/GetAll").then(({ data }) => {
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
        "/QuanLyThuaPhatLaiMaster/Delete?" +
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
          <ControlBar phanHe="QuanLyThuaPhatLai" onClick={this.onClickControlBar} />
        </div>
           <PageTitle title="Quản lý thừa phát lại" />
   <div className="data-grid-wrapper">
     <DataGrid
        dataSource={this.state.gridData}
        keyExpr="Id"
        showBorders
        showRowLines
        showColumnLines
        editing
        wordWrapEnabled
        focusedRowEnabled
        height={window.innerHeight - 200}
        onFocusedRowChanged={this.onFocusedRowChanged}
      >
         <SearchPanel visible placeholder="Tìm kiếm..." />
          <Column dataField="ThuaPhatLai" caption="Tên thừa phát lại" width="20%" alignment="center"/>
          <Column dataField="VanPhongCongTac" caption="Văn phòng công tác" width="25%" />
          <Column dataField="DiaChi" caption="Chức vụ" width="15%" />
          <Column dataField="SoQDBoNHiem" caption="Số QĐBN" width="20%" />
          <Column dataField="NgayBoNhiem" caption="Ngày bổ nhiệm" width="20%" />
         

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
            <PopupThuaPhatLaiMaster
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

export default QuanLyThuaPhatLai;

class PopupThuaPhatLaiMaster extends PureComponent {
  closeButtonOptions = null;
  saveButtonOptions = null;
  
  constructor(props) {
    super(props);
  
   
    this.state = {

      formData: props.formDataPopup,
      formDataD: props.formDataPopupD,
      validateSoQDBoNhiem: {
        isValid: true,
        message: "",
      },
      validateNgayBoNhiem: {
        isValid: true,
        message: "",
      },
      validateThuaPhatLai: {
        isValid: true,
        message: "",
      },
    
      validateChucVu: {
        isValid: true,
        message: "",
      },
   
      focus: "SoQDBoNhiem",
    };
 


  }
  checkValidate = (e) => {
    var countError = 0;
    if (!e.SoQDBoNhiem?.trim()) {
      this.setState({
        validateSoQDBoNhiem: {
          isValid: false,
          message: "Số QĐ bổ nhiệm là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "SoQDBoNhiem") {
        this.refs.SoQDBoNhiemRef.instance.focus();
      }
      else {
        this.setState({ focus: "NgayBoNhiem" });
      }
    }
    if ( e.NgayBoNhiem === "") {
      this.setState({
        validateNgayBoNhiem: {
          isValid: false,
          message: "Ngày bổ nhiệm là trường bắt buộc",
        },
      });
      countError++;
    }
   
    if (!e.ThuaPhatLai?.trim()) {
      this.setState({
        validateThuaPhatLai: {
          isValid: false,
          message: "Tên thừa phát lại là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "ThuaPhatLai") {
        this.refs.ThuaPhatLaiRef.instance.focus();
      }
      else {
        this.setState({ focus: "ChucVu" });
      }
    }
   
    if (!e.ChucVu?.trim()) {
      this.setState({
        validateChucVu: {
          isValid: false,
          message: "Chức vụ là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "ChucVu") {
        this.refs.ChucVuRef.instance.focus();
      }
    
    }
   
    return !countError;
  };
  onOptionChangedNgayBoNhiem = (e) => {
    if (typeof e.value == "string") {
      if (!this.state.validateNgayBoNhiem.isValid)
        this.resetValidate("validateNgayBoNhiem");
    
      if (e.value.length === 10) {
        this.setState({
         NgayBoNhiemValue: moment(e.value, [
            "DD/MM/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          formData: {
            ...this.state.formData,
            NgayBoNhiem: moment(e.value, ["DD/MM/YYYY", "YYYY-MM-DD"]).format(
              "YYYY-MM-DD"
            ),
          },
        });
      } else {
        this.setState({
          NgayBoNhiemValue: null,
          formData: { ...this.state.formData, NgayBoNhiem: null },
        });
      }
    }
  };

  
  onOptionChangedNgaySinh = (e) => {
    if (typeof e.value == "string") {
     
    
      if (e.value.length === 10) {
        this.setState({
         NgaySinhValue: moment(e.value, [
            "DD/MM/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          formData: {
            ...this.state.formData,
            NgaySinh: moment(e.value, ["DD/MM/YYYY", "YYYY-MM-DD"]).format(
              "YYYY-MM-DD"
            ),
          },
        });
      } else {
        this.setState({
          NgaySinhValue: null,
          formData: { ...this.state.formData, NgaySinh: null },
        });
      }
    }
  };
  onKeyUpSoQDBoNhiem = (e) => {
    if (!this.state.validateSoQDBoNhiem.isValid)
      this.resetValidate("validateSoQDBoNhiem");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, SoQDBoNhiem: e.event.target.value },
      });
    }, this);
  };
  onKeyUpThuaPhatLai = (e) => {
    if (!this.state.validateThuaPhatLai.isValid)
      this.resetValidate("validateThuaPhatLai");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, ThuaPhatLai: e.event.target.value },
      });
    }, this);
  };
  onKeyUpChucVu = (e) => {
    if (!this.state.validateChucVu.isValid)
      this.resetValidate("validateChucVu");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, ChucVu: e.event.target.value },
      });
    }, this);
  };
  onKeyUpSoDienThoai = (e) => {
    
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, SoDienThoai: e.event.target.value },
      });
    }, this);
  };
  onKeyUpEmail = (e) => {
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, Email: e.event.target.value },
      });
    }, this);
  };
  

  onKeyUpDiaChi = (e) => {
  
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, DiaChi: e.event.target.value },
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
  getgridDataSource = () => {
    ktApi.get("/QuanLyThuaPhatLaiDetail/GetAll").then(({ data }) => {
      this.setState({
        gridData: data,
        visibleLoading: false,
      });
    });
  };
  componentDidMount() {
    this.getgridDataSource();
 
  }
  onClickSaveQuanLyMaster = (e) => {
  
    e.component.option("disabled", true);
    const formDataSave = {
      SoQDBoNhiem: $("#SoQDBoNhiem").find('input[type="text"]').val(),
      ThuaPhatLai: $("#ThuaPhatLai").find('input[type="text"]').val().trim(),
      DiaChi: $("#DiaChi").find('input[type="text"]').val().trim(),
      ChucVu: $("#ChucVu").find('input[type="text"]').val().trim(),
      NgayBoNhiem: $("#NgayBoNhiem").find('input[type="hidden"]').val(),
      NgaySinh: $("#NgaySinh").find('input[type="hidden"]').val(),
      SoDienThoai: $("#SoDienThoai").find('input[type="text"]').val(),
      Email: $("#Email").find('input[type="text"]').val(),
     
    };
    const oldFormData = this.state.formData;
    const newFormData = { ...oldFormData, ...formDataSave };
    if (!this.checkValidate(newFormData)) {
      e.component.option("disabled", false);
      return;
    }
    ktApi[this.props.mode === "CREATE" ? "post" : "put"](
      "/QuanLyThuaPhatLaiMaster/" +
        (this.props.mode === "CREATE" ? "Insert" : "Update") +
        "?" +
        qS.stringify({ values: JSON.stringify(newFormData) , key: oldFormData.Id})
    ).then(({ data }) => {
      if (data.success) {
        NotificationManager.success(data.message, "Thông báo", 1000);
        this.props.getgridDataSource();
        this.props.parent.setState({ selectedRowData: newFormData });
        this.setState({
     
          formData: newFormData,
    
        });
       
        console.log(this.state.formData.Id);
      } else {
        if (data.duplicate) {
          this.setState({
            validateSoQDBoNhiem: {
              isValid: false,
              message: "Số QĐ bổ nhiệm đã tồn tại",
            },
          });
          this.refs.SoQDBoNhiemRef?.instance?.focus();
          e.component.option("disabled", false);
        } else {
          NotificationManager.error(data.message, "Thông báo", 1000);
        }
      }
    });
    
  };
 
  getIdMaster = () => {
    try{
  
    ktApi.get("/QuanLyThuaPhatLaiMaster/GetBySoQDBoNhiem?id="+this.state.formData.SoQDBoNhiem)
    .then(({ data }) => {
      this.setState({
        formData: data,
        visibleLoading: false,
      });
    })
  } catch (error) {
    NotificationManager.warning(
      "Không tìm thấy thừa phát lại",
      "Cảnh báo !",1000);
  }
  }
  
  onClickSaveQuanLyDetail = (e) => {
  var FormDataDetail;
  try {
  this.getIdMaster();
 for( var i=0 ; i< this.DataGridDetail.instance.getDataSource()._items.length;i++){
   FormDataDetail={
  SoThe: this.DataGridDetail.instance.getDataSource()._items[i].SoThe,
  NgayCapThe: this.DataGridDetail.instance.getDataSource()._items[i].NgayCapThe,
  VanPhongCongTac: this.DataGridDetail.instance.getDataSource()._items[i].VanPhongCongTac,
  SuDung: this.DataGridDetail.instance.getDataSource()._items[i].SuDung,
   }
    ktApi.post(
  "/QuanLyThuaPhatLaiDetail/" + "Insert" + "?" +
    qS.stringify({ values: JSON.stringify(FormDataDetail) , keys: this.state.formData.Id})
);
NotificationManager.success("Thông báo", "Thêm thành công");
this.props.onClickClosePopup();
}
} catch (e) {
  NotificationManager.error( "Thông báo", "Thêm thất bại");
}

}
  render() {
    const { visible, onHiding } = this.props;
    const { formData } = this.state;
 
    return (
      <div id="container">

        <Popup
           visible={visible}
           titleComponent={(props) => {
            return <PopupTitle title="Thêm mới thừa phát lại" hidePopup={onHiding } />;
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
              <Label text="Số QĐ bổ nhiệm" />
              <TextBox
                ref={"SoQDBoNhiemRef"}
                value={formData.SoQDBoNhiem}
                id="SoQDBoNhiem"
                onKeyUp={this.onKeyUpSoQDBoNhiem}
              ></TextBox>
              <ValidMessage message={this.state.validateSoQDBoNhiem?.message} />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="Ngày bổ nhiệm" />
              <DateBox
                id="NgayBoNhiem"
                showClearButton
                useMaskBehavior
                displayFormat="dd/MM/yyyy"
                placeholder="__/__/____"
                onOptionChanged={this.onOptionChangedNgayBoNhiem}
                value={formData.NgayBoNhiem}
              ></DateBox>
              <ValidMessage
                message={this.state.validateNgayBoNhiem?.message}
              />
            </SimpleItem>
          </GroupItem>
          <GroupItem colCount={2}>
          <SimpleItem isRequired={true}>
              <Label text="Tên thừa phát lại" />
              <TextBox
                ref={"ThuaPhatLaiRef"}
                value={formData.ThuaPhatLai}
                id="ThuaPhatLai"
                onKeyUp={this.onKeyUpThuaPhatLai}
                maxLength={250}
              ></TextBox>
              <ValidMessage message={this.state.validateThuaPhatLai?.message} />
            </SimpleItem>
            <SimpleItem >
              <Label text="Ngày sinh" />
              <DateBox
                id="NgaySinh"
                showClearButton
                useMaskBehavior
                displayFormat="dd/MM/yyyy"
                placeholder="__/__/____"
                onOptionChanged={this.onOptionChangedNgaySinh}
                value={formData.NgaySinh}
              ></DateBox>
              <ValidMessage
                message={this.state.validateNgaySinh?.message}
              />
            </SimpleItem>
            
           
          
          </GroupItem>
          <GroupItem colCount={2}>
          <SimpleItem isRequired={true}>
              <Label text="Chức vụ" />
              <TextBox
                ref={"ChucVuRef"}
                value={formData.ChucVu}
                id="ChucVu"
                onKeyUp={this.onKeyUpChucVu}
              ></TextBox>
              <ValidMessage message={this.state.validateChucVu?.message} />
            </SimpleItem>
            <SimpleItem >
              <Label text="Email" />
              <TextBox
                ref={"emailRef"}
                value={formData.Email}
                id="Email"
                onKeyUp={this.onKeyUpEmail}
               
              ></TextBox>
              <ValidMessage message={this.state.validateEmail?.message} />
            </SimpleItem>
            </GroupItem>
            <GroupItem colCount={2}>
            <SimpleItem >
              <Label text="Số điện thoại" />
              <TextBox
                ref={"SDTRef"}
                value={formData.SoDienThoai}
                id="SoDienThoai"
                onKeyUp={this.onKeyUpSoDienThoai}
                onKeyDown={(evt) => {
                  if (
                    !(
                      /^[0-9]*$/gm.test(evt.event.key) ||
                      evt.event.keyCode === 8
                    )
                  ) {
                    evt.event.preventDefault();
                  }
                }}
              ></TextBox>
              <ValidMessage message={this.state.validateSoDienThoai?.message} />
            </SimpleItem>
            <SimpleItem>
              <Label text="Địa chỉ" />
              <TextBox
                value={formData.DiaChi}
                id="DiaChi"
                onKeyUp={this.onKeyUpDiaChi}
              />
            </SimpleItem>
            <SimpleItem>
              <Button onClick={this.onClickSaveQuanLyMaster} >Lưu</Button>
            </SimpleItem>
            </GroupItem>
           
        </Form>

        <PageTitle title="Danh sách số thẻ của thừa phát lại" />

        <div className="data-grid-wrapper">
        <DataGrid ID="TPLDetail"
        ref={(ref) => {this.DataGridDetail=ref}}
        dataSource={this.state.gridData}
        keyExpr="Id"
        showBorders={true}
        showRowLines
        showColumnLines
        wordWrapEnabled
        focusedRowEnabled
        height={window.innerHeight - 200}
        onFocusedRowChanged={this.onFocusedRowChanged}
        allowColumnReordering={true}
        >
           <Paging enabled={true} />
         
          <Column dataField="{1++}" caption="STT" width="10%" alignment="center"/>
          <Column dataField="SoThe" caption="Số thẻ" width="15%"  />
          <Column dataField="NgayCapThe" caption="Ngày cấp thẻ" width="30%"  dataType="date" />
          <Column dataField="VanPhongCongTac" caption="Văn phòng công tác" width="30%" />
          <Column dataField="SuDung" caption="Sử dụng" width="15%"/>
        
          </DataGrid>
          </div>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ text: "Lưu", onClick: this.onClickSaveQuanLyDetail }}
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









