// DETECT DEVICE 
var isiPad = navigator.userAgent.match(/iPad/i) !== null;
if (isiPad) { /*     	window.location = 'ipad.com'; */
}

function isiPhone() {
    return ((navigator.platform.indexOf('iPhone') != -1) || (navigator.platform.indexOf('iPod') != -1));
}
if (isiPhone()) { /* 	    window.location = 'iphone.com'; */
}
// END DETECT DEVICE
// LOADER
$('#header, .nav, .sticky-box, .sticky-content, .full-width').css({
    opacity: '0'
});
$(window).load(function() {
    setTimeout(function() {
        $('#loader').fadeOut(500);
        $('#header, .nav, .sticky-box, .sticky-content, .full-width').animate({
            opacity: '1'
        }, 1200);
    }, 1000);
});
// END LOADER
// ALTERNATIVE SCROLL-TO THAT WORKS ON iPad
$('.nav a, a.back_to_top').click(function() {
    var target = $(this).attr('href');
    $('body').scrollTo($(target), 1000, {
        'axis': 'y'
    });
    return false;
});
// END ALTERNATIVE SCROLL-TO THAT WORKS ON iPad
// INITIAL EAGLE ANIMATION, REMOVE EAGLE AND SHRINK BUY BUTTON
var buyButton = $('.shrink');
var eagleLogo = $('.eagle_logo');
var hbudPhone = $('.hbud_phone');
var windowHeight = $(window).height();
var eagleDrop = function() {
        setTimeout(function() {
            eagleLogo.stop().animate({
                top: '-10'
            }, 1000, 'easeOutBounce');
        }, 1200);
    };
$(window).load(function() {
    eagleDrop();
});
/*
function removeEagle() {
    if ($(window).scrollTop() > 100) {
        eagleLogo.css({top:'-300'});
    } 
    else {
        eagleLogo.css({top:'-10'}, 1000, 'easeOutBounce');
    }
}
*/

function fixBuy() {
    if ($(window).scrollTop() > buyButton.data('top')) {
        buyButton.css('top', (windowHeight - 210)).removeClass('buy_button_static_expand').addClass('buy_button_fixed_contract');
        eagleLogo.stop().animate({
            top: '-300px'
        }, 400);
        hbudPhone.removeClass('hbud_phone_hide').addClass('hbud_phone_show');
    } else {
        buyButton.css({
            top: '300px'
        }).removeClass('buy_button_fixed_contract').addClass('buy_button_static_expand');
        eagleLogo.stop().animate({
            top: '-10'
        }, 1000, 'easeOutBounce');
        hbudPhone.removeClass('hbud_phone_show').addClass('hbud_phone_hide');
    }
}
buyButton.data('top', buyButton.offset().top); // set original position on load
$(window).scroll(function() {
    fixBuy(); /*     removeEagle(); */
});
buyButton.mouseover(function() {
    if ($(window).scrollTop() > buyButton.data('top')) {
        $(this).addClass('buy_button_fixed_expanded');
    }
});
buyButton.mouseout(function() {
    if ($(window).scrollTop() > buyButton.data('top')) {
        $(this).removeClass('buy_button_fixed_expanded');
    }
});
// END EAGLE ANIMATION, REMOVE EAGLE AND SHRINK BUY BUTTON
// EAGLE LOGO HOVER ANIMATION AND SOUND
// Animate swing on hover
// Play 1 of 3 audio clips on hover		
var swing = function() {
        if (hover === true) {
            eagleLogo.removeClass('center').addClass('left').toggleClass('right');
            setTimeout(swing, 1000);
        }
    };
