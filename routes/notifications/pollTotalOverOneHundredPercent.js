const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/notification/pollTotalOverOneHundredPercent",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: Joi.object().required(),
    },
    cors: true,
    tags: ["api"],
  },
  handler: (request, h) => {
    let errorMessage = {
      message: {
        title: "notifications.pollTotalOver100Percent.title",
        body: "notifications.pollTotalOver100Percent.body",
      },
    };

    try {
      const polls = request.payload.item.polls;

      for (let i = 0; i < polls.length; i++) {
        const poll = polls[i];
        let totalVoteInPercent;

        if (
          poll.type === "preVoteNoToYes3" ||
          poll.type === "preVoteNoToYes5"
        ) {
          totalVoteInPercent = Object.values(poll.answers).reduce(
            (aggregated, value) => aggregated + value
          );

          if (totalVoteInPercent !== 100) {
            return errorMessage;
          }
        } else {
          throw new Error(
            `Unhandled preVoteNoToYes type: '${poll.type}' for validation 'pollTotalOverOneHundredPercent'.`
          );
        }
      }
    } catch (err) {
      return null;
    }
  },
};
