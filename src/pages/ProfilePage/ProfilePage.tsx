/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Tabs, Form, Input, Layout, Typography, Tag, Table, Skeleton } from "antd";
import useUniversalFetch from "@hook/useApi";
import { BASE_URL } from "src/consts/variables";
import dayjs from "dayjs";
import logo from "@assets/images/logos/logo.jpg";
import translate from "@utils/transaitor";
const { Title, Text } = Typography;
const { Content } = Layout;

const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "UZS", // Replace with the desired currency, e.g., "USD", "EUR"
  minimumFractionDigits: 0,
});

export default function ProfilePage() {
  const language = localStorage.getItem("language") || "uz";
  // const translate = (key: string) => translations[language]?.[key] || key;
  const token = JSON.parse(localStorage.getItem("authToken") || "[]");

  const { useFetchQuery } = useUniversalFetch();
  const { data: categoryData, isLoading: isCategoryDataLoading } = useFetchQuery({
    queryKey: "store/find-self-info",
    token: token,
    url: `${BASE_URL}/store/find-self-info`,
    config: { 
      headers: {
    lang: language,
      }
    }
  });

  const userInfo = categoryData?.status_code === 200 ? categoryData?.data : null;
  const paymentInfo = categoryData?.status_code === 200 ? categoryData?.data?.payments : [];

  const paymentColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: translate("date"),
      dataIndex: "date",
      key: "date",
    },
    {
      title:translate("payment_type"),
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title:translate("summa"),
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: translate("status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Активно" ? "green" : "volcano"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <div
          style={{
            display: "flex",
            gap: "24px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* Карточка профиля */}
          <Card
            style={{
              width: "320px",
              textAlign: "center",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isCategoryDataLoading ? (
              <Skeleton.Avatar active size={120} shape="circle" />
            ) : (
              <img
                src={logo}
                alt="Профиль"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                }}
              />
            )}
            <Skeleton
              loading={isCategoryDataLoading}
              title
              paragraph={false}
              active
            >
              <Title level={4} style={{ margin: 0 }}>
                {userInfo?.username}
              </Title>
              <Text type="secondary">
                {userInfo?.role ? translate("admin") : userInfo?.role}
              </Text>
            </Skeleton>
          </Card>

          {/* Карточка с подробностями */}
          <Card style={{ flex: 1 }}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab={translate("personal_info")} key="1">
                {isCategoryDataLoading ? (
                  <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                  <Form
                    layout="vertical"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "24px",
                    }}
                  >
                    <Form.Item label={translate("company_name")}>
                      <Input
                        placeholder={userInfo?.name}
                        value={userInfo?.name}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("created_at")}>
                      <Input
                        placeholder={dayjs(+userInfo?.created_at).format(
                          "DD.MM.YYYY"
                        )}
                        value={dayjs(+userInfo?.created_at).format(
                          "DD.MM.YYYY"
                        )}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("owner")}>
                      <Input
                        placeholder={userInfo?.director}
                        value={userInfo?.director}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("manager")}>
                      <Input
                        placeholder={userInfo?.manager}
                        value={userInfo?.manager}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("responsble_person")}>
                      <Input
                        placeholder={userInfo?.responsible_person}
                        value={userInfo?.responsible_person}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label={translate("address")}>
                      <Input
                        placeholder={userInfo?.address}
                        value={userInfo?.address}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label={translate("phone")}>
                      <Input
                        placeholder={userInfo?.phone}
                        value={userInfo?.phone}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label={translate("extra_phone")}>
                      <Input
                        placeholder={userInfo?.second_phone}
                        value={userInfo?.second_phone}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("pay_date")}>
                      <Input
                        placeholder={userInfo?.payment_day}
                        value={userInfo?.payment_day}
                        disabled
                      />
                    </Form.Item>

                    <Form.Item label={translate("monthlyFee")}>
                      <Input
                        placeholder={priceFormatter.format(userInfo?.monthly_payment)}
                        value={priceFormatter.format(userInfo?.monthly_payment)}
                        
                        disabled
                      />
                    </Form.Item>
                  </Form>
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab={translate("payment_history")}key="2">
                {isCategoryDataLoading ? (
                  <Skeleton active paragraph={{ rows: 5 }} />
                ) : (
                  <Table
                    columns={paymentColumns}
                    dataSource={paymentInfo}
                    pagination={false}
                    rowKey={(record: any) => record.key}
                    bordered
                  />
                )}
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
