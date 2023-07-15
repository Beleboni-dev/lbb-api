import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";

const secret: Secret = "minhachavesecreta";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Verifica a presença do token no cabeçalho, cookie ou qualquer outra forma que você esteja usando
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Decodifica o token e extrai o userId do payload
    const decodedToken = jwt.verify(token, secret) as { userId: string };

    // Anexa o userId ao objeto de solicitação
    req.user.userId = decodedToken.userId;

    // Continue para o próximo middleware ou controlador de rota
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authenticate;