eagleLogo.mouseover(function() {
    hover = true;
    swing();
    var audio = $('#eagle_screech-' + Math.ceil(Math.random() * 4))[0];
    audio.play();
});
eagleLogo.mouseout(function() {
    eagleLogo.addClass('center');
    hover = false;
});
// END EAGLE LOGO HOVER ANIMATION AND SOUND
// CALCULATOR
$(document).ready(function() {
    // Hide some of the stuffs so we can show them later
    $('#money_bag_1, #money_bag_2, #money_bag_3, #money_bag_4, #money_bag_5, #monthly_response_large, #monthly_response_small, #final_savings, #phone_response, #total_yearly_cost, #rw_yearly_cost, #less_than_zero_savings').addClass('transparent');
    $('span.dollar_sign').hide();
    // Add commas to all digits
    $.fn.digits = function() {
        return this.each(function() {
            $(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'));
        });
    };
    // This is where we add up all of our values 
    // to come up with the savings amount

    function calculate() {
        // retrieve values and store them in variables so we can simplify and reuse
        var current_monthly_cost = $('#current_monthly_cost').digits().val();
        var months = 12;
        var current_phone_cost = $('#current_phone_cost').val();
        var number_of_lines = $('.number_of_lines').val();
        var current_yearly_cost = ((current_monthly_cost * months) * number_of_lines) + (Number(current_phone_cost) * number_of_lines);
        var republic_cost = 477 * Number(number_of_lines);
        var total_savings = current_yearly_cost - republic_cost;
        $('#current_yearly_cost').text(current_yearly_cost).digits();
        $('#total_savings').text(total_savings).digits();
        $('.republic_cost').text(republic_cost).digits();
        $('.lines').text(number_of_lines).digits();
        return false;
    }
    // When user types in their monthly cell phone bill
    // show message specific to the amount they pay
    // run calculate function
    $('#current_monthly_cost').keyup(function() {
        $('span.dollar_sign.one').fadeIn();
        if ($('#current_monthly_cost').val() < 75 && $('#current_monthly_cost').val() > 0) {
            $('#monthly_response_small').removeClass('transparent').addClass('opaque');
        }
        if ($('#current_monthly_cost').val() > 75) {
            $('#monthly_response_large').removeClass('transparent').addClass('opaque');
        }
        calculate();
    });
    // When user types in the cost of their phone
    // display message
    // run calculate function
    $('#current_phone_cost').keyup(function() {
        $('span.dollar_sign.two').fadeIn();
        if ($('#current_phone_cost').val() >= 1) {
            $('#phone_response').removeClass('transparent').addClass('opaque');
        }
        calculate();
    });
    // When user enters the number of lines they have
    // run calculate function
    $('.number_of_lines').change(function() {
        calculate();
    });
    // When a user clicks on calculate savings button
    // hide the messages that were displayed previously
    // animate money bags in depending on their savings amount value
    // hide money bags
    // display savings amount message
    // reset form
    $('#calculate').click(function() {
        $('#monthly_response_small, #monthly_response_large, #phone_response').hide();
        if ($('#total_savings').text() < 0) {
            $('#less_than_zero_savings').toggleClass('transparent');
        } else if ($('#total_savings').text() < 100 && $('#total_savings').text() > 0) {
            $('#money_bag_1').toggleClass('transparent').animate({
                top: '0px'
            }, 500, 'easeOutBounce');
            setTimeout(function() {
                $('.money_bag').animate({
                    opacity: '0'
                }, 1200, 'easeInOutCirc');
            }, 2500);
            setTimeout(function() {
                $('#final_savings').toggleClass('transparent');
            }, 3000);
        } else if ($('#total_savings').text() > 100 && $('#total_savings').text() < 1000) {
            $('#money_bag_3').toggleClass('transparent').animate({
                top: '0px'
            }, 500, 'easeOutBounce');
            setTimeout(function() {
                $('#money_bag_2').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 300);
            setTimeout(function() {
                $('#money_bag_4').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 600);
            setTimeout(function() {
                $('.money_bag').animate({
                    opacity: '0'
                }, 1200, 'easeInOutCirc');
            }, 1900);
            setTimeout(function() {
                $('#final_savings').toggleClass('transparent');
            }, 2400);
        } else {
            $('#money_bag_3').toggleClass('transparent').animate({
                top: '0px'
            }, 500, 'easeOutBounce');
            setTimeout(function() {
                $('#money_bag_2').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 300);
            setTimeout(function() {
                $('#money_bag_1').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 600);
            setTimeout(function() {
                $('#money_bag_5').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 900);
            setTimeout(function() {
                $('#money_bag_4').toggleClass('transparent').animate({
                    top: '0px'
                }, 500, 'easeOutBounce');
            }, 1200);
            setTimeout(function() {
                $('.money_bag').animate({
                    opacity: '0'
                }, 1200, 'easeInOutCirc');
            }, 2500);
            setTimeout(function() {
                $('#final_savings').toggleClass('transparent');
            }, 3000);
        }
        $('#current_monthly_cost, #current_phone_cost').val('');
        $('.dollar_sign').hide();
        return false;
    });
    // Make the calculate savings button inactive 
    // if required fields are not filled in
    var calculateInput = $('#calculate input');
    var required = $('.required');

    function containsBlanks() {
        var blanks = required.map(function() {
            return $(this).val() === '';
        });
        return $.inArray(true, blanks) != -1;
    }

    function requiredFilledIn() {
        if (containsBlanks()) calculateInput.attr('disabled', 'disabled');
        else calculateInput.removeAttr('disabled');
    }
    // Display hint text on focus
    $('span.hint_text').hide();
    $('input, textarea').focus(function() {
        $(this).next().fadeIn('slow');
    }).blur(function() {
        $(this).next().fadeOut('slow');
    }).keyup(function() {
        //Check all required fields
        requiredFilledIn();
    });
    //if the letter is not digit don't type anything
    $('input, textarea').keypress(function(e) {
        if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
    requiredFilledIn();
});
// END CALCULATOR
// TEXT SLIDER
//Global Variable
var slide = 'li';
var firstSlides = function() {
        // settings 
        var slider = $('#slider_one');
        var time_between_slides = 6000; // 4 seconds

        function slides() {
            return slider.find(slide);
        }
        slides().first().removeClass('firstwaiting').addClass('firstactive');
        interval = setInterval(

        function() {
            var findActiveIndex = slider.find(slide + '.firstactive').index();
            slides().eq(findActiveIndex).removeClass('firstactive').addClass('firstwaiting');
            if (slides().length == findActiveIndex + 1) findActiveIndex = -1; // loop to start
            slides().eq(findActiveIndex + 1).removeClass('firstwaiting').addClass('firstactive');
        }, time_between_slides);
    };
var secondSlides = function() {
        // settings 
        var slider = $('#slider_two');
        var time_between_slides = 4000; // 4 seconds

        function slides() {
            return slider.find(slide);
        }
        slides().first().removeClass('secondwaiting').addClass('secondactive');
        interval = setInterval(

        function() {
            var findActiveIndex = slider.find(slide + '.secondactive').index();
            slides().eq(findActiveIndex).removeClass('secondactive').addClass('secondwaiting');
            if (slides().length == findActiveIndex + 1) findActiveIndex = -1; // loop to start
            slides().eq(findActiveIndex + 1).removeClass('secondwaiting').addClass('secondactive');
        }, time_between_slides);
    };
var thirdSlides = function() {
        // settings 
        var slider = $('#slider_three');
        var time_between_slides = 7500; // 4 seconds

        function slides() {
            return slider.find(slide);
        }
        slides().first().removeClass('firstwaiting').addClass('firstactive');
        interval = setInterval(

        function() {
            var findActiveIndex = slider.find(slide + '.firstactive').index();
            slides().eq(findActiveIndex).removeClass('firstactive').addClass('firstwaiting');
            if (slides().length == findActiveIndex + 1) findActiveIndex = -1; // loop to start
            slides().eq(findActiveIndex + 1).removeClass('firstwaiting').addClass('firstactive');
        }, time_between_slides);
    };
var fourthSlides = function() {
        // settings 
        var slider = $('#slider_four');
        var time_between_slides = 5500; // 4 seconds

        function slides() {
            return slider.find(slide);
        }
        slides().first().removeClass('secondwaiting').addClass('secondactive');
        interval = setInterval(

        function() {
            var findActiveIndex = slider.find(slide + '.secondactive').index();
            slides().eq(findActiveIndex).removeClass('secondactive').addClass('secondwaiting');
            if (slides().length == findActiveIndex + 1) findActiveIndex = -1; // loop to start
            slides().eq(findActiveIndex + 1).removeClass('secondwaiting').addClass('secondactive');
        }, time_between_slides);
    };
firstSlides();
secondSlides();
thirdSlides();
fourthSlides();
//END TEXT SLIDER
// ANIMATIONS BASED ON WHERE USER HAS SCROLLED TO
// find the top of each section
var distanceFromVeryTop = 275;
var sectionOneDistance = $('#scroll-sect1').offset().top - distanceFromVeryTop;
var sectionTwoDistance = $('#scroll-sect2').offset().top - distanceFromVeryTop;
var sectionThreeDistance = $('#scroll-sect3').offset().top - distanceFromVeryTop;
var sectionFourDistance = $('#scroll-sect4').offset().top - distanceFromVeryTop;
var sectionFiveDistance = $('#scroll-sect5').offset().top - distanceFromVeryTop;
var sectionSixDistance = $('#scroll-sect6').offset().top - distanceFromVeryTop;
// CALL ANIMATIONS BASED ON WHERE WE'VE SROLLED
$(window).scroll(function() {
    if ($(window).scrollTop() > (sectionOneDistance)) {
        $('#header_intro').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 800, 'easeOutBounce');
    }
    if ($(window).scrollTop() > (sectionTwoDistance)) {
        $('#header_savings').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 1000, 'easeInOutBack');
    }
    if ($(window).scrollTop() > (sectionThreeDistance)) {
        $('#header_no-catch').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 800, 'easeOutBounce');
    }
    if ($(window).scrollTop() > (sectionFourDistance)) {
        $('#header_customer-reviews').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 1000, 'easeInOutBack');
    }
    if ($(window).scrollTop() > (sectionFiveDistance)) {
        // HOW IN THE HECK AND WHO IN TARNATION
        $('.how').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 1000, 'easeInOutBack');
        setTimeout(function() {
            $('.in_the_heck').animate({
                'opacity': '1'
            }, 500);
        }, 200);
        setTimeout(function() {
            $('.who').animate({
                'opacity': '1',
                'width': '100%',
                'height': '100%'
            }, 1000, 'easeInOutBack');
        }, 400);
        setTimeout(function() {
            $('.in_tarnation').animate({
                'opacity': '1'
            }, 500);
        }, 600);
    }
    if ($(window).scrollTop() > (sectionSixDistance)) {
        $('#header_conclusion').animate({
            'opacity': '1',
            'width': '100%',
            'height': '100%'
        }, 1000, 'easeOutBounce');
    }
});
// END ANIMATIONS BASED ON WHERE USER HAS SCROLLED
// RANDOM ANIMATIONS	
// ARROW ANIMATION
var animate_arrow_three = function() {
        var arrow_three = $('#savings_arrow');
        arrow_three.animate({
            width: '156px',
            marginLeft: '10px'
        }, 500, 'easeInOutQuad');
        arrow_three.animate({
            width: '140px',
            marginLeft: '0px'
        }, 500, 'easeInOutQuad', function() {
            animate_arrow_three();
        });
    }
animate_arrow_three();
// END RANDOM ANIMATIONS