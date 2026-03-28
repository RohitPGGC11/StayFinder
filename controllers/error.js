exports.error404 = (req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "404 error",
    currentpage: "404",
    isLoggedIn:req.isLoggedIn,
    user:req.session.user,
  });
};
