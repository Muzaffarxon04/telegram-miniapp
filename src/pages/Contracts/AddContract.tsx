/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Drawer, Form, Input, Button, Select, Space, Divider, Typography, InputNumber } from "antd";
import PropTypes from "prop-types";
import { DeleteOutlined } from "@ant-design/icons";
import useUniversalFetch from "@hook/useApi";
import { BASE_URL } from "src/consts/variables";
import PaymentTableModal from "./CaluclatedDataContracts";
// import translations from "src/localization";
import translate from "@utils/transaitor";


const AddSubCategoryDrawer = ({ isVisible, onSave, onCancel, isLoading }: any) => {
  const language = localStorage.getItem("language") || "uz"
  // const translate = (key: string) => translations[language]?.[key] || key;
  const token = JSON.parse(localStorage.getItem("authToken") || '[]')
  const {
    useFetchQuery,
    useFetchMutation
 

  } = useUniversalFetch();
  const { Option } = Select;
  const { Title } = Typography;

  
const {
  data: categoryData,
  isLoading: iscategoryDataLoading,
  // error: categoryDataError,
  // isError: iscategoryDataError,
  // isSuccess: isSuccescategoryData,
} = useFetchQuery({
  queryKey: "client",
  token: token,
  url: `${BASE_URL}/client`,
  config: { 
    headers: {
  lang: language,
    }
  }


});


const {
  data: calculatePaymentCreateData,
  isSuccess: isSuccesscalculatePaymentCreated,
  mutate: calculatePaymentCreate,
  isLoading: iscalculatePaymentCreateLoading,
  // error: calculatePaymentCreateError,
  // isError: iscalculatePaymentCreateError,
}:any = useFetchMutation({
  url: `${BASE_URL}/contract/calculate-payment`,
  method: "POST",
  token: token,
  config: { 
    headers: {
  lang: language,
    }
  }
});



const clientsList = categoryData?.status_code === 200 ? categoryData?.data : [];
const calculatePaymentList = calculatePaymentCreateData?.status_code === 200 ? calculatePaymentCreateData?.data : [];


  const [form] = Form.useForm();
  const [productList, setProductList] = useState<any[]>([{ key: 1 }]); // Start with one product form
  const [totalCost, setTotalCost] = useState(0);


  const handleAddProductField = () => {
    setProductList((prevList) => [...prevList, { key: new Date().getTime() }]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      
      const products = productList.map((product) => ({
        name: values[`productName_${product.key}`],
        unit: values[`unit_${product.key}`],
        quantity: values[`quantity_${product.key}`],
        price: values[`price_${product.key}`],
      }));

      onSave({ ...values, products });
      
    } catch (error) {
      console.error("Validation failed:", error);
    }

  };

  const handleCalculateSubmit = async () => {
    try {
      const values = await form.validateFields();

      
      const products = productList.map((product) => ({
        name: values[`productName_${product.key}`],
        unit: values[`unit_${product.key}`],
        quantity: values[`quantity_${product.key}`],
        price: values[`price_${product.key}`],
      }));

   
      
      
      calculatePaymentCreate({
        "inn": values.inn,
        // "initial_payment_type": "summa",
        initial_payment_percent: Number(values?.percent || 0),
        "initial_payment_amount": Number(values?.initial_payment_amount),
        "start_date": new Date().getTime(),
        "unpaid_month": +values.month,
        "total_amount": totalCost,
        "client": values.client,
        "contract_product":products 
            })

    } catch (error) {
      console.error("Validation failed:", error);
    }

  };
  
  

 
 
  

  // Function to restrict input to numbers only
  const handleNumberInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (!/^\d$/.test(key) && key !== "Backspace") {
      event.preventDefault();
    }
  };

  const handlePasteInput = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = event.clipboardData.getData("Text");
    if (!/^\d+$/.test(pasteData)) {
      event.preventDefault();
    }
  };


  const calculateTotalCost = () => {
    const total = productList.reduce((sum, product) => {
      const quantity = form.getFieldValue(`quantity_${product.key}`) || 0;
      const price = form.getFieldValue(`price_${product.key}`) || 0;
      return sum + quantity * price;
    }, 0);
    setTotalCost(total);
  
    // Update the TOTAL COST field
    form.setFieldsValue({ total_cost: total });
  };
  
  // Trigger calculation when product list changes
  useEffect(() => {
    calculateTotalCost();
  }, [productList]);


  const handleFieldChange = () => {
    calculateTotalCost();
  };



  
  return (
    <Drawer
      open={isVisible}
      onClose={onCancel}
      destroyOnClose
      
      width={1000}
      title={translate("create")}
      footer={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onCancel}>{translate("close")}</Button>
<PaymentTableModal data={calculatePaymentList} isLoading={iscalculatePaymentCreateLoading} isSuccess={isSuccesscalculatePaymentCreated}   onSubmit={handleCalculateSubmit}/>

          <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          {translate("create")}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" >
        <Title level={5}>{translate("client")}</Title>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
        <Form.Item style={{width:"100%"}} name="client" label={translate("client")} rules={[{ required: true, message: translate("pleaseChoose") }]}>
          <Select loading={iscategoryDataLoading}  showSearch placeholder={translate("choose")}  optionFilterProp="children"
    // onChange={(value) => console.log(`selected ${value}`)}
    // onSearch={(val) => console.log('search:', val)}
    filterOption={(input, option:any) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }>
            {clientsList.map((client: any) => (
              <Option key={client?.id} value={client?.id}>{client?.first_name + " " + client?.last_name }</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
  style={{ width: "100%" }}
  name="inn"
  label={translate("inn")}
  rules={[
    { required: true, message: translate("please_enter", translate("inn"))},
    {
      validator: (_, value) => {
        if (!value) {
          return Promise.resolve();
        }
        const innRegex = /^[0-9]{9,14}$/;
        if (!innRegex.test(value)) {
          return Promise.reject(
            new Error(translate("innFormat"))
          );
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <Input
    placeholder={translate("entre_input", translate("inn"))}
    maxLength={14} // Maksimal uzunlikni cheklash
    onKeyPress={(e) => {
      // Faqat raqamlar kiritilishini ta'minlash
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    }}
  />
</Form.Item>


</div>
        <Divider />

        <Title level={5}>{translate("payment")} </Title>
        {/* <Title level={5}>Оплата : {priceFormatter.format(totalCost)}</Title> */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>


        <Form.Item
  style={{ width: "100%" }}
  name="initial_payment_amount"
  label={translate("inital_cost")}
  rules={[{ required: true, message: translate("please_enter", translate("inital_cost")) }]}
>
  <InputNumber
    placeholder={translate("entre_input", translate("total_cost"))}
    type="text"
    suffix={translate("sum")}
    style={{ width: "100%" }}

    controls={false}
    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
    onKeyPress={handleNumberInput}
    onPaste={handlePasteInput}
    onChange={(value:any) => {
      const totalCost = form.getFieldValue("total_cost");
      if (totalCost > 0) {
        const percent = ((value / totalCost) * 100).toFixed(2); // Calculate percent
        form.setFieldsValue({ percent }); // Update percent field
      }
    }}
  />
</Form.Item>

<Form.Item
  style={{ width: "100%" }}
  name="percent"
  label={translate("percent")}
  
  rules={[
    { required: true, message: translate("please_enter", translate("percent")) },
    {
      pattern: /^\d{1,3}(\.\d{1,2})?$/,
      message: translate("percentFormat"),
    },
  ]}
>
  <InputNumber
    placeholder={translate("entre_input", translate("percent"))}
    type="text"
    controls={false}
    suffix="%"
style={{ width: "100%" }}

    onChange={(value:any) => {
      const totalCost = form.getFieldValue("total_cost");
      if (totalCost > 0) {
        const initialCost = ((totalCost * value) / 100).toFixed(2); // Calculate initial cost
        form.setFieldsValue({ initial_payment_amount: initialCost }); // Update initial cost field
      }
    }}
  />
</Form.Item>
  <Form.Item
    style={{ width: "100%" }}
    name="total_cost"
    label={translate("total_cost")}
    rules={[{ required: true, message:translate("please_enter", translate("total_cost")) }]}
  >
    <InputNumber
    suffix={translate("sum")}
style={{ width: "100%" }}
     formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
     disabled
     controls={false}
     
      placeholder={translate("entre_input", translate("total_cost"))}
      type="text"
    
    />
  </Form.Item>
 
  <Form.Item
    style={{ width: "100%" }}
    name="month"
    label={translate("total_months")}
    rules={[
      { required: true, message: translate("please_enter", translate("total_months")) },
      {
        pattern: /^\d+$/, // Validates only positive integers
        message: translate("monthFormat"),
      }
    ]}
  >
    <Input
    suffix={translate("month")}

      placeholder={translate("entre_input", translate("month"))}
      type="text"
      onChange={(e) => {
        e.target.value = e.target.value.replace(/\D/g, "");
      }}
    />
  </Form.Item>
</div>


        <Divider />

        <Title level={5}>{translate("products")}</Title>
        {productList.map((product) => (
          <Space key={product.key} size="large" style={{ display: "flex", marginBottom: "16px", width:"100%" }}>
            <Form.Item
            style={{width:500}}
              name={`productName_${product.key}`}
              label={translate("name")}
              rules={[{ required: true, message: translate("please_enter", translate("name"))}]}
            >
              <Input placeholder={translate("entre_input", translate("name"))} />
            </Form.Item>
            <Form.Item
            style={{width:100}}

              name={`unit_${product.key}`}
              label={translate("unit")}
              rules={[{ required: true, message:translate("please_enter", translate("unit")) }]}
            >
              <Select placeholder={translate("entre_input", translate("choose"))}>
                <Option value="pcs">{translate("pcs")}</Option>
                {/* <Option value="Ком-т">Ком-т</Option> */}
              </Select>
            </Form.Item>
            <Form.Item
            
              name={`quantity_${product.key}`}
              label={translate("quantity")}
              rules={[{ required: true, message: translate("please_enter", translate("quantity"))}]}
            >
              <InputNumber
                placeholder={translate("entre_input", translate("quantity"))}
                min={1}
                style={{ width: "100%" }}
                controls={false}
                onChange={handleFieldChange}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value: any) => value!.replace(/\$\s?|(,*)/g, "")}
                onKeyPress={handleNumberInput}
                onPaste={handlePasteInput}
              />
            </Form.Item>
            <Form.Item
  name={`price_${product.key}`}
  label={translate("price")}
  rules={[{ required: true, message: translate("please_enter", translate("price"))}]}
>
  <InputNumber
    placeholder={translate("entre_input", translate("price"))}
    min={0}
    style={{ width: "100%" }}
    controls={false}
    onChange={handleFieldChange}
    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
    parser={(value: any) => value!.replace(/\s?UZS|(,*)/g, "")}
    onKeyPress={handleNumberInput}
    onPaste={handlePasteInput}
  />
</Form.Item>
<Button color="danger" onClick={() => {
    if (productList.length > 1) {
        setProductList((productList) => 

            productList.filter((item) => item.key !== product.key))
    }
   
}
 }>
    <DeleteOutlined/>
</Button>
          </Space>
        ))}
        <Space style={{ display: "flex", justifyContent: "flex-end", width:"100%" }}>


        <Button type="primary" onClick={handleAddProductField} loading={isLoading}>
      {translate("add_goods")}
        </Button>
        </Space>

   

      </Form>
    </Drawer>
  );
};

AddSubCategoryDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default AddSubCategoryDrawer;
