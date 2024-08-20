# BlockBoxCRUD-Service

The Schema Generation Application is a tool that generates a schema based on the models in your code. The schema is written in JSON format and can be used for documentation or integration with other tools.

## Installation

1. Clone the repository: `git clone https://github.com/YourLastName/schema-generation-application.git`
2. Navigate to the project directory: `cd schema-generation-application`
3. Install dependencies: `npm install`

## Configuration

To configure the application, you need to create a `models.js` file in the `src/models` directory. In this file, you need to import the models that you want to include in the schema. For example:

```javascript
import Workspace from "./workspace";

export { Workspace };
```

## Running

### Migrations

To generate the models schema, run the following command:

```
npm run generate:schema
```

The models schema will be written to the `models.ts` file in the `const export_path` directory.

### Models schema

To generate the models schema, run the following command:

```
npm run generate:schema
```

The models schema will be written to the `models.ts` file in the `const export_path` directory.
Models was generated from migrations.


## Documentation

The documentation for the application is located in the `README.md` file in the root directory.

## Author

* Last Name: Durtan
* Email: dadmor@gmail.com

I hope this helps! If you have any further questions, feel free to ask.
