const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try 
    {
         
    
        const token = req.headers.authorization.split(' ')[1];
        
        
        
        const decodedToken = jwt.verify(token, 'your_jwt_secret');
        
        
        
        req.user = { userId: decodedToken.userId, role: decodedToken.role };
        
        
        next();
    } catch (error) 
    
    {
        
        res.status(401).json({ message: 'Authentication failed!' } );
    }
};