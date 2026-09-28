import { FormEvent, ReactNode, useEffect, useState } from "react";

type Mode = "simplified" | "assisted";
type Screen =
  | "home"
  | "contacts"
  | "calling"
  | "messages"
  | "recording"
  | "loading";
type IconName =
  | "home"
  | "phone"
  | "message"
  | "video"
  | "contacts"
  | "settings"
  | "help"
  | "back"
  | "mic"
  | "speaker"
  | "mute"
  | "paperclip"
  | "send"
  | "sound"
  | "close"
  | "check";

const contacts = [
  { name: "Maya Patel", initials: "MP", relation: "Daughter", color: "coral" },
  { name: "Daniel Lee", initials: "DL", relation: "Neighbour", color: "blue" },
  { name: "Amina Yusuf", initials: "AY", relation: "Friend", color: "gold" },
  { name: "Health Centre", initials: "HC", relation: "Care team", color: "green" },
];

const initialMessages = [
  { id: 1, text: "Good morning! How are you today?", sent: false, time: "9:30" },
  { id: 2, text: "I’m doing well, thank you.", sent: true, time: "9:32" },
  { id: 3, text: "Great. I’ll call you this afternoon.", sent: false, time: "9:33" },
];

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v10h13V10M9 20v-6h6v6" /></>,
    phone: <path d="M7.1 3.5 4.4 5.2c-.8.5-1.1 1.5-.8 2.4 2.1 6.2 6.9 11 13.1 13.1.9.3 1.9 0 2.4-.8l1.7-2.7-4.7-2.3-1.3 1.8c-3.2-1.4-5.8-4-7.2-7.2l1.8-1.3-2.3-4.7Z" />,
    message: <path d="M4 5.5h16v11H9l-5 4v-15Z" />,
    video: <><rect x="3" y="6" width="12" height="12" rx="2" /><path d="m15 10 6-3v10l-6-3" /></>,
    contacts: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19c.5-4 2.3-6 5.5-6s5 2 5.5 6M16 7h5M16 11h5M17 15h4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19 13.5v-3l-2.3-.7-.7-1.7 1.1-2.2L15 3.8l-2.2 1.1-1.7-.7L10.5 2h-3l-.7 2.3-1.7.7-2.2-1.1L.8 6l1.1 2.2-.7 1.7L-1 10.5v3l2.3.7.7 1.7-1.1 2.2L3 20.2l2.2-1.1 1.7.7.7 2.3h3l.7-2.3 1.7-.7 2.2 1.1 2.1-2.1-1.1-2.2.7-1.7 2.1-.7Z" transform="translate(3)" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9.3a2.5 2.5 0 1 1 3.1 2.4c-.8.3-.8 1-.8 1.8M12 17.5v.1" /></>,
    back: <path d="m15 5-7 7 7 7" />,
    mic: <><rect x="8" y="3" width="8" height="13" rx="4" /><path d="M5 12a7 7 0 0 0 14 0M12 19v3" /></>,
    speaker: <><path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></>,
    mute: <><path d="M9 9v3a3 3 0 0 0 5 2.2M15 10V7a3 3 0 0 0-5.7-1.3M5 12a7 7 0 0 0 11.8 5.1M19 12a7 7 0 0 1-.7 3M12 19v3M4 4l16 16" /></>,
    paperclip: <path d="m8 12.5 5.8-5.8a3 3 0 0 1 4.2 4.2l-7.5 7.5a5 5 0 0 1-7.1-7.1l7.4-7.4" />,
    send: <path d="m3 4 18 8-18 8 3-8-3-8Zm3 8h8" />,
    sound: <><path d="M4 10v4h4l5 4V6l-5 4H4Z" /><path d="M17 9a4 4 0 0 1 0 6" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  className = "",
  icon,
  onClick,
  type = "button",
  disabled = false,
  ariaLabel,
}: {
  children?: ReactNode;
  className?: string;
  icon?: IconName;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`button ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  return (
    <header className="screen-header">
      {onBack && (
        <Button ariaLabel="Go back" className="icon-button header-back" icon="back" onClick={onBack} />
      )}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}

function BottomNav({
  active,
  mode,
  navigate,
  openHelp,
}: {
  active: Screen;
  mode: Mode;
  navigate: (screen: Screen) => void;
  openHelp: () => void;
}) {
  const items: { label: string; icon: IconName; screen?: Screen }[] = [
    { label: "Home", icon: "home", screen: "home" },
    { label: "Calls", icon: "phone", screen: "contacts" },
    { label: "Messages", icon: "message", screen: "messages" },
    { label: "Contacts", icon: "contacts", screen: "contacts" },
    { label: "Help", icon: "help" },
  ];

  return (
    <nav aria-label="Primary navigation" className={`bottom-nav ${mode}`}>
      {items.map((item) => (
        <Button
          ariaLabel={item.label}
          className={`${item.screen === active ? "active" : ""}`}
          icon={mode === "assisted" ? item.icon : undefined}
          key={item.label}
          onClick={() => (item.screen ? navigate(item.screen) : openHelp())}
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
}

function HomeScreen({
  mode,
  navigate,
  startCall,
  openHelp,
}: {
  mode: Mode;
  navigate: (screen: Screen) => void;
  startCall: (name: string) => void;
  openHelp: () => void;
}) {
  if (mode === "simplified") {
    const actions: { label: string; icon: IconName; action: () => void }[] = [
      { label: "Call", icon: "phone", action: () => navigate("contacts") },
      { label: "Message", icon: "message", action: () => navigate("messages") },
      { label: "Video Call", icon: "video", action: () => startCall("Maya Patel") },
      { label: "Contacts", icon: "contacts", action: () => navigate("contacts") },
      { label: "Settings", icon: "settings", action: openHelp },
      { label: "Help", icon: "help", action: openHelp },
    ];
    return (
      <main className="screen home-screen">
        <div className="welcome">
          <span>GOOD MORNING</span>
          <h1>What would you like to do?</h1>
        </div>
        <div className="action-grid">
          {actions.map((action) => (
            <Button className="action-card" key={action.label} onClick={action.action}>
              <span className="action-icon"><Icon name={action.icon} size={28} /></span>
              <strong>{action.label}</strong>
            </Button>
          ))}
        </div>
        <section className="reassurance">
          <Icon name="help" />
          <p>Tap Help at any time. We’ll guide you step by step.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="screen assisted-home">
      <div className="assisted-welcome">
        <div>
          <span>MONDAY, 14 OCTOBER</span>
          <h1>Good morning</h1>
          <p>Who would you like to reach?</p>
        </div>
        <div className="profile-chip" aria-label="Profile for Alex">A</div>
      </div>
      <section className="quick-contact">
        <div className="avatar coral">MP</div>
        <div className="contact-copy">
          <small>RECENT CONTACT</small>
          <strong>Maya Patel</strong>
          <span>Daughter · yesterday</span>
        </div>
        <Button ariaLabel="Call Maya Patel" className="round-button primary" icon="phone" onClick={() => startCall("Maya Patel")} />
      </section>
      <section>
        <div className="section-title">
          <h2>Quick actions</h2>
          <span>Tap to begin</span>
        </div>
        <div className="assisted-actions">
          <Button onClick={() => navigate("contacts")}><Icon name="phone" /><span><strong>Start a call</strong><small>Choose a contact</small></span></Button>
          <Button onClick={() => navigate("messages")}><Icon name="message" /><span><strong>Send a message</strong><small>Text or voice</small></span></Button>
          <Button onClick={() => startCall("Maya Patel")}><Icon name="video" /><span><strong>Video call</strong><small>See each other</small></span></Button>
        </div>
      </section>
      <section className="recent-row">
        <div className="section-title"><h2>Recent activity</h2></div>
        <div className="activity-item"><span className="activity-icon"><Icon name="check" /></span><div><strong>Call with Daniel</strong><small>Yesterday · 8 minutes</small></div></div>
      </section>
    </main>
  );
}

function ContactsScreen({
  mode,
  startCall,
  openMessages,
  goBack,
}: {
  mode: Mode;
  startCall: (name: string) => void;
  openMessages: () => void;
  goBack: () => void;
}) {
  return (
    <main className="screen">
      <ScreenHeader title="Contacts" subtitle={mode === "simplified" ? "Choose a person to call" : "4 people in your circle"} onBack={goBack} />
      <div className="contact-list">
        {contacts.map((contact) => (
          <article className="contact-card" key={contact.name}>
            <div className={`avatar ${contact.color}`}>{contact.initials}</div>
            <div className="contact-copy">
              <strong>{contact.name}</strong>
              <span>{contact.relation}</span>
            </div>
            <div className="contact-actions">
              <Button className="call-action" icon={mode === "assisted" ? "phone" : undefined} onClick={() => startCall(contact.name)}>
                {mode === "simplified" ? "Call" : <span className="sr-only">Call {contact.name}</span>}
              </Button>
              {mode === "assisted" && (
                <Button ariaLabel={`Message ${contact.name}`} className="message-action" icon="message" onClick={openMessages} />
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function LoadingScreen({ mode, name }: { mode: Mode; name: string }) {
  return (
    <main className="screen loading-screen">
      <div className={mode === "simplified" ? "pulse-large" : "spinner"}><Icon name="phone" size={30} /></div>
      <h1>{mode === "simplified" ? "Calling..." : "Connecting"}</h1>
      <p>Please wait while we connect you to {name}.</p>
      {mode === "simplified" ? (
        <>
          <div className="progress-track"><span /></div>
          <div className="feedback-note"><Icon name="sound" /><span>Phone will vibrate and chime when ready</span></div>
        </>
      ) : (
        <div className="feedback-note compact"><Icon name="sound" /><span>Sound on</span></div>
      )}
    </main>
  );
}

function CallingScreen({
  mode,
  name,
  onEnd,
}: {
  mode: Mode;
  name: string;
  onEnd: () => void;
}) {
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const contact = contacts.find((item) => item.name === name) ?? contacts[0];

  return (
    <main className="screen calling-screen">
      <div className="connected-pill"><span /> Connected</div>
      <div className={`call-avatar ${contact.color}`}>{contact.initials}</div>
      <h1>{name}</h1>
      <p className="call-time">{time}</p>
      <p className="call-status">Call in progress</p>
      {mode === "assisted" && (
        <div className="call-tools">
          <Button className={muted ? "selected" : ""} icon="mute" onClick={() => setMuted(!muted)}><span>Mute</span></Button>
          <Button className={speaker ? "selected" : ""} icon="speaker" onClick={() => setSpeaker(!speaker)}><span>Speaker</span></Button>
        </div>
      )}
      <Button className="end-call" icon="phone" onClick={onEnd}>End Call</Button>
      {mode === "simplified" && <p className="call-hint">Tap the red button when you are finished.</p>}
    </main>
  );
}

function MessagesScreen({
  mode,
  goBack,
  openRecording,
}: {
  mode: Mode;
  goBack: () => void;
  openRecording: () => void;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setMessages((items) => [...items, { id: Date.now(), text: draft.trim(), sent: true, time: "Now" }]);
    setDraft("");
  };

  return (
    <main className="screen message-screen">
      <ScreenHeader title="Maya Patel" subtitle="Available" onBack={goBack} />
      <div className="chat-date">TODAY</div>
      <div className="message-list">
        {messages.map((message) => (
          <div className={`bubble ${message.sent ? "sent" : "received"}`} key={message.id}>
            <p>{message.text}</p>
            <small>{message.time} {message.sent && <span aria-label="Delivered">✓✓</span>}</small>
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={submit}>
        {mode === "assisted" && <Button ariaLabel="Attach a file" className="attach-button" icon="paperclip" />}
        <label className="sr-only" htmlFor="message">Write a message</label>
        <input
          id="message"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message..."
          value={draft}
        />
        <Button
          ariaLabel={draft ? "Send message" : "Record voice message"}
          className="send-button"
          icon={draft ? "send" : "mic"}
          onClick={draft ? undefined : openRecording}
          type={draft ? "submit" : "button"}
        >
          {mode === "simplified" && <span>{draft ? "Send" : "Voice"}</span>}
        </Button>
      </form>
    </main>
  );
}

function RecordingScreen({
  mode,
  onCancel,
  onSend,
}: {
  mode: Mode;
  onCancel: () => void;
  onSend: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  return (
    <main className="screen recording-screen">
      <ScreenHeader title="Voice message" subtitle="For Maya Patel" onBack={onCancel} />
      <div className={`record-orbit ${recording ? "is-recording" : ""}`}>
        <Button ariaLabel={recording ? "Pause recording" : "Start recording"} className="record-button" icon="mic" onClick={() => setRecording(!recording)} />
      </div>
      <h2>{recording ? "Recording..." : seconds ? "Recording paused" : "Ready to record"}</h2>
      <div className="record-timer">00:{String(seconds).padStart(2, "0")}</div>
      {mode === "assisted" ? (
        <div className="waveform" aria-label="Audio waveform">
          {[2, 4, 7, 10, 6, 12, 8, 4, 9, 6, 3, 5, 8, 4].map((height, index) => <i key={index} style={{ "--bar": height } as React.CSSProperties} />)}
        </div>
      ) : (
        <p className="record-help">Tap the microphone to start or pause.</p>
      )}
      <div className="record-actions">
        <Button className="secondary" onClick={onCancel}>Cancel</Button>
        <Button className="primary" disabled={!seconds} icon="send" onClick={onSend}>Send</Button>
      </div>
    </main>
  );
}

function ConfirmationDialog({ onCancel, onConfirm, mode }: { onCancel: () => void; onConfirm: () => void; mode: Mode }) {
  return (
    <div className="overlay" role="presentation">
      <section aria-labelledby="confirm-title" aria-modal="true" className={`dialog ${mode}`} role="dialog">
        <span className="dialog-icon"><Icon name="phone" /></span>
        <h2 id="confirm-title">End this call?</h2>
        <p>You can call again at any time.</p>
        <div className="dialog-actions">
          <Button className="secondary" onClick={onCancel}>{mode === "simplified" ? "NO, GO BACK" : "Keep talking"}</Button>
          <Button className="danger" onClick={onConfirm}>{mode === "simplified" ? "YES, END CALL" : "End call"}</Button>
        </div>
      </section>
    </div>
  );
}

function HelpOverlay({ mode, onClose, navigate }: { mode: Mode; onClose: () => void; navigate: (screen: Screen) => void }) {
  return (
    <div className="overlay help-overlay" role="presentation">
      <section aria-labelledby="help-title" aria-modal="true" className={`dialog help-dialog ${mode}`} role="dialog">
        <Button ariaLabel="Close help" className="icon-button close-help" icon="close" onClick={onClose} />
        <span className="eyebrow">STEP-BY-STEP HELP</span>
        <h2 id="help-title">What do you want to do?</h2>
        <p>Choose an option and we’ll guide you.</p>
        <div className="help-options">
          <Button onClick={() => { onClose(); navigate("contacts"); }}><span>1</span><div><strong>Make a call</strong><small>Choose a person, then tap Call</small></div></Button>
          <Button onClick={() => { onClose(); navigate("messages"); }}><span>2</span><div><strong>Send a message</strong><small>Write, speak, then send</small></div></Button>
          <Button onClick={() => { onClose(); navigate("home"); }}><span>3</span><div><strong>Return home</strong><small>Go back to the main screen</small></div></Button>
        </div>
        <div className="help-footer"><Icon name="sound" /><span>Guidance can be read aloud</span></div>
      </section>
    </div>
  );
}

function PhonePrototype({ mode }: { mode: Mode }) {
  const [screen, setScreen] = useState<Screen>("home");
  const [previousScreen, setPreviousScreen] = useState<Screen>("home");
  const [callName, setCallName] = useState("Maya Patel");
  const [helpOpen, setHelpOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState("");

  const navigate = (next: Screen) => {
    setPreviousScreen(screen);
    setScreen(next);
  };
  const goBack = () => setScreen(previousScreen === screen ? "home" : previousScreen);
  const startCall = (name: string) => {
    setCallName(name);
    setPreviousScreen(screen);
    setScreen("loading");
    window.setTimeout(() => setScreen("calling"), 1600);
  };
  const sendVoice = () => {
    setScreen("messages");
    setToast("Voice message sent");
    window.setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="phone-preview">
      <div className={`phone mode-${mode}`}>
        <div className="status-bar"><span>9:41</span><span className="status-icons">●  Wi-Fi  ▰</span></div>
        <div className="app-content">
          {screen === "home" && <HomeScreen mode={mode} navigate={navigate} openHelp={() => setHelpOpen(true)} startCall={startCall} />}
          {screen === "contacts" && <ContactsScreen goBack={goBack} mode={mode} openMessages={() => navigate("messages")} startCall={startCall} />}
          {screen === "loading" && <LoadingScreen mode={mode} name={callName} />}
          {screen === "calling" && <CallingScreen mode={mode} name={callName} onEnd={() => setConfirmOpen(true)} />}
          {screen === "messages" && <MessagesScreen goBack={goBack} mode={mode} openRecording={() => navigate("recording")} />}
          {screen === "recording" && <RecordingScreen mode={mode} onCancel={goBack} onSend={sendVoice} />}
        </div>
        {!["calling", "loading", "recording"].includes(screen) && (
          <BottomNav active={screen} mode={mode} navigate={navigate} openHelp={() => setHelpOpen(true)} />
        )}
        {mode === "assisted" && !helpOpen && !["calling", "loading"].includes(screen) && (
          <Button ariaLabel="Open guided help" className="help-beacon" icon="help" onClick={() => setHelpOpen(true)} />
        )}
        {helpOpen && <HelpOverlay mode={mode} navigate={navigate} onClose={() => setHelpOpen(false)} />}
        {confirmOpen && <ConfirmationDialog mode={mode} onCancel={() => setConfirmOpen(false)} onConfirm={() => { setConfirmOpen(false); setScreen("home"); }} />}
        {toast && <div className="toast" role="status"><Icon name="check" /> {toast}</div>}
        <div className="home-indicator" />
      </div>
    </div>
  );
}

function ModeLabel({ mode }: { mode: Mode }) {
  return (
    <div className={`mode-label ${mode}`}>
      <strong>{mode === "simplified" ? "SIMPLIFIED MODE" : "ASSISTED MODE"}</strong>
      <span>{mode === "simplified" ? "RQ1 · RQ2" : "RQ3 · RQ4"}</span>
    </div>
  );
}

export default function App() {
  return (
    <main className="comparison-cover">
      <header className="cover-heading">
        <span>HCI RESEARCH PROJECT · GROUP 6</span>
        <h1>Dual-Mode<br />Mobile Prototype</h1>
        <p>Calling + Messaging App for Inclusive Communication</p>
      </header>

      <section aria-label="Comparison of the two prototype modes" className="comparison-stage">
        <div className="mode-column">
          <ModeLabel mode="simplified" />
          <PhonePrototype mode="simplified" />
        </div>

        <div className="versus" aria-hidden="true">
          <span />
          <strong>VS</strong>
          <span />
        </div>

        <div className="mode-column">
          <ModeLabel mode="assisted" />
          <PhonePrototype mode="assisted" />
        </div>
      </section>

      <footer className="cover-footer">
        <span><i className="simplified-dot" />60px targets · Text labels · No gestures</span>
        <span><i className="assisted-dot" />44px targets · Guided help · Multi-modal feedback</span>
      </footer>
    </main>
  );
}
