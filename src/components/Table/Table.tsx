/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Table } from 'antd';



const TableComponent: React.FC<any> = ({data, columns, loading}) => <Table  loading={loading} columns={columns}   pagination={{ pageSize: 13}} dataSource={data || []}/>;

export default TableComponent;