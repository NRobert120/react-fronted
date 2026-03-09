import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const WORKERS = [
  { _id: "1", username: "Jean Pierre", avatar: "JP", online: true, zone: "Zone A" },
  { _id: "2", username: "Amina Uwase", avatar: "AU", online: true, zone: "Zone B" },
  { _id: "3", username: "Eric Mugisha", avatar: "EM", online: false, zone: "Zone C" },
  { _id: "4", username: "Diane Iradukunda", avatar: "DI", online: true, zone: "Zone D" },
];

const INITIAL_ALERTS = [
  { _id: "a1", type: "overcurrent", zone: "Zone B", value: 38, threshold: 30, resolved: false, time: "09:02" },
  { _id: "a2", type: "overvoltage", zone: "Zone A", value: 258, threshold: 250, resolved: false, time: "08:45" },
  { _id: "a3", type: "overheating", zone: "Zone D", value: 82, threshold: 75, resolved: true, time: "07:30" },
  { _id: "a4", type: "ground_fault", zone: "Zone C", value: 0.5, threshold: 0.1, resolved: false, time: "06:15" },
];

const MOCK_MESSAGES = {
  "1": [
    { _id: "m1", from: "admin", text: "Jean, check transformer B2.", time: "08:05" },
    { _id: "m2", from: "1", text: "On it. Voltage stable at 220V.", time: "08:07" },
  ],
  "2": [
    { _id: "m3", from: "2", text: "Overcurrent alert at Zone 3!", time: "09:00" },
    { _id: "m4", from: "admin", text: "Cut the breaker immediately.", time: "09:01" },
  ],
  "3": [],
  "4": [
    { _id: "m5", from: "4", text: "Morning: all systems nominal.", time: "07:30" },
  ],
};

const READINGS = [
  { zone: "Zone A", voltage: 222, current: 14.2, power: 3.1, freq: 50.1, pf: 0.97, status: "normal" },
  { zone: "Zone B", voltage: 258, current: 38.0, power: 9.8, freq: 49.8, pf: 0.84, status: "critical" },
  { zone: "Zone C", voltage: 215, current: 11.5, power: 2.4, freq: 50.0, pf: 0.95, status: "warning" },
  { zone: "Zone D", voltage: 220, current: 13.0, power: 2.8, freq: 50.2, pf: 0.98, status: "normal" },
];

const ALERT_COLORS = {
  overcurrent: { bg: "#ff4d4d22", border: "#ff4d4d", icon: "⚡", label: "Overcurrent" },
  overvoltage: { bg: "#f59e0b22", border: "#f59e0b", icon: "📈", label: "Overvoltage" },
  overheating: { bg: "#fb923c22", border: "#fb923c", icon: "🌡️", label: "Overheating" },
  ground_fault: { bg: "#a855f722", border: "#a855f7", icon: "⚠️", label: "Ground Fault" },
  undervoltage: { bg: "#60a5fa22", border: "#60a5fa", icon: "📉", label: "Undervoltage" },
  short_circuit: { bg: "#ff4d4d22", border: "#ff4d4d", icon: "💥", label: "Short Circuit" },
};

const STATUS_COLORS = { normal: "#22c55e", warning: "#f59e0b", critical: "#ef4444" };

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Avatar({ initials, size = 36, bg = "#0f3460" }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#e2e8f0",
      fontFamily: "'Courier New', monospace", flexShrink: 0,
      border: "1.5px solid #1e4a8a"
    }}>{initials}</div>
  );
}

