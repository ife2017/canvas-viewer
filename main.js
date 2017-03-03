class Main {
  constructor() {
    this.$canvas = document.createElement('canvas')
    this.$canvas.width = 9000
    this.$canvas.height = 5000
    this.canvasContext = this.$canvas.getContext('2d')
    this.viewer = new Viewer(this.$canvas)
    this.thumbnail = new Thumbnail(
      this.canvasContext, this.viewer.$canvas.width, this.viewer.$canvas.height, 0.02)
    this.initEventHandler()
    this.draw()
  }

  initEventHandler() {
    this.viewer.addEventListener('dblclick', event => {
      this.canvasContext.beginPath()
      this.canvasContext.arc(
        this.viewer.x + event.offsetX,
        this.viewer.y + event.offsetY,
        Math.random() * 100 + 100, 0, 2 * Math.PI)
      this.canvasContext.fill()
      this.viewer.draw()
      this.thumbnail.draw()
    })
    this.viewer.addEventListener('move', event => {
      this.thumbnail.setPosition(event.detail)
    })
    this.thumbnail.addEventListener('move', event => {
      this.viewer.setPosition(event.detail)
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
    this.viewer.draw()
    this.thumbnail.draw()
  }
}

new Main()
