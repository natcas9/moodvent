BEGIN TRANSACTION;
INSERT INTO "Eventos" ("id","nombre","descripcion","fecha","hora","lugar","precio","estadoAnimo","tematica") VALUES (3,'Nat','test','2025-04-08','01:40','CDMX',778.0,'Enojado',NULL);
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (1,'Nat','Cas',22,'test@cas.es','Lun','$2b$10$ijUgjGKgVbbxCfpkIPU3kO48VhUes8AsGwITlgpWhh8uF43dRDq4m','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (2,'Nat','Cas',22,'test@test.com','nats','$2b$10$1bABL7jAooq9kbD6lTx5Ju7K55bFrw4XjXtqEx5uYXSxDJoAtMq/2','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (3,'Nat','Cas',5,'lunsa@gmail.com','n','$2b$10$1s7YQGCJO5wIHyYBYmeiuedTlYfltXG0Ctk44n1OEoE.xvWbFyCL6','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (4,'Nat','Cas',34,'test@gmail.com','nati','$2b$10$89XpGM4Wji3wGf80uQTLFOTKkwri4L61rYa4telSD.wo1Y2I2erqS','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (5,'Test','Cas',1,'lunsa9@gmail.com','lun9','$2b$10$UUokKw1an.hd6qlC3F5m3.BE8sWwrLNO5703cFQ8knBSFDYuCU0jq','user');
INSERT INTO "usuarios" ("id","nombre","apellido","edad","email","username","password","role") VALUES (9,'Admin','Moodvent',30,'admin@moodvent.com','admin','$2b$10$Sw4hKUpDgaa.JYb/FpGFQeTIebAxa0dchLs30ztPYuK8vSTO7vawO','admin');
COMMIT;
