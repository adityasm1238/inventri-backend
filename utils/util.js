exports.getDateString = (date_ob)=>{
    let d = ("0" + date_ob.getDate()).slice(-2);
    let m = ("0" + (date_ob.getMonth() + 1)).slice(-2); 
    let y = date_ob.getFullYear();  
    return y + "-" + m + "-" + d;
};

exports.getFirstDayOfYear = (date_ob)=>{
    let y = date_ob.getFullYear();
    return  y+"-01-01";  
}

exports.getFirstDayOfMonth = (date_ob)=>{
   
    let m = ("0" + (date_ob.getMonth() + 1)).slice(-2); 
    let y = date_ob.getFullYear();  
    return y + "-" + m + "-01";
};

exports.isDateEqual = (date,x)=>{
  return new Date(x.date)>= new Date(date+"T00:00:00.000Z");
};

exports.getMonth = (sale) =>{
    return new Date(sale.date).getMonth();
}