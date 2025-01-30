/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useUniversalFetch from "@hook/useApi";
import { BASE_URL } from "src/consts/variables";
import AddModal from "@/Modal/AddClientModal";
import { Button, Rate, Input, Typography, Space } from 'antd';
import { Table, Breadcrumb, Card, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import translate from "@utils/transaitor";
import type { TableProps } from 'antd';
import dayjs from "dayjs";
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
  columns:any,
}

// const { confirm } = Modal;
export const SubCategoriesPage = ({messageApi}:any) => {
    const language = localStorage.getItem("language") || "uz"
  // const translate = (key: string) => translations[language]?.[key] || key;
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setIsVisible] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

  const token = JSON.parse(localStorage.getItem("authToken") || '[]')

  
const {
  useFetchQuery,
 useFetchMutation,
 usePatchMutation,
//  useDeleteMutation
} = useUniversalFetch();
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
  id: `?page=${currentPage}&page_size=${pageSize}&search=${searchText}`,
  config: { 
    headers: {
  lang: language,
    }
  }

});



const {
  data: categoryCreateData,
  isSuccess: isSuccessCreated,
  mutate: categoryCreate,
  isLoading: iscategoryCreateLoading,
  error: categoryCreateError,
  // isError: isEmployeeCreateError,
}:any = useFetchMutation({
  url: `${BASE_URL}/client`,
  method: "POST",
  token: token,
  config: { 
    headers: {
  lang: language,
    }
  }
});

const {
  data: categoryUpdateData,
  isSuccess: isSuccessUpdated,
  mutate: categoryUpdate,
  // isLoading: iscategoryUpdateLoading,
  // error: employeeUpdateError,
  // isError: isEmployeeUpdateError,
}:any = usePatchMutation({
  url: `${BASE_URL}/client`,
  token: token,
  config: { 
    headers: {
  lang: language,
    }
  }
});

// const {
//   data: categoryDeleteData,
//   isSuccess: isSuccessDelete,
//   mutate: categoryDelete,
//   // isLoading: iscategoryDeleteLoading,
//   // error: categoryDeleteError,
//   // isError: iscategoryDeleteError,
// } = useDeleteMutation({
//   url: `${BASE_URL}/client`,
//   token: token,
// });

// const showDeleteConfirm = (category:any) => {

  
//   confirm({
//     title: "Are you sure delete this list ?",
//     content: "Remember, you can't recover the information you've deleted!",
//     okText: "Yes",
//     okType: "danger",
//     cancelText: "No",
//     className: "delete-pop-up",
//     onOk() {
//       categoryDelete({
//         id: category.uuid,
//       });
//       // setDeleteId(todoId)
//     },
//     onCancel() {
//       console.log("Cancel");
//     },
//   });
// };





useEffect(()=> {
if (isSuccessCreated) {
  messageApi.open({
    type: 'success',
    content:categoryCreateData?.message,
  });
  
  setIsVisible(false)

}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [isSuccessCreated, categoryCreateData])

useEffect(()=> {
  if (isSuccessUpdated ) {
    messageApi.open({
      type: 'success',
      content: categoryUpdateData?.message 
    });
    
    setIsVisible(false)
  
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isSuccessUpdated, categoryUpdateData])
  

// useEffect(()=> {
//   if (isSuccessDelete) {
//     messageApi.open({
//       type: 'success',
//       content: categoryDeleteData?.message ,
//     });
    
//     setIsVisible(false)
  
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isSuccessDelete, categoryDeleteData])
  

