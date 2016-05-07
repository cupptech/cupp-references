describe('Directives', function(){
    var $compile, $rootScope, $scope;

    beforeEach(module('app'));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
    }));

	describe('remote validator', function(){
        var inputElement;
        beforeEach(inject(function () {
            $scope.validate = function (value) { };
            inputElement = "<form name='testForm'><input type='text' name='unique' ng-model='name' remote-validator='unique' remote-validator-function='validate(value)' /></form>";
        }));

        it("should fail if ng-model not defined.", function () {
            expect($compile("<div remote-validator='unique' remote-validator-function='validate(value)'></div>")).toThrow();

        });

        it('should load the directive without error', inject(function($httpBackend){
            $compile(inputElement)($scope);
        	$httpBackend.expectGET('partials/workout/start.html').respond(200);
        }));


        it("should verify unique value when use input changes", inject(function ($q, $httpBackend) {
            spyOn($scope, "validate").and.returnValue($q.when(true));
            $compile(inputElement)($scope);
        	$httpBackend.expectGET('partials/workout/start.html').respond(200);
            $scope.testForm.unique.$setViewValue("dummy");
            expect($scope.validate).toHaveBeenCalled();
        }));

	});
});