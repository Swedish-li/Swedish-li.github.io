function rand(rMi, rMa) {
  return ~~(Math.random() * (rMa - rMi + 1) + rMi)
}

export default class OrbTrails {
  _ctx

  _canvasEle
  _orbs = []
  _orbCount = 30
  _radius
  _count = 600
  _cw
  _ch
  _dpr

  constructor(canvasEle) {
    this._ctx = canvasEle.getContext('2d')
    this._canvasEle = canvasEle
    this.orbGo = this.orbGo.bind(this)
    this.turnOffMove = this.turnOffMove.bind(this)
    this.turnOnMove = this.turnOnMove.bind(this)
    this.loop = this.loop.bind(this)
  }

  init() {
    this._dpr = window.devicePixelRatio
    this._cw = window.innerWidth
    this._ch = window.innerHeight

    this._canvasEle.width = this._cw * this._dpr
    this._canvasEle.height = this._ch * this._dpr

    this._ctx.scale(this._dpr, this._dpr)
    this._ctx.lineCap = 'round'

    this._canvasEle.addEventListener('mousedown', this.orbGo, false)
    this._canvasEle.addEventListener('mousedown', this.turnOnMove, false)
    this._canvasEle.addEventListener('mouseup', this.turnOffMove, false)

    while (this._count--) {
      this.createOrb(this._cw / 2, this._ch / 2 + this._count * 2)
    }
    this.loop()
  }

  createOrb(mx, my) {
    const dx = this._cw / 2 - mx
    const dy = this._ch / 2 - my
    const dist = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)
    this._orbs.push(new Orb(mx, my, angle, this._cw, this._ch, dist))
  }

  orbGo(e) {
    const mx = e.pageX - c.offsetLeft
    const my = e.pageY - c.offsetTop
    this.createOrb(mx, my)
  }

  turnOnMove() {
    this._canvasEle.addEventListener('mousemove', this.orbGo, false)
  }

  turnOffMove() {
    this._canvasEle.removeEventListener('mousemove', this.orbGo, false)
  }

  loop() {
    window.requestAnimationFrame(this.loop)
    // if (trail) {
    this._ctx.fillStyle = 'rgba(0,0,0,.1)'
    this._ctx.fillRect(0, 0, this._cw, this._ch)
    // } else {
    // this._ctx.clearRect(0, 0, this._cw, this._ch);
    // }
    let i = this._orbs.length
    while (i--) {
      const orb = this._orbs[i]
      let updateCount = 3
      while (updateCount--) {
        orb.update()
        orb.draw(this._ctx)
      }
    }
  }
}

class Orb {
  x
  y

  hue = 0
  colorAngle = 0
  angle
  //size: .5+dist/250,
  size = rand(1, 3) / 2
  centerX
  centerY
  radius
  speed
  alpha
  _cw
  _ch
  constructor(mx, my, angle, cw, ch, dist) {
    this.x = mx
    this.y = my
    this.angle = angle + Math.PI / 2
    this.centerX = cw / 2
    this.centerY = ch / 2
    this.radius = dist
    this.speed = (rand(5, 10) / 1000) * (dist / 750) + 0.015
    this.alpha = 1 - Math.abs(dist) / cw
    this._cw = cw
    this._ch = ch
  }

  draw(ctx) {
    ctx.strokeStyle = 'hsla(' + this.colorAngle + ',100%,50%,1)'
    ctx.lineWidth = this.size
    ctx.beginPath()
    ctx.moveTo(this.lastX, this.lastY)
    ctx.lineTo(this.x, this.y)
    ctx.stroke()
  }
  update() {
    const mx = this.x
    const my = this.y
    this.lastX = this.x
    this.lastY = this.y
    let x1 = this._cw / 2
    let y1 = this._ch / 2
    let x2 = mx
    let y2 = my
    let rise = y1 - y2
    let run = x1 - x2
    let slope = -(rise / run)
    let radian = Math.atan(slope)
    let angleH = Math.floor(radian * (180 / Math.PI))
    if (x2 < x1 && y2 < y1) {
      angleH += 180
    }
    if (x2 < x1 && y2 > y1) {
      angleH += 180
    }
    if (x2 > x1 && y2 > y1) {
      angleH += 360
    }
    if (y2 < y1 && slope == '-Infinity') {
      angleH = 90
    }
    if (y2 > y1 && slope == 'Infinity') {
      angleH = 270
    }
    if (x2 < x1 && slope == '0') {
      angleH = 180
    }
    if (isNaN(angleH)) {
      angleH = 0
    }

    this.colorAngle = angleH
    this.x = this.centerX + Math.sin(this.angle * -1) * this.radius
    this.y = this.centerY + Math.cos(this.angle * -1) * this.radius
    this.angle += this.speed
  }
}
