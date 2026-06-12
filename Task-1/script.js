const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Change icon
  const icon = toggleBtn.querySelector("i");

  if(document.body.classList.contains("dark")){
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }else{
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
});