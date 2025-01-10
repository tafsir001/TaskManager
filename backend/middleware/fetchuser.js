const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const fethuser = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).send({ error: "Access Denied" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch(error) {
        console.error("Access Denied :: ",error.message);
        res.status(401).send({ error: "Access Denied" });

    }
}

module.exports = fethuser;