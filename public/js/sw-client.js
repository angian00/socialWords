'use strict';


var swApp = angular.module('swApp', [
	'swControllers',
	'swServices'
]).config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});


var swServices = angular.module('swServices', ['ngResource', 'ngCookies']);
swServices.factory('User', ['$resource',
    function($resource) {
        // return $resource('/api/users/:userId', {}, {
        //  query: {method:'GET', params:{userId:'users'}, isArray:true}
        // });
        return $resource('/api/users/:userId');
}]);

swServices.factory('Contact', ['$resource',
    function($resource) {
        return $resource('/api/contacts');
}]);


swServices.factory('authentication',
    ['Base64', '$http', '$cookies', '$rootScope', '$timeout',
    function (Base64, $http, $cookies, $rootScope, $timeout) {
        var service = {};
 
        service.Login = function (email, password, callback) {
 
        	$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(email + ':' + password);

            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            // $timeout(function() {
            //     var response = { success: email === 'test@test' && password === 'test' };
            //     if (!response.success) {
            //         response.message = 'Username or password is incorrect';
            //     }
            //     callback(response);
            // }, 1000);
 
 
            /* Use this for real authentication
             ----------------------------------------------*/
            $http.post('/auth', { email: email, password: password })
                .success(function (response) {
                    callback(response);
                });
 
        };
  
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
  
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $cookies.globals = $rootScope.globals; //until Angular 1.3.x
            //$cookies.put('globals', $rootScope.globals); //since Angular 1.4
        };
  
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            delete $cookies.globals; //until Angular 1.3.x
            //$cookies.remove('globals');  //since Angular 1.4
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
  
        return service;
}]);
  

swServices.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
        },
  
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
  
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
  
                output = output + String.fromCharCode(chr1);
  
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
  
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
  
            } while (i < input.length);
  
            return output;
        }
    };
});


var swControllers = angular.module('swControllers', []);

swControllers.controller('LoginCtrl', ['$scope', '$location', 'authentication',
	function($scope, $location, authentication) {
		authentication.ClearCredentials();

        $scope.login = function () {
            $scope.dataLoading = true;
            authentication.Login($scope.email, $scope.password, function(response) {
            	$scope.dataLoading = false;
                if (response.success) {
                    authentication.SetCredentials($scope.email, $scope.password);
                    $location.path('userHome');
                    //$location.absUrl('http://google.com');
                    //$scope = angular.element(document).scope();
					//$scope.$apply();

                } else {
                    $scope.error = response.message;
                    // $scope.dataLoading = false;
                }
            });
        };
}]);


swControllers.controller('UserHomeCtrl', ['$scope', 'User', 'Contact',
	function($scope, User, Contact) {
        //$scope.viewer is assigned through ng-init

        $scope.contacts = Contact.query();
        $scope.messages = [];

}]);


// swControllers.controller('UserListCtrl', ['$scope', 'User',
// 	function($scope, User) {
// 		$scope.users = User.query();
// }]);


// swControllers.controller('UserDetailCtrl', ['$scope', '$routeParams', 'User',
// 	function($scope, $routeParams, User) {
// 		$scope.user = User.get({userId: $routeParams.userId}, function(user) {
// 			$scope.mainImageUrl = user.images[0];
// 		});
// }]);
