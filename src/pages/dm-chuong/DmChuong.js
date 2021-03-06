import React, { PureComponent } from "react";
import ControlBar from "../../components/control-bar/ControlBar";
import { ktApi } from "../../services/http";
import qS from "query-string";
import DataGrid, {
  Column,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";
import { DateBox, Form, TextBox } from "devextreme-react";
import moment from "moment";
import { GroupItem, Label, SimpleItem } from "devextreme-react/form";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import PopupTemplate from "../../components/popup-template/PopupTemplate";
import { NotificationManager } from "react-notifications";
import $ from "jquery";
import LoadPanel from "devextreme-react/load-panel";
import { delayTyping } from "../../utils/common";
import PageTitle from "../../components/page-title/PageTitle";
import ValidMessage from "../../components/valid-message/ValidMessage";
import PopupTitle from "../../components/PopupTitle/PopupTitle";
import { Button } from 'devextreme-react/button';

export class DmChuong extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      gridData: [],
      visiblePopup: false,
      visibleDelete: false,
      visibleLoading: true,
      selectedRowData: null,
      formDataPopup: {},
      ngayHieuLuc: moment()._d,
      ngayHetHieuLuc: moment().add(10, "year")._d,
      currentMode: null,
    };
  }

  getgridDataSource = () => {
    ktApi.get("/Dm_Chuong/GetAll").then(({ data }) => {
      this.setState({
        gridData: data,
        visibleLoading: false,
      });
    });
  };

  onClickControlBar = ({ mode }) => {
    if (mode === "CREATE") {
      this.setState({
        currentMode: mode,
        visiblePopup: true,
        formDataPopup: {
          NgayHieuLuc: moment()._d,
          NgayHetHieuLuc: moment().add(10, "year")._d,
        },
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

  onHidingPopup = () => {
    this.setState({
      visiblePopup: false,
    });
  };

  componentDidMount() {
    this.getgridDataSource();
  }

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
        "/Dm_Chuong/Delete?" +
          qS.stringify({ key: this.state.selectedRowData.Id })
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
      <>
   
        {/* <div className="loading-wrapper">
          <LoadPanel visible={this.state.visibleLoading} />
        </div> */}
        <div className="control-button-wrapper">
          <ControlBar phanHe="Dm_Chuong" onClick={this.onClickControlBar} />
       
        </div>
        <PageTitle title="Danh m???c ch????ng" />
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
              dataField="Ma"
              caption="M?? ch????ng"
              width="15%"
              alignment="center"
            />
            <Column dataField="Ten" caption="T??n ch????ng" width="40%" />
            <Column
              dataField="CapNganSach"
              caption="C???p ng??n s??ch"
              width="15%"
            />
            <Column
              dataField="NgayHieuLuc"
              caption="Ng??y hi???u l???c"
              dataType="date"
              format="dd/MM/yyyy"
              alignment="center"
              width="15%"
            />
            <Column
              dataField="NgayHetHieuLuc"
              caption="Ng??y h???t hi???u l???c"
              dataType="date"
              format="dd/MM/yyyy"
              alignment="center"
            />
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
            <DmChuongPopup
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
      </>
    );
  }
}

export default DmChuong;

class DmChuongPopup extends PureComponent {
  constructor(props) {
    super(props);
    this.initFormData = {
      NgayHieuLuc: moment()._d,
      NgayHetHieuLuc: moment().add(10, "year")._d,
    };

    this.state = {
      NgayHieuLucValue: moment()._d,
      NgayHetHieuLucValue: moment().add(10, "year")._d,
      formData: props.formDataPopup,
      validateMaChuong: {
        isValid: true,
        message: "",
      },
      validateTenChuong: {
        isValid: true,
        message: "",
      },
      validateNgayHieuLuc: {
        isValid: true,
        message: "",
      },
      validateNgayHetHieuLuc: {
        isValid: true,
        message: "",
      },
      focus: "ma",
    };
  }

  onOptionChangedNgayHetHieuLuc = (e) => {
    if (typeof e.value == "string") {
      if (!this.state.validateNgayHieuLuc.isValid)
        this.resetValidate("validateNgayHieuLuc");
      if (!this.state.validateNgayHetHieuLuc.isValid)
        this.resetValidate("validateNgayHetHieuLuc");
      if (e.value.length === 10) {
        this.setState({
          NgayHetHieuLucValue: moment(e.value, [
            "DD/MM/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          formData: {
            ...this.state.formData,
            NgayHetHieuLuc: moment(e.value, [
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]).format("YYYY-MM-DD"),
          },
        });
      } else {
        this.setState({
          NgayHetHieuLucValue: null,
          formData: { ...this.state.formData, NgayHetHieuLuc: null },
        });
      }
    }
  };

  onOptionChangedNgayHieuLuc = (e) => {
    if (typeof e.value == "string") {
      if (!this.state.validateNgayHieuLuc.isValid)
        this.resetValidate("validateNgayHieuLuc");
      if (!this.state.validateNgayHetHieuLuc.isValid)
        this.resetValidate("validateNgayHetHieuLuc");
      if (e.value.length === 10) {
        this.setState({
          NgayHieuLucValue: moment(e.value, [
            "DD/MM/YYYY",
            "YYYY-MM-DD",
          ]).format("YYYY-MM-DD"),
          formData: {
            ...this.state.formData,
            NgayHieuLuc: moment(e.value, ["DD/MM/YYYY", "YYYY-MM-DD"]).format(
              "YYYY-MM-DD"
            ),
          },
        });
      } else {
        this.setState({
          NgayHieuLucValue: null,
          formData: { ...this.state.formData, NgayHieuLuc: null },
        });
      }
    }
  };

  onKeyDownCapNganSach = (e) => {
    this.setState({
      formData: { ...this.state.formData, CapNganSach: e.event.target.value },
    });
  };

  onKeyUpTenChuong = (e) => {
    if (!this.state.validateTenChuong.isValid)
      this.resetValidate("validateTenChuong");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, Ten: e.event.target.value },
      });
    }, this);
  };

  onKeyUpMaChuong = (e) => {
    if (!this.state.validateMaChuong.isValid)
      this.resetValidate("validateMaChuong");
    delayTyping(() => {
      this.setState({
        formData: { ...this.state.formData, Ma: e.event.target.value },
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

  checkValidate = (e) => {
    var countError = 0;
    if (!e.Ma) {
      this.setState({
        validateMaChuong: {
          isValid: false,
          message: "M?? ch????ng l?? tr?????ng b???t bu???c",
        },
      });
      countError++;
      if (this.state.focus === "ma") {
        this.refs.maRef?.instance?.focus();
      }
    } else {
      if (e.Ma.length !== 3) {
        this.setState({
          validateMaChuong: {
            isValid: false,
            message: "M?? ch????ng kh??ng h???p l???",
          },
        });
        countError++;
        if (this.state.focus === "ma") {
          this.refs.maRef?.instance?.focus();
        }
      } else {
        this.setState({ focus: "ten" });
      }
    }
    if (!e.Ten?.trim()) {
      this.setState({
        validateTenChuong: {
          isValid: false,
          message: "T??n ch????ng l?? tr?????ng b???t bu???c",
        },
      });
      countError++;
      if (this.state.focus === "ten") {
        this.refs.tenRef.instance.focus();
      }
    }
    if (!e.NgayHieuLuc || e.NgayHieuLuc === "") {
      this.setState({
        validateNgayHieuLuc: {
          isValid: false,
          message: "Ng??y hi???u l???c l?? tr?????ng b???t bu???c",
        },
      });
      countError++;
    } else {
      if (
        e.NgayHetHieuLuc?.length > 9 &&
        Number(e.NgayHieuLuc.split("-").join("")) >
          Number(e.NgayHetHieuLuc.split("-").join(""))
      ) {
        this.setState({
          validateNgayHieuLuc: {
            isValid: false,
            message: "Ng??y hi???u l???c ph???i nh??? h??n ng??y h???t hi???u l???c",
          },
        });
        countError++;
      }
    }
    if (!e.NgayHetHieuLuc || e.NgayHetHieuLuc === "") {
      this.setState({
        validateNgayHetHieuLuc: {
          isValid: false,
          message: "Ng??y h???t hi???u l???c l?? tr?????ng b???t bu???c",
        },
      });
      countError++;
    } else {
      if (
        e.NgayHieuLuc?.length > 9 &&
        Number(e.NgayHieuLuc.split("-").join("")) >
          Number(e.NgayHetHieuLuc.split("-").join(""))
      ) {
        this.setState({
          validateNgayHetHieuLuc: {
            isValid: false,
            message: "Ng??y h???t hi???u l???c ph???i l???n h??n ng??y hi???u l???c",
          },
        });
        countError++;
      }
    }
    return !countError;
  };

  onClickSaveDmChuong = (e) => {
    e.component.option("disabled", true);
    const formDataSave = {
      Ma: $("#Ma").find('input[type="text"]').val(),
      Ten: $("#Ten").find('input[type="text"]').val().trim(),
      CapNganSach: $("#CapNganSach").find('input[type="text"]').val(),
      NgayHieuLuc: $("#NgayHieuLuc").find('input[type="hidden"]').val(),
      NgayHetHieuLuc: $("#NgayHetHieuLuc").find('input[type="hidden"]').val(),
    };
    const oldFormData = this.state.formData;
    const newFormData = { ...oldFormData, ...formDataSave };
    if (!this.checkValidate(newFormData)) {
      e.component.option("disabled", false);
      return;
    }
    ktApi[this.props.mode === "CREATE" ? "post" : "put"](
      "/Dm_Chuong/" +
        (this.props.mode === "CREATE" ? "Insert" : "Update") +
        "?" +
        qS.stringify({ values: JSON.stringify(newFormData) })
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
            validateMaChuong: {
              isValid: false,
              message: "M?? ch????ng ???? t???n t???i",
            },
          });
          this.refs.maRef?.instance?.focus();
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
      <Popup
        visible={visible}
        dragEnabled={false}
        titleComponent={(props) => {
          return <PopupTitle title="Danh m???c ch????ng" hidePopup={onHiding} />;
        }}
      >
        <Form>
          <GroupItem colCount={2}>
            <SimpleItem isRequired={true}>
              <Label text="M?? ch????ng" />
              <TextBox
                ref={"maRef"}
                value={formData.Ma}
                maxLength={3}
                id="Ma"
                onKeyUp={this.onKeyUpMaChuong}
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
              <ValidMessage message={this.state.validateMaChuong?.message} />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="T??n ch????ng" />
              <TextBox
                ref={"tenRef"}
                value={formData.Ten}
                id="Ten"
                onKeyUp={this.onKeyUpTenChuong}
                maxLength={250}
              ></TextBox>
              <ValidMessage message={this.state.validateTenChuong?.message} />
            </SimpleItem>
          </GroupItem>
          <GroupItem colCount={2}>
            <SimpleItem isRequired={true}>
              <Label text="Ng??y hi???u l???c" />
              <DateBox
                id="NgayHieuLuc"
                showClearButton
                useMaskBehavior
                displayFormat="dd/MM/yyyy"
                placeholder="__/__/____"
                onOptionChanged={this.onOptionChangedNgayHieuLuc}
                value={formData.NgayHieuLuc}
              ></DateBox>
              <ValidMessage message={this.state.validateNgayHieuLuc?.message} />
            </SimpleItem>
            <SimpleItem>
              <Label text="C???p ng??n s??ch" />
              <TextBox
                value={formData.CapNganSach}
                id="CapNganSach"
                onKeyUp={this.onKeyDownCapNganSach}
              />
            </SimpleItem>
            <SimpleItem isRequired={true}>
              <Label text="Ng??y h???t hi???u l???c" />
              <DateBox
                id="NgayHetHieuLuc"
                showClearButton
                useMaskBehavior
                displayFormat="dd/MM/yyyy"
                placeholder="__/__/____"
                onOptionChanged={this.onOptionChangedNgayHetHieuLuc}
                value={formData.NgayHetHieuLuc}
              ></DateBox>
              <ValidMessage
                message={this.state.validateNgayHetHieuLuc?.message}
              />
            </SimpleItem>
          </GroupItem>
        </Form>
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ text: "L??u", onClick: this.onClickSaveDmChuong }}
        />
        <ToolbarItem
          widget="dxButton"
          toolbar="bottom"
          location="after"
          options={{ text: "Hu???", onClick: this.props.onClickClosePopup }}
        />
      </Popup>
    );
  }
}
