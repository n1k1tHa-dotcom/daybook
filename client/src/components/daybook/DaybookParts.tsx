import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  Check,
  CirclePlus,
  CloudRain,
  Feather,
  Image as ImageIcon,
  LockKeyhole,
  Music2,
  Palette,
  Paperclip,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Sticker,
  SunMedium,
  X,
} from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import {
  countWords,
  formatDateLabel,
  formatShortDate,
  type DayData,
  type Memory,
  type MemoryKind,
  type Task,
  type TinyMoment,
  type VibeKey,
  vibePresets,
} from "@/lib/daybook-data";

export function PaperTab({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return <button className={`paper-tab ${active ? "is-active" : ""}`} onClick={onClick}>{icon}<span>{label}</span></button>;
}

export function CaptureMomentDialog({ open, onClose, onFile }: { open: boolean; onClose: () => void; onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  if (!open) return null;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = "";
  };
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <motion.div className="capture-modal" initial={{ opacity: 0, y: 18, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close capture dialog"><X size={17} /></button>
        <div className="modal-scribble">a little something to keep</div>
        <div className="modal-icon"><CameraGlyph /></div>
        <p className="eyebrow">capture this moment</p>
        <h2>Keep the ordinary<br /><em>extraordinary.</em></h2>
        <p className="modal-copy">Add a photo to today’s page. It will land like a little piece of paper you decided not to lose.</p>
        <input ref={inputRef} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={handleChange} />
        <div className="capture-options">
          <button className="capture-option primary-option" onClick={() => inputRef.current?.click()}><CameraGlyph /><span><strong>Take a photo</strong><small>camera or gallery</small></span><ArrowRight size={15} /></button>
          <button className="capture-option" onClick={() => inputRef.current?.click()}><ImageIcon size={20} /><span><strong>Choose from gallery</strong><small>pick a memory already saved</small></span><ArrowRight size={15} /></button>
        </div>
        <p className="modal-note"><Paperclip size={13} /> photos are placed with a little bit of imperfection</p>
      </motion.div>
    </div>
  );
}

function CameraGlyph() {
  return <span className="camera-glyph"><span /></span>;
}

export function VibePicker({ vibe, prompt, onVibe, onPrompt }: { vibe: VibeKey; prompt: string; onVibe: (vibe: VibeKey) => void; onPrompt: (prompt: string) => void }) {
  const choices = Object.entries(vibePresets) as [VibeKey, (typeof vibePresets)[VibeKey]][];
  return (
    <div className="vibe-section">
      <div className="section-kicker"><Palette size={13} /> choose today’s atmosphere</div>
      <div className="vibe-row">
        {choices.map(([key, preset]) => <button key={key} className={`vibe-chip ${vibe === key ? "selected" : ""}`} onClick={() => onVibe(key)} title={preset.note}><span>{preset.emoji}</span>{preset.label}</button>)}
      </div>
      <div className="atmosphere-input-wrap">
        <CloudRain size={16} />
        <input value={prompt} onChange={(event) => onPrompt(event.target.value)} placeholder="Make today feel like..." aria-label="Describe today's atmosphere" />
        <button className="send-prompt" onClick={() => onPrompt(prompt)} aria-label="Apply atmosphere"><Send size={14} /></button>
      </div>
    </div>
  );
}

export function PlannerPage({ day, onJournal, onTask, onAddTask }: { day: DayData; onJournal: (value: string) => void; onTask: (id: string) => void; onAddTask: (title: string) => void }) {
  const completed = day.tasks.filter((task) => task.completed).length;
  const [newTask, setNewTask] = useStateLocal("");
  const addTask = () => { if (newTask.trim()) { onAddTask(newTask.trim()); setNewTask(""); } };
  return (
    <div className="planner-page page-surface">
      <div className="page-topline"><span className="page-label">the plan / the feeling</span><span className="page-number">014 <span>/</span> 365</span></div>
      <div className="planner-heading"><span className="little-spark">✦</span><h2>Today, gently.</h2><span className="heading-line" /></div>
      <p className="planner-intro">A place for what needs doing — and what you want to remember doing.</p>
      <div className="journal-block">
        <div className="block-label"><Feather size={13} /> journal note <span>edited just now</span></div>
        <textarea value={day.journalText} onChange={(event) => onJournal(event.target.value)} aria-label="Journal entry" />
      </div>
      <div className="tasks-block">
        <div className="block-label"><Check size={13} /> today’s progress <span>{completed}/{day.tasks.length} complete</span></div>
        <div className="progress-line"><span style={{ width: `${day.tasks.length ? (completed / day.tasks.length) * 100 : 0}%` }} /></div>
        <div className="task-list">
          {day.tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => onTask(task.id)} />)}
        </div>
        <div className="add-task-row"><Plus size={14} /><input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="add one more thing" /><button onClick={addTask}>add</button></div>
      </div>
      <div className="progress-quote"><span className="quote-mark">“</span><p>You completed <strong>{completed}/{day.tasks.length}</strong> goals today. That counts.</p><span className="quote-author">— daybook</span></div>
    </div>
  );
}

