-- AddForeignKey
ALTER TABLE `publishdatas` ADD CONSTRAINT `publishdatas_publish_id_fkey` FOREIGN KEY (`publish_id`) REFERENCES `publishlogs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
