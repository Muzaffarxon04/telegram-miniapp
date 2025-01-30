/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Card, Table, Tag } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import translations from 'src/localization';
const priceFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "UZS", // Replace with the desired currency, e.g., "USD", "EUR"
  minimumFractionDigits: 0,
});


interface DataType {
  key: string;
  number: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  status: string;
  monthlyPayment: string;
}





interface PaymentListProps {
  data: DataType[];
  secondData: any
}

const PaymentList: React.FC<PaymentListProps> = ({ data, secondData }) => {
const language = localStorage.getItem("language") || "uz"
const translate = (key: string) => translations[language]?.[key] || key;

  const columns: ColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'number',
      width: 70,
    },
    {
      title: translate("fromDate"),
      dataIndex: 'date',
      render: (text: any) => <p>{dayjs(+text).format('DD.MM.YYYY')}</p>,  
      key: 'startDate',
    },
    {
      title: translate("toDate"),
      dataIndex: 'date',
      render: (text: any) => <p>{dayjs(+text).format('DD.MM.YYYY')}</p>,  
      key: 'endDate',
    },
    {
      title: translate("payment_type"),
      dataIndex: 'method',
      key: 'paymentMethod',
    },
    {
      title: translate("status"), 
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === "paid" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: translate("monthlyFee"),
      dataIndex: 'price',
      key: 'monthlyPayment',
      render: (text: any) => <p>{priceFormatter.format(text)}</p>,
      align: 'right' as const,
    },
  ];
  return (
    <Card
    style={{ marginTop: 20 }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8}}>
          <UnorderedListOutlined />
          <span>{translate("list")}</span>
        </div>
      }
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <b>{translate("fee")}:</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                 {priceFormatter.format(secondData?.duty_amount)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                 <b> {translate("payed")}:</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                {priceFormatter.format(secondData?.paid_amount)}

                </Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                 <b> {translate("total")}:</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                {priceFormatter.format(secondData?.total_amount)}

                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </Card>
  );
};

export default PaymentList;
