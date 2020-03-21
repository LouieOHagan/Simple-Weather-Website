function sliderInit(){
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
    }
    },
    {
    breakpoint: 535,
    settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
    }
    },
    {
    breakpoint: 385,
    settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
    }
    },
]
    });
}
sliderInit();