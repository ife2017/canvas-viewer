class Viewer {
  constructor(sourceCanvas) {
    this.sourceCanvas = sourceCanvas
    this.x = 0
    this.y = 0
    this.$viewer = document.querySelector('.viewer')
    this.$canvas = document.querySelector('.canvas-viewer')
    this.$canvas.width = 1000
    this.$canvas.height = 600
    this.$xRange = document.querySelector('.x-range')
    this.$xRange.max = this.sourceCanvas.width - this.$canvas.width
    this.$yRange = document.querySelector('.y-range')
    this.$yRange.max = this.sourceCanvas.height - this.$canvas.height
    this.$yRange.value = this.$yRange.max
    this.canvasContext = this.$canvas.getContext('2d')
    this.initEventHandler()
  }

  initEventHandler() {
    this.addEventListener = this.$viewer.addEventListener.bind(this.$viewer)
    this.$canvas.addEventListener('mousedown', () => {
      this.mousedown = true
      this.$canvas.style.cursor = '-webkit-grabbing'
    })
    this.$canvas.addEventListener('mouseup', () => {
      this.mousedown = false
      this.$canvas.style.cursor = '-webkit-grab'
    })
    this.$canvas.addEventListener('mousemove', this.updatePosition.bind(this))
    this.$xRange.addEventListener('input', () => {
      const x = this.$xRange.value / this.sourceCanvas.width
      this.setPosition({x: x})
      this.$viewer.dispatchEvent(new CustomEvent('move', {
        detail: {x: x},
      }))
    })
    this.$yRange.addEventListener('input', () => {
      const y = (this.$yRange.max - this.$yRange.value) / this.sourceCanvas.height
      this.setPosition({y: y})
      this.$viewer.dispatchEvent(new CustomEvent('move', {
        detail: {y: y},
      }))
    })
  }

  updatePosition(event) {
    if (this.mousedown && event.buttons == 1) {
      this.x -= event.movementX / devicePixelRatio
      this.y -= event.movementY / devicePixelRatio
      this.x = Math.min(Math.max(this.x, 0), this.sourceCanvas.width - this.$canvas.width)
      this.y = Math.min(Math.max(this.y, 0), this.sourceCanvas.height - this.$canvas.height)

      this.$xRange.value = this.x
      this.$yRange.value = this.$yRange.max - this.y

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

      this.draw()
    }
  }

  setPosition(position) {
    if (position.x) {
      this.x = position.x * this.sourceCanvas.width
    }
    if (position.y) {
      this.y = position.y * this.sourceCanvas.height
    }
    this.draw()
  }

  draw() {
    this.canvasContext.drawImage(
      this.sourceCanvas,
      this.x, this.y, this.$canvas.width, this.$canvas.height,
      0, 0, this.$canvas.width, this.$canvas.height)
  }
}
