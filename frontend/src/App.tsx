import { FormEvent, ReactNode, useEffect, useState } from "react";
import {
    LiveKitRoom,
    VideoTrack,
    RoomAudioRenderer,
    useTracks,
    useLocalParticipant,
    useParticipants
} from "@livekit/components-react";
import { Track, VideoPreset, VideoPresets } from "livekit-client";

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL || "wss://gb-screen-2ey4imqq.livekit.cloud";

const RAW_API_URL = import.meta.env.VITE_API_URL || "https://gb-screen.onrender.com";
const API_BASE_URL = RAW_API_URL.endsWith("/api/rooms")
    ? RAW_API_URL
    : `${RAW_API_URL.replace(/\/$/, "")}/api/rooms`;

type IconName =
    | "arrow"
    | "check"
    | "copy"
    | "expand"
    | "github"
    | "heart"
    | "link"
    | "monitor"
    | "radio"
    | "settings"
    | "shield"
    | "spark"
    | "users"
    | "volumeHigh"
    | "volumeMute"
    | "x";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
    const paths: Record<IconName, ReactNode> = {
        arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        copy: <><rect width="13" height="13" x="9" y="9" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
        expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M16 3h3a2 2 0 0 1 2 2v3" /><path d="M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></>,
        github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.4 4 5 5 0 0 0 19.3.5S18.2.1 15 1.8a13.4 13.4 0 0 0-7 0C4.8.1 3.7.5 3.7.5A5 5 0 0 0 3.6 4a5.4 5.4 0 0 0-1.4 3.7c0 5.3 3.5 6.5 6.8 6.9a4.8 4.8 0 0 0-1 3.4v4" />,
        heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
        link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1" /></>,
        monitor: <><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></>,
        radio: <><circle cx="12" cy="12" r="2" /><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4" /><path d="M19.1 4.9a10 10 0 0 1 0 14.2M4.9 19.1a10 10 0 0 1 0-14.2" /></>,
        settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
        shield: <><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" /><path d="m9 12 2 2 4-4" /></>,
        spark: <path d="m13 2-2 7H4l6 4-2 9 9-11h-7l3-9Z" />,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
        volumeHigh: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>,
        volumeMute: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>,
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
                    disabled = false,
                    style,
                }: {
    children: ReactNode;
    kind?: "primary" | "danger" | "ghost";
    type?: "button" | "submit";
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`button button--${kind} ${className}`}
            style={{ ...style, ...(disabled ? { opacity: 0.65, cursor: "not-allowed" } : {}) }}
        >
            {children}
        </button>
    );
}

function TextInput({
                       value,
                       onChange,
                       placeholder = "Seu Nome ou Apelido"
                   }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <input
            aria-label="Seu nome ou apelido"
            autoComplete="name"
            className="text-input"
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            value={value}
        />
    );
}

function Brand({ role }: { role?: "Anfitrião" | "Espectador" }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="brand-wrap">
            <button
                className="brand"
                onClick={() => navigate("/")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0
                }}
            >
                {!imgError ? (
                    <img
                        src="/logo.png"
                        alt="GB Screen"
                        onError={() => setImgError(true)}
                        style={{ height: "34px", width: "auto" }}
                    />
                ) : (
                    <>
                        <span className="brand-mark"><Icon name="link" size={18} /></span>
                        <span style={{ fontSize: "20px", fontWeight: "bold", color: "#fff" }}>
                GB <span style={{ color: "#3b82f6" }}>Screen</span>
              </span>
                    </>
                )}
            </button>
            {role && <><span className="divider" /><span className="role-badge">{role}</span></>}
        </div>
    );
}

