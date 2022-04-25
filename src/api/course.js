import reqest from '@/request/index';


function submitcomment(data) {
  return reqest({
    url: '/comment/submitcomment',
    method: 'get',
    data,
    headers: {
      uid: 1,
      token: {}
    }
  })
}