var orderTemplate;

function getOrderTemplate(){
    const url = '/orderTemplate';
    $.get(url, function(template){
        orderTemplate = $.parseHTML(template);
    });
}

function getOrders(page, count) {
    const url = '/aggregator/orders?page=' + page + '&count=' + count;
    $.get(url, function(res){
        clearList();
        $('div#list').append(res.html);
        pagination(res.info.current, res.info.pages);
    });
}

