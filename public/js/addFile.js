$(function() {
  $(".lined").linedtextarea();
});

window.addEventListener("scroll", () => {
  scrollTo(0, 0);
});

function send() {
  let code = document.getElementById("code");
  let title = document.getElementById("title");
  if (title.value.length < 2) return alert("Your title length is less than 2!");
  if (code.value.length < 3) return alert("Your code length is less than 3!");
  code = code.value.replace(/\n/gm, "<br/>");
  window.location.replace(`/api/add/${title.value}?code=${code}`);
}
