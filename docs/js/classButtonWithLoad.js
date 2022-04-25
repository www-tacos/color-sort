// @ts-check

class ButtonWithLoad {
  /** @type {HTMLButtonElement} */
  button
  /** @type {HTMLSpanElement} */
  span
  /** @type {(this:GlobalEventHandlers, ev:MouseEvent) => any} */
  func

  /** @type {number} */
  WAIT = 1000

  /**
   * @param {HTMLElement} elm
   * @returns
   */
  constructor(elm) {
    try {
      this.button = /** @type {HTMLButtonElement} */(elm)
      this.button.classList.remove("button-with-load--loading")
      this.span = /** @type {HTMLSpanElement} */(this.button.firstElementChild)
      this.func = this.button.onclick
    } catch (error) {
      console.error(
        "たぶんbuttonのつくりが違う（想定はbuttonの中にspan）",
        error,
        elm
      )
      throw error
    }
  }

  /**
   * @param {number} ms
   * @returns {Promise}
   */
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  async start() {
    this.button.classList.add("button-with-load--loading")
    this.button.onclick = null
    await this.sleep(1)  // なぜか、待ちを入れないと画面が更新されない
  }

  async finish() {
    this.button.classList.remove("button-with-load--loading")
    const bkup = this.span.innerText
    this.span.innerText = 'Complete'
    await this.sleep(this.WAIT)
    this.span.innerText = bkup
    this.button.onclick = this.func
  }

  async error() {
    this.button.classList.remove("button-with-load--loading")
    const bkup = this.span.innerText
    this.span.innerText = 'Error'
    await this.sleep(this.WAIT)
    this.span.innerText = bkup
    this.button.onclick = this.func
  }

  /**
   *
   * @param {Function} f
   * @param {HTMLElement} elm
   */
  static async alertWrap(f, elm) {
    const btn = elm && new ButtonWithLoad(elm)
    try {
      btn ? await f(btn) : await f()
    } catch (error) {
      console.error(error)
      alert('Errorです。詳細はデベロッパーツール（Ctrl + Shift + I）のコンソールから確認してください。')
      await btn.error()
    }
  }
}
