const getTokenFromHeader = (req) =>{
    const headerObj = req.headers;
   
    const token = headerObj["authorization"].split(" ")[1]
    
    if(token !== undefined) {
        return token;
    }
    else{
       false
    }

}

module.exports = getTokenFromHeader