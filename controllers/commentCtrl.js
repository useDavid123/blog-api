const getCommentCtrl = async (req , res) => {
    try{
        res.json({
            status:'success',
            data:'successful request'
        })
    }
    catch(err){
        res.json({
           message:err.message
        })
    }
}

module.exports= {
    getCommentCtrl
}