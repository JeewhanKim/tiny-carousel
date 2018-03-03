/*
  🎠 Tiny Carousel 🎠
  Light-weight, simple, and easy-to-use Javascript plugin for slider functionality ⌛️
  Version:  0.5.0
  Author:   Jeewhan Kim
  Home:     https://github.com/JeewhanKim
*/
(function(win, doc, $){
  // console.log('tiny-carousel.js has been imported')
  class Carousel {
    constructor(element) {
      this.carousel = $(element)
      this.carouselWidth = $(element).outerWidth()
      this.slides = $(element).find('> *')
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
        className: 'tiny-carousel'
      }
    }
    set setOptions(options) {
      Object.assign(this.options, eval(`(${options})`))
    }
    get getOptions() {
      return this.options
    }
    init() {
      this.lazyLoad(false)
      console.log(this.slides.length)

      // remove children
      const children = this.slides
      this.slides.remove()

      const rows = children.length / this.options.slidesPerPage // 8/4 => 2
      let htm = '';

      for(let i=0; i<rows; i++){
        htm += `<div class="${this.options.className}-wrapper" style="width: 100%; display:grid;">`
        for(let j=i*this.options.slidesPerPage; j<((i+1) * this.options.slidesPerPage); j++) {
          htm += `${children[j].outerHTML}`
          console.log(children[j])
        }
        htm += `</div>`
      }
      this.carousel.append(htm)
      // add each row

      this.lazyLoad(true)
    }
    swipeEvents() {

    }
    animation() {

    }
    resizing() {
      
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
    // console.log(carousel.getOptions)
  }

  // parse Carousels
  carousels.map((i, elm) => { initCarousel(elm) })

})(window, document, jQuery)