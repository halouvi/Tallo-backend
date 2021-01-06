const authService = require('./auth.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    try {
        const user = await authService.login(req.body)
        req.session.user = user;
        res.json(user)
    } catch (err) {
        res.status(401).send({ error: err })
    }
}

async function signup(req, res) {
    try {
        const { email, password, fullName, imgUrl } = req.body
        logger.debug(email + ", " + fullName + ', ' + password + ',' + imgUrl)
        console.log(req.body);
        const account = await authService.signup(req.body)
        logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
        const user = await authService.login(req.body)
        req.session.user = user
        res.json(user)
    } catch (err) {
        logger.error('[SIGNUP] ' + err)
        res.status(500).send({ error: 'could not signup, please try later' })
    }
}

async function logout(req, res){
    try {
        req.session.destroy()
        res.send({ message: 'logged out successfully' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
}

module.exports = {
    login,
    signup,
    logout
}