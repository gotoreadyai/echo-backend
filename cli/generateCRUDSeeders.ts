"use strict";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Workspace } from "../src/models"; // Zakładam, że masz odpowiedni eksport w pliku models/index.ts
import pluralize from "pluralize";

const contentPath = path.resolve(path.join(__dirname, "../content"));
const seedersPath = path.resolve(path.join(__dirname, "../seeders"));

const workspaceSlug = process.argv[2];
const documentSingular = process.argv[3];

// Funkcja odczytująca id dla podanego sluga
const getWorkspaceId = async (slug: string): Promise<string | null> => {
  try {
    const workspace = await Workspace.findOne({ where: { slug } });
    if (workspace) {
      return workspace.id;
    } else {
      console.error("Nie znaleziono workspace dla sluga:", slug);
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
  const workspaceId = await getWorkspaceId(workspaceSlug);

  if (!workspaceId) {
    return;
  }

  const timestamp = generateTimestamp();

  try {
    // Wczytaj zawartość plików JSON
    const contentList = await loadJsonContent(
      `${contentPath}/${documentSingular}/list.json`
    );
    const contentCreate = await loadJsonContent(
      `${contentPath}/${documentSingular}/create.json`
    );
    const contentUpdate = await loadJsonContent(
      `${contentPath}/${documentSingular}/edit.json`
    );
    const contentDelete = await loadJsonContent(
      `${contentPath}/${documentSingular}/delete.json`
    );

    // Odczyt pliku źródłowego
    fs.readFile(
      `${contentPath}/seed-crud-blueprint.js`,
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
        updatedData = updatedData.replace(/`workspaceId`/g, workspaceId);
        updatedData = updatedData.replace(/`singular`/g, documentSingular);
        updatedData = updatedData.replace(
          /`prular`/g,
          pluralize(documentSingular)
        );
        updatedData = updatedData.replace(/`content-list`/g, contentList);
        updatedData = updatedData.replace(/`content-create`/g, contentCreate);
        updatedData = updatedData.replace(/`content-edit`/g, contentUpdate);
        updatedData = updatedData.replace(/`content-delete`/g, contentDelete);

        // Zapis do nowego pliku z dodanym timestampem
        fs.writeFile(
          `${seedersPath}/${timestamp}-crud-${workspaceSlug}-${documentSingular}.js`,
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
