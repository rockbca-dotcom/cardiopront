"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { RotateCcw } from "lucide-react";

interface SignaturePadProps {
  value: string;
  onChange: (value: string) => void;
}

const CANVAS_WIDTH = 680;
const CANVAS_HEIGHT = 220;

export default function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clearCanvas = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    clearCanvas();

    if (!value) return;

    const image = new window.Image();
    image.onload = () => {
      clearCanvas();
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = value;
  }, [value]);

  function getPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function paintBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawLine(start: { x: number; y: number }, end: { x: number; y: number }) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = getPoint(event);
    if (!point) return;

    lastPointRef.current = point;
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const current = getPoint(event);
    const last = lastPointRef.current;
    if (!current || !last) return;

    drawLine(last, current);
    lastPointRef.current = current;
  }

  function finishStroke() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = false;
    lastPointRef.current = null;
    onChange(canvas.toDataURL("image/png"));
  }

  function clear() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    paintBackground(ctx, canvas);
    onChange("");
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-surface-900">Assinatura eletrônica</p>
          <p className="text-xs text-surface-500 mt-1">
            Desenhe sua assinatura. Ela será incorporada aos PDFs e pode ser limpa a qualquer momento.
          </p>
        </div>

        <button type="button" className="btn-secondary text-xs inline-flex items-center gap-2" onClick={clear}>
          <RotateCcw className="w-3.5 h-3.5" /> Limpar assinatura
        </button>
      </div>

      <div className="rounded-2xl border border-dashed border-surface-300 bg-white p-3">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="h-[220px] w-full rounded-xl bg-white touch-none"
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerLeave={finishStroke}
        />
      </div>

      <p className="text-xs text-surface-500 leading-5">
        Esta é uma assinatura eletrônica visual. Para assinatura criptográfica ICP-Brasil (A1/A3), podemos integrar em uma etapa posterior.
      </p>
    </div>
  );
}
