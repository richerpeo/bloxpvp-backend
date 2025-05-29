const Account = require('../models/account');

const adminAuth = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await Account.findOne({ robloxId: userId });
    if (!user || user.rank !== 'DEMO') {
      return res.status(403).json({ error: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = adminAuth;