// Componente Modal de Doação (PIX)
function DonateModal({ onClose }: { onClose: () => void }) {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "grid",
            placeItems: "center",
            padding: "20px"
        }}>
            <div style={{
                background: "#0d1420",
                border: "1px solid #253247",
                borderRadius: "20px",
                padding: "24px",
                maxWidth: "380px",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                position: "relative"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "none",
                        border: "none",
                        color: "#94a3b8",
                        cursor: "pointer"
                    }}
                >
                    <Icon name="x" size={20} />
                </button>

                <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "rgba(239, 68, 68, 0.12)",
                    color: "#ef4444",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 14px"
                }}>
                    <Icon name="heart" size={26} />
                </div>

                <h3 style={{ margin: "0 0 6px", fontSize: "20px", color: "#fff" }}>Apoie o GB Screen</h3>
                <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 18px", lineHeight: 1.5 }}>
                    Se a plataforma te ajudou, faça uma contribuição PIX de qualquer valor para manter os servidores ativos!
                </p>

                <div style={{
                    background: "#ffffff",
                    padding: "12px",
                    borderRadius: "14px",
                    display: "inline-block",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                    marginBottom: "16px"
                }}>
                    <img src="/pix-qr.png" alt="QR Code PIX" style={{ width: "180px", height: "180px", display: "block" }} />
                </div>

                <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                    Escaneie o QR Code acima pelo app do seu banco. Obrigado pelo apoio!
                </p>
            </div>
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
    const [nameError, setNameError] = useState("");
    const [codeError, setCodeError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
    const [showDonateModal, setShowDonateModal] = useState(false);

    const loadingMessages = [
        "Ligando os motores...",
        "Conectando ao servidor...",
        "Preparando a sala privada...",
        "Quase lá, só mais alguns segundos..."
    ];

    useEffect(() => {
        let interval: number;
        if (loading) {
            interval = window.setInterval(() => {
                setLoadingMsgIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
        } else {
            setLoadingMsgIndex(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    async function createRoom(event: FormEvent) {
        event.preventDefault();
        setNameError("");

        if (!name.trim()) {
            setNameError("Por favor, digite seu nome antes de criar a sala.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(API_BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hostName: name.trim() }),
            });

            if (!res.ok) throw new Error("Falha ao criar sala no servidor.");

            const data = await res.json();
            sessionStorage.setItem(`lk_token_${data.roomId}`, data.token);
            sessionStorage.setItem(`lk_secret_${data.roomId}`, data.hostSecret);
            sessionStorage.setItem(`lk_ishost_${data.roomId}`, "true");

            navigate(`/room/${data.roomId}`);
        } catch {
            alert("O servidor backend está inicializando ou indisponível. Aguarde alguns segundos e tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    async function joinRoom(event: FormEvent) {
        event.preventDefault();
        setNameError("");
        setCodeError("");

        if (!name.trim()) {
            setNameError("Por favor, digite seu nome antes de entrar em uma sala.");
            return;
        }

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

        try {
            const res = await fetch(`${API_BASE_URL}/${normalizedCode}/join?guestName=${encodeURIComponent(name.trim())}`);

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
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Button
                        kind="ghost"
                        onClick={() => setShowDonateModal(true)}
                        style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                    >
                        <Icon name="heart" size={16} /> Apoiar Projeto
                    </Button>
                    <a className="github-link" href="https://github.com/gbdev7" target="_blank" rel="noreferrer">
                        <Icon name="github" size={17} /> GitHub
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
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
                        <label htmlFor="name">Seu Nome ou Apelido <span style={{ color: "#ef4444" }}>*</span></label>
                        <TextInput
                            value={name}
                            onChange={(val) => {
                                setName(val);
                                if (val.trim()) setNameError("");
                            }}
                            placeholder="Digite seu nome obrigatoriamente"
                        />
                        {nameError && <span className="join-error" style={{ color: "#ef4444" }}>{nameError}</span>}

                        <Button type="submit" className="create-button" disabled={loading}>
                            {loading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                    <span style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite"
                    }} />
                                    {loadingMessages[loadingMsgIndex]}
                  </span>
                            ) : (
                                <>Criar Sala Privada <Icon name="arrow" size={19} /></>
                            )}
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
                                disabled={loading}
                            />
                            <Button type="submit" kind="ghost" disabled={loading}>
                                {loading ? "..." : <>Conectar <Icon name="arrow" size={17} /></>}
                            </Button>
                        </div>
                        {codeError && <span className="join-error">{codeError}</span>}
                    </form>

                    {loading && (
                        <div style={{ marginTop: "16px", width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                                <div style={{
                                    height: "100%",
                                    width: "60%",
                                    background: "#3b82f6",
                                    borderRadius: "2px",
                                    animation: "loadingBar 2s ease-in-out infinite"
                                }} />
                            </div>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", display: "block", marginTop: "6px", textAlign: "center" }}>
                  {loadingMessages[loadingMsgIndex]}
                </span>
                        </div>
                    )}
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

            {/* Modal de Doação */}
            {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
        </main>
    );
}

function RoomHeader({
                        roomId,
                        isHost,
                        isSharing,
                        onToggleShare,
                        onToggleParticipants,
                        participantCount,
                        showParticipants,
                        onOpenDonate
                    }: {
    roomId: string;
    isHost: boolean;
    isSharing: boolean;
    onToggleShare: () => void;
    onToggleParticipants: () => void;
    participantCount: number;
    showParticipants: boolean;
    onOpenDonate: () => void;
}) {
    const [copied, setCopied] = useState(false);

    async function copyCodeOnly() {
        await navigator.clipboard?.writeText(roomId);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
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
            <button className="room-code" onClick={copyCodeOnly} aria-label="Copiar código da sala">
                <span className={copied ? "copied" : ""}><Icon name={copied ? "check" : "copy"} size={17} /></span>
                <span>Código: <strong>{roomId}</strong></span>
                <small>{copied ? "Copiado!" : "Copiar código"}</small>
            </button>

            <div className="header-actions">
                <Button kind="ghost" onClick={onOpenDonate} style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    <Icon name="heart" size={17} /> Apoiar
                </Button>

                <Button kind="ghost" onClick={onToggleParticipants} style={{ borderColor: showParticipants ? "#3b82f6" : undefined }}>
                    <Icon name="users" size={18} /> {participantCount} {participantCount === 1 ? "Pessoa" : "Pessoas"}
                </Button>

                {isHost && (
                    <>
                        <Button onClick={onToggleShare}>
                            <Icon name="radio" size={18} /> {isSharing ? "Parar Transmissão" : "Iniciar Transmissão"}
                        </Button>
                        <Button kind="danger" onClick={endRoom}>
                            <Icon name="x" size={18} /> Encerrar Sala
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}

function ParticipantsPanel({ onClose, isHost: currentUserIsHost }: { onClose: () => void; isHost: boolean }) {
    const participants = useParticipants();

    return (
        <aside style={{
            width: "280px",
            background: "#0d1420",
            border: "1px solid #253247",
            borderRadius: "18px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #253247", paddingBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Icon name="users" size={18} /> Espectadores ({participants.length})
                </h3>
                <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
                    <Icon name="x" size={18} />
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "400px", overflowY: "auto" }}>
                {participants.map((p) => {
                    const isParticipantHost = p.isLocal ? currentUserIsHost : (p.permissions?.canPublish === true && p.permissions?.canPublishData === true);

                    return (
                        <div key={p.sid} style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "8px 12px",
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.06)"
                        }}>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#f8fafc" }}>
                {p.name || p.identity.split("-")[0]}
              </span>

                            <span style={{
                                fontSize: "10px",
                                background: isParticipantHost ? "rgba(59, 130, 246, 0.2)" : "rgba(148, 163, 184, 0.12)",
                                color: isParticipantHost ? "#60a5fa" : "#94a3b8",
                                border: isParticipantHost ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid rgba(148, 163, 184, 0.2)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: 600
                            }}>
                {isParticipantHost ? "Anfitrião" : "Convidado"}
              </span>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

function StreamViewer({
                          isHost,
                          onStart,
                          selectedPreset,
                          onPresetChange
                      }: {
    isHost: boolean;
    onStart: () => void;
    selectedPreset: string;
    onPresetChange: (preset: string) => void;
}) {
    const tracks = useTracks([{ source: Track.Source.ScreenShare, withPlaceholder: false }]);
    const [volume, setVolume] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    useEffect(() => {
        const mediaElements = document.querySelectorAll("video, audio");
        mediaElements.forEach((el) => {
            if (el instanceof HTMLMediaElement) {
                el.volume = isMuted ? 0 : volume;
            }
        });
    }, [volume, isMuted, tracks]);

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
                    <Button onClick={onStart}>
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

            <div className="viewer-controls" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
                        title={isMuted ? "Desmutar" : "Mutar"}
                    >
                        <Icon name={isMuted || volume === 0 ? "volumeMute" : "volumeHigh"} size={18} />
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                        }}
                        style={{ width: "80px", cursor: "pointer" }}
                        title="Ajustar Volume"
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Icon name="settings" size={16} />
                    <select
                        value={selectedPreset}
                        onChange={(e) => onPresetChange(e.target.value)}
                        style={{
                            background: "rgba(255,255,255,0.12)",
                            color: "#fff",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            fontSize: "12px",
                            cursor: "pointer"
                        }}
                    >
                        <option value="1080p" style={{ color: "#000" }}>1080p · Alta (FHD)</option>
                        <option value="720p" style={{ color: "#000" }}>720p · Média (HD)</option>
                        <option value="480p" style={{ color: "#000" }}>480p · Baixa (Fluida)</option>
                    </select>
                </div>

                {!isHost && (
                    <Button kind="ghost" onClick={toggleFullscreen}>
                        <Icon name="expand" size={18} /> Tela cheia
                    </Button>
                )}
            </div>
        </>
    );
}

function RoomContent({ roomId, isHost }: { roomId: string; isHost: boolean }) {
    const { localParticipant } = useLocalParticipant();
    const screenShareTracks = useTracks([{ source: Track.Source.ScreenShare, withPlaceholder: false }]);
    const participants = useParticipants();

    const [selectedPreset, setSelectedPreset] = useState<string>("1080p");
    const [showParticipants, setShowParticipants] = useState<boolean>(false);
    const [showDonateModal, setShowDonateModal] = useState<boolean>(false);

    const isSharing = screenShareTracks.some(t => t.participant.identity === localParticipant.identity);

    function getPresetResolution(presetName: string): VideoPreset {
        switch (presetName) {
            case "720p":
                return VideoPresets.h720;
            case "480p":
                return VideoPresets.h480;
            case "1080p":
            default:
                return VideoPresets.h1080;
        }
    }

    async function handleToggleShare() {
        if (isSharing) {
            try {
                await localParticipant.setScreenShareEnabled(false);
            } catch (e) {
                console.error("Erro ao interromper compartilhamento:", e);
            }
        } else {
            try {
                await localParticipant.setScreenShareEnabled(true, {
                    audio: true,
                    resolution: getPresetResolution(selectedPreset)
                });
            } catch {
                try {
                    await localParticipant.setScreenShareEnabled(true, {
                        audio: false,
                        resolution: getPresetResolution(selectedPreset)
                    });
                } catch (e) {
                    console.error("Permissão negada ou falha ao capturar tela:", e);
                }
            }
        }
    }

    async function handlePresetChange(newPreset: string) {
        setSelectedPreset(newPreset);
        if (isSharing) {
            try {
                await localParticipant.setScreenShareEnabled(false);
                await localParticipant.setScreenShareEnabled(true, {
                    audio: true,
                    resolution: getPresetResolution(newPreset)
                });
            } catch (e) {
                console.error("Erro ao alterar qualidade durante a transmissão:", e);
            }
        }
    }

    return (
        <>
            <RoomHeader
                roomId={roomId}
                isHost={isHost}
                isSharing={isSharing}
                onToggleShare={handleToggleShare}
                onToggleParticipants={() => setShowParticipants(!showParticipants)}
                participantCount={participants.length}
                showParticipants={showParticipants}
                onOpenDonate={() => setShowDonateModal(true)}
            />
            <section className="room-main">
                <div className="room-meta">
                    <div>
                        <span className="room-kicker">{isHost ? "Sua sala privada" : "Transmissão compartilhada"}</span>
                        <h1>{isHost ? "Pronto para apresentar?" : "Sala de transmissão"}</h1>
                    </div>
                    <span className="connection connection--live"><i /> Conectado</span>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    <div className="player player--live" style={{ flex: 1 }}>
                        <StreamViewer
                            isHost={isHost}
                            onStart={handleToggleShare}
                            selectedPreset={selectedPreset}
                            onPresetChange={handlePresetChange}
                        />
                    </div>

                    {showParticipants && (
                        <ParticipantsPanel onClose={() => setShowParticipants(false)} isHost={isHost} />
                    )}
                </div>

                <p className="security-note">
                    <Icon name="shield" size={15} /> A transmissão é protegida e visível apenas para quem tem o código.
                </p>
            </section>

            {showDonateModal && <DonateModal onClose={() => setShowDonateModal(false)} />}
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

        let guestName = "";
        while (!guestName || !guestName.trim()) {
            const input = prompt("Digite obrigatoriamente seu nome para entrar na sala:");
            if (input === null) {
                navigate("/");
                return;
            }
            guestName = input.trim();
        }

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
            <RoomContent roomId={roomId} isHost={isHost} />
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