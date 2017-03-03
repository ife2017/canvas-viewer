/**
 * 缩略图模块
 */
class Thumbnail {
  constructor(sourceCanvasContext, width, height, scale) {
    this.$thumbnail = document.querySelector('.thumbnail')
    this.$canvas = document.querySelector('.canvas-thumbnail')
    this.$canvas.width = sourceCanvasContext.canvas.width * scale
    this.$canvas.height = sourceCanvasContext.canvas.height * scale
    this.$indicator = document.querySelector('.indicator')
    this.$indicator.style.width = Math.round(
      this.$canvas.width / sourceCanvasContext.canvas.width * width) + 'px'
    this.$indicator.style.height = Math.round(
      this.$canvas.height / sourceCanvasContext.canvas.height * height) + 'px'
    this.sourceCanvasContext = sourceCanvasContext
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
    this.canvasContext.drawImage(
      this.sourceCanvasContext.canvas, 0, 0, this.$canvas.width, this.$canvas.height)
  }

  /**
   * 根据鼠标事件更新指示器位置
   *
   * @param event
   */
  updatePosition(event) {
    const left = event.x - this.$thumbnail.offsetLeft - this.$indicator.clientWidth / 2
    const top = event.y - this.$thumbnail.offsetTop - this.$indicator.clientHeight / 2

    // 防止越界
    if (top < 0 || top > this.$canvas.height - this.$indicator.clientHeight ||
        left < 0 || left > this.$canvas.width - this.$indicator.clientWidth) {
      return
    }

    this.$indicator.style.top = top + 'px'
    this.$indicator.style.left = left + 'px'

    /**
     * 分发移动事件，调用者可以通过 addEventListener 监听 move 事件
     * 然后通过 event.detail 得到移动的位置
     *
     * @event move
     * @type {object}
     * @property {number} x - X 偏移量，取值范围 [0, 1]
     * @property {number} y - Y 偏移量，取值范围 [0, 1]
     */
    this.$thumbnail.dispatchEvent(new CustomEvent('move', {
      detail: {
        x: left / this.$canvas.width,
        y: top / this.$canvas.height,
      },
    }))
  }

  setPosition(position) {
    this.$indicator.style.top = position.y * this.$canvas.height + 'px'
    this.$indicator.style.left = position.x * this.$canvas.width + 'px'
  }
}
