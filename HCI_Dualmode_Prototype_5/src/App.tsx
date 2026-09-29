import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react"

type Mode = "simplified" | "assisted"
type Screen = "home" | "videos" | "search" | "favorites" | "history" | "settings" | "help" | "player" | "loading"
type IconName = "arrow" | "check" | "clock" | "expand" | "heart" | "help" | "history" | "home" | "pause" | "play" | "search" | "settings" | "spark" | "video" | "volume" | "volumeDown" | "volumeUp" | "x"

const photos = {
  valley:
    "https://images.unsplash.com/photo-1663091084034-7f28d532b131?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1080",
  lake: "https://images.unsplash.com/photo-1691530255958-fd99ec546a1c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1080",
  cooking:
    "https://images.unsplash.com/photo-1635321593217-40050ad13c74?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1080",
  guitar:
    "https://images.unsplash.com/photo-1741229395001-6d8d2a97f05e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=86&w=1080",
}

const videos = [
  {
    id: 1,
    title: "A quiet morning in the valley",
    category: "Nature",
    duration: "8:24",
    image: photos.valley,
    views: "14K views",
  },
  {
    id: 2,
    title: "Easy garden-to-table lunch",
    category: "Cooking",
    duration: "12:08",
    image: photos.cooking,
    views: "8.2K views",
  },
  {
    id: 3,
    title: "Acoustic sessions: slow afternoons",
    category: "Music",
    duration: "5:46",
    image: photos.guitar,
    views: "21K views",
  },
  {
    id: 4,
    title: "Still water, clear mind",
    category: "Wellbeing",
    duration: "10:15",
    image: photos.lake,
    views: "11K views",
  },
]

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="m15 18-6-6 6-6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    expand: <><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" /></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 3.9 1.9c-1 .7-1.6 1.2-1.6 2.6M12 17h.01" /></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    pause: <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>,
    play: <><path d="m8 5 11 7-11 7V5Z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    spark: <><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3ZM5 15l.7 2.3L8 18.5l-2.3 1.2L5 22l-.7-2.3L2 18.5l2.3-1.2L5 15ZM19 14l.7 2.3 2.3 1.2-2.3 1.2L19 21l-.7-2.3-2.3-1.2 2.3-1.2L19 14Z" /></>,
    video: <><rect x="3" y="5" width="14" height="14" rx="2" /><path d="m17 10 4-2v8l-4-2" /></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
    volumeDown: <><path d="M11 5 6 9H3v6h3l5 4V5ZM15 10a3 3 0 0 1 0 4" /></>,
    volumeUp: <><path d="M11 5 6 9H3v6h3l5 4V5ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
    x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function Text({
  as = "p",
  className = "",
  children,
}: {
  as?: "p" | "span" | "h1" | "h2" | "h3"
  className?: string
  children: ReactNode
}) {
  const Tag = as
  return <Tag className={className}>{children}</Tag>
}

function Button({
  children,
  icon,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
  disabled = false,
  ariaLabel,
}: {
  children?: ReactNode
  icon?: IconName
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "icon" | "nav" | "danger"
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      aria-label={ariaLabel}
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {icon && <Icon name={icon} />}
      {children && <span>{children}</span>}
    </button>
  )
}

function Header({
  title,
  eyebrow,
  canGoBack,
  onBack,
}: {
  title: string
  eyebrow?: string
  canGoBack?: boolean
  onBack: () => void
}) {
  return (
    <header className="app-header">
      {canGoBack && (
        <Button ariaLabel="Go back" icon="arrow" onClick={onBack} variant="icon" />
      )}
      <div className="app-header__titles">
        {eyebrow && <Text className="eyebrow">{eyebrow}</Text>}
        <Text as="h1" className="page-title">{title}</Text>
      </div>
      <div className="brand-mark" aria-label="Streamly">
        <Icon name="play" size={18} />
      </div>
    </header>
  )
}

