DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(100) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Alchemist", "Books", 13.99, 50),
("Facial Toner", "Beauty", 8.99, 10),
("Ray Bans", "Accessories", 200.00, 2),
("Organic Protein Powder", "Grocery", 25.99, 45),
("Toy Story", "Movies", 17.50, 13),
("The Goldfinch", "Books", 12.00, 100),
("Oat Milk", "Grocery", 5.99, 35),
("Hair Dryer", "Appliances", 70.00, 12),
("Nike Running Shorts", "Clothing", 35.00, 5),
("Scotch Tape", "Office", 3.55, 20);