function HadoopLogsListCtrl($scope) {
  $scope.logs = [
  {
    name: 'log1',
    tags: [{name: 'tag1'},{name: 'tag3'}]
  },
  {
    name: 'log2',
    tags: [{name: 'tag1'},{name: 'tag2'}]
  },
  
  ];
}
// Voting / viewing poll results
function HadoopLogsItemCtrl($scope, $routeParams) {
  $scope.log = {};
}
// Creating a new poll
function HadoopLogsNewCtrl($scope) {
  $scope.logs = {
  };
  $scope.createLogs = function() {};
}
