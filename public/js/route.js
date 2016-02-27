define(['app'], function(app) {
    return app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('unitManagement', {
            url: '/unitManagement',
            templateUrl: '../tpls/unit-management.html'
        }).state('changeSchool', {
            url: '/changeSchool',
            views:{
                '':{
                    templateUrl: '../tpls/change-school/change-school.html'
                },
                'content@changeSchool': {
                    templateUrl: '../tpls/change-school/in-manager.html'
                }
            }
        }).state('changeSchool.outManager', {
            views: {
                'content@changeSchool': {
                    templateUrl: '../tpls/change-school/out-manager.html'
                }
            }
        }).state('changeSchool.inManager', {
            views: {
                'content@changeSchool': {
                    templateUrl: '../tpls/change-school/in-manager.html'
                }
            }
        }).state('adminApplication', {
            url:'/adminApplication',
            views: {
                '':{
                    templateUrl: '../tpls/admin-application/admin-application.html'
                },
                'content@adminApplication': {
                    templateUrl: '../tpls/admin-application/application-transfer.html'
                }
            }
        }).state('adminApplication.applicationTransfer', {
            views: {
                'contents@adminApplication': {
                    templateUrl: '../tpls/admin-application/application-transfer.html'
                }
            }
        }).state('adminApplication.historyTransfer', {
            views: {
                'content@adminApplication': {
                    templateUrl: '../tpls/admin-application/history-transfer.html'
                }
            }
        }).state('courseManagement', {
            url: '/courseManagement',
            views: {
                '': {
                    templateUrl: '../tpls/course-management/course-management.html'
                },
                'content@courseManagement': {
                    templateUrl: '../tpls/course-management/pending-approval.html'
                }
            }
        }).state('courseManagement.pendingApproval', {
            url: '/pendingApproval',
            views: {
                'content@courseManagement': {
                    templateUrl: '../tpls/course-management/pending-approval.html'
                }
            }
        }).state('courseManagement.payment', {
            views: {
                'content@courseManagement': {
                    templateUrl: '../tpls/course-management/pending-payment.html'
                }
            }
        }).state('courseManagement.rejected', {
            views: {
                'content@courseManagement': {
                    templateUrl: '../tpls/course-management/rejected.html'
                }
            }
        }).state('newAssessment', {
            url: '/newAssessment',
            templateUrl: '../tpls/new-assessment/new-assessment.html'
        }).state('photoAudit', {
            url: '/photoAudit',
            templateUrl: '../tpls/photo-audit/photo-audit.html'
        }).state('querySchedule', {
            url: '/querySchedule',
            templateUrl: '../tpls/query-schedule/query-schedule.html'
        })
    })
});