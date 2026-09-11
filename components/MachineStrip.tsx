'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { color, depth, texture } from '@/design/tokens.stylex';
import { border, radius, space } from '@/design/space.stylex';
import { font, leading, size, tracking } from '@/design/type.stylex';
import { Lamp, Plate, Screw } from '@/components/primitives/Parts';
import { PushButton } from '@/components/primitives/PushButton';
import { Printout } from '@/components/Printout';
import { StateView } from '@/components/views/StateViews';
import type { PrintLine, Step } from '@/data/types';

const s = stylex.create({
  console: {
    position: 'relative',
    backgroundColor: color.machineLo,
    backgroundImage: texture.enamel,
    borderRadius: radius.bezel,
    borderWidth: border.panel,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
    boxShadow: depth.cabinet,
    paddingBlock: space.lg,
    paddingInline: { default: space.lg, '@media (max-width: 560px)': space.md },
    display: 'flex',
    flexDirection: 'column',
    gap: space.base,
  },

  /* --- control row --- */
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    flexWrap: 'wrap',
  },
  buttons: { display: 'flex', gap: space.sm, flexWrap: 'wrap' },
  annunciator: {
    flex: '1 1 300px',
    minWidth: { default: '220px', '@media (max-width: 480px)': '0' },
    display: 'flex',
    alignItems: 'center',
    gap: space.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
    minHeight: '52px',
    borderRadius: radius.tool,
    backgroundColor: '#160F07',
    boxShadow: depth.insetDeep,
    borderWidth: border.hair,
    borderStyle: 'solid',
    borderColor: color.machineEdge,
  },
  message: {
    fontFamily: font.mono,
    fontSize: size.sm,
    lineHeight: leading.snug,
    color: color.lampAmber,
    textShadow: '0 0 7px rgba(233,166,60,0.45)',
  },
  counter: {
    fontFamily: font.mono,
    fontSize: size.sm,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: tracking.caps,
    color: color.lampAmber,
    opacity: 0.75,
    whiteSpace: 'nowrap',
    paddingLeft: space.md,
    borderLeftWidth: border.hair,
    borderLeftStyle: 'solid',
    borderLeftColor: 'rgba(233,166,60,0.28)',
  },

  /* --- the bay --- */
  bay: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr) minmax(268px, 360px)',
      '@media (max-width: 940px)': 'minmax(0, 1fr)',
    },
    gap: space.base,
    alignItems: 'stretch',
  },

  /* CRT: bezel, glass, phosphor */
  tube: {
    position: 'relative',
    borderRadius: radius.bezel,
    padding: space.md,
    backgroundColor: color.bakelite,
    backgroundImage: texture.bakelite,
    boxShadow: `${depth.raised}, inset 0 0 0 1px rgba(0,0,0,0.6)`,
  },
  glass: {
    position: 'relative',
    minHeight: '232px',
    borderRadius: '14px / 20px',
    padding: space.lg,
    overflow: 'hidden',
    backgroundColor: color.crt,
    backgroundImage: `radial-gradient(120% 90% at 50% 42%, rgba(70,150,80,0.14), transparent 72%)`,
    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.9), inset 0 2px 6px rgba(0,0,0,0.9)',
  },
  scan: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: texture.scanlines,
    opacity: 0.4,
    mixBlendMode: 'multiply',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    boxShadow: 'inset 0 0 60px 12px rgba(0,0,0,0.85)',
    borderRadius: '14px / 20px',
  },
  /* the plugboard is a panel, not a tube: no glass, no scanlines */
  panelBay: {
    position: 'relative',
    minHeight: '232px',
    borderRadius: radius.tool,
    padding: space.md,
    backgroundColor: color.machineDeep,
    boxShadow: depth.insetDeep,
  },

  /* printer stack */
  printer: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    height: '100%',
    borderRadius: radius.tool,
    overflow: 'hidden',
    boxShadow: depth.raised,
  },
  slot: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    paddingBlock: space.sm,
    paddingInline: space.md,
    backgroundColor: color.machineDeep,
    borderBottomWidth: '3px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#0A0D0B',
    boxShadow: 'inset 0 -6px 10px -6px rgba(0,0,0,0.9)',
  },
  paperOut: { flex: '1 1 auto', minWidth: 0, minHeight: 0, display: 'flex', overflow: 'hidden' },
});

const REST = 'At rest. This console shows what the paradigm actually does between the source and the report.';

export function MachineStrip({ steps, isBoard }: { steps: Step[]; isBoard: boolean }) {
  const [i, setI] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const tempo = steps.length > 60 ? 110 : steps.length > 26 ? 300 : 560;

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setI((prev) => {
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, tempo);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [playing, steps.length, tempo]);

  useEffect(() => {
    if (playing && i >= steps.length - 1) stop();
  }, [i, playing, steps.length, stop]);

  const printed = useMemo<PrintLine[]>(() => {
    const out: PrintLine[] = [];
    for (let k = 0; k <= i; k++) {
      const p = steps[k]?.print;
      if (p) out.push(p);
    }
    return out;
  }, [i, steps]);

  const current = i < 0 ? steps[0] : steps[i];
  const message = i < 0 ? REST : current.say;

  const run = () => {
    if (playing) {
      stop();
      return;
    }
    if (i >= steps.length - 1) setI(-1);
    setPlaying(true);
  };
  const step = () => {
    stop();
    setI((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const reset = () => {
    stop();
    setI(-1);
  };

  const atEnd = i >= steps.length - 1;

  return (
    <div {...stylex.props(s.console)}>
      <Screw at="tl" i={2} />
      <Screw at="tr" i={0} />

      <div {...stylex.props(s.controls)}>
        <div {...stylex.props(s.buttons)}>
          <PushButton onClick={run} lit={playing} hue="red">
            {playing ? 'Halt' : 'Run'}
          </PushButton>
          <PushButton onClick={step} disabled={playing || atEnd} hue="amber">
            Step
          </PushButton>
          <PushButton onClick={reset} disabled={i < 0}>
            Reset
          </PushButton>
        </div>

        <div {...stylex.props(s.annunciator)}>
          <Lamp lit={playing} hue="red" />
          <span
            {...stylex.props(s.message)}
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <span {...stylex.props(s.counter)}>
            {String(Math.max(i + 1, 0)).padStart(3, '0')} / {String(steps.length).padStart(3, '0')}
          </span>
        </div>
      </div>

      <div {...stylex.props(s.bay)}>
        {isBoard ? (
          <div {...stylex.props(s.panelBay)}>
            <StateView st={current.st} />
          </div>
        ) : (
          <div {...stylex.props(s.tube)}>
            <div {...stylex.props(s.glass)}>
              <StateView st={current.st} />
              <span aria-hidden {...stylex.props(s.scan)} />
              <span aria-hidden {...stylex.props(s.vignette)} />
            </div>
          </div>
        )}

        <div {...stylex.props(s.printer)}>
          <div {...stylex.props(s.slot)}>
            <Plate s="micro">IBM 1403 · line printer</Plate>
            <Lamp lit={printed.length > 0} hue="green" />
          </div>
          <div {...stylex.props(s.paperOut)}>
            <Printout lines={printed} />
          </div>
        </div>
      </div>
    </div>
  );
}
