CREATE TABLE `journal_days` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`vibe` varchar(32) NOT NULL DEFAULT 'soft',
	`atmospherePrompt` text,
	`journalText` text NOT NULL,
	`reflection` text,
	`sealed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_memories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`journalDayId` int NOT NULL,
	`kind` varchar(24) NOT NULL,
	`title` varchar(180) NOT NULL,
	`caption` text NOT NULL,
	`assetUrl` text,
	`emoji` varchar(16),
	`x` int NOT NULL DEFAULT 0,
	`y` int NOT NULL DEFAULT 0,
	`width` int NOT NULL DEFAULT 0,
	`height` int NOT NULL DEFAULT 0,
	`rotation` int NOT NULL DEFAULT 0,
	`frame` varchar(32) NOT NULL DEFAULT 'polaroid',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `journal_memories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scrapbook_elements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`journalDayId` int NOT NULL,
	`kind` varchar(32) NOT NULL,
	`data` text,
	`x` int NOT NULL DEFAULT 0,
	`y` int NOT NULL DEFAULT 0,
	`scale` int NOT NULL DEFAULT 100,
	`rotation` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scrapbook_elements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`journalDayId` int NOT NULL,
	`title` varchar(240) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiny_moments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`journalDayId` int NOT NULL,
	`kind` varchar(24) NOT NULL,
	`label` varchar(120) NOT NULL,
	`note` text NOT NULL,
	`mediaUrl` text,
	`occurredAt` varchar(32) NOT NULL,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tiny_moments_id` PRIMARY KEY(`id`)
);
