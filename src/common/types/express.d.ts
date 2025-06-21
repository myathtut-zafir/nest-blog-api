import { JwtPayload } from 'src/iam/auth/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
