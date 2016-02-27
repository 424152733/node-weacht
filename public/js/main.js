requirejs.config({
    baseUrl: '/js',
    paths: {
        jquery: 'libs/jquery/jquery.min',
        bootstrap: 'libs/bootstrap/dist/js/bootstrap.min',
        bootstrapValidator:'libs/bootstrapValidator/dist/js/bootstrapValidator.min',
        bootstrapDatePicker:'libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min',
        bootstrapDatePickerCN:'libs/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN',
        angular: 'libs/angular/angular.min',
        uiRouter: 'libs/angular-ui-router/release/angular-ui-router',
        domReady: 'libs/domReady/domReady',
        eiCtrl: 'controller/elective-information',
        qsCtrl: 'controller/query-score',
        qscCtrl: 'controller/query-schedule',
        csCtrl: 'controller/change-school',
        peCtrl: 'controller/personal-center',
        aaCtrl: 'controller/admin-application',
        selectDirct: 'directive/select-directive',
        modalDirct: 'directive/modal-directive',
        ajaxService: 'service/ajaxService'
    },
    map: {
        '*': {
            'css': 'libs/require-css/css'
        }
    },
    shim: {
        angular:{
            exports: 'angular'
        },
        uiRouter: {
          deps: ['angular'],
          exports: 'uiRouter'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        bootstrapValidator: {
            deps: ['jquery','bootstrap','css!libs/bootstrapValidator/dist/css/bootstrapValidator.min.css'],
            exports: 'bootstrapValidator'
        },
        bootstrapDatePicker: {
            deps: ['bootstrap', 'css!libs/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css'],
            exports: 'bootstrapDatePicker'
        },
        bootstrapDatePickerCN: {
            deps: ['bootstrapDatePicker'],
            exports: 'bootstrapDatePickerCN'
        }
    }
});

//Angular项目启动
require([
    'angular',
    'bootstrap',
    'uiRouter',
    'bootstrapDatePickerCN',
    'app',
    'route',
    'eiCtrl',
    'qsCtrl',
    'csCtrl',
    'peCtrl',
    'qscCtrl',
    'aaCtrl',
    'selectDirct',
    'modalDirct',
    'ajaxService'
], function(angular) {
    angular.bootstrap(document, ['sdApp']);
});



//require(['jquery'], function(){
//    $(function(){
//        //获取验证码
//        $('#verificationCode').click(function() {
//            if($('#username').val() == ''){
//                alert('请输入手机号！');
//                return;
//            }
//            var i = 60;
//            var s = "";
//            var timer =setInterval(function(){
//                --i;
//                s = "重新获取("+i+")";
//                $('#verificationCode').html(s);
//                $('#verificationCode').attr("disabled", "true");
//                if(i == 0){
//                    $('#verificationCode').html('获取验证码');
//                    $('#verificationCode').removeAttr("disabled");
//                    clearInterval(timer);
//                }
//            }, 1000)
//        });
//    });
//});


//我要选课
if(window.location.pathname == '/weixin/selectCourse'){
    require(['jquery', 'bootstrap'], function() {
        $(function() {
            $("#selectCourse").click(function() {
                if($(this).text() == "我要选课") {
                    $("#selectCourse").html('选课成功，再次点击取消选课')
                }else if($(this).text() == "选课成功，再次点击取消选课") {
                    $("#selectCourse").html('我要选课')
                }
            });

            $(".select-btn1").click(function() {
                $('#selectSuccess').modal('show');
            });

            $(".select-btn2").click(function() {
                $('#selectFail').modal('show');
            });
        });
    })
}


