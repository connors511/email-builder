(function() {
  'use strict';

  angular
    .module('client')
    .filter('nl2br', function(){
        return function(msg,is_xhtml) {
            var is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            var msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
            return msg;
        }
    })
    .filter("sanitize", ['$sce', function($sce) {
      return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
      }
    }])
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $timeout, webDevTec, toastr) {
    var Liquid = require('liquid');
    var vm = this;

    vm.templates = [];

    vm.selectTemplate = function selectTemplate(t) {
      //socket.emit('identify', vm.name);
      vm.current = t;
    };

    vm.create = function create() {
      vm.selectTemplate({name:'', body:''});
    }

    vm.save = function save() {
      console.log("Saving", vm.current)
      vm.templates.push(_.clone(vm.current));
      vm.current = {};
    }

    $scope.$watch('main.current', function render(_new, _old) {
      if (_new && _new.body) {
        _new = _new.body;
      }
      if (!_new || !vm.current.body) {
        vm.preview = '';
        return;
      }

      var obj = { foobar: 'bizbuzz', cheer: true };

      var parseParent = function parseParent(name, child) {
        var tmp = _.clone(obj);
        if (child) {
          tmp.content = child;
        }

        // Find the template
        var t = _.find(vm.templates, {name: name});
        // Parse it
        // var parsed = Liquid.Template.parse(t.body)
        //           .render(tmp);
        var parsed = t.body.replace(/\[\[\s*content\s*\]\]/g, child);

        if (t.parent) {
          return parseParent(t.parent, parsed);
        }
        return parsed;
      }



      try {
        var parsed = Liquid.Template.parse(_new)
                            .render(obj);

        console.log("Rendered", parsed)

        if (vm.current.parent) {
          console.log("Parsing parent")
          parsed = parseParent(vm.current.parent, parsed);
        }

        console.log("Result", parsed)

        vm.preview = parsed;

      } catch (e) {
        console.log("ERR", e)
        vm.preview = e.toString();
      }

    }, true)

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1437508528455;
    vm.showToastr = showToastr;

    activate();

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();
