/*
  🎠 Tiny Carousel 🎠
  Light-weight, simple, and easy-to-use Javascript plugin for slider functionality ⌛️
  Version:  0.5.0
  Author:   Jeewhan Kim
  Home:     https://github.com/JeewhanKim
*/
(function(win, doc, $){
  class Carousel {
    constructor(element) {
      this.carousel = $(element)
      this.carouselWidth = $(element).outerWidth()
      this.slides = $(element).find('> *')
      this.sliderWidth = 0
      this.currentChapter = 0
      this.currentPos = 0
      this.centerPos = 0
      this.touchObject = {}
      this.swipePosition = 0
      this.options = {
        loop: true,
        slidesPerPage: 1,
        autoPlay: true,
        mobile: true,
        desktop: true,
        tablet: true,
        mobileMaxWidth: 767,
        tabletMaxWidth: 1024,
        lazyload: true,
        draggable: true,
        className: 'tiny-carousel'
      }
      this.swipeHandler = this.swipeHandler.bind(this)
      this.swipeBegin = this.swipeBegin.bind(this)
      this.swipeMove = this.swipeMove.bind(this)
      this.swipeEnd = this.swipeEnd.bind(this)
      this.positionUpdate = this.positionUpdate.bind(this)
    }
    set setOptions(options) {
      Object.assign(this.options, eval(`(${options})`))
    }
    get getOptions() {
      return this.options
    }
    init() {
      this.lazyLoad(false)

      const children = this.slides
      this.slides.remove()
      let htm = ''
      let inner = ''

      htm += `<div class="${this.options.className}-wrapper">`
      htm += `<div class="${this.options.className}-slides">`
      for(let i=0; i<children.length; i++){
        for(let j=i*this.options.slidesPerPage; j<((i+1) * this.options.slidesPerPage); j++) {
          inner += `${children[j].outerHTML}`
        }
      }
      htm += inner + inner
      htm += `</div>`
      htm += `</div>`

      this.carousel.append(htm)
      this.currentChapter = 0
      this.repositioning(this.currentChapter)
      this.swipeEvents()
      this.lazyLoad(true)
    }
    repositioning(chapter) {
      let pillarWidth = 0
      this.carousel.find(`.${this.options.className}-slides > *`).each((i, pillar) => {
        this.sliderWidth += $(pillar).width()
        $(pillar).css('width', $(pillar).width())
        pillarWidth = $(pillar).width()
      })
      this.centerPos = -(this.sliderWidth/2) + ( this.carousel.find(`.${this.options.className}-wrapper`).outerWidth() - pillarWidth)/2
      this.carousel.find(`.${this.options.className}-slides`).css({
        'width': this.sliderWidth + 'px',
        'transform': `translate3d(${this.centerPos}px, 0, 0)`
      })
      this.currentPos = this.centerPos
    }
    swipeHandler(event) {
      if (this.options.draggable === false && event.type.indexOf('mouse') !== -1) {
        return
      }
      // console.log('swipeHandler')

      switch (event.data.action) {
        case 'start':
            this.swipeBegin(event);
            break;
        case 'move':
            this.swipeMove(event);
            break;
        case 'end':
            this.swipeEnd(event);
            break;
      }

    }
    swipeBegin(event) {
      let touches
      if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
        touches = event.originalEvent.touches[0];
      }
      this.touchObject.startX = this.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
      this.touchObject.startY = this.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

      this.currentPos = parseInt(this.carousel.find(`.${this.options.className}-slides`).css('transform').split(',')[4])
    }
    swipeMove(event) {
      let touches = event.originalEvent !== undefined ? event.originalEvent.touches : null

      if (touches && touches.length !== 1) {
        return false;
      }

      this.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
      this.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
      this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)))
      const orientationLeft = this.touchObject.curX - this.touchObject.startX > 0 ? false: true
      this.swipePosition = this.currentPos + (orientationLeft ? -this.touchObject.swipeLength : this.touchObject.swipeLength)
      this.positionUpdate(this.swipePosition)

    }
    positionUpdate(pos) {
      this.carousel.find(`.${this.options.className}-slides`).css({
        'transform': `translate3d(${pos}px, 0, 0)`
      })
    }
    swipeEnd(event) {
      if(Math.abs(this.swipePosition) < $(win).width()) {
        const newPosition = this.centerPos - (Math.abs(this.swipePosition))
        this.positionUpdate(newPosition)
      } else if(Math.abs(this.swipePosition) > (this.sliderWidth - $(win).width()*2 )) {
        const newPosition = this.centerPos + (Math.abs(this.swipePosition))
        this.positionUpdate(-newPosition)
      }
    }
    swipeEvents() {
      const wrapper = this.carousel.find(`.${this.options.className}-wrapper`)

      wrapper.on('touchstart.slick mousedown.slick', {
          action: 'start'
      }, this.swipeHandler);
      wrapper.on('touchmove.slick mousemove.slick', {
          action: 'move'
      }, this.swipeHandler);
      wrapper.on('touchend.slick mouseup.slick', {
          action: 'end'
      }, this.swipeHandler);
      wrapper.on('touchcancel.slick mouseleave.slick', {
          action: 'end'
      }, this.swipeHandler);

    }
    lazyLoad(visible) {
      return (this.options.lazyload) ? this.carousel.css('opacity', visible ? 1:0) : true
    }
  }

  const carousels = $('[data-tiny-carousel]') // option?

  const initCarousel = (elm) => {
    const carousel = new Carousel(elm)
    carousel.setOptions = $(elm).attr('data-tiny-carousel')
    carousel.init()
  }
  carousels.map((i, elm) => { initCarousel(elm) })

})(window, document, jQuery)