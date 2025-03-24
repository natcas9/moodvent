BEGIN TRANSACTION;
INSERT INTO "eventos" ("id","nombre","descripcion","fecha","hora","lugar","precio","estadoAnimo") VALUES (1,'test','test','2025-03-21','18:13','Mexico',123.0,'Ansioso');
INSERT INTO "eventos" ("id","nombre","descripcion","fecha","hora","lugar","precio","estadoAnimo") VALUES (2,'Natalia','prueba','2025-03-25','02:48','Mexico',1234.0,'Ansioso');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (1,'test','test2',12,'test1@test.com','test','$2b$10$UZ1KadjPSulRS1DOHtFEeujZfjVT0Eh5OvIxUT9K1BjOowmgYYPHu','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (2,'Natalia','C',23,'test@test.com','natc','$2b$10$XziVM9Zv7pD7sE9hzrMcjeDJJW5S/6A3fA3Tg7KoJg62Y8EDM5KKK','user');
COMMIT;
