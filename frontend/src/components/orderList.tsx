import { Table, Space, Input, Modal, Button } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { SyntheticEvent, useEffect, useMemo, useReducer } from 'react';
import '../App.css';
import services from '../service';

export const reducer = (
  state: API.OrderVO[],
  props:
    | {
        type: 'input';
        id?: number;
        desc?: string;
      }
    | {
        type: 'save';
        order?: API.OrderVO;
      }
    | {
        type: 'init';
        list?: API.OrderVO[];
      }
    | {
        type: 'edit' | 'cancel';
        id?: number;
      }
    | {
        type: 'add';
        index?: number;
      }
) => {
  switch (props.type) {
    case 'init':
      return props.list;
    case 'edit':
      return state.map((v) => {
        if (v.id === props.id) {
          return { ...v, editable: true };
        }
        return v;
      });
    case 'cancel':
      return state.map((v) => {
        if (v.id === props.id) {
          return {
            ...v,
            desc: v.prevouseDesc || v.desc,
            prevouseDesc: '',
            editable: false,
          };
        }
        return v;
      });
    case 'input':
      return state.map((v) => {
        if (v.id === props.id) {
          return {
            ...v,
            prevouseDesc: !v.prevouseDesc ? v.desc : v.prevouseDesc,
            desc: props.desc,
          };
        }
        return v;
      });
    case 'save':
      return state.map((v) => {
        if (v.id === props.order.id) {
          return { ...props.order, prevouseDesc: '', editable: false };
        }
        return v;
      });
    case 'add':
      return [{ name: '', desc: '', editable: true } as API.OrderVO].concat(
        state
      );
    default:
      return state;
  }
};

const OrderList = ({ orderName }: { orderName: string }) => {
  const init = async () => {
    const list = await services.listOrder();
    dispatch({ type: 'init', list });
  };
  const [orderList, dispatch] = useReducer(reducer, []);

  const handleEditClick = (id: number) => dispatch({ type: 'edit', id });

  const handleInput = (id: number, desc: string) =>
    dispatch({ type: 'input', id, desc });

  const handleCancel = (id: number) => dispatch({ type: 'cancel', id });

  const handleDeleteClick = async (id: number) => {
    Modal.confirm({
      content: '确认删除该条订单？',
      onOk: async () => {
        await services.deleteOrder(orderList.find((v) => v.id === id));
        init();
      },
    });
  };

  const handleSaveClick = async (order: API.OrderVO) => {
    if (order.id) {
      await services.updateOrder(order);
    } else {
      await services.addOrder(order);
    }
    dispatch({ type: 'save', order });
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
      render: (_: API.OrderVO, order: API.OrderVO) => (
        <>
          {order.editable ? (
            <Input
              value={order.desc}
              onChange={(e: SyntheticEvent & { target: { value: string } }) =>
                handleInput(order.id, e.target.value)
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
      render: (_: API.OrderVO, order: API.OrderVO) => (
        <Space size="middle">
          {order.editable ? (
            <>
              <CheckCircleOutlined
                title="保存"
                onClick={() => handleSaveClick(order)}
              />
              <RedoOutlined
                title="取消"
                type="primary"
                onClick={() => handleCancel(order.id)}
              />
            </>
          ) : (
            <EditOutlined
              title="取消"
              onClick={() => handleEditClick(order.id)}
            />
          )}
          <DeleteOutlined
            title="删除"
            color="red"
            onClick={() => handleDeleteClick(order.id)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    init();
  }, []);

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
