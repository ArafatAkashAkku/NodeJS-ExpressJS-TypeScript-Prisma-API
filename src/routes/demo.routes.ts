import { Router } from 'express';
import {
  index,
  create,
  show,
  update,
  destroy,
} from '../controllers/demo.controllers';

const router = Router();

router.route('/').get(index).post(create);
router.route('/:id').get(show).put(update).delete(destroy);

export default router;
