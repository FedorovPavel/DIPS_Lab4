class order{
    constructor(menu){
        this.menu = menu;
        this.template = '';
        this.draft = '';
        this.paid = '';
        this.getOrderTemplate();
        this.getDraftTemplate();
        this.getPaidTemplate();
        this.paidOperation = false;
    }

    getPaidTemplate(){
        let self = this;
        const url = '/orderTemplate/paid';
        $.get(url, function(template){
            self.paid = $.parseHTML(template);
        });
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

    handleToCompleted(id, sender){
        let self = this;
        id = self.menu.checkID(id);
        if (id){
            let req = new XMLHttpRequest();
            const url = '/aggregator/orders/complete/' + id;
            req.open('PUT', url, true);
            req.onreadystatechange = function(){
                if (req.readyState != 4)
                    return;
                if (req.status == 202){
                    $(sender).text('Оплатить');
                    const list = self.menu.getList();
                    const record = $(list).find('div').filter(function(){
                        if ($(this).attr('id') == id)
                            return true;
                    });
                    $(record).find('span.status').text('Completed');
                    $(sender).remove();
                }
            }
            req.send();
        } else {
            alert ('НЕВЕРНЫЙ ID');
        }
    }

    sendPaidInfo(id, data, sender){
        const self = this;
        let req = new XMLHttpRequest();
        const url = '/aggregator/orders/paid/' + id;
        req.open('PUT', url, true);
        req.setRequestHeader('Content-type','application/json; charset=utf-8');
        req.onreadystatechange = function(){
            if (req.readyState != 4)
                return;
            if (req.status == 200){
                $(sender).text('Завершить');
                const list = self.menu.getList();
                const record = $(list).find('div').filter(function(){
                    if ($(this).attr('id') == id)
                        return true;
                });
                $(record).find('span.status').text('Paid');
                $(sender).click(function(sender){
                    self.handleToCompleted(id, sender);
                });
                $('body').find('#paid_panel').remove();
                self.paidOperation = false;
            }
        }
        req.send(data);
    }

    handleToPaid(id, sender){
        let self = this;
        id = self.menu.checkID(id);
        if (id){
            if (self.paidOperation){

            } else {
                self.paidOperation = true;
                const form = $(self.paid).clone();
                self.fillingPaidForm(id, form, sender);
                $('body').append(form);
            }
        } else {
            alert ('НЕВЕРНЫЙ ID');
        }
    }

    handleToConfirm(id, sender){
        let self = this;
        id = self.menu.checkID(id);
        if (id){
            let req = new XMLHttpRequest();
            const url = '/aggregator/orders/confirm/' + id;
            req.open('PUT', url, true);
            req.onreadystatechange = function(){
                if (req.readyState != 4)
                    return;
                if (req.status == 200){
                    $(sender).text('Оплатить');

                    const list = self.menu.getList();
                    const record = $(list).find('div').filter(function(){
                        if ($(this).attr('id') == id)
                            return true;
                    });
                    $(record).find('span.status').text('WaitForBilling');
                    $(sender).click(function(sender){
                        self.handleToPaid(id, this);
                    });
                }
            }
            req.send();
        } else {
            alert ('НЕВЕРНЫЙ ID');
        }
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
            $(record).attr('id', content.ID);
            $(record).find('div.record_header').attr('orderId',content.ID)
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
            $(record).find('h4.title').text(content.ID);
            $(record).find('span.lease-start').text(new Date(content.Lease.StartDate).toLocaleDateString());
            $(record).find('span.lease-end').text(new Date(content.Lease.EndDate).toLocaleDateString());
            $(record).find('span.date_issue').text(new Date(content.DateOfIssue).toLocaleString());
            $(record).find('span.status').text(content.Status);
            $(record).find('button.action_btn').attr('oid', content.ID);
            switch (content.Status){
                case 'Draft':
                    $(record).find('button.action_btn').text('Подтвердить');
                    $(record).find('button.action_btn').click(function(){
                        const id = $(this).attr('oid');
                        self.handleToConfirm(id, this);
                    });
                    break;
                case 'WaitForBilling':
                    $(record).find('button.action_btn').text('Оплатить');
                    $(record).find('button.action_btn').click(function(){
                        const id = $(this).attr('oid');
                        self.handleToPaid(id, this);
                    });
                    break;
                case 'Paid':
                    $(record).find('button.action_btn').text('Завершить');
                    $(record).find('button.action_btn').click(function(){
                        const id = $(this).attr('oid');
                        self.handleToCompleted(id, this);
                    });
                    break;
                case 'Completed':
                    $(record).find('button.action_btn').remove();
                    break;
                default:
                    break;

            }
            $(self.menu.getList()).append(record);
        }
    }

    fillingPaidForm(id, form, sender){
        let self = this;
        $(form).find('button.btn_submit').attr('id', id);
        $(form).find('#paySystem').change(function(){
            const value = self.menu.checkPaySystem(this.value);
            if (!value)
                $(form).find('span.errStatus').text('Некорректная платежная система');
            else {
                $(form).find('span.errStatus').text('');    
            }
        });
        $(form).find('#account').focusout(function(){
            if (!self.menu.checkAccount(this.value)){
                $(form).find('span.errStatus').text('Неправильно введен счет');
            } else {
                $(form).find('span.errStatus').text('');
            }
        });
        $(form).find('#cost').focusout(function(){
            if (!self.menu.checkCost(this.value)){
                $(form).find('span.errStatus').text('Неправильная сумма');
            }else{
                $(form).find('span.errStatus').text('');
            }
        });
        $(form).find('button.btn').click(function(){
            const data = {
                paySystem   : self.menu.checkPaySystem($(form).find('option').filter(':selected').val()),
                account     : self.menu.checkAccount($(form).find('#account').val()),
                cost        : self.menu.checkCost($(form).find('#cost').val())
            }
            if (!data.paySystem){
                $(form).find('#paySystem').focus();
                $(form).find('.errStatus').text('Некорректная платежная система');
                return;
            }
            if (!data.account){
                $(form).find('#account').focus();
                $(form).find('.errStatus').text('Неправильно введен счет');
                return;
            }
            if (!data.cost){
                $(form).find('#cost').focus();
                $(form).find('.errStatus').text('Неправильная сумма');
                return;
            }
            self.sendPaidInfo(id, JSON.stringify(data), sender);
        });
    }
}