import { withNavigationWatcher } from "./contexts/navigation";
import DmChuong from "./pages/dm-chuong/DmChuong";
import DmDonVi from "./pages/dm-donvi/DmDonVi";
import DmVanPhong from "./pages/dm-vanphong/DmVanPhong";
import DmChucVu from "./pages/dm-chucvu/DmChucVu";
import QuanLyThuaPhatLai from "./pages/ql-thuaphatlai/QuanLyThuaPhatLai"
import QuanLySanPham from  "./pages/ql-sanpham/QuanLySanPham"
import { QuanLySanPham2 } from "./pages/ql-sanpham2/QuanLySanPham2";
const routes = [
  {
    path: "/danh-muc/don-vi",
    component: DmDonVi,
  },
  {
    path: "/danh-muc/chuong",
    component: DmChuong,
  },
  {
    path: "/danh-muc/van-phong",
    component: DmVanPhong,
  },
  {
    path: "/danh-muc/chuc-vu",
    component: DmChucVu,
  },
  {
    path: "/quan-ly/thua-phat-lai-master",
    component: QuanLyThuaPhatLai,
  },
  {
    path: "/quan-ly/san-pham",
    component: QuanLySanPham,
  },
  {
    path: "/quan-ly/san-pham2",
    component: QuanLySanPham2,
  },

];

export default routes.map((route) => {
  return {
    ...route,
    component: withNavigationWatcher(route.component),
  };
});
