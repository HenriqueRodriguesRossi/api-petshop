const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            erro: "Apenas veterinários podem fazer esta operação!" 
        });
    }

    try {
        const veterinarianSecret = process.env.VETERINARIAN_SECRET;

        // Verifique e decodifique o token
        const decoded = jwt.verify(token, veterinarianSecret);

        // Adicione as informações do usuário decodificadas ao objeto de solicitação
        req.veterinarian = decoded;

        // Continue para a próxima middleware
        next();
    } catch (err) {
        return res.status(401).json({ 
            erro: "Token inválido ou expirado!" 
        });
    }
}

module.exports = checkToken;