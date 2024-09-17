import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1726552861804 implements MigrationInterface {
  name = ' $npmConfigName1726552861804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "statistics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "advertisement_id" uuid NOT NULL, CONSTRAINT "PK_c3769cca342381fa827a0f246a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh-tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_accounttype_enum" AS ENUM('base_account', 'premium_account')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('BUYER', 'SELLER', 'MANAGER', 'ADMINISTRATOR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "bio" text, "image" text, "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'base_account', "roles" "public"."users_roles_enum" NOT NULL DEFAULT 'BUYER', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."advertisements_status_enum" AS ENUM('active', 'blocked', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."advertisements_region_enum" AS ENUM('Vinnytsia', 'Volyn', 'Dnipropetrovsk', 'Donetsk', 'Zhytomyr', 'Zakarpattia', 'Zaporizhia', 'Ivano-Frankivsk', 'Kyiv', 'Kirovohrad', 'Luhansk', 'Lviv', 'Mykolaiv', 'Odesa', 'Poltava', 'Rivne', 'Sumy', 'Ternopil', 'Kharkiv', 'Khmelnytskyi', 'Cherkasy', 'Chernivtsi', 'Chernihiv')`,
    );
    await queryRunner.query(
      `CREATE TABLE "advertisements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "description" text NOT NULL, "body" text NOT NULL, "status" "public"."advertisements_status_enum" NOT NULL DEFAULT 'inactive', "region" "public"."advertisements_region_enum" NOT NULL, "accidents" text NOT NULL, "availability_of_registration" text NOT NULL, "user_id" uuid NOT NULL, "car_id" uuid NOT NULL, CONSTRAINT "REL_b59e960ac0bcfadd97728111d8" UNIQUE ("car_id"), CONSTRAINT "PK_4818a08332624787e5b2bf82302" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car_brands" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "brand_name" text NOT NULL, CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cars_currency_enum" AS ENUM('UAH', 'USD', 'EUR')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cars" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "year" integer NOT NULL, "color" text, "mileage" integer, "prise" integer NOT NULL, "currency" "public"."cars_currency_enum" NOT NULL DEFAULT 'UAH', "image" text, "brand_id" uuid NOT NULL, "availability_of_registration" text, "accidents" text, "model_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_fc218aa84e79b477d55322271b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "car-models" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "model_name" text NOT NULL, "brand_id" uuid NOT NULL, CONSTRAINT "PK_5ead90ac2e06122719417b2bcf9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistics" ADD CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e" FOREIGN KEY ("advertisement_id") REFERENCES "advertisements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh-tokens" ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertisements" ADD CONSTRAINT "FK_6277b5b1c6ac26154f49ba2ef7c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertisements" ADD CONSTRAINT "FK_b59e960ac0bcfadd97728111d86" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_68ce82c97c062f06685a52b3d60" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1" FOREIGN KEY ("model_id") REFERENCES "car-models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" ADD CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "car-models" ADD CONSTRAINT "FK_e38293398d360cdcbf5b18934d3" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "car-models" DROP CONSTRAINT "FK_e38293398d360cdcbf5b18934d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_673bd295e52580c0fb09d0fbbb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_e2c56ee6f05695da6b1abcb01c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cars" DROP CONSTRAINT "FK_68ce82c97c062f06685a52b3d60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertisements" DROP CONSTRAINT "FK_b59e960ac0bcfadd97728111d86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertisements" DROP CONSTRAINT "FK_6277b5b1c6ac26154f49ba2ef7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh-tokens" DROP CONSTRAINT "FK_36f06086d2187ca909a4cf79030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistics" DROP CONSTRAINT "FK_0cdc7b42ed967e68277c73da51e"`,
    );
    await queryRunner.query(`DROP TABLE "car-models"`);
    await queryRunner.query(`DROP TABLE "cars"`);
    await queryRunner.query(`DROP TYPE "public"."cars_currency_enum"`);
    await queryRunner.query(`DROP TABLE "car_brands"`);
    await queryRunner.query(`DROP TABLE "advertisements"`);
    await queryRunner.query(`DROP TYPE "public"."advertisements_region_enum"`);
    await queryRunner.query(`DROP TYPE "public"."advertisements_status_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
    await queryRunner.query(`DROP TABLE "refresh-tokens"`);
    await queryRunner.query(`DROP TABLE "statistics"`);
  }
}
