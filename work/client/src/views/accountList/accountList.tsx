import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  FormInstance,
  Col,
  Row,
  Space,
  DatePicker,
  Table,
  message,
  Modal,
  Popconfirm,
  Drawer,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAccountList,
  addAccount,
  updateAccount,
  deleteAccount,
} from "../../services/account";
import moment from "moment";
import { SelectedRow, DescriptionItemProps } from "../../interface/account";
import "./accountList.css";
import store from "../../redux";
import { useSelector, useDispatch } from "react-redux";
import roleStatus from "../../redux/RoleStatus";
type RootState = ReturnType<typeof store.getState>;
const AccountList: React.FC = () => {
  const { RangePicker } = DatePicker;
  const formRef = React.useRef<FormInstance>(null);
  const [myForm] = Form.useForm(); // 可以获取表单元素实例
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRow, setSelectedRow] = useState<SelectedRow[]>([]);
  const [isShow, setIsShow] = useState(false); // 控制modal显示和隐藏
  const [currentId, setCurrentId] = useState(""); // 当前id，如果为空表示新增
  const [data, setData] = useState([]); //设置表单的数据
  const [query, setQuery] = useState({ pageSize: "10", pageIndex: "0" }); // 查询条件
  const [total, setTotal] = useState(0); // 总数量
  const [open, setOpen] = useState(false); //用户详情的展开控制
  const [confirmOpen, setConfirmOpen] = useState(false); //批量删除的对话框
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useDispatch();
  //设置表单的数据
  const [userDetal, setUserDetal] = useState({
    id: "",
    username: "",
    role: "",
    phone: "",
    password: "",
    createtime: "",
    updatetime: "",
    email: "",
  });
  // 通过useSelector获取仓库数据
  const { rolelist } = useSelector((state: RootState) => ({
    rolelist: state.handleRole.rolelist,
  }));
  //对表格时间格式化处理
  const formatterTime = (val: moment.MomentInput) => {
    return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "";
  };
  //对角色id处理
  const formatterRole = (val: any) => {
    rolelist.map((item) => (item.id == val ? (val = item.name) : ""));
    return val;
  };
  //展示用户详情
  const showDrawer = (text) => {
    let x = text;
    x.createtime = formatterTime(text.createtime);
    x.updatetime = formatterTime(text.updatetime);
    x.role = formatterRole(text.role);

    setOpen(true);
    setUserDetal(x);
  };

  const onClose = () => {
    setOpen(false);
  };
  //table列配置项
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      sorter: (
        a: { username: string | any[] },
        b: { username: string | any[] }
      ) => a.username.length - b.username.length,
      render: (r, text) => (
        <a
          onClick={() => {
            showDrawer(text);
          }}
        >
          {r}
        </a>
      ),
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "创建时间",
      dataIndex: "createtime",
      render: formatterTime, //在这里调用就可以实现时间格式化
    },
    {
      title: "最近更新时间",
      dataIndex: "updatetime",
      render: formatterTime, //在这里调用就可以实现时间格式化
    },
    {
      title: "角色",
      dataIndex: "role",
      render: formatterRole, //在这里调用就可以实现时间格式化
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
                // console.log(r)
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
                await deleteAccount(r.id).then((res) => {
                  if (res.status == 200) {
                    setQuery({ pageSize: "10", pageIndex: "0" }); // 重新加载数据
                    message.success("删除成功");
                  } else {
                    message.error("删除失败");
                  }
                });
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
    total: total,
    showTotal: (total: any) => {
      return `共${total}条`;
    },
    // 页码改变的时候执行
    onChange(pageIndex: any, pageSize: any) {
      setQuery({
        pageSize: pageSize,
        pageIndex: String(Number(pageIndex) - 1),
      });
    },
  };
  //用户详情页列表项
  const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
      <p className="site-description-item-profile-p-label">{title}:</p>
      {content}
    </div>
  );
  //监听列表左侧多选项的变化
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: []) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRow(selectedRows);
  };
  //确认批量删除对话框
  const showModal = () => {
    setConfirmOpen(true);
    // console.log(confirmOpen)
  };
  //列表多选删除函数
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      selectedRow.map((item) => deleteAccount(item.id));
      setQuery({ pageSize: "10", pageIndex: "0" });
      message.success("删除成功");
      setConfirmOpen(false);
      setConfirmLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };
  // 表格RowSelection配置项
  const rowSelection = {
    //是否全选
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: []) => {
      //selectedRowKeys:表示Id值，唯一的，selectedRows：整行的数据
      onSelectChange(selectedRowKeys, selectedRows);
    },
    //getCheckboxProps 这个方法是表格有一些行禁止多选，通过disabled来判断
    getCheckboxProps: (record) => {
      return {
        //false表示全部可以选择,有禁止选择以函数形式判断
        disabled: false,
        name: record.name,
      };
    },
  };

  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    getAccountList(query).then((res) => {
      if (res.status == 200) {
        setData(res.data.data.result);
        setTotal(res.data.data.pageRow);
      } else {
        message.error("查询失败");
      }
    });
  }, [query]); // 监听query改变
  const selectchange = () => {
    // dispatch(roleStatus.asyncActions.getrolelist);
  };
  useEffect(() => {
    dispatch(roleStatus.asyncActions.getrolelist);
  }, []);

  const onReset = () => {
    formRef.current?.resetFields();
  };
  return (
    <div>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Form
          ref={formRef}
          name="basic"
          layout="inline"
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={(v) => {
            message.success("查询成功");
            let createBeginTime = v.ctime
              ? moment(v.ctime[0].$d).format("x")
              : null;
            let createEndTime = v.ctime
              ? moment(v.ctime[1].$d).format("x")
              : null;
            let updateBeginTime = v.mtime
              ? moment(v.mtime[0].$d).format("x")
              : null;
            let updateEndTime = v.mtime
              ? moment(v.mtime[1].$d).format("x")
              : null;

            setQuery({
              ...v,
              pageSize: "10",
              pageIndex: "0",
              createBeginTime: createBeginTime,
              createEndTime: createEndTime,
              updateBeginTime: updateBeginTime,
              updateEndTime: updateEndTime,
            });
          }}
        >
          <Form.Item style={{ width: 200 }} label="用户名" name="username">
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Select
              placeholder="请选择角色"
              allowClear
              style={{ width: 120 }}
              options={rolelist}
              onDropdownVisibleChange={selectchange}
              fieldNames={{ label: "name", value: "id" }}
            ></Select>
          </Form.Item>
          <Form.Item name="ctime" label="创建时间">
            <RangePicker style={{ width: 240 }} format={"YYYY-MM-DD"} />
          </Form.Item>
          <Form.Item name="mtime" label="修改时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ marginRight: 10 }}
              type="primary"
              htmlType="submit"
            >
              查询
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>

        <Row>
          <Col span={24}>
            <Space size={"large"} style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                onClick={() => {
                  setIsShow(true);
                }}
                icon={<PlusOutlined />}
              >
                新增
              </Button>
              <Button
                danger
                type="primary"
                onClick={showModal}
                disabled={!hasSelected}
              >
                删除
              </Button>
            </Space>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={data}
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
          okText="确认"
          cancelText="取消"
        >
          <Form
            // 表单配合modal一起使用的时候，需要设置这个属性，要不然关了窗口之后不会清空数据
            preserve={false}
            onFinish={async (v) => {
              if (currentId) {
                let id = currentId;

                let params = {
                  role: v.role,
                  username: v.username,
                  password: v.password,
                  Email: v.Email,
                  phone: v.phone,
                };
                await updateAccount(params, id); // 新增
              } else {
                await addAccount({
                  ...v,
                }); // 修改
              }
              message.success("保存成功");
              setIsShow(false);
              setQuery({ pageSize: "10", pageIndex: "0" }); // 重置查询条件，取数据
            }}
            form={myForm}
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                { required: true, message: "请输入你的用户名" },
                {
                  pattern: /^[a-zA-Z0-9]{4,20}$/,
                  message: "只能包含英文或者数字,长度为4到20位!",
                },
              ]}
            >
              <Input placeholder="请输入用户名" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item
              label="角色"
              name="role"
              rules={[
                {
                  required: true,
                  message: "请选择角色",
                },
              ]}
            >
              <Select
                allowClear
                style={{ width: 200 }}
                onDropdownVisibleChange={selectchange}
              >
                {rolelist.map((item) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: "请输入您的密码!",
                },
                {
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                  message:
                    "密码需要包含数字，英文小写，英文大写，长度6-20以内,",
                },
              ]}
              hasFeedback
            >
              <Input.Password style={{ width: 300 }} />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="确认密码"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "请确认您的密码!",
                },
                {
                  pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/,
                  message:
                    "密码需要包含数字，英文小写，英文大写，长度6-20以内,",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不相同"));
                  },
                }),
              ]}
            >
              <Input.Password style={{ width: 300 }} />
            </Form.Item>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  pattern:
                    /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                  message: "邮箱格式不正确",
                },
              ]}
            >
              <Input placeholder="请输入邮箱" style={{ width: 200 }} />
            </Form.Item>
            <Form.Item
              label="手机号"
              name="phone"
              rules={[
                {
                  pattern:
                    /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
                  message: "请输入正确手机号",
                },
              ]}
            >
              <Input placeholder="请输入手机号" style={{ width: 200 }} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p
          className="site-description-item-profile-p"
          style={{ marginBottom: 24 }}
        >
          用户详细列表
        </p>
        <p className="site-description-item-profile-p">个人信息</p>
        <Row>
          <Col span={24}>
            <DescriptionItem title="用户id" content={userDetal.id} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="用户名" content={userDetal.username} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="手机号" content={userDetal.phone} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="密码" content={userDetal.password} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="邮箱" content={userDetal.email} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="角色" content={userDetal.role} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="创建时间" content={userDetal.createtime} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="更新时间" content={userDetal.updatetime} />
          </Col>
        </Row>
      </Drawer>
      <Modal
        okText="确认"
        cancelText="取消"
        title="警告"
        open={confirmOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>请确认是否删除已选账户</p>
      </Modal>
    </div>
  );
};

export default AccountList;
