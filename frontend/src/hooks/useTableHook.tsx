import { Space, Input, Modal } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { SyntheticEvent, useCallback, useReducer } from 'react';
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

const useTableHook = (deleteCallback?: (id: number) => void) => {
  const init = useCallback(async () => {
    const list = await services.listOrder();
    dispatch({ type: 'init', list });
  }, []);
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
              title="编辑"
              onClick={() => handleEditClick(order.id)}
            />
          )}
          <DeleteOutlined
            title="删除"
            color="red"
            onClick={() =>
              deleteCallback
                ? deleteCallback(order.id)
                : handleDeleteClick(order.id)
            }
          />
        </Space>
      ),
    },
  ];

  return { columns, orderList, init, dispatch };
};

export default useTableHook;
