module.exports = function (plop) {
  plop.setGenerator('page', {
    description: 'Create a new Next.js TypeScript page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the page?',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'pages/{{kebapCase name}}.tsx',
        templateFile: 'plop-templates/next.page.hbs',
      },
    ],
  });
};
