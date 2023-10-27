const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Only ordinary users can do this operation!"
        });
    }

    try {
        const secret = process.env.SECRET;

        const decoded = jwt.verify(token, secret);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token!"
        });
    }
}

module.exports = checkToken;