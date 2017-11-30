// var menu;
// class menu {
//     constructor(){
//         this.car    = new car;
//         this.order  = new order;
//         this.page   = 0;
//         this.count  = 20;
//     };
//     editPage(page){
//         this.page = page;
//     }
// }
function bindHandleToHeader(){
    const menuPills = $('ul#nav-pills');    
    const cars      = menuPills.find('li#automobile-pill');
    const orders    = menuPills.find('li#orders-pill');
    $(cars).click(function(){
        $(menuPills).find('li').removeClass('active');
        $(this).addClass('active');
        $('body').attr('openTab','catalog');
        recordCounter();
        $('div#list').attr('currentPage','0');
        changePager(); 
    });
    $(orders).click(function(){
        $(menuPills).find('li').removeClass('active');
        $(this).addClass('active');
        $('body').attr('openTab','order');
        recordCounter();
        $('div#list').attr('currentPage','0');
        changePager(); 
    });
}

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
    const page  = $('div#list').attr('currentPage');
    const count = Number($('select#count_record').find('option').filter(':selected').attr('counts'));
    switch (list){
        case 'catalog':
            $(prev).click(function(){
                handlePager(this, getCars)});
            $(next).click(function(){
                handlePager(this, getCars)});
            getCars(page, count);
            break;
        case 'order':
            $(prev).click(function(){
                handlePager(this, getOrders)});
            $(next).click(function(){
                handlePager(this, getOrders)});
            getOrders(page, count);
            break;
    }
}

$(document).ready(function(){
    // menu = new menu();
    getCarTemplate();
    getOrderTemplate();
    bindHandleToHeader();
    $('body').attr('openTab','catalog');
    recordCounter();
    $('div#list').attr('currentPage','0');
    changePager(); 
});