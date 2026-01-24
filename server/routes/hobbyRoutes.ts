import {Router} from 'express';
import { getHobbies } from '../controllers/HobbyControler';

const router = Router();

router.get('/', getHobbies);

export default router;