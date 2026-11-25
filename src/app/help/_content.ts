export interface Faq {
  question: string;
  answer: string;
}

export interface FaqGroup {
  title: string;
  items: Faq[];
}

export const HELP_GROUPS: FaqGroup[] = [
  {
    title: "For customers",
    items: [
      {
        question: "How do I join a shop's room?",
        answer:
          "Open the invite link the shop shared, then log in or create an account and tap Join room. You can also find shops on Discover and join from there. Rooms you have joined are listed under My Rooms.",
      },
      {
        question: "I'm not getting notifications. What should I check?",
        answer:
          "Turn notifications on in Settings and allow them when your browser asks. Check that notifications are on for that shop's room, that your browser or phone isn't blocking them for this site, and that Do Not Disturb is off. A shop may also hold its notifications during quiet hours.",
      },
      {
        question: "Can I see a notification again after it disappears?",
        answer:
          "Yes. Tap the bell to see your recent notifications from the last 30 days, and tap one to watch its banner again.",
      },
      {
        question: "Do I have to share my location?",
        answer:
          "No. It's optional and used to show shops near you. Turn it off in your profile and your stored position is erased straight away.",
      },
      {
        question: "I forgot my password.",
        answer:
          "On the login page choose Forgot password, enter your email, and follow the link we send. It works for 30 minutes. If you signed up with Google, you can use the same link to set a password.",
      },
      {
        question: "How do I delete my account?",
        answer:
          "Go to your profile and choose Delete account. Your account and its data are removed. You can also sign out of every device from Settings.",
      },
    ],
  },
  {
    title: "For shopkeepers",
    items: [
      {
        question: "How do customers find my room?",
        answer:
          "Share your invite link from the dashboard (Share Room Link). Anyone who opens it can see your shop and join. Your shop also appears on Discover for people nearby.",
      },
      {
        question: "How do plans and renewals work?",
        answer:
          "A plan lasts 1, 2 or 3 months and is paid once through Razorpay. It doesn't renew by itself. Renew any time from Billing: the new time is added to the end of your current plan, so nothing is lost.",
      },
      {
        question: "Why can't I send or schedule a notification?",
        answer:
          "Your plan has probably ended. Sending and scheduling pause until you renew from Billing, and everything resumes straight away. Your room, members and designs are kept.",
      },
      {
        question: "How do I send a notification?",
        answer:
          "Design one in the Studio (or start from a template), then choose Send Notification, pick your audience and send. You can also schedule it for later, once or on a repeat.",
      },
      {
        question: "What are quiet hours and weekend sending?",
        answer:
          "They are rules in Notification Preferences for scheduled notifications. A scheduled send that falls in your quiet hours, or on a weekend while weekend sending is off, is skipped and marked in your history. Sending right now is never blocked by them.",
      },
      {
        question: "What do the numbers in History mean?",
        answer:
          "Delivered is how many devices the notification reached. Opened means someone saw the banner or tapped the notification, and clicked means they tapped something in it. They are real counts reported by your members' devices.",
      },
      {
        question: "What can I see about my members?",
        answer:
          "Your Members page lists each member's name, email, join date and whether their notifications are on. You can search it and export a list of names, join dates and notification settings as a CSV. The export leaves out email addresses.",
      },
    ],
  },
];