function useStateLocal<T>(initial: T): [T, (value: T) => void] {
  return useState(initial);
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return <button className={`task-row ${task.completed ? "completed" : ""}`} onClick={onToggle}><span className="task-check">{task.completed && <Check size={12} strokeWidth={3} />}</span><span>{task.title}</span>{task.completed && <span className="task-done">done</span>}</button>;
}

export function MemoryPage({ day, selectedMemory, scrapbookMode, onSelectMemory, onMoveMemory, onRotateMemory, onAddElement, onOpenPast }: { day: DayData; selectedMemory?: string; scrapbookMode: boolean; onSelectMemory: (id: string) => void; onMoveMemory: (id: string, delta: number) => void; onRotateMemory: (id: string, delta: number) => void; onAddElement: (kind: "tape" | "sticker" | "label" | "doodle") => void; onOpenPast: () => void }) {
  return (
    <div className="memory-page page-surface">
      <div className="page-topline"><span className="page-label">little things / kept here</span><span className="page-date-stamp">{formatShortDate(day.date)}</span></div>
      <div className="memory-heading"><div><span className="section-kicker">the scrapbook</span><h2>Today in fragments.</h2></div><span className="memory-count">{day.memories.length} <small>memories</small></span></div>
      <div className="collage-canvas">
        <div className="torn-paper torn-paper-one" />
        <div className="washi washi-yellow" />
        <div className="washi washi-pink" />
        <div className="collage-scribble">keep<br />the small<br />stuff</div>
        {day.memories.map((memory, index) => <MemoryCard key={memory.id} memory={memory} index={index} selected={selectedMemory === memory.id} scrapbookMode={scrapbookMode} onSelect={() => onSelectMemory(memory.id)} />)}
        <div className="collage-sticker sticker-sun">☼</div><div className="collage-sticker sticker-heart">♡</div>
      </div>
      {scrapbookMode && <div className="scrapbook-toolbar"><span className="toolbar-label"><Pencil size={13} /> arrange the page</span><button onClick={() => selectedMemory && onMoveMemory(selectedMemory, -1)} disabled={!selectedMemory}>← move</button><button onClick={() => selectedMemory && onMoveMemory(selectedMemory, 1)} disabled={!selectedMemory}>move →</button><button onClick={() => selectedMemory && onRotateMemory(selectedMemory, -4)} disabled={!selectedMemory}><RotateCcw size={13} /> rotate</button><span className="toolbar-divider" /><button onClick={() => onAddElement("tape")}><Paperclip size={13} /> tape</button><button onClick={() => onAddElement("sticker")}><Sticker size={13} /> sticker</button><button onClick={() => onAddElement("label")}><Paperclip size={13} /> label</button></div>}
      <div className="moments-header"><div className="section-kicker"><Sparkles size={13} /> tiny moments</div><span>arranged from your day</span></div>
      <div className="moments-list">{day.moments.map((moment) => <TinyMomentRow key={moment.id} moment={moment} />)}</div>
      <button className="past-link" onClick={onOpenPast}><Archive size={14} /> open today in the past <ArrowRight size={14} /></button>
    </div>
  );
}

function MemoryCard({ memory, index, selected, scrapbookMode, onSelect }: { memory: Memory; index: number; selected: boolean; scrapbookMode: boolean; onSelect: () => void }) {
  return <motion.button className={`memory-card memory-card-${index + 1} ${selected ? "selected" : ""} ${scrapbookMode ? "editable" : ""}`} style={{ "--memory-rotate": `${memory.rotation}deg`, "--memory-x": `${memory.x}px`, "--memory-y": `${memory.y}px`, "--memory-accent": memory.accent } as React.CSSProperties} onClick={onSelect} whileHover={{ y: -3, rotate: memory.rotation + (index % 2 ? -1 : 1) }}>
    {memory.image ? <img src={memory.image} alt={memory.caption} /> : <div className="note-memory"><span>{memory.emoji}</span><p>{memory.caption}</p></div>}
    <span className="memory-tape" /><span className="memory-caption"><strong>{memory.title}</strong><small>{memory.caption}</small></span>{selected && scrapbookMode && <span className="resize-handle" />}
  </motion.button>;
}

function TinyMomentRow({ moment }: { moment: TinyMoment }) {
  return <div className="moment-row"><span className="moment-time">{moment.time}</span><span className="moment-dot">{moment.emoji}</span><span className="moment-label">{moment.label}</span><span className="moment-note">{moment.note}</span></div>;
}

