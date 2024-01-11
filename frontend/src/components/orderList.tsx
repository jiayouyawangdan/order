import { Table, Button } from 'antd';

import { useEffect, useMemo } from 'react';
import '../App.css';
import services from '../service';
import useTableHook from '../hooks/useTableHook';

const OrderList = ({ orderName }: { orderName: string }) => {
  const { columns, orderList, init } = useTableHook();
  useEffect(() => {
    init();
  }, [init]);

  const dataSource = useMemo(
    () => orderList.filter((v) => v.name.includes(orderName)),
    [orderList, orderName]
  );
  const handleClick = async () => {
    for (let i = 0; i < 10; i++) {
      await services.addOrder({ desc: `${i}` });
    }
    init();
  };
  return (
    <section className="pagination-container">
      <div>
        <Button type="primary" onClick={handleClick}>
          生成 10 条新数据
        </Button>
      </div>
      <Table rowKey="id" dataSource={dataSource} columns={columns} bordered />
    </section>
  );
};

export default OrderList;
