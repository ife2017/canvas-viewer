class Viewer {
  constructor(sourceCanvas) {
    this.x = 0
    this.y = 0
    this.$viewer = document.querySelector('.viewer')
    this.$canvas = document.querySelector('.canvas-viewer')
    this.$canvas.width = this.$viewer.clientWidth
    this.$canvas.height = this.$viewer.clientHeight
    this.canvasContext = this.$canvas.getContext('2d')
    this.sourceCanvas = sourceCanvas
    this.initEventHandler()
  }

  initEventHandler() {
    this.addEventListener = this.$viewer.addEventListener.bind(this.$viewer)
    this.$canvas.addEventListener('mousedown', () => {
      this.$canvas.style.cursor = '-webkit-grabbing'
    })
    this.$canvas.addEventListener('mouseup', () => {
      this.$canvas.style.cursor = '-webkit-grab'
    })
    this.$canvas.addEventListener('mousemove', this.updatePosition.bind(this))
  }

  updatePosition(event) {
    if (event.buttons == 1) {
      this.x -= event.movementX / devicePixelRatio
      this.y -= event.movementY / devicePixelRatio
      this.x = Math.min(Math.max(this.x, 0), this.sourceCanvas.width - this.$canvas.width)
      this.y = Math.min(Math.max(this.y, 0), this.sourceCanvas.height - this.$canvas.height)
      this.draw()

      /**
       * 分发移动事件，调用者可以通过 addEventListener 监听 move 事件
       * 然后通过 event.detail 得到移动的位置
       *
       * @event move
       * @type {object}
       * @property {number} x - X 偏移量，取值范围 [0, 1]
       * @property {number} y - Y 偏移量，取值范围 [0, 1]
       */
      this.$viewer.dispatchEvent(new CustomEvent('move', {
        detail: {
          x: this.x / this.sourceCanvas.width,
          y: this.y / this.sourceCanvas.height,
        },
      }))
    }
  }

  setPosition(position) {
    this.x = position.x * this.sourceCanvas.width
    this.y = position.y * this.sourceCanvas.height
    this.draw()
  }

  draw() {
    this.canvasContext.drawImage(
      this.sourceCanvas,
      this.x, this.y, this.$canvas.width, this.$canvas.height,
      0, 0, this.$canvas.width, this.$canvas.height)
  }
}
