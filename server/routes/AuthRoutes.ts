import {Router} from 'express';
import {register,login} from '../controllers/AuthController';
import userUpload from '../middleware/UserUpload.middleware';

const router = Router();

router.post('/register',userUpload.single('avatar'),register);
router.post('/login',login);

export default router;


