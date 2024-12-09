export const authMiddleware = async (req, res, next) => {
if(req.user){
  next();
}else{
  res.status(401).json({success:false,message: "You are not logged in"});
}
}

export const adminAuthMiddleware = async (req, res, next) => {
  if(req.user){
      if(req.user.userType === 'Admin'){
        next();
      }else{
        res.status(403).json({success:false,message: "You are not authorized"});
      }
  }else{
    res.status(401).json({success:false,message: "You are not logged in"});
  }

}
export const agentAuthMiddleware = async (req, res, next) => {
  if(req.user){
      
      if(req.user.userType === 'Admin' || req.user.userType === 'Agent'){
        next();
      }else{
       
        res.status(403).json({success:false,message: "You are not authorized"});
      }
  }else{
    res.status(401).json({success:false,message: "You are not logged in"});
  }

}