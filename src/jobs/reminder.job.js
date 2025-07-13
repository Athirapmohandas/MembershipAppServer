const cron = require("node-cron");
const { Member, Notification } = require("../models");
const { Op } = require("sequelize");

// cron.schedule("0 9 * * *", async () => {
    cron.schedule("*/20 * * * * *", async () => { 
  console.log("🔔 Running membership expiry reminder job...");

  try {
    const membersExpiringTomorrow = await Member.findAll({
      where: {
       renewalDue : true,
        status: "inactive",
      },
    });

    for (const member of membersExpiringTomorrow) {
      const existing = await Notification.findOne({
        where: {
          memberId: member.id,
          title: "Membership Expiry Reminder",
        },
      });

      if (!existing) {
        await Notification.create({
          memberId: member.id,
          title: "Membership Expiry Reminder",
          message: `Your membership will expire on ${member.expiryDate.toDateString()}. Please renew before expiry.`,
        });

        console.log(`Reminder created for member ID ${member.id}`);
      } else {
        console.log(`Already reminded member ID ${member.id}`);
      }
    }

    console.log("Membership reminder check completed.",membersExpiringTomorrow);
  } catch (err) {
    console.error("Error in cron job:", err.message);
  }
});
