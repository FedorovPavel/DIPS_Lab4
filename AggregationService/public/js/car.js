// class car{
//     constructor(){

//     }
// }

var carTemplate;
var carErrorTemplate;

function getCarTemplate(){
    const url = '/carTemplates';
    $.get(url, function(template){
        carTemplate = $.parseHTML(template.successfully);
        carErrorTemplate = $.parseHTML(template.error);
    });
    return;
}

function fillListWithCar(list){
    for (let I = 0; I < list.length; I++){
        const content = list[I];
        let record = $(carTemplate).clone();
        $(record).attr('id', content.id);
        $(record).find('div.record_header').attr('carId',content.id)
                                                .attr('filling',false)
                                                .attr('state','close');
        $(record).find('div.record_header').click(function(){
            if ($(this).attr('state') == 'close'){
                if ($(this).attr('filling') == 'false'){
                    getCar($(this).attr('carId'));
                    $(this).attr('filling', true);
                } else {
                    $(record).find('.detail_info').removeClass('hidden');
                }
                $(this).find('.view_detail_info').removeClass('glyphicon-chevron-down');
                $(this).find('.view_detail_info').addClass('glyphicon-chevron-up');
                $(this).attr('state', 'open');
            } else {
                $(this).find('.view_detail_info').removeClass('glyphicon-chevron-up');
                $(this).find('.view_detail_info').addClass('glyphicon-chevron-down');
                $(record).find('.detail_info').addClass('hidden');
                $(this).attr('state', 'close');
            }
        });
        $(record).find('h4.title').text(content.Manufacturer + ' ' + content.Model);
        $(record).find('span.manufacture').text(content.Manufacturer);
        $(record).find('span.model').text(content.Model);
        $(record).find('span.type').text(content.Type);
        $(record).find('span.cost').text(content.Cost);
        $(record).find('button.create_order').click(function(){
            alert("Заказ");
        });
        $('div#list').append(record);
    }
}

function addToListException(err){
    let template = $(carErrorTemplate).clone();
    $(template).find('span.status_code').text(err.status);
    $(template).find('span.error_msg').text(err.responseText);
    $('div#list').append(template);
    return;
}

function getCars(page, count) {
    const url = '/aggregator/catalog?page=' + page + '&count=' + count;
    $.get(url)
        .done(function(res){
            clearList();
            $('div#list').attr('currentPage',page);
            fillListWithCar(res.content);
            pagination(res.info.current, res.info.pages);
        })
        .fail(function(res){
            clearList();
            $('div#list').attr('currentPage',0);
            addToListException(res);
            pagination(0,0);
        })
}

function updateCarInfo(record, info){
    const detail = $(record).find('.detail_info');
    $(detail).find('span.door').text(info.Doors);
    $(detail).find('span.person').text(info.Person);
    $(detail).find('span.locationCity').text(info.Location.City);
    $(detail).find('span.locationStreet').text(info.Location.Street);
    $(detail).find('span.locationHouse').text(info.Location.House);
    $(detail).removeClass('hidden');
}

function getCar(id) {
    const url = '/aggregator/catalog/' + id;
    $.get(url, function(res){
        const record = $('div#list').find('div').filter(function(index){
            if (id == $(this).attr('id'))
                return true;
        });
        updateCarInfo(record, res);
    });
}