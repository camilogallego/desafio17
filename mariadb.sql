CREATE SCHEMA `coderhouse` ;

CREATE TABLE `coderhouse`.`products` (
  `idproducts` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `price` DOUBLE NOT NULL,
  `thumbnail` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`idproducts`));

INSERT INTO coderhouse.products(title, price, thumbnail)
VALUES ("Producto 1", 2310.91, ""),
("Producto 2", 9999.99, ""),
("Producto 3", 11500.00, "")