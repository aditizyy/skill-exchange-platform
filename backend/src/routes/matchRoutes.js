const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  sendRequestValidation,
  respondToRequestValidation,
} = require("../validators/matchValidators");

const {
  getSuggestedMatches,
  sendRequest,
  getInbox,
  getSentRequests,
  getConnections,
  respondToRequest,
} = require("../controllers/matchController");

// All match/request routes require a logged-in user
router.use(authMiddleware);

router.get("/suggested", getSuggestedMatches);

router.post("/request", sendRequestValidation, sendRequest);

router.get("/inbox", getInbox);
router.get("/sent", getSentRequests);
router.get("/connections", getConnections);

router.patch("/:id", respondToRequestValidation, respondToRequest);

module.exports = router;