import * as $CB from '../../src/utils/CallbackUtils';


describe('general callback util tests - ', () => {
  
  test(
    'should throw an error it trying to execute something else than a function',
    () => {
      let funcArray = [undefined];
      expect($CB.execCallbacks.bind($CB, funcArray)).toThrowError('Provided callback is not a function.');
    }
  );
  

  test('should execute an array of callback functions', () => {
    let scope = {
      msg_a: "",
      msg_b: ""
    };
    let funcArray = [];
    funcArray.push( function( context ) {
      context["msg_a"] = "Hello from func A.";
    });
    funcArray.push( function( context ) {
      context["msg_b"] = "Hello from func B.";
    });
    $CB.execCallbacks(funcArray, scope);
    expect(scope.msg_a).toBe("Hello from func A.");
    expect(scope.msg_b).toBe("Hello from func B.");
  });

});