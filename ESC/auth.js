const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token de acesso requerido' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token inválido' 
            });
        }
        req.user = user;
        next();
    });
};

// Middleware para verificar se o usuário é administrador
const requireAdmin = (req, res, next) => {
    if (req.user.perfil !== 'administrador') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
        });
    }
    next();
};

// Middleware para verificar se o usuário é mentor
const requireMentor = (req, res, next) => {
    if (req.user.perfil !== 'mentor' && req.user.perfil !== 'administrador') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acesso negado. Apenas mentores e administradores podem realizar esta ação.' 
        });
    }
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    requireMentor
};

