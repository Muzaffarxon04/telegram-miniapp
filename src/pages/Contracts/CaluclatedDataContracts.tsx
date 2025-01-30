/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect } from "react";
import { Modal, Table, Tag, Button } from "antd";
import dayjs from "dayjs";
import translations from "src/localization";

const priceFormatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "UZS", // Replace with the desired currency, e.g., "USD", "EUR"
    minimumFractionDigits: 0,
  });
  
  

function PaymentTableModal({ data: modalData, onSubmit, isLoading, isSuccess }: any) {
    const language = localStorage.getItem("language") || "uz";
    const translate = (key: string) => translations[language]?.[key] || key;
    const [isModalVisible, setIsModalVisible] = useState(false);


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    useEffect(()=> {
    if (isSuccess) {
    
      
        showModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalData, isSuccess])

    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            align: "center" as const,
        },
        {
            title:translate("fromDate"),
            dataIndex: "date",
            key: "date",
            render: (text: any) => <p>{dayjs(+text).format("DD.MM.YYYY")}</p>,
            align: "center",
        },
        {
            title: translate("toDate"),
            dataIndex: "date",
            key: "date",
            render: (text: any) => <p>{dayjs(+text).format("DD.MM.YYYY")}</p>,

            align: "center",
        },
        {
            title: translate("payment_type"),
            dataIndex: "method",
            key: "method",
            align: "center",
        },
        {
            title: translate("status"),
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status: any) => (
                <Tag color={status === "unpaid" ? "red" : "green"}>{status}</Tag>
            ),
        },
        {
            title:translate("monthlyFee"),
            dataIndex: "price",
            key: "price",
            render: (text: any) => <p>{priceFormatter.format(text)}</p>,
            align: "right" as const,
        },
    ];




    return (
        <>
            <Button loading={isLoading} type="primary" color="primary" onClick={onSubmit}>
        {translate("open_table")}
            </Button>
            <Modal
            
                title={translate("payment_history")}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                      {translate("close")}
                    </Button>,
                ]}
                width={800}
            >
                <Table
                scroll={{ y: 300 }}
                    columns={columns as any}
                    dataSource={modalData?.payment_data || []}
                    pagination={false}
                    bordered
                   />
            </Modal>
        </>
    );
}

export default PaymentTableModal;