function VideoCard({
  video,
  mode,
  onPlay,
  favorite,
  onFavorite,
}: {
  video: typeof videos[number]
  mode: Mode
  onPlay: () => void
  favorite: boolean
  onFavorite: () => void
}) {
  return (
    <article className={`video-card video-card--${mode}`}>
      <div className="video-card__visual">
        <img alt="" src={video.image} />
        <Text className="duration">{video.duration}</Text>
      </div>
      <div className="video-card__body">
        <div className="video-card__copy">
          <Text as="h3" className="card-title">{video.title}</Text>
          <Text className="meta">{video.category} · {video.views}</Text>
        </div>
        <div className="video-card__actions">
          <Button
            ariaLabel={favorite ? "Remove from favorites" : "Add to favorites"}
            className={favorite ? "is-favorite" : ""}
            icon="heart"
            onClick={onFavorite}
            variant="icon"
          />
          <Button icon="play" onClick={onPlay} variant="primary">
            {mode === "simplified" ? "Play video" : "Play"}
          </Button>
        </div>
      </div>
    </article>
  )
}

function Home({
  mode,
  navigate,
}: {
  mode: Mode
  navigate: (screen: Screen) => void
}) {
  const options: { label: string; note: string; icon: IconName; screen: Screen }[] = [
    { label: "Watch videos", note: "Browse something new", icon: "video", screen: "videos" },
    { label: "Search", note: "Find a video", icon: "search", screen: "search" },
    { label: "Favorites", note: "Videos you saved", icon: "heart", screen: "favorites" },
    { label: "History", note: "Watch again", icon: "history", screen: "history" },
    { label: "Settings", note: "Adjust your experience", icon: "settings", screen: "settings" },
    { label: "Help", note: "Get step-by-step help", icon: "help", screen: "help" },
  ]

  return (
    <main className="screen screen--home">
      <section className="hero-card">
        <div>
          <Text className="eyebrow">
            {mode === "simplified" ? "Simple and clear" : "Your personal feed"}
          </Text>
          <Text as="h2" className="hero-title">What would you like to do?</Text>
        </div>
        <div className="hero-card__art">
          <Icon name="spark" size={34} />
        </div>
      </section>
      {mode === "simplified" ? (
        <section className="simple-grid" aria-label="Main menu">
          {options.map((item) => (
            <Button
              className="menu-button"
              key={item.screen}
              onClick={() => navigate(item.screen)}
              variant="secondary"
            >
              {item.label}
            </Button>
          ))}
        </section>
      ) : (
        <section className="assisted-list" aria-label="Main menu">
          {options.slice(0, 4).map((item) => (
            <button className="list-row" key={item.screen} onClick={() => navigate(item.screen)}>
              <span className="list-row__icon"><Icon name={item.icon} /></span>
              <span className="list-row__copy">
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
              <Icon name="arrow" />
            </button>
          ))}
        </section>
      )}
      <section className="continue-card">
        <img alt="" src={photos.lake} />
        <div className="continue-card__overlay">
          <Text className="eyebrow">Continue watching</Text>
          <Text as="h3">Still water, clear mind</Text>
          <Button icon="play" onClick={() => navigate("loading")} variant="primary">
            Continue
          </Button>
        </div>
      </section>
    </main>
  )
}

function VideoList({
  mode,
  list = videos,
  favorites,
  onFavorite,
  onPlay,
  emptyLabel,
}: {
  mode: Mode
  list?: typeof videos
  favorites: number[]
  onFavorite: (id: number) => void
  onPlay: (video: typeof videos[number]) => void
  emptyLabel?: string
}) {
  if (!list.length) {
    return (
      <main className="screen empty-state">
        <div className="empty-state__icon"><Icon name="heart" size={32} /></div>
        <Text as="h2">{emptyLabel ?? "Nothing here yet"}</Text>
        <Text>Save a video and it will appear here.</Text>
      </main>
    )
  }
  return (
    <main className="screen video-list">
      <div className="filter-row">
        <span className="filter-chip filter-chip--active">For you</span>
        <span className="filter-chip">Relax</span>
        <span className="filter-chip">Learn</span>
        <span className="filter-chip">Music</span>
      </div>
      {list.map((video) => (
        <VideoCard
          favorite={favorites.includes(video.id)}
          key={video.id}
          mode={mode}
          onFavorite={() => onFavorite(video.id)}
          onPlay={() => onPlay(video)}
          video={video}
        />
      ))}
    </main>
  )
}

