import React from 'react';
import { Table, Input, Tag, Breadcrumb, Typography, Card, Row, Col, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import translate from '@utils/transaitor';
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


const data: DataType[] = [
  { key: '1', id: 1, firstName: 'Islom', lastName: 'Rozmuhamedov', phone: '+998901234567', birthDate: '1990-01-01', status: 'Активно' },
  { key: '2', id: 2, firstName: 'Ali', lastName: 'Karimov', phone: '+998912345678', birthDate: '1985-05-12', status: 'Неактивно' },
  { key: '3', id: 3, firstName: 'Murod', lastName: 'Tursunov', phone: '+998933456789', birthDate: '1992-08-23', status: 'Активно' },
  { key: '4', id: 4, firstName: 'Aziza', lastName: 'Ahmedova', phone: '+998944567890', birthDate: '1988-03-19', status: 'Неактивно' },
  { key: '5', id: 5, firstName: 'Jasur', lastName: 'Nabiyev', phone: '+998955678901', birthDate: '1995-07-30', status: 'Активно' },
  { key: '6', id: 6, firstName: 'Dilnoza', lastName: 'Shukurova', phone: '+998966789012', birthDate: '1990-11-15', status: 'Неактивно' },
  { key: '7', id: 7, firstName: 'Kamol', lastName: 'Mirzaev', phone: '+998977890123', birthDate: '1987-02-08', status: 'Активно' },
  { key: '8', id: 8, firstName: 'Nargiza', lastName: 'Ismailova', phone: '+998988901234', birthDate: '1993-12-25', status: 'Неактивно' },
  { key: '9', id: 9, firstName: 'Otabek', lastName: 'Kurbanov', phone: '+998909012345', birthDate: '1989-06-18', status: 'Активно' },
  { key: '10', id: 10, firstName: 'Gulnora', lastName: 'Sadullaeva', phone: '+998931012345', birthDate: '1991-09-09', status: 'Неактивно' },
];

const GenesisContracts: React.FC = () => {
  // const language = localStorage.getItem("language") || "uz"
  // const translate = (key: string) => translations[language]?.[key] || key;

  const columns: ColumnsType<DataType> = [
    {
      title: translate("id"),
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`,
    },
    {
      title: translate("firstName"),
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: translate("lastName"),
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title:translate("phone"),
      dataIndex: 'phone',
      render: (id) => (
        <a href={`tel:${id}`}>{id}</a>
      ),      
      key: 'phone',
    },
    {
      title: translate("birthday"),
      dataIndex: 'birthDate',
      key: 'birthDate',
    },
    {
      title: translate("status"),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Активно' ? 'green' : 'volcano'}>{status}</Tag>
      ),
    },
  ];
  

  return (
    <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item>{translate("home")}</Breadcrumb.Item>
          <Breadcrumb.Item>{translate("genisis_contracts")}</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={4} style={{ marginTop: '8px', textTransform:"uppercase" }}>{translate("genisis_contracts")}</Title>
      </Card>

      <Card bordered={false}>
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <Input
              placeholder={translate("search")}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col span={12}>
            <DatePicker placeholder={translate("date")} style={{ width: '100%' }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => translate("paginationData2", data.length, total) ,
            
          }}
        />
      </Card>
    </div>
  );
};

export default GenesisContracts;
