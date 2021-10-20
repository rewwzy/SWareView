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

export class DmVanPhong extends PureComponent {

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
    ktApi.get("/DanhMucVanPhong/GetAll").then(({ data }) => {
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
        "/DanhMucVanPhong/Delete?" +
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
          <ControlBar phanHe="DanhMucVanPhong" onClick={this.onClickControlBar} />
        </div>
           <PageTitle title="Danh sách văn phòng thừa phát lại" />
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
         <Column
              dataField="SoQDHoatDong"
              caption="Số QD hoạt động"
              width="10%"
              alignment="center"
            />
          <Column dataField="TenVP" caption="Tên văn phòng" width="20%" />
          <Column dataField="DiaChi" caption="Địa chỉ" width="20%" />
          <Column dataField="LoaiHinhDN" caption="Loại hình doanh nghiệp" width="7%" />
          <Column dataField="NgayThanhLap" caption="Ngày thành lập" width="11%" />
          <Column dataField="CoQuan" caption="Cơ Quan Cấp" width="10%" />
          <Column dataField="SoDienThoai" caption="Số Điện Thoại" width="10%" />
          <Column dataField="Email" caption="Email" width="22%" />

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
            <PopupDmVanPhong
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

export default DmVanPhong;

class PopupDmVanPhong extends PureComponent {
 
  closeButtonOptions = null;
  saveButtonOptions = null;
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formDataPopup,
      validateSoQDHoatDong: {
        isValid: true,
        message: "",
      },
      validateTenVP: {
        isValid: true,
        message: "",
      },
      validateLoaiHinhDN: {
        isValid: true,
        message: "",
      },
      validateDiaChi: {
        isValid: true,
        message: "",
      },
      validateNgayThanhLap: {
        isValid: true,
        message: "",
      },
        validateCoQuan: {
        isValid: true,
        message: "",
      },
      validateSoDienThoai: {
        isValid: true,
        message: "",
      },
      validateEmail: {
        isValid: true,
        message: "",
      },
      focus: "SoQDHoatDong",
    };
 


  }
  checkValidate = (e) => {
    var countError = 0;
    if (!e.SoQDHoatDong) {
      this.setState({
        validateSoQDHoatDong: {
          isValid: false,
          message: "Số QD là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "SoQDHoatDong") {
        
      }
    } 
        if (this.state.focus === "SoQDHoatDong") {
          this.refs.soQDHoatDongRef?.instance?.focus();
        }
       else {
        this.setState({ focus: "TenVP" });
      
    }
    if (!e.TenVP?.trim()) {
      this.setState({
        validateTenVP: {
          isValid: false,
          message: "Tên văn phòng là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "TenVP") {
        this.refs.tenVPRef.instance.focus();
      }
      else {
        this.setState({ focus: "LoaiHinhDN" });
      }
    }
    if ( e.NgayThanhLap === "") {
      this.setState({
        validateNgayThanhLap: {
          isValid: false,
          message: "Ngày thành lập là trường bắt buộc",
        },
      });
      countError++;
    }
     if (!e.CoQuan?.trim()) {
      this.setState({
        validateCoQuan: {
          isValid: false,
          message: "Cơ quan cấp là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "CoQuan") {
        this.refs.coQuanRef.instance.focus();
      }
      else {
        this.setState({ focus: "SoDienThoai" });
      }
    }
    if (!e.SoDienThoai?.trim()) {
      this.setState({
        validateSoDienThoai: {
          isValid: false,
          message: "Số điện thoại là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "SoDienThoai") {
        this.refs.SDTRef.instance.focus();
      }
      else {
        this.setState({ focus: "Email" });
      }
    }
    if (!e.Email?.trim()) {
      this.setState({
        validateEmail: {
          isValid: false,
          message: "Email là trường bắt buộc",
        },
      });
      countError++;
      if (this.state.focus === "Email") {
        this.refs.EmailRef.instance.focus();
      }
    
    }
    return !countError;
  };
  onOptionChangedNgayThanhLap = (e) => {
    if (typeof e.value == "string") {
      if (!this.state.validateNgayThanhLap.isValid)
        this.resetValidate("validateNgayThanhLap");
    
      if (e.value.length === 10) {
        this.setState({
         NgayThanhLapValue: moment(e.value, [
            "DD/MM/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          formData: {
            ...this.state.formData,
            NgayThanhLap: moment(e.value, ["DD/MM/YYYY", "YYYY-MM-DD"]).format(
              "YYYY-MM-DD"
            ),
          },
        });
      } else {
        this.setState({
          NgayThanhLapValue: null,
          formData: { ...this.state.formData, NgayThanhLap: null },
        });
      }
    }
  };

  

  onKeyUpTenVP = (e) => {
    if (!this.state.validateTenVP.isValid)
      this.resetValidate("validateTenVP");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, TenVP: e.event.target.value },
      });
    }, this);
  };
  onKeyUpCoQuanCap = (e) => {
    if (!this.state.validateCoQuan.isValid)
      this.resetValidate("validateCoQuan");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, CoQuan: e.event.target.value },
      });
    }, this);
  };
  onKeyUpSoDienThoai = (e) => {
    if (!this.state.validateSoDienThoai.isValid)
      this.resetValidate("validateSoDienThoai");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, SoDienThoai: e.event.target.value },
      });
    }, this);
  };
  onKeyUpEmail = (e) => {
    if (!this.state.validateEmail.isValid)
      this.resetValidate("validateEmail");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, Email: e.event.target.value },
      });
    }, this);
  };
  

  onKeyUpSoQDHoatDong = (e) => {
    if (!this.state.validateSoQDHoatDong.isValid)
      this.resetValidate("validateSoQDHoatDong");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, SoQDHoatDong: e.event.target.value },
      });
    }, this);
  };
  onKeyUpDiaChi = (e) => {
    if (!this.state.validateDiaChi.isValid)
      this.resetValidate("validateDiaChi");
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
  onClickSaveDanhMucVanPhong = (e) => {
  
    e.component.option("disabled", true);
    const formDataSave = {
      SoQDHoatDong: $("#SoQDHoatDong").find('input[type="text"]').val(),
      TenVP: $("#TenVP").find('input[type="text"]').val().trim(),
      DiaChi: $("#DiaChi").find('input[type="text"]').val().trim(),
      LoaiHinhDN: $("#LoaiHinhDN").find('input[type="hidden"]').val(),
      NgayThanhLap: $("#NgayThanhLap").find('input[type="hidden"]').val(),
      CoQuan: $("#CoQuan").find('input[type="text"]').val(),
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
      "/DanhMucVanPhong/" +
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
            validateSoQDHoatDong: {
              isValid: false,
              message: "Số QD hoạt động đã tồn tại",
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
            return <PopupTitle title="Danh mục văn phòng" hidePopup={onHiding } />;
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
              <Label text="Số QĐ hoạt động" />
              <TextBox
                ref={"soQDHoatDongRef"}
                value={formData.SoQDHoatDong}
                id="SoQDHoatDong"
                onKeyUp={this.onKeyUpSoQDHoatDong}
              
              ></TextBox>
              <ValidMessage message={this.state.validateSoQDHoatDong?.message} />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="Tên văn phòng thừa phát lại" />
              <TextBox
                ref={"tenVPRef"}
                value={formData.TenVP}
                id="TenVP"
                onKeyUp={this.onKeyUpTenVP}
                maxLength={250}
              ></TextBox>
              <ValidMessage message={this.state.validateTenVP?.message} />
            </SimpleItem>
          </GroupItem>
          <GroupItem colCount={2}>
            <SimpleItem >
              <Label text="Loại hình doanh nghiệp" />
              <DropDownBox
                id="LoaiHinhDN"
                showClearButton
                useMaskBehavior
                // value={formData.LoaiHinhDN}
                value={'CTTN'}
              >
               
              </DropDownBox>
              <ValidMessage message={this.state.validateLoaiHinhDoanhNghiep?.message} />
            </SimpleItem>
            <SimpleItem>
              <Label text="Địa chỉ" />
              <TextBox
                value={formData.DiaChi}
                id="DiaChi"
                onKeyUp={this.onKeyUpDiaChi}
              />
            </SimpleItem>
          
          </GroupItem>
          <GroupItem colCount={2}>
          <SimpleItem isRequired={true}>
              <Label text="Ngày thành lập" />
              <DateBox
                id="NgayThanhLap"
                showClearButton
                useMaskBehavior
                displayFormat="dd/MM/yyyy"
                placeholder="__/__/____"
                onOptionChanged={this.onOptionChangedNgayThanhLap}
                value={formData.NgayThanhLap}
              ></DateBox>
              <ValidMessage
                message={this.state.validateNgayThanhLap?.message}
              />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="Cơ quan cấp" />
              <TextBox
                ref={"CoQuanRef"}
                value={formData.CoQuan}
             
                id="CoQuan"
                onKeyUp={this.onKeyUpCoQuanCap}
              
              ></TextBox>
              <ValidMessage message={this.state.validateCoQuan?.message} />
            </SimpleItem>
            </GroupItem>
            <GroupItem colCount={2}>
            <SimpleItem isRequired={true}>
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
            <SimpleItem isRequired={true}>
              <Label text="Email" />
              <TextBox
                ref={"emailRef"}
                value={formData.Email}
                id="Email"
                onKeyUp={this.onKeyUpEmail}
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
              <ValidMessage message={this.state.validateEmail?.message} />
            </SimpleItem>
            </GroupItem>
        </Form>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ text: "Lưu", onClick: this.onClickSaveDanhMucVanPhong }}
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








