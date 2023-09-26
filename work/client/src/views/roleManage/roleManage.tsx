import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Col,
  Row,
  Space,
  Table,
  message,
  Modal,
  Popconfirm,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import store from "../../redux";
import roleStatus from "../../redux/RoleStatus";
type RootState = ReturnType<typeof store.getState>;
// import { getRoleList, updateRole, addRole, deleteRole } from '../../services/role';
const RoleManage: React.FC = () => {
  const dispatch = useDispatch();
  const [myForm] = Form.useForm(); // 可以获取表单元素实例
  const [isShow, setIsShow] = useState(false); // 控制modal显示和隐藏
  const [currentId, setCurrentId] = useState(""); // 当前id，如果为空表示新增
  // 通过useSelector获取仓库数据
  const { rolelist } = useSelector((state: RootState) => ({
    rolelist: state.handleRole.rolelist,
  }));

  const columns = [
    {
      title: "角色名",
      dataIndex: "name",
      sorter: (a: { name: string | any[] }, b: { name: string | any[] }) =>
        a.name.length - b.name.length,
    },
    {
      title: "描述",
      dataIndex: "description",
    },
    {
      title: "角色id",
      dataIndex: "id",
    },
    {
      title: "角色人数",
      dataIndex: "useCount",
    },
    {
      title: "操作",
      key: "action",
      render(v, r) {
        return (
          <Space>
            <Button
              title="编辑"
              type="primary"
              size="small"
              onClick={() => {
                setIsShow(true);
                setCurrentId(r.id);
                myForm.setFieldsValue(r);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="是否确认删除此项?"
              onConfirm={async () => {
                const response = roleStatus.asyncActions.deleterole(
                  dispatch,
                  r.id
                );
                response.then((res) => {
                  if (res.status == 200) {
                    // console.log(res)
                    let resmessage = res.data.is_deleted;
                    if (resmessage == "成功删除") {
                      dispatch(roleStatus.asyncActions.getrolelist);
                      message.success(resmessage);
                    } else {
                      message.error(resmessage);
                    }
                  } else {
                    message.error("删除失败");
                  }
                });
                // await deleteRole(r.id).then((res) => {
                //   if (res.status == 200) {
                //     console.log(res)
                //     let x = res.data.is_deleted
                //     if (x == '成功删除') {
                //       dispatch(roleStatus.asyncActions.getrolelist)
                //       message.success(x);
                //     } else {
                //       message.error(x);
                //     }
                //   } else {
                //     message.error('删除失败');
                //   }
                // });
              }}
            >
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                size="small"
                danger
              >
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  //分页配置
  const pgconfig = {
    showTitle: true,
    showQuickJumper: true,
    pageSize: 10,

    showTotal: (total: any) => {
      return `共${total}条`;
    },
  };

  useEffect(() => {
    dispatch(roleStatus.asyncActions.getrolelist);
  }, []);
  return (
    <div>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Row>
          <Col span={24}>
            <Space
              size={"large"}
              direction={"vertical"}
              style={{ marginBottom: 16 }}
            >
              <Button
                type="primary"
                onClick={() => {
                  setIsShow(true);
                }}
                icon={<PlusOutlined />}
              >
                新增
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={rolelist}
              pagination={pgconfig}
              rowKey={(record) => record.id}
            />
          </Col>
        </Row>

        <Modal
          width="700px"
          title="编辑"
          open={isShow}
          // 点击遮罩层时不关闭
          maskClosable={false}
          onCancel={() => setIsShow(false)}
          // 关闭modal的时候清楚数据
          destroyOnClose
          onOk={() => {
            // message.success('保存成功');
            myForm.submit(); //手动触发表单的提交事件
          }}
        >
          <Form
            // 表单配合modal一起使用的时候，需要设置这个属性，要不然关了窗口之后不会清空数据
            preserve={false}
            onFinish={(v) => {
              // message.success('保存成功');
              // console.log(v);
              if (currentId) {
                let id = currentId;
                // console.log(id)
                let params = {
                  id: currentId,
                  name: v.name,
                  description: v.description,
                };
                // await updateRole(params, id); // 修改

                dispatch(() => {
                  roleStatus.asyncActions.updaterole(dispatch, params, id);
                });
                // dispatch(roleStatus.asyncActions.getrolelist)
                message.success("修改成功");
              } else {
                //  addRole({
                //   ...v,
                // }); // 修改
                let params = {
                  name: v.name,
                  description: v.description,
                };
                dispatch(() => {
                  roleStatus.asyncActions.addrole(dispatch, params);
                });
                message.success("新增成功"); //新增
                dispatch(roleStatus.asyncActions.getrolelist);
                // dispatch(roleStatus.asyncActions.asyncAdd1)
                // dispatch(roleStatus.asyncActions.addrole(dispatch,params));
              }

              setIsShow(false);
            }}
            form={myForm}
          >
            <Form.Item
              label="角色名"
              name="name"
              rules={[
                { required: true, message: "请输入你的角色名" },
                {
                  pattern: /^(?:[\u4e00-\u9fa5]|[a-zA-Z]){2,6}$/,
                  message: "只能包含中文或英文,且字符长度为2到6位!",
                },
              ]}
            >
              <Input placeholder="请输入角色名" style={{ width: 200 }} />
            </Form.Item>

            <Form.Item
              name="description"
              label="角色描述"
              rules={[
                {
                  required: true,
                  message: "请输入你的角色描述!",
                },
                {
                  min: 4,
                  message: "角色描述在4到40个字",
                },
                {
                  max: 40,
                  message: "角色描述在4到40个字",
                },
                {
                  pattern: /^[\u4e00-\u9fa5A-Za-z0-9，。；,.;]{1,}$/,
                  message: "只能包含中文或英文或数字或合法的标点符号",
                },
              ]}
            >
              <Input placeholder="请输入角色描述" style={{ width: 200 }} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default RoleManage;
