"use strict";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Workspace } from "../src/models"; // Zakładam, że masz odpowiedni eksport w pliku models/index.ts
import pluralize from "pluralize";

console.log();

const templateName = process.argv[2]; // Nowy parametr
const workspaceSlug = process.argv[3];
const documentSingular = process.argv[4];
const plugin = process.argv[5];

const blueprintPath = path.resolve(path.join(__dirname, "seeders"));
const contentPath = path.resolve(
  plugin
    ? path.join(__dirname, "../src/plugins", plugin, "seeders")
    : path.join(__dirname, "seeders")
);
const seedersPath = path.resolve(path.join(__dirname, "../seeders"));

const ORANGE_COLOR = "\x1b[38;5;214m";
const RESET_COLOR = "\x1b[0m";

// Funkcja odczytująca id dla podanego sluga
const getWorkspaceId = async (slug: string): Promise<string | null> => {
  try {
    const workspace = await Workspace.findOne({ where: { slug } });
    if (workspace) {
      return workspace.id;
    } else {
      console.error(
        `${ORANGE_COLOR}Nie znaleziono workspace dla sluga:${RESET_COLOR}`,
        slug
      );
      return null;
    }
  } catch (err) {
    console.error("Błąd podczas odczytu workspace:", err);
    return null;
  }
};

// Funkcja generująca timestamp w formacie YYYYMMDDHHMMSS
const generateTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

// Funkcja odczytująca zawartość pliku JSON
const loadJsonContent = (fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const main = async () => {
  let workspaceId: string | null = null;

  if (templateName === "crud" || templateName === "page") {
    workspaceId = await getWorkspaceId(workspaceSlug);

    if (!workspaceId) {
      return;
    }
  }

  const timestamp = generateTimestamp();

  let contentList = "";
  let contentCreate = "";
  let contentUpdate = "";
  let contentDelete = "";
  let contentPage = "";

  if (templateName === "crud") {
    try {
      contentList = await loadJsonContent(
        `${contentPath}/${documentSingular}/list.json`
      );
      contentCreate = await loadJsonContent(
        `${contentPath}/${documentSingular}/create.json`
      );
      contentUpdate = await loadJsonContent(
        `${contentPath}/${documentSingular}/edit.json`
      );
      contentDelete = await loadJsonContent(
        `${contentPath}/${documentSingular}/delete.json`
      );
    } catch (err) {
      console.error(
        `${ORANGE_COLOR}Błąd odczytu plików JSON:${RESET_COLOR}`,
        err
      );

      return;
    }
  }

  if (templateName === "page") {
    try {
      contentPage = await loadJsonContent(
        `${contentPath}/${documentSingular}/page.json`
      );
    } catch (err) {
      console.error(
        `${ORANGE_COLOR}Błąd odczytu plików JSON:${RESET_COLOR}`,
        err
      );

      return;
    }
  }

  try {
    // Odczyt pliku źródłowego zgodnie z wybranym szablonem
    fs.readFile(
      `${blueprintPath}/seed-${templateName}-blueprint.js`,
      "utf8",
      (err: NodeJS.ErrnoException | null, data: string) => {
        if (err) {
          console.error("Błąd odczytu pliku:", err);
          return;
        }

        // Zamiana `id`, `workspaceId` i `content` na odpowiednie wartości
        let updatedData = data;
        updatedData = updatedData.replace(/`id1`/g, uuidv4());
        updatedData = updatedData.replace(/`id2`/g, uuidv4());
        updatedData = updatedData.replace(/`id3`/g, uuidv4());
        updatedData = updatedData.replace(/`id4`/g, uuidv4());

        if (templateName === "crud" || templateName === "page") {
          updatedData = updatedData.replace(
            /`workspaceId`/g,
            workspaceId || ""
          );
        }

        updatedData = updatedData.replace(/`singular`/g, documentSingular);
        updatedData = updatedData.replace(
          /`prular`/g,
          pluralize(documentSingular)
        );
        updatedData = updatedData.replace(/`content-list`/g, contentList);
        updatedData = updatedData.replace(/`content-create`/g, contentCreate);
        updatedData = updatedData.replace(/`content-edit`/g, contentUpdate);
        updatedData = updatedData.replace(/`content-delete`/g, contentDelete);
        updatedData = updatedData.replace(/`content-page`/g, contentPage);

        // Zapis do nowego pliku z dodanym timestampem
        fs.writeFile(
          `${seedersPath}/${timestamp}-${templateName}-${workspaceSlug}-${documentSingular}.js`,
          updatedData,
          (err: NodeJS.ErrnoException | null) => {
            if (err) {
              console.error("Błąd zapisu do pliku:", err);
              return;
            }
            console.log(
              `Zawartość została skopiowana do pliku: ${seedersPath}/crud-seeder-${timestamp}.js`
            );
          }
        );
      }
    );
  } catch (err) {
    console.error("Błąd odczytu plików JSON:", err);
  }
};

main();
