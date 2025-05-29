const PinnedMessage = require('../../models/pinnedMessage');

exports.updatePinnedMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Find existing pinned message or create new one
    let pinnedMessage = await PinnedMessage.findOne();
    if (pinnedMessage) {
      pinnedMessage.message = message;
      pinnedMessage.updatedAt = new Date();
      await pinnedMessage.save();
    } else {
      pinnedMessage = await PinnedMessage.create({ message });
    }

    res.json({ success: true, pinnedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getPinnedMessage = async (req, res) => {
  try {
    const pinnedMessage = await PinnedMessage.findOne();
    res.json({ pinnedMessage });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
