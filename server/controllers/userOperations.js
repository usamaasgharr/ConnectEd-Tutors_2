

// importin model
const User = require('../models/user')


const dashboard = async (req, res, next) => {
    console.log(req.user);

    const user = await User.findById( req.user.userId , 'profile');

    if(!user){
        console.log('User Not Found');
        res.redirect('./login')
    }

    console.log(user);


    if (req.user.role === 'teacher') {
        res.render('./instructor-pages/instructor-dashboard', {user});
    }



}

module.exports = { dashboard }