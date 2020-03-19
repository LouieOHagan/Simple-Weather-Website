$(document).ready(function(){
    $('.carousel-wrapper').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 3,
        nextArrow: $('.next'),
        prevArrow: $('.prev'),
        responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
  ]
    });
});
