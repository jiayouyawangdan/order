import { Table, Button } from 'antd';

import { useEffect, useMemo } from 'react';
import './list.css';
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
    <section>
      <Button type="primary" className="mb-m" onClick={handleClick}>
        生成 10 条新数据
      </Button>
      <Table rowKey="id" dataSource={dataSource} columns={columns} bordered />
    </section>
  );
};

export default OrderList;
