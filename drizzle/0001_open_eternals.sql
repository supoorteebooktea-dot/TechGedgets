CREATE TABLE `addresses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`street` varchar(255) NOT NULL,
	`number` varchar(20) NOT NULL,
	`complement` varchar(255),
	`city` varchar(100) NOT NULL,
	`state` varchar(2) NOT NULL,
	`zipCode` varchar(10) NOT NULL,
	`isDefault` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`previousStatus` varchar(50),
	`newStatus` varchar(50) NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`subtotal` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`status` enum('pendente_pagamento','pagamento_confirmado','processando','enviado','entregue','cancelado') NOT NULL DEFAULT 'pendente_pagamento',
	`subtotal` decimal(10,2) NOT NULL,
	`shippingCost` decimal(10,2) DEFAULT '0',
	`tax` decimal(10,2) DEFAULT '0',
	`total` decimal(10,2) NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`trackingCode` varchar(100),
	`addressId` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`originalPrice` decimal(10,2),
	`imageUrl` varchar(500),
	`category` varchar(100),
	`stock` int NOT NULL DEFAULT 0,
	`rating` decimal(3,1) DEFAULT '0',
	`reviews` int DEFAULT 0,
	`featured` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
