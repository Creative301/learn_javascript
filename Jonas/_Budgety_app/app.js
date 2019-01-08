// module pattern: return an object containing all of the function that we want to be public,
// so, the function that we want to give the outside scope access to

// IIFE create a new scope that's not visible from the outside scope,
// so the variable and function is safe, they can't be access from the outside
/*
var budgetController = (function() {
  var x = 23;
  var add = function (a) {
    return x + a;
  }

  return {
    // publicTest is a method, and it can be access from the outside scope. Outside scope can access the var x and the add function because of Closure from the publicTest method
    publicTest: function(b) {
      return add(b);
    }
  }
})();*/

// BUDGET CONTROLLER
var budgetController = (function() {
  // some code later
})();


// UI CONTROLLER
var UIController = (function() {
  // some code later
})();

// Connecting 2 controller
// Module can receive arguments because they are just function expression, so, we can pass arguments into them. We eill pass the other two module as arguments to te controller, so this controller knows about the other two and connect them
/*
var controller = (function(budgetCtrl, UICtrl) {
  var z = budgetCtrl.publicTest(5);
  return {
    anotherPublic: function() {
      console.log(z);
    }
  }
})(budgetController, UIController);*/

// GLOBAL APP CONTROLLER
// EVENT REFERENCE: developer.mozilla.org/en-US/docs/Web/Events
// KEYCODE REFERENCE: http://keycodes.atjayjo.com/#charcode
var controller = (function(budgetCtrl, UICtrl) {
  var ctrlAddItem = function() {
    // 1. Get the field input data

    // 2. Add the item to the budget CONTROLLER

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
    console.log('it works');
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  // listen for keyboard EVENT on the document level
  document.addEventListener('keypress', function(event) {
    // Detect if the Enter button is pressed
    if(event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
