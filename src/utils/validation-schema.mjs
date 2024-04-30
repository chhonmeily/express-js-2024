export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be 5 characters with a max of 32 characters",
    },
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
    isString: {
      errorMessage: "Username must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display Name must not be empty",
    },
  },
  password: {
    notEmpty: true,
  },
};

export const filterUserValidationSchema = {
  filter: {
    in: ["query"],
    optional: {
      checkFalsy: true,
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Must be at least 3-10 character.",
    },
    isString: {
      errorMessage: "Filter Username must be string",
    },
    notEmpty: {
      errorMessage: "Must not be empty",
    },
  },
};
