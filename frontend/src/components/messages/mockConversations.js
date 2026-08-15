export const messagingPeople = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Frontend developer",
    bio: "Building thoughtful products with React.",
    avatar: "RS",
    color: "bg-primary",
    offers: ["React", "Node.js"],
    learns: ["UI/UX"],
    online: true,
  },

  {
    id: 2,
    name: "Ananya Singh",
    role: "Data scientist",
    bio: "Exploring practical machine learning projects.",
    avatar: "AS",
    color: "bg-secondary",
    offers: ["Python", "ML"],
    learns: ["Web Development"],
    online: false,
  },
]

export const mockConversations = [
  {
    person: messagingPeople[0],
    time: "2m",
    unread: 2,
    lastMessage: "Sure, let's start with React Hooks.",
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hey! I can help you with React.",
        time: "10:41 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Great! I want to learn React Hooks.",
        time: "10:43 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "Sure, let's start with React Hooks.",
        time: "10:44 AM",
      },
    ],
  },

  {
    person: messagingPeople[1],
    time: "1h",
    unread: 0,
    lastMessage: "Thanks for your help!",
    messages: [],
  },
]