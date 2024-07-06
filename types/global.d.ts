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
};