/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState, useEffect, } from 'react';
import { Form, Input, Button, message } from 'antd';
import Logo from "../../assets/images/logos/logo-tr.png";
// import Line from "../../Assets/images/back-line.svg";
// import Icon from '../../Components/Icon';
// import { Router } from 'react-router';
import { useNavigate } from 'react-router';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import translate from '@utils/transaitor';
// import axios from 'axios';
import { BASE_URL } from 'src/consts/variables';
import useUniversalFetch from '@hook/useApi';
// import { useRoutes } from 'react-router';

const Login = () => {
  const language = localStorage.getItem("language") || "uz"
  const {useFetchMutation} = useUniversalFetch()

  const [status, setStatus] = useState<''|'error'|'warning'|undefined>('');
  const navigate = useNavigate()

  const { data: handleSignInData, isSuccess:isSuccessSignin, mutate: handleSignIn, isLoading: isHandleSignInLoading, error: handleSignInError, isError: ishandleSignInError }:any = useFetchMutation({
    url: `${BASE_URL}/auth/store-login`,
    method: 'POST',
    config: { 
      headers: {
    lang:language,
      }
    }
});

useEffect(()=> {  
  const languages = localStorage.getItem("language")
  
  !languages && localStorage.setItem("language", "uz")
},[])


useEffect(()=> {

  if (isSuccessSignin) {
    
    message.success(handleSignInData?.message);
    // Handle your response here. For example, save the auth token:
    localStorage.setItem('authToken', JSON.stringify(handleSignInData?.data?.token?.access_token));
    localStorage.setItem('userData', JSON.stringify(handleSignInData?.data));
  
    navigate('/');
  }
 else if (ishandleSignInError) {
    message.error(handleSignInError?.message);
    setStatus("error")
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [ishandleSignInError, handleSignInData, handleSignInError, isSuccessSignin])

  interface LoginFormValues {
    username: string;
    password: string;
  }

  const onFinish = async (values: LoginFormValues) => {
    try {
      handleSignIn({
        username: values.username,
        password: values.password,
    })
    } catch (error: unknown) {
    console.error((error as Error)?.message);
    
    } 
  };

  return (
    <div className="login-page">
      <div className="login-page-wrapper">
        <div className="leftside">
          <img className='header-logo' src={Logo} alt="Logo" />
        </div>
        <div className="rightside">
            <div className="center">
                <h1>{translate("login_title")}</h1>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <div className="single-item">
                        <p>{translate("login")} <span>*</span></p>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                  required: true,
                                  message:  translate("please_enter", translate("login")),
                                },
                            ]}
                        >
                            <Input placeholder= { translate("entre_input", translate("login"))} status={status} onChange={() => setStatus("")}/>
                        </Form.Item>
        <span className='icon'>

                        <UserOutlined />
        </span>

                    </div>
                    
                    <div className="single-item">
                        <p>{translate("password")} <span>*</span></p>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                  required: true,
                                  message:translate("please_enter", translate("password")),
                                },
                            ]}
                        >
                            <Input.Password
                                type="password"
                                placeholder= { translate("entre_input", translate("password"))}
                                status={status}
                                onChange={() => setStatus("")}
                            />
                        </Form.Item>
                        <span className='icon'>

<KeyOutlined />
</span>
                
                    </div>
                   
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={isHandleSignInLoading}>
                        {translate("login_button")}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
