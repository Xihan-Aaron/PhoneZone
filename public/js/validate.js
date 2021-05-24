function isInteger(stringInput){
  parse = parseFloat(stringInput)
    return Number(parse) === parse && parse % 1 === 0;
}

/* Check if it is a float*/
function isFloat(stringInput){
  parse = parseFloat(stringInput)
    return Number(parse) === parse && parse % 1 !== 0;
}
function validateInteger(value){
  if(isFloat(value)){
    return {"status":"fail","message":"Please do NOT put in a Float."}  //If quantity given a float. Disable confirm button and notify user
  }else if(isNaN(parseFloat(value))){
    return {"status":"fail","message":"This is an invalid input. Make sure it is only numbers."}  //If quantity has more than just numbers. Disable confirm button and notify user
  }else if(isInteger(value)){
    tempQuantity=parseInt(value)
      if(isNaN(tempQuantity)){
        return {"status":"fail","message":"This is an invalid input. Make sure it is only numbers." } //If quantity has more than just numbers. Disable confirm button and notify user
      }else if(tempQuantity<0){
      return {"status":"fail","message":"Please have a positive integer." } //If quantity given a negative. Disable confirm button and notify user
    }else{
      return {"status":"success","value":parseInt(value)}
    }
  }
}

