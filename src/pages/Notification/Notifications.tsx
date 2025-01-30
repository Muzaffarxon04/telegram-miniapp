/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Table, Input,  Breadcrumb, Typography, Card, Row, Col, Button, Badge, Modal, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import useUniversalFetch from "@hook/useApi";
import { BASE_URL } from "src/consts/variables";
import dayjs from "dayjs";
import translate from '@utils/transaitor';
// import { EyeOutlined } from '@ant-design/icons';
const { Title } = Typography;

interface DataType {
  key: string;
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  status: string;
}





const Notifications: React.FC = () => {
 const language = localStorage.getItem("language") || "uz"
  // const translate = (key: string, from: any, to: any, total_elements: any) => translations[language]?.[key] || key;
  const token = JSON.parse(localStorage.getItem("authToken") || '[]')
  const [searchText, setSearchText] = useState("");
  const [modal2Open, setModal2Open] = useState<boolean | string>(false);

  
const {
  useFetchQuery,

//  useDeleteMutation
} = useUniversalFetch();
const {
  data: categoryData,
  isLoading: iscategoryDataLoading,
  // error: categoryDataError,
  // isError: iscategoryDataError,
  // isSuccess: isSuccescategoryData,
} = useFetchQuery({
  queryKey: "notification",
  token: token,
  url: `${BASE_URL}/notification`,
  id:searchText && `?search=${searchText}`,
  config: { 
    headers: {
  lang: language,
    }
  }
});

const {
  data: getOneNatification,
  isLoading: isgetOneNatificationLoading,

} = useFetchQuery({
  queryKey: "notification-one",
  token: token,
  url: `${BASE_URL}/notification`,
  id: modal2Open ? `/${modal2Open}` : '',
  config:{
    enabled: !!modal2Open,
    headers: {
      lang: language,
        }
  }
});



const columns: ColumnsType<DataType> = [
  {
    title: '#',
    dataIndex: 'name',
    key: 'name',
    render: (_: DataType, __: any, index: number) => `#${index+1}`,
   
  },
  {
    title: translate("date"),
    dataIndex: 'created_at',
    key: 'created_at',
        render: (text) => <p>{dayjs(+text).format('DD.MM.YYYY HH:mm')}</p>,
    
  },
  {
    title: translate("name"),
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: translate("description"),
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: translate("actions"),
    dataIndex: "edit",
    // width: 185,
    render: (_, record:any) => (
      <div className="action-buttons" >
  
        <Badge   count={!record.store_notifications?.[0].is_read ? '     ' : null} >

        <Button  style={{width:100, height:30}}  color="primary" variant="filled" onClick={() => {
    
       
          setModal2Open(record.id)
       }} >{translate("read")} </Button>
        </Badge>
      
      </div>
    ),
  }
];

const notificationData = getOneNatification?.status_code === 200 ? getOneNatification?.data : []

  return (
    <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
   
 
      <Modal
      loading={isgetOneNatificationLoading}
        title={notificationData?.title}
        animation="fade"
      style={{ minHeight:100 }}
        centered
        open={!!modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        cancelText={translate("close")}
        okText={translate("ok")}
      >
     
{!!isgetOneNatificationLoading &&  <Spin spinning={isgetOneNatificationLoading}/>}
    
        <p>          { notificationData?.description}</p>
        
      </Modal>
     
  
      <Card bordered={false} style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item>{translate("home")}</Breadcrumb.Item>
          <Breadcrumb.Item>{translate("notifications")}</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={4} style={{ marginTop: '8px', textTransform:"uppercase" }}>{translate("notifications")}</Title>
      </Card>

      <Card bordered={false}>
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <Input
            onChange={(e) => setSearchText(e.target.value)}
              placeholder={translate("search")+"..."}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          
        </Row>

        <Table
          columns={columns}
          dataSource={categoryData?.status_code === 200 ? categoryData?.data : []}

          loading={iscategoryDataLoading}
          rowKey="id"
          onRow={(record:any) => ({
            onClick: () => {
              setModal2Open(record.id); // Handle row click
            },
          })}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: () => translate("paginationData", categoryData?.from, categoryData?.to, categoryData?.total_elements),
          }}
        />
      </Card>
    </div>
  );
};

export default Notifications;
