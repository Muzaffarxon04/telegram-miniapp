/* eslint-disable @typescript-eslint/no-explicit-any */
import useUniversalFetch from "@hook/useApi";
import { BASE_URL } from "src/consts/variables";
import { Card, Table, Typography, Layout, Breadcrumb, Skeleton, Alert } from "antd";
import { UserOutlined, ShoppingOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import PaymentList from "./PaymentTable";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import translate from "@utils/transaitor";
const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface DataType {
  key: string;
  number: number;
  name: string;
  unit: string;
  quantity: number;
  price: string;
}

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "UZS",
  minimumFractionDigits: 0,
});



export default function ContractInner() {
  const language = localStorage.getItem("language") || "uz";
  // const translate = (key: string) => translations[language]?.[key] || key;
  const { id } = useParams(); // Get the 'id' from the URL
  const token = JSON.parse(localStorage.getItem("authToken") || "[]");

  const columns: ColumnsType<DataType> = [
    {
      title: "#",
      dataIndex: "number",
      key: "number",
      width: 70,
      render: (_: any, _s: any, index: number) => `#${index + 1}`,
    },
    {
      title: translate("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: translate("unit"),
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: translate("quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title:translate("price"),
      dataIndex: "price",
      key: "price",
      render: (text: any) => <p>{priceFormatter.format(text)}</p>,
    },
  ];

  const { useFetchQuery } = useUniversalFetch();
  const {
    data: categoryData,
    isLoading: isCategoryDataLoading,
    isError: isCategoryDataError,
  } = useFetchQuery({
    queryKey: "contract",
    token: token,
    url: `${BASE_URL}/contract`,
    id: id && `/${id}`,
    config: { 
      headers: {
    lang: language,
      }
    }
  });



  const contractData = categoryData?.status_code === 200 ? categoryData?.data : null;
  const clientData = contractData?.client;
  const productData = contractData?.contract_products;
  const paymentData = contractData?.payment_list;

  return (
    <Layout>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={4} style={{ margin: 0, textTransform: "uppercase" }}>
          {translate("contractInner")}
        </Title>
        <Breadcrumb
          items={[
            { title: translate("home") },
            { title: translate("contracts") },
            { title: id ? translate("contractInner") : translate("contractInner") },
          ]}
        />
      </Header>
      <Content style={{ padding: "24px" }}>
        {isCategoryDataLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : isCategoryDataError ? (
          <Alert message={categoryData?.message ? categoryData?.message : "Ошибка загрузки данных договора"} type="error" showIcon />
        ) : (
          <>
            <div style={{ display: "flex", gap: "24px" }}>
              {/* Client Information */}
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <UserOutlined />
                    <span>{translate("client_info")}</span>
                  </div>
                }
                style={{ flex: "0 0 30%", background: "#fff" }}
              >
                <div>
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary">{translate("fullName")}:</Text>
                    <div>{clientData?.first_name} {clientData?.last_name} {clientData?.second_name}</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary">{translate("birthday")}:</Text>
                    <div>{dayjs(+clientData?.birthday).format("DD.MM.YYYY")}</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary">{translate("passportSeries")}:</Text>
                    <div>{clientData?.passport}</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary">{translate("pinfl")}:</Text>
                    <div>{clientData?.pinfl}</div>
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary">{translate("phone")}:</Text>
                    <div>{clientData?.phone}</div>
                  </div>
                  <div>
                    <Text type="secondary">{translate("address")}:</Text>
                    <div>{clientData?.address}</div>
                  </div>
                </div>
              </Card>

              {/* Product Information */}
              <Card
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShoppingOutlined />
                    <span>{translate("products")}</span>
                  </div>
                }
                style={{ flex: "1", background: "#fff" }}
              >
                <Table
                  columns={columns}
                  dataSource={productData}
                  pagination={false}
                  bordered
                  rowKey={(record:any) => record.key || record.id}
                />
              </Card>
            </div>

            {/* Payment Information */}
            <PaymentList secondData={contractData} data={paymentData?.payment_data || []} />
          </>
        )}
      </Content>
    </Layout>
  );
}
