export default class VHChromeFix {
  constructor(selectors) {
    this.selectors = selectors
    let userAgent = navigator.userAgent.toLowerCase()
    this.isAndroidChrome = /chrome/.test(userAgent) && /android/.test(userAgent)
    this.isIOSChrome = /crios/.test(userAgent)

    this.init()
  }

  init() {
    let self = this

    if (self.isAndroidChrome || self.isIOSChrome) {
      // If we detected Chrome on Android or iOS
      // Cache elements and trigger fix on init
      self.getElements(self.selectors)
      self.fixAll()

      // Cache window dimensions
      self.windowWidth = window.innerWidth
      self.windowHeight = window.innerHeight

      window.addEventListener('resize', function() {
        // Both width and height changed (orientation change)
        // This is a hack, as Android when keyboard pops up
        // Triggers orientation change
        self.windowWidth = window.innerWidth
        self.windowHeight = window.innerHeight
        self.fixAll()
      })
    }
  }

  getElements(selectors) {
    let self = this

    self.elements = []
    // Convert selectors to array if they are not
    selectors = Array.isArray(selectors) ? selectors : [selectors]

    selectors.forEach(data => {
      // Get all elements for selector
      const elements = document.querySelectorAll(data.selector)
      // Go through all elements for one selector to filter them
      elements.forEach(element => {
        const offset = data.offset || 0
        self.elements.push({
          domElement: element,
          vh: data.vh,
          offset: offset
        })
      })
    })
  }

  fixAll() {
    let self = this
    self.elements.forEach(element => {
      const size =
        window.innerHeight * (element.vh / 100) - element.offset + 'px'
      element.domElement.style.height = size
    })
  }
}
