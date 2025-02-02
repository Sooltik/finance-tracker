import express from 'express';
import creditCardService  from '../services/creditCardService.js';

const router = express.Router();

router.get('/', creditCardService.getAllCreditCards);
router.post('/', creditCardService.addCreditCard);
router.delete('/:id', creditCardService.deleteCreditCard);

export default router;
