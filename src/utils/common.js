//khắc phục input delay
import moment from "moment";
import path from "path";
import jwt, { decode } from "jsonwebtoken";
import { getCookieValue } from "./cookie-store";
export const delayTyping = (callback, that) => {
  if (that.timer) clearTimeout(that.timer);
  that.timer = setTimeout(callback, 100);
};

export const validateTwoDateTime = (formData, option) => {
  let _option = {
    min: "NgayHieuLuc",
    max: "NgayHetHieuLuc",
  };
  if (option?.min) _option.min = "NgayHieuLuc";
  if (option?.max) _option.max = "NgayHetHieuLuc";

  const { min, max } = _option;

  if (!formData || !formData[max] || !formData[min]) return false;
  let ngayHetHieuLuc = moment(formData[max]).format("YYYY/MM/DD");
  let ngayHieuLuc = moment(formData[min]).format("YYYY/MM/DD");

  return ngayHieuLuc > ngayHetHieuLuc;
};

let fileDownLoadUrl = process.env.REACT_APP_KT_PUBLIC_URL;
console.log("fileDownLoadUrl : ", fileDownLoadUrl, path);

export const fileHelper = {
  download: (url) => {},
};

export function formatMoney(value, type = "VND") {
  return value;
}

export const filterBatchValue = (data, files = []) => {
  let dtlData = {
    i: [],
    u: [],
    d: [],
  };
  if (data) {
    const { i, u, d } = dtlData;
    data &&
      data.forEach(({ type, data, key }) => {
        if (type === "insert") {
          if (files?.length) {
            files.forEach((file) => {
              if (data.Id === file.key) {
                i.push({
                  ...data,
                  FileId: file.files?.length
                    ? file.files.map((f) => f.Id).toString()
                    : null,
                });
              }
            });
          } else i.push(data);
        } else if (type === "update") {
          u.push({ ...data, Id: key });
        } else if (type === "remove") {
          d.push(key);
        }
      });
    return dtlData;
  }
  return dtlData;
};
export function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getUserInfo() {
  const token = getCookieValue("access-token");
  console.log("token", token);
  const secretKey = `db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==`;
  jwt.verify(
    token,
    `db3OIsj+BXE9NZDy0t8W3TcNekrF+2d/1sFnWG4HnV8TZY30iTOdtVWJG8abWvB1GlOgJuQZdcF2Luqm/hccMw==`,
    (err, decoded) => {
      if (err) {
        console.error("my error : ", err);
      }
      console.log("decoded : ", decoded);
    }
  );
}


export function withoutTime(dateTime) {
  var date = new Date(dateTime.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

export const _formatMoney = (number) => {
  if(!number) return '';
  if(typeof number === 'number') {
    return number.toLocaleString();
  }else if(typeof number === 'string'){
    if(isNaN(+number)) return '';
    return Number(number).toLocaleString();
  }
  return '';
}

export const _toStringIf = (value) => {
  if(!value) return null;
  if(typeof value === 'number') return value.toString();
  return value; 
}

export const _checkNumber = (value) => {
  if(!value || typeof value !== 'number') return 0;
  return value;
}

export const _money2Number = (value) => {
  if(!value) return 0;
  if(typeof value === 'number') return value;
  if(typeof value === 'string') {
    let _newV = value.replaceAll('.');
    return +_newV;
  } 
  return 0;
}