// server/seedData.js - Run this to add sample data
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.js';
import Class from './models/Class.js';
import Payment from './models/Payment.js';
import Trainer from './models/Trainer.js';
import Announcement from './models/Announcement.js';
import Attendance from './models/Attendance.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Plan.deleteMany({});
    // await Class.deleteMany({});
    // await Payment.deleteMany({});
    // await Trainer.deleteMany({});
    // await Announcement.deleteMany({});
    // await Attendance.deleteMany({});

    // ===== ADD PLANS =====
    const plans = await Plan.insertMany([
      {
        name: 'Basic',
        price: 999,
        duration: '1 Month',
        features: ['Access to gym', 'Basic equipment', 'Locker facility'],
        description: 'Perfect for beginners'
      },
      {
        name: 'Premium',
        price: 2499,
        duration: '3 Months',
        features: ['Access to gym', 'All equipment', 'Personal trainer', 'Diet plan', 'Locker facility'],
        description: 'Best value for money'
      },
      {
        name: 'VIP',
        price: 4999,
        duration: '6 Months',
        features: ['24/7 gym access', 'All equipment', 'Personal trainer', 'Diet plan', 'Spa access', 'Free supplements'],
        description: 'Ultimate fitness package'
      }
    ]);
    console.log('✅ Added 3 plans');

    // ===== ADD TRAINERS =====
    const trainers = await Trainer.insertMany([
      {
        name: 'John Doe',
        email: 'john@fitzone.com',
        phone: '9876543210',
        specialization: 'Strength Training',
        experience: 5,
        certification: 'ACE Certified',
        salary: 30000,
        status: 'Active'
      },
      {
        name: 'Sarah Smith',
        email: 'sarah@fitzone.com',
        phone: '9876543211',
        specialization: 'Yoga & Flexibility',
        experience: 3,
        certification: 'RYT 500',
        salary: 25000,
        status: 'Active'
      },
      {
        name: 'Mike Ross',
        email: 'mike@fitzone.com',
        phone: '9876543212',
        specialization: 'Cardio & HIIT',
        experience: 4,
        certification: 'NASM Certified',
        salary: 28000,
        status: 'Active'
      }
    ]);
    console.log('✅ Added 3 trainers');

    // ===== ADD CLASSES =====
    const classes = await Class.insertMany([
      {
        name: 'Morning Yoga',
        instructor: 'Sarah Smith',
        day: 'Monday',
        time: '06:00',
        duration: 60,
        capacity: 15,
        enrolled: 12,
        description: 'Start your day with peace and flexibility'
      },
      {
        name: 'Strength Training',
        instructor: 'John Doe',
        day: 'Monday',
        time: '10:00',
        duration: 45,
        capacity: 10,
        enrolled: 8,
        description: 'Build muscle and strength'
      },
      {
        name: 'Cardio Blast',
        instructor: 'Mike Ross',
        day: 'Monday',
        time: '17:00',
        duration: 30,
        capacity: 20,
        enrolled: 15,
        description: 'High-intensity cardio workout'
      },
      {
        name: 'Evening Yoga',
        instructor: 'Sarah Smith',
        day: 'Tuesday',
        time: '18:00',
        duration: 60,
        capacity: 15,
        enrolled: 10,
        description: 'Relax and unwind'
      }
    ]);
    console.log('✅ Added 4 classes');

    // ===== ADD PAYMENTS (Get actual member IDs from your database) =====
    const members = await User.find({ role: 'user' }).limit(3);
    
    if (members.length > 0) {
      const payments = await Payment.insertMany([
        {
          memberId: members[0]._id,
          memberName: members[0].name,
          email: members[0].email,
          plan: 'Basic',
          amount: 999,
          method: 'UPI',
          status: 'completed',
          date: new Date('2024-11-01')
        },
        {
          memberId: members[1]?._id || members[0]._id,
          memberName: members[1]?.name || members[0].name,
          email: members[1]?.email || members[0].email,
          plan: 'Premium',
          amount: 2499,
          method: 'Card',
          status: 'completed',
          date: new Date('2024-11-05')
        },
        {
          memberId: members[2]?._id || members[0]._id,
          memberName: members[2]?.name || members[0].name,
          email: members[2]?.email || members[0].email,
          plan: 'VIP',
          amount: 4999,
          method: 'Cash',
          status: 'pending',
          date: new Date()
        }
      ]);
      console.log('✅ Added payments');

      // ===== ADD ATTENDANCE =====
      const attendance = await Attendance.insertMany([
        {
          memberId: members[0]._id,
          memberName: members[0].name,
          date: new Date(),
          checkIn: new Date(),
          duration: 90
        },
        {
          memberId: members[1]?._id || members[0]._id,
          memberName: members[1]?.name || members[0].name,
          date: new Date(),
          checkIn: new Date(),
          duration: 60
        }
      ]);
      console.log('✅ Added attendance records');
    }

    // ===== ADD ANNOUNCEMENTS =====
    const announcements = await Announcement.insertMany([
      {
        title: 'Gym Maintenance Notice',
        message: 'The gym will be closed for maintenance on Sunday, December 15th. We apologize for the inconvenience.',
        priority: 'important',
        category: 'maintenance'
      },
      {
        title: 'New Year Special Offer',
        message: 'Get 20% off on all annual memberships! Offer valid till December 31st.',
        priority: 'urgent',
        category: 'event'
      },
      {
        title: 'New Equipment Added',
        message: 'We have added new cardio equipment to the gym. Come check it out!',
        priority: 'normal',
        category: 'general'
      }
    ]);
    console.log('✅ Added 3 announcements');

    console.log('\n🎉 Sample data added successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${plans.length} Plans`);
    console.log(`   - ${trainers.length} Trainers`);
    console.log(`   - ${classes.length} Classes`);
    console.log(`   - ${members.length} Members found`);
    console.log(`   - ${announcements.length} Announcements`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();