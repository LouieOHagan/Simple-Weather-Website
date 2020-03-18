$(document).ready(function(){
    $('.carousel-wrapper').slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 3,
        nextArrow: $('.next'),
        prevArrow: $('.prev')

    });
});
