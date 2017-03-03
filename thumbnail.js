/**
 * @event move
 * @type {object}
 * @property {number} x - X 偏移量
 * @property {number} y - Y 偏移量
 */
class Thumbnail {
  constructor(sourceCanvas, width, height, scale) {
    this.$thumbnail = document.querySelector('.thumbnail')
    this.$canvas = document.querySelector('.canvas-thumbnail')
    this.$canvas.width = sourceCanvas.width * scale
    this.$canvas.height = sourceCanvas.height * scale
    this.$indicator = document.querySelector('.indicator')
    this.$indicator.style.width = Math.round(this.$canvas.width / sourceCanvas.width * width) + 'px'
    this.$indicator.style.height = Math.round(this.$canvas.height / sourceCanvas.height * height) + 'px'
    this.canvasContext = this.$canvas.getContext('2d')
    this.initEventHandler()
  }

  initEventHandler() {
    this.addEventListener = this.$thumbnail.addEventListener.bind(this.$thumbnail)
    this.$thumbnail.addEventListener('mousedown', this.updatePosition.bind(this))
    this.$thumbnail.addEventListener('mousemove', event => {
      if (event.buttons == 1) {
        this.updatePosition(event)
      }
    })
  }

  /**
   * 更新缩略图
   */
  draw(canvas) {
    this.canvasContext.drawImage(canvas, 0, 0, this.$canvas.width, this.$canvas.height)
  }

  /**
   * 根据鼠标事件更新位置，并触发 move 事件
   */
  updatePosition(event) {
    const rect = this.$thumbnail.getBoundingClientRect()
    let x = event.x - rect.left - this.$indicator.clientWidth / 2
    let y = event.y - rect.top - this.$indicator.clientHeight / 2

    // 保证 x、y 的值合法
    x = Math.min(Math.max(x, 0), this.$canvas.width - this.$indicator.clientWidth - 2)
    y = Math.min(Math.max(y, 0), this.$canvas.height - this.$indicator.clientHeight - 2)

    this.$indicator.style.left = x + 'px'
    this.$indicator.style.top = y + 'px'

    // 触发 move 事件
    this.$thumbnail.dispatchEvent(new CustomEvent('move', {
      detail: {
        x: x / this.$canvas.width,
        y: y / this.$canvas.height,
      },
    }))
  }

  setPosition(position) {
    if (position.x) {
      this.$indicator.style.left = position.x * this.$canvas.width + 'px'
    }
    if (position.y) {
      this.$indicator.style.top = position.y * this.$canvas.height + 'px'
    }
  }
}
