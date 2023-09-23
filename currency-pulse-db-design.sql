CREATE TABLE `users` (
  `id` varchar(255) PRIMARY KEY,
  `email` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `notifications` (
  `id` varchar(255) PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status` boolean,
  `created_at` timestamp
);

CREATE TABLE `currencies` (
  `id` varchar(255) PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `value` float NOT NULL,
  `created_at` timestamp
);

CREATE TABLE `alarms` (
  `id` varchar(255) PRIMARY KEY,
  `currency_name` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `rate` float NOT NULL,
  `current_gold_rate` float NOT NULL,
  `target_rate` float NOT NULL,
  `ten_percent_notification_id` varchar(255),
  `ten_percent_rotation_notification_id` varchar(255),
  `target_notification_id` varchar(255),
  `created_at` timestamp
);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `alarms` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `alarms` ADD FOREIGN KEY (`ten_percent_notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE;

ALTER TABLE `alarms` ADD FOREIGN KEY (`ten_percent_rotation_notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE;

ALTER TABLE `alarms` ADD FOREIGN KEY (`target_notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE;
