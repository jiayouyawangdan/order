import { useDeferredValue, useState } from 'react';
import './App.css';
import OrderList from './components/orderList';
import OrderPaginationList from './components/orderPaginationList';
import OrderScrollList from './components/orderPaginationList';
import Search from './components/search';

const List1 = () => {
  const [orderName, setOrderName] = useState('');
  const deferredValue = useDeferredValue(orderName);
  const handleInputChange = (e: { target: { value: string } }) =>
    setOrderName(e.target.value);

  return (
    <>
      <h1>获取所有数据：1）使用 ant table 分页；2）前端过滤</h1>
      <Search handleInputChange={handleInputChange} />
      <OrderList orderName={deferredValue} />
    </>
  );
};
const List2 = () => {
  const [orderName, setOrderName] = useState('');
  const deferredValue = useDeferredValue(orderName);
  const handleInputChange = (e: { target: { value: string } }) =>
    setOrderName(e.target.value);
  return (
    <>
      <h1>获取分页数据：1）后端分页；2）后端过滤</h1>
      <Search handleInputChange={handleInputChange} />
      <OrderPaginationList orderName={deferredValue} />
    </>
  );
};
const List3 = () => {
  const [orderName, setOrderName] = useState('');
  const deferredValue = useDeferredValue(orderName);
  const handleInputChange = (e: { target: { value: string } }) =>
    setOrderName(e.target.value);

  return (
    <>
      <h1>无限滚动</h1>
      <Search handleInputChange={handleInputChange} />
      <OrderScrollList orderName={deferredValue} />
    </>
  );
};

const App = () => (
  <>
    <List2 />
    <List1 />
  </>
);

export default App;
