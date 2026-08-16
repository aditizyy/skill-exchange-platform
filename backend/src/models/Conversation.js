const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // Exactly two participants — this app only supports 1:1 skill-exchange
    // messaging. Always kept sorted (see pre-validate hook below) so that
    // "the conversation between A and B" can be found with a single query
    // regardless of who initiated it.
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 2,
        message: "A conversation must have exactly two participants",
      },
    },

    // Link back to the accepted Request that authorized this conversation.
    // Not strictly required at the schema level (keeps the model reusable),
    // but the controller always sets it when creating a conversation.
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },

    // Denormalized preview of the most recent message, so the conversation
    // list can be rendered without a join/lookup per row.
    lastMessage: {
      text: { type: String, default: null },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      sentAt: { type: Date, default: null },
    },

    // Derived, deterministic "sortedIdA_sortedIdB" string used purely to
    // enforce one-conversation-per-pair. A unique index directly on the
    // `participants` array would NOT do this — MongoDB builds a multikey
    // index on arrays, where `unique: true` enforces uniqueness of each
    // individual element across the whole collection, not the pair as a
    // tuple. That would make it impossible for any user to be in more than
    // one conversation at all. This string field sidesteps that entirely.
    pairKey: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep participants in a consistent order, and derive pairKey from them,
// so lookups/uniqueness for a given pair are deterministic regardless of
// who initiated the conversation.
conversationSchema.pre("validate", function sortParticipants() {
  if (Array.isArray(this.participants) && this.participants.length === 2) {
    this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
    this.pairKey = this.participants.map((id) => id.toString()).join("_");
  }
});

// Non-unique — supports "find all conversations this user is in" queries.
// (Uniqueness of the pair itself is enforced separately via pairKey above.)
conversationSchema.index({ participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);