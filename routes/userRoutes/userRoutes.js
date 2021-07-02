const router = require("express").Router();

const authContoller = require('../../controllers/authController');
const userController = require('../../controllers/userController');

router.use(authContoller.protect);
router.post("/getUser",userController.getUser);
router.post("/addCat",userController.addCategory);
router.post("/addProd",userController.addProduct);
router.post("/getCategories",userController.getCategories);
router.post("/getProducts",userController.getProducts);
router.post("/addPurchase",userController.addPurchase);
router.post("/addSales",userController.addSales);
router.post("/getDash",userController.getDashboard);
router.post("/getSalesEntries",userController.getSalesEntries);
router.post("/getSalesEntry",userController.getSalesEntry);
router.post("/getPurchaseEntries",userController.getPurchaseEntries);
router.post("/getPurchaseEntry",userController.getPurchaseEntry);
module.exports = router; 