import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Heart, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ClosedDiary from "@/components/daybook/ClosedDiary";
import {
  CameraButton,
  CapsulePanel,
  CaptureMomentDialog,
  HeaderDate,
  MemoryPage,
  PastPanel,
  PlannerPage,
  TinyMomentsComposer,
  UtilityRail,
  VibePicker,
} from "@/components/daybook/DaybookParts";
import { cloneDay, moveDate, resolvePrompt, seedDay, type DayData, type TinyMoment, vibePresets, countWords } from "@/lib/daybook-data";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [day, setDay] = useState<DayData>(() => cloneDay(seedDay));
  const [transitionDirection, setTransitionDirection] = useState<1 | -1>(1);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [scrapbookMode, setScrapbookMode] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<string>();
  const [panel, setPanel] = useState<"capsule" | "past" | null>(null);
  const [momentComposerOpen, setMomentComposerOpen] = useState(false);
  const [showVibes, setShowVibes] = useState(false);
  const [extraElements, setExtraElements] = useState<string[]>([]);
  const touchStartX = useRef<number | null>(null);
  const { isAuthenticated } = useAuth();
  const saveDayMutation = trpc.daybook.saveDay.useMutation();

  const preset = vibePresets[day.vibe];
  const completedCount = day.tasks.filter((task) => task.completed).length;
  const themeStyle = useMemo(() => ({
    "--paper": preset.paper,
    "--ink": preset.ink,
    "--theme-accent": preset.accent,
    "--theme-accent-soft": preset.accentSoft,
    "--theme-wash": preset.wash,
  } as React.CSSProperties), [preset]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const timeout = window.setTimeout(() => {
      saveDayMutation.mutate({ date: day.date, vibe: day.vibe, atmospherePrompt: day.atmospherePrompt, journalText: day.journalText, sealed: day.sealed });
    }, 650);
    return () => window.clearTimeout(timeout);
  }, [day.date, day.vibe, day.atmospherePrompt, day.journalText, day.sealed, isAuthenticated]);

  const changeDay = (amount: number) => {
    setTransitionDirection(amount > 0 ? 1 : -1);
    setDay((current) => {
      const nextDate = moveDate(current.date, amount);
      if (nextDate === seedDay.date) return cloneDay(seedDay);
      return { ...cloneDay(seedDay), date: nextDate, journalText: "A blank page is still a beginning.", memories: [], moments: [], tasks: [], past: [], vibe: current.vibe, sealed: false };
    });
  };

  const addCapture = (file: File) => {
    const image = URL.createObjectURL(file);
    setDay((current) => ({ ...current, memories: [...current.memories, { id: `memory-${Date.now()}`, kind: "photo", title: "Just now", caption: file.name.replace(/\.[^/.]+$/, "") || "a new little memory", image, rotation: current.memories.length % 2 ? 3 : -4, x: 0, y: 0, accent: preset.accentSoft }] }));
    setCaptureOpen(false);
    setIsOpen(true);
  };

  const addMoment = (moment: Omit<TinyMoment, "id">) => setDay((current) => ({ ...current, moments: [...current.moments, { ...moment, id: `moment-${Date.now()}` }] }));
  const updatePrompt = (prompt: string) => setDay((current) => ({ ...current, atmospherePrompt: prompt, vibe: prompt === current.atmospherePrompt ? current.vibe : resolvePrompt(prompt) }));
  const toggleTask = (id: string) => setDay((current) => ({ ...current, tasks: current.tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task) }));
  const addTask = (title: string) => setDay((current) => ({ ...current, tasks: [...current.tasks, { id: `task-${Date.now()}`, title, completed: false }] }));
  const updateMemoryRotation = (id: string, delta: number) => setDay((current) => ({ ...current, memories: current.memories.map((memory) => memory.id === id ? { ...memory, rotation: memory.rotation + delta } : memory) }));
  const moveMemory = (id: string, delta: number) => setDay((current) => ({ ...current, memories: current.memories.map((memory) => memory.id === id ? { ...memory, x: memory.x + delta * 10 } : memory) }));
  const addElement = (kind: string) => setExtraElements((current) => [...current, kind]);

  if (!isOpen) return <main className="app-shell closed-shell" style={themeStyle}><ClosedDiary onOpen={() => setIsOpen(true)} onCapture={() => setCaptureOpen(true)} /><CaptureMomentDialog open={captureOpen} onClose={() => setCaptureOpen(false)} onFile={addCapture} /></main>;

  return (
    <main className={`app-shell open-shell vibe-${preset.texture} ${day.sealed ? "day-is-sealed" : ""}`} style={themeStyle}>
      <div className="grain-layer" />
      <HeaderDate day={day} onPrevious={() => changeDay(-1)} onNext={() => changeDay(1)} onClose={() => setIsOpen(false)} />
      <div className="open-layout">
        <UtilityRail scrapbookMode={scrapbookMode} onScrapbook={() => setScrapbookMode((value) => !value)} onTinyMoment={() => setMomentComposerOpen((value) => !value)} onCapsule={() => setPanel(panel === "capsule" ? null : "capsule")} onPast={() => setPanel(panel === "past" ? null : "past")} />
        <section className="book-stage" aria-label="Open diary spread" onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }} onTouchEnd={(event) => { const start = touchStartX.current; const end = event.changedTouches[0]?.clientX; if (start !== null && end !== undefined && Math.abs(end - start) > 45) changeDay(end < start ? 1 : -1); touchStartX.current = null; }}>
          <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
            <motion.div key={day.date} className="book-spread" custom={transitionDirection} initial={{ opacity: 0, rotateY: transitionDirection * -8, x: transitionDirection * 18 }} animate={{ opacity: 1, rotateY: 0, x: 0 }} exit={{ opacity: 0, rotateY: transitionDirection * 8, x: transitionDirection * -18 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <MemoryPage day={day} selectedMemory={selectedMemory} scrapbookMode={scrapbookMode} onSelectMemory={setSelectedMemory} onMoveMemory={moveMemory} onRotateMemory={updateMemoryRotation} onAddElement={addElement} onOpenPast={() => setPanel("past")} />
              <div className="binder-spine" aria-hidden="true">
                <div className="binder-cap binder-cap-top" />
                {[0, 1, 2, 3, 4].map((ring) => <span className="binder-ring" key={ring}><i /><b /></span>)}
                <div className="binder-cap binder-cap-bottom" />
              </div>
              <PlannerPage day={day} onJournal={(journalText) => setDay((current) => ({ ...current, journalText }))} onTask={toggleTask} onAddTask={addTask} />
              {day.sealed && <div className="sealed-overlay"><span>✦</span><strong>sealed with care</strong><small>come back when you’re ready</small></div>}
            </motion.div>
          </AnimatePresence>
        </section>
        <aside className="right-utility">
          <div className="right-utility-top"><span>daybook <span className="slash">/</span> {preset.label}</span><button onClick={() => setShowVibes((value) => !value)}>{preset.emoji} <ChevronDown size={14} /></button></div>
          {showVibes && <div className="vibe-popover"><VibePicker vibe={day.vibe} prompt={day.atmospherePrompt} onVibe={(vibe) => setDay((current) => ({ ...current, vibe }))} onPrompt={updatePrompt} /></div>}
          <div className="right-note"><span className="note-pin" /><p>{completedCount === day.tasks.length && day.tasks.length > 0 ? "all the little promises, kept." : "you don’t have to do it all to have a day worth keeping."}</p><Heart size={14} fill="currentColor" /></div>
          <div className="right-wordcount"><span>{countWords(day.journalText)} words today</span><span className="wordcount-line" /></div>
        </aside>
      </div>
      <CameraButton onClick={() => setCaptureOpen(true)} />
      <button className="mobile-menu-button" onClick={() => setShowVibes((value) => !value)} aria-label="Open menu"><Menu size={18} /></button>
      <AnimatePresence>{momentComposerOpen && <TinyMomentsComposer onAdd={addMoment} onClose={() => setMomentComposerOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{panel === "capsule" && <CapsulePanel day={day} onSeal={() => setDay((current) => ({ ...current, sealed: !current.sealed }))} onClose={() => setPanel(null)} />}</AnimatePresence>
      <AnimatePresence>{panel === "past" && <PastPanel day={day} onClose={() => setPanel(null)} />}</AnimatePresence>
      <CaptureMomentDialog open={captureOpen} onClose={() => setCaptureOpen(false)} onFile={addCapture} />
      {extraElements.length > 0 && <div className="added-elements" aria-label="Added scrapbook elements">{extraElements.map((element, index) => <span key={`${element}-${index}`}>{element === "tape" ? "▰" : element === "sticker" ? "✦" : element === "label" ? "⌁" : "☼"}</span>)}</div>}
      <div className="build-credit"><Sparkles size={12} /> {isAuthenticated ? "saved to your daybook" : "preview mode · changes stay on this page"}</div>
    </main>
  );
}