useEffect(()=> {
if (categoryCreateError) {
  messageApi.open({
    type: 'error',
    content: categoryCreateData?.message,
  });
  setIsVisible(false)
}
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [categoryCreateError, categoryCreateData])




const columns: TableProps<DataType>['columns'] = [
  {
    title: translate("fullName"),
    dataIndex: 'first_name',
    key: 'name',
    render: (_, record:any) => (
      <p>{`${record.first_name} ${record.last_name} ${record.second_name}`}</p>
    ),
  },
  
  {
    title: translate("passportSeries"),
    dataIndex: 'passport',
    key: 'path',
    render: (text) => <p>{text}</p>,
  },
  {
    title: translate("pinfl"),
    dataIndex: 'pinfl',
    key: 'path',
    render: (text) => <p>{text}</p>,
  },
  {
    title: translate("passportExpiryDate"),
    dataIndex: 'passport_expire_date',
    key: 'path',
    render: (text) => <p>{dayjs(+text).format('DD.MM.YYYY')}</p>,

  },
  {
    title: translate("birthday"),
    dataIndex: 'birthday',
    key: 'path',
    render: (text) => <p>{dayjs(+text).format('DD.MM.YYYY')}</p>,
  },
  {
    title: translate("phone"),
    dataIndex: 'phone',
    key: 'path',
    render: (text) => <a href={`tel:${text}`}>{text}</a>,
  },
  {
    title:translate("address"),
    dataIndex: 'address',
    key: 'path',
    // render: (text) => <a href={`tel:${text}`}>{text}</a>,
  },
  {
    title: translate("rating"),
    dataIndex: 'rating',
    key: 'path',
    render: (text) => <>   <Rate  value={text} /></>
  },
  {
    title: translate("actions"),
    dataIndex: "edit",
    width: 85,
    render: (_, record:any) => (
      <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Button  variant="outlined" href={`/clients/${record.id}`} >
              <EyeOutlined />
              </Button>
        <Button variant="outlined" onClick={() => {
          setIsVisible(true)
          setEditData(record)}} >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="green" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

        </Button>
   
      
      </Space>
    ),
  }
 
  
];


const handleSearch = (e:any) => {
  const value = e.target.value.toLowerCase();
  setSearchText(value);

  
};

  return(
  <>


  {/* {contextHolder} */}

    <AddModal 
    isLoading={iscategoryCreateLoading}
    newsData={editData}
    onCancel={()=> {
      setIsVisible(false)
     setEditData(null)

    }} isVisible={visible} onSave={(value)=> {
      console.log(value);
      
    if (editData) {
      categoryUpdate(
        {
          id:editData?.id,
          data:{
        "first_name": value.first_name,
  "last_name": value.last_name,
  "second_name": value.second_name,
  passport_given_by: value.passport_given_by,
  "passport": value.passport,
  "pinfl": value.pinfl,
  "birthday":
   new Date(value.birthday || null).getTime(),
  "phone":  value.phone,
  "address": value.address,
  "passport_expire_date":  new Date(value.passport_expire_date || null).getTime()

        
            }
    })
    }else{

      categoryCreate({
     
"first_name": value.first_name,
  "last_name": value.last_name,
  "second_name": value.second_name,
  "passport": value.passport,
  "pinfl": value.pinfl,
  passport_given_by: value.passport_given_by,
  "birthday":
   new Date(value.birthday).getTime(),
  "phone":  value.phone,
  "address": value.address,
  "passport_expire_date":  new Date(value.passport_expire_date).getTime()

        })
      }
     
      
    }}/>

<div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Card bordered={false} style={{ marginBottom: '16px',  }}>
      <Space  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

      <div>
      <Breadcrumb>
          <Breadcrumb.Item>   {translate("home")} </Breadcrumb.Item>
          <Breadcrumb.Item>{translate("clients")}</Breadcrumb.Item>
        </Breadcrumb>
        <Typography.Title level={4} style={{ marginTop: '8px', textTransform:"uppercase" }}>{translate("clients")}</Typography.Title>


      </div>
       <Button color="primary" variant="solid" onClick={()=> {
         setEditData(null)
         setIsVisible(true)
        }}>{translate("create")}  </Button>
        </Space>
      </Card>

      <Card bordered={false}>
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <Input
            onChange={handleSearch}
              placeholder={translate("search")}
              prefix={<SearchOutlined />}
              allowClear
            />
          </Col>
         
        </Row>

        <Table
        loading={iscategoryDataLoading}
          columns={columns}
          dataSource={categoryData?.status_code === 200 ? categoryData?.data : []}
        
          pagination={{
            pageSizeOptions:['10', '20', '50', '100', '500'],
            pageSize: pageSize,
            current: currentPage,
            showSizeChanger: true,
            onShowSizeChange(_, size) {
              setPageSize(size);
            },

            onChange: (page) => {
              setCurrentPage(page); // Update current page state
            },
            showTotal: () => translate("paginationData", categoryData?.from, categoryData?.to, categoryData?.total_elements)
          }}
        />
      </Card>
    </div>

   </>
);

}