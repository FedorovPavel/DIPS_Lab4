function recordCounter(){
    $('select#count_record').change(function(){
        let newPage = $('div#list').attr('currentPage', 0);
        changePager();
        
    });
}

function clearList(){
    $('div#list').children().remove();
}

function pagination(current, pages){
    if (current == 0)
        $('ul#pager').find('li.previous').addClass('hidden');
    else {
        $('ul#pager').find('li.previous').removeClass('hidden');
        $('ul#pager').find('li.previous').attr('page', current - 1);
    }
    if (pages == current)
        $('ul#pager').find('li.next').addClass('hidden');
    else {
        $('ul#pager').find('li.next').removeClass('hidden');
        $('ul#pager').find('li.next').attr('page', current + 1);
    }
}

function handlePager(sender, method){
    const page  = $(sender).attr('page');
    const count = Number($('select#count_record').find('option').filter(':selected').attr('counts'));
    method(page, count);
}

function changePager(){
    let list = $('body').attr('openTab');
    const mainPager = $('ul#pager');
    const prev = $(mainPager).find('li.previous')[0];
    const next = $(mainPager).find('li.next')[0];
    switch (list){
        case 'catalog':
            $(prev).click(function(){
                handlePager(this, getCars)});
            $(next).click(function(){
                handlePager(this, getCars)});
            const page  = $('div#list').attr('currentPage');
            const count = Number($('select#count_record').find('option').filter(':selected').attr('counts'));
            getCars(page, count);
            break;
        case 'orders':
            $(prev).click(function(){
                handlePager(this, getOrders)});
            $(next).click(function(){
                handlePager(this, getOrders)});
            break;
    }
}



$(document).ready(function(){
    getCarTemplate();
    getOrderTemplate();
    $('body').attr('openTab','catalog');
    recordCounter();
    $('div#list').attr('currentPage','0');
    changePager(); 
});