class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }
  add(c) {
    return new Complex(c.re + this.re, c.im + this.im);
  }
  //(a+bi)(c+di)=(ac−bd)+(ad+bc)i
  mul(c) {
    return new Complex(
      this.re * c.re - this.im * c.im,
      this.re * c.im + this.im * c.re
    );
  }

  norm() {
    return sqrt(this.re * this.re + this.im * this.im);
  }

  angle() {
    return atan2(this.im, this.re);
  }
}

//https://www.dynamicmath.xyz/fourier-epicycles/
function dft(x) {
  const X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let X_k = new Complex(0, 0);
    for (let n = 0; n < N; n++) {
      const w = (TWO_PI * k * n) / N;
      X_k = X_k.add(x[n].mul(new Complex(cos(w), -sin(w))));
    }
    X_k.re = X_k.re / N;
    X_k.im = X_k.im / N;
    let freq = k;
    let amp = X_k.norm();
    let phase = X_k.angle();
    X.push({ freq, amp, phase });
  }
  return X;
}
