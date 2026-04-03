import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <div>
    <h1>Boreal Financial</h1>
    <button id="applyBtn">Apply Now</button>
  </div>
`;

document.getElementById("applyBtn")?.addEventListener("click", () => {
  window.location.href = "https://client.boreal.financial";
});
