angular.module('quizApp').controller('quizController', ['$scope', 'Quiz', 'Question', 'quizHelper', 'appMode', 'appInformation', '$timeout', 'takeQuizMode', '$window', '$q', function (
    $scope,
    Quiz,
    Question,
    quizHelper,
    appMode,
    appInformation,
    takeQuizMode,
    $timeout,
    $window,
    $q
) {
    window.quizAppScope = $scope;


    $scope.appMode = appMode;
    $scope.takeQuizMode = takeQuizMode;

    $scope.appInformation = appInformation;

    $scope.quizMode = appMode.STARTAPP;
    $scope.quizLoaded = false;
    $scope.startQuiz = false;


    $scope.quiz = new Quiz();
    $scope.question = new Question();
    $scope.potentialQuestion = null;
    $scope.count = 1;
    $scope.questionLimitExceeded = false;

    $scope.validQuestion = true;

    $scope.clearField = function () {
      $scope.quiz = new Quiz();
        $scope.question = new Question();
    };

    $scope.changeAppMode = function (mode) {
        $scope.quiz = new Quiz();
        $scope.question = new Question();
        $scope.quizMode = mode;
    };

    $scope.addQuiz = function () {
        quizHelper.addQuiz($scope.quiz);
        console.log($scope.quiz);
        if(appMode.CREATEQUIZ){
           $scope.changeAppMode(appMode.ADDQUESTION);
        }
    };

    $scope.addQuestion = function () {
        $scope.validQuestion = quizHelper.checkValidQuestion($scope.question);
        $('#selectionError').text("");
        if (!$scope.validQuestion) {
            return ;
        }
        if ($scope.question.answer === 0) {
            $scope.validQuestion = false;
            $('#selectionError').text("Select Correct Answer");
            return;
        }

        quizHelper.sendQuestion($scope.question);
        if ($scope.count < $scope.quiz.questionLength && $scope.question.answer !== 0) {
            $scope.count++;
            $scope.question = new Question();
        } else {
            $scope.questionLimitExceeded = true;
            quizHelper.addQuestionToQuiz($scope.quiz);
            $scope.changeAppMode(appMode.SUCCESSQUIZ);
        }
    };

    $scope.buildQuiz = function () {
        quizHelper.saveQuizToJSON($scope.quiz);
    };


    $scope.printQuestion = function () {
        $scope.potentialQuestion = quizHelper.jsonToParse();
        console.log($scope.quiz);
    };

    $scope.openQuizToTake = function () {
        $('#open-file').click().change(function (data) {
            var reader = new FileReader();
            reader.onload = function () {
                quizHelper.loadQuiz(reader.result);
                console.log($scope.quiz);
                if ($scope.quiz.quizName !== "") {
                    $scope.quizLoaded = true;
                    $scope.$digest();
                    console.log($scope.quiz);
                }
            };
            reader.readAsText(data.target.files[0], "text/json;charset=utf-8");
        });

    };


    $scope.letStartQuiz = function () {

    }

}]);