import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  RoomAudioRenderer,
  useTracks,
  useLocalParticipant
} from "@livekit/components-react";
import { Track } from "livekit-client";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://gb-screen-2ey4imqq.livekit.cloud";
const API_BASE_URL = "http://localhost:8080/api/rooms";

type IconName =
    | "arrow"
    | "check"
    | "copy"
    | "expand"
    | "github"
    | "link"
    | "monitor"
    | "radio"
    | "shield"
    | "spark"
    | "x";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    copy: <><rect width="13" height="13" x="9" y="9" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></>,
    github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.3 3.5 6.5 6.8 6.9a4.8 4.8 0 0 0-1 3.4v4" />,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></>,
    monitor: <><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></>,
    radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" /><path d="M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2" /></>,
    shield: <><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" /><path d="m9 12 2 2 4-4" /></>,
    spark: <path d="m13 2-2 7H4l6 4-2 9 9-11h-7l3-9Z" />,
    x: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return (
      <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[name]}
      </svg>
  );
}

function Button({
                  children,
                  kind = "primary",
                  type = "button",
                  onClick,
                  className = "",
                }: {
  children: ReactNode;
  kind?: "primary" | "danger" | "ghost";
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return <button type={type} onClick={onClick} className={`button button--${kind} ${className}`}>{children}</button>;
}

function TextInput({
                     value,
                     onChange,
                   }: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
      <input
          aria-label="Seu nome ou apelido"
          autoComplete="name"
          className="text-input"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Seu Nome ou Apelido"
          value={value}
      />
  );
}

function Brand({ role }: { role?: "Anfitrião" | "Espectador" }) {
  return (
      <div className="brand-wrap">
        <button className="brand" onClick={() => navigate("/")}>
          <span className="brand-mark"><Icon name="link" size={18} /></span>
          <span>GB <span>Screen</span></span>
        </button>
        {role && <><span className="divider" /><span className="role-badge">{role}</span></>}
      </div>
  );
}

