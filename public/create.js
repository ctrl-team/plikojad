const createbtn = document.getElementById("createbtn");
const btn = document.getElementById("btn");
const files_display = document.getElementById("files_display");
const wrapper = document.getElementById("wrapper");
let files = [];

createbtn.addEventListener("click", () => {
  if (wrapper.style.display == "") {
    wrapper.style.display = "flex";
  } else {
    wrapper.style.display = "";
  }
});
btn.addEventListener("click", () => {
  var e = document.getElementById("lang");
  var strUser = e.options[e.selectedIndex].value;
  let title = document.getElementById("title-input");
  let code = document.getElementById("code");
  if (title.value.replace(/ /gm, "").length < 1) return alert("Za krótki tytuł");
  if (code.value.length < 3) return alert("Za krótki kod");
  let reg = new RegExp(title.value, 'gm');
  if(files == reg) {
    alert("Już istnieje taki plik");
    code.value = "";
    title.value = "";
    wrapper.style.display = "";
  }
  else{
  let projectdiv = document.createElement('div')
  
  projectdiv.innerHTML = title.value + `.${strUser}`
  projectdiv.className = 'projectdiv'
  
  files_display.appendChild(projectdiv)
  console.log(projectdiv)
  files += title.value + `.${strUser}\n`
  files_display.innerHTML = `<pre><code>` + files + `</pre></code>`;
  code.value = "";
  title.value = "";
  wrapper.style.display = "";
  }
});
