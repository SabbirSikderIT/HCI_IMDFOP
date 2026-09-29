import { useEffect, useState, type ReactNode } from "react";

type Mode = "simplified" | "assisted";
type Screen = "home" | "contacts" | "call" | "messages" | "recording" | "loading";
type IconName =
  | "home"
  | "phone"
  | "message"
  | "contacts"
  | "video"
  | "settings"
  | "help"
  | "back"
  | "mic"
  | "speaker"
  | "mute"
  | "send"
  | "close";

const contacts = [
  { name: "Maya Chen", initials: "MC", color: "coral", status: "Available" },
  { name: "Daniel Brooks", initials: "DB", color: "blue", status: "Last active 10 min ago" },
  { name: "Priya Shah", initials: "PS", color: "green", status: "Available" },
  { name: "Sam Wilson", initials: "SW", color: "violet", status: "Last active yesterday" },
];

const iconPaths: Record<IconName, ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V21h13V9.5M9.5 21v-7h5v7" />,
  phone: <path d="M6.7 3.5 10 7.3 8.3 9.5a15.6 15.6 0 0 0 6.2 6.2l2.2-1.7 3.8 3.3-1.3 3c-.3.7-1 1.1-1.8 1C9.8 19.8 4.2 14.2 2.7 6.6c-.2-.8.3-1.5 1-1.8l3-1.3Z" />,
  message: <path d="M4 4h16v12H9l-5 4V4Zm4 5h8M8 12h5" />,
  contacts: <path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-1a3 3 0 1 0 0-6m-13 17v-3a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v3m2-8a5 5 0 0 1 6 5v3" />,
  video: <path d="M3 6h13v12H3V6Zm13 4 5-3v10l-5-3v-4Z" />,
  settings: <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-12v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6-1.5 1.5m-9 9L6 18m12 0-1.5-1.5m-9-9L6 6" />,
  help: <path d="M9.5 9a2.7 2.7 0 1 1 4.7 1.8c-1.2 1.1-2.2 1.4-2.2 3.2m0 4v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  back: <path d="m14.5 5-7 7 7 7" />,
  mic: <path d="M8.5 6a3.5 3.5 0 0 1 7 0v6a3.5 3.5 0 0 1-7 0V6Zm-3 6a6.5 6.5 0 0 0 13 0M12 18.5V22m-3 0h6" />,
  speaker: <path d="M4 9h4l5-4v14l-5-4H4V9Zm12.5.5a4 4 0 0 1 0 5m2-7a7 7 0 0 1 0 9" />,
  mute: <path d="M4 9h4l5-4v14l-5-4H4V9Zm12-1 5 8m0-8-5 8" />,
  send: <path d="m3 4 18 8-18 8 3-8-3-8Zm3 8h15" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
};

