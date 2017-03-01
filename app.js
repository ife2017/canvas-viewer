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
      this.x = event.x
      this.y = event.y
    })
    this.$viewer.addEventListener('mousemove', event => {
      if (event.buttons == 1) {
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
    this.$viewer.addEventListener('dblclick', event => {
      this.canvasContext.beginPath()
      this.canvasContext.arc(event.offsetX, event.offsetY, Math.random() * 100 + 100, 0, 2 * Math.PI)
      this.canvasContext.fill()
      this.thumbnail.draw()
    })
    this.thumbnail.addEventListener('move', event => {
      this.$viewer.scrollLeft = event.detail.x * this.$canvas.width
      this.$viewer.scrollTop = event.detail.y * this.$canvas.height
    })
    document.addEventListener('keydown', this.handleKeyboard.bind(this))
    document.addEventListener('keyup', this.handleKeyboard.bind(this))
  }

  handleKeyboard(event) {
    this.ctrlKey = event.ctrlKey
    if (this.ctrlKey) {
      this.$canvas.style.cursor = 'default'
    } else {
      this.$canvas.style.cursor = 'move'
    }
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
