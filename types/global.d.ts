type User = {
  id: number;
  ho_va_ten: string;
  so_dien_thoai: string;
  dia_chi: string;
  anh_dai_dien: string;
};

type Banner = {
  id: number;
  banner_path: string;
  website_url: string;
  post_id: number;
  status: number;
};


type Branch = {
  id: number;
  ten_chi_nhanh: string;
  dia_chi: string;
  phone_number: string;
  image_url: string;
  tinh_thanh: string;
  map_url: string;
};

type ChinhNha = {
  id: number;
  ngay_chinh_nha: string;
  branch_id: any;
  user_id: number;
  chinh_nha_chi_tiet_id: number;
};

type Post = {
  id: number;
  title: string;
  banner_id: any;
  date: string;
  content: string;
  website_url: string;
};

type ChinhNhaChiTiet = {
  id: number;
  thu_thuat_dieu_tri: string;
  qua_trinh_image_id: any;
  tinh_trang_rang_mieng: string;
};

type CustomerLibrary = {
  id: number;
  ngay_chup: string;
  user_id: any;
  image_path: string;
};

type AnhQuaTrinh = {
  id: number,
  ngay_chup: string,
  ten_anh: string,
  anh_1: string,
  anh_2: string,
  anh_3: string,
  anh_4: string,
  anh_5: string,
  anh_6: string,
  anh_7: string,
  anh_8: string,
  user_id: number
}
type HopDong = {
  id: number;
  ten_hop_dong: string;
  hop_dong_chi_tiet_id: any;
};