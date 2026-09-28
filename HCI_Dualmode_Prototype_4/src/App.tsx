import { FormEvent, ReactNode, useEffect, useState } from "react";

type Mode = "simplified" | "assisted";
type Screen =
  | "home"
  | "feed"
  | "create"
  | "comments"
  | "friends"
  | "messages"
  | "profile"
  | "loading";

const picnicPhoto =
  "https://images.unsplash.com/photo-1758275557126-4a3d06af56b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwcGljbmljJTIwcGFyayUyMGNhbmRpZCUyMGRpdmVyc2UlMjBncm91cHxlbnwxfHx8fDE3OTA2MTY2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080";

const people = [
  { name: "Maya Chen", initials: "MC", detail: "Active 5 minutes ago", tone: "coral" },
  { name: "Jon Bell", initials: "JB", detail: "Active now", tone: "mint" },
  { name: "Rina Patel", initials: "RP", detail: "Active 1 hour ago", tone: "lilac" },
];

const conversations = [
  { name: "Maya Chen", initials: "MC", text: "The picnic was wonderful!", time: "9:42 AM", tone: "coral" },
  { name: "Jon Bell", initials: "JB", text: "See you on Thursday.", time: "Yesterday", tone: "mint" },
  { name: "Rina Patel", initials: "RP", text: "Thanks for sharing that.", time: "Monday", tone: "lilac" },
];

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  return (
    <button
      type={type}
      className={`button button-${variant} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function Avatar({ initials, tone = "blue", large = false }: { initials: string; tone?: string; large?: boolean }) {
  return <span className={`avatar avatar-${tone} ${large ? "avatar-large" : ""}`}>{initials}</span>;
}

function TextField({
  placeholder,
  value,
  onChange,
  multiline = false,
  label,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  label: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {multiline ? (
        <textarea placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function Header({ screen, onBack }: { screen: Screen; onBack: () => void }) {
  const titles: Record<Screen, string> = {
    home: "Hello, Alex",
    feed: "News Feed",
    create: "Create a Post",
    comments: "Comments",
    friends: "Friends",
    messages: "Messages",
    profile: "Your Profile",
    loading: "Please wait",
  };

  return (
    <header className="app-header">
      {screen !== "home" ? (
        <Button variant="ghost" className="back-button" onClick={onBack}>
          <span aria-hidden="true">←</span> Back
        </Button>
      ) : (
        <div className="wordmark" aria-label="Together">
          <span className="wordmark-mark">T</span>
          <span>Together</span>
        </div>
      )}
      <div className="header-title">{titles[screen]}</div>
      <Avatar initials="AS" />
    </header>
  );
}

function Home({
  mode,
  navigate,
}: {
  mode: Mode;
  navigate: (screen: Screen) => void;
}) {
  const actions: { label: string; hint: string; screen: Screen; symbol: string }[] = [
    { label: "News Feed", hint: "See recent updates", screen: "feed", symbol: "N" },
    { label: "Create Post", hint: "Share an update", screen: "create", symbol: "+" },
    { label: "Friends", hint: "Find your people", screen: "friends", symbol: "F" },
    { label: "Messages", hint: "Read conversations", screen: "messages", symbol: "M" },
    { label: "Profile", hint: "View your page", screen: "profile", symbol: "P" },
  ];

  if (mode === "simplified") {
    return (
      <main className="screen home-screen">
        <section className="welcome-block">
          <p className="eyebrow">Your community</p>
          <div className="display-title">What would you like to do?</div>
          <p>Choose one option below. You can always come back here.</p>
        </section>
        <div className="simple-grid">
          {actions.map((action) => (
            <Button key={action.label} variant="secondary" className="menu-card" onClick={() => navigate(action.screen)}>
              <span className="menu-letter">{action.symbol}</span>
              <span>{action.label}</span>
            </Button>
          ))}
          <Button variant="secondary" className="menu-card" onClick={() => document.getElementById("mode-help")?.focus()}>
            <span className="menu-letter">?</span>
            <span>Help</span>
          </Button>
        </div>
        <aside className="tip-card" id="mode-help" tabIndex={-1}>
          <span className="tip-mark">i</span>
          <div>
            <strong>Easy to use</strong>
            <p>Large buttons and clear labels make every action simple.</p>
          </div>
        </aside>
      </main>
    );
  }

  return (
    <main className="screen assisted-home">
      <section className="welcome-card">
        <div>
          <p className="eyebrow">Tuesday, June 18</p>
          <div className="display-title">Good morning, Alex.</div>
          <p>Here is what is happening in your circle.</p>
        </div>
        <Avatar initials="AS" tone="lilac" large />
      </section>
      <section>
        <div className="section-heading">
          <strong>Quick actions</strong>
          <span>Choose an action</span>
        </div>
        <div className="quick-actions">
          {actions.slice(0, 4).map((action) => (
            <Button key={action.label} variant="secondary" className="quick-action" onClick={() => navigate(action.screen)}>
              <span className="small-symbol">{action.symbol}</span>
              <span>
                <strong>{action.label}</strong>
                <small>{action.hint}</small>
              </span>
              <span aria-hidden="true">›</span>
            </Button>
          ))}
        </div>
      </section>
      <section className="feed-preview">
        <div className="section-heading">
          <strong>From your feed</strong>
          <Button variant="ghost" onClick={() => navigate("feed")}>See all</Button>
        </div>
        <article className="mini-post">
          <Avatar initials="MC" tone="coral" />
          <div>
            <strong>Maya Chen</strong>
            <p>Picnic photos are up. Such a lovely afternoon together.</p>
          </div>
        </article>
      </section>
    </main>
  );
}

function Feed({ mode, navigate, showToast }: { mode: Mode; navigate: (screen: Screen) => void; showToast: (text: string) => void }) {
  const [liked, setLiked] = useState(false);
  const act = (text: string) => showToast(text);

  return (
    <main className="screen feed-screen">
      <div className="feed-intro">
        <div>
          <p className="eyebrow">Latest updates</p>
          <div className="display-title">Your community today</div>
        </div>
        <Button onClick={() => navigate("create")}>+ New post</Button>
      </div>
      <article className="post-card">
        <div className="post-author">
          <Avatar initials="MC" tone="coral" />
          <div><strong>Maya Chen</strong><span>18 minutes ago</span></div>
          <span className="audience-label">Friends</span>
        </div>
        <p className="post-copy">Sunday in the park with some of my favorite people. The weather could not have been better!</p>
        <img className="post-image" src={picnicPhoto} alt="Friends enjoying a picnic and playing guitar in a sunny park" />
        <div className="post-meta">
          <span>{liked ? "You and 24 others like this" : "24 people like this"}</span>
          <span>6 comments</span>
        </div>
        <div className="post-actions">
          <Button
            variant={liked ? "primary" : "secondary"}
            onClick={() => {
              setLiked(!liked);
              act(liked ? "Like removed" : "Liked — phone vibration confirmed");
            }}
          >
            <span aria-hidden="true">{liked ? "✓" : "+"}</span> {liked ? "Liked" : "Like"}
          </Button>
          <Button variant="secondary" onClick={() => navigate("comments")}>
            Comment
          </Button>
          <Button variant="secondary" onClick={() => act("Post shared with your friends")}>
            Share
          </Button>
        </div>
      </article>
      <article className="post-card text-post">
        <div className="post-author">
          <Avatar initials="JB" tone="mint" />
          <div><strong>Jon Bell</strong><span>2 hours ago</span></div>
        </div>
        <p className="post-copy">A reminder that our neighborhood book club meets Thursday at 6:30. New faces are always welcome.</p>
        <div className="post-actions">
          <Button variant="secondary" onClick={() => act("You liked Jon's post")}>Like</Button>
          <Button variant="secondary" onClick={() => navigate("comments")}>Comment</Button>
          <Button variant="secondary" onClick={() => act("Post shared")}>Share</Button>
        </div>
      </article>
      {mode === "assisted" && <p className="photo-credit">Photo by Vitaly Gariev on Unsplash</p>}
    </main>
  );
}

function CreatePost({ mode, publish }: { mode: Mode; publish: (text: string) => void }) {
  const [text, setText] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (text.trim()) publish(text);
  };
  return (
    <main className="screen">
      <section className="composer-card">
        <div className="composer-person">
          <Avatar initials="AS" tone="lilac" />
          <div><strong>Alex Smith</strong><span>Visible to friends</span></div>
        </div>
        <form onSubmit={submit} className="composer-form">
          <TextField
            multiline
            label="Your post"
            placeholder="What would you like to share?"
            value={text}
            onChange={setText}
          />
          {hasPhoto && (
            <div className="photo-ready">
              <span className="success-mark">✓</span>
              <span><strong>Photo ready</strong><small>family-picnic.jpg</small></span>
              <Button variant="ghost" onClick={() => setHasPhoto(false)}>Remove</Button>
            </div>
          )}
          <div className="composer-actions">
            <Button variant="secondary" onClick={() => setHasPhoto(true)}>+ Add photo</Button>
            <Button type="submit" className="publish-button">{mode === "simplified" ? "Publish Post" : "Post"}</Button>
          </div>
        </form>
      </section>
      <aside className="tip-card">
        <span className="tip-mark">i</span>
        <div><strong>Before you post</strong><p>Only your friends will see this update. You can change this later.</p></div>
      </aside>
    </main>
  );
}

function Comments({ showToast }: { showToast: (text: string) => void }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { name: "Rina Patel", initials: "RP", text: "This looks like such a lovely day!", tone: "lilac" },
    { name: "Jon Bell", initials: "JB", text: "Thanks again for bringing the guitar.", tone: "mint" },
  ]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { name: "Alex Smith", initials: "AS", text: comment, tone: "blue" }]);
    setComment("");
    showToast("Comment posted successfully");
  };
  return (
    <main className="screen">
      <div className="context-post">
        <Avatar initials="MC" tone="coral" />
        <p><strong>Maya Chen</strong> shared a sunny afternoon with friends in the park.</p>
      </div>
      <div className="comment-list">
        {comments.map((item, index) => (
          <article className="comment" key={`${item.name}-${index}`}>
            <Avatar initials={item.initials} tone={item.tone} />
            <div><strong>{item.name}</strong><p>{item.text}</p><Button variant="ghost" onClick={() => setComment(`@${item.name} `)}>Reply</Button></div>
          </article>
        ))}
      </div>
      <form className="comment-form" onSubmit={submit}>
        <TextField label="Write a comment" placeholder="Add a kind response..." value={comment} onChange={setComment} />
        <Button type="submit">Send</Button>
      </form>
    </main>
  );
}

function Friends({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <main className="screen">
      <p className="screen-lead">Your friends are listed below. Select Message to start a conversation.</p>
      <div className="people-list">
        {people.map((person) => (
          <article className="person-card" key={person.name}>
            <Avatar initials={person.initials} tone={person.tone} />
            <div><strong>{person.name}</strong><span>{person.detail}</span></div>
            <Button variant="secondary" onClick={() => navigate("messages")}>Message</Button>
          </article>
        ))}
      </div>
      <Button variant="secondary" className="full-button">Find more friends</Button>
    </main>
  );
}

function Messages({ mode, showToast }: { mode: Mode; showToast: (text: string) => void }) {
  const [openChat, setOpenChat] = useState(mode === "assisted");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  if (!openChat) {
    return (
      <main className="screen">
        <p className="screen-lead">Choose a conversation to open.</p>
        <div className="people-list">
          {conversations.map((item) => (
            <article className="person-card conversation" key={item.name}>
              <Avatar initials={item.initials} tone={item.tone} />
              <div><strong>{item.name}</strong><span>{item.text}</span><small>{item.time}</small></div>
              <Button variant="secondary" onClick={() => setOpenChat(true)}>Open</Button>
            </article>
          ))}
        </div>
      </main>
    );
  }
  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSent([...sent, message]);
    setMessage("");
    showToast("Message sent ✓✓");
  };
  return (
    <main className="screen chat-screen">
      <div className="chat-person">
        <Avatar initials="MC" tone="coral" />
        <div><strong>Maya Chen</strong><span>Online now</span></div>
        <Button variant="ghost" onClick={() => setOpenChat(false)}>All messages</Button>
      </div>
      <div className="messages">
        <div className="bubble received">The picnic was wonderful! Thanks for sharing the photos.</div>
        <div className="bubble sent">I am glad you enjoyed it. We should do it again soon.</div>
        {sent.map((item, index) => <div className="bubble sent" key={index}>{item}<small>✓✓</small></div>)}
      </div>
      <form className="comment-form message-form" onSubmit={send}>
        <TextField label="Message" placeholder="Write a message..." value={message} onChange={setMessage} />
        <Button type="submit">Send</Button>
      </form>
    </main>
  );
}

function Profile({ showToast }: { showToast: (text: string) => void }) {
  return (
    <main className="screen">
      <section className="profile-card">
        <div className="profile-cover"></div>
        <Avatar initials="AS" tone="lilac" large />
        <div className="profile-copy">
          <div className="display-title">Alex Smith</div>
          <p>Gardener, neighbor, and enthusiastic amateur baker.</p>
          <Button onClick={() => showToast("Profile editing is ready")}>Edit Profile</Button>
        </div>
        <div className="profile-stats">
          <span><strong>128</strong> Friends</span>
          <span><strong>36</strong> Posts</span>
          <span><strong>12</strong> Groups</span>
        </div>
      </section>
      <section className="about-card">
        <strong>About Alex</strong>
        <p>Lives in Oakfield · Joined March 2022</p>
      </section>
    </main>
  );
}

function Loading({ mode }: { mode: Mode }) {
  return (
    <main className="screen loading-screen" aria-live="polite">
      <div className={mode === "simplified" ? "pulse-circle" : "spinner"}></div>
      <div className="display-title">{mode === "simplified" ? "Publishing your post..." : "Loading..."}</div>
      <p>{mode === "simplified" ? "Please wait. Your phone will vibrate when it is ready." : "A sound will play when your post is ready."}</p>
      {mode === "simplified" ? (
        <div className="progress-track"><span></span></div>
      ) : (
        <div className="feedback-chips"><span>Visual</span><span>Sound on</span><span>Haptic on</span></div>
      )}
    </main>
  );
}

function HelpOverlay({ close }: { close: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <section className="help-sheet">
        <div className="help-top"><span className="help-icon">?</span><Button variant="ghost" onClick={close}>Close</Button></div>
        <p className="eyebrow">Guided help · Step 1 of 3</p>
        <div className="display-title" id="help-title">How can we help?</div>
        <p>Choose a topic and we will guide you one step at a time.</p>
        <div className="help-options">
          <Button variant="secondary" onClick={close}><span>1</span> Create and share a post</Button>
          <Button variant="secondary" onClick={close}><span>2</span> Send someone a message</Button>
          <Button variant="secondary" onClick={close}><span>3</span> Find a friend</Button>
        </div>
        <div className="help-note"><strong>You are in control.</strong><p>You can close help at any time. Nothing will be changed without your approval.</p></div>
      </section>
    </div>
  );
}

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; symbol: string }[] = [
    { screen: "home", label: "Home", symbol: "H" },
    { screen: "feed", label: "Feed", symbol: "N" },
    { screen: "friends", label: "Friends", symbol: "F" },
    { screen: "messages", label: "Messages", symbol: "M" },
    { screen: "profile", label: "Profile", symbol: "P" },
  ];
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <Button key={item.screen} variant="ghost" className={screen === item.screen ? "nav-active" : ""} onClick={() => navigate(item.screen)}>
          <span>{item.symbol}</span><small>{item.label}</small>
        </Button>
      ))}
    </nav>
  );
}

function PhonePrototype({ mode }: { mode: Mode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2800);
  };

  const publish = () => {
    setScreen("loading");
  };

  useEffect(() => {
    if (screen !== "loading") return;
    const timer = window.setTimeout(() => {
      setScreen("feed");
      showToast("Post published successfully ✓");
    }, 2100);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const content = () => {
    switch (screen) {
      case "home": return <Home mode={mode} navigate={setScreen} />;
      case "feed": return <Feed mode={mode} navigate={setScreen} showToast={showToast} />;
      case "create": return <CreatePost mode={mode} publish={publish} />;
      case "comments": return <Comments showToast={showToast} />;
      case "friends": return <Friends navigate={setScreen} />;
      case "messages": return <Messages mode={mode} showToast={showToast} />;
      case "profile": return <Profile showToast={showToast} />;
      case "loading": return <Loading mode={mode} />;
    }
  };

  return (
    <section className="phone-demo" aria-label={`${mode === "simplified" ? "Simplified" : "Assisted"} mode prototype`}>
      <div className="mode-label">
        <span className={`summary-dot ${mode === "simplified" ? "simple-dot" : "assisted-dot"}`}></span>
        <span>
          <strong>{mode === "simplified" ? "Simplified mode" : "Assisted mode"}</strong>
          <small>{mode === "simplified" ? "60px targets · Large & direct" : "44px targets · Guided & flexible"}</small>
        </span>
      </div>

      <div className={`phone-shell ${mode}`}>
        <div className="phone-status"><span>9:41</span><span>● ● ▰</span></div>
        <Header screen={screen} onBack={() => setScreen("home")} />
        <div className="content-scroll">{content()}</div>
        {screen !== "loading" && <BottomNav screen={screen} navigate={setScreen} />}
        {mode === "assisted" && screen !== "loading" && (
          <Button className="help-beacon" ariaLabel="Open guided help" onClick={() => setHelpOpen(true)}>?</Button>
        )}
        {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
        {helpOpen && <HelpOverlay close={() => setHelpOpen(false)} />}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="app-canvas">
      <aside className="project-panel">
        <div className="project-kicker">HCI Research Prototype · Group 6</div>
        <div className="project-title">One community.<br />Two ways to connect.</div>
        <p>Use both prototypes side by side to compare accessible interaction patterns for confidence, clarity, and independence.</p>
        <div className="research-list">
          <div><span>01</span><p><strong>Touch targets</strong>60px vs. 44px controls</p></div>
          <div><span>02</span><p><strong>Recognition</strong>Text labels vs. compact cues</p></div>
          <div><span>03</span><p><strong>Feedback</strong>Visual, sound, and haptic signals</p></div>
        </div>
        <div className="comparison-key" aria-label="Mode comparison">
          <div className="mode-summary">
            <span className="summary-dot simple-dot"></span>
            <p><strong>Simplified mode</strong>Large controls · Clear labels · No gestures</p>
          </div>
          <div className="mode-summary">
            <span className="summary-dot assisted-dot"></span>
            <p><strong>Assisted mode</strong>Compact controls · Guided help · Rich feedback</p>
          </div>
        </div>
      </aside>

      <main className="prototype-stage">
        <div className="stage-heading">
          <div className="project-kicker">Live mode comparison</div>
          <div className="stage-title">Explore both experiences independently</div>
          <p>Actions in one mobile window do not affect the other.</p>
        </div>
        <div className="dual-phones">
          <PhonePrototype mode="simplified" />
          <PhonePrototype mode="assisted" />
        </div>
        <p className="prototype-caption">Two interactive mobile prototypes · Scroll each window independently</p>
      </main>
    </div>
  );
}
