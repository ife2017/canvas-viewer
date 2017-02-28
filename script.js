class Thumbnail {
  constructor(canvasContext, scale, $viewer) {
    this.$root = document.querySelector('.thumbnail')
    this.$canvas = document.querySelector('.canvas-thumbnail')
    this.$canvas.width = canvasContext.canvas.width * scale
    this.$canvas.height = canvasContext.canvas.height * scale
    this.indicatorWidth = Math.round(this.$canvas.width / canvasContext.canvas.width * $viewer.clientWidth)
    this.indicatorHeight = Math.round(this.$canvas.height / canvasContext.canvas.height * $viewer.clientHeight)
    this.$indicator = document.querySelector('.indicator')
    this.$indicator.style.width = this.indicatorWidth + 'px'
    this.$indicator.style.height = this.indicatorHeight + 'px'
    this.canvasContext = this.$canvas.getContext('2d')
    this.sourceContext = canvasContext
    this.addEventListener = this.$root.addEventListener.bind(this.$root)
    this.initEventHandler()
  }

  initEventHandler() {
    this.$root.addEventListener('mousedown', event => {
      this.mousedown = true
      this.updatePosition(event)
    })
    this.$root.addEventListener('mouseup', () => {
      this.mousedown = false
    })
    this.$root.addEventListener('mousemove', event => {
      if (this.mousedown) {
        this.updatePosition(event)
      }
    })
  }

  draw() {
    this.canvasContext.drawImage(
      this.sourceContext.canvas, 0, 0, this.$canvas.width, this.$canvas.height)
  }

  updatePosition(event) {
    const left = event.x - this.$root.offsetLeft - this.indicatorWidth / 2
    const top = event.y - this.$root.offsetTop - this.indicatorHeight / 2
    this.$indicator.style.top = top + 'px'
    this.$indicator.style.left = left + 'px'
    this.$root.dispatchEvent(new CustomEvent('move', {
      detail: {
        x: left / this.$canvas.width,
        y: top / this.$canvas.height,
      },
    }))
  }

  setPosition(x, y) {
    this.$indicator.style.top = y * this.$canvas.height + 'px'
    this.$indicator.style.left = x * this.$canvas.width + 'px'
  }
}

class Application {
  constructor() {
    this.$canvas = document.querySelector('.canvas-huge')
    this.$canvas.width = 18000
    this.$canvas.height = 10000
    this.canvasContext = this.$canvas.getContext('2d')
    this.$viewer = document.querySelector('.viewer')
    this.thumbnail = new Thumbnail(this.canvasContext, 0.02, this.$viewer)
    this.initEventHandler()
    this.draw()
  }

  initEventHandler() {
    this.$viewer.addEventListener('mousedown', event => {
      this.mousedown = true
      this.x = event.x
      this.y = event.y
    })
    this.$viewer.addEventListener('mouseup', () => {
      this.mousedown = false
    })
    this.$viewer.addEventListener('mousemove', event => {
      if (this.mousedown) {
        this.$viewer.scrollLeft += this.x - event.x
        this.$viewer.scrollTop += this.y - event.y
        this.x = event.x
        this.y = event.y
      }
    })
    this.$viewer.addEventListener('scroll', () => {
      this.thumbnail.setPosition(
        this.$viewer.scrollLeft / this.$canvas.width,
        this.$viewer.scrollTop / this.$canvas.height)
    })
    this.thumbnail.addEventListener('move', event => {
      this.$viewer.scrollLeft = event.detail.x * this.$canvas.width
      this.$viewer.scrollTop = event.detail.y * this.$canvas.height
    })
  }

  /**
   * 绘制默认图像
   */
  draw() {
    const width = this.$canvas.width / 180
    const height = this.$canvas.height / 100
    for (let l = 0; l < 100; l += 1) {
      for (let h = 0; h < 180; h += 1) {
        this.canvasContext.fillStyle = `hsl(${h * 2}, 100%, ${l}%)`
        this.canvasContext.fillRect(h * width, l * width, width, height)
      }
    }
    this.thumbnail.draw()
  }
}

const app = new Application()
