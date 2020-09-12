export function validate(str){
    var pattern=new RegExp("[`~%@#^=''~@#&——‘”“'*]"); //[]内输入你要过滤的字符，这里是我的
    var rs="";
    for(var i=0;i<this.length;i++){
     rs+=this.substr(i,1).replace(pattern,'');
    }
    return rs;
}