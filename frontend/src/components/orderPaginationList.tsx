import { Table, Pagination, Modal } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import '../App.css';
import services from '../service';
import useTableHook from '../hooks/useTableHook';

const OrderPaginationList = ({ orderName }: { orderName: string }) => {
  const handleDeleteClick = async (id: number) => {
    Modal.confirm({
      content: '确认删除该条订单？',
      onOk: async () => {
        await services.deleteOrder(orderList.find((v) => v.id === id));
        init();
      },
    });
  };
  const { columns, orderList, dispatch } = useTableHook(handleDeleteClick);
  const [pageNumber, setPageNumber] = useState(1);
  const [total, setTotal] = useState(0);
  const init = useCallback(async () => {
    const { total, data } = await services.listOrderWithPagination({
      pageNumber: pageNumber - 1,
      keyword: orderName,
    });
    setTotal(total);
    dispatch({ type: 'init', list: data });
  }, [dispatch, orderName, pageNumber]);

  useEffect(() => {
    init();
  }, [init]);

  const dataSource = useMemo(
    () => orderList.filter((v) => v.name.includes(orderName)),
    [orderList, orderName]
  );

  return (
    <section className="pagination-container">
      <Table
        rowKey="id"
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={false}
      />
      <Pagination
        total={total}
        pageSize={10}
        current={pageNumber}
        onChange={setPageNumber}
      />
    </section>
  );
};

export default OrderPaginationList;
