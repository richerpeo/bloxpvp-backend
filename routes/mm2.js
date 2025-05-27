const express = require('express');
const router = express.Router();
const mm2Controller = require('../controllers/mm2/mm2Controller');

// MM2 routes
router.post('/withdrawals/mm2', mm2Controller.get_withdrawals);
router.post('/deposit/mm2', mm2Controller.handle_deposit);
router.post('/withdraw/mm2/clear', mm2Controller.clear_withdrawals);

module.exports = router;
