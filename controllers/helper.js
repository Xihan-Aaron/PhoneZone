const User = require('../models/users');

module.exports.extractNames =async function (arrayOfItems){
	result = arrayOfItems
	try{
		for(var i =0;i<result.length;i++){
			itemInfo = result[i]
			sellerInfo = await User.getUserById(itemInfo['seller'])
			concatFullName = sellerInfo['firstname']+' '+sellerInfo['lastname']
			itemInfo['seller']=concatFullName
			if(itemInfo['disabled'] == ""){
				itemInfo['disabled']='Disabled'
			}else{
				itemInfo['disabled']='Enabled'
			}
			for(var j =0; j<itemInfo['reviews'].length;j++){
				review = itemInfo['reviews'][j]
				reviewerInfo = await User.getUserById(review['reviewer'])
				reviewerConcatFullName = reviewerInfo['firstname']+' '+reviewerInfo['lastname']
				review['reviewer']=reviewerConcatFullName
			}
		}
		return result
	}catch(err){
		err.statusCode=500
		err.message='Issues with extraction of Names'
		return err
	}
}