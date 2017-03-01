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
    this.$viewer.addEventListener('mousemove', event => {
      if (event.buttons == 1) {
        this.$viewer.scrollLeft -= event.movementX
        this.$viewer.scrollTop -= event.movementY
      }
    })
    this.$viewer.addEventListener('scroll', () => {
      this.thumbnail.setPosition(
        this.$viewer.scrollLeft / this.$canvas.width,
        this.$viewer.scrollTop / this.$canvas.height)
    })
    this.$viewer.addEventListener('dblclick', event => {
      this.canvasContext.beginPath()
      this.canvasContext.arc(
        event.offsetX, event.offsetY, Math.random() * 100 + 100, 0, 2 * Math.PI)
      this.canvasContext.fill()
      this.thumbnail.draw()
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
    const width = this.$canvas.width / 360
    const height = this.$canvas.height / 100
    for (let l = 0; l < 100; l += 1) {
      for (let h = 0; h < 360; h += 1) {
        this.canvasContext.fillStyle = `hsl(${h}, 100%, ${l}%)`
        this.canvasContext.fillRect(h * width, l * height, width, height)
      }
    }
    this.thumbnail.draw()
  }
}

new Application()