function SearchScreen({
  mode,
  query,
  setQuery,
  results,
  favorites,
  onFavorite,
  onPlay,
}: {
  mode: Mode
  query: string
  setQuery: (value: string) => void
  results: typeof videos
  favorites: number[]
  onFavorite: (id: number) => void
  onPlay: (video: typeof videos[number]) => void
}) {
  const submit = (event: FormEvent) => event.preventDefault()
  return (
    <main className="screen search-screen">
      <form className="search-form" onSubmit={submit}>
        <label htmlFor={`video-search-${mode}`}>Search videos</label>
        <div className="search-control">
          <Icon name="search" />
          <input
            id={`video-search-${mode}`}
            onChange={(event) => setQuery(event.target.value)}
            placeholder='Try "nature" or "music"'
            value={query}
          />
          {query && (
            <Button ariaLabel="Clear search" icon="x" onClick={() => setQuery("")} variant="icon" />
          )}
        </div>
        {mode === "simplified" && (
          <Button icon="search" type="submit">Search videos</Button>
        )}
      </form>
      {!query ? (
        <section className="recent-searches">
          <Text className="section-label">Recent searches</Text>
          {["Calm nature", "Easy recipes", "Guitar music"].map((term) => (
            <button
              className="recent-row"
              key={term}
              onClick={() => setQuery(term.split(" ")[0])}
            >
              <Icon name="history" />
              <span>{term}</span>
            </button>
          ))}
        </section>
      ) : (
        <VideoList
          emptyLabel="No videos match that search"
          favorites={favorites}
          list={results}
          mode={mode}
          onFavorite={onFavorite}
          onPlay={onPlay}
        />
      )}
    </main>
  )
}

function Player({
  mode,
  video,
  onBack,
}: {
  mode: Mode
  video: typeof videos[number]
  onBack: () => void
}) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(60)
  const [fullscreen, setFullscreen] = useState(false)
  return (
    <main className={`player ${fullscreen ? "player--fullscreen" : ""}`}>
      <div className="player__visual">
        <img alt={`Video preview for ${video.title}`} src={video.image} />
        <div className="player__shade" />
        <Button ariaLabel="Go back" className="player__back" icon="arrow" onClick={onBack} variant="icon" />
        <button
          aria-label={playing ? "Pause video" : "Play video"}
          className="player__center"
          onClick={() => setPlaying(!playing)}
        >
          <Icon name={playing ? "pause" : "play"} size={32} />
        </button>
        <Text className="player__status">
          {playing ? "Playing" : "Paused"} · 0:42 / {video.duration}
        </Text>
      </div>
      <section className="player__content">
        <div>
          <Text className="eyebrow">{video.category}</Text>
          <Text as="h1" className="player__title">{video.title}</Text>
          <Text className="meta">{video.views} · Added this week</Text>
        </div>
        <div className="timeline"><span /></div>
        <div className={`player-controls player-controls--${mode}`}>
          <Button icon={playing ? "pause" : "play"} onClick={() => setPlaying(!playing)} variant="primary">
            {playing ? "Pause" : "Play"}
          </Button>
          <Button
            ariaLabel="Volume down"
            icon="volumeDown"
            onClick={() => setVolume(Math.max(0, volume - 20))}
            variant="secondary"
          >
            {mode === "simplified" ? "Volume down" : undefined}
          </Button>
          <Button
            ariaLabel="Volume up"
            icon="volumeUp"
            onClick={() => setVolume(Math.min(100, volume + 20))}
            variant="secondary"
          >
            {mode === "simplified" ? "Volume up" : undefined}
          </Button>
          <Button
            ariaLabel="Toggle fullscreen"
            icon="expand"
            onClick={() => setFullscreen(!fullscreen)}
            variant="secondary"
          >
            {mode === "simplified" ? "Full screen" : undefined}
          </Button>
        </div>
        <div className="volume-feedback">
          <Icon name="volume" />
          <div className="volume-feedback__track">
            <span className={`volume-${volume}`} />
          </div>
          <Text>{volume}%</Text>
        </div>
      </section>
    </main>
  )
}

