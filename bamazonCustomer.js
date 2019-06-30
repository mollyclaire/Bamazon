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
    displayItems();

});

// Function to display the product items in the terminal window.
function displayItems() {
    console.log("\nId" + " | " + "Product" + " | " + "Department" + " | " + "Price" + " | " + "Quantity")
    console.log("---------------------------------------------");
    // Retrieveing data from the database table.
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(
                res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("---------------------------------------------");
    });

} askBuyer();

// Function to ask the user if they want to purchase an item.
function askBuyer() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What product (id) would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (response) {
            var itemID = response.id;
            var itemQuantity = response.quantity;
            connection.query("SELECT * FROM products WHERE ?", [{
                item_id: itemID
            }],
                function (err, chosenItem) {
                    if (err) throw err;
                    if (chosenItem[0].stock_quantity - itemQuantity >= 0) {
                        var total = itemQuantity * chosenItem[0].price;
                        console.log('You will be charged $' + total + '. Thank you!');
                        connection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [chosenItem[0].stock_quantity - itemQuantity, itemID],
                            function (err) {
                                if (err) throw err;
                                startOver();
                            })
                    } else {
                        console.log("Insufficient quantity.  Please adjust your order, we only have " + chosenItem[0].stock_quanity + "of " + chosenItem[0].product_name + "in stock.");
                        startOver();

                    }

                })

        })

}

// Function to reset.
function startOver() {
    inquirer
        .prompt([
            {
                name: "startOver",
                type: "list",
                choices: ["Yes", "No"],
                message: "Would you like to place another order?"

            }
        ]).then(function (response) {
            if (response.startOver === "Yes") {
                displayItems();
                askBuyer();
            } else {
                console.log("Thank you and have a great day!")
                connection.end();
            }
        })
}




