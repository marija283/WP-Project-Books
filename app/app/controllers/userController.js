bookProject
.controller('headerCtrl', function ($rootScope, loginService,userProfileService) { 
    $rootScope.loggedIn = loginService.islogged();
    

    //za AUTO COMPELTE
     autocompleteUsers = [];
    userProfileService.getUsers(function(data){
        var people = data;
       
        $(people).each(function(index,item){
            autocompleteUsers.push({
                id:item.id,
                label:item.fname + " "+item.lname,
                date:item.dateCreated
            })
        });
        //console.log(autocompleteUsers);
              $( "#autocomplete").autocomplete({
                        minLength: 0,
                        source: autocompleteUsers,
                        focus: function( event, ui ) {
                          $( "#autocomplete" ).val( ui.item.label );
                          return false;
                        },
                        select: function( event, ui ) {
                            userProfileService.viewUser(ui.item.id);
                   
                          return false;
                        }
                      })
                      .autocomplete( "instance" )._renderItem = function( ul, item ) {
                         var icon = $("<img>").attr("src","http://localhost:8080/book-project/api/users/get-image/"+item.id);
                        icon.attr("style","width:40px; height:40px; float:left; display:block");

                        return $( "<li style='height:50px'>" )
                          .append(icon).append( "<a>" + item.label + "<br>" + "" + "</a>" )
                          .appendTo( ul );
                      };

    });
})

.controller("loginCtrl",[
            '$scope','$http','$state','loginService',
    function($scope, $http, $state,loginService){


        $scope.logIn = function(){
            if ($scope.form.$valid) {


                var fd = new FormData();
                fd.append('username', $scope.username);
                fd.append('password',$scope.password);
                loginService.login(fd, $scope );
            }
        }

 }])
 
 .controller("logoutCtrl",[
            '$scope', '$http', '$state',"loginService",
    function($scope, $http, $state, loginService){
        loginService.logout();
 }])

 .controller("registerCtrl",[
            '$scope','$http','$state','loginService','$rootScope',
    function($scope,$http, $state,loginService,$rootScope){

        var usernames = [];
        loginService.getUsernames(function(data){
            usernames = data;
        });

        $scope.register = function(){
            console.log(usernames);
            if ($scope.user.password !== $scope.user.confirmPassword && $scope.form.$valid)
            {
                $("#noMatch").show();
                return;
                
            }
                $("#noMatch").hide();
            if (usernames.indexOf($scope.user.username.toLowerCase()) != -1 )
            {
               
                $("#userTaken").show();
                return;
                
            }
                $("#userTaken").hide();
            if ($scope.user.password === $scope.user.confirmPassword && $scope.form.$valid)
            {
               
                
                var fd = new FormData();
                fd.append('username',$scope.user.username);
                fd.append('password',$scope.user.password);
                fd.append('fname',$scope.user.fname);
                fd.append('lname',$scope.user.lname);
                fd.append('biography',"");  
                
                var file = $scope.myFile;
                if(file != null)
                {
                    var fileType = file.type;
                    if( fileType.indexOf("image")!= -1 )
                       fd.append('file', file);
                    else 
                        console.log("Toa ne e slika hhihihi ");
                }
                loginService.register(fd,$scope);
                    
             }
       }
    
 }])

.controller("userProfileEdit",[
            "$scope","$state","userProfileService","loginService","$rootScope",
    function($scope, $state, userProfileService,loginService,$rootScope){
        var user = loginService.isloggedUser();
        $rootScope.loggedIn = loginService.islogged();
        $scope.user = user;

        $scope.save= function(){
            if(user){
                user.lname = $scope.user.lname;
                user.fname = $scope.user.fname;
                user.biography = $scope.user.biography;
                userProfileService.updateProfileInfo(function(data){
                    sessionStorage.setItem("user",JSON.stringify(data));
                }, user);
                $scope.$state = $state;
                $scope.$watch('$state.$current.locals.globals.save', function (user) {
                    $scope.user = user;
                });
                 $state.go("^");
            }
            else
                $state.go("login");
        };

}])

.controller("userProfile",[
            "$scope","$state","userProfileService","loginService","$rootScope",
    function($scope, $state, userProfileService,loginService,$rootScope){
        var user = loginService.isloggedUser();
        $rootScope.loggedIn = loginService.islogged();
        if(user){
            console.log(user.fname);
            $("#profilepic").attr('src', "http://localhost:8080/book-project/api/users/get-image/" + user.id);
            $scope.user = user.fname + " " + user.lname;
            $scope.bio = user.biography;
            $scope.genres = user.genres;
            userProfileService.getFavBooks(function(data){
                    $scope.favbooks = data;
            }, user.id);
        }
        else
            $state.go("login");
}]);


