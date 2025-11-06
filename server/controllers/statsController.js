// controllers/statsController.js
import Member from '../models/User.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Total members count
    const totalMembers = await Member.countDocuments();
    
    // Active members (status is Active and not expired)
    const activeMembers = await Member.countDocuments({
      status: 'Active',
      expiryDate: { $gte: new Date() }
    });
    
    // Calculate revenue from active members
    const members = await Member.find({ status: 'Active' }, 'membershipType');
    const membershipPrices = { 
      Basic: 1000, 
      Premium: 2000, 
      VIP: 5000 
    };
    
    const revenue = members.reduce((total, member) => {
      return total + (membershipPrices[member.membershipType] || 0);
    }, 0);

    res.json({
      totalMembers,
      activeMembers,
      revenue
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get membership type breakdown
export const getMembershipBreakdown = async (req, res) => {
  try {
    const breakdown = await Member.aggregate([
      {
        $group: {
          _id: '$membershipType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          membershipType: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    res.json(breakdown);
  } catch (error) {
    console.error('Error fetching membership breakdown:', error);
    res.status(500).json({ message: error.message });
  }
};