/* 

工具函数

*/

//密码正则
export function pwdReg(value){
    const reg=/^[\w_-]{3,6}$/;
    return reg.test(value);
}

//VIP页面
    //真实姓名正则
    export function realName(value){
      const regName= /^(([a-zA-Z+\.?\·?a-zA-Z+]{2,6}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{2,6}$))/;
      return regName.test(value);
    }
    //卡号正则（只能是数字）
    export function VipNum(value){
      const regVipNum=/^\d{6}$/;
      return regVipNum.test(value);
    }

    //身份证
    export function IdNum(value){
      const regId=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      return regId.test(value)
    }
    //手机号正则
    export function telNum(value){
      const regTel=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
      return regTel.test(value)
    }
    //座机正则  如：000-00000000
    //区号：以数字0开始，并跟随2-3个数字‘
    // 分隔符：以’-‘代替，便于书面的理解；
    //具体的号码：大部分地区的号码是7-8位数字组成；
    export function zuojiNum(value){
      const regZuo=/0\d{2,3}-\d{7,8}/;
      return regZuo.test(value)
    }

    //邮箱正则
    export function EmailNum(value){
      const regEmail=/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      return regEmail.test(value)
    }
    //详细地址正则
    export function HomeAddress(value){
      const regAddress=/^(([a-zA-Z+\.?\·?a-zA-Z+]{6,30}$)|([\u4e00-\u9fa5+\·?\u4e00-\u9fa5+]{6,30}$))/;
      return regAddress.test(value)
    }
    //邮政编码正则
    export function Emailcode(value){
      const regemailCode= /^[1-9][0-9]{5}$/
      return regemailCode.test(value)
    }
//--------------


   