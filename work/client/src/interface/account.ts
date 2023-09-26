//表格已选中项
export interface SelectedRow {
  id: string;
  password: string;
  phone: string;
  role: string;
  username: string;
  email: string;
  updatetime: number;
  createtime: number;
}

//抽屉配置
export interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}
