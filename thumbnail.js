/**
 * 缩略图模块
 */
class Thumbnail {
  constructor(canvasContext, scale, $viewer) {
    this.$root = document.querySelector('.thumbnail')
    this.$canvas = document.querySelector('.canvas-thumbnail')
    this.$canvas.width = canvasContext.canvas.width * scale
    this.$canvas.height = canvasContext.canvas.height * scale
    this.indicatorWidth = Math.round(
      this.$canvas.width / canvasContext.canvas.width * $viewer.clientWidth)
    this.indicatorHeight = Math.round(
      this.$canvas.height / canvasContext.canvas.height * $viewer.clientHeight)
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
      console.log(event)
      if (this.mousedown) {
        this.updatePosition(event)
      }
    })
  }

  /**
   * 更新缩略图
   */
  draw() {
    this.canvasContext.drawImage(
      this.sourceContext.canvas, 0, 0, this.$canvas.width, this.$canvas.height)
  }

  /**
   * 根据鼠标事件更新指示器位置
   *
   * @param event
   */
  updatePosition(event) {
    const left = event.x - this.$root.offsetLeft - this.indicatorWidth / 2
    const top = event.y - this.$root.offsetTop - this.indicatorHeight / 2
    this.$indicator.style.top = top + 'px'
    this.$indicator.style.left = left + 'px'

    /**
     * 触发移动事件，调用者可以通过 addEventListener 监听 move 事件
     * 然后通过 event.detail 得到移动的位置
     *
     * @event move
     * @type {object}
     * @property {float} x - X 偏移量，取值范围 [0, 1]
     * @property {float} y - Y 偏移量，取值范围 [0, 1]
     */
    this.$root.dispatchEvent(new CustomEvent('move', {
      detail: {
        x: left / this.$canvas.width,
        y: top / this.$canvas.height,
      },
    }))
  }

  /**
   * 从外部设置指示器位置
   *
   * @param {float} offsetX - X 偏移量，取值范围 [0, 1]
   * @param {float} offsetY - Y 偏移量，取值范围 [0, 1]
   */
  setPosition(offsetX, offsetY) {
    this.$indicator.style.top = offsetY * this.$canvas.height + 'px'
    this.$indicator.style.left = offsetX * this.$canvas.width + 'px'
  }
}
