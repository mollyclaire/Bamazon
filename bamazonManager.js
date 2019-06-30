// Requiring both the mysql and inquirer packages in order to run the program.
var mysql = require("mysql");
var inquirer = require("inquirer");

// Establishing connection with database.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    displayMenu();

});

// Function to display the options for the manager.
function displayMenu() {
    inquirer
        .prompt([
            {
                name: "userChoice",
                type: "list",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
                message: "What would you like to do?"
            }
        ]).then(function (response) {
            if (response.userChoice == "View Products for Sale") {
                displayItems();
            } else if (response.userChoice == "View Low Inventory") {
                displayLow();
            } else if (response.userChoice == "Add to Inventory") {
                addInventory();
            } else if (response.userChoice == "Add New Product") {
                addProduct();
            }
        })
}

// Function to display the items if "View Products for Sale" is selected.
function displayItems() {
    console.log("\nId" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity")
    console.log("---------------------------------------------");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            console.log("---------------------------------------------");
        }
        startOver();
    });

}

// Function to display the items if "View Low Inventory" is selected.
function displayLow() {
    console.log("\nId" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity")
    console.log("-----------------------------------");
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            console.log("---------------------------------------------");
        }
        startOver();
    });

}

// Function to ask the manager if they would like to choose a different action.
function startOver() {
    inquirer
        .prompt([
            {
                name: "startOver",
                type: "list",
                choices: ["Yes", "No"],
                message: "Would you like to do something else?"

            }
        ]).then(function (response) {
            if (response.startOver === "Yes") {
                displayMenu();
            } else {
                console.log("Thank you and have a great day!")
                connection.end();
            }
        })
}

// Function to ask the manager if they would like to add more of a certain product to the inventory.
function addInventory() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the item id of the product you would like to add more of?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How much would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]).then(function (response) {
            var itemQuantity = response.quantity;
            var itemID = response.id;
            // Changing the quantity in the database where the manager specifies (id).
            connection.query("SELECT * FROM products WHERE ?", [{
                item_id: itemID
            }],
                function (err, chosenItem) {
                    if (err) throw err;
                    connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [chosenItem[0].stock_quantity + itemQuantity, itemID],
                        function (err) {
                            if (err) throw err;
                            console.log("You now have " + chosenItem[0].stock_quantity + itemQuantity + " of " + chosenItem[0].product_name);
                            startOver();
                        })
                }
            )
        })

}

// Function to ask the manager if they'd like to add a product to the store.
function addProduct() {
    inquirer
        .prompt([
            {
                name: "product",
                type: "input",
                message: "What is the name of the product would you like to add?",
                validate: function (value) {
                    if (value == null || value == "") {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "department",
                type: "input",
                message: "Enter the name of the department for this product.",
                validate: function (value) {
                    if (value == null || value == "") {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "price",
                type: "input",
                message: "Enter the price per unit.",
                validate: function (value) {
                    if (value == null || value == "") {
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How much of this product would you like to stock?",
                validate: function (value) {
                    if (value == null || value == "") {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        ]).then(function (response) {
            // Adding the manager's input into the database.
            connection.query("INSERT INTO products SET ?", {
                product_name: response.product,
                department_name: response.department,
                price: response.price,
                stock_quantity: response.quantity
            },
                function (err) {
                    if (err) throw err;
                    console.log("Product inserted!");
                    startOver();
                }
            )
        })
}