function Loading({ mode }: { mode: Mode }) {
  return (
    <main className={`loading-screen loading-screen--${mode}`}>
      <div className="loading-screen__visual">
        <div className="loading-ring"><Icon name="play" size={28} /></div>
        <div className="sound-wave">
          <span /><span /><span /><span />
        </div>
      </div>
      <Text as="h1">
        {mode === "simplified" ? "Loading... Please wait" : "Getting your video ready"}
      </Text>
      <Text>
        {mode === "simplified"
          ? "Your phone will vibrate when it is ready."
          : "We'll play a sound when it's ready."}
      </Text>
      <div className="loading-bar"><span /></div>
      <div className="feedback-pill">
        <Icon name={mode === "simplified" ? "volume" : "check"} /> Visual + sound feedback on
      </div>
    </main>
  )
}

function Settings({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  return (
    <main className="screen settings-screen">
      <Text className="section-label">Experience</Text>
      <section className="setting-card">
        <button
          className={mode === "simplified" ? "setting-option is-selected" : "setting-option"}
          onClick={() => onModeChange("simplified")}
        >
          <span>
            <strong>Simplified mode</strong>
            <small>60px targets and text labels</small>
          </span>
          {mode === "simplified" && <Icon name="check" />}
        </button>
        <button
          className={mode === "assisted" ? "setting-option is-selected" : "setting-option"}
          onClick={() => onModeChange("assisted")}
        >
          <span>
            <strong>Assisted mode</strong>
            <small>44px targets and guided help</small>
          </span>
          {mode === "assisted" && <Icon name="check" />}
        </button>
      </section>
      <Text className="section-label">Accessibility</Text>
      <section className="setting-card">
        <div className="setting-summary">
          <Icon name="check" />
          <span>
            <strong>High contrast</strong>
            <small>Meets WCAG AAA for essential text</small>
          </span>
        </div>
        <div className="setting-summary">
          <Icon name="check" />
          <span>
            <strong>Feedback cues</strong>
            <small>Sound and vibration indicators are enabled</small>
          </span>
        </div>
      </section>
    </main>
  )
}

function HelpOverlay({ onClose, onBrowse }: { onClose: () => void; onBrowse: () => void }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="help-title">
      <button aria-label="Close help" className="overlay__backdrop" onClick={onClose} />
      <section className="help-sheet">
        <div className="help-sheet__header">
          <div className="help-sheet__icon"><Icon name="spark" /></div>
          <Button ariaLabel="Close help" icon="x" onClick={onClose} variant="icon" />
        </div>
        <Text className="eyebrow">Guided help · Step 1 of 3</Text>
        <Text as="h2" id="help-title">Let's find a video together</Text>
        <Text>
          Start by opening the video library. We'll stay with you and explain the next step.
        </Text>
        <div className="guide-card">
          <span>1</span>
          <div>
            <strong>Tap "Watch videos"</strong>
            <small>This opens a list of videos chosen for you.</small>
          </div>
        </div>
        <Button icon="video" onClick={onBrowse}>Show me the videos</Button>
        <Button onClick={onClose} variant="ghost">I can do this myself</Button>
      </section>
    </div>
  )
}

