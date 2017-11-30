class order{
    constructor(menu){
        this.menu = menu;
        this.template = '';
        this.draft = '';
        this.getOrderTemplate();
        this.getDraftTemplate();
    }

    getOrderTemplate(){
        let self = this;
        const url = '/orderTemplate';
        $.get(url, function(template){
            self.template = $.parseHTML(template);
        });
    }

    getDraftTemplate(){
        let self = this;
        const url = '/orderTemplate/draft';
        $.get(url, function(template){
            self.draft = $.parseHTML(template);
        });
    }
    
    getOrders(page, count, bind) {
        let self = bind;
        const url = '/aggregator/orders?page=' + page + '&count=' + count;
        $.get(url)
            .done(function(res){
                self.menu.clearList();
                self.fillListWithOrder(res.content);
                self.menu.pagination(res.info.current, res.info.pages);
            })
            .fail(function(res){
                self.menu.addToListException(res);
                self.menu.pagination(0,0);
            })
    }

    fillListWithOrder(list){
        let self = this;
        for (let I = 0; I < list.length; I++){
            const content = list[I];
            let record = $(self.template).clone();
            $(record).attr('id', content.id);
            $(record).find('div.record_header').attr('orderId',content.id)
                                                    .attr('filling',false)
                                                    .attr('state','close');
            $(record).find('div.record_header').click(function(){
                if ($(this).attr('state') == 'close'){
                    if ($(this).attr('filling') == 'false'){
                        self.getOrder($(this).attr('orderId'));
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
            $(record).find('h4.title').text(content.id);
            $(record).find('span.lease-start').text(new Date(content.Lease.StartDate).toLocaleDateString());
            $(record).find('span.lease-end').text(new Date(content.Lease.EndDate).toLocaleDateString());
            $(record).find('span.date_issue').text(new Date(content.DateOfIssue).toLocaleString());
            $(record).find('span.status').text(content.Status);
            $(record).find('button.action_btn').click(function(){
                alert("Заказ");
            });
            $(self.menu.getList()).append(record);
        }
    }
}