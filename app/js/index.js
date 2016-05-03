'use strict';
/* Controllers */

var kodespaApp = angular.module('kodespaApp', ['ngRoute']);

kodespaApp.run(['$rootScope', '$route', function($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function() {
        document.title = $route.current.title;
        $rootScope.viewTitle = $route.current.title;
    });
}]);

kodespaApp.config(['$routeProvider', function($routeProvide){
    $routeProvide
        .when('/posts', {
            templateUrl: 'template/posts.html',
            controller: 'PostsListCtrl',
            title: 'Posts'
        })
        .when('/posts/:postId', {
            templateUrl: 'template/post-detail.html',
            controller: 'PostDetailCtrl',
            title: 'Post details'
        })
        .when('/users', {
            templateUrl: 'template/users.html',
            controller: 'UsersListCtrl',
            title: 'Users'
        })
        .when('/users/:userId', {
            templateUrl: 'template/user-detail.html',
            controller: 'UserDetailCtrl',
            title: 'User details'
        })
        .when('/about', {
            templateUrl: 'template/about.html',
            controller: 'AboutCtrl',
            title: 'About'
        })
        .otherwise({
            redirectTo: '/posts'
        })
}]);

//Navigation Active Item Controller
kodespaApp.controller('NavMenuCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.navLinks = [{
        Title: 'posts',
        LinkText: 'Posts'
    }, {
        Title: 'users',
        LinkText: 'Users'
    }, {
        Title: 'about',
        LinkText: 'About'
    }];

    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'posts';
        return page === currentRoute ? 'active' : '';
    };

}]);

//Posts List Controller
kodespaApp.controller('PostsListCtrl', ['$scope', '$http', '$location', 'Connector', function($scope, $http, $location, Connector) {
    var root = 'http://jsonplaceholder.typicode.com';

    $scope.posts = [];

    $scope.range = 5;
    var step = 20;
    $scope.upRange = function() {
        $scope.range += step;
    };

    Connector.getPosts()
        .success(function (data) {
            $scope.posts = data;
        })
        .error(function () {
        });

}]);

//Post Detail Controller
kodespaApp.controller('PostDetailCtrl',
['$scope', '$http', '$location', '$routeParams', 'Connector', function($scope, $http, $location, $routeParams, Connector) {

    var postId = $routeParams.postId;
    $scope.post = {};

    Connector.getPostDetails(postId)
        .success(function(data){
            $scope.post = data;
        })
        .error(function(){

        });

}]);

// Users List Controller
kodespaApp.controller('UsersListCtrl', ['$scope', '$http', '$location', 'Connector', function($scope, $http, $location, Connector) {

    $scope.users = [];

    Connector.getUsers()
        .success(function(data){
            $scope.users = data;
        })
        .error(function(){

        });
}]);

//User Detail Controller
kodespaApp.controller('UserDetailCtrl', ['$scope', '$http', '$location', '$routeParams', 'Connector', function($scope, $http, $location, $routeParams, Connector) {
    var userId = $routeParams.userId;
    $scope.user = {};

    Connector.getUserDetails(userId)
        .success(function(data){
            $scope.user = data;
        })
        .error(function(){

        });

}]);

//About Controller
kodespaApp.controller('AboutCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);

//Http factory
kodespaApp.factory('Connector', ['$http', function($http) {
    var location = 'http://jsonplaceholder.typicode.com';
    return{
        getPosts : function() {
            return $http.get(location + '/posts');
        },
        getPostDetails : function(postId) {
            return $http.get(location + '/posts/' + postId);
        },
        getUsers : function() {
            return $http.get(location + '/users');
        },
        getUserDetails : function(userId) {
            return $http.get(location + '/users/' + userId);
        }
    }
}]);

kodespaApp.directive('loading', ['$http', '$rootScope', function($http, $rootScope) {
    return {
        link: function(scope) {
            $rootScope.$watch(function() {
                return $http.pendingRequests.length > 0;
            }, function(hasPending) {
                if (hasPending) {
                    document.getElementById('preloader').style.display = "block";
                }
                else  {
                    document.getElementById('preloader').style.display = "none";
                }
            });
        }
    };
}]);