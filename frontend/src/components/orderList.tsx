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
        index?: number;
        desc?: string;
      }
    | {
        type: 'save';
        index?: number;
        order?: API.OrderVO;
      }
    | {
        type: 'init';
        list?: API.OrderVO[];
      }
    | {
        type: 'edit' | 'cancel';
        index?: number;
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
      return state.map((v, idx) => {
        if (idx === props.index) {
          return { ...v, editable: true };
        }
        return v;
      });
    case 'cancel':
      return state.map((v, idx) => {
        if (idx === props.index) {
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
      return state.map((v, idx) => {
        if (idx === props.index) {
          return {
            ...v,
            prevouseDesc: !v.prevouseDesc ? v.desc : v.prevouseDesc,
            desc: props.desc,
          };
        }
        return v;
      });
    case 'save':
      return state.map((v, idx) => {
        if (idx === props.index) {
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
