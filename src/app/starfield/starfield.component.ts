import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, NgZone, HostListener
} from '@angular/core';

interface Star {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  alphaDelta: number;
  color: string;
}

interface Sparkle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

@Component({
  selector: 'app-starfield',
  templateUrl: './starfield.component.html',
  styleUrls: ['./starfield.component.scss']
})
export class StarfieldComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animId = 0;
  private stars: Star[] = [];
  private sparkles: Sparkle[] = [];
  private mouse = { x: -9999, y: -9999 };

  private colors = ['#ff6035', '#f4c430', '#2de2a4', '#9b5de5', '#fff8f0'];

  constructor(private zone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    this.initStars();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  @HostListener('window:resize')
  resize(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      this.sparkles.push(this.createSparkle(e.clientX, e.clientY));
    }
  }

  private initStars(): void {
    const canvas = this.canvasRef.nativeElement;
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) {
      this.stars.push(this.createStar(canvas.width, canvas.height));
    }
  }

  private createStar(w: number, h: number): Star {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 0.5 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.6,
      alphaDelta: (Math.random() - 0.5) * 0.005,
      color
    };
  }

  private createSparkle(x: number, y: number): Sparkle {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 0.8 + Math.random() * 2.2,
      alpha: 0.9,
      decay: 0.025 + Math.random() * 0.03,
      color
    };
  }

  private loop(): void {
    this.animId = requestAnimationFrame(() => this.loop());
    this.draw();
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    const W = canvas.width, H = canvas.height;

    ctx.fillStyle = 'rgba(13,11,30,0.18)';
    ctx.fillRect(0, 0, W, H);

    for (const s of this.stars) {
      const dx = this.mouse.x - s.x;
      const dy = this.mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.015;
        s.vx += dx / dist * force;
        s.vy += dy / dist * force;
      }
      s.vx *= 0.98; s.vy *= 0.98;
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      s.alpha += s.alphaDelta;
      if (s.alpha <= 0.1 || s.alpha >= 0.85) s.alphaDelta *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.hexToRgba(s.color, s.alpha);
      ctx.fill();

      if (s.radius > 1.2) {
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
        grad.addColorStop(0, this.hexToRgba(s.color, s.alpha * 0.4));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const sp = this.sparkles[i];
      sp.x += sp.vx; sp.y += sp.vy;
      sp.vy += 0.04;
      sp.alpha -= sp.decay;
      if (sp.alpha <= 0) { this.sparkles.splice(i, 1); continue; }
      this.drawStar(ctx, sp.x, sp.y, 4, sp.radius * 2, sp.radius, this.hexToRgba(sp.color, sp.alpha));
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number,
                   spikes: number, outerR: number, innerR: number, color: string): void {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR); rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR); rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}