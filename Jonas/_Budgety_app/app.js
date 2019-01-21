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
    this.percentage = -1;
  };

  // Menghitung persentase expenses
  Expense.prototype.calculatePercentage = function (totalIncome) {
    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }  
  }; 

  // return persentase expenses
  Expense.prototype.getPercentage = function() {
    return this.percentage;
  }

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

    // Delete item di array
    deleteItem: function(type, id) {
      var ids, index;

      // id = 6
      // data.allItems[type][id];
      // ids = [1,2,4,6,8];
      // index = 3

      // map: method to loop over an array
      // get the ID of all the array
       ids = data.allItems[type].map(function(current) {
        return current.id;
       });

       // Get the index of the id in the array
       index = ids.indexOf(id);

       // splice: method to remove elements from an array
       // remove element jika indexnya ada
       if (index !== -1) {
         data.allItems[type].splice(index, 1);
       }
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

    // Menghitung persentase expenses
    calculatePercentages: function () {
      /*
      a=20
      b=10
      c=40
      income=100
      a=20/100=20%
      b=10/100=10%
      c=40/100=40%
      */
      data.allItems.exp.forEach(function (cur) {
        cur.calculatePercentage(data.totals.inc); // calculatePercentage dari prototype Expense
      });
    },

    // Get persentase expenses
    getPercentages: function () {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
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
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    /* 
    + or - before number
    exactlt 2 decimal points
    comma separating the thousands

    2310.4567 -> 2,310.46
    2000 -> + 2,000.00
    */
    var numSplit, int, dec, type;

    num = Math.abs(num);
    // Set num jadi 2 desimal angka di belakang koma
    num = num.toFixed(2);

    // Split num jd desimal
    numSplit = num.split('.');

    // Add koma utk angka ribuan, pakai substr utk memilih angka awal
    int = numSplit[0];
    if (int.length > 3) {
      // input 23510, output 23,510
      int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    // Add tanda - atau + di depan angka dan tanta titik untuk desimal
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
      }

      // Replace the placeholder text with some actual data
      // obj.id ambil dari budgetCtrl Expense
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML index.html ke dalam income__list tag atau expenses__list tag
      // developer.mozilla.org/en-US/docs/WEB/API/Element/InsertAdjacentHTML
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    // Delete element from the UI
    deleteListItem: function(selectorID) {
      // Untuk delete element, kita harus move up to the parent, abis itu delete childnya
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      // Setting dan menampilkan persentase (%)
      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }

    },

    // Menampilkan persentase expenses di UI
    displayPercentages: function(percentages) {
      // Get the percentage using querySelectorAll will return node list
      // gunakan foreach function to loop inside the node list
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        if(percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }       
      });
    },

    // Display date
    displayMonth: function() {
      var now, months, month,year;
      now = new Date();
      months = ['Jan', 'Feb', 'March', 'Apr', 'May', 'June', 'July', 'August', 'Sept', 'Oct', 'Nov', 'Dec'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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

    // Listener to Add data 
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // listen for keyboard EVENT on the document level
    document.addEventListener('keypress', function(event) {
      // Detect if the Enter button is pressed
      if(event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    // Listener to Delete data.
    // Target ke container class yng berisi data income dan expenses 
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
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

  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  };

  // Action buat add item
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

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  // Action buat DELETE income atau expenses
  // Use event element to identify the target
  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1 -> ('inc', '1')
      splitID = itemID.split('-');
      type = splitID[0];
      // IDnya dalam bentuk string, maka di parseInt
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget
      updateBudget();

      // 4. Calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('Aplication started');
      UICtrl.displayMonth();
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
