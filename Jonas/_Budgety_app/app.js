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
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
      /*
      0
      [200, 400, 100]
      sum = 0 + 200
      sum = 200 + 400
      sum = 600 + 100 = 700
      */
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      // [1,2,4,6,8], next ID = 9
      // ID = last ID + 1

      // Membuat ID baru buat var data
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id+1;
      } else {
        ID = 0;
      }

      // Membuat item baru berdasarkan type 'inc' atau 'exp'
      if(type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val)
      }

      // push (insert) data dari form input add description ke var data
      data.allItems[type].push(newItem);

      // return the new element
      return newItem;
    },
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of income that we spent
      // Pakai if else supaya tidak dibagi dengan nol
      // expense = 100 and income = 200, spent 50% = 100/200 = 0.5 * 100
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

    },
    // make public
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function () {
      console.log(data);
    }
  };
})();


// UI CONTROLLER
var UIController = (function() {
  // Create css class object
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  }

  // return supaya bisa diakses oleh function yg lain di outer scope
  return {
    // capture input data
    getInput: function() {
      // baca value yg ada di input tag
      // Return 3 values at the same time, return an object containing these 3 as properties
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp (dari select option value di index.html)
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
      html = '<div class="item clearfix" id="expense--%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the placeholder text with some actual data
      // obj.id ambil dari budgetCtrl Expense
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // Insert the HTML index.html ke dalam income__list tag atau expenses__list tag
      // developer.mozilla.org/en-US/docs/WEB/API/Element/InsertAdjacentHTML
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;
    // querySelectorAll output is a list, not an array
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      // Convert list to an array
      fieldsArr = Array.prototype.slice.call(fields);

      // Loop through Array, delete isinya setelah selesai add description
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });

      // Cursor focus balik ke field pertama
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      // Setting dan menampilkan persentase (%)
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }

    },
    // Exposing DOMstrings object into the public
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

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
  var setupEventListeners = function() {
    // Get DOMstrings from the UI controller
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // listen for keyboard EVENT on the document level
    document.addEventListener('keypress', function(event) {
      // Detect if the Enter button is pressed
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

 // Menghitung dan dan menampilkan income/expenses
  var updateBudget = function () {
    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    var budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  // Action when users hit the button
  var ctrlAddItem = function() {
    var input, newItem;

    // 1. Get the field input data
    input = UICtrl.getInput();
    // console.log(input);

    if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget CONTROLLER
      // addItem return an object
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear the fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();
    }
  };

  return {
    init: function () {
      console.log('Aplication started');
      // Set all the value to 0
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

// Initialize setupEventListeners function
controller.init();
