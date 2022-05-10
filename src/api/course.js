import reqest from '@/request/index';


export function submitcomment(data) {
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


export function StaffNotice(param) {
  return request({
    url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
    header: {
      token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjUwODY4OTY2fQ=='
    },
  })
}
