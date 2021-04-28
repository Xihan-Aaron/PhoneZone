const express= require('express')
const router =express.Router();
const mainCheckout = require('../controllers/main');

router.get('/', (req,res,next)=>{
	console.log(req.session.user_id)
	next()
},
mainCheckout.main
)

router.post('/',function (req, res,next) {
	searchtext = req.body.searchtext
	console.log("search",searchtext);
	if(searchtext == undefined) {
		return next('route')
	}
	next()
},
mainCheckout.search

)

router.post('/',function (req, res,next) {
	selectedItem = req.body.selectItem

	console.log("selectedItem");
	if(selectItem == undefined) {
		next('route')
	}
	next()
},
mainCheckout.selectItem

)

router.post('/',function (req, res,next) {
	console.log("main");
},
mainCheckout.main
)

// router.post('/',(req,res,next)=> {
// 	console.log("main post")
// 	searchtext = req.body.searchtext
// 	if(searchtext == null) {
// 		mainCheckout.main
// 	}
// 	selectedItem = req.body.selectItem
// 	if(searchtext != null) {
// 		mainCheckout.search
// 	}
// 	console.log(test)
// 		next()
// },
// mainCheckout.search
// )


module.exports = router
