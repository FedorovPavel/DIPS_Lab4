var Menu;
class menu {
    constructor(){
        this.car    = new car(this);
        this.order  = new order(this);
        this.errorTemplate;
        this.lastCount  = 20;
        this.page       = 0;
        this.pages;
        this.count      = 20;
        this.draftExecution = false;
        this.openTabs = 'catalog';
        this.getErrorTemplate();
        this.bindHandleToHeader();
        this.recordCounter();
        this.changePager();
    };

    //  Validate methods 
    checkPosIntNumber(text){
        if (text){
            let res = Number(parseInt(text));
            if (isNaN(res) || res < 0)
                return null;
            return res;
        }
        return null;
    }

    checkID(id){
        if (id){
            return id;
        } else {
            return null;
        }
    }

    checkPaySystem(text){
        const admissibleSystems = ['Сбербанк','Открытие','Возрождение','Тинькофф','RocketBank', 'Raiffeisen',
                                    'Альфа-банк'];
        if (text){
            let res = String(text);
            if (admissibleSystems.indexOf(res) != -1)
                return res;
            else 
                return null;
        } else {
            return null;
        }
    }

    checkAccount(text){
        if (text){
            const input = String(text);
            const accountParts = input.split(' ');
            if (accountParts.length < 4 || accountParts.length >= 6)
                return null;
            else {
                for (let I = 0; I < accountParts.length; I++){
                    const temp = Number(accountParts[I]);
                    if (isNaN(temp) || accountParts[I].length < 4){
                        return null;
                    }
                }
                return input;
            }
        } else {
            return null;
        }
    }

    checkCost(text){
        if (text){
            let number = parseFloat(text);
            if (isNaN(number) || number < 10.0)
                return null;
            else 
                return Number(number);
        } else {
            return null;
        }
    }

    ConvertStringToDate(date){
        date = String(date);
        if (!date)
            return null;
        const dateParts = date.split('-');
        if (!dateParts || dateParts.length != 3)
            return null;
        const year  = parseInt(dateParts[2]);
        const month = parseInt(dateParts[1]);
        const day   = parseInt(dateParts[0]);
        return day + '.' + month +'.' + year;
    }

    //  Получение шаблона для вывода ошибок
    getErrorTemplate(){
        let self = this;
        const url = '/errorTemplates';
        $.get(url, function(template){
            self.errorTemplate = $.parseHTML(template);
        });
        return;
    }

    getList(){
        return 'div#list';
    }

    bindHandleToHeader(){
        var self = this;
        const menuPills = $('ul#nav-pills');    
        const cars      = menuPills.find('li#automobile-pill');
        const orders    = menuPills.find('li#orders-pill');
        $(cars).click(function(){
            $(menuPills).find('li').removeClass('active');
            $(this).addClass('active');
            self.openTabs = 'catalog';
            self.page = 0;
            self.recordCounter();
            self.changePager(); 
            self.draftExecution = false;
        });
        $(orders).click(function(){
            $(menuPills).find('li').removeClass('active');
            $(this).addClass('active');
            self.openTabs = 'order';
            self.page = 0;
            self.recordCounter();            
            self.changePager(); 
            self.draftExecution = false;
        });
    }

    recordCounter(){
        let self = this;
        $('select#count_record').change(function(sender){
            self.page = 0;
            self.lastCount = self.count;
            self.count = Number(this.value);
            self.changePager();    
        });
    }

    clearList(){
        $('div#list').children().remove();
    }

