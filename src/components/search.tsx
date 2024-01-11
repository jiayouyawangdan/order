import { Input } from 'antd';
import '../App.css';

const Search = ({ orderName, handleInputChange }: any) => (
  <div className="operation-bar">
    <Input
      placeholder="请输入订单名称"
      value={orderName}
      onChange={handleInputChange}
    />
  </div>
);

export default Search;