function Icon({ name, size = "normal" }: { name: IconName; size?: "small" | "normal" | "large" }) {
  return (
    <svg className={`icon icon-${size}`} viewBox="0 0 24 24" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  size = "standard",
  icon,
  className = "",
  ariaLabel,
}: {
  children?: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "quiet" | "success";
  size?: "standard" | "large" | "icon" | "iconLarge";
  icon?: IconName;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

function Avatar({ contact, large = false }: { contact: (typeof contacts)[number]; large?: boolean }) {
  return <div className={`avatar avatar-${contact.color} ${large ? "avatar-large" : ""}`}>{contact.initials}</div>;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("simplified");
  const [screen, setScreen] = useState<Screen>("home");
  const [selected, setSelected] = useState(contacts[0]);
  const [helpOpen, setHelpOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sent, setSent] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const simplified = mode === "simplified";

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (screen !== "loading") return;
    const timer = window.setTimeout(() => setScreen("contacts"), 2200);
    return () => window.clearTimeout(timer);
  }, [screen]);

  const navigate = (next: Screen) => {
    setScreen(next);
    setConnected(false);
    setConfirmOpen(false);
  };

  const chooseContact = (contact: (typeof contacts)[number], destination: "call" | "messages") => {
    setSelected(contact);
    setScreen(destination);
  };

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setScreen("home");
    setHelpOpen(false);
  };

  return (
    <main className="app-shell">
      <section className="research-intro" aria-label="Prototype information">
        <div className="eyebrow">HCI research prototype</div>
        <h1>One app.<br />Two ways to connect.</h1>
        <p>
          Compare a low-complexity interface with an assisted experience designed to guide people as they go.
        </p>
        <div className="research-points">
          <div><strong>60</strong><span>pixel targets in Simplified Mode</span></div>
          <div><strong>44</strong><span>pixel targets in Assisted Mode</span></div>
        </div>
        <p className="hint">Switch modes in the phone to explore both interactive flows.</p>
      </section>

      <section className={`phone mode-${mode}`} aria-label={`${mode} communication app prototype`}>
        <div className="phone-top">
          <span>9:41</span>
          <span className="status-marks" aria-label="Full signal and battery">● ● ▰</span>
        </div>

        <div className="mode-switch" role="group" aria-label="Choose interface mode">
          <Button
            variant={simplified ? "primary" : "quiet"}
            onClick={() => changeMode("simplified")}
            className="mode-option"
          >
            Simplified
          </Button>
          <Button
            variant={!simplified ? "primary" : "quiet"}
            onClick={() => changeMode("assisted")}
            className="mode-option"
          >
            Assisted
          </Button>
        </div>

        <div className="screen">
          {screen === "home" && (
            <HomeScreen
              simplified={simplified}
              navigate={navigate}
              openHelp={() => setHelpOpen(true)}
            />
          )}
          {screen === "contacts" && (
            <ContactsScreen simplified={simplified} back={() => navigate("home")} choose={chooseContact} />
          )}
          {screen === "call" && (
            <CallScreen
              simplified={simplified}
              contact={selected}
              connected={connected}
              connect={() => setConnected(true)}
              end={() => setConfirmOpen(true)}
              back={() => navigate("contacts")}
            />
          )}
          {screen === "messages" && (
            <MessageScreen
              simplified={simplified}
              contact={selected}
              sent={sent}
              send={() => setSent(true)}
              record={() => navigate("recording")}
              back={() => navigate("home")}
            />
          )}
          {screen === "recording" && (
            <RecordingScreen
              simplified={simplified}
              recording={recording}
              seconds={seconds}
              toggle={() => setRecording((value) => !value)}
              cancel={() => {
                setRecording(false);
                setSeconds(0);
                navigate("messages");
              }}
              send={() => {
                setRecording(false);
                setSent(true);
                navigate("messages");
              }}
            />
          )}
          {screen === "loading" && <LoadingScreen simplified={simplified} />}
        </div>

        {screen !== "call" && screen !== "recording" && screen !== "loading" && (
          <BottomNav screen={screen} simplified={simplified} navigate={navigate} />
        )}

        {!simplified && !helpOpen && (
          <Button
            variant="primary"
            size="iconLarge"
            icon="help"
            className="help-beacon"
            onClick={() => setHelpOpen(true)}
            ariaLabel="Open guided help"
          />
        )}

        {helpOpen && <HelpOverlay close={() => setHelpOpen(false)} />}
        {confirmOpen && (
          <ConfirmDialog
            simplified={simplified}
            cancel={() => setConfirmOpen(false)}
            confirm={() => navigate("home")}
          />
        )}
      </section>
    </main>
  );
}

