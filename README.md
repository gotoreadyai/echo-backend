# Echo BACKEND

**Echo BACKEND** helps you generate Sequelize schemas from models, making your integration easier.

## Features

- **Schema Generation:** Automatically create schemas from Sequelize models.
- **Migrations:** Quickly generate Sequelize migrations.
- **Plugins:** Extend functionality with plugins.

## Installation

1. **Clone the Repo:**

   ```bash
   git clone https://github.com/YourLastName/schema-generation-application.git
   ```

2. **Go to Project Directory:**

   ```bash
   cd schema-generation-application
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

## Setup

Create a `models.js` file in `src/models` to list the models you want to include:

```javascript
// src/models/models.js

import Workspace from "./workspace";

export { Workspace };
```

## Usage

### Generate Migrations

Run this command to create Sequelize migrations:

```bash
npm run generate:migrations
```

### Generate Schema

Run this command to create the models schema:

```bash
npm run generate:schema
```

The schema will be saved as `models.ts` in the `const export_path` directory.

## Plugins

Use plugins to add more features to your backend. Check the `plugins` directory for details.

## Author

- **Last Name:** Durtan
- **Email:** dadmor@gmail.com

Got questions? Email me!

