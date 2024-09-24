import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const GREEN_COLOR = "\x1b[32m";
const RED_COLOR = "\x1b[31m";
const RESET_COLOR = "\x1b[0m";

export async function handleConfig(): Promise<void> {
  const projectRoot = path.join(__dirname, "..");
  const migrationsDir = path.join(projectRoot, "migrations");

  try {
    // Undo all migrations before clearing the directory
    console.log(`${GREEN_COLOR}Reverting all applied migrations...${RESET_COLOR}`);
    execSync(`npx sequelize-cli db:migrate:undo:all`, {
      stdio: "inherit",
      cwd: projectRoot,
    });
    console.log(`${GREEN_COLOR}All migrations have been reverted.${RESET_COLOR}`);

    // Clear the migrations directory
    if (fs.existsSync(migrationsDir)) {
      fs.readdirSync(migrationsDir).forEach((file) => {
        const filePath = path.join(migrationsDir, file);
        fs.unlinkSync(filePath);
      });
      console.log(`${GREEN_COLOR}Migrations directory cleared.${RESET_COLOR}`);
    } else {
      fs.mkdirSync(migrationsDir);
      console.log(`${GREEN_COLOR}Migrations directory created.${RESET_COLOR}`);
    }

    console.log("Generating migrations...");

    // Capture the list of migration files before generation (should be empty after clearing)
    const filesBefore = fs.readdirSync(migrationsDir);

    execSync(`npm run generate:migrations`, {
      stdio: "inherit",
      cwd: projectRoot,
    });

    console.log(
      `${GREEN_COLOR}Migrations generated successfully.${RESET_COLOR}`
    );

    // Capture the list of migration files after generation
    const filesAfter = fs.readdirSync(migrationsDir);

    // Determine the new files by comparing before and after lists
    const newFiles = filesAfter.filter((file) => !filesBefore.includes(file));

    // Filter the files related to the selected plugin
    const pluginFiles = newFiles.filter((file) => file.includes(`create-`));

    if (pluginFiles.length > 0) {
      console.log(`${GREEN_COLOR}Created migration files:${RESET_COLOR}`);
      pluginFiles.forEach((file) => {
        console.log(`${GREEN_COLOR}- ${file}${RESET_COLOR}`);
      });
    } else {
      console.log(
        `${RED_COLOR}No new migration files were created for plugin ''.${RESET_COLOR}`
      );
    }

    // Apply all pending migrations
    console.log(
      `${GREEN_COLOR}Applying all pending migrations...${RESET_COLOR}`
    );

    execSync(`npx sequelize-cli db:migrate`, {
      stdio: "inherit",
      cwd: projectRoot,
    });

    console.log(
      `${GREEN_COLOR}All pending migrations applied successfully.${RESET_COLOR}`
    );
  } catch (error: any) {
    console.error(
      `${RED_COLOR}Error during migrations: ${error.message}${RESET_COLOR}`
    );
  }
}