export function TinyMomentsComposer({ onAdd, onClose }: { onAdd: (moment: Omit<TinyMoment, "id">) => void; onClose: () => void }) {
  const [kind, setKind] = useStateLocal<MemoryKind>("note");
  const [note, setNote] = useStateLocal("");
  const [label, setLabel] = useStateLocal("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (!note.trim()) return; onAdd({ kind, note: note.trim(), label: label.trim() || kind, time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date()), emoji: kind === "song" ? "♫" : kind === "photo" ? "📸" : "✦" }); onClose(); };
  return <motion.form className="tiny-composer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit}><div className="composer-top"><span className="section-kicker"><CirclePlus size={13} /> add a tiny moment</span><button type="button" onClick={onClose}><X size={15} /></button></div><div className="composer-types">{(["note", "photo", "song"] as MemoryKind[]).map((item) => <button type="button" key={item} className={kind === item ? "selected" : ""} onClick={() => setKind(item)}>{item === "note" ? <Pencil size={14} /> : item === "photo" ? <ImageIcon size={14} /> : <Music2 size={14} />}{item}</button>)}</div><input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="a little label" /><textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="what do you want to remember?" autoFocus /><button className="primary-ink-button" type="submit"><Plus size={15} /> keep this moment</button></motion.form>;
}

export function CapsulePanel({ day, onSeal, onClose }: { day: DayData; onSeal: () => void; onClose: () => void }) {
  const completed = day.tasks.filter((task) => task.completed).length;
  const memoryTotal = day.memories.length + day.moments.length;
  const preset = vibePresets[day.vibe];
  return <motion.aside className="capsule-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}><button className="panel-close" onClick={onClose}><X size={15} /></button><div className="capsule-label"><Archive size={14} /> memory capsule</div><div className="capsule-stamp">{day.sealed ? "SEALED" : "OPEN"}<span>✦</span></div><span className="capsule-date">{formatDateLabel(day.date)}</span><h3>A little proof<br /><em>that you were here.</em></h3><div className="capsule-stats"><div><strong>{memoryTotal}</strong><span>memories</span></div><div><strong>{countWords(day.journalText)}</strong><span>words</span></div><div><strong>{completed}/{day.tasks.length}</strong><span>goals</span></div></div><div className="capsule-vibe"><span>{preset.emoji}</span><div><small>today’s vibe</small><strong>{preset.label}</strong></div></div><blockquote>“{completed === day.tasks.length ? "You kept every promise to yourself today." : "You seemed to have a productive day."}”</blockquote><button className={`seal-button ${day.sealed ? "sealed" : ""}`} onClick={onSeal}>{day.sealed ? <><LockKeyhole size={15} /> day sealed</> : <><LockKeyhole size={15} /> seal this day</>}</button><p className="capsule-footer">you can always come back here<br />one year from now.</p></motion.aside>;
}

export function PastPanel({ day, onClose }: { day: DayData; onClose: () => void }) {
  return <motion.aside className="past-panel" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}><button className="panel-close" onClick={onClose}><X size={15} /></button><div className="capsule-label"><Archive size={14} /> today in the past</div><h3>Same day,<br /><em>different chapters.</em></h3><p className="past-intro">A small time machine tucked inside today’s page.</p><div className="past-list">{day.past.map((entry) => <div className="past-entry" key={entry.year}><span className="past-year">{entry.year}</span><span className="past-entry-emoji">{entry.emoji}</span><div><strong>{formatShortDate(`${entry.year}-${day.date.slice(5)}`)}</strong><p>{entry.snippet}</p><small>📸 {entry.photoCount} {entry.photoCount === 1 ? "memory" : "memories"}</small></div></div>)}</div><button className="past-back" onClick={onClose}><ArrowLeft size={14} /> back to today</button></motion.aside>;
}

export function CameraButton({ onClick }: { onClick: () => void }) { return <button className="camera-button" onClick={onClick}><span className="camera-button-icon"><CameraGlyph /></span><span>capture<br /><em>this moment</em></span></button>; }

export function HeaderDate({ day, onPrevious, onNext, onClose }: { day: DayData; onPrevious: () => void; onNext: () => void; onClose: () => void }) {
  return <div className="date-header"><button className="back-to-cover" onClick={onClose}><ArrowLeft size={15} /> close diary</button><div className="date-switcher"><button onClick={onPrevious} aria-label="Previous day"><ArrowLeft size={16} /></button><div><span className="date-eyebrow">{day.sealed ? "sealed memory" : "today’s diary"}</span><h1>{formatDateLabel(day.date)}</h1></div><button onClick={onNext} aria-label="Next day"><ArrowRight size={16} /></button></div><div className="header-weather"><SunMedium size={16} /><span>18° / golden hour</span></div></div>;
}

export function UtilityRail({ scrapbookMode, onScrapbook, onTinyMoment, onCapsule, onPast }: { scrapbookMode: boolean; onScrapbook: () => void; onTinyMoment: () => void; onCapsule: () => void; onPast: () => void }) {
  return <nav className="utility-rail" aria-label="Diary tools"><PaperTab icon={<Pencil size={16} />} label="scrapbook" active={scrapbookMode} onClick={onScrapbook} /><PaperTab icon={<CirclePlus size={16} />} label="tiny moment" onClick={onTinyMoment} /><PaperTab icon={<Archive size={16} />} label="capsule" onClick={onCapsule} /><PaperTab icon={<RotateCcw size={16} />} label="on this day" onClick={onPast} /></nav>;
}
