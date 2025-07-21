const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
    try {
        
        const { email, password, role } = req.body;
        
        const user = new User({ email, password, role });
        
        await user.save();
        
        
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        
        res.status(400).send(error);
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        
        
        
        const token = jwt.sign(
            { 
                userId: user._id, role: user.role }, 
            'your_jwt_secret', 
            { expiresIn: '1h' } 
        );
        
        res.send({ token });
    } 
    catch (error) {
        res.status(400).send(error);
    }
};