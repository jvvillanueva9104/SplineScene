import { useEffect, useRef } from "react";
import {
  detectPose,
  useBodyPoseState,
  initPoseDetection,
} from "../pose-detection/pose-detection";

interface Mouse {
  x: number | false;
  y: number | false;
}

interface Position {
  x: number;
  y: number;
}

interface Target extends Position {
  x: number;
  y: number;
  errx?: number;
  erry?: number;
}

class Segment {
  pos: Position;
  nextPos: Position;
  l: number;
  ang: number;

  constructor(
    parent: Segment | Tentacle,
    l: number,
    a: number,
    first: boolean
  ) {
    if (first) {
      this.pos = {
        x: (parent as Tentacle).x,
        y: (parent as Tentacle).y,
      };
    } else {
      this.pos = {
        x: (parent as Segment).nextPos.x,
        y: (parent as Segment).nextPos.y,
      };
    }
    this.l = l;
    this.ang = a;
    this.nextPos = {
      x: this.pos.x + this.l * Math.cos(this.ang),
      y: this.pos.y + this.l * Math.sin(this.ang),
    };
  }

  update(t: Position): void {
    this.ang = Math.atan2(t.y - this.pos.y, t.x - this.pos.x);
    this.pos.x = t.x + this.l * Math.cos(this.ang - Math.PI);
    this.pos.y = t.y + this.l * Math.sin(this.ang - Math.PI);
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  fallback(t: Position): void {
    this.pos.x = t.x;
    this.pos.y = t.y;
    this.nextPos.x = this.pos.x + this.l * Math.cos(this.ang);
    this.nextPos.y = this.pos.y + this.l * Math.sin(this.ang);
  }

  show(c: CanvasRenderingContext2D): void {
    c.lineTo(this.nextPos.x, this.nextPos.y);
  }
}

class Tentacle {
  x: number;
  y: number;
  l: number;
  n: number;
  t: Target;
  rand: number;
  segments: Segment[];
  angle: number;
  dt: number;

  constructor(x: number, y: number, l: number, n: number, a: number) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.n = n;
    this.t = { x: 0, y: 0 };
    this.rand = Math.random();
    this.angle = 0;
    this.dt = 0;
    this.segments = [new Segment(this, this.l / this.n, 0, true)];
    for (let i = 1; i < this.n; i++) {
      this.segments.push(
        new Segment(this.segments[i - 1], this.l / this.n, 0, false)
      );
    }
  }

  move(lastTarget: Target, target: Target): void {
    this.angle = Math.atan2(target.y - this.y, target.x - this.x);
    this.dt = this.dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5;
    this.t = {
      x: target.x - 0.8 * this.dt * Math.cos(this.angle),
      y: target.y - 0.8 * this.dt * Math.sin(this.angle),
    };
    if (this.t.x) {
      this.segments[this.n - 1].update(this.t);
    } else {
      this.segments[this.n - 1].update(target);
    }
    for (let i = this.n - 2; i >= 0; i--) {
      this.segments[i].update(this.segments[i + 1].pos);
    }
    if (
      this.dist(this.x, this.y, target.x, target.y) <=
      this.l + this.dist(lastTarget.x, lastTarget.y, target.x, target.y)
    ) {
      this.segments[0].fallback({ x: this.x, y: this.y });
      for (let i = 1; i < this.n; i++) {
        this.segments[i].fallback(this.segments[i - 1].nextPos);
      }
    }
  }

  show(c: CanvasRenderingContext2D, target: Target): void {
    if (this.dist(this.x, this.y, target.x, target.y) <= this.l) {
      c.globalCompositeOperation = "lighter";
      c.beginPath();
      c.lineTo(this.x, this.y);
      for (let i = 0; i < this.n; i++) {
        this.segments[i].show(c);
      }
      c.strokeStyle =
        "hsl(" +
        (this.rand * 60 + 180) +
        ",100%," +
        (this.rand * 60 + 25) +
        "%)";
      c.lineWidth = this.rand * 2;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.stroke();
      c.globalCompositeOperation = "source-over";
    }
  }

