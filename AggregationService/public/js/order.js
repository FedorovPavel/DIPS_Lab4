// class order{
//     constructor(){

//     }
// }

var orderTemplate;
var orderErrorTemplate;

function getOrderTemplate(){
    const url = '/orderTemplate';
    $.get(url, function(template){
        orderTemplate = $.parseHTML(template.successfully);
        orderErrorTemplate = $.parseHTML(template.error);
    });
}

function getOrders(page, count) {
    const url = '/aggregator/orders?page=' + page + '&count=' + count;
    $.get(url, function(res){
        clearList();
        $('div#list').attr('currentPage',page);
        fillListWithOrder(res.content);
        pagination(res.info.current, res.info.pages);
    });
}