function ScreenHeader({ title, subtitle, back }: { title: string; subtitle?: string; back?: () => void }) {
  return (
    <header className="screen-header">
      {back && <Button variant="quiet" size="icon" icon="back" onClick={back} ariaLabel="Go back" />}
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}

function HomeScreen({
  simplified,
  navigate,
  openHelp,
}: {
  simplified: boolean;
  navigate: (screen: Screen) => void;
  openHelp: () => void;
}) {
  if (simplified) {
    const actions: { label: string; icon: IconName; action: () => void }[] = [
      { label: "Call", icon: "phone", action: () => navigate("loading") },
      { label: "Message", icon: "message", action: () => navigate("messages") },
      { label: "Video call", icon: "video", action: () => navigate("contacts") },
      { label: "Contacts", icon: "contacts", action: () => navigate("contacts") },
      { label: "Settings", icon: "settings", action: openHelp },
      { label: "Help", icon: "help", action: openHelp },
    ];
    return (
      <div className="home-screen">
        <div className="welcome">
          <div className="eyebrow">Good morning</div>
          <h2>What would you like to do?</h2>
        </div>
        <div className="action-grid">
          {actions.map((action) => (
            <Button key={action.label} variant="secondary" size="large" onClick={action.action}>
              <Icon name={action.icon} size="large" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
        <div className="reassurance"><span className="live-dot" /> All features are ready</div>
      </div>
    );
  }

  return (
    <div className="home-screen assisted-home">
      <div className="welcome">
        <div className="eyebrow">Tuesday, 14 May</div>
        <h2>Good morning, Alex</h2>
        <p>Who would you like to connect with?</p>
      </div>
      <button className="recent-contact" type="button" onClick={() => navigate("messages")}>
        <Avatar contact={contacts[0]} />
        <span><strong>{contacts[0].name}</strong><small>Thanks, speak soon! · 9:32</small></span>
        <span className="chevron">›</span>
      </button>
      <div className="section-label">Quick actions</div>
      <div className="quick-actions">
        <Button variant="secondary" onClick={() => navigate("contacts")} icon="phone">New call</Button>
        <Button variant="secondary" onClick={() => navigate("messages")} icon="message">Message</Button>
      </div>
      <div className="assist-tip">
        <Icon name="help" />
        <div><strong>Need a hand?</strong><p>Tap the blue help button for guided steps.</p></div>
      </div>
    </div>
  );
}

function ContactsScreen({
  simplified,
  back,
  choose,
}: {
  simplified: boolean;
  back: () => void;
  choose: (contact: (typeof contacts)[number], destination: "call" | "messages") => void;
}) {
  return (
    <div className="content-screen">
      <ScreenHeader title="Contacts" subtitle={simplified ? "Choose someone to call" : "4 people"} back={back} />
      <div className="contact-list">
        {contacts.map((contact) => (
          <div className="contact-card" key={contact.name}>
            {!simplified && <Avatar contact={contact} />}
            <div className="contact-info">
              <strong>{contact.name}</strong>
              {!simplified && <span>{contact.status}</span>}
            </div>
            <div className="contact-actions">
              <Button
                variant="success"
                size={simplified ? "large" : "icon"}
                icon="phone"
                onClick={() => choose(contact, "call")}
                ariaLabel={`Call ${contact.name}`}
              >
                {simplified ? "Call" : undefined}
              </Button>
              {!simplified && (
                <Button
                  variant="secondary"
                  size="icon"
                  icon="message"
                  onClick={() => choose(contact, "messages")}
                  ariaLabel={`Message ${contact.name}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CallScreen({
  simplified,
  contact,
  connected,
  connect,
  end,
  back,
}: {
  simplified: boolean;
  contact: (typeof contacts)[number];
  connected: boolean;
  connect: () => void;
  end: () => void;
  back: () => void;
}) {
  return (
    <div className="call-screen">
      <Button variant="quiet" size="icon" icon="back" onClick={back} className="call-back" ariaLabel="Go back" />
      <div className={`call-rings ${connected ? "is-connected" : ""}`}>
        <Avatar contact={contact} large />
      </div>
      <h2>{contact.name}</h2>
      <p className="call-status">{connected ? "Connected · 00:24" : "Ready to call"}</p>
      {!simplified && (
        <div className="call-tools">
          <div><Button variant="secondary" size="iconLarge" icon="mute" ariaLabel="Mute" /><span>Mute</span></div>
          <div><Button variant="secondary" size="iconLarge" icon="speaker" ariaLabel="Speaker" /><span>Speaker</span></div>
        </div>
      )}
      <div className="call-main-actions">
        {!connected && <Button variant="success" size="large" icon="phone" onClick={connect}>Start call</Button>}
        <Button variant="danger" size="large" icon="phone" onClick={end}>End call</Button>
      </div>
      <p className="feedback-note">{connected ? "Sound is on. The call is connected." : "You will feel a vibration when they answer."}</p>
    </div>
  );
}

function MessageScreen({
  simplified,
  contact,
  sent,
  send,
  record,
  back,
}: {
  simplified: boolean;
  contact: (typeof contacts)[number];
  sent: boolean;
  send: () => void;
  record: () => void;
  back: () => void;
}) {
  return (
    <div className="content-screen message-screen">
      <ScreenHeader title={contact.name} subtitle="Online now" back={back} />
      <div className="messages">
        <div className="bubble received">Hi Alex, are we still calling today?<small>9:28</small></div>
        <div className="bubble sent">Yes, I&apos;ll call you after lunch.<small>9:31 · Read</small></div>
        <div className="bubble received">Perfect, speak soon!<small>9:32</small></div>
        {sent && <div className="bubble sent new-message">Sounds good!<small>Now · ✓✓ Delivered</small></div>}
      </div>
      <div className={`composer ${simplified ? "composer-simple" : ""}`}>
        <label className="message-input">
          <span className="sr-only">Message</span>
          <input defaultValue="Sounds good!" aria-label="Write a message" />
        </label>
        <Button variant="primary" size={simplified ? "large" : "icon"} icon="send" onClick={send}>
          {simplified ? "Send" : undefined}
        </Button>
      </div>
      <Button variant="secondary" size={simplified ? "large" : "standard"} icon="mic" onClick={record} className="voice-button">
        Voice message
      </Button>
    </div>
  );
}

function RecordingScreen({
  simplified,
  recording,
  seconds,
  toggle,
  cancel,
  send,
}: {
  simplified: boolean;
  recording: boolean;
  seconds: number;
  toggle: () => void;
  cancel: () => void;
  send: () => void;
}) {
  const display = `00:${String(seconds).padStart(2, "0")}`;
  return (
    <div className="record-screen">
      <div className="eyebrow">Voice message</div>
      <h2>{recording ? "Recording…" : "Ready to record"}</h2>
      <p>{recording ? "Speak clearly. Tap again when finished." : "Tap the microphone to begin."}</p>
      <div className={`waveform ${recording ? "is-recording" : ""}`} aria-label="Audio waveform">
        {[2, 5, 8, 4, 10, 6, 9, 3, 7, 5, 8, 4].map((height, index) => (
          <i key={index} style={{ "--bar": height } as React.CSSProperties} />
        ))}
      </div>
      <div className="record-time">{display}</div>
      <Button
        variant={recording ? "danger" : "primary"}
        size="iconLarge"
        icon={recording ? "close" : "mic"}
        onClick={toggle}
        className="record-main"
        ariaLabel={recording ? "Stop recording" : "Start recording"}
      />
      <div className="record-actions">
        <Button variant="secondary" size={simplified ? "large" : "standard"} onClick={cancel}>Cancel</Button>
        <Button variant="primary" size={simplified ? "large" : "standard"} onClick={send}>Send</Button>
      </div>
      <p className="feedback-note">A vibration confirms when recording starts and stops.</p>
    </div>
  );
}

function LoadingScreen({ simplified }: { simplified: boolean }) {
  return (
    <div className="loading-screen">
      {simplified ? <div className="pulse-loader"><Icon name="contacts" size="large" /></div> : <div className="spinner" />}
      <h2>{simplified ? "Loading contacts…" : "Loading…"}</h2>
      <p>{simplified ? "Please wait. Your phone will vibrate when ready." : "Sound is on. We’ll let you know when it’s ready."}</p>
      <div className="progress-track"><div className="progress-fill" /></div>
      <div className="sound-indicator"><Icon name="speaker" /> Sound and vibration enabled</div>
    </div>
  );
}

function BottomNav({ screen, simplified, navigate }: { screen: Screen; simplified: boolean; navigate: (screen: Screen) => void }) {
  const items: { label: string; icon: IconName; screen: Screen }[] = [
    { label: "Home", icon: "home", screen: "home" },
    { label: "Calls", icon: "phone", screen: "contacts" },
    { label: "Messages", icon: "message", screen: "messages" },
    { label: "Contacts", icon: "contacts", screen: "contacts" },
  ];
  return (
    <nav className={`bottom-nav ${simplified ? "bottom-nav-simple" : ""}`} aria-label="Main navigation">
      {items.map((item) => (
        <Button
          key={item.label}
          variant={screen === item.screen ? "primary" : "quiet"}
          onClick={() => navigate(item.screen)}
          className="nav-item"
          ariaLabel={item.label}
        >
          <Icon name={item.icon} />
          <span>{item.label}</span>
        </Button>
      ))}
    </nav>
  );
}

function HelpOverlay({ close }: { close: () => void }) {
  return (
    <div className="overlay">
      <div className="help-sheet" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <div className="sheet-handle" />
        <div className="help-heading">
          <div className="help-icon"><Icon name="help" /></div>
          <div><div className="eyebrow">Guided help</div><h2 id="help-title">How can we help?</h2></div>
        </div>
        <div className="help-step"><span>1</span><div><strong>Choose a feature</strong><p>Start with Call, Message, or Contacts.</p></div></div>
        <div className="help-step"><span>2</span><div><strong>Follow the highlights</strong><p>We&apos;ll show you exactly what to tap next.</p></div></div>
        <div className="help-step"><span>3</span><div><strong>Get confirmation</strong><p>You&apos;ll see, hear, and feel when it works.</p></div></div>
        <Button variant="primary" size="large" onClick={close}>Got it, show me</Button>
      </div>
    </div>
  );
}

function ConfirmDialog({ simplified, cancel, confirm }: { simplified: boolean; cancel: () => void; confirm: () => void }) {
  return (
    <div className="overlay centered">
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="confirm-mark">?</div>
        <h2 id="confirm-title">End this call?</h2>
        <p>You will return to the home screen.</p>
        <div className="confirm-actions">
          <Button variant="secondary" size={simplified ? "large" : "standard"} onClick={cancel}>No, go back</Button>
          <Button variant="danger" size={simplified ? "large" : "standard"} onClick={confirm}>Yes, end call</Button>
        </div>
      </div>
    </div>
  );
}
