import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, NgZone, HostListener
} from '@angular/core';

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  alphaDelta: number;
}

interface CodeParticle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  decay: number;
  symbol: string;
  size: number;
}

@Component({
  selector: 'app-starfield',
  templateUrl: './starfield.component.html',
  styleUrls: ['./starfield.component.scss']
})
export class StarfieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private nodes: Node[] = [];
  private codeParticles: CodeParticle[] = [];
  private mouse = { x: -9999, y: -9999 };

  // IT-themed symbols that burst on cursor move
  private symbols = ['0', '1', '/>', '{', '}', '<', '>', '//', ';', '()', '=>', '[]'];

  // Colour palette — coral accent, dim white nodes, mint for connections
  private readonly CORAL  = '#ff6035';
  private readonly WHITE  = '#fff8f0';
  private readonly MINT   = '#2de2a4';
  private readonly CONN_DIST = 140; // max distance for drawing a connection line

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initNodes();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  @HostListener('window:resize')
  resize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;

    // Spawn 2–3 code symbol particles per mouse move
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 2.2;
      const sym = this.symbols[Math.floor(Math.random() * this.symbols.length)];
      this.codeParticles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5, // slight upward bias
        alpha: 1,
        decay: 0.022 + Math.random() * 0.018,
        symbol: sym,
        size: 9 + Math.floor(Math.random() * 7)
      });
    }
  }

  // ── Init ────────────────────────────────────────────────────

  private initNodes(): void {
    const { width: W, height: H } = this.canvasRef.nativeElement;
    const count = Math.floor((W * H) / 14000); // ~80–120 nodes on typical screens
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.2 + Math.random() * 1.8,
        alpha: 0.25 + Math.random() * 0.55,
        alphaDelta: (Math.random() - 0.5) * 0.004
      });
    }
  }

  // ── Main loop ────────────────────────────────────────────────

  private loop(): void {
    this.animId = requestAnimationFrame(() => this.loop());
    this.draw();
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx    = this.ctx;
    const W = canvas.width, H = canvas.height;

    // Semi-transparent clear — creates motion trail
    ctx.fillStyle = 'rgba(13,11,30,0.22)';
    ctx.fillRect(0, 0, W, H);

    // ── Update & draw nodes ──────────────────────────────────
    for (const n of this.nodes) {
      // Subtle cursor attraction within 180px
      const dx = this.mouse.x - n.x;
      const dy = this.mouse.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180 && dist > 0) {
        const f = (180 - dist) / 180 * 0.012;
        n.vx += dx / dist * f;
        n.vy += dy / dist * f;
      }

      n.vx *= 0.985;
      n.vy *= 0.985;
      n.x  += n.vx;
      n.y  += n.vy;

      // Wrap edges
      if (n.x < 0) n.x = W; else if (n.x > W) n.x = 0;
      if (n.y < 0) n.y = H; else if (n.y > H) n.y = 0;

      // Twinkle
      n.alpha += n.alphaDelta;
      if (n.alpha < 0.1 || n.alpha > 0.8) n.alphaDelta *= -1;

      // Node dot — white, small
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.rgba(this.WHITE, n.alpha * 0.75);
      ctx.fill();
    }

    // ── Draw connection lines between nearby nodes ────────────
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const a = this.nodes[i], b = this.nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < this.CONN_DIST) {
          const lineAlpha = (1 - d / this.CONN_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = this.rgba(this.MINT, lineAlpha);
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    // ── Highlighted connections near cursor (coral) ───────────
    for (const n of this.nodes) {
      const dx = this.mouse.x - n.x;
      const dy = this.mouse.y - n.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < this.CONN_DIST) {
        const lineAlpha = (1 - d / this.CONN_DIST) * 0.55;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.strokeStyle = this.rgba(this.CORAL, lineAlpha);
        ctx.lineWidth   = 0.8;
        ctx.stroke();

        // Highlight the node itself in coral
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius + 0.6, 0, Math.PI * 2);
        ctx.fillStyle = this.rgba(this.CORAL, lineAlpha * 0.9);
        ctx.fill();
      }
    }

    // ── Code symbol sparkles ──────────────────────────────────
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';

    for (let i = this.codeParticles.length - 1; i >= 0; i--) {
      const p = this.codeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035; // gravity
      p.alpha -= p.decay;

      if (p.alpha <= 0) { this.codeParticles.splice(i, 1); continue; }

      // Alternate coral / mint for code symbols
      const color = (i % 2 === 0) ? this.CORAL : this.MINT;
      ctx.font      = `bold ${p.size}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = this.rgba(color, p.alpha);
      ctx.fillText(p.symbol, p.x, p.y);
    }
  }

  // ── Helpers ──────────────────────────────────────────────────

  private rgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
  }
}
