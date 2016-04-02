module.exports = {
  afterEnd: function(runner) {
    var fs = require('fs');
    console.log(window.__coverage__);
    
    var coverage = runner.page.evaluate(function() {
      return window.__coverage__;
    });

    if (coverage) {
      console.log('Writing coverage to test_phantom/coverage.json');
      fs.write('./test_phantom/coverage.json', JSON.stringify(coverage), 'w');
    } else {
      console.log('No coverage data generated');
    }
  }
};