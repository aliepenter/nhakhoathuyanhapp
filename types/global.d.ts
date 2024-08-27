type User = {
  id: number;
  avatar_id: any;
  ho_va_ten: string;
  so_dien_thoai: string;
  dia_chi: string;
  anh_dai_dien: string;
  ngay_sinh: string;
  gioi_tinh: string;
  ngay_ktvcn: string;
  ngay_chot_cn: string;
  ngay_gan_mc: string;
  main_status: number
};
type DateFormatType = 'full' | 'minimize' | 'day' | 'month' | 'year' | 'isoDate' | 'path';

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
  thu_thuat_dieu_tri: string;
  qua_trinh_image_id: number;
  loi_dan_id: number;
};

type Post = {
  id: number;
  title: string;
  banner_id: any;
  date: string;
  content: string;
  website_url: string;
};

type Video = {
  id: number;
  video_thumbnail: string;
  video_url: any;
  video_title: string;
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


type HoSoTraGopCn = {
  id: number;
  tong_so_tien: string;
  so_tien_can_tra_ki_toi: string;
  ngay_bat_dau_thanh_toan: string;
  user_id: number;
};

type LichSuThanhToan = {
  id: number;
  so_tien: string;
  ngay_thanh_toan: string;
  user_id: number;
  dich_vu_id: number;
};

type DichVuKhac = {
  id: number;
  gia_thanh: string;
  ngay_kham: string;
  user_id: number;
  ten_dich_vu: number;
};


type CuocTroChuyen = {
  id: number;
  title: string;
  createdAt: string;
  user_id: number;
  status: number;
  seen: number;
};

type LoiDan = {
  id: number;
  noi_dung: string;
  tieu_de: string;
  ngay_tao: string;
  user_id: number;
  seen: number;
};

type Message = {
  id: number;
  noi_dung: string;
  createdAt: string;
  nguoi_gui_id: number;
  cuoc_tro_chuyen_id: any;
};

type Settings = {
  id: number;
  setting_type: number;
  value: string;
  user_id: number;
};

type Avatar = {
  id: number;
  value: string;
};