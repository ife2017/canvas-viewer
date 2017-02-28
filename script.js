class Thumbnail {
  constructor() {

  }
}

class Application {
  constructor() {
    this.canvas = document.querySelector('.huge-canvas')
    this.canvas.width = 18000
    this.canvas.height = 10000
    this.canvasContext = this.canvas.getContext('2d')
    this.$viewer = document.querySelector('.viewer')
    this.draw()
    this.init()
  }

  init() {
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
  }

  draw() {
    const width = this.canvas.width / 180
    const height = this.canvas.height / 100
    for (let l = 0; l < 100; l += 1) {
      for (let h = 0; h < 180; h += 1) {
        this.canvasContext.fillStyle = `hsl(${h * 2}, 100%, ${l}%)`
        this.canvasContext.fillRect(h * width, l * width, width, height)
      }
    }
  }
}

new Application()
