import { Table, Space, Input, Pagination, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import '../App.css';
import services from '../service';
import { reducer } from './orderList';

const OrderList = ({ orderName }: { orderName: string }) => {
  const [orderList, dispatch] = useReducer(reducer, []);

  const handleEditClick = (index: number) => dispatch({ type: 'edit', index });

  const handleInput = (index: number, desc: string) =>
    dispatch({ type: 'input', index, desc });

  const handleCancel = (index: number) => dispatch({ type: 'cancel', index });

  const handleDeleteClick = async (index: number) => {
    Modal.confirm({
      content: '确认删除该条订单？',
      onOk: async () => {
        await services.deleteOrder(orderList[index]);
        init();
      },
    });
  };

  const handleSaveClick = async (index: number, order: API.OrderVO) => {
    if (order.id) {
      await services.updateOrder(order);
    } else {
      await services.addOrder(order);
    }
    dispatch({ type: 'save', order, index });
  };

  const columns = [
    {
      title: '订单 ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '订单名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '订单描述',
      dataIndex: 'desc',
      key: 'desc',
      render: (_: any, order: API.OrderVO, index: number) => (
        <>
          {order.editable ? (
            <Input
              value={order.desc}
              onChange={(e: SyntheticEvent & { target: { value: string } }) =>
                handleInput(index, e.target.value)
              }
            />
          ) : (
            order.desc
          )}
        </>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: API.OrderVO, order: API.OrderVO, index: number) => (
        <Space size="middle">
          {order.editable ? (
            <>
              <CheckCircleOutlined
                title="保存"
                onClick={() => handleSaveClick(index, order)}
              />
              <RedoOutlined
                title="取消"
                type="primary"
                onClick={() => handleCancel(index)}
              />
            </>
          ) : (
            <EditOutlined title="取消" onClick={() => handleEditClick(index)} />
          )}
          <DeleteOutlined
            title="删除"
            color="red"
            onClick={() => handleDeleteClick(index)}
          />
        </Space>
      ),
    },
  ];
  const [pageNumber, setPageNumber] = useState(1);
  const [total, setTotal] = useState(0);
  const init = useCallback(async () => {
    const { total, data } = await services.listOrderWithPagination({
      pageNumber: pageNumber - 1,
      keyword: orderName,
    });
    setTotal(total);
    dispatch({ type: 'init', list: data });
  }, [orderName, pageNumber]);
  useEffect(() => {
    init();
  }, [init, orderName, pageNumber]);

  const dataSource = useMemo(
    () => orderList.filter((v) => v.name.includes(orderName)),
    [orderList, orderName]
  );

  return (
    <>
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
    </>
  );
};

export default OrderList;
