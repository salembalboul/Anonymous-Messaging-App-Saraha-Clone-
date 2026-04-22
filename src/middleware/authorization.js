export const authorization = (accessRoles = []) => {
  return (req, res, next) => {
    const userRole = req.user;
    if (!accessRoles.includes(userRole?.role)) {
      throw new Error("user not authorized", { cause: 401 });
    }
    return next();
  };
};
