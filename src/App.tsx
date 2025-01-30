
// import { message } from "antd";

import { QueryClient, QueryClientProvider } from "react-query";
import HomePage  from "./pages/Contracts/Contracts";

function App() {
  const queryClient = new QueryClient();
  // const [messageApi, contextHolder] = message.useMessage();




  return (
    <>
     <QueryClientProvider client={queryClient}>
{/* {contextHolder} */}
   <HomePage /> 
  
                </QueryClientProvider>
    </>
  )
}

export default App
