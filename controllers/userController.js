const catchAsync = require('../utils/catchAsync');
const User = require('../models/users/User');
const Category = require('../models/users/Category');
const Product = require('../models/users/Product');
const PurchaseEntry = require('../models/users/PurchaseEntry');
const PurchaseItems = require('../models/users/PurchaseItems');
const mongoose = require("mongoose");
const SalesEntry = require('../models/users/SalesEntry');
const SalesItems = require('../models/users/SalesItems');
const {getDateString,getFirstDayOfMonth,getFirstDayOfYear,isDateEqual, getMonth} = require('../utils/util');

exports.getUser = catchAsync(async (req, res, next) => { 
    const { id } = req.body;
    let admin = await (await User.findById(id)).toObject();
    delete admin.password;
    res.send(admin);
  });

exports.addCategory = catchAsync(async (req,res,next)=>{
    req.body.user_id = req.body.id;
    let cat = Category(req.body);
    await cat.save()
    res.status(200).send({ "message": "Category Added Successfully" });
});

exports.addProduct = catchAsync(async (req,res,next)=>{
    req.body.user_id = req.body.id;
    req.body.quantity=0;
    let cat = Product(req.body);
    await cat.save()
    res.status(200).send({ "message": "Product Added Successfully" });
});

exports.getCategories = catchAsync(async (req, res, next) => { 
    const { id } = req.body;
    let cats = await Category.find({user_id:id},{_id:1,name:1});
    res.send(cats);
  });

exports.getProducts = catchAsync(async (req, res, next) => { 
    const { id,cat_id } = req.body;
    let prods = await Product.find({user_id:id,cat_id:cat_id},{_id:1,name:1,quantity:1,mrp:1});
    res.send(prods);
  });

exports.addPurchase = catchAsync(async (req,res,next)=>{
    req.body.user_id = req.body.id;
    let pe  = {
      user_id: req.body.id,
      billId: req.body.billId,
      date:req.body.date,
      company:req.body.company
    };
    let entry = PurchaseEntry(pe);
    await entry.save();
    let items = req.body.purchases.map(p=>({...p,entry_id:entry._id}));
    await PurchaseItems.insertMany(items);
    let addProd =  Product.collection.initializeOrderedBulkOp();
    items.forEach(prod => {
      
      addProd.find({_id:mongoose.Types.ObjectId(prod.prodId)}).updateOne({$inc:{quantity:prod.quantity}});
    });
  
    await addProd.execute();
    res.status(200).send({ "message": "Product Added Successfully" });
});

exports.addSales = catchAsync(async (req,res,next)=>{
  req.body.user_id = req.body.id;
  let pe  = {
    user_id: req.body.id,
    date:req.body.date,
    company:req.body.company,
    total:req.body.total
  };
  let entry = SalesEntry(pe);
  await entry.save();
  let items = req.body.sales.map(p=>({...p,entry_id:entry._id}));
  await SalesItems.insertMany(items);
  let addProd =  Product.collection.initializeOrderedBulkOp();
  items.forEach(prod => {
    
    addProd.find({_id:mongoose.Types.ObjectId(prod.prodId)}).updateOne({$inc:{quantity:-prod.quantity}});
  });
  await addProd.execute();
  res.status(200).send({ "message": "Product Added Successfully" });
});

exports.getDashboard = catchAsync(async (req,res,next)=>{
  let prods = await Product.countDocuments({quantity:{$gt:0},user_id:req.body.id});
  let date_ob = new Date();
  let today = getDateString(date_ob);
  let year = getFirstDayOfYear(date_ob);
  let month = getFirstDayOfMonth(date_ob);
  let yearlySales = await SalesEntry.find({date:{$gte:year},user_id:req.body.id},{date:1,total:1,_id:0});
  let totalY=0,totalM=0,totalD=0;
  let monthly= [0,0,0,0,0,0,0,0,0,0,0,0];
  yearlySales.forEach(sale=>{
    monthly[getMonth(sale)]+=sale.total;
    totalY+=sale.total;
    if(isDateEqual(month,sale))
      totalM+=sale.total;
    if(isDateEqual(today,sale))
      totalD+=sale.total;
  });
  res.status(200).send({prods,monthly,totalY,totalM,totalD});
});

exports.getSalesEntries = catchAsync(async (req,res,next)=>{
  const {id,page} = req.body;
  let salesCount = await SalesEntry.countDocuments({user_id:id});
  let sales = await SalesEntry.find({user_id:id},{company:1,date:1,total:1}).skip(page*10).limit(10 );
  let n = -1;
  if(salesCount>((page+1)*10))   
    n = page+1;
  res.status(200).send({entries:sales,next:n,page:page+1,totalC:salesCount  });
});

exports.getSalesEntry = catchAsync(async (req,res,next)=>{
  const {entry_id} = req.body;
  let sales = await SalesEntry.findById(entry_id,{company:1,date:1,total:1,_id:0});
  let prods = await SalesItems.find({entry_id},{quantity:1,prodId:1,_id:0}).populate('prodId',{name:1,mrp:1,_id:0});
  res.status(200).send({sales,prods});
});

exports.getPurchaseEntries = catchAsync(async (req,res,next)=>{
  const {id,page} = req.body;
  let salesCount = await PurchaseEntry.countDocuments({user_id:id});
  let sales = await PurchaseEntry.find({user_id:id},{company:1,date:1,billId:1}).skip(page*10).limit(10 );
  let n = -1;
  if(salesCount>((page+1)*10))   
    n = page+1;
  res.status(200).send({entries:sales,next:n,page:page+1,totalC:salesCount  });
});

exports.getPurchaseEntry = catchAsync(async (req,res,next)=>{
  const {entry_id} = req.body;
  let purchase = await PurchaseEntry.findById(entry_id,{company:1,date:1,billId:1,_id:0});
  let prods = await PurchaseItems.find({entry_id},{quantity:1,prodId:1,_id:0}).populate('prodId',{name:1,_id:0});
  res.status(200).send({purchase,prods});
});