    pagination(current, pages){
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

    handleNextPage(method, bind){
        this.page++;
        method(this.page, this.count, bind);
        return;
    }

    handlePrevPage(method, bind){
        this.page--;
        method(this.page, this.count, bind);
        return;
    }

    changePager(){
        let self = this;
        let list = self.openTabs;
        const mainPager = $('ul#pager');
        const prev = $(mainPager).find('li.previous')[0];
        const next = $(mainPager).find('li.next')[0];
        $(prev).unbind('click');
        $(next).unbind('click');
        switch (list){
            case 'catalog':
                $(prev).click(function(){
                    self.handlePrevPage(self.car.getCars, self.car)});
                $(next).click(function(){
                    self.handleNextPage(self.car.getCars, self.car)});
                self.car.getCars(self.page, self.count, self.car);
                break;
            case 'order':
                $(prev).click(function(){
                    self.handlePrevPage(self.order.getOrders, self.order)});
                $(next).click(function(){
                    self.handleNextPage(self.order.getOrders, self.order)});
                self.order.getOrders(self.page, self.count, self.order);
                break;
        }
    }

    addToListException(err){
        this.clearList();
        this.page = 0;
        let template = $(this.errorTemplate).clone();
        $(template).find('span.status_code').text(err.status);
        $(template).find('span.error_msg').text(err.responseText);
        $('div#list').append(template);
        return;
    }


    fillDraftPanel(panel, car){
        let self = this;

        let inputValidator = function(input_id, msg){
            let data = self.ConvertStringToDate($(panel).find('input#' + input_id).val());
            if (!data){
                $(panel).find('input#'+input_id).focus();
                $(panel).find('span.dateErr').text(msg);
                return;
            } else {
                $(panel).find('span.dateErr').text('');   
            }
        }
        $(panel).find('button.btn_close').click(function(){
            $(panel).remove();
            self.draftExecution = false;
        });
        $(panel).find('h2.title').text("Оформление заказа");
        $(panel).find('span.manufacture').text(car.Manufacturer);
        $(panel).find('span.model').text(car.Model);
        $(panel).find('span.type').text(car.Type);
        $(panel).find('span.cost').text(car.Cost);
        $(panel).attr('carId', car.id);
        $(panel).find('input#startDate').focusin(function(){
            $(panel).find('span.dateErr').text('');
        });
        $(panel).find('input#startDate').focusout(function(){
            inputValidator('startDate','Неправильная дата начала аренды');
        });
        $(panel).find('input#endDate').focusin(function(){
            $(panel).find('span.dateErr').text('');
        });
        $(panel).find('input#endDate').focusout(function(){
            inputValidator('endDate','Неправильная дата окончания аренды');
        });

        $(panel).find('button.btn_submit').click(function(){
            let form = $('form#draft_order');
            const data = {
                userID      : self.checkID('59f634f54929021fa8251644'),
                carID       : self.checkID($(panel).attr('carId')),
                startDate   : self.ConvertStringToDate($(form).find('input#startDate').val()),
                endDate     : self.ConvertStringToDate($(form).find('input#endDate').val())
            };
            if (!data.userID){
                $(panel).find('span.dateErr').text('Невереный UserID');
                return;
            }
            if (!data.carID){
                $(panel).find('span.dateErr').text('Неверный CarID');
                return;
            }
            if (!data.startDate){
                $(panel).find('input#startDate').focus();
                $(panel).find('span.dateErr').text('Неправильная дата начала аренды');
                return;
            }
            if (!data.endDate){
                $(panel).find('input#endDate').focus();
                $(panel).find('span.dateErr').text('Неправильная дата окончания аренды');
                return;
            }
            const url = '/aggregator/orders/';
            $.post(url, data)
                .done(function(res){
                    $(panel).find('.start_date').text(res.Lease.StartDate);
                    $(panel).find('.end_date').text(res.Lease.EndDate);
                    $(panel).find('.content').remove();
                    $(panel).find('.button_field').remove();
                    $(panel).attr('resID', res.ID);
                    $(panel).find('button.btn_confirm').click(function(){
                        const id = self.checkID($(panel).attr('resID'));
                        if (id){
                            const url = '/aggregator/orders/confirm/' + id;
                            let req = new XMLHttpRequest();
                            req.open('PUT', url, true);
                            req.onreadystatechange = function(){
                                if (req.readyState != 4)
                                    return;
                                if (req.status == 200){
                                    alert('successfully');
                                    $(panel).remove();
                                    self.draftExecution = false;
                                } else {
                                let res = req.responseText;
                                    alert(req.status);
                                }
                            }
                            req.send();
                        }
                    });
                    $(panel).find('div.hidden').removeClass('hidden');

                })
                .fail(function(res){
                    alert(res.status);
                });
        });
    }

    createDraftOrder(car){
        if (!this.draftExecution){
            let panel = $(this.order.draft).clone();
            this.fillDraftPanel(panel, car);
            this.draftExecution = true;
            $('body').append(panel);
        }
        else {
            let panel = $('div#draft_panel');
            this.fillDraftPanel(panel, car);
        }
    };
};

$(document).ready(function(){
    Menu = new menu();
});