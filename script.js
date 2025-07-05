const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mensaje = "Feliz cumple Paus :3";
const letras = [];
const particulas = [];
const iluminacionParticulas = [];
let iniciado = false;
let iluminacionActiva = false;
let brillo = 0;
let direccion = 1;

class Letra {
  constructor(letra, index) {
    this.letra = letra;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.tx = canvas.width / 2 - mensaje.length * 10 + index * 20;
    this.ty = canvas.height / 2;
    this.done = false;
  }

  update() {
    this.x += (this.tx - this.x) * 0.08;
    this.y += (this.ty - this.y) * 0.08;
    if (Math.abs(this.x - this.tx) < 1 && Math.abs(this.y - this.ty) < 1) {
      this.done = true;
    }
  }

  draw() {
    ctx.fillStyle = "#00c3ff";
    ctx.font = "bold 32px Cinzel";
    ctx.fillText(this.letra, this.x, this.y);
  }
}

class Particula {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw() {
    if (this.alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, "rgba(0,195,255,1)");
    grad.addColorStop(1, "rgba(0,195,255,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class LuzParticula {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height / 2 + Math.random() * canvas.height / 2;
    this.alpha = Math.random() * 0.3 + 0.1;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * -0.5 - 0.2;
  }

  update() {
    this.y += this.speed;
    if (this.y < canvas.height / 2) this.reset();
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#00c3ff";
    ctx.fillRect(this.x, this.y, this.size, this.size * 3);
    ctx.restore();
  }
}

function iniciar() {
  if (iniciado) return;
  iniciado = true;

  for (let i = 0; i < 150; i++) {
    particulas.push(new Particula());
  }

  for (let i = 0; i < mensaje.length; i++) {
    letras.push(new Letra(mensaje[i], i));
  }

  for (let i = 0; i < 100; i++) {
    iluminacionParticulas.push(new LuzParticula());
  }

  animate();
}

function dibujarIluminacion() {
  brillo += 0.01 * direccion;
  if (brillo > 0.3 || brillo < 0.1) direccion *= -1;

  const grad = ctx.createLinearGradient(0, canvas.height, 0, canvas.height / 2);
  grad.addColorStop(0, `rgba(0,195,255,${0.4 + brillo})`);
  grad.addColorStop(1, "rgba(0,195,255,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

  for (let p of iluminacionParticulas) {
    p.update();
    p.draw();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particulas.forEach(p => {
    p.update();
    p.draw();
  });

  let letrasCompletas = true;
  letras.forEach(l => {
    l.update();
    l.draw();
    if (!l.done) letrasCompletas = false;
  });

  if (letrasCompletas && !iluminacionActiva) {
    iluminacionActiva = true;
  }

  if (iluminacionActiva) {
    dibujarIluminacion();
  }

  requestAnimationFrame(animate);
}

document.addEventListener("click", iniciar);
document.addEventListener("touchstart", iniciar);