function StatCard({ label, value, unit, color = "#e2e8f0", icon }) {
  return (
    <div style={{
      background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8,
      padding: "12px 16px", flex: 1, minWidth: 100
    }}>
      <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, marginBottom: 4 }}>{icon} {label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "'Courier New', monospace" }}>
        {value}<span style={{ fontSize: 13, marginLeft: 3, color: "#64748b" }}>{unit}</span>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedWorker, setSelectedWorker] = useState(WORKERS[0]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [liveReadings, setLiveReadings] = useState(READINGS);
  const bottomRef = useRef(null);

  // simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReadings(prev => prev.map(r => ({
        ...r,
        voltage: +(r.voltage + (Math.random() - 0.5) * 2).toFixed(1),
        current: +(r.current + (Math.random() - 0.5) * 0.5).toFixed(1),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedWorker]);

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, resolved: true } : a));
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = { _id: Date.now().toString(), from: "admin", text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => ({ ...prev, [selectedWorker._id]: [...(prev[selectedWorker._id] || []), msg] }));
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = { _id: Date.now().toString() + "r", from: selectedWorker._id, text: "Understood, I will handle it.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages(prev => ({ ...prev, [selectedWorker._id]: [...(prev[selectedWorker._id] || []), reply] }));
      setTyping(false);
    }, 2000);
  };

  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const tabs = ["overview", "sensors", "alerts", "workers", "chat"];

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <nav style={s.sidebar}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>⚡</div>
          <div>
            <div style={s.logoText}>PowerHive</div>
            <div style={s.logoSub}>Control Center</div>
          </div>
        </div>
        <div style={{ padding: "0 12px", marginBottom: 8 }}>
          <div style={s.navLabel}>NAVIGATION</div>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t ? s.navBtnActive : {}) }}>
              <span style={s.navIcon}>
                {{ overview: "🏠", sensors: "📡", alerts: "🚨", workers: "👷", chat: "💬" }[t]}
              </span>
              <span style={{ textTransform: "capitalize" }}>{t}</span>
              {t === "alerts" && unresolvedAlerts.length > 0 && (
                <span style={s.badge}>{unresolvedAlerts.length}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: "1px solid #1e3a5f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="AD" bg="#0f3460" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Administrator</div>
              <div style={{ fontSize: 11, color: "#22c55e" }}>● Active</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={s.main}>
        {/* Top bar */}
        <div style={s.topbar}>
          <div style={s.pageTitle}>
            {{ overview: "System Overview", sensors: "Live Sensor Data", alerts: "Hazard Alerts", workers: "Field Workers", chat: "Worker Communications" }[tab]}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unresolvedAlerts.length > 0 && (
              <div style={s.alertBanner}>🚨 {unresolvedAlerts.length} Active Alert{unresolvedAlerts.length > 1 ? "s" : ""}</div>
            )}
            <div style={s.liveIndicator}><span style={s.liveDot} />LIVE</div>
          </div>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={s.content}>
            <div style={s.statsRow}>
              <StatCard label="TOTAL ZONES" value={4} icon="🗺️" color="#60a5fa" />
              <StatCard label="WORKERS ONLINE" value={WORKERS.filter(w => w.online).length} icon="👷" color="#22c55e" />
              <StatCard label="ACTIVE ALERTS" value={unresolvedAlerts.length} icon="🚨" color={unresolvedAlerts.length > 0 ? "#ef4444" : "#22c55e"} />
              <StatCard label="AVG VOLTAGE" value={(liveReadings.reduce((a, r) => a + r.voltage, 0) / liveReadings.length).toFixed(0)} unit="V" icon="⚡" color="#f59e0b" />
            </div>

            <div style={s.twoCol}>
              {/* Zone status */}
              <div style={s.card}>
                <div style={s.cardTitle}>Zone Status</div>
                {liveReadings.map(r => (
                  <div key={r.zone} style={s.zoneRow}>
                    <div style={{ ...s.zoneDot, background: STATUS_COLORS[r.status] }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{r.zone}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{r.voltage}V · {r.current}A · {r.power}kW</div>
                    </div>
                    <div style={{ ...s.statusPill, background: STATUS_COLORS[r.status] + "22", color: STATUS_COLORS[r.status], border: `1px solid ${STATUS_COLORS[r.status]}` }}>
                      {r.status.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent alerts */}
              <div style={s.card}>
                <div style={s.cardTitle}>Recent Alerts</div>
                {alerts.slice(0, 4).map(a => {
                  const ac = ALERT_COLORS[a.type];
                  return (
                    <div key={a._id} style={{ ...s.alertRow, borderLeft: `3px solid ${ac.border}`, opacity: a.resolved ? 0.5 : 1 }}>
                      <span style={{ fontSize: 18 }}>{ac.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{ac.label} — {a.zone}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{a.time} · Value: {a.value}</div>
                      </div>
                      {a.resolved
                        ? <span style={{ fontSize: 11, color: "#22c55e" }}>✓ Resolved</span>
                        : <button onClick={() => resolveAlert(a._id)} style={s.resolveBtn}>Resolve</button>
                      }
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Workers quick view */}
            <div style={s.card}>
              <div style={s.cardTitle}>Field Workers</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {WORKERS.map(w => (
                  <div key={w._id} style={s.workerCard}>
                    <div style={{ position: "relative" }}>
                      <Avatar initials={w.avatar} size={44} />
                      <div style={{ ...s.onlineDot, background: w.online ? "#22c55e" : "#6b7280" }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginTop: 8 }}>{w.username}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{w.zone}</div>
                    <div style={{ fontSize: 11, color: w.online ? "#22c55e" : "#6b7280", marginTop: 4 }}>
                      {w.online ? "● Online" : "○ Offline"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SENSORS ── */}
        {tab === "sensors" && (
          <div style={s.content}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>
              ● Data refreshes every 3 seconds from field sensors
            </div>
            {liveReadings.map(r => (
              <div key={r.zone} style={{ ...s.card, marginBottom: 12, borderLeft: `3px solid ${STATUS_COLORS[r.status]}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={s.cardTitle}>{r.zone}</div>
                  <div style={{ ...s.statusPill, background: STATUS_COLORS[r.status] + "22", color: STATUS_COLORS[r.status], border: `1px solid ${STATUS_COLORS[r.status]}` }}>
                    {r.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <StatCard label="VOLTAGE" value={r.voltage} unit="V" color={r.voltage > 250 ? "#ef4444" : "#60a5fa"} icon="⚡" />
                  <StatCard label="CURRENT" value={r.current} unit="A" color={r.current > 30 ? "#ef4444" : "#22c55e"} icon="〰️" />
                  <StatCard label="POWER" value={r.power} unit="kW" color="#f59e0b" icon="💡" />
                  <StatCard label="FREQUENCY" value={r.freq} unit="Hz" color="#a78bfa" icon="📶" />
                  <StatCard label="POWER FACTOR" value={r.pf} color={r.pf < 0.9 ? "#f59e0b" : "#22c55e"} icon="📊" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ALERTS ── */}
        {tab === "alerts" && (
          <div style={s.content}>
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <StatCard label="UNRESOLVED" value={unresolvedAlerts.length} icon="🚨" color="#ef4444" />
              <StatCard label="RESOLVED" value={alerts.filter(a => a.resolved).length} icon="✅" color="#22c55e" />
              <StatCard label="TOTAL" value={alerts.length} icon="📋" color="#60a5fa" />
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>All Hazard Alerts</div>
              {alerts.map(a => {
                const ac = ALERT_COLORS[a.type];
                return (
                  <div key={a._id} style={{ ...s.alertFull, background: a.resolved ? "#0a162844" : ac.bg, borderLeft: `4px solid ${ac.border}`, opacity: a.resolved ? 0.6 : 1 }}>
                    <div style={{ fontSize: 28 }}>{ac.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{ac.label}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Zone: <b style={{ color: "#e2e8f0" }}>{a.zone}</b> · Time: {a.time}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Detected: <b style={{ color: ac.border }}>{a.value}</b> · Threshold: {a.threshold}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {a.resolved
                        ? <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>✓ RESOLVED</div>
                        : <button onClick={() => resolveAlert(a._id)} style={s.resolveBtnLg}>Mark Resolved</button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WORKERS ── */}
        {tab === "workers" && (
          <div style={s.content}>
            <div style={s.statsRow}>
              <StatCard label="TOTAL WORKERS" value={WORKERS.length} icon="👷" color="#60a5fa" />
              <StatCard label="ONLINE" value={WORKERS.filter(w => w.online).length} icon="🟢" color="#22c55e" />
              <StatCard label="OFFLINE" value={WORKERS.filter(w => !w.online).length} icon="⚫" color="#6b7280" />
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>Worker Directory</div>
              {WORKERS.map(w => (
                <div key={w._id} style={s.workerRow}>
                  <div style={{ position: "relative" }}>
                    <Avatar initials={w.avatar} size={46} />
                    <div style={{ ...s.onlineDot, background: w.online ? "#22c55e" : "#6b7280" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{w.username}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Field Worker · {w.zone}</div>
                  </div>
                  <div style={{ ...s.statusPill, background: w.online ? "#22c55e22" : "#6b728022", color: w.online ? "#22c55e" : "#6b7280", border: `1px solid ${w.online ? "#22c55e" : "#6b7280"}` }}>
                    {w.online ? "ONLINE" : "OFFLINE"}
                  </div>
                  <button onClick={() => { setSelectedWorker(w); setTab("chat"); }} style={s.chatBtn}>
                    💬 Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === "chat" && (
          <div style={{ ...s.content, display: "flex", gap: 0, height: "calc(100vh - 100px)", padding: 0 }}>
            {/* Worker list */}
            <div style={s.chatSidebar}>
              <div style={{ padding: "16px", fontSize: 11, color: "#64748b", letterSpacing: 1 }}>WORKERS</div>
              {WORKERS.map(w => (
                <div key={w._id} onClick={() => setSelectedWorker(w)} style={{ ...s.chatWorkerItem, ...(selectedWorker._id === w._id ? s.chatWorkerActive : {}) }}>
                  <div style={{ position: "relative" }}>
                    <Avatar initials={w.avatar} size={34} bg={selectedWorker._id === w._id ? "#0f3460" : "#071020"} />
                    <div style={{ ...s.onlineDot, background: w.online ? "#22c55e" : "#6b7280", width: 8, height: 8 }} />
                  </div>
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.username}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{(messages[w._id]?.slice(-1)[0]?.text || "No messages").substring(0, 25)}...</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat window */}
            <div style={s.chatWindow}>
              <div style={s.chatHeader}>
                <Avatar initials={selectedWorker.avatar} size={36} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{selectedWorker.username}</div>
                  <div style={{ fontSize: 11, color: selectedWorker.online ? "#22c55e" : "#6b7280" }}>
                    {selectedWorker.online ? "● Online" : "○ Offline"} · {selectedWorker.zone}
                  </div>
                </div>
              </div>
              <div style={s.messages}>
                {(messages[selectedWorker._id] || []).map(m => (
                  <div key={m._id} style={{ ...s.msgRow, justifyContent: m.from === "admin" ? "flex-end" : "flex-start" }}>
                    {m.from !== "admin" && <Avatar initials={selectedWorker.avatar} size={28} />}
                    <div>
                      <div style={{ ...s.bubble, ...(m.from === "admin" ? s.bubbleAdmin : s.bubbleWorker) }}>{m.text}</div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 2, textAlign: m.from === "admin" ? "right" : "left" }}>{m.time}</div>
                    </div>
                  </div>
                ))}
                {typing && (
                  <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
                    <Avatar initials={selectedWorker.avatar} size={28} />
                    <div style={{ ...s.bubble, ...s.bubbleWorker, opacity: 0.6, letterSpacing: 4 }}>● ● ●</div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={s.inputRow}>
                <input
                  style={s.chatInput}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder={`Message ${selectedWorker.username}...`}
                />
                <button onClick={sendMessage} style={s.sendBtn}>SEND ➤</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── WORKER DASHBOARD ─────────────────────────────────────────────────────────
function WorkerDashboard() {
  const worker = WORKERS[0];
  const myZone = READINGS[0];
  const [tab, setTab] = useState("overview");
  const [myAlerts, setMyAlerts] = useState(INITIAL_ALERTS.filter(a => a.zone === "Zone A"));
  const [msgs, setMsgs] = useState(MOCK_MESSAGES["1"]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [liveZone, setLiveZone] = useState(myZone);
  const bottomRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveZone(prev => ({
        ...prev,
        voltage: +(prev.voltage + (Math.random() - 0.5) * 1.5).toFixed(1),
        current: +(prev.current + (Math.random() - 0.5) * 0.3).toFixed(1),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const msg = { _id: Date.now().toString(), from: worker._id, text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMsgs(prev => [...prev, msg]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs(prev => [...prev, { _id: Date.now().toString() + "r", from: "admin", text: "Received. Keep me updated on any changes.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 1800);
  };

  const tabs = ["overview", "my zone", "alerts", "chat"];

  return (
    <div style={{ ...s.root, background: "#060e1a" }}>
      <nav style={{ ...s.sidebar, background: "#071220" }}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>⚡</div>
          <div>
            <div style={s.logoText}>PowerHive</div>
            <div style={s.logoSub}>Worker Portal</div>
          </div>
        </div>
        <div style={{ padding: "0 12px", marginBottom: 8 }}>
          <div style={s.navLabel}>NAVIGATION</div>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.navBtn, ...(tab === t ? s.navBtnActive : {}) }}>
              <span style={s.navIcon}>
                {{ "overview": "🏠", "my zone": "📡", "alerts": "🚨", "chat": "💬" }[t]}
              </span>
              <span style={{ textTransform: "capitalize" }}>{t}</span>
              {t === "alerts" && myAlerts.filter(a => !a.resolved).length > 0 && (
                <span style={s.badge}>{myAlerts.filter(a => !a.resolved).length}</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "auto", padding: "16px 12px", borderTop: "1px solid #1e3a5f" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials={worker.avatar} size={36} bg="#0f3460" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{worker.username}</div>
              <div style={{ fontSize: 11, color: "#22c55e" }}>● On Duty · {worker.zone}</div>
            </div>
          </div>
        </div>
      </nav>

      <main style={s.main}>
        <div style={s.topbar}>
          <div style={s.pageTitle}>
            {{ "overview": "My Dashboard", "my zone": "Zone A — Live Readings", "alerts": "My Alerts", "chat": "Admin Chat" }[tab]}
          </div>
          <div style={s.liveIndicator}><span style={s.liveDot} />LIVE</div>
        </div>

        {/* ── WORKER OVERVIEW ── */}
        {tab === "overview" && (
          <div style={s.content}>
            <div style={s.statsRow}>
              <StatCard label="MY ZONE" value="A" icon="🗺️" color="#60a5fa" />
              <StatCard label="VOLTAGE" value={liveZone.voltage} unit="V" icon="⚡" color="#f59e0b" />
              <StatCard label="CURRENT" value={liveZone.current} unit="A" icon="〰️" color="#22c55e" />
              <StatCard label="MY ALERTS" value={myAlerts.filter(a => !a.resolved).length} icon="🚨" color={myAlerts.filter(a => !a.resolved).length > 0 ? "#ef4444" : "#22c55e"} />
            </div>

            <div style={s.twoCol}>
              <div style={s.card}>
                <div style={s.cardTitle}>Zone A — Current Status</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Voltage", value: `${liveZone.voltage} V`, color: liveZone.voltage > 250 ? "#ef4444" : "#22c55e" },
                    { label: "Current", value: `${liveZone.current} A`, color: liveZone.current > 30 ? "#ef4444" : "#22c55e" },
                    { label: "Power", value: `${liveZone.power} kW`, color: "#f59e0b" },
                    { label: "Frequency", value: `${liveZone.freq} Hz`, color: "#a78bfa" },
                    { label: "Power Factor", value: liveZone.pf, color: liveZone.pf < 0.9 ? "#f59e0b" : "#22c55e" },
                    { label: "Status", value: liveZone.status.toUpperCase(), color: STATUS_COLORS[liveZone.status] },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #0f2040" }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color, fontFamily: "'Courier New', monospace" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <div style={s.cardTitle}>My Alerts</div>
                {myAlerts.length === 0 && <div style={{ color: "#64748b", fontSize: 13 }}>No alerts for your zone.</div>}
                {myAlerts.map(a => {
                  const ac = ALERT_COLORS[a.type];
                  return (
                    <div key={a._id} style={{ ...s.alertRow, borderLeft: `3px solid ${ac.border}`, opacity: a.resolved ? 0.5 : 1 }}>
                      <span style={{ fontSize: 18 }}>{ac.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{ac.label}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{a.time} · {a.value} (limit: {a.threshold})</div>
                      </div>
                      {a.resolved
                        ? <span style={{ fontSize: 11, color: "#22c55e" }}>✓</span>
                        : <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", animation: "pulse 1s infinite" }} />
                      }
                    </div>
                  );
                })}
                <div style={{ marginTop: 12 }}>
                  <div style={s.cardTitle}>Recent from Admin</div>
                  {msgs.slice(-2).map(m => (
                    <div key={m._id} style={{ padding: "8px 0", borderBottom: "1px solid #0f2040" }}>
                      <div style={{ fontSize: 11, color: m.from === "admin" ? "#f59e0b" : "#60a5fa" }}>
                        {m.from === "admin" ? "Admin" : "You"} · {m.time}
                      </div>
                      <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 2 }}>{m.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY ZONE ── */}
        {tab === "my zone" && (
          <div style={s.content}>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>● Live readings update every 3 seconds</div>
            <div style={{ ...s.card, borderLeft: `3px solid ${STATUS_COLORS[liveZone.status]}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={s.cardTitle}>Zone A — Live Sensor Data</div>
                <div style={{ ...s.statusPill, background: STATUS_COLORS[liveZone.status] + "22", color: STATUS_COLORS[liveZone.status], border: `1px solid ${STATUS_COLORS[liveZone.status]}` }}>
                  {liveZone.status.toUpperCase()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <StatCard label="VOLTAGE" value={liveZone.voltage} unit="V" color={liveZone.voltage > 250 ? "#ef4444" : "#60a5fa"} icon="⚡" />
                <StatCard label="CURRENT" value={liveZone.current} unit="A" color={liveZone.current > 30 ? "#ef4444" : "#22c55e"} icon="〰️" />
                <StatCard label="POWER" value={liveZone.power} unit="kW" color="#f59e0b" icon="💡" />
                <StatCard label="FREQUENCY" value={liveZone.freq} unit="Hz" color="#a78bfa" icon="📶" />
                <StatCard label="POWER FACTOR" value={liveZone.pf} color={liveZone.pf < 0.9 ? "#f59e0b" : "#22c55e"} icon="📊" />
              </div>

              <div style={{ marginTop: 20, padding: "12px", background: "#071020", borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>THRESHOLDS</div>
                {[
                  { label: "Max Voltage", threshold: "250 V", current: `${liveZone.voltage} V`, ok: liveZone.voltage <= 250 },
                  { label: "Max Current", threshold: "30 A", current: `${liveZone.current} A`, ok: liveZone.current <= 30 },
                  { label: "Min Power Factor", threshold: "0.90", current: `${liveZone.pf}`, ok: liveZone.pf >= 0.9 },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #0f2040" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Limit: {item.threshold}</span>
                    <span style={{ fontSize: 12, color: item.ok ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
                      {item.current} {item.ok ? "✓" : "⚠"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── WORKER ALERTS ── */}
        {tab === "alerts" && (
          <div style={s.content}>
            <div style={s.card}>
              <div style={s.cardTitle}>My Zone Alerts</div>
              {myAlerts.length === 0 && <div style={{ color: "#64748b", fontSize: 13, padding: "20px 0" }}>✅ No alerts for your zone.</div>}
              {myAlerts.map(a => {
                const ac = ALERT_COLORS[a.type];
                return (
                  <div key={a._id} style={{ ...s.alertFull, background: a.resolved ? "#0a162844" : ac.bg, borderLeft: `4px solid ${ac.border}`, opacity: a.resolved ? 0.6 : 1 }}>
                    <div style={{ fontSize: 28 }}>{ac.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{ac.label}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Time: {a.time}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Detected: <b style={{ color: ac.border }}>{a.value}</b> · Threshold: {a.threshold}
                      </div>
                    </div>
                    {a.resolved
                      ? <div style={{ color: "#22c55e", fontSize: 13 }}>✓ RESOLVED</div>
                      : <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 700 }}>⚠ ACTIVE</div>
                    }
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── WORKER CHAT ── */}
        {tab === "chat" && (
          <div style={{ ...s.content, display: "flex", flexDirection: "column", height: "calc(100vh - 100px)", padding: 0 }}>
            <div style={{ ...s.chatHeader, margin: "0 20px 0" }}>
              <Avatar initials="AD" size={36} bg="#0f3460" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Administrator</div>
                <div style={{ fontSize: 11, color: "#22c55e" }}>● Online</div>
              </div>
            </div>
            <div style={{ ...s.messages, margin: "0 20px", flex: 1 }}>
              {msgs.map(m => (
                <div key={m._id} style={{ ...s.msgRow, justifyContent: m.from === worker._id ? "flex-end" : "flex-start" }}>
                  {m.from !== worker._id && <Avatar initials="AD" size={28} bg="#0f3460" />}
                  <div>
                    <div style={{ ...s.bubble, ...(m.from === worker._id ? s.bubbleAdmin : s.bubbleWorker) }}>{m.text}</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 2, textAlign: m.from === worker._id ? "right" : "left" }}>{m.time}</div>
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ ...s.msgRow, justifyContent: "flex-start" }}>
                  <Avatar initials="AD" size={28} bg="#0f3460" />
                  <div style={{ ...s.bubble, ...s.bubbleWorker, opacity: 0.6, letterSpacing: 4 }}>● ● ●</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div style={{ ...s.inputRow, margin: "0 20px 20px" }}>
              <input
                style={s.chatInput}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Message admin..."
              />
              <button onClick={sendMessage} style={s.sendBtn}>SEND ➤</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ─── APP SWITCHER ─────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("admin");

  return (
    <div style={{ fontFamily: "'Courier New', monospace", background: "#060e1a", minHeight: "100vh" }}>
      {/* View Toggle */}
      <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999, display: "flex", gap: 4, background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 6, padding: 4 }}>
        <button onClick={() => setView("admin")} style={{ ...s.toggleBtn, ...(view === "admin" ? s.toggleActive : {}) }}>Admin View</button>
        <button onClick={() => setView("worker")} style={{ ...s.toggleBtn, ...(view === "worker" ? s.toggleActive : {}) }}>Worker View</button>
      </div>
      {view === "admin" ? <AdminDashboard /> : <WorkerDashboard />}
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  root: { display: "flex", minHeight: "100vh", background: "#07101f", color: "#e2e8f0" },
  sidebar: { width: 220, background: "#080f1e", borderRight: "1px solid #1e3a5f", display: "flex", flexDirection: "column", flexShrink: 0, minHeight: "100vh" },
  logoWrap: { padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1e3a5f" },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 16, fontWeight: 700, color: "#f59e0b", letterSpacing: 1 },
  logoSub: { fontSize: 10, color: "#475569", letterSpacing: 1 },
  navLabel: { fontSize: 10, color: "#475569", letterSpacing: 2, padding: "12px 4px 6px", fontWeight: 700 },
  navBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 10px", borderRadius: 6, border: "none", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer", marginBottom: 2, textAlign: "left" },
  navBtnActive: { background: "#0f3460", color: "#f59e0b", fontWeight: 600 },
  navIcon: { fontSize: 15, width: 20 },
  badge: { marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #1e3a5f", background: "#080f1e" },
  pageTitle: { fontSize: 16, fontWeight: 700, color: "#e2e8f0", letterSpacing: 0.5 },
  liveIndicator: { display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#22c55e", fontWeight: 700, letterSpacing: 1 },
  liveDot: { display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" },
  alertBanner: { background: "#ef444422", border: "1px solid #ef4444", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 600 },
  content: { padding: 20, overflowY: "auto", flex: 1 },
  statsRow: { display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" },
  card: { background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 8, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 11, color: "#64748b", letterSpacing: 1.5, fontWeight: 700, marginBottom: 12 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
  zoneRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #0f2040" },
  zoneDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  statusPill: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: 1 },
  alertRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "#071020", borderRadius: 4, marginBottom: 8 },
  alertFull: { display: "flex", alignItems: "center", gap: 14, padding: "14px", borderRadius: 6, marginBottom: 10 },
  resolveBtn: { fontSize: 11, background: "#0f3460", border: "1px solid #1e4a8a", color: "#60a5fa", borderRadius: 4, padding: "3px 8px", cursor: "pointer" },
  resolveBtnLg: { fontSize: 12, background: "#0f3460", border: "1px solid #1e4a8a", color: "#60a5fa", borderRadius: 4, padding: "6px 12px", cursor: "pointer", whiteSpace: "nowrap" },
  workerCard: { background: "#071020", border: "1px solid #1e3a5f", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 },
  workerRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #0f2040" },
  chatBtn: { fontSize: 12, background: "#0f3460", border: "1px solid #1e4a8a", color: "#60a5fa", borderRadius: 4, padding: "6px 12px", cursor: "pointer" },
  onlineDot: { position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", border: "2px solid #080f1e" },
  chatSidebar: { width: 200, borderRight: "1px solid #1e3a5f", display: "flex", flexDirection: "column", flexShrink: 0 },
  chatWorkerItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #0f2040" },
  chatWorkerActive: { background: "#0f3460" },
  chatWindow: { flex: 1, display: "flex", flexDirection: "column" },
  chatHeader: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid #1e3a5f", background: "#080f1e" },
  messages: { flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 },
  msgRow: { display: "flex", gap: 8, alignItems: "flex-end" },
  bubble: { padding: "8px 12px", borderRadius: 8, fontSize: 13, maxWidth: 280, lineHeight: 1.5 },
  bubbleAdmin: { background: "#0f3460", color: "#e2e8f0", borderBottomRightRadius: 2 },
  bubbleWorker: { background: "#1e3a5f", color: "#e2e8f0", borderBottomLeftRadius: 2 },
  inputRow: { display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #1e3a5f" },
  chatInput: { flex: 1, background: "#071020", border: "1px solid #1e3a5f", color: "#e2e8f0", borderRadius: 6, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "'Courier New', monospace" },
  sendBtn: { background: "#f59e0b", border: "none", color: "#07101f", borderRadius: 6, padding: "10px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1 },
  toggleBtn: { padding: "5px 12px", borderRadius: 4, border: "none", background: "transparent", color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "'Courier New', monospace", fontWeight: 600 },
  toggleActive: { background: "#0f3460", color: "#f59e0b" },
  adminBadge: { marginLeft: "auto", background: "#f59e0b22", color: "#f59e0b", border: "1px solid #f59e0b", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700 },
  sidebarHeader: { padding: "20px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #1e3a5f" },
};