$(document).ready(function(){
    $(window).scroll(function(){
         if(this.scrollY>20){
            $('.navbar').addClass("sticky");
         }else{
            $('.navbar').removeClass("sticky");
         }
         if(this.scrollY>200){
            $('.scroll-up-btn').addClass("show");
         }
         else{
            $('.scroll-up-btn').removeClass("show");
         }
    });

      // slide-up script
      $('.scroll-up-btn').click(function(){
         $('html').animate({scrollTop: 0});
         // removing smooth scroll on slide-up button click
         $('html').css("scrollBehavior", "auto");
     });
     $('.navbar .menu li a').click(function(){
         // applying again smooth scroll on menu items click
         $('html').css("scrollBehavior", "smooth");
     });


   //  toggle menu /navbar script
   $('.menu-btn').click(function(){
      $('.navbar .menu').toggleClass("active");
      $('.menu-btn i').toggleClass("active");
   });
});

// Typing animation script
// import Typed from 'typed.js';
var typed = new Typed(".typing", {
   strings: ["Developer","Designer","Freelancer"],
   typeSpeed: 200,
   backSpeed: 70,
   loop: true
});

var typed = new Typed(".typing-2", {
   strings: ["Developer","Designer","Freelancer"],
   typeSpeed: 200,
   backSpeed: 70,
   loop: true
});