function BottomNav({ active, navigate }: { active: Screen; navigate: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; icon: IconName }[] = [
    { screen: "home", label: "Home", icon: "home" },
    { screen: "videos", label: "Browse", icon: "video" },
    { screen: "search", label: "Search", icon: "search" },
    { screen: "favorites", label: "Saved", icon: "heart" },
    { screen: "history", label: "History", icon: "history" },
  ]
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {items.map((item) => (
        <Button
          className={active === item.screen ? "is-active" : ""}
          icon={item.icon}
          key={item.screen}
          onClick={() => navigate(item.screen)}
          variant="nav"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  )
}

function AppInstance({ mode }: { mode: Mode }) {
  const [screen, setScreen] = useState<Screen>("home")
  const [navHistory, setNavHistory] = useState<Screen[]>([])
  const [selectedVideo, setSelectedVideo] = useState(videos[0])
  const [favorites, setFavorites] = useState<number[]>([1, 3])
  const [query, setQuery] = useState("")
  const [helpOpen, setHelpOpen] = useState(false)

  const navigate = (next: Screen) => {
    setNavHistory((items) => [...items, screen])
    setScreen(next)
  }
  const back = () => {
    const previous = navHistory.at(-1) ?? "home"
    setNavHistory((items) => items.slice(0, -1))
    setScreen(previous)
  }
  const play = (video: typeof videos[number]) => {
    setSelectedVideo(video)
    navigate("loading")
  }
  const toggleFavorite = (id: number) =>
    setFavorites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    )

  useEffect(() => {
    if (screen !== "loading") return
    const timer = window.setTimeout(() => setScreen("player"), 1800)
    return () => window.clearTimeout(timer)
  }, [screen])

  const results = useMemo(() => {
    const normalized = query.toLowerCase()
    return videos.filter((video) =>
      `${video.title} ${video.category}`.toLowerCase().includes(normalized),
    )
  }, [query])

  const labels: Record<Screen, string> = {
    home: "Hello, Alex",
    videos: "Browse videos",
    search: "Find a video",
    favorites: "Your favorites",
    history: "Watch history",
    settings: "Settings",
    help: "Help center",
    player: selectedVideo.title,
    loading: "Loading",
  }
  const favoritesList = videos.filter((video) => favorites.includes(video.id))
  const historyList = [videos[3], videos[0], videos[2]]

  let content: ReactNode
  if (screen === "home")
    content = (
      <Home
        mode={mode}
        navigate={(next) => (next === "help" ? setHelpOpen(true) : navigate(next))}
      />
    )
  else if (screen === "videos")
    content = (
      <VideoList favorites={favorites} mode={mode} onFavorite={toggleFavorite} onPlay={play} />
    )
  else if (screen === "favorites")
    content = (
      <VideoList
        emptyLabel="No favorites yet"
        favorites={favorites}
        list={favoritesList}
        mode={mode}
        onFavorite={toggleFavorite}
        onPlay={play}
      />
    )
  else if (screen === "history")
    content = (
      <VideoList
        favorites={favorites}
        list={historyList}
        mode={mode}
        onFavorite={toggleFavorite}
        onPlay={play}
      />
    )
  else if (screen === "search")
    content = (
      <SearchScreen
        favorites={favorites}
        mode={mode}
        onFavorite={toggleFavorite}
        onPlay={play}
        query={query}
        results={results}
        setQuery={setQuery}
      />
    )
  else if (screen === "settings")
    content = <Settings mode={mode} onModeChange={() => {}} />
  else if (screen === "help")
    content = (
      <main className="screen">
        <section className="help-page">
          <Icon name="help" size={34} />
          <Text as="h2">We're here to help</Text>
          <Text>
            Get step-by-step guidance for browsing, searching, and playing videos.
          </Text>
          <Button onClick={() => setHelpOpen(true)}>Start guided help</Button>
        </section>
      </main>
    )
  else content = null

  const fullScreen = screen === "player" || screen === "loading"

  return (
    <div className={`phone-shell mode-${mode}`}>
      {screen === "player" && <Player mode={mode} onBack={back} video={selectedVideo} />}
      {screen === "loading" && <Loading mode={mode} />}
      {!fullScreen && (
        <>
          <Header
            canGoBack={screen !== "home"}
            eyebrow={
              screen === "home"
                ? mode === "simplified"
                  ? "Simplified mode"
                  : "Assisted mode"
                : undefined
            }
            onBack={back}
            title={labels[screen]}
          />
          <div className="scroll-area">{content}</div>
          <BottomNav active={screen} navigate={navigate} />
          {mode === "assisted" && (
            <Button
              ariaLabel="Open guided help"
              className="help-beacon"
              icon="help"
              onClick={() => setHelpOpen(true)}
              variant="icon"
            />
          )}
        </>
      )}
      {helpOpen && (
        <HelpOverlay
          onBrowse={() => {
            setHelpOpen(false)
            navigate("videos")
          }}
          onClose={() => setHelpOpen(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <div className="app-stage">
      <div className="dual-label dual-label--simplified">
        <div className="dual-badge dual-badge--simplified">
          <Icon name="spark" size={14} />
          <span>Simplified Mode</span>
        </div>
        <p className="dual-desc">60px targets · text labels · extra-large controls</p>
      </div>
      <AppInstance mode="simplified" />
      <div className="dual-divider" aria-hidden="true">
        <span />
        <div className="dual-vs">vs</div>
        <span />
      </div>
      <AppInstance mode="assisted" />
      <div className="dual-label dual-label--assisted">
        <div className="dual-badge dual-badge--assisted">
          <Icon name="help" size={14} />
          <span>Assisted Mode</span>
        </div>
        <p className="dual-desc">44px targets · floating help beacon · guided overlays</p>
      </div>
    </div>
  )
}
