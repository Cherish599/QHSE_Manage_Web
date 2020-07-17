import request from '../utils/request'

export const qhse_company_tree =() =>{
    return request('/api/qhse_company/tree')
  }

  //获取审核要素
export const query_elementReviewer =(data)=>{
    return request('/api/query_elementReviewer',{
      data
    })
}
//审核人通过
export const pass_elementReviewer =(data)=>{
  return request('/api/pass_elementReviewer',{
    method:'put',
    data
  })
}
export const approval_elementReviewer =(data)=>{
  return request('/api/approval_elementReviewer',{
    method:'put',
    data
  })
}
//不通过
export const no_elementReviewer =(data)=>{
  return request('/api/no_elementReviewer',{
    method:'put',
    data
  })
}
//显示信息
export const show_elementReviewer =(data)=>{
  return request(`/api/show_elementReviewer`),
  data
}