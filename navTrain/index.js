$(document).ready(function(){
    $('.menu-trigger').on('click',function(){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active')
        }
        if ($('.nav').hasClass('show')) {
            $('.nav').removeClass('show');
        } else {
            $('.nav').addClass('show');
        }
    })
})