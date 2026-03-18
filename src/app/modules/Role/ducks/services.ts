export const exampleService = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 99,
        name: "Example name",
        email: "exampleg@alghurair.com",
      });
    }, 3000);
  });
};
