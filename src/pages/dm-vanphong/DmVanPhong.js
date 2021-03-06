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
          "Vui l??ng ch???n b???n ghi tr?????c khi s???a",
          "C???nh b??o !",
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
          "Vui l??ng ch???n b???n ghi tr?????c khi xo??",
          "C???nh b??o !",
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
          "Th??ng b??o",
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
           <PageTitle title="Danh s??ch v??n ph??ng th???a ph??t l???i" />
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
         <SearchPanel visible placeholder="T??m ki???m..." />
         <Column
              dataField="SoQDHoatDong"
              caption="S??? QD ho???t ?????ng"
              width="10%"
              alignment="center"
            />
          <Column dataField="TenVP" caption="T??n v??n ph??ng" width="20%" />
          <Column dataField="DiaChi" caption="?????a ch???" width="20%" />
          <Column dataField="LoaiHinhDN" caption="Lo???i h??nh doanh nghi???p" width="7%" />
          <Column dataField="NgayThanhLap" caption="Ng??y th??nh l???p" width="11%" />
          <Column dataField="CoQuan" caption="C?? Quan C???p" width="10%" />
          <Column dataField="SoDienThoai" caption="S??? ??i???n Tho???i" width="10%" />
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
          message: "S??? QD l?? tr?????ng b???t bu???c",
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
          message: "T??n v??n ph??ng l?? tr?????ng b???t bu???c",
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
          message: "Ng??y th??nh l???p l?? tr?????ng b???t bu???c",
        },
      });
      countError++;
    }
     if (!e.CoQuan?.trim()) {
      this.setState({
        validateCoQuan: {
          isValid: false,
          message: "C?? quan c???p l?? tr?????ng b???t bu???c",
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
          message: "S??? ??i???n tho???i l?? tr?????ng b???t bu???c",
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
          message: "Email l?? tr?????ng b???t bu???c",
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
        NotificationManager.success(data.message, "Th??ng b??o", 1000);
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
              message: "S??? QD ho???t ?????ng ???? t???n t???i",
            },
          });
          this.refs.soQDHoatDongRef?.instance?.focus();
          e.component.option("disabled", false);
        } else {
          NotificationManager.error(data.message, "Th??ng b??o", 1000);
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
            return <PopupTitle title="Danh m???c v??n ph??ng" hidePopup={onHiding } />;
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
              <Label text="S??? Q?? ho???t ?????ng" />
              <TextBox
                ref={"soQDHoatDongRef"}
                value={formData.SoQDHoatDong}
                id="SoQDHoatDong"
                onKeyUp={this.onKeyUpSoQDHoatDong}
              
              ></TextBox>
              <ValidMessage message={this.state.validateSoQDHoatDong?.message} />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="T??n v??n ph??ng th???a ph??t l???i" />
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
              <Label text="Lo???i h??nh doanh nghi???p" />
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
              <Label text="?????a ch???" />
              <TextBox
                value={formData.DiaChi}
                id="DiaChi"
                onKeyUp={this.onKeyUpDiaChi}
              />
            </SimpleItem>
          
          </GroupItem>
          <GroupItem colCount={2}>
          <SimpleItem isRequired={true}>
              <Label text="Ng??y th??nh l???p" />
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
              <Label text="C?? quan c???p" />
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
              <Label text="S??? ??i???n tho???i" />
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
          options={{ text: "L??u", onClick: this.onClickSaveDanhMucVanPhong }}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          style={{ background: "#3b7b9e", color: "#eee" }}
          options={{ text: "Hu???", onClick: this.props.onClickClosePopup }}
        />
        </Popup>
     
     
      </div>
    );
  }
}








