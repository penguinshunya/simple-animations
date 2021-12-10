export class Vec2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(v: Vec2) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  applyMat2(m: Mat2) {
    return new Vec2(m.a[0][0] * this.x + m.a[0][1] * this.y, m.a[1][0] * this.x + m.a[1][1] * this.y);
  }
  multiplyScalar(s: number) {
    return new Vec2(this.x * s, this.y * s);
  }
  rotate(a: number) {
    const m = new Mat2(Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a));
    return this.applyMat2(m);
  }
}

export class Mat2 {
  a: number[][];
  constructor(a11: number, a12: number, a21: number, a22: number) {
    this.a = [[a11, a12], [a21, a22]];
  }
}
