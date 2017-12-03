(function(){
    var currentIndex = 0;
    var maxVisibleCircle = 12;
    var maxVisibleLines = 11;
    // function to create the lessons data
    window.createCircleData = function(count) { // function is added to window object just to access it from the html file since it;s inside the function wrapper
        var ulWrapper = $('.progress');
        var data = '<li data-percent="0%">'+
        '<span class="right-tick-icon hidden"><img src="images/icon-right-tick.png"></span>'+
        '<svg viewBox="-10 -10 220 220">'+
        '<g fill="none" stroke-width="6" transform="translate(100,100)">'+
        '<path d="M 0,-100 A 100,100 0 0,1 86.6,-50" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '<path d="M 86.6,-50 A 100,100 0 0,1 86.6,50" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '<path d="M 86.6,50 A 100,100 0 0,1 0,100" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '<path d="M 0,100 A 100,100 0 0,1 -86.6,50" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '<path d="M -86.6,50 A 100,100 0 0,1 -86.6,-50" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '<path d="M -86.6,-50 A 100,100 0 0,1 0,-100" stroke="rgba(0, 100, 80, 0.9)"/>'+
        '</g>'+
        '</svg> <svg viewBox="-10 -10 220 220">'+
        '<path d="M200,100 C200,44.771525 155.228475,0 100,0 C44.771525,0 0,44.771525 0,100 C0,155.228475 44.771525,200 100,200 C155.228475,200 200,155.228475 200,100 Z" stroke-dashoffset="0"></path>'+
        '</svg>'+
        // '<span class="lesson"></span>'+
        '</li>'+
        '<div class="line"></div>';
    if(count < 4) {
        alert('Count must be greater or equal to 4');
        return;
    }
    for(var i=0; i<count; i++) {
        ulWrapper.append(data);
    }
    $('div.line:last-child').remove();
    var liData =  $('.progress li');
    var lineData =  $('div.line');
    var theWidth = (liData.width()*count)+lineData.width()*(count-1);
    ulWrapper.wrap('<div class="mother-wrapper" />');
    var lineMrLeft = parseInt(lineData.css('margin-left'));
    var lineMrRight = parseInt(lineData.css('margin-right'));
    $('.mother-wrapper').css({
        width: (liData.width()*maxVisibleCircle + lineData.width()*maxVisibleLines)- (-(lineMrLeft + lineMrRight)*maxVisibleCircle-(-(lineMrLeft + lineMrRight)))
    });
    if(count < 12) {
        lineData.css({
            width: ((ulWrapper.width())-(liData.width()*count))/(count-1)
        });
    } else if (count == 12) {
        lineData.css({
            width: ((ulWrapper.width())-(liData.width()*count))/(count-1)
        });
        ulWrapper.css('width',theWidth);
    } else {
        $('.previous').css('pointer-events','none');
        $('.prev-gray, .next-white').removeClass('hidden').fadeIn();
        ulWrapper.css('width',theWidth);
    }
    $.ajax({
        url: './data.json',
        type: 'GET',
        dataType : 'json',
        complete: function(data) {
            if(data.status === 200) {
                var dataVal = JSON.parse(data.responseText);
                $.each(liData, function(index, value){
                    var _this = $(this);

                    _this.attr('data-percent', dataVal.response[index].percent);
                    //_this.find('.lesson').text('LESSON ' + (index+1));
                    _this.find('svg:nth-child(3) path').attr('stroke-dashoffset',(parseInt(dataVal.response[index].percent)*6.3).toString());
                    if(_this.attr('data-percent') === '100%') {
                        _this.next().css('border-color','rgba(0, 100, 80, 0.9)');
                        _this.find('svg:nth-child(3) path').css('fill','rgba(0, 100, 80, 0.9)');
                        _this.find('.right-tick-icon').fadeOut().delay(1500).fadeIn();
                    }
                });
            } else {
                alert('error is service call');
            }
        }
    });

    };
    //createCircleData(20); // Call this function and provide the number of lessons to create the circles, currently called from html part

    // Function to select the lessons on click
    function selectLesson(thisVal) {
    thisVal.parents('ul').find('li').removeClass('active');
        thisVal.addClass('active');
    }
    $('.lesson-wrapper').on('click','.progress li', function() {
        selectLesson($(this));
    });
    $('a.arrow').on('click', function(){
        var liWrap = $('.progress li');
        var line = $('div.line');
        var slideWidth = liWrap.width() + line.width()+(parseInt(line.css('margin-left')) + parseInt(line.css('margin-right')));
        if ($(this).is(".next")) {
            $('.previous').css('pointer-events','auto');
            $('.prev-white').removeClass('hidden').fadeIn();
            $('.prev-gray').addClass('hidden');
            currentIndex += 1;
            if(currentIndex+maxVisibleCircle === liWrap.length) {
            $('.next').css('pointer-events','none');
            $('.next-gray').removeClass('hidden').fadeIn();
            $(this).siblings('.mother-wrapper').find('ul').stop().animate({
              "margin-left": -(slideWidth*currentIndex)
            }, 1000);
            return;  
            }
            $(this).siblings('.mother-wrapper').find('ul').stop().animate({
            "margin-left": -(slideWidth*currentIndex)
            }, 1000)
        } else if ($(this).is(".previous")) {
            $('.next').css('pointer-events','auto');
            $('.next-white').removeClass('hidden').fadeIn();
            $('.next-gray').addClass('hidden'); 
            currentIndex -= 1;
            if(currentIndex === 0) {
            $('.previous').css('pointer-events','none');
            $('.prev-gray').removeClass('hidden').fadeIn();
            }
            $(this).siblings('.mother-wrapper').find('ul').stop().animate({
            "margin-left": -(slideWidth*currentIndex)
            }, 1000)       
        }
    });
})();    