  show2(c: CanvasRenderingContext2D, target: Target): void {
    c.beginPath();
    if (this.dist(this.x, this.y, target.x, target.y) <= this.l) {
      c.arc(this.x, this.y, 2 * this.rand + 1, 0, 2 * Math.PI);
      c.fillStyle = "white";
    } else {
      c.arc(this.x, this.y, this.rand * 2, 0, 2 * Math.PI);
      c.fillStyle = "darkcyan";
    }
    c.fill();
  }

  private dist(p1x: number, p1y: number, p2x: number, p2y: number): number {
    return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
  }
}

const CanvasComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<Mouse>({ x: false, y: false });
  const lastMouseRef = useRef<Mouse>({ x: false, y: false });
  const lastTargetRef = useRef<Target>({ x: 0, y: 0 });
  const targetRef = useRef<Target>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas.getContext("2d");
    if (!c) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let maxl = 300,
      minl = 50,
      n = 30,
      numt = 500,
      tent: Tentacle[] = [],
      clicked = false,
      t = 0,
      q = 10;

    for (let i = 0; i < numt; i++) {
      tent.push(
        new Tentacle(
          Math.random() * w,
          Math.random() * h,
          Math.random() * (maxl - minl) + minl,
          n,
          Math.random() * 2 * Math.PI
        )
      );
    }

    function draw(): void {
      if (mouseRef.current.x) {
        targetRef.current.errx = mouseRef.current.x - targetRef.current.x;
        targetRef.current.erry =
          Number(mouseRef.current.y) - targetRef.current.y;
      } else {
        targetRef.current.errx =
          w / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
          targetRef.current.x;
        targetRef.current.erry =
          h / 2 +
          ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) /
            (Math.pow(Math.sin(t), 2) + 1) -
          targetRef.current.y;
      }

      if (!c) return;

      targetRef.current.x += targetRef.current.errx / 10;
      targetRef.current.y += targetRef.current.erry / 10;

      t += 0.01;

      const distance = Math.sqrt(
        Math.pow(targetRef.current.x - lastTargetRef.current.x, 2) +
          Math.pow(targetRef.current.y - lastTargetRef.current.y, 2)
      );

      c.beginPath();
      c.arc(
        targetRef.current.x,
        targetRef.current.y,
        distance + 5,
        0,
        2 * Math.PI
      );
      c.fillStyle = "hsl(210,100%,80%)";
      c.fill();

      for (let i = 0; i < numt; i++) {
        tent[i].move(lastTargetRef.current, targetRef.current);
        tent[i].show2(c, targetRef.current);
      }
      for (let i = 0; i < numt; i++) {
        tent[i].show(c, targetRef.current);
      }
      lastTargetRef.current.x = targetRef.current.x;
      lastTargetRef.current.y = targetRef.current.y;
    }

    const handleMouseMove = (e: MouseEvent): void => {
      console.log("mouse  movement", e.pageX, e.pageY);

      lastMouseRef.current.x = mouseRef.current.x;
      lastMouseRef.current.y = mouseRef.current.y;

      mouseRef.current.x = e.pageX;
      mouseRef.current.y = e.pageY;
    };

    const handleMouseLeave = (): void => {
      mouseRef.current.x = false;
      mouseRef.current.y = false;
    };

    const handleMouseDown = (): void => {
      clicked = true;
    };

    const handleMouseUp = (): void => {
      clicked = false;
    };

    const handleResize = (): void => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      loop();
    };

    const loop = (): void => {
      requestAnimationFrame(loop);
      c.clearRect(0, 0, w, h);
      draw();
    };

    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleMouseDown, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
    window.addEventListener("resize", handleResize);

    loop();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CanvasComponent;
