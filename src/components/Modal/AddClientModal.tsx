/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Input, Button, Drawer, Form, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
// import translations from 'src/localization';
import translate from '@utils/transaitor';
const AddSubCategoryDrawer = ({ isVisible, onSave, onCancel, isLoading, newsData }: any) => {

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
    if (newsData && isVisible) {
      form.setFieldsValue(
        newsData
          ? {
              first_name: newsData?.first_name || '',
              last_name: newsData?.last_name || '',
              second_name: newsData?.second_name || '',
              passport: newsData?.passport || '',
              pinfl: newsData?.pinfl || '',
              passport_given_by: newsData?.passport_given_by || '',
              passport_expire_date: newsData?.passport_expire_date ? dayjs(+newsData?.passport_expire_date) : null,
              birthday: newsData?.birthday ? dayjs(+newsData?.birthday) : null,
              phone: newsData?.phone || '',
              address: newsData?.address || '',
            }
          : {}
      );
    }
  }, [newsData, isVisible, form]);



  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
    } catch (error) {
      console.error(`Validation failed: ${error}`);
    }
  };


  const handleInputChange = (e:any) => {
    
    const { value } = e.target;
    e.target.value = value.toUpperCase();
    form.setFieldValue("passport", e.target.value );
  };

  return (
    <Drawer
      open={isVisible}
      onClose={handleCancel}
      destroyOnClose
      width={500}
      title={newsData?.id ? translate('editClient') :  translate('addClient')}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={handleCancel} type="primary" style={{ marginRight: 8 }} ghost>
            {translate('cancel')}
          </Button>
          <Button onClick={handleSubmit} type="primary" loading={isLoading} ghost>
            {translate('save')}
          </Button>
        </div>
      }
    >
      <div className="form-wrapper">
        <Form form={form} layout="vertical">
          <Form.Item
            name={"first_name"}
            label={translate('firstName')}
            rules={[{ required: true, message: translate("please_enter", translate("firstName")) }]}
          >
            <Input placeholder={translate("entre_input", translate("firstName"))} />
          </Form.Item>
          <Form.Item
            name="last_name"
            label={translate('lastName')}
            rules={[{ required: true, message: translate("please_enter", translate("lastName")) }]}
          >
            <Input placeholder={translate("entre_input", translate("lastName"))}/>
          </Form.Item>
          <Form.Item
            name="second_name"
            label={translate("middleName")}
            rules={[{ required: true, message: translate("please_enter", translate("middleName")) }]}
          >
            <Input placeholder={translate("entre_input", translate("middleName"))} />
          </Form.Item>

          <Form.Item
            name="passport"
            label={translate('passportSeries')}
            rules={[
              { required: true, message:translate("entre_input", translate("passportSeries"))},
              { pattern: /^[A-Z]{2}\d{7}$/, message: translate("passportFormat")  },
            ]}
          >
            <Input placeholder={translate("entre_input", translate("passportSeries"))}onChange={handleInputChange} />
          </Form.Item>

          <Form.Item
            name="pinfl"
            label={translate("pinfl")}
            rules={[
              { required: true, message: translate("please_enter", translate("passportSeries")) },
              { pattern: /^\d{14}$/, message: translate("pinflFormat") },
            ]}
          >
            <Input placeholder={translate("entre_input", translate("pinfl"))} />
          </Form.Item>
          <Form.Item
            name="passport_given_by"
            label={translate('passport_given_by')}
            rules={[{ required: true, message: translate("please_enter", translate("passport_given_by")) }]}
          >
            <Input placeholder={translate("entre_input", translate("passport_given_by"))} />
          </Form.Item>
          <Form.Item
            name="passport_expire_date"
            label={translate('passport_expire_date')}
            rules={[{ required: true, message:translate("please_enter", translate("passport_expire_date")) }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder={translate("entre_input", translate("passport_expire_date"))} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="birthday"
            label={translate('birthday')}
            rules={[{ required: true, message: translate("please_enter", translate("birthday")) }]}
          >
            <DatePicker format="DD/MM/YYYY" placeholder={translate("entre_input", translate("birthday"))} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={translate('phone')}  
            rules={[
              { required: true, message:translate("please_enter", translate("phone")) },
              { pattern: /^\+998\d{9}$/, message: translate("phoneFormat") },
            ]}
          >
            <Input placeholder={translate("entre_input", translate("phone"))} />
          </Form.Item>
          <Form.Item
            name="address"
            label={translate('address')}
            rules={[{ required: true, message: translate("please_enter", translate("birthday")) }]}
          >
            <Input.TextArea placeholder={translate("entre_input", translate("address"))} />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

AddSubCategoryDrawer.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  newsData: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default AddSubCategoryDrawer;
