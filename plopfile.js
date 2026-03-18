
const requireField = fieldName => {
    return value => {
      if (String(value).length === 0 ) {
        return fieldName + ' is required'
      }
      return true
    }
  }
  
  module.exports = plop => {
    plop.setGenerator('atom', {
      description: 'Create an atom',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'What is your atom name?',
          validate: requireField('name')
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/app/atoms/{{pascalCase name}}/index.tsx',
          templateFile:
            'plop-templates/Atom/index.tsx.hbs',
        },
        {
          type: 'add',
          path: 'src/app/atoms/{{pascalCase name}}/{{pascalCase name}}.test.js',
          templateFile:
            'plop-templates/Atom/Atom.test.js.hbs',
        },
      ],
    })
    plop.setGenerator('module', {
      description: 'Create a module',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'What is your module name?',
          validate: requireField('name')
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/app/modules/{{pascalCase name}}/index.tsx',
          templateFile:
            'plop-templates/Module/index.tsx.hbs',
        },
        {
          type: 'add',
          path: 'src/app/modules/{{pascalCase name}}/{{pascalCase name}}.test.js',
          templateFile:
            'plop-templates/Module/Module.test.js.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/actions.ts',
          templateFile:
            'plop-templates/Module/duck/actions.ts.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/constants.ts',
          templateFile:
            'plop-templates/Module/duck/constants.ts.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/model.ts',
          templateFile:
            'plop-templates/Module/duck/model.ts.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/reducers.ts',
          templateFile:
            'plop-templates/Module/duck/reducers.ts.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/services.ts',
          templateFile:
            'plop-templates/Module/duck/services.ts.hbs',
        },
        {
          type: 'add',
          path:
            'src/app/modules/{{pascalCase name}}/ducks/types.ts',
          templateFile:
            'plop-templates/Module/duck/types.ts.hbs',
        },
        // {
        //   type: 'add',
        //   path: 'src/app/modules/index.js',
        //   templateFile: 'plop-templates/injectable-index.js.hbs',
        //   skipIfExists: true,
        // },
        // {
        //   type: 'append',
        //   path: 'src/app/modules/index.js',
        //   pattern: `/* PLOP_INJECT_IMPORT */`,
        //   template: `import {{pascalCase name}} from './{{pascalCase name}}';`,
        // },
        // {
        //   type: 'append',
        //   path: 'src/app/modules/index.js',
        //   pattern: `/* PLOP_INJECT_EXPORT */`,
        //   template: `\t{{pascalCase name}},`,
        // },
      ],
    })
    plop.setGenerator('molecule', {
      description: 'Create a molecule',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'What is your molecule name?',
          validate: requireField('name')
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/app/molecules/{{pascalCase name}}/index.tsx',
          templateFile:
            'plop-templates/Molecule/index.tsx.hbs',
        },
        {
          type: 'add',
          path: 'src/app/molecules/{{pascalCase name}}/{{pascalCase name}}.test.js',
          templateFile:
            'plop-templates/Molecule/Molecule.test.js.hbs',
        },
      ],
    })
    plop.setGenerator('page', {
      description: 'Create a page',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'What is your page name?',
          validate: requireField('name')
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/app/pages/{{pascalCase name}}/index.tsx',
          templateFile:
            'plop-templates/Page/index.tsx.hbs',
        },
      ],
    })
  }
  