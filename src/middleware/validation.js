export const validation = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    for (const element of Object.keys(schema)) {
      const { error } = schema[element].validate(req[element], {
        abortEarly: false,
      });
      if (error) {
        validationErrors.push(...error?.details);
      }
      if (validationErrors.length) {
        return res.status(400).json({ error: validationErrors });
      } else {
        return next();
      }
    }
  };
};
