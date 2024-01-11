import { Input } from 'antd';
import './list.css';

const Search = ({ orderName, handleInputChange }: any) => (
  <Input
    className="mb-m"
    placeholder="请输入订单名称"
    value={orderName}
    onChange={handleInputChange}
  />
);

export default Search;
