const cron = require("node-cron");
const { Member } = require("../models");
const { Op } = require("sequelize");

// Run once daily at 12:10 AM (change time as needed)
cron.schedule("*/20 * * * * *", async () => {
  console.log("Running member expiration check...");

  const now = new Date();

  try {
    const expiredMembers = await Member.findAll({
      where: {
        expiryDate: {
          [Op.lt]: now, // expiryDate in the past
        },
        status: "active", // only process currently active members
      },
    });

    for (const member of expiredMembers) {
      await member.update({
        status: "inactive",
        renewalDue: true,
      });

      console.log(`Updated member ${member.id} as inactive (expired on ${member.expiryDate.toDateString()})`);
    }

    console.log(`Member expiration check completed. Updated ${expiredMembers.length} members.`);
  } catch (err) {
    console.error("Error in expiration cron job:", err.message);
  }
});