function navigate(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function Landing() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: name.trim() || "Anfitrião" }),
      });

      if (!res.ok) throw new Error("Falha ao criar sala no servidor.");

      const data = await res.json();
      sessionStorage.setItem(`lk_token_${data.roomId}`, data.token);
      sessionStorage.setItem(`lk_secret_${data.roomId}`, data.hostSecret);
      sessionStorage.setItem(`lk_ishost_${data.roomId}`, "true");

      navigate(`/room/${data.roomId}`);
    } catch {
      alert("Erro ao conectar com o backend Spring Boot. Verifique se o servidor está rodando.");
    } finally {
      setLoading(false);
    }
  }

  async function joinRoom(event: FormEvent) {
    event.preventDefault();
    const normalizedCode = roomCode
        .trim()
        .replace(/^.*\/room\//, "")
        .split(/[?#/]/)[0]
        .replace(/[^a-zA-Z0-9_-]/g, "");

    if (!normalizedCode) {
      setCodeError("Digite um código de transmissão válido.");
      return;
    }

    setLoading(true);
    const guestName = name.trim() || "Espectador";

    try {
      const res = await fetch(`${API_BASE_URL}/${normalizedCode}/join?guestName=${encodeURIComponent(guestName)}`);

      if (!res.ok) {
        setCodeError("Sala não encontrada ou encerrada.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      sessionStorage.setItem(`lk_token_${normalizedCode}`, data.token);
      sessionStorage.setItem(`lk_ishost_${normalizedCode}`, "false");

      navigate(`/room/${normalizedCode}`);
    } catch {
      setCodeError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  const benefits: { icon: IconName; text: string }[] = [
    { icon: "check", text: "Sem instalação" },
    { icon: "shield", text: "Link criptografado" },
    { icon: "spark", text: "Latência mínima" },
  ];

  return (
      <main className="landing">
        <div className="ambient ambient--one" />
        <div className="ambient ambient--two" />
        <header className="landing-header">
          <Brand />
          <a className="github-link" href="https://github.com/gbdev7" target="_blank" rel="noreferrer">
            <Icon name="github" size={17} /> GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </header>

        <section className="hero">
          <div className="hero-icon">
            <span className="hero-icon__glow" />
            <Icon name="monitor" size={39} />
            <span className="hero-icon__status" />
          </div>
          <div className="eyebrow"><span /> Compartilhamento seguro em tempo real</div>
          <h1>Compartilhe sua tela<br />instantaneamente via <span>link privado</span></h1>
          <p className="hero-copy">Transmissão em tempo real de alta performance sem necessidade de instalação de software ou cadastro.</p>

          <div className="create-card">
            <form onSubmit={createRoom}>
              <label htmlFor="name">Como devemos chamar você?</label>
              <TextInput value={name} onChange={setName} />
              <Button type="submit" className="create-button">
                {loading ? "Criando..." : <>Criar Sala Privada <Icon name="arrow" size={19} /></>}
              </Button>
              <p className="form-note"><Icon name="shield" size={14} /> Sua sala é privada e expira automaticamente.</p>
            </form>

            <div className="form-divider"><span>ou entre em uma transmissão</span></div>

            <form className="join-form" onSubmit={joinRoom}>
              <label htmlFor="room-code">Código de transmissão</label>
              <div className="join-row">
                <input
                    id="room-code"
                    aria-label="Código de transmissão"
                    autoComplete="off"
                    className="text-input code-input"
                    onChange={(event) => {
                      setRoomCode(event.target.value);
                      setCodeError("");
                    }}
                    placeholder="Ex.: e9185203"
                    value={roomCode}
                />
                <Button type="submit" kind="ghost">
                  {loading ? "..." : <>Conectar <Icon name="arrow" size={17} /></>}
                </Button>
              </div>
              {codeError && <span className="join-error">{codeError}</span>}
            </form>
          </div>

          <div className="benefits">
            {benefits.map((benefit) => (
                <div className="benefit" key={benefit.text}>
                  <span><Icon name={benefit.icon} size={16} /></span>
                  {benefit.text}
                </div>
            ))}
          </div>
        </section>
        <footer className="landing-footer">ScreenLink <span>•</span> Compartilhamento simples. Colaboração instantânea.</footer>
      </main>
  );
}

function RoomHeader({
                      roomId,
                      isHost,
                    }: {
  roomId: string;
  isHost: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { localParticipant } = useLocalParticipant();
  const [isSharing, setIsSharing] = useState(false);

  async function copyInvite() {
    const url = `${window.location.origin}/room/${roomId}`;
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function toggleShare() {
    if (isSharing) {
      await localParticipant.setScreenShareEnabled(false);
      setIsSharing(false);
    } else {
      try {
        await localParticipant.setScreenShareEnabled(true, { audio: true });
        setIsSharing(true);
      } catch (e) {
        console.error("Permissão de tela negada ou erro ao capturar", e);
      }
    }
  }

  async function endRoom() {
    const secret = sessionStorage.getItem(`lk_secret_${roomId}`);
    try {
      await fetch(`${API_BASE_URL}/${roomId}/end`, {
        method: "POST",
        headers: { "X-Host-Secret": secret || "" },
      });
    } catch (e) {
      console.error(e);
    }
    sessionStorage.clear();
    navigate("/");
  }

  return (
      <header className="room-header">
        <Brand role={isHost ? "Anfitrião" : "Espectador"} />
        <button className="room-code" onClick={copyInvite} aria-label="Copiar link da sala">
          <span className={copied ? "copied" : ""}><Icon name={copied ? "check" : "copy"} size={17} /></span>
          <span>Sala: <strong>{roomId}</strong></span>
          <small>{copied ? "Copiado" : "Copiar convite"}</small>
        </button>
        {isHost && (
            <div className="header-actions">
              <Button onClick={toggleShare}>
                <Icon name="radio" size={18} /> {isSharing ? "Parar Transmissão" : "Iniciar Transmissão"}
              </Button>
              <Button kind="danger" onClick={endRoom}>
                <Icon name="x" size={18} /> Encerrar Sala
              </Button>
            </div>
        )}
      </header>
  );
}

function StreamViewer({ isHost }: { isHost: boolean }) {
  const tracks = useTracks([{ source: Track.Source.ScreenShare, withPlaceholder: false }]);
  const { localParticipant } = useLocalParticipant();

  function toggleFullscreen() {
    const element = document.querySelector(".player");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element?.requestFullscreen();
    }
  }

  if (tracks.length === 0) {
    return (
        <div className="empty-state">
          <div className="empty-visual">
            <span className="signal signal--one" />
            <span className="signal signal--two" />
            <span className="empty-icon"><Icon name="monitor" size={46} /></span>
          </div>
          <h2>{isHost ? "Sua tela ainda não está sendo compartilhada" : "Aguardando o anfitrião"}</h2>
          <p>
            {isHost
                ? "Clique em “Iniciar Transmissão” no topo para escolher o que deseja compartilhar."
                : "A transmissão aparecerá aqui assim que o anfitrião compartilhar a tela."}
          </p>
          {isHost && (
              <Button onClick={() => localParticipant.setScreenShareEnabled(true, { audio: true })}>
                <Icon name="radio" size={18} /> Iniciar agora
              </Button>
          )}
        </div>
    );
  }

  return (
      <>
        <VideoTrack trackRef={tracks[0]} className="livekit-video-track" />
        <div className="live-tag"><i /> Transmissão ao vivo</div>
        {!isHost && (
            <div className="viewer-controls">
              <span className="connection connection--live"><i /> Conexão estável</span>
              <Button kind="ghost" onClick={toggleFullscreen}><Icon name="expand" size={18} /> Tela cheia</Button>
            </div>
        )}
      </>
  );
}

function Room() {
  const roomId = window.location.pathname.split("/")[2] || "";
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  const isHost = sessionStorage.getItem(`lk_ishost_${roomId}`) === "true";

  useEffect(() => {
    const existingToken = sessionStorage.getItem(`lk_token_${roomId}`);
    if (existingToken) {
      setToken(existingToken);
      return;
    }

    const guestName = prompt("Como deseja ser chamado na sala?") || "Espectador";
    fetch(`${API_BASE_URL}/${roomId}/join?guestName=${encodeURIComponent(guestName)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Sala encerrada ou não encontrada.");
          return res.json();
        })
        .then((data) => setToken(data.token))
        .catch((err) => setError(err.message));
  }, [roomId]);

  if (error) {
    return (
        <main className="room-page">
          <div className="empty-state" style={{ marginTop: "100px" }}>
            <h2>Acesso Indisponível</h2>
            <p>{error}</p>
            <Button onClick={() => navigate("/")}>Voltar para o Início</Button>
          </div>
        </main>
    );
  }

  if (!token) {
    return (
        <main className="room-page">
          <div className="empty-state" style={{ marginTop: "100px" }}>
            <h2>Conectando à sala...</h2>
          </div>
        </main>
    );
  }

  return (
      <LiveKitRoom
          video={false}
          audio={false}
          token={token}
          serverUrl={LIVEKIT_URL}
          data-lk-theme="default"
          className="room-page"
      >
        <RoomHeader roomId={roomId} isHost={isHost} />
        <section className="room-main">
          <div className="room-meta">
            <div>
              <span className="room-kicker">{isHost ? "Sua sala privada" : "Transmissão compartilhada"}</span>
              <h1>{isHost ? "Pronto para apresentar?" : "Sala de transmissão"}</h1>
            </div>
            <span className="connection connection--live"><i /> Conectado</span>
          </div>

          <div className="player player--live">
            <StreamViewer isHost={isHost} />
          </div>
          <p className="security-note">
            <Icon name="shield" size={15} /> A transmissão é protegida e visível apenas para quem tem o link.
          </p>
        </section>
        <RoomAudioRenderer />
      </LiveKitRoom>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", updatePath);
    return () => window.removeEventListener("popstate", updatePath);
  }, []);

  return path.startsWith("/room/") ? <Room /> : <Landing />;
}