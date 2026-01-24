import {Router} from 'express';
import {createEvent, getEvents} from '../controllers/EventController';
import { authenticateToken } from '../middleware/auth.middleware';
import eventUpload from '../middleware/EventUpload';

const router = Router();

router.post('/create',authenticateToken,eventUpload.single('eventImage'),createEvent);

router.get('/',getEvents);

export default router;