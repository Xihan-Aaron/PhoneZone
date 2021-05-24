const User = require('../models/users');

module.exports.extractNames =async function (arrayOfItems){
	var result = arrayOfItems
	try{
		for(var i =0;i<result.length;i++){
			var itemInfo = result[i]
			var sellerInfo = await User.getUserById(itemInfo['seller'])
			if(sellerInfo == undefined) {
				itemInfo['seller'] = 'Unknown'
			} else {
				var concatFullName = sellerInfo['firstname']+' '+sellerInfo['lastname']
				itemInfo['seller']=concatFullName
			}
			if(itemInfo['disabled'] == ""){
				itemInfo['disabled']='Disabled'
			}else{
				itemInfo['disabled']='Enabled'
			}
			for(var j =0; j<itemInfo['reviews'].length;j++){
				var review = itemInfo['reviews'][j]
				var reviewerInfo = await User.getUserById(review['reviewer'])
				if(reviewerInfo == undefined) {
					review['reviewer'] = 'Unknown'
				} else {
					var reviewerConcatFullName = reviewerInfo['firstname']+' '+reviewerInfo['lastname']
					review['reviewer']=reviewerConcatFullName
				}
			}
		}
		return result
	}catch(err){
		err.statusCode=500
		err.message='Issues with extraction of Names'
		return err
	}
}
