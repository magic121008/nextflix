useEffect(() => {
  if (isAuthenticated && !hasAccess) {
    const password = window.prompt("Enter Admin Password");

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_access", "true");
    }
  }
}, [isAuthenticated, hasAccess]);