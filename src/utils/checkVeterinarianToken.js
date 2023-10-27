const jwt = require("jsonwebtoken");

function checkVeterinarianToken(req, res, next) {
     const authHeader = req.headers["authorization"];
     const token = authHeader && authHeader.split(" ")[1];

     if (!token) {
         return res.status(401).json({
             error: "Only veterinarians can perform this operation!"
         });
     }

     try {
         const veterinarianSecret = process.env.VETERINARIAN_SECRET;

         const decoded = jwt.verify(token, veterinarianSecret);

         req.veterinarian = decoded;

         next();
     } catch (err) {
         return res.status(401).json({
             error: "Invalid or expired token!"
         });
     }
}

module.exports = checkVeterinarianToken;