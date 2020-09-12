import instance from '@/request/request'
/*
*   验证码接口数据
*/
export function GetSms(){
    //axios请求处理
    return  instance.request({
        method: 'post',
        url: '/getSms/',
        data: {}
});
}